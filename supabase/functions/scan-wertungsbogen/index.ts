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
// Modell für die Übungstabelle. Standard = schnelles Flash (Pro war zu langsam
// → Edge-Timeouts/Totalausfall). Bei Bedarf per Env auf ein stärkeres Modell.
// @ts-ignore Deno-Runtime
const VISION_TABLE_MODEL = Deno.env.get("OPENROUTER_VISION_TABLE_MODEL") ?? "google/gemini-2.5-flash";
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

const EX_PROMPT = `Du liest die ÜBUNGSTABELLE eines deutschen Kunstrad-Wertungsbogens (Foto) Zeile für Zeile ab.
Die Datenspalten stehen in Dreiergruppen — je Gruppe EINE Spalte pro Kampfgericht (KG1, KG2, KG3; KG3 ist meist leer):
  P = Schwierigkeit in % , X = Kreuze, W = Wellen (~), S = Striche (|), K = Kreise/Sturz (○).
In JEDER Zelle steht eine ZAHL (die Anzahl bzw. der %-Wert) ODER die Zelle ist leer (= 0). Lies die EINGETRAGENE ZAHL ab — du zählst NICHTS und erfindest NICHTS.
Gib AUSSCHLIESSLICH dieses JSON zurück (kein Text, keine Code-Fences):
{ "rows": [ { "points": number|null, "code": string|null, "name": string|null, "confidence": number,
              "P":[kg1,kg2,kg3], "X":[kg1,kg2,kg3], "W":[kg1,kg2,kg3], "S":[kg1,kg2,kg3], "K":[kg1,kg2,kg3] } ] }
REGELN:
- Die Tabelle hat gedruckte horizontale LINIEN — jede gedruckte Zeile ist GENAU eine Übung. Ordne jede handschriftliche Zahl der Zeile zu, auf deren Linie sie steht (NICHT der Zeile darüber oder darunter).
- Gib JEDE gedruckte Zeile aus — auch komplett leere (dann alle Werte 0). NIEMALS Zeilen überspringen, zusammenfassen oder zusätzliche erfinden.
- "points" und "code" sind GEDRUCKT — exakt ablesen, sie sind der Anker für die Zuordnung. "points" = Punktwert aus der Pkte-Spalte (z. B. 5,8).
- "code" = der gedruckte Übungs-Code aus der Code-Spalte (Überschrift ACA/CBMC o. ä.), z. B. "1175c" (vier Ziffern, evtl. mit Kleinbuchstabe). Wenn nicht lesbar: null.
- "name" = der Übungstext aus der linken Spalte (z. B. "Drehsprung"). Wenn nicht lesbar: null.
- Leere Zelle = 0. X/W/S/K sind kleine ganze Zahlen (0–9). P ist 0, 10, 50 oder 100.
- Jede Gruppe hat GENAU 3 Werte (KG1, KG2, KG3) — fehlt eine Spalte, trage 0 ein.
- Verwechsle die Spaltengruppen NICHT: % (Schwierigkeit) ≠ X (Kreuze). Punktwerte gehören NUR in "points".
- confidence: 0.0 (geraten) bis 1.0 (eindeutig) für diese Zeile.
- Gib so viele Zeilen aus, wie du erkennst (im Zweifel Werte 0, aber Zeile trotzdem ausgeben). NUR das JSON.

FORMAT-BEISPIEL (nur zur Veranschaulichung der Spalten-Zuordnung — NICHT abschreiben, immer die echten Zahlen vom Foto lesen):
Eine Zeile mit Code „1175c", Übung „Drehsprung", Punktwert 5,8 — im Foto steht in der %-Gruppe (Schwierigkeit) bei KG2 eine 10, in der X-Gruppe (Kreuze) bei KG1 eine 1, sonst alle Zellen leer → so wird sie ausgegeben:
{ "points":5.8, "code":"1175c", "name":"Drehsprung", "confidence":0.9, "P":[0,10,0], "X":[1,0,0], "W":[0,0,0], "S":[0,0,0], "K":[0,0,0] }
Beachte: Die %-Zahl (10/50/100) gehört in "P", NICHT in "X". Eine kleine Anzahl-Ziffer (1, 2 …) gehört in X/W/S/K. KG3 (dritter Wert) ist meist 0.`;

