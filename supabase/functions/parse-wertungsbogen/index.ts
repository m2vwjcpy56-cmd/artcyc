// Edge Function: liest die Einzelübungen-Tabelle eines Wertungsbericht-PDFs per pdf.js
// (unpdf) aus dem ECHTEN Text mit Koordinaten — KEINE KI, ~instant. 1:1-Portierung des
// bewährten Web-Algorithmus (parseWertungsbogenRows). Bis zu 3 Kampfgerichte.
import { getDocumentProxy } from "https://esm.sh/unpdf@0.12.1";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const WERTUNGSBERICHT_COLS: Record<string, number> = {
  Pkte: 339.3,
  T1: 364.7, T2: 390.3, T3: 415.8,
  p1: 441.3, p2: 466.8, p3: 491.5,
  X1: 517.8, X2: 543.3, X3: 568.8,
  W1: 594.4, W2: 619.9, W3: 645.4,
  S1: 670.9, S2: 696.4, S3: 721.9,
  K1: 747.4, K2: 772.9, K3: 798.5,
};

type Item = { text: string; x: number; y: number; width: number };

/// Der EINZEL-Kampfgericht-Bogen (A4 hochkant) ist anders aufgebaut als der
/// Wertungsbericht im Querformat: die Punktespalte heißt nicht „Pkte", sondern ist als
/// „Punkt-" / „Wert" auf zwei Kopfzeilen verteilt, und die Fehlerzeichen stehen als
/// X ~ | O nebeneinander. Ohne das Wort „Pkte" fiel `detectCols` durch, der Parser nahm
/// das Querformat-Raster an und fand bei x≈339 nichts — Ergebnis: null Übungszeilen,
/// obwohl der Bogen sauber lesbar ist.
///
/// Erkannt wird an der Zeichenzeile: X ~ | O müssen ZUSAMMEN auf einer Zeile stehen
/// (im Fußteil kommt „X x 0,2 =" vor, das ist ein anderes Element und trifft nicht).
function detectSinglePanelCols(items: Item[]): Record<string, number> | null {
  const mid = (i: Item) => i.x + (i.width || 0) / 2;
  const isCircle = (t: string) => t === "O" || t === "o" || t === "○" || t === "0";
  for (const cand of items) {
    if (cand.text !== "X") continue;
    const line = items.filter((i) => Math.abs(i.y - cand.y) <= 4);
    const wave = line.find((i) => i.text === "~");
    const bar = line.find((i) => i.text === "|");
    const circle = line.find((i) => isCircle(i.text));
    const pct = line.find((i) => i.text === "%");
    if (!wave || !bar || !circle || !pct) continue;
    // Reihenfolge muss stimmen, sonst ist es eine andere Zeile mit ähnlichen Zeichen.
    if (!(pct.x < cand.x && cand.x < wave.x && wave.x < bar.x && bar.x < circle.x)) continue;
    // Punktespalte: „Wert" (zweite Kopfzeile) oder „Punkt-" (erste) — beide über der
    // Zeichenzeile und links vom Prozentfeld.
    const above = items.filter((i) => i.y < cand.y && cand.y - i.y < 20 && i.x < pct.x);
    const wert = above.find((i) => i.text === "Wert") ?? above.find((i) => i.text === "Punkt-");
    if (!wert) continue;
    // Taktische Punkte liegen links davon („Punkte" unter „Takt-").
    const takt = above.filter((i) => i.x < wert.x - 10)
                      .sort((a, b) => b.x - a.x)
                      .find((i) => i.text === "Punkte" || i.text === "Takt-");
    const cols: Record<string, number> = {
      Pkte: mid(wert), p1: mid(pct),
      X1: mid(cand), W1: mid(wave), S1: mid(bar), K1: mid(circle),
    };
    if (takt) cols.T1 = mid(takt);
    return cols;
  }
  return null;
}

function detectCols(items: Item[]): Record<string, number> | null {
  const pkte = items.find((i) => i.text === "Pkte");
  if (!pkte) return null;
  const headerY = pkte.y;
  const re = /^(Pkte|T[123]|%[123]|X[123]|W[123]|S[123]|K[123])$/;
  const cols: Record<string, number> = {};
  for (const it of items) {
    if (Math.abs(it.y - headerY) > 5) continue;
    const m = it.text.match(re);
    if (!m) continue;
    let name = m[1];
    if (name[0] === "%") name = "p" + name.slice(1);
    cols[name] = it.x + (it.width || 0) / 2;
  }
  if (!["Pkte", "X1", "K3"].every((n) => n in cols)) return null;
  return cols;
}

function classify(xMid: number, cols: Record<string, number>, maxDist: number): string | null {
  let best: string | null = null, bestD = 999;
  for (const [name, cx] of Object.entries(cols)) {
    const d = Math.abs(xMid - cx);
    if (d < bestD) { best = name; bestD = d; }
  }
  return bestD < maxDist ? best : null;
}

