// =============================================================
// ArtCyc Coach — KI-Chat-Edge-Function (OpenRouter-Variante)
// =============================================================
//
// Wechsel: vorher direkt an Anthropic, jetzt via OpenRouter. Default-
// Modell ist `google/gemini-2.0-flash` — ~10× günstiger als Claude
// Haiku 4.5. Modell lässt sich per OPENROUTER_MODEL Env-Var ohne Code-
// Änderung wechseln (z. B. auf `openai/gpt-4o-mini`,
// `anthropic/claude-haiku-4.5`, `meta-llama/llama-3.3-70b-instruct`…).
//
// Hinweis: Der Client erwartet weiterhin das **Anthropic-SSE-Format**
// (content_block_start/_delta + ein eigenes 'final'-Event). Diese
// Function ruft OpenRouter im OpenAI-Format auf und übersetzt die
// Antwort zur Laufzeit zurück — der Client merkt nichts vom Wechsel.
// =============================================================

// @ts-ignore Deno-Runtime
const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY") ?? "";
// @ts-ignore Deno-Runtime
// Default-Modell. `openai/gpt-4o-mini` ist auf OpenRouter dauerhaft
// verfügbar, sehr stabil, ähnlich günstig wie Gemini Flash.
// Auf https://openrouter.ai/models nach exakter ID suchen falls du
// wechseln willst — gängige Alternativen:
//   google/gemini-flash-1.5, google/gemini-2.5-flash,
//   anthropic/claude-haiku-4.5, meta-llama/llama-3.3-70b-instruct, …
// Override via Supabase-Secret OPENROUTER_MODEL ohne Code-Deploy.
const OPENROUTER_MODEL   = Deno.env.get("OPENROUTER_MODEL") ?? "openai/gpt-4o-mini";
// Optional: für OpenRouter-Analytics — zeigt auf welcher Site die Calls landen.
// Wenn leer, wird der Header ausgelassen.
// @ts-ignore Deno-Runtime
const APP_REFERER        = Deno.env.get("APP_REFERER") ?? "https://artcyc.vercel.app";
// @ts-ignore Deno-Runtime
const APP_TITLE          = Deno.env.get("APP_TITLE")   ?? "ArtCyc Coach";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const JSON_HEADERS = { ...CORS_HEADERS, "Content-Type": "application/json; charset=utf-8" };

// =============================================================
// Rate-Limit + Body-Größen-Schutz
// =============================================================
//
// Auth ist schon durch Supabase JWT-Boundary gewährleistet — d. h. nur
// eingeloggte User kommen überhaupt hier an. Wir cappen zusätzlich:
//   • Max 256 kB Request-Body (das ist viel — komplettes app_data passt
//     in der Regel in <50 kB Komprimiertes JSON)
//   • Max 30 Calls / 10 min / Token-Subject (verhindert OpenRouter-
//     Cost-Blowup durch eingeloggte Troll-Accounts)
//   • app_data.sessions wird intern auf die letzten 500 Einträge gecappt
//     (alte Sessions sind für den KI-Coach selten relevant)
//
// Buckets sind In-Memory — pro Edge-Function-Instanz. Reicht als
// Pragmatismus gegen Einzeltäter, kein Schutz gegen distributed abuse.
const MAX_BODY_BYTES        = 256 * 1024;
const RL_WINDOW_MS          = 10 * 60_000;
const RL_MAX_CALLS          = 30;
const MAX_SESSIONS_IN_PROMPT = 500;

const userBuckets = new Map<string, number[]>();
function userBucketCheck(subject: string): boolean {
  const now = Date.now();
  const arr = (userBuckets.get(subject) ?? []).filter(ts => now - ts < RL_WINDOW_MS);
  if (arr.length >= RL_MAX_CALLS) {
    userBuckets.set(subject, arr);
    return false;
  }
  arr.push(now);
  userBuckets.set(subject, arr);
  if (userBuckets.size > 5000) {
    for (const [k, v] of userBuckets) {
      if (!v.some(ts => now - ts < RL_WINDOW_MS)) userBuckets.delete(k);
    }
  }
  return true;
}

