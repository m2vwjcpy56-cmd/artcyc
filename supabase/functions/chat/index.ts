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
const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY") ?? "";
// @ts-ignore Deno-Runtime
// Default = Haiku 4.5 — deutlich schneller als Sonnet, für Coach-Use-Cases
// (Daten zusammenfassen, einzelne Sessions vorschlagen) reicht das gut.
// Per Env-Var ANTHROPIC_MODEL=claude-sonnet-4-5 wieder auf Sonnet schalten.
const ANTHROPIC_MODEL = Deno.env.get("ANTHROPIC_MODEL") ?? "claude-haiku-4-5";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Wichtig: charset=utf-8 explizit setzen, sonst rendern manche
// Mobile-Browser (iOS Safari) ü/ö/ä etc. als U+FFFD-Replacement-Char.
const JSON_HEADERS = { ...CORS_HEADERS, "Content-Type": "application/json; charset=utf-8" };
const SSE_HEADERS  = {
  ...CORS_HEADERS,
  "Content-Type": "text/event-stream; charset=utf-8",
  "Cache-Control": "no-cache, no-transform",
  "X-Accel-Buffering": "no", // verhindert dass Reverse-Proxies buffern
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
- **Bei Analyse-Fragen**: 1 Zahl/Ergebnis + 1 Satz Kontext genügt. NUR wenn der User „zeig die Daten" sagt → detaillierte Listen.
- **Maximal 6 Sätze gesamt** bei Analyse-Antworten. Maximal 8 Bullet-Punkte bei Listen-Antworten. Mehr ist Spam.
- **Tipps geben**: Wenn der User um Trainings-Empfehlungen bittet, gib konkrete Vorschläge anhand der Daten.
- **Tipps geben**: Wenn der User um Trainings-Empfehlungen bittet, gib konkrete Vorschläge anhand der Daten.
- **Schreib-Aktionen**: NIEMALS direkt ausführen. Nutze die \`propose_*\`-Tools — der User muss die Aktion danach bestätigen. Erkläre dabei kurz im Antwort-Text warum du das vorschlägst.
- **Datumsangaben**: "gestern" = ${new Date(Date.now() - 86400000).toISOString().slice(0, 10)}, "heute" = ${today}.
- **Übungs-IDs**: Wenn du eine Aktion vorschlägst, nutze die echten \`id\`-Werte aus den Daten oben — niemals erfinden.
- **Stil**: Kurz, freundlich, sportlich. Emojis sparsam (max 1 pro Antwort, nur wenn passend).

# Formatierung deiner Antworten — wichtig für saubere Anzeige

- **Absätze**: 1–3 kurze Absätze. Trenne Absätze mit einer Leerzeile (\\n\\n).
- **Listen**: Bei mehreren Punkten/Optionen IMMER Bullet-Liste mit "- " am Zeilenanfang, NICHT in Fließtext quetschen.
- **Bold sparsam**: \`**fett**\` nur für wirklich wichtige Schlüssel-Wörter (z. B. einen Übungsnamen, eine Quote). NIEMALS ganze Sätze fetten.
- **Zahlen/Quoten**: Einfach im Text als Zahl, NICHT in Bold packen ("Die Quote liegt bei 73 %." statt "Die Quote liegt bei **73 %**."). Prozentwerte werden vom Client farblich hervorgehoben — keine zusätzliche Auszeichnung nötig.
- **Keine Überschriften** (kein #/##/###).
- **Keine Code-Blöcke** (\`\`\`...\`\`\`). Inline-\`code\` nur wenn es um ein Feld in den Daten geht.
- **Keine asterisk-Auflistungen** ("* Punkt 1"). Nutze IMMER Bindestriche ("- Punkt 1").

Beispiel-Antwort (gut):
"Die schlechteste Quote hat aktuell der Maute-Sprung mit 63 %.

Schwankt zuletzt aber stark — in den letzten 4 Wochen waren es 78 %."

Beispiel-Antwort (schlecht, vermeide das):
"Die **schlechteste Quote** hat aktuell der **Maute-Sprung** mit **63 %**. Schwankt zuletzt aber stark — in den letzten 4 Wochen waren es **78 %**."

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
      max_tokens: 1500,
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

/**
 * Streaming-Variante: Fordert SSE bei Anthropic an und reicht die Events
 * 1:1 an den Client durch. Der Client rendert Text inkrementell und
 * sammelt am Ende den Tool-Use-Block für die Bestätigung.
 */
async function callAnthropicStream(systemPrompt: string, messages: any[]) {
  return await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: 1500,
      stream: true,
      system: systemPrompt,
      tools: TOOLS,
      messages,
    }),
  });
}

// @ts-ignore Deno-Runtime
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: CORS_HEADERS });
  }
  if (!ANTHROPIC_API_KEY) {
    return new Response(JSON.stringify({ error: "ANTHROPIC_API_KEY nicht konfiguriert" }), {
      status: 500,
      headers: JSON_HEADERS,
    });
  }
  try {
    const url = new URL(req.url);
    const wantStream = url.searchParams.get("stream") === "1";
    const { messages, app_data, user_name } = await req.json();
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages fehlt" }), {
        status: 400,
        headers: JSON_HEADERS,
      });
    }
    const systemPrompt = buildSystemPrompt(app_data || {}, user_name);

    // ─── Streaming-Pfad (SSE) — Default-Verhalten für niedrigere
    // Antwort-Latenz: erste Tokens kommen sofort beim Client an. ───
    if (wantStream) {
      const upstream = await callAnthropicStream(systemPrompt, messages);
      if (!upstream.ok) {
        const txt = await upstream.text();
        return new Response(JSON.stringify({ error: `Anthropic API ${upstream.status}: ${txt}` }), {
          status: 502, headers: JSON_HEADERS,
        });
      }
      // Events durchreichen + zusätzlich ein eigenes 'final'-Event mit
      // dem gesammelten action-Objekt am Ende emittieren, damit der
      // Client nicht selbst die tool_use-Blöcke zusammenpuzzlen muss.
      const reader = upstream.body!.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let textOut = "";
      const tools: any[] = []; // gesammelte tool_use-Blöcke (Index → { name, json })
      const stream = new ReadableStream({
        async pull(controller) {
          const { value, done } = await reader.read();
          if (done) {
            // 'final'-Event: aggregiertes Tool-Use
            let action: any = null;
            for (const t of tools) {
              if (!t || !t.name) continue;
              let input: any = {};
              try { input = t.json ? JSON.parse(t.json) : {}; } catch {}
              action = {
                tool: t.name,
                params: input,
                summary: (input && input.summary) || "",
              };
              break; // erstes tool_use reicht
            }
            const final = JSON.stringify({ type: "final", content: textOut, action });
            controller.enqueue(new TextEncoder().encode("event: final\ndata: " + final + "\n\n"));
            controller.close();
            return;
          }
          buf += decoder.decode(value, { stream: true });
          const parts = buf.split("\n\n");
          buf = parts.pop() ?? "";
          for (const part of parts) {
            // Anthropic-SSE schicken wir 1:1 durch
            controller.enqueue(new TextEncoder().encode(part + "\n\n"));
            // Parallel mitlesen: Text + Tool-Use sammeln
            const lines = part.split("\n");
            let eventName = "";
            let dataStr = "";
            for (const ln of lines) {
              if (ln.startsWith("event:")) eventName = ln.slice(6).trim();
              else if (ln.startsWith("data:")) dataStr += ln.slice(5).trim();
            }
            if (!dataStr) continue;
            try {
              const ev = JSON.parse(dataStr);
              if (eventName === "content_block_start" && ev.content_block?.type === "tool_use") {
                tools[ev.index] = { name: ev.content_block.name, json: "" };
              } else if (eventName === "content_block_delta") {
                if (ev.delta?.type === "text_delta") textOut += ev.delta.text || "";
                else if (ev.delta?.type === "input_json_delta") {
                  const idx = ev.index;
                  if (tools[idx]) tools[idx].json += ev.delta.partial_json || "";
                }
              }
            } catch {}
          }
        },
        cancel() { try { reader.cancel(); } catch {} }
      });
      return new Response(stream, { headers: SSE_HEADERS });
    }

    // ─── Non-Streaming-Pfad (Fallback) ───
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
          summary: (block.input && block.input.summary) || "",
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
      { headers: JSON_HEADERS }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ error: (e as Error).message }),
      { status: 500, headers: JSON_HEADERS }
    );
  }
});