/// Die beiden Zeilen OHNE Punktwert direkt vor der ersten und nach der letzten Übung:
/// dort stehen die Abzüge fürs An- und Abfahren. Sie haben keinen gedruckten Punktwert
/// und fielen deshalb bisher durch die Anker-Prüfung — die Zeichen gingen verloren.
///
/// Angenommen werden nur EINSTELLIGE Zahlen (1–9) in den Spalten X/W/S/K. Auf dem Bogen
/// steht je Zelle höchstens eine Ziffer; mehrstellige Treffer in diesem Bereich stammen
/// aus Fuß- oder Kopfzeilen und werden bewusst verworfen, statt sie als Abzug zu deuten.
function edgeRowFrom(line: { y: number; items: Item[] } | undefined,
                     cols: Record<string, number>): any | null {
  if (!line) return null;
  const out: any = { kg1: {}, kg2: {}, kg3: {} };
  let found = false;
  for (const it of line.items) {
    // Links der Wertespalten steht Text → dann ist es keine Randzeile. Die Grenze
    // kommt aus den erkannten Spalten, damit sie auch beim Hochkant-Bogen sitzt.
    if (it.x < Math.min(...Object.values(cols)) - 15) return null;
    const col = classify(it.x + (it.width || 0) / 2, cols, 15);
    if (!col) continue;
    const prefix = col.slice(0, -1);
    if (!["X", "W", "S", "K"].includes(prefix)) continue;
    if (!/^[1-9]$/.test(it.text)) continue;
    const target = out["kg" + col[col.length - 1]];
    if (target) { target[prefix] = parseInt(it.text, 10); found = true; }
  }
  return found ? out : null;
}

/// Die Fuß-Summen je Kampfgericht — ueber die POSITION, nicht ueber die Reihenfolge.
///
/// Die App las sie bisher aus reinem PDF-Text und nahm sie in der Reihenfolge, in der
/// PDFKit sie liefert. Diese Reihenfolge ist aber nicht garantiert: auf einem Bogen kam
/// „Abzug Ausfuehrung: 7,80" vor „9,50", und damit wurde die Rechnung von KG1 gegen den
/// Sollwert von KG2 geprueft — die Pruefsumme meldete eine Abweichung von genau der
/// Differenz der beiden (1,70), einmal zu viel und einmal zu wenig.
///
/// Hier stehen Koordinaten zur Verfuegung: die Vorkommen eines Etiketts werden nach x
/// sortiert, das linkeste gehoert zu KG1. Damit ist die Zuordnung eindeutig.
function parseFooter(items: Item[]): Record<string, number[]> {
  const labels: Record<string, RegExp> = {
    ausfuehrung: /^Abzug\s+Ausf(ü|ue)hrung:?$/i,
    schwierigkeit: /^Abzug\s+Schwierigkeit:?$/i,
    gesamtabzug: /^Gesamtabzug:?$/i,
    ausgefahren: /^Ausgefahrene\s+Punkte:?$/i,
  };
  const out: Record<string, number[]> = {};
  for (const [key, re] of Object.entries(labels)) {
    const hits = items.filter((i) => re.test(i.text)).sort((a, b) => a.x - b.x);
    const values: number[] = [];
    for (const h of hits) {
      // Der Wert steht RECHTS vom Etikett auf derselben Zeile — der naechste
      // Zahlentreffer, nicht irgendeiner weiter hinten aus dem naechsten Block.
      const same = items
        .filter((i) => Math.abs(i.y - h.y) <= 4 && i.x > h.x && /^\d+[.,]\d+$/.test(i.text))
        .sort((a, b) => a.x - b.x);
      if (same.length) values.push(parseFloat(same[0].text.replace(",", ".")));
    }
    if (values.length) out[key] = values;
  }
  // Manche Boegen schreiben Etikett und Wert in EIN Textelement ("Abzug Ausführung: 7,80").
  for (const [key, re] of Object.entries(labels)) {
    if (out[key]) continue;
    const src = re.source.replace(/:\?\$$/, "");
    const combined = items
      .filter((i) => new RegExp(src + "\\s*:?\\s*\\d", "i").test(i.text))
      .sort((a, b) => a.x - b.x);
    const values = combined
      .map((i) => i.text.match(/(\d+[.,]\d+)\s*$/)?.[1])
      .filter((v): v is string => !!v)
      .map((v) => parseFloat(v.replace(",", ".")));
    if (values.length) out[key] = values;
  }
  return out;
}

