// =============================================================
// ArtCyc Coach — KI-Chat-Edge-Function (Phase 11)
// =============================================================
// Empfängt:
//   POST { messages: [{role, content}, ...], app_data: { exercises, sessions, ... } }
//   Header: Authorization: Bearer <user-jwt>
//
// Antwortet mit:
//   { content: "Antwort-Text", action?: { type, params, summary } }
//
// Schreiboperationen werden NIE direkt ausgeführt — der Assistent gibt
// `action`-Vorschläge zurück, die der Client mit Confirm/Deny bestätigt.
// =============================================================

// @ts-ignore Deno-Runtime
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY") ?? "";
const ANTHROPIC_MODEL = Deno.env.get("ANTHROPIC_MODEL") ?? "claude-sonnet-4-5-20250929";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Tools: nur Schreib-Vorschläge. Lese-Operationen erlauben wir nicht als
// Tool-Calls — die App schickt die Daten als Context ohnehin mit.
const TOOLS = [
  {
    name: "propose_create_session",
    description:
      "Schlägt vor, eine neue Trainings-Session zu protokollieren. Wird zur Bestätigung an den User geschickt — niemals direkt ausgeführt.",
    input_schema: {
      type: "object",
      properties: {
        exerciseId: { type: "string", description: "ID der Übung aus app_data.exercises" },
        date: { type: "string", description: "ISO-Datum YYYY-MM-DD" },
        entries: {
          type: "array",
          items: { type: "string", enum: ["success", "fail", "third"] },
          description: "Array der Serien-Status. 'success'=geklappt, 'fail'=nicht geklappt, 'third'=dritte Kategorie (z.B. gefährlich beim Maute-Sprung)",
        },
        withRope: { type: ["boolean", "null"], description: "Nur bei Übungen mit Seil-Variante. true=mit Seil, false=ohne Seil, null=nicht relevant" },
        notes: { type: "string", description: "Optionale Notiz" },
        summary: { type: "string", description: "Kurze deutsche Zusammenfassung für die Bestätigung" },
      },
      required: ["exerciseId", "date", "entries", "summary"],
    },
  },
  {
    name: "propose_update_session",
    description: "Ändert eine bestehende Session (z.B. Datum, Notiz, Entries, withRope korrigieren).",
    input_schema: {
      type: "object",
      properties: {
        sessionId: { type: "string", description: "ID der Session" },
        fields: {
          type: "object",
          description: "Änderungs-Objekt mit den zu setzenden Feldern (date, entries, notes, withRope)",
        },
        summary: { type: "string" },
      },
      required: ["sessionId", "fields", "summary"],
    },
  },
  {
    name: "propose_delete_session",
    description: "Löscht eine Session unwiderruflich.",
    input_schema: {
      type: "object",
      properties: {
        sessionId: { type: "string" },
        summary: { type: "string" },
      },
      required: ["sessionId", "summary"],
    },
  },
  {
    name: "propose_create_exercise",
    description: "Legt eine neue Übung an.",
    input_schema: {
      type: "object",
      properties: {
        name: { type: "string" },
        uci_code: { type: ["string", "null"] },
        uci_disc: { type: ["string", "null"] },
        category_mode: { type: "integer", enum: [2, 3] },
        third_label: { type: ["string", "null"] },
        has_rope_variant: { type: "boolean" },
        default_series: { type: "integer" },
        target_rate: { type: ["integer", "null"] },
        summary: { type: "string" },
      },
      required: ["name", "category_mode", "summary"],
    },
  },
  {
    name: "propose_update_exercise",
    description: "Ändert eine bestehende Übung.",
    input_schema: {
      type: "object",
      properties: {
        exerciseId: { type: "string" },
        fields: { type: "object" },
        summary: { type: "string" },
      },
      required: ["exerciseId", "fields", "summary"],
    },
  },
];

function buildSystemPrompt(appData: any, userName?: string): string {
  // Stark gekürzte Daten-Repräsentation
  const ex = (appData?.exercises || []).map((e: any) => ({
    id: e.id, name: e.name, uci_code: e.uci_code, uci_disc: e.uci_disc,
    category_mode: e.category_mode, third_label: e.third_label,
    has_rope_variant: !!e.has_rope_variant, active: e.active !== false,
    points: e.points, target_rate: e.target_rate,
  }));
  // Sessions in kompakter Form — max 200 neueste
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

- **Lesen + Analyse**: Du beantwortest Fragen zu den Trainings-/Wettkampfdaten direkt anhand obiger Daten. Berechne Quoten, Trends, Schwachpunkte. Sei prägnant.
- **Tipps geben**: Wenn der User um Trainings-Empfehlungen bittet, gib konkrete Vorschläge anhand der Daten.
- **Schreib-Aktionen**: NIEMALS direkt ausführen. Nutze die \`propose_*\`-Tools — der User muss die Aktion danach bestätigen. Erkläre dabei kurz im Antwort-Text warum du das vorschlägst.
- **Datumsangaben**: "gestern" = ${new Date(Date.now() - 86400000).toISOString().slice(0, 10)}, "heute" = ${today}.
- **Übungs-IDs**: Wenn du eine Aktion vorschlägst, nutze die echten \`id\`-Werte aus den Daten oben — niemals erfinden.
- **Stil**: Kurz, freundlich, sportlich. Emojis sparsam (max 1 pro Antwort, nur wenn passend). Keine Markdown-Überschriften in Antworten, nur Fließtext + ggf. Listen.

# Wichtig

- Wenn du eine Aktion vorschlägst, formuliere im Antwort-Text natürlich was du tun willst. Das Tool-Call ist die strukturierte Form für die App, dein Text ist für den User.
- Die App-Daten oben sind ein Snapshot — bei Schreib-Aktionen ist die App selbst die Wahrheit, nicht du.
- Bei mehrdeutigen Aufträgen frag erst nach (im Text), nicht direkt vorschlagen.`;
}

async function callAnthropic(systemPrompt: string, messages: any[]) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: 2048,
      system: systemPrompt,
      tools: TOOLS,
      messages,
    }),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Anthropic API ${res.status}: ${txt}`);
  }
  return await res.json();
}

// @ts-ignore Deno
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: CORS_HEADERS });
  }
  if (!ANTHROPIC_API_KEY) {
    return new Response(JSON.stringify({ error: "ANTHROPIC_API_KEY nicht konfiguriert" }), {
      status: 500,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }
  try {
    const { messages, app_data, user_name } = await req.json();
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages fehlt" }), {
        status: 400,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }
    const systemPrompt = buildSystemPrompt(app_data || {}, user_name);
    const result = await callAnthropic(systemPrompt, messages);

    // Antwort zerlegen: Text + optional ein Tool-Use-Block (Action-Proposal)
    let text = "";
    let action: any = null;
    for (const block of result.content || []) {
      if (block.type === "text") text += block.text;
      else if (block.type === "tool_use") {
        action = {
          tool: block.name,
          params: block.input || {},
          summary: (block.input && block.input.summary) || "Aktion ausführen",
        };
      }
    }

    return new Response(
      JSON.stringify({
        content: text || (action ? "Ich schlage folgende Aktion vor:" : ""),
        action,
        stop_reason: result.stop_reason,
        usage: result.usage,
      }),
      { headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ error: (e as Error).message }),
      { status: 500, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  }
});
