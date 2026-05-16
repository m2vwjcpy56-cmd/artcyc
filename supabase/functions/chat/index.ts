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
      description: "Ändert eine bestehende Session (z.B. Datum, Notiz, Entries, withRope korrigieren).",
      parameters: {
        type: "object",
        properties: {
          sessionId: { type: "string", description: "ID der Session" },
          fields:    { type: "object", description: "Änderungs-Objekt mit den zu setzenden Feldern (date, entries, notes, withRope)" },
          summary:   { type: "string" },
        },
        required: ["sessionId", "fields", "summary"],
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
  const sessions = (appData?.sessions || [])
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

  const today = new Date().toISOString().slice(0, 10);

  return `Du bist der KI-Coach in ArtCyc Coach, einer App für Kunstradsport-Tracking. Du sprichst Deutsch und duzt den User.

# Heutiges Datum
${today}

# Der User${userName ? `\nDer User heißt ${userName}.` : ""}

# Verfügbare Daten (gekürzt, neueste zuerst)

## Übungen
${JSON.stringify(ex, null, 2)}

## Sessions (max 200 neueste)
${JSON.stringify(sessions, null, 2)}

## Wettkämpfe
${JSON.stringify(competitions, null, 2)}

## Programme
${JSON.stringify(programs, null, 2)}

# Deine Aufgaben

- **Lesen + Analyse**: Du beantwortest Fragen zu den Trainings-/Wettkampfdaten direkt anhand obiger Daten. Quoten, Trends, Schwachpunkte direkt nennen — **NIEMALS** die Rechnung Schritt für Schritt vorzeigen.

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
- **Schreib-Aktionen**: NIEMALS direkt ausführen. Nutze die \`propose_*\`-Tools — der User muss die Aktion danach bestätigen. Erkläre dabei kurz im Antwort-Text warum du das vorschlägst.
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
  try {
    const url = new URL(req.url);
    const wantStream = url.searchParams.get("stream") === "1";
    const { messages, app_data, user_name } = await req.json();
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages fehlt" }), {
        status: 400, headers: JSON_HEADERS,
      });
    }
    const systemPrompt = buildSystemPrompt(app_data || {}, user_name);

    // ─── Streaming-Pfad: OpenRouter-SSE → Anthropic-kompatible SSE ───
    if (wantStream) {
      const upstream = await callOpenRouterStream(systemPrompt, messages);
      if (!upstream.ok) {
        const txt = await upstream.text();
        return new Response(JSON.stringify({ error: `OpenRouter ${upstream.status}: ${txt}` }), {
          status: 502, headers: JSON_HEADERS,
        });
      }
      const reader = upstream.body!.getReader();
      const decoder = new TextDecoder();
      const encoder = new TextEncoder();
      let buf = "";
      let aggregatedText = "";
      // Tool-Calls aufsammeln: Index → { name, args }
      const toolBuf: Record<number, { name: string; args: string }> = {};

      const emit = (controller: ReadableStreamDefaultController<Uint8Array>, eventName: string, data: any) => {
        controller.enqueue(encoder.encode("event: " + eventName + "\ndata: " + JSON.stringify(data) + "\n\n"));
      };

      const stream = new ReadableStream<Uint8Array>({
        async pull(controller) {
          let value: Uint8Array | undefined;
          let done = false;
          try {
            const r = await reader.read();
            value = r.value;
            done = r.done;
          } catch (e) {
            // Upstream-Stream abgebrochen → Final-Event mit Fehler raus
            emit(controller, "final", { type: "final", content: aggregatedText, action: null, error: "Upstream-Stream-Abbruch: " + (e as Error).message });
            controller.close();
            return;
          }
          if (done) {
            // Final-Event: gesammelten Text + ggf. Tool-Call-Action ausgeben
            let action: any = null;
            const idxs = Object.keys(toolBuf).map(Number).sort((a, b) => a - b);
            if (idxs.length > 0) {
              const first = toolBuf[idxs[0]];
              let input: any = {};
              try { input = first.args ? JSON.parse(first.args) : {}; } catch {}
              action = {
                tool: first.name,
                params: input,
                summary: (input && input.summary) || "",
              };
            }
            emit(controller, "final", { type: "final", content: aggregatedText, action });
            controller.close();
            return;
          }
          buf += decoder.decode(value, { stream: true });
          const lines = buf.split("\n");
          buf = lines.pop() ?? "";
          for (const ln of lines) {
            const line = ln.trim();
            if (!line || !line.startsWith("data:")) continue;
            const payload = line.slice(5).trim();
            if (payload === "[DONE]") continue;
            let ev: any;
            try { ev = JSON.parse(payload); } catch { continue; }
            const delta = ev?.choices?.[0]?.delta;
            if (!delta) continue;
            // Text-Token
            if (typeof delta.content === "string" && delta.content.length > 0) {
              aggregatedText += delta.content;
              // Anthropic-kompatibles content_block_delta-Event emittieren
              emit(controller, "content_block_delta", {
                type: "content_block_delta",
                index: 0,
                delta: { type: "text_delta", text: delta.content },
              });
            }
            // Tool-Call-Chunks
            if (Array.isArray(delta.tool_calls)) {
              for (const tc of delta.tool_calls) {
                const idx = typeof tc.index === "number" ? tc.index : 0;
                if (!toolBuf[idx]) toolBuf[idx] = { name: "", args: "" };
                const fn = tc.function || {};
                if (fn.name && !toolBuf[idx].name) {
                  toolBuf[idx].name = fn.name;
                  // Anthropic-kompatibles content_block_start für tool_use
                  emit(controller, "content_block_start", {
                    type: "content_block_start",
                    index: 1 + idx,
                    content_block: { type: "tool_use", name: fn.name, id: tc.id || "" },
                  });
                }
                if (typeof fn.arguments === "string" && fn.arguments.length > 0) {
                  toolBuf[idx].args += fn.arguments;
                  emit(controller, "content_block_delta", {
                    type: "content_block_delta",
                    index: 1 + idx,
                    delta: { type: "input_json_delta", partial_json: fn.arguments },
                  });
                }
              }
            }
          }
        },
        cancel() { try { reader.cancel(); } catch {} },
      });
      return new Response(stream, { headers: SSE_HEADERS });
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
