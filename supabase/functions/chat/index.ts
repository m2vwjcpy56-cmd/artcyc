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
// Default-Modell: `google/gemini-2.5-flash` — sehr starkes multi-
// language pre-training (Google-typisch), günstig (~$0.30/$2.50 pro
// M tokens), gutes Instruction-Following. gpt-4o-mini hatte
// Probleme die Sprach-Anweisungen zu befolgen wenn der Großteil
// des Prompt-Kontexts (Tool-Descriptions, Vokabel-Tabelle) deutsch
// war — bei Gemini gewinnt die explizite Anweisung zuverlässiger.
//
// Override via Supabase-Secret OPENROUTER_MODEL ohne Code-Deploy.
// Alternativen:
//   anthropic/claude-haiku-4.5  — etwas besser bei Instruction-
//     Following, aber ~3× teurer ($1/$5)
//   openai/gpt-4o-mini          — günstigste Option ($0.15/$0.60),
//     aber multilingual unzuverlässig
const OPENROUTER_MODEL   = Deno.env.get("OPENROUTER_MODEL") ?? "google/gemini-2.5-flash";
// Optional: für OpenRouter-Analytics — zeigt auf welcher Site die Calls landen.
// Wenn leer, wird der Header ausgelassen.
// @ts-ignore Deno-Runtime
const APP_REFERER        = Deno.env.get("APP_REFERER") ?? "https://artcyc.vercel.app";
// @ts-ignore Deno-Runtime
const APP_TITLE          = Deno.env.get("APP_TITLE")   ?? "ArtCyc Coach";

// @ts-ignore Deno-Runtime resolution
import { corsHeaders, jsonHeaders } from "../_shared/cors.ts";

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
function sseHeaders(req: Request): Record<string, string> {
  return {
    ...corsHeaders(req),
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache, no-transform",
    "X-Accel-Buffering": "no",
  };
}

