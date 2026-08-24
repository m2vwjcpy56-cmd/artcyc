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
    if (it.x < 330) return null;                 // links steht Text → keine Randzeile
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

function parseRows(items: Item[]) {
  const cols = detectCols(items) || WERTUNGSBERICHT_COLS;
  const anchorX = cols.Pkte;
  const anchorTol = cols === WERTUNGSBERICHT_COLS ? 12 : 8;
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
      if (it.x < 330) { nameTokens.push({ x: it.x, text: it.text }); continue; }
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
  return { rows, edgePre, edgePost };
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
    const { rows, edgePre, edgePost } = parseRows(items);
    return new Response(JSON.stringify({ rows, edgePre, edgePost, itemCount: items.length }), { headers: { ...cors, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...cors, "Content-Type": "application/json" } });
  }
});