// JWT-Subject (User-ID) aus dem Bearer-Token lesen — wir validieren NICHT,
// das hat die Edge-Boundary schon gemacht. Nur Subject extrahieren.
function tokenSubject(req: Request): string {
  try {
    const auth = req.headers.get("Authorization") || "";
    const token = auth.replace(/^Bearer\s+/i, "").trim();
    if (!token) return "anon";
    const parts = token.split(".");
    if (parts.length !== 3) return "anon";
    // base64url → base64 → JSON
    const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
    const json = JSON.parse(atob(padded));
    return String(json.sub || "anon");
  } catch {
    return "anon";
  }
}
const SSE_HEADERS  = {
  ...CORS_HEADERS,
  "Content-Type": "text/event-stream; charset=utf-8",
  "Cache-Control": "no-cache, no-transform",
  "X-Accel-Buffering": "no",
};

// =============================================================
// Tools (im OpenAI-Format) — gleiche Semantik wie vorher mit Anthropic
// =============================================================
const TOOLS = [
  {
    type: "function",
    function: {
      name: "propose_create_session",
      description: "Schlägt vor, eine neue Trainings-Session zu protokollieren. Wird zur Bestätigung an den User geschickt — niemals direkt ausgeführt.",
      parameters: {
        type: "object",
        properties: {
          exerciseId: { type: "string", description: "ID der Übung aus app_data.exercises" },
          date:       { type: "string", description: "ISO-Datum YYYY-MM-DD" },
          entries: {
            type: "array",
            items: { type: "string", enum: ["success", "fail", "third"] },
            description: "Array der Serien-Status. 'success'=geklappt, 'fail'=nicht geklappt, 'third'=dritte Kategorie (z.B. gefährlich beim Maute-Sprung)",
          },
          withRope: { type: "boolean", description: "Nur bei Übungen mit Seil-Variante. true=mit Seil, false=ohne Seil. Bei Übungen ohne Seil-Variante: Feld weglassen." },
          notes:    { type: "string", description: "Optionale Notiz" },
          summary:  { type: "string", description: "Kurze deutsche Zusammenfassung für die Bestätigung" },
        },
        required: ["exerciseId", "date", "entries", "summary"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "propose_update_session",
      description: "Ändert EINE einzelne bestehende Session. Pro Aufruf nur eine Session. Bei mehreren Sessions: pro Antwort eine einzelne vorschlagen, der User bestätigt jede separat — oder beim User nachfragen ob das wirklich gewollt ist.",
      parameters: {
        type: "object",
        properties: {
          sessionId: { type: "string", description: "ID der zu ändernden Session aus app_data.sessions" },
          fields:    {
            type: "object",
            description: "PFLICHT: konkrete Feld-Änderungen. Erlaubte Keys: 'date' (string YYYY-MM-DD), 'entries' (Array aus 'success'|'fail'|'third'), 'notes' (string), 'withRope' (boolean). MINDESTENS EIN Feld muss gesetzt sein — niemals {} schicken.",
            properties: {
              date:     { type: "string", description: "Neues Datum YYYY-MM-DD" },
              entries:  { type: "array", items: { type: "string", enum: ["success", "fail", "third"] } },
              notes:    { type: "string" },
              withRope: { type: "boolean", description: "true=mit Seil, false=ohne Seil" },
            },
          },
          summary: { type: "string" },
        },
        required: ["sessionId", "fields", "summary"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "propose_bulk_update_sessions",
      description: "Aktualisiert MEHRERE Sessions auf einmal mit denselben Feld-Werten — EINE Bestätigung deckt alle ab. NUTZE DAS für 'alle X auf Y setzen'-Anfragen statt N einzelne propose_update_session-Calls. Beispiel: User: 'alle meine Maute-Sprünge waren mit Seil, passe das an' → filter: { exerciseId: '<maute-id>' }, fields: { withRope: true }.",
      parameters: {
        type: "object",
        properties: {
          filter: {
            type: "object",
            description: "Welche Sessions sollen geändert werden. Mindestens ein Feld setzen.",
            properties: {
              exerciseId: { type: "string", description: "Nur Sessions dieser Übung (id aus app_data.exercises)" },
              withRopeIs: { type: "boolean", description: "Nur Sessions deren withRope aktuell diesen Wert hat. Weglassen = ignoriert" },
            },
          },
          fields: {
            type: "object",
            description: "PFLICHT: konkrete Feld-Änderungen, mind. EIN Feld. Keys: 'withRope' (boolean), 'notes' (string).",
            properties: {
              withRope: { type: "boolean", description: "true=mit Seil, false=ohne Seil" },
              notes:    { type: "string" },
            },
          },
          summary: { type: "string", description: "Kurze deutsche Zusammenfassung, z. B. 'Alle 255 Maute-Sprünge auf mit Seil setzen'" },
        },
        required: ["filter", "fields", "summary"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "propose_delete_session",
      description: "Löscht eine Session unwiderruflich.",
      parameters: {
        type: "object",
        properties: {
          sessionId: { type: "string" },
          summary:   { type: "string" },
        },
        required: ["sessionId", "summary"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "propose_create_exercise",
      description: "Legt eine neue Übung an.",
      parameters: {
        type: "object",
        properties: {
          name:             { type: "string" },
          uci_code:         { type: "string", description: "UCI-Code z. B. '1124c'. Bei eigenen Übungen Feld weglassen." },
          uci_disc:         { type: "string", description: "UCI-Disziplin '1er'/'2er'/'4er'/'6er'. Bei eigenen Übungen Feld weglassen." },
          category_mode:    { type: "integer", enum: [2, 3] },
          third_label:      { type: "string", description: "Name der 3. Kategorie. Nur bei category_mode=3." },
          has_rope_variant: { type: "boolean" },
          default_series:   { type: "integer" },
          target_rate:      { type: "integer", description: "Ziel-Quote in % (0–100). Optional." },
          summary:          { type: "string" },
        },
        required: ["name", "category_mode", "summary"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "propose_update_exercise",
      description: "Ändert eine bestehende Übung.",
      parameters: {
        type: "object",
        properties: {
          exerciseId: { type: "string" },
          fields:     { type: "object" },
          summary:    { type: "string" },
        },
        required: ["exerciseId", "fields", "summary"],
      },
    },
  },
];

function buildSystemPrompt(appData: any, userName?: string): string {
  const ex = (appData?.exercises || []).map((e: any) => ({
    id: e.id, name: e.name, uci_code: e.uci_code, uci_disc: e.uci_disc,
    category_mode: e.category_mode, third_label: e.third_label,
    has_rope_variant: !!e.has_rope_variant, active: e.active !== false,
    points: e.points, target_rate: e.target_rate,
  }));
  const allSessions = (appData?.sessions || []);
  const sessions = allSessions
    .slice()
    .sort((a: any, b: any) => (b.date || "").localeCompare(a.date || ""))
    .slice(0, 200)
    .map((s: any) => ({
      id: s.id, date: s.date, exerciseId: s.exerciseId,
      exerciseName: s.exerciseName,
      entries: s.entries,
      withRope: s.withRope,
      notes: s.notes,
    }));
  const competitions = (appData?.competitions || []).map((c: any) => ({
    id: c.id, name: c.name, date: c.date, athlete_id: c.athlete_id, program_id: c.program_id,
    location: c.location, host: c.host,
    t1: c.t1_schwierigkeit, t2: c.t2_schwierigkeit,
    target_score: c.target_score,
  }));
  const programs = (appData?.programs || []).map((p: any) => ({
    id: p.id, name: p.name, discipline: p.discipline,
    exercise_count: (p.exercises || []).length,
  }));

  // ───── Vorberechnete Statistiken pro Übung ─────
  // Da kleine Modelle (gpt-4o-mini etc.) beim Zählen aus Listen halluzinieren,
  // berechnen wir die wichtigsten Aggregate hier zentral und geben sie der KI
  // als „zähl-fertige" Fakten — die KI muss nur ablesen, nicht rechnen.
  const exerciseStats = ex.map((e: any) => {
    const exSessions = allSessions.filter((s: any) => s.exerciseId === e.id);
    const entries: string[] = exSessions.flatMap((s: any) => s.entries || []);
    const total = entries.length;
    const success = entries.filter((x: string) => x === "success").length;
    const fail    = entries.filter((x: string) => x === "fail").length;
    const third   = entries.filter((x: string) => x === "third").length;
    const rate = total > 0 ? Math.round((success / total) * 100) : 0;
    const withRopeCount    = exSessions.filter((s: any) => s.withRope === true).length;
    const withoutRopeCount = exSessions.filter((s: any) => s.withRope === false).length;
    const ropeNull         = exSessions.filter((s: any) => s.withRope == null).length;
    return {
      exerciseId: e.id,
      exerciseName: e.name,
      sessionCount: exSessions.length,
      totalAttempts: total,
      successCount: success,
      failCount: fail,
      thirdCount: third,
      successRatePct: rate,
      withRopeSessionCount:    e.has_rope_variant ? withRopeCount    : null,
      withoutRopeSessionCount: e.has_rope_variant ? withoutRopeCount : null,
      ropeNullSessionCount:    e.has_rope_variant ? ropeNull         : null,
    };
  });
  const totalSessions = allSessions.length;

  const today = new Date().toISOString().slice(0, 10);

  return `Du bist der KI-Coach in ArtCyc Coach, einer App für Kunstradsport-Tracking. Du sprichst Deutsch und duzt den User.

# Heutiges Datum
${today}

# Der User${userName ? `\nDer User heißt ${userName}.` : ""}

# Verfügbare Daten (gekürzt, neueste zuerst)

## Übungen
${JSON.stringify(ex, null, 2)}

## ⚡ Vorberechnete Statistiken pro Übung — ZÄHLE NIEMALS SELBST AUS DEN SESSIONS

Diese Zahlen sind serverseitig exakt aus ALLEN Sessions (auch älteren) berechnet, nicht nur aus den 200 unten gezeigten. Wenn der User nach „wie viele Maute-Sprünge habe ich" oder „wie viele mit Seil" fragt, lies die Werte HIER ab — die Sessions-Liste unten ist nur ein Auszug.

${JSON.stringify(exerciseStats, null, 2)}

**Gesamt-Sessions in der DB: ${totalSessions}** (davon sind unten max 200 sichtbar)

## Sessions (max 200 neueste — Auszug, nicht zum Zählen!)
${JSON.stringify(sessions, null, 2)}

## Wettkämpfe
${JSON.stringify(competitions, null, 2)}

## Programme
${JSON.stringify(programs, null, 2)}

# Deine Aufgaben

- **Lesen + Analyse**: Du beantwortest Fragen zu den Trainings-/Wettkampfdaten direkt anhand obiger Daten. Quoten, Trends, Schwachpunkte direkt nennen — **NIEMALS** die Rechnung Schritt für Schritt vorzeigen.
- **ZAHLEN nur aus „Vorberechnete Statistiken"**: Wenn der User nach Anzahlen fragt („wie viele Sessions habe ich für X", „wie viele mit Seil") → IMMER aus dem \`exerciseStats\`-Block oben ablesen. NIEMALS aus der gekürzten Sessions-Liste zählen. NIEMALS Zahlen erfinden oder raten. Wenn der User dir widerspricht („hab mehr") — gib genau die Zahl aus exerciseStats wieder und erkläre dass die Sessions-Liste unten nur ein 200er-Auszug ist.

# Sprache & interne Feld-Namen — STRENG einhalten

Die Daten oben enthalten technische Feld-Namen, die NIEMALS in deinen Antworten auftauchen dürfen. Übersetze immer in normales Deutsch:

| intern (NICHT verwenden) | im Antwort-Text stattdessen |
|---|---|
| \`success\`           | „geklappt" |
| \`fail\`              | „nicht geklappt" |
| \`third\`             | der \`third_label\`-Wert der Übung, sonst „mittel/Getroffen" |
| \`entries\`           | „Versuche" oder „Serien" |
| \`withRope: true\`    | „mit Seil" |
| \`withRope: false\`   | „ohne Seil" |
| \`exerciseId\`, \`sessionId\` etc. | gar nicht erwähnen |
| \`category_mode\`     | gar nicht erwähnen |

Schreibe NIE etwas wie „success = gelandet" oder „die success/fail-Einträge", „third ist eine eigene Kategorie", „in \`entries\` sind …" — das wirkt für den User wie Code-Geschwafel und ist verboten.

# Antwort-Stil

- **Direkte Antwort zuerst**, dann optional 1–2 Sätze Begründung. KEINE „lass mich kurz rechnen…", KEINE Auflistung von Zwischenschritten, KEINE Erklärung deiner Methode.
- **Bei Analyse-Fragen**: 1 Zahl/Ergebnis + 1 Satz Kontext genügt.
- **Maximal 6 Sätze gesamt** bei Analyse-Antworten. Maximal 8 Bullet-Punkte bei Listen-Antworten.
- **Tipps geben**: Wenn der User um Trainings-Empfehlungen bittet, gib konkrete Vorschläge anhand der Daten.
- **Schreib-Aktionen**: NIEMALS direkt ausführen. Nutze die \`propose_*\`-Tools — der User muss die Aktion in der Bestätigungs-Karte am Bildschirm danach bestätigen (NICHT durch eine Text-Antwort wie „Ja"). Erkläre kurz im Antwort-Text was du tun willst und rufe IM SELBEN TURN das Tool auf.
- **NIEMALS vorher textuell nachfragen** wie „Möchtest du das?" / „Soll ich das tun?" / „Bestätige bitte". Der User sieht direkt eine Bestätigungs-Karte mit Abbrechen/Bestätigen-Knöpfen. Doppelte Nachfrage nervt nur. Ausnahme: bei wirklich gefährlichen oder mehrdeutigen Aufträgen (z. B. „lösch alles") — dann textuell nachfragen UND kein Tool aufrufen.
- **Bereits ausgeführte Aktionen erkennen**: Wenn im Verlauf eine System-Nachricht „[Aktion ausgeführt] ✓ X" steht, ist die Aktion BEREITS DURCH. Wenn der User dann fragt „ist es durch?" / „hat's geklappt?" → antworte „Ja, ist erledigt — N Sessions sind jetzt mit Seil." (mit konkreter Zahl aus exerciseStats). NIEMALS dieselbe Aktion erneut vorschlagen wenn sie schon gemacht wurde — das verwirrt nur.
- **Mehrere Änderungen / Bulk**: Für „alle X auf Y setzen" IMMER \`propose_bulk_update_sessions\` nutzen — EINE Bestätigung deckt alle ab. NIEMALS sagen „jede muss einzeln bestätigt werden".
  Beispiel: User „alle meine Maute-Sprünge waren mit Seil, passe das an" →
    Antwort-Text: „Setze alle 255 Maute-Sprung-Sessions auf 'mit Seil'." (kurz, kein Fragezeichen am Ende!)
    Tool-Call: propose_bulk_update_sessions mit filter={exerciseId:'ex2'}, fields={withRope:true}, summary='Alle 255 Maute-Sprünge auf mit Seil'
  → Beides in DERSELBEN Antwort. Keine separate Bestätigungs-Frage.
  Verstehe „waren mit Seil" / „bisher mit Seil" / „immer mit Seil" als withRope=true (nicht false!). „passe an" = auf den genannten Wert setzen, nicht togglen.
- **NIEMALS leere fields**: \`propose_update_session\`/\`propose_update_exercise\` brauchen IMMER mindestens ein konkretes Feld in \`fields\`. Ein Aufruf mit \`fields: {}\` ist verboten und bricht die App.
- **Datumsangaben**: "gestern" = ${new Date(Date.now() - 86400000).toISOString().slice(0, 10)}, "heute" = ${today}.
- **Übungs-IDs**: Wenn du eine Aktion vorschlägst, nutze die echten \`id\`-Werte aus den Daten oben — niemals erfinden.
- **Stil**: Kurz, freundlich, sportlich. Emojis sparsam (max 1 pro Antwort, nur wenn passend).

# Formatierung deiner Antworten — wichtig für saubere Anzeige

- **Absätze**: 1–3 kurze Absätze. Trenne Absätze mit einer Leerzeile (\\n\\n).
- **Listen**: Bei mehreren Punkten/Optionen IMMER Bullet-Liste mit "- " am Zeilenanfang, NICHT in Fließtext quetschen.
- **Bold sparsam**: \`**fett**\` nur für wirklich wichtige Schlüssel-Wörter. NIEMALS ganze Sätze fetten.
- **Zahlen/Quoten**: Einfach im Text als Zahl, NICHT in Bold packen. Prozentwerte werden vom Client farblich hervorgehoben.
- **Keine Überschriften** (kein #/##/###).
- **Keine Code-Blöcke** (\`\`\`...\`\`\`).
- **Keine asterisk-Auflistungen** ("* Punkt 1"). Nutze IMMER Bindestriche ("- Punkt 1").

# Wichtig

- Wenn du eine Aktion vorschlägst, formuliere im Antwort-Text natürlich was du tun willst.
- Die App-Daten oben sind ein Snapshot — bei Schreib-Aktionen ist die App selbst die Wahrheit, nicht du.
- Bei mehrdeutigen Aufträgen frag erst nach (im Text), nicht direkt vorschlagen.`;
}

// =============================================================
// OpenRouter-Aufruf
// =============================================================

function openRouterHeaders() {
  const h: Record<string, string> = {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + OPENROUTER_API_KEY,
  };
  if (APP_REFERER) h["HTTP-Referer"] = APP_REFERER;
  if (APP_TITLE)   h["X-Title"]      = APP_TITLE;
  return h;
}

async function callOpenRouter(systemPrompt: string, messages: any[]) {
  // OpenAI-Format: system als erste Message mit role=system
  const msgs = [{ role: "system", content: systemPrompt }, ...messages];
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: openRouterHeaders(),
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages: msgs,
      tools: TOOLS,
      tool_choice: "auto",
      max_tokens: 1500,
    }),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`OpenRouter ${res.status}: ${txt}`);
  }
  return await res.json();
}

async function callOpenRouterStream(systemPrompt: string, messages: any[]) {
  const msgs = [{ role: "system", content: systemPrompt }, ...messages];
  return await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: openRouterHeaders(),
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages: msgs,
      tools: TOOLS,
      tool_choice: "auto",
      max_tokens: 1500,
      stream: true,
    }),
  });
}

// =============================================================
// Server
// =============================================================

// @ts-ignore Deno-Runtime
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: CORS_HEADERS });
  }
  if (!OPENROUTER_API_KEY) {
    return new Response(JSON.stringify({ error: "OPENROUTER_API_KEY nicht konfiguriert" }), {
      status: 500, headers: JSON_HEADERS,
    });
  }
  // Body-Größe checken bevor wir das JSON parsen
  const contentLength = parseInt(req.headers.get("content-length") || "0", 10);
  if (contentLength > MAX_BODY_BYTES) {
    return new Response(JSON.stringify({ error: "Body zu groß — max " + (MAX_BODY_BYTES / 1024) + " kB" }), {
      status: 413, headers: JSON_HEADERS,
    });
  }

  // Per-User-Rate-Limit
  const subject = tokenSubject(req);
  if (!userBucketCheck(subject)) {
    return new Response(JSON.stringify({ error: "rate limited — bitte später nochmal" }), {
      status: 429, headers: JSON_HEADERS,
    });
  }

  try {
    const url = new URL(req.url);
    const wantStream = url.searchParams.get("stream") === "1";
    const { messages, app_data, user_name } = await req.json();
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages fehlt" }), {
        status: 400, headers: JSON_HEADERS,
      });
    }

    // app_data hard cappen — alte Sessions tragen wenig bei zur LLM-Antwort,
    // kosten aber Tokens. Behalte die neuesten N.
    const capped_app_data: any = { ...(app_data || {}) };
    if (Array.isArray(capped_app_data.sessions) && capped_app_data.sessions.length > MAX_SESSIONS_IN_PROMPT) {
      capped_app_data.sessions = capped_app_data.sessions
        .slice()
        .sort((a: any, b: any) => String(b?.date || "").localeCompare(String(a?.date || "")))
        .slice(0, MAX_SESSIONS_IN_PROMPT);
    }
    const systemPrompt = buildSystemPrompt(capped_app_data, user_name);

    // ─── Streaming-Pfad: OpenRouter-SSE → Anthropic-kompatible SSE ───
    // TransformStream-Pattern statt ReadableStream-pull():
    // imperativer, kein Close-Race, sauberes finally für Cleanup.
    if (wantStream) {
      const upstream = await callOpenRouterStream(systemPrompt, messages);
      if (!upstream.ok) {
        const txt = await upstream.text();
        return new Response(JSON.stringify({ error: `OpenRouter ${upstream.status}: ${txt}` }), {
          status: 502, headers: JSON_HEADERS,
        });
      }

      const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>();
      const writer = writable.getWriter();
      const encoder = new TextEncoder();
      const decoder = new TextDecoder();

      const sse = async (eventName: string, data: any) => {
        try {
          await writer.write(encoder.encode("event: " + eventName + "\ndata: " + JSON.stringify(data) + "\n\n"));
        } catch {/* Client hat den Stream abgebrochen */}
      };

      // Im Hintergrund den Upstream lesen + Events rausschreiben.
      const reqId = crypto.randomUUID().slice(0, 8);
      console.log("[" + reqId + "] stream start, model=" + OPENROUTER_MODEL);
      (async () => {
        const reader = upstream.body!.getReader();
        let buf = "";
        let aggregatedText = "";
        const toolBuf: Record<number, { name: string; args: string }> = {};
        let stopped = false;
        let chunkCount = 0;
        let deltaCount = 0;

        const buildAction = () => {
          const idxs = Object.keys(toolBuf).map(Number).sort((a, b) => a - b);
          if (idxs.length === 0) return null;
          const first = toolBuf[idxs[0]];
          let input: any = {};
          try { input = first.args ? JSON.parse(first.args) : {}; } catch (e) {
            console.log("[" + reqId + "] tool-args parse error: " + (e as Error).message + " — raw: " + (first.args || "").slice(0, 200));
          }
          return { tool: first.name, params: input, summary: (input && input.summary) || "" };
        };

        const finish = async (reason: string) => {
          if (stopped) return;
          stopped = true;
          console.log("[" + reqId + "] finish(" + reason + ") — chunks=" + chunkCount + " deltas=" + deltaCount + " textLen=" + aggregatedText.length + " toolCalls=" + Object.keys(toolBuf).length);
          await sse("final", { type: "final", content: aggregatedText, action: buildAction() });
          console.log("[" + reqId + "] final event sent");
          try { reader.cancel(); } catch {}
        };

        try {
          while (!stopped) {
            let value: Uint8Array | undefined;
            let done = false;
            try {
              const r = await reader.read();
              value = r.value;
              done = r.done;
            } catch (e) {
              console.log("[" + reqId + "] reader.read error: " + (e as Error).message);
              await sse("final", { type: "final", content: aggregatedText, action: buildAction(), error: (e as Error).message });
              stopped = true;
              break;
            }
            if (done) { await finish("reader done"); break; }
            chunkCount++;
            buf += decoder.decode(value, { stream: true });
            const lines = buf.split("\n");
            buf = lines.pop() ?? "";
            for (const ln of lines) {
              if (stopped) break;
              const line = ln.trim();
              if (!line || !line.startsWith("data:")) continue;
              const payload = line.slice(5).trim();
              if (payload === "[DONE]") { await finish("DONE marker"); break; }
              let ev: any;
              try { ev = JSON.parse(payload); } catch { continue; }
              const delta = ev?.choices?.[0]?.delta;
              if (!delta) continue;
              deltaCount++;
              if (typeof delta.content === "string" && delta.content.length > 0) {
                aggregatedText += delta.content;
                await sse("content_block_delta", {
                  type: "content_block_delta",
                  index: 0,
                  delta: { type: "text_delta", text: delta.content },
                });
              }
              if (Array.isArray(delta.tool_calls)) {
                for (const tc of delta.tool_calls) {
                  const idx = typeof tc.index === "number" ? tc.index : 0;
                  if (!toolBuf[idx]) toolBuf[idx] = { name: "", args: "" };
                  const fn = tc.function || {};
                  if (fn.name && !toolBuf[idx].name) {
                    toolBuf[idx].name = fn.name;
                    await sse("content_block_start", {
                      type: "content_block_start",
                      index: 1 + idx,
                      content_block: { type: "tool_use", name: fn.name, id: tc.id || "" },
                    });
                  }
                  if (typeof fn.arguments === "string" && fn.arguments.length > 0) {
                    toolBuf[idx].args += fn.arguments;
                    await sse("content_block_delta", {
                      type: "content_block_delta",
                      index: 1 + idx,
                      delta: { type: "input_json_delta", partial_json: fn.arguments },
                    });
                  }
                }
              }
            }
          }
          if (!stopped) await finish("loop ended");
        } catch (e) {
          console.log("[" + reqId + "] outer loop error: " + (e as Error).message);
        } finally {
          console.log("[" + reqId + "] closing writer");
          try { await writer.close(); } catch (e) {
            console.log("[" + reqId + "] writer.close error: " + (e as Error).message);
          }
          console.log("[" + reqId + "] stream done");
        }
      })();

      return new Response(readable, { headers: SSE_HEADERS });
    }

    // ─── Non-Streaming-Pfad: einmal abrufen, in altes Antwort-Format wandeln ───
    const result = await callOpenRouter(systemPrompt, messages);
    const choice = result?.choices?.[0];
    const msg = choice?.message || {};
    const text = typeof msg.content === "string" ? msg.content : "";
    let action: any = null;
    const toolCalls = Array.isArray(msg.tool_calls) ? msg.tool_calls : [];
    if (toolCalls.length > 0) {
      const tc = toolCalls[0];
      const fn = tc.function || {};
      let input: any = {};
      try { input = fn.arguments ? JSON.parse(fn.arguments) : {}; } catch {}
      action = {
        tool: fn.name,
        params: input,
        summary: (input && input.summary) || "",
      };
    }
    return new Response(
      JSON.stringify({
        content: text || (action ? "Ich schlage folgende Aktion vor:" : ""),
        action,
        stop_reason: choice?.finish_reason,
        usage: result?.usage,
      }),
      { headers: JSON_HEADERS }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ error: (e as Error).message }),
      { status: 500, headers: JSON_HEADERS }
    );
  }
});
