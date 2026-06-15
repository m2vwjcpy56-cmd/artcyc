// =============================================================
// ArtCyc Coach — Wertungsbogen-Bilderkennung (Vision, via OpenRouter)
// =============================================================
//
// Liest ein Foto/Scan eines Wertungsbogens per Vision-LLM aus und gibt
// strukturierte Stammdaten + Footer-Werte als JSON zurück. Deutlich robuster
// als clientseitiges OCR (Tesseract) bei Fotos.
//
// Body:  { image: "data:image/jpeg;base64,…" }   (oder reines base64)
// Antwort: { ok: true, data: { …Felder… } }  |  { ok:false, error }
//
// Default-Modell: google/gemini-2.5-flash (vision-fähig, günstig). Override
// via Supabase-Secret OPENROUTER_VISION_MODEL. OPENROUTER_API_KEY wird
// projektweit geteilt.
// =============================================================

// @ts-ignore Deno-Runtime
const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY") ?? "";
// @ts-ignore Deno-Runtime
const VISION_MODEL = Deno.env.get("OPENROUTER_VISION_MODEL") ?? Deno.env.get("OPENROUTER_MODEL") ?? "google/gemini-2.5-flash";
// @ts-ignore Deno-Runtime
const APP_REFERER = Deno.env.get("APP_REFERER") ?? "https://artcyc.vercel.app";
// @ts-ignore Deno-Runtime
const APP_TITLE = Deno.env.get("APP_TITLE") ?? "ArtCyc Coach";

// @ts-ignore Deno-Runtime resolution
import { corsHeaders, jsonHeaders } from "../_shared/cors.ts";

const MAX_BODY_BYTES = 12 * 1024 * 1024; // Fotos sind groß; Client komprimiert vorher

const SYSTEM_PROMPT = `Du liest deutsche Kunstrad-„Wertungsberichte/Wertungsblätter" aus einem Foto.
Gib AUSSCHLIESSLICH ein JSON-Objekt zurück (kein Text, keine Code-Fences) mit genau diesen Schlüsseln:
{
 "wettbewerb": string|null, "ort": string|null, "ausrichter": string|null,
 "startnr": string|null, "starter": string|null, "verein": string|null,
 "disziplin": string|null, "datum": "YYYY-MM-DD"|null,
 "kg1_ausfuehrung": number|null, "kg2_ausfuehrung": number|null,
 "kg1_schwierigkeit": number|null, "kg2_schwierigkeit": number|null,
 "kg1_gesamtabzug": number|null, "kg2_gesamtabzug": number|null,
 "kg1_ausgefahren": number|null, "kg2_ausgefahren": number|null,
 "aufgestellt": number|null, "endergebnis": number|null
}
Regeln:
- Zahlen mit Dezimalpunkt (deutsches Komma → Punkt). Keine Tausenderpunkte.
- Es gibt zwei Kampfgerichte (KG1 links, KG2 rechts) je für Ausführung/Schwierigkeit/Gesamtabzug/Ausgefahrene Punkte.
- "Aufgestellte Punkte" = aufgestellt. "Endergebnis" = endergebnis.
- Wenn ein Feld nicht sicher lesbar ist: null. Nicht raten.
- Antworte NUR mit dem JSON-Objekt.`;

function parseJsonLoose(txt: string): any {
  if (!txt) return null;
  let s = txt.trim();
  // Code-Fences entfernen
  s = s.replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
  // Erstes {...} herausziehen
  const a = s.indexOf("{");
  const b = s.lastIndexOf("}");
  if (a >= 0 && b > a) s = s.slice(a, b + 1);
  try { return JSON.parse(s); } catch { /* weiter unten salvage */ }
  // Salvage bei Truncation: das (oft riesige) exercises-Array abschneiden und
  // wenigstens die Stammdaten retten.
  try {
    let core = s.replace(/,\s*"exercises"\s*:\s*\[[\s\S]*$/, "");
    core = core.replace(/,\s*$/, "");
    if (!core.trim().endsWith("}")) core = core.trim() + "}";
    return JSON.parse(core);
  } catch { return null; }
}

// @ts-ignore Deno-Runtime
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders(req) });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: corsHeaders(req) });
  if (!OPENROUTER_API_KEY) {
    return new Response(JSON.stringify({ ok: false, error: "OPENROUTER_API_KEY nicht konfiguriert" }), { status: 500, headers: jsonHeaders(req) });
  }
  const contentLength = parseInt(req.headers.get("content-length") || "0", 10);
  if (contentLength > MAX_BODY_BYTES) {
    return new Response(JSON.stringify({ ok: false, error: "Bild zu groß" }), { status: 413, headers: jsonHeaders(req) });
  }

  try {
    const { image } = await req.json();
    if (!image || typeof image !== "string") {
      return new Response(JSON.stringify({ ok: false, error: "image fehlt" }), { status: 400, headers: jsonHeaders(req) });
    }
    const dataUrl = image.startsWith("data:") ? image : ("data:image/jpeg;base64," + image);

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + OPENROUTER_API_KEY,
        "HTTP-Referer": APP_REFERER,
        "X-Title": APP_TITLE,
      },
      body: JSON.stringify({
        model: VISION_MODEL,
        temperature: 0,
        max_tokens: 1200,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: [
              { type: "text", text: "Lies diesen Wertungsbogen aus und gib das JSON zurück." },
              { type: "image_url", image_url: { url: dataUrl } },
            ],
          },
        ],
      }),
    });
    if (!res.ok) {
      const txt = await res.text();
      return new Response(JSON.stringify({ ok: false, error: `Vision ${res.status}: ${txt.slice(0, 300)}` }), { status: 502, headers: jsonHeaders(req) });
    }
    const json = await res.json();
    const content = json?.choices?.[0]?.message?.content || "";
    const data = parseJsonLoose(typeof content === "string" ? content : JSON.stringify(content));
    if (!data) {
      return new Response(JSON.stringify({ ok: false, error: "Antwort nicht lesbar" }), { status: 502, headers: jsonHeaders(req) });
    }
    return new Response(JSON.stringify({ ok: true, data }), { status: 200, headers: jsonHeaders(req) });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String((e as Error)?.message || e) }), { status: 500, headers: jsonHeaders(req) });
  }
});