// Baut den Tabellen-Prompt mit optionalen Ankern: bekannte Punktfolge (Anzahl +
// Reihenfolge der Übungen) und ein Korrektur-Hinweis aus der Footer-Prüfsumme.
function buildExPrompt(programPoints: number[] | null, correction: string | null): string {
  let p = EX_PROMPT;
  if (programPoints && programPoints.length) {
    p += `\n\nANKER: Es gibt GENAU ${programPoints.length} Übungen, in dieser Reihenfolge mit diesen Punktwerten (Pkte-Spalte): [${programPoints.map((n) => Number(n).toFixed(1)).join(", ")}]. Gib exakt ${programPoints.length} Zeilen zurück, Zeile i passt zu Punktwert i.`;
  }
  if (correction && correction.trim()) {
    p += `\n\nKORREKTUR: Ein erster Lesevorgang ergab falsche Summen. ${correction.trim()} Prüfe die abgelesenen Zahlen besonders sorgfältig erneut (häufig: Wert in der falschen Spaltengruppe oder falschen KG-Spalte abgelesen).`;
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
    let core = s.replace(/,\s*"(?:exercises|rows)"\s*:\s*\[[\s\S]*$/, "");
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
// Neue Roh-Raster-Form: P/X/W/S/K sind je ein Array [KG1, KG2, KG3].
// Wir geben sie bereinigt zurück; die Spalten→KG/Symbol-Semantik wendet der
// Client an (exakt wie der PDF-Parser).
function sanitizeExerciseRow(row: any): any {
  const cnt = (v: any) => { const n = Number(v); return (Number.isFinite(n) && n >= 0 && n <= 20) ? Math.round(n) : 0; };
  const pct = (v: any) => { const n = Number(v); return (n === 0 || n === 10 || n === 50 || n === 100) ? n : 0; };
  const triple = (a: any, f: (v: any) => number) => { const arr = Array.isArray(a) ? a : []; return [f(arr[0]), f(arr[1]), f(arr[2])]; };
  const pts = Number(row?.points);
  const conf = Number(row?.confidence);
  const str = (v: any) => (typeof v === "string" && v.trim()) ? v.trim().slice(0, 80) : null;
  return {
    points: Number.isFinite(pts) ? pts : null,
    code: str(row?.code),
    name: str(row?.name),
    confidence: Number.isFinite(conf) ? Math.max(0, Math.min(1, conf)) : null,
    P: triple(row?.P, pct),
    X: triple(row?.X, cnt),
    W: triple(row?.W, cnt),
    S: triple(row?.S, cnt),
    K: triple(row?.K, cnt),
  };
}

// Richtet die gelesenen Zeilen an der bekannten Punktfolge des Programms aus
// (Needleman-Wunsch). Verhindert das „Verrutschen": überspringt das Modell eine
// gedruckte Zeile oder erfindet eine, ordnet das Alignment die Abzüge trotzdem
// der richtigen Übung zu — Anker ist der GEDRUCKTE Punktwert je Zeile.
function alignToProgram(rows: any[], prog: number[]): { rows: any[]; matched: number } {
  const N = prog.length, M = rows.length;
  const emptyRow = (p: number) => ({ points: p, code: null, name: null, confidence: 0,
    P: [0, 0, 0], X: [0, 0, 0], W: [0, 0, 0], S: [0, 0, 0], K: [0, 0, 0] });
  if (!N) return { rows, matched: 0 };
  if (!M) return { rows: prog.map(emptyRow), matched: 0 };
  const match = (r: any, p: number) => {
    const pts = Number(r?.points);
    if (!Number.isFinite(pts)) return 0;           // Punktwert nicht gelesen — neutral
    return Math.abs(pts - p) < 0.051 ? 2 : -2;     // gedruckter Punktwert = Anker
  };
  const GAP = -1;
  const dp: number[][] = Array.from({ length: M + 1 }, () => new Array(N + 1).fill(0));
  for (let i = 1; i <= M; i++) dp[i][0] = dp[i - 1][0] + GAP;
  for (let j = 1; j <= N; j++) dp[0][j] = dp[0][j - 1] + GAP;
  for (let i = 1; i <= M; i++) {
    for (let j = 1; j <= N; j++) {
      dp[i][j] = Math.max(dp[i - 1][j - 1] + match(rows[i - 1], prog[j - 1]),
                          dp[i - 1][j] + GAP, dp[i][j - 1] + GAP);
    }
  }
  const out: any[] = new Array(N).fill(null);
  let i = M, j = N, matched = 0;
  while (i > 0 && j > 0) {
    if (dp[i][j] === dp[i - 1][j - 1] + match(rows[i - 1], prog[j - 1])) {
      out[j - 1] = rows[i - 1]; matched++; i--; j--;
    } else if (dp[i][j] === dp[i - 1][j] + GAP) { i--; }  // gelesene Extra-Zeile → verwerfen
    else { j--; }                                          // gedruckte Zeile nicht gelesen → leer
  }
  return { rows: out.map((r, idx) => r ? { ...r, points: prog[idx] } : emptyRow(prog[idx])), matched };
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
    let usedModel = tableModel;
    try {
      const prompt = buildExPrompt(programPoints, correction);
      const readRows = (d: any) => d && (Array.isArray(d.rows) ? d.rows : (Array.isArray(d.exercises) ? d.exercises : null));
      let ex = await callVision(prompt, dataUrl, 6000, tableModel);
      let rawRows = readRows(ex.data);
      // Fallback: wenn das gewählte Modell nichts/Fehler liefert, mit dem
      // Standard-Modell (flash) erneut versuchen.
      if ((!rawRows || rawRows.length === 0) && tableModel !== VISION_MODEL) {
        const fb = await callVision(prompt, dataUrl, 6000, VISION_MODEL);
        const fbRows = readRows(fb.data);
        if (fbRows && fbRows.length) { ex = fb; rawRows = fbRows; usedModel = VISION_MODEL; }
        else if (!exDebug) exDebug = "PRO: " + (ex.error || ex.raw || "leer").slice(0, 280) + " | FLASH: " + (fb.error || fb.raw || "leer").slice(0, 280);
      }
      if (rawRows) exercises = rawRows.map(sanitizeExerciseRow);
      // Anti-Verrutsch: Zeilen an der Punktfolge des Programms ausrichten,
      // statt blind auf die Lesereihenfolge zu vertrauen.
      if (exercises.length > 0 && programPoints && programPoints.length) {
        const aligned = alignToProgram(exercises, programPoints);
        exercises = aligned.rows;
        exDebug = (exDebug ? exDebug + " | " : "") + `align: ${aligned.matched}/${programPoints.length} Zeilen verankert`;
      }
      if (exercises.length === 0 && !exDebug) exDebug = (ex.error || ex.raw || "").slice(0, 600);
    } catch (e) { exDebug = "Ausnahme: " + String((e as Error)?.message || e); }

    return new Response(JSON.stringify({ ok: true, data: { ...stammData, exercises, _exDebug: exDebug, _tableModel: usedModel } }), { status: 200, headers: jsonHeaders(req) });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String((e as Error)?.message || e) }), { status: 500, headers: jsonHeaders(req) });
  }
});