function parseRows(items: Item[]) {
  const wide = detectCols(items);
  const single = wide ? null : detectSinglePanelCols(items);
  const cols = wide || single || WERTUNGSBERICHT_COLS;
  // Beim Hochkant-Bogen steht im Fußteil „+ Taktische Punkte: 0,50" und
  // „- Gesamtabzug: 9,13" ZUFÄLLIG in der Punktespalte — beides sah wie eine
  // Übungszeile aus und verfälschte die Summe um genau diese 9,63. Übungszeilen
  // tragen dort immer eine Übungsnummer, Fußzeilen nie; also wird sie verlangt.
  // Nur für dieses Format — beim Querformat bleibt es bei der alten Regel, damit
  // dort kein Bogen ohne Nummern plötzlich leer bleibt.
  const requireCode = single !== null;
  const anchorX = cols.Pkte;
  const anchorTol = cols === WERTUNGSBERICHT_COLS ? 12 : 8;
  // Wo der Übungsname endet, ergibt sich aus der linkesten Wertespalte — beim
  // Hochkant-Bogen liegt die woanders als im Querformat, und eine festverdrahtete
  // Grenze von 330 hätte dort mitten in die Zahlenspalten gezeigt.
  const nameMax = Math.min(...Object.values(cols)) - 15;
  const sorted = items.slice().sort((a, b) => a.y - b.y);
  const lines: { y: number; items: Item[] }[] = [];
  for (const it of sorted) {
    const last = lines[lines.length - 1];
    if (last && Math.abs(it.y - last.y) <= 5) last.items.push(it);
    else lines.push({ y: it.y, items: [it] });
  }
  const rows: any[] = [];
  const anchoredIdx: number[] = [];
  for (let li = 0; li < lines.length; li++) {
    const line = lines[li];
    const anchor = line.items.find((it) => {
      const xMid = it.x + (it.width || 0) / 2;
      if (Math.abs(xMid - anchorX) >= anchorTol) return false;
      if (!/^\d+,\d+$/.test(it.text)) return false;
      const val = parseFloat(it.text.replace(",", "."));
      return val >= 0.5 && val <= 20;
    });
    if (!anchor) continue;
    const row: any = { points: parseFloat(anchor.text.replace(",", ".")), kg1: {}, kg2: {}, kg3: {}, code: null, name: "" };
    const nameTokens: { x: number; text: string }[] = [];
    for (const it of line.items) {
      if (it === anchor) continue;
      if (it.x < 60) { const m = it.text.match(/^\d{0,2}(\d{4}[a-z]?)$/); if (m) row.code = m[1]; continue; }
      if (it.x < nameMax) { nameTokens.push({ x: it.x, text: it.text }); continue; }
      const xMid = it.x + (it.width || 0) / 2;
      const col = classify(xMid, cols, 15);
      if (!col || col === "Pkte") continue;
      const num = parseFloat(it.text.replace(",", "."));
      if (isNaN(num)) continue;
      const kg = col[col.length - 1];
      const prefix = col.slice(0, -1);
      const target = row["kg" + kg];
      if (target) target[prefix] = num;
    }
    if (requireCode && !row.code) continue;
    // Die Takt-Spalte bedeutet in den beiden Bogenformaten VERSCHIEDENES: im
    // Querformat steht dort der ANERKANNTE Wert (z. B. 8,6), im Hochkant-Bogen nur
    // der ZUSCHLAG (0,50) — die Fußzeile addiert dort ebenfalls nur die Zuschläge.
    // Die App erwartet durchgehend den anerkannten Wert; ohne Umrechnung zählte die
    // Übung mit 0,50 statt 8,6 und das Ergebnis lag um den Punktwert der Übung daneben.
    // Sicherheitsnetz: ein Zuschlag ist immer kleiner als der Punktwert selbst.
    if (single) {
      for (const kg of [row.kg1, row.kg2, row.kg3]) {
        if (kg && typeof kg.T === "number" && row.points && kg.T < row.points) {
          kg.T = Math.round((row.points + kg.T) * 100) / 100;
        }
      }
    }
    nameTokens.sort((a, b) => a.x - b.x);
    row.name = nameTokens.map((t) => t.text).join(" ").replace(/\s+/g, " ").trim();
    rows.push(row);
    anchoredIdx.push(li);
  }
  // Randzeilen: direkt oberhalb der ersten und unterhalb der letzten Übungszeile.
  // „Direkt" heißt hier wirklich die Nachbarzeile — sonst würde irgendein Text weiter
  // oben oder unten fälschlich als Abzug gelesen.
  let edgePre = null, edgePost = null;
  if (anchoredIdx.length) {
    const first = anchoredIdx[0], last = anchoredIdx[anchoredIdx.length - 1];
    if (first > 0) edgePre = edgeRowFrom(lines[first - 1], cols);
    if (last + 1 < lines.length) edgePost = edgeRowFrom(lines[last + 1], cols);
  }
  return { rows, edgePre, edgePost, footer: parseFooter(items) };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const { pdf } = await req.json();
    if (!pdf) return new Response(JSON.stringify({ error: "no pdf" }), { status: 400, headers: { ...cors, "Content-Type": "application/json" } });
    const bin = Uint8Array.from(atob(pdf), (c) => c.charCodeAt(0));
    const doc = await getDocumentProxy(bin);
    const items: Item[] = [];
    for (let p = 1; p <= doc.numPages; p++) {
      const page = await doc.getPage(p);
      const vp = page.getViewport({ scale: 1 });
      const tc = await page.getTextContent();
      for (const it of tc.items as any[]) {
        if (!it.str || !it.str.trim()) continue;
        items.push({ text: it.str.trim(), x: it.transform[4], y: vp.height - it.transform[5], width: it.width || 0 });
      }
    }
    const { rows, edgePre, edgePost, footer } = parseRows(items);
    return new Response(JSON.stringify({ rows, edgePre, edgePost, footer, itemCount: items.length }), { headers: { ...cors, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...cors, "Content-Type": "application/json" } });
  }
});
