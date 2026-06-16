// =============================================================
// ArtCyc Coach — Vereins-Normalisierung (KI-Abgleich)
// =============================================================
//
// Nimmt einen frei eingegebenen Vereinsnamen + eine kleine Liste bereits
// bekannter Vereine und liefert per LLM (OpenRouter) eine bereinigte,
// kanonische Schreibweise zurück — inkl. Dubletten-Erkennung gegen die
// Kandidaten und einer Plausibilitäts-Einschätzung.
//
// Antwort-JSON:
//   { canonical: string, country: string, isClub: boolean, duplicateOf: string|null }
//
// Wird vom Client (SportlerView) aufgerufen, wenn ein NEUER Verein
// eingegeben wurde (nicht in kuratierter/bekannter Liste). Auth über die
// Supabase-JWT-Boundary (verify_jwt = on).
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

// Einfaches In-Memory-Rate-Limit pro Instanz (gegen Einzeltäter-Spam).
const RL_WINDOW_MS = 10 * 60_000;
const RL_MAX = 60;
const buckets = new Map<string, number[]>();
function rlOk(key: string): boolean {
  const now = Date.now();
  const arr = (buckets.get(key) ?? []).filter(ts => now - ts < RL_WINDOW_MS);
  if (arr.length >= RL_MAX) { buckets.set(key, arr); return false; }
  arr.push(now); buckets.set(key, arr); return true;
}

function extractJson(text: string): any | null {
  if (!text) return null;
  // ```json ... ``` oder rohes Objekt herausziehen
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = fenced ? fenced[1] : text;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1 || end < start) return null;
  try { return JSON.parse(raw.slice(start, end + 1)); } catch { return null; }
}

// @ts-ignore Deno-Runtime
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders(req) });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "method not allowed" }), { status: 405, headers: jsonHeaders(req) });
  }
  if (!OPENROUTER_API_KEY) {
    return new Response(JSON.stringify({ error: "OPENROUTER_API_KEY fehlt" }), { status: 500, headers: jsonHeaders(req) });
  }

  // Rate-Limit-Key: JWT-Subject (sub) grob aus dem Bearer-Token, sonst IP.
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
  const name = String(body?.name ?? "").trim().slice(0, 120);
  const candidates: string[] = Array.isArray(body?.candidates)
    ? body.candidates.map((c: any) => String(c)).filter(Boolean).slice(0, 40)
    : [];
  if (!name) {
    return new Response(JSON.stringify({ error: "no name" }), { status: 400, headers: jsonHeaders(req) });
  }

  const system =
    "Du bist Experte für Kunstradsport-Vereine (artistic cycling, UCI) im deutschsprachigen Raum (DE/AT/CH) und international. " +
    "Du normalisierst frei eingegebene Vereinsnamen. Antworte AUSSCHLIESSLICH mit einem JSON-Objekt, kein Fließtext.";
  const user =
    "Eingegebener Verein: \"" + name + "\"\n\n" +
    "Bekannte Vereine (Kandidaten für Dubletten):\n" +
    (candidates.length ? candidates.map(c => "- " + c).join("\n") : "(keine)") + "\n\n" +
    "Aufgabe: Gib JSON zurück mit:\n" +
    "  canonical    = saubere, korrekte Schreibweise des Vereinsnamens (übliche Abkürzung wie RV/RSV/RMSV/RKV/RC beibehalten, Tippfehler korrigieren, sinnvolle Groß-/Kleinschreibung).\n" +
    "  country      = ISO-Ländercode (DE, AT, CH, CZ, JP, HK, BE, US, HU …) oder \"\" wenn unklar.\n" +
    "  isClub       = true, wenn es plausibel ein echter (Kunstrad-)Verein ist, sonst false.\n" +
    "  duplicateOf  = exakt einer der Kandidaten-Namen, falls die Eingabe denselben Verein meint (Variante/Tippfehler); sonst null.\n\n" +
    "Beispiel: {\"canonical\":\"RV Pfeil Magstadt\",\"country\":\"DE\",\"isClub\":true,\"duplicateOf\":null}";

  let aiText = "";
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
        temperature: 0,
        max_tokens: 200,
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
    aiText = j?.choices?.[0]?.message?.content ?? "";
  } catch (e) {
    return new Response(JSON.stringify({ error: "llm fetch failed" }), { status: 502, headers: jsonHeaders(req) });
  }

  const parsed = extractJson(aiText) || {};
  // Defensive Defaults + Dublette nur akzeptieren, wenn sie wirklich Kandidat ist.
  const out = {
    canonical: typeof parsed.canonical === "string" && parsed.canonical.trim() ? parsed.canonical.trim() : name,
    country: typeof parsed.country === "string" ? parsed.country.trim().toUpperCase().slice(0, 2) : "",
    isClub: parsed.isClub !== false,
    duplicateOf: (typeof parsed.duplicateOf === "string" && candidates.includes(parsed.duplicateOf))
      ? parsed.duplicateOf : null,
  };
  return new Response(JSON.stringify(out), { headers: jsonHeaders(req) });
});
