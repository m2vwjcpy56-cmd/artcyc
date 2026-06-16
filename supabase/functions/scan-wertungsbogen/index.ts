// =============================================================
// ArtCyc Coach — Wertungsbogen-Bilderkennung (Vision, via OpenRouter)
// =============================================================
//
// Liest ein Foto/Scan eines Wertungsbogens per Vision-LLM aus.
// ZWEI getrennte Calls, damit die (schwierige) Übungstabelle den (zuverlässigen)
// Stammdaten-Call NICHT umkippt:
//   1) Stammdaten + Footer (Endergebnis/KG)  — muss klappen
//   2) Übungstabelle pro Zeile (x/~/|/○ + Schw% + taktisch je KG)  — best effort
//
// Body:  { image: "data:image/jpeg;base64,…" }
// Antwort: { ok:true, data:{ …stammdaten…, exercises:[…] } }  | { ok:false, error }
//
// Default-Modell: google/gemini-2.5-flash (vision). Override via
// OPENROUTER_VISION_MODEL. OPENROUTER_API_KEY ist projektweit gesetzt.
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

const MAX_BODY_BYTES = 12 * 1024 * 1024;

const STAMM_PROMPT = `Du liest deutsche Kunstrad-„Wertungsberichte/Wertungsblätter" aus einem Foto.
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
Feld-Regeln (WICHTIG — Felder NICHT vermischen, je Wert NUR aus dem zugehörigen Label):
- "wettbewerb": NUR der kurze Veranstaltungsname (z. B. „Kreismeisterschaft", „Deutsche Meisterschaft", „German Masters"). OHNE Disziplin, OHNE Verein/Ort/Region.
- "disziplin": die Disziplin separat (z. B. „1er Kunstradsport Männer Elite").
- "ausrichter": der AUSRICHTENDE VEREIN — der Wert direkt hinter dem Label „Ausrichter" (z. B. „RC Oberesslingen"; Vereinskürzel wie RCO/RKV beibehalten). NICHT der „Radsportkreis …"/die Region, NICHT der Ort, NICHT die Vereine der Kampfrichter (Ansager/Schreiber).
- "ort": der Austragungsort.
Zahlen mit Dezimalpunkt (Komma→Punkt). Zwei Kampfgerichte (KG1 links, KG2 rechts).
"Aufgestellte Punkte"=aufgestellt, "Endergebnis"=endergebnis. Unsicher → null. NUR das JSON.`;

const EX_PROMPT = `Du liest die ÜBUNGSTABELLE eines deutschen Kunstrad-Wertungsbogens aus einem Foto.
Gib AUSSCHLIESSLICH ein JSON-Objekt zurück (kein Text, keine Code-Fences):
{ "exercises": [ { "points": number|null,
                   "kg1": {"x":number,"w":number,"s":number,"k":number,"schw":number},
                   "kg2": {"x":number,"w":number,"s":number,"k":number,"schw":number} } ] }
Eine Zeile pro Übung, in der REIHENFOLGE von oben nach unten. Pro Übung und je Kampfgericht ZÄHLE die tatsächlich eingetragenen Fehlerzeichen:
 x = Anzahl Kreuze, w = Anzahl Wellen (~), s = Anzahl Striche (|), k = Anzahl Kreise/Stürze (○).
 schw = Schwierigkeits-Abwertung in Prozent — NUR einer der Werte 0, 10, 50 oder 100 (leere Zelle = 0).
STRENGE REGELN:
- Leere oder durchgestrichene Zelle = 0. Erfinde KEINE Zeichen. Im Zweifel 0.
- Punktwerte aus der Pkte-/Aufwertungs-Spalte (z. B. 5,8 oder 10,0) gehören NICHT in x/w/s/k/schw. Trage dort NIEMALS Punktwerte ein.
- Gib KEINE taktische Aufwertung aus (dieses Feld gibt es hier bewusst nicht).
- "points" = der gedruckte Punktwert der Übung (Pkte-Spalte), nicht die Summe.
- Tabelle nicht sicher lesbar → "exercises": []. Lieber leer als geraten. NUR das JSON.`;

function parseJsonLoose(txt: string): any {
  if (!txt) return null;
  let s = String(txt).trim().replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
  const a = s.indexOf("{"); const b = s.lastIndexOf("}");
  if (a >= 0 && b > a) s = s.slice(a, b + 1);
  try { return JSON.parse(s); } catch { /* salvage unten */ }
  try {
    let core = s.replace(/,\s*"exercises"\s*:\s*\[[\s\S]*$/, "");
    core = core.replace(/,\s*$/, "");
    if (!core.trim().endsWith("}")) core = core.trim() + "}";
    return JSON.parse(core);
  } catch { return null; }
}

async function callVision(systemPrompt: string, dataUrl: string, maxTokens: number) {
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
      max_tokens: maxTokens,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: [
          { type: "text", text: "Lies den Wertungsbogen und gib das JSON zurück." },
          { type: "image_url", image_url: { url: dataUrl } },
        ] },
      ],
    }),
  });
  if (!res.ok) return { data: null, raw: "", error: `Vision ${res.status}: ${(await res.text()).slice(0, 200)}` };
  const json = await res.json();
  const content = json?.choices?.[0]?.message?.content || "";
  const raw = typeof content === "string" ? content : JSON.stringify(content);
  return { data: parseJsonLoose(raw), raw, error: null };
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

    // 1) Stammdaten — muss klappen
    const stamm = await callVision(STAMM_PROMPT, dataUrl, 1200);
    if (!stamm.data) {
      return new Response(JSON.stringify({ ok: false, error: stamm.error || "Antwort nicht lesbar" }), { status: 502, headers: jsonHeaders(req) });
    }

    // 2) Übungstabelle — best effort, darf nicht fehlschlagen lassen
    let exercises: any[] = [];
    let exDebug: string | null = null;
    try {
      const ex = await callVision(EX_PROMPT, dataUrl, 4000);
      if (ex.data && Array.isArray(ex.data.exercises)) exercises = ex.data.exercises;
      if (exercises.length === 0) exDebug = (ex.error || ex.raw || "").slice(0, 600);
    } catch (e) { exDebug = "Ausnahme: " + String((e as Error)?.message || e); }

    return new Response(JSON.stringify({ ok: true, data: { ...stamm.data, exercises, _exDebug: exDebug } }), { status: 200, headers: jsonHeaders(req) });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String((e as Error)?.message || e) }), { status: 500, headers: jsonHeaders(req) });
  }
});
