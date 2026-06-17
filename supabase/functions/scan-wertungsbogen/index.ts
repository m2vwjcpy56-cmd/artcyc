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
// Stärkeres Modell für die schwierige Übungstabelle (Markierungen zählen).
// @ts-ignore Deno-Runtime
const VISION_TABLE_MODEL = Deno.env.get("OPENROUTER_VISION_TABLE_MODEL") ?? "google/gemini-2.5-pro";
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
{ "exercises": [ { "points": number|null, "confidence": number,
                   "kg1": {"x":number,"w":number,"s":number,"k":number,"schw":number},
                   "kg2": {"x":number,"w":number,"s":number,"k":number,"schw":number} } ] }
Eine Zeile pro Übung, in der REIHENFOLGE von oben nach unten. Pro Übung und je Kampfgericht ZÄHLE die tatsächlich eingetragenen Fehlerzeichen:
 x = Anzahl Kreuze, w = Anzahl Wellen (~), s = Anzahl Striche (|), k = Anzahl Kreise/Stürze (○).
 schw = Schwierigkeits-Abwertung in Prozent — NUR einer der Werte 0, 10, 50 oder 100 (leere Zelle = 0).
 confidence = deine Sicherheit für DIESE Zeile, 0.0 (geraten) bis 1.0 (eindeutig).