// =============================================================
// Tools (im OpenAI-Format) — gleiche Semantik wie vorher mit Anthropic
// =============================================================
const TOOLS = [
  {
    type: "function",
    function: {
      name: "propose_create_session",
      description: "Proposes logging a new training session. Sent to the user for confirmation — never executed directly.",
      parameters: {
        type: "object",
        properties: {
          exerciseId: { type: "string", description: "Exercise id from app_data.exercises" },
          date:       { type: "string", description: "ISO date YYYY-MM-DD" },
          entries: {
            type: "array",
            items: { type: "string", enum: ["success", "fail", "third"] },
            description: "Array of series statuses. 'success'=made, 'fail'=missed, 'third'=third category (e.g. dangerous on the Maute jump)",
          },
          withRope: { type: "boolean", description: "Only for exercises with a rope variant. true=with rope, false=without rope. For exercises without a rope variant: omit the field." },
          notes:    { type: "string", description: "Optional note" },
          summary:  { type: "string", description: "Short summary for the confirmation card, written in the user's app language" },
        },
        required: ["exerciseId", "date", "entries", "summary"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "propose_update_session",
      description: "Changes ONE single existing session. One session per call. For multiple sessions: propose one per reply, the user confirms each separately — or ask the user first if that's really intended.",
      parameters: {
        type: "object",
        properties: {
          sessionId: { type: "string", description: "Session id to modify, from app_data.sessions" },
          fields:    {
            type: "object",
            description: "REQUIRED: concrete field changes. Allowed keys: 'date' (string YYYY-MM-DD), 'entries' (array of 'success'|'fail'|'third'), 'notes' (string), 'withRope' (boolean). AT LEAST ONE field must be set — never send {}.",
            properties: {
              date:     { type: "string", description: "New date YYYY-MM-DD" },
              entries:  { type: "array", items: { type: "string", enum: ["success", "fail", "third"] } },
              notes:    { type: "string" },
              withRope: { type: "boolean", description: "true=with rope, false=without rope" },
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
      description: "Updates MULTIPLE sessions at once with the same field values — ONE confirmation covers all of them. USE THIS for 'set all X to Y' requests instead of N individual propose_update_session calls. Example: user says 'all my Maute jumps were with rope, please fix' → filter: { exerciseId: '<maute-id>' }, fields: { withRope: true }.",
      parameters: {
        type: "object",
        properties: {
          filter: {
            type: "object",
            description: "Which sessions to modify. At least one field must be set.",
            properties: {
              exerciseId: { type: "string", description: "Only sessions of this exercise (id from app_data.exercises)" },
              withRopeIs: { type: "boolean", description: "Only sessions whose current withRope equals this value. Omit = ignored" },
            },
          },
          fields: {
            type: "object",
            description: "REQUIRED: concrete field changes, at least ONE field. Keys: 'withRope' (boolean), 'notes' (string).",
            properties: {
              withRope: { type: "boolean", description: "true=with rope, false=without rope" },
              notes:    { type: "string" },
            },
          },
          summary: { type: "string", description: "Short summary in the user's app language, e.g. 'Set all 255 Maute jumps to with rope'" },
        },
        required: ["filter", "fields", "summary"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "propose_delete_session",
      description: "Deletes a session permanently.",
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
      description: "Creates a new exercise.",
      parameters: {
        type: "object",
        properties: {
          name:             { type: "string" },
          uci_code:         { type: "string", description: "UCI code e.g. '1124c'. For custom exercises: omit the field." },
          uci_disc:         { type: "string", description: "UCI discipline '1er'/'2er'/'4er'/'6er'. For custom exercises: omit the field." },
          category_mode:    { type: "integer", enum: [2, 3] },
          third_label:      { type: "string", description: "Name of the 3rd category. Only if category_mode=3." },
          has_rope_variant: { type: "boolean" },
          default_series:   { type: "integer" },
          target_rate:      { type: "integer", description: "Target rate in % (0–100). Optional." },
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
      description: "Changes an existing exercise.",
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

// Sprach-Anweisung am Anfang des System-Prompts. Englische Schlüssel-
// Vokabeln (success/fail/withRope) bleiben gleich — die Übersetzungs-
// tabelle unten passt sich je Sprache an.
const LANG_INSTRUCTIONS: Record<string, { name: string; tone: string; vocab: { success: string; fail: string; third: string; entries: string; withRopeT: string; withRopeF: string } }> = {
  de: { name: "German (Deutsch)",        tone: "Duze den User.",                                vocab: { success: "geklappt",  fail: "nicht geklappt", third: "der `third_label`-Wert der Übung, sonst \"mittel/Getroffen\"", entries: "Versuche oder Serien",     withRopeT: "mit Seil",     withRopeF: "ohne Seil" } },
  en: { name: "English",                 tone: "Address the user with informal 'you'.",          vocab: { success: "made",      fail: "missed",         third: "the exercise's `third_label` value, fallback 'middle/hit'",         entries: "attempts or series",     withRopeT: "with rope",    withRopeF: "without rope" } },
  es: { name: "Spanish (español)",       tone: "Usa el tuteo informal.",                         vocab: { success: "logrado",   fail: "fallado",        third: "el valor `third_label` del ejercicio, si no \"medio/acertado\"",          entries: "intentos o series",      withRopeT: "con cuerda",   withRopeF: "sin cuerda" } },
  fr: { name: "French (français)",       tone: "Tutoie l'utilisateur.",                          vocab: { success: "réussi",    fail: "manqué",         third: "la valeur `third_label` de l'exercice, sinon « moyen/touché »",          entries: "essais ou séries",       withRopeT: "avec corde",   withRopeF: "sans corde" } },
  it: { name: "Italian (italiano)",      tone: "Dai del tu all'utente.",                         vocab: { success: "riuscito",  fail: "mancato",        third: "il valore `third_label` dell'esercizio, altrimenti \"medio/colpito\"",   entries: "tentativi o serie",      withRopeT: "con corda",    withRopeF: "senza corda" } },
  cs: { name: "Czech (čeština)",         tone: "Tykáš uživateli.",                               vocab: { success: "povedlo",   fail: "nepovedlo",      third: "hodnota `third_label` cviku, jinak \"střední/zasaženo\"",                entries: "pokusy nebo série",      withRopeT: "se švihadlem", withRopeF: "bez švihadla" } },
  hu: { name: "Hungarian (magyar)",      tone: "Tegezed a felhasználót.",                        vocab: { success: "sikerült",  fail: "nem sikerült",   third: "a gyakorlat `third_label` értéke, egyébként \"közepes/talált\"",          entries: "próbálkozás vagy sorozat", withRopeT: "kötéllel",   withRopeF: "kötél nélkül" } },
  ja: { name: "Japanese (日本語)",        tone: "ユーザーに対してフレンドリーに接します。",          vocab: { success: "成功",      fail: "失敗",            third: "技の `third_label` の値、なければ「中／当たり」",                              entries: "試行またはシリーズ",        withRopeT: "縄あり",     withRopeF: "縄なし" } },
};

function buildSystemPrompt(appData: any, userName?: string, lang: string = "de"): string {
  const li = LANG_INSTRUCTIONS[lang] || LANG_INSTRUCTIONS.de;
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

  return `You are the AI coach inside ArtCyc Coach, an app for tracking artistic cycling.

# OUTPUT LANGUAGE — READ THIS BEFORE ANYTHING ELSE
The user's app language is **${li.name}**. Every single one of your replies — including the very first one — MUST be written in **${li.name}**. ${li.tone}

The rest of this prompt is in English purely as the working/internal language. Do NOT mirror it. Your output must be in **${li.name}** unless the user explicitly writes their latest message in a different language — in that case match the user's message language for that single turn.

# Today's date
${today}

# The user${userName ? `\nThe user's name is ${userName}.` : ""}

# Available data (truncated, newest first)

## Exercises
${JSON.stringify(ex, null, 2)}

## ⚡ Precomputed stats per exercise — NEVER count from the sessions list yourself

These numbers are computed server-side from ALL sessions (including older ones), not just the 200 shown below. When the user asks "how many Maute jumps do I have" or "how many with rope", read the values from HERE — the sessions list below is only a sample.

${JSON.stringify(exerciseStats, null, 2)}

**Total sessions in the DB: ${totalSessions}** (max 200 of them are visible below)

## Sessions (max 200 newest — sample, not for counting!)
${JSON.stringify(sessions, null, 2)}

## Competitions
${JSON.stringify(competitions, null, 2)}

## Programs
${JSON.stringify(programs, null, 2)}

# Your tasks

- **Reading + analysis**: answer questions about the training/competition data directly from the data above. State rates, trends, weak points — **NEVER** show your calculation step by step.
- **Numbers only from "Precomputed stats"**: when the user asks for counts ("how many sessions for X", "how many with rope") → ALWAYS read from the \`exerciseStats\` block above. NEVER count from the truncated sessions list. NEVER invent or guess numbers. If the user disagrees ("I have more") — repeat the exact number from exerciseStats and explain that the sessions list is only a 200-entry sample.
- **Be specific and useful — NEVER deflect with "I need more info"** when the data above actually contains the answer. Concrete examples:
  - "Which exercise has the worst success rate?" → look at exerciseStats, find the lowest successRatePct among exercises WITH at least 5 attempts (\`totalAttempts >= 5\`); ignore exercises with 0 attempts (they have no rate, not a low rate). Name it with the rate. If there really is no exercise with ≥5 attempts, say so plainly: "You only have data for one exercise so far — that's Maute-Sprung at 51%."
  - "How many trainings last week?" → "last week" = the 7 days ending today. Look at sessions in the data above (those have dates), count them. If there's clearly 0, say "0 trainings in the last 7 days." — don't ask the user to clarify.
  - "What should I focus on this week?" → pick the 2–3 exercises with low success rate AND enough attempts, suggest concrete work on each. Don't ask the user "what's your goal"; the goal is implicit: improve weak exercises.
- **Be a coach, not a chatbot**: give a real recommendation based on the data. Asking back "what would you like?" when the data already answers is bad coaching.

# Internal field names — never expose them

The data above contains technical field names that must NEVER appear in your replies. Translate them into the user's language using this mapping:

| internal (DO NOT use)   | use this in the reply text (in ${li.name}) |
|---|---|
| \`success\`             | "${li.vocab.success}" |
| \`fail\`                | "${li.vocab.fail}" |
| \`third\`               | ${li.vocab.third} |
| \`entries\`             | "${li.vocab.entries}" |
| \`withRope: true\`      | "${li.vocab.withRopeT}" |
| \`withRope: false\`     | "${li.vocab.withRopeF}" |
| \`exerciseId\`, \`sessionId\` etc. | do not mention |
| \`category_mode\`       | do not mention |

NEVER write "success = made" or "the success/fail entries" or "third is its own category" or "in \`entries\` there are…" — that sounds like raw code to the user and is forbidden.

# Response style

- **Direct answer first**, then optionally 1–2 sentences of context. NO "let me calculate…", NO listing of intermediate steps, NO explaining your method.
- **For analysis questions**: 1 number/result + 1 sentence of context is enough.
- **Max 6 sentences total** for analysis replies. Max 8 bullet points for list replies.
- **Recommendations**: when the user asks for training advice, give concrete suggestions based on the data.
- **Write-actions**: NEVER execute directly. Use the \`propose_*\` tools — the user has to confirm via the on-screen card (NOT by typing "yes"). Explain briefly in the reply text what you want to do AND call the tool in the SAME turn.
- **NEVER ask "do you want me to" / "should I" / "please confirm"** in text first. The user sees a confirm card with cancel/confirm buttons automatically. Double-asking is annoying. Exception: genuinely dangerous or ambiguous requests (e.g. "delete everything") — then ask in text AND do NOT call a tool yet.
- **Recognize completed actions**: if a system message "[Aktion ausgeführt] ✓ X" appears in history, the action is ALREADY DONE. If the user then asks "is it done?" / "did it work?" → reply "Yes, done — N sessions are now with rope." (with the actual number from exerciseStats). NEVER propose the same action again once it has been executed — that confuses.
- **Bulk changes**: for "set all X to Y" ALWAYS use \`propose_bulk_update_sessions\` — one confirmation covers all of them. NEVER say "each one has to be confirmed separately".
  Example: user says "all my Maute jumps were with rope, please fix" →
    Reply text: "Setting all 255 Maute-jump sessions to 'with rope'." (short, no question mark!)
    Tool call: propose_bulk_update_sessions with filter={exerciseId:'ex2'}, fields={withRope:true}, summary='All 255 Maute jumps to with rope'
  → Both in the SAME reply. No separate confirmation question.
  Interpret "were with rope" / "always with rope" / "so far with rope" as withRope=true (not false!). "Fix" = set to the stated value, not toggle.
- **NEVER empty fields**: \`propose_update_session\`/\`propose_update_exercise\` ALWAYS need at least one concrete key in \`fields\`. Calling with \`fields: {}\` is forbidden and breaks the app.
- **Date refs**: "yesterday" = ${new Date(Date.now() - 86400000).toISOString().slice(0, 10)}, "today" = ${today}.
- **Exercise IDs**: when proposing an action, use the real \`id\` values from the data above — never invent.
- **Style**: short, friendly, sporty. Use emojis sparingly (max 1 per reply, only when fitting).

# Reply formatting — important for clean rendering

- **Paragraphs**: 1–3 short paragraphs. Separate paragraphs with a blank line (\\n\\n).
- **Lists**: for multiple items/options ALWAYS use a bullet list with "- " at the start of each line, NOT crammed into flowing text.
- **Bold sparingly**: \`**bold**\` only for truly important keywords. NEVER bold whole sentences.
- **Numbers/rates**: just write as a number in text, do NOT bold them. Percentages are highlighted by the client automatically.
- **No headings** (no #/##/###).
- **No code blocks** (\`\`\`...\`\`\`).
- **No asterisk lists** ("* item 1"). Always use hyphens ("- item 1").

# Important

- When proposing an action, phrase the reply text naturally in **${li.name}** to describe what you intend to do.
- The app data above is a snapshot — for write-actions the app itself is the source of truth, not you.
- For ambiguous requests, ask first (in text) before proposing.`;
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

// Baut die Message-Reihenfolge mit drei Sprach-Verstärkern:
//  1. System-Prompt am Anfang sagt explizit die Sprache
//  2. Die LETZTE user-Message wird mit einem unsichtbaren Sprach-
//     Marker geprefixt: "[Antworte ausschließlich auf Englisch.] ..."
//     Der Marker wird NICHT im Chat-Verlauf gespeichert (nur fürs
//     LLM beim Senden injiziert). Das ist die zuverlässigste Methode
//     bei kleinen Modellen wie gpt-4o-mini, die System-Anweisungen
//     manchmal ignorieren wenn der Großteil des Prompts in einer
//     anderen Sprache ist.
//  3. Finale system-Message als Recency-Reminder
function buildMessages(systemPrompt: string, messages: any[], langTail: string, langName: string): any[] {
  const out: any[] = [{ role: "system", content: systemPrompt }];
  const msgs = messages.slice();
  // Letzte user-Message finden und Marker prepend
  for (let i = msgs.length - 1; i >= 0; i--) {
    if (msgs[i]?.role === "user" && typeof msgs[i]?.content === "string") {
      msgs[i] = {
        ...msgs[i],
        content: `[Reply strictly in ${langName} — this is the user's app language.]\n\n${msgs[i].content}`,
      };
      break;
    }
  }
  out.push(...msgs);
  if (langTail) out.push({ role: "system", content: langTail });
  return out;
}

async function callOpenRouter(systemPrompt: string, messages: any[], langTail: string, langName: string) {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: openRouterHeaders(),
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages: buildMessages(systemPrompt, messages, langTail, langName),
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

async function callOpenRouterStream(systemPrompt: string, messages: any[], langTail: string, langName: string) {
  return await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: openRouterHeaders(),
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages: buildMessages(systemPrompt, messages, langTail, langName),
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
    return new Response("ok", { headers: corsHeaders(req) });
  }
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders(req) });
  }
  if (!OPENROUTER_API_KEY) {
    return new Response(JSON.stringify({ error: "OPENROUTER_API_KEY nicht konfiguriert" }), {
      status: 500, headers: jsonHeaders(req),
    });
  }
  // Body-Größe checken bevor wir das JSON parsen
  const contentLength = parseInt(req.headers.get("content-length") || "0", 10);
  if (contentLength > MAX_BODY_BYTES) {
    return new Response(JSON.stringify({ error: "Body zu groß — max " + (MAX_BODY_BYTES / 1024) + " kB" }), {
      status: 413, headers: jsonHeaders(req),
    });
  }

  // Per-User-Rate-Limit
  const subject = tokenSubject(req);
  if (!userBucketCheck(subject)) {
    return new Response(JSON.stringify({ error: "rate limited — bitte später nochmal" }), {
      status: 429, headers: jsonHeaders(req),
    });
  }

  try {
    const url = new URL(req.url);
    const wantStream = url.searchParams.get("stream") === "1";
    const { messages, app_data, user_name, lang } = await req.json();
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages fehlt" }), {
        status: 400, headers: jsonHeaders(req),
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
    const effectiveLang = typeof lang === "string" ? lang : "de";
    const systemPrompt = buildSystemPrompt(capped_app_data, user_name, effectiveLang);
    // Letzte System-Message direkt vor der Antwort — kleine LLMs
    // (gpt-4o-mini) respektieren diese Position viel zuverlässiger als
    // eine Anweisung am Anfang des Prompts (Recency-Bias).
    const langName = (LANG_INSTRUCTIONS[effectiveLang] || LANG_INSTRUCTIONS.de).name;
    const langTail = `REMINDER: respond in ${langName}. Do not switch to another language unless the user explicitly does so in their last message.`;

    // ─── Streaming-Pfad: OpenRouter-SSE → Anthropic-kompatible SSE ───
    // TransformStream-Pattern statt ReadableStream-pull():
    // imperativer, kein Close-Race, sauberes finally für Cleanup.
    if (wantStream) {
      const upstream = await callOpenRouterStream(systemPrompt, messages, langTail, langName);
      if (!upstream.ok) {
        const txt = await upstream.text();
        return new Response(JSON.stringify({ error: `OpenRouter ${upstream.status}: ${txt}` }), {
          status: 502, headers: jsonHeaders(req),
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
      console.log("[" + reqId + "] stream start, model=" + OPENROUTER_MODEL + " lang=" + effectiveLang);
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

      return new Response(readable, { headers: sseHeaders(req) });
    }

    // ─── Non-Streaming-Pfad: einmal abrufen, in altes Antwort-Format wandeln ───
    const result = await callOpenRouter(systemPrompt, messages, langTail, langName);
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
      { headers: jsonHeaders(req) }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ error: (e as Error).message }),
      { status: 500, headers: jsonHeaders(req) }
    );
  }
});
