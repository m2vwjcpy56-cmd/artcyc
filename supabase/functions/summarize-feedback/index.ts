// =============================================================
// ArtCyc Coach — Feedback-Zusammenfassung (KI)
// =============================================================
//
// Nimmt die Feedback-Einträge zu EINER Übung (Fehlerbild + Handlungsanweisung)
// und liefert eine kurze, prägnante deutsche Zusammenfassung: wiederkehrende
// Fehlerbilder + die wichtigsten Handlungsanweisungen. Damit sieht man auf
// einen Blick „woran arbeite ich bei dieser Übung".
//
// Antwort-JSON: { summary: string }
// Auth über Supabase-JWT-Boundary (verify_jwt = on).
// =============================================================

// @ts-ignore Deno-Runtime
const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY") ?? "";
// @ts-ignore Deno-Runtime
const OPENROUTER_MODEL   = Deno.env.get("OPENROUTER_MODEL") ?? "google/gemini-2.5-flash";
// @ts-ignore Deno-Runtime
const APP_REFERER        = Deno.env.get("APP_REFERER") ?? "https://artcyc.vercel.app";
// @ts-ignore Deno-Runtime
const APP_TITLE          = Deno.env.get("APP_TITLE")   ?? "ArtCyc Coach";

// @ts-ignore Deno-Runtime resolution
import { corsHeaders, jsonHeaders } from "../_shared/cors.ts";

const RL_WINDOW_MS = 10 * 60_000;
const RL_MAX = 40;
const buckets = new Map<string, number[]>();
function rlOk(key: string): boolean {
  const now = Date.now();
  const arr = (buckets.get(key) ?? []).filter(ts => now - ts < RL_WINDOW_MS);
  if (arr.length >= RL_MAX) { buckets.set(key, arr); return false; }
  arr.push(now); buckets.set(key, arr); return true;
}

// @ts-ignore Deno-Runtime
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders(req) });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "method not allowed" }), { status: 405, headers: jsonHeaders(req) });
  }
  if (!OPENROUTER_API_KEY) {
    return new Response(JSON.stringify({ error: "OPENROUTER_API_KEY fehlt" }), { status: 500, headers: jsonHeaders(req) });
  }

  let rlKey = req.headers.get("x-forwarded-for") || "anon";
  const auth = req.headers.get("authorization") || "";
  const m = auth.match(/^Bearer\s+(.+)$/i);
  if (m) {
    try {
      const payload = JSON.parse(atob(m[1].split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
      if (payload?.sub) rlKey = String(payload.sub);
    } catch { /* egal */ }
  }
  if (!rlOk(rlKey)) {
    return new Response(JSON.stringify({ error: "rate limit" }), { status: 429, headers: jsonHeaders(req) });
  }

  let body: any;
  try { body = await req.json(); } catch { body = {}; }
  const exercise = String(body?.exercise ?? "").slice(0, 120);
  const items: any[] = Array.isArray(body?.items) ? body.items.slice(0, 60) : [];
  if (items.length === 0) {
    return new Response(JSON.stringify({ summary: "" }), { headers: jsonHeaders(req) });
  }

  const lines = items.map((it: any, i: number) => {
    const f = String(it?.fehlerbild ?? "").slice(0, 400).trim();
    const h = String(it?.handlungsanweisung ?? "").slice(0, 400).trim();
    return `${i + 1}. Fehlerbild: ${f || "—"} | Tipp: ${h || "—"}`;
  }).join("\n");

  const system =
    "Du bist Kunstradsport-Trainer (artistic cycling, UCI). Fasse Trainer-Feedback zu EINER Übung " +
    "knapp und konkret auf Deutsch zusammen. Keine Einleitung, kein Markdown, maximal 3 kurze Sätze. " +
    "Nenne die wiederkehrenden Fehlerbilder und die wichtigsten Handlungsanweisungen. Sprich den Sportler mit „du\" an.";
  const user =
    `Übung: ${exercise || "(unbenannt)"}\nFeedback-Einträge (${items.length}):\n${lines}\n\n` +
    "Gib NUR die Zusammenfassung als Fließtext zurück.";

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + OPENROUTER_API_KEY,
        "Content-Type": "application/json",
        "HTTP-Referer": APP_REFERER,
        "X-Title": APP_TITLE,
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        temperature: 0.2,
        max_tokens: 220,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });
    if (!res.ok) {
      const t = await res.text();
      return new Response(JSON.stringify({ error: "llm " + res.status, detail: t.slice(0, 200) }), { status: 502, headers: jsonHeaders(req) });
    }
    const j = await res.json();
    const summary = (j?.choices?.[0]?.message?.content ?? "").trim();
    return new Response(JSON.stringify({ summary }), { headers: jsonHeaders(req) });
  } catch (e) {
    return new Response(JSON.stringify({ error: "llm fetch failed" }), { status: 502, headers: jsonHeaders(req) });
  }
});