ARBEITSWEISE: Gehe Zeile für Zeile vor. Lies jede der Spaltengruppen X (Kreuze), W (Wellen), S (Striche), K (Kreise) für KG1 (linke Hälfte) und KG2 (rechte Hälfte) getrennt. Zähle die Zeichen je Zelle einzeln.
STRENGE REGELN:
- Leere oder durchgestrichene Zelle = 0. Erfinde KEINE Zeichen. Im Zweifel 0 und niedrige confidence.
- Punktwerte aus der Pkte-/Aufwertungs-Spalte (z. B. 5,8 oder 10,0) gehören NICHT in x/w/s/k/schw. Trage dort NIEMALS Punktwerte ein.
- Gib KEINE taktische Aufwertung aus (dieses Feld gibt es hier bewusst nicht).
- "points" = der gedruckte Punktwert der Übung (Pkte-Spalte), nicht die Summe.
- Tabelle nicht sicher lesbar → "exercises": []. Lieber leer als geraten. NUR das JSON.`;

// Baut den Tabellen-Prompt mit optionalen Ankern: bekannte Punktfolge (Anzahl +
// Reihenfolge der Übungen) und ein Korrektur-Hinweis aus der Footer-Prüfsumme.
function buildExPrompt(programPoints: number[] | null, correction: string | null): string {
  let p = EX_PROMPT;
  if (programPoints && programPoints.length) {
    p += `\n\nANKER: Es gibt GENAU ${programPoints.length} Übungen, in dieser Reihenfolge mit diesen Punktwerten (Pkte-Spalte): [${programPoints.map((n) => Number(n).toFixed(1)).join(", ")}]. Gib exakt ${programPoints.length} Einträge zurück, Zeile i passt zu Punktwert i. Nutze die Punktwerte, um die richtige Zeile zu finden.`;
  }
  if (correction && correction.trim()) {
    p += `\n\nKORREKTUR: Ein erster Lesevorgang ergab falsche Summen. ${correction.trim()} Prüfe die Markierungen besonders sorgfältig erneut (häufig: Kreise ○ mit Kreuzen x verwechselt, oder Zeichen in der falschen KG-Hälfte gezählt).`;
  }
  return p;
}

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

async function callVision(systemPrompt: string, dataUrl: string, maxTokens: number, model?: string) {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + OPENROUTER_API_KEY,
      "HTTP-Referer": APP_REFERER,
      "X-Title": APP_TITLE,
    },
    body: JSON.stringify({
      model: model || VISION_MODEL,
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

// Bereinigt eine Übungs-Zeile aus der Vision-Antwort — der EINZIGE Chokepoint,
// daher hart absichern (schützt auch alte, gecachte Frontend-Versionen):
//  • takt (taktische Aufwertung) wird IMMER entfernt — sie wurde aus Fotos
//    halluziniert (Übungen sprangen fälschlich auf 10,0). Über PDF bleibt sie exakt.
//  • Symbol-Zähler (x/w/s/k): nur kleine, ganze Zahlen 0..20; alles andere
//    (z. B. ein verlesener Punktwert wie 5,8) → 0.
//  • schw: nur die zulässigen Stufen 0/10/50/100; alles andere → 0.
function sanitizeExerciseRow(row: any): any {
  const cnt = (v: any) => {
    const n = Number(v);
    if (!Number.isFinite(n) || n < 0 || n > 20 || n !== Math.round(n)) return 0;
    return n;
  };
  const schw = (v: any) => {
    const n = Number(v);
    return (n === 0 || n === 10 || n === 50 || n === 100) ? n : 0;
  };
  const kg = (k: any) => ({
    x: cnt(k?.x), w: cnt(k?.w), s: cnt(k?.s), k: cnt(k?.k), schw: schw(k?.schw),
    // takt bewusst NICHT übernommen
  });
  const pts = Number(row?.points);
  const conf = Number(row?.confidence);
  return {
    points: Number.isFinite(pts) ? pts : null,
    confidence: Number.isFinite(conf) ? Math.max(0, Math.min(1, conf)) : null,
    kg1: kg(row?.kg1),
    kg2: kg(row?.kg2),
  };
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
    const body = await req.json();
    const image = body?.image;
    if (!image || typeof image !== "string") {
      return new Response(JSON.stringify({ ok: false, error: "image fehlt" }), { status: 400, headers: jsonHeaders(req) });
    }
    const dataUrl = image.startsWith("data:") ? image : ("data:image/jpeg;base64," + image);
    // Optionale Anker/Steuerung vom Client:
    const programPoints = Array.isArray(body?.programPoints)
      ? body.programPoints.map((n: any) => Number(n)).filter((n: number) => Number.isFinite(n))
      : null;
    const correction = typeof body?.correction === "string" ? body.correction : null;
    const tableModel = typeof body?.tableModel === "string" && body.tableModel ? body.tableModel : VISION_TABLE_MODEL;
    // Wenn nur die Tabelle neu gelesen werden soll (Korrektur-Durchlauf), Stammdaten überspringen.
    const tableOnly = body?.tableOnly === true;

    // 1) Stammdaten — muss klappen (außer im reinen Korrektur-Durchlauf)
    let stammData: any = {};
    if (!tableOnly) {
      const stamm = await callVision(STAMM_PROMPT, dataUrl, 1200);
      if (!stamm.data) {
        return new Response(JSON.stringify({ ok: false, error: stamm.error || "Antwort nicht lesbar" }), { status: 502, headers: jsonHeaders(req) });
      }
      stammData = stamm.data;
    }

    // 2) Übungstabelle — stärkeres Modell, mit Anker + optionaler Korrektur.
    let exercises: any[] = [];
    let exDebug: string | null = null;
    try {
      const ex = await callVision(buildExPrompt(programPoints, correction), dataUrl, 6000, tableModel);
      if (ex.data && Array.isArray(ex.data.exercises)) exercises = ex.data.exercises.map(sanitizeExerciseRow);
      if (exercises.length === 0) exDebug = (ex.error || ex.raw || "").slice(0, 600);
    } catch (e) { exDebug = "Ausnahme: " + String((e as Error)?.message || e); }

    return new Response(JSON.stringify({ ok: true, data: { ...stammData, exercises, _exDebug: exDebug, _tableModel: tableModel } }), { status: 200, headers: jsonHeaders(req) });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String((e as Error)?.message || e) }), { status: 500, headers: jsonHeaders(req) });
  }
});
