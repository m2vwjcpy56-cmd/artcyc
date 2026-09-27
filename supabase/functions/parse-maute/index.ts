// Edge Function: liest eine Maute-Wettkampfstatistik — auch im ALTEN Binärformat (.xls,
// Excel 97–2003, Dieters Original von 2007) — und gibt die Zellen des Programm-Blatts als
// Text zurück. Die Apps können .xlsx/.xlsm selbst lesen (ZIP + XML); das Binärformat kann
// nur SheetJS, und das läuft hier. KEINE KI, keine Interpretation: nur Zellen.
//
// Anfrage:  { "file": "<base64>" }
// Antwort:  { "sheet": "Programm", "cells": { "A4": "1. Sattelstand HR.", "C4": "1", … } }
//           oder { "error": "no_sheet" | "bad_request" } mit 4xx.
// esm.sh statt cdn.sheetjs.com: Supabases Bundler laesst nur esm.sh/npm zu.
import * as XLSX from "https://esm.sh/xlsx@0.18.5";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const berlinFmt = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Berlin", year: "numeric", month: "2-digit", day: "2-digit" });
function berlinDay(d: Date): string { return berlinFmt.format(d); }   // "2023-04-02"

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });
}

/// Mautes Blatt erkennt man am Kopf: Zeile 3 hat „Pkt." in B und „i.P." in C, und in
/// A3/A64 steht „Erstellt von Bundestrainer Dieter Maute". Gleiche Regel wie in den Apps.
function looksLikeMaute(ws: XLSX.WorkSheet): boolean {
  const v = (a: string) => String(ws[a]?.v ?? "");
  return v("C3").startsWith("i.P") || v("B3").startsWith("Pkt") || v("A3").includes("Maute") || v("A64").includes("Maute");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const { file } = await req.json();
    if (typeof file !== "string" || file.length < 100) return json({ error: "bad_request" }, 400);
    const bin = Uint8Array.from(atob(file), (c) => c.charCodeAt(0));
    // cellFormula aus: uns interessieren nur die gespeicherten Werte. Datumszellen bleiben
    // Seriennummern (die Apps rechnen sie um) — so bleibt die Antwort reiner Text.
    const wb = XLSX.read(bin, { type: "array", cellFormula: false, cellDates: false });
    for (const name of wb.SheetNames) {
      const ws = wb.Sheets[name];
      if (!ws || !looksLikeMaute(ws)) continue;
      const cells: Record<string, string> = {};
      for (const ref of Object.keys(ws)) {
        if (ref.startsWith("!")) continue;
        const v = ws[ref]?.v;
        if (v === undefined || v === null || v === "") continue;
        // Numbers-Dateien liefern echte Datumswerte (Date). Als Kalendertag in
        // deutscher Zeit ausgeben — der Rohwert (23:00 UTC) läge sonst einen Tag daneben.
        if (v instanceof Date) { cells[ref] = berlinDay(v); continue; }
        cells[ref] = String(v);
      }
      return json({ sheet: name, cells });
    }
    return json({ error: "no_sheet", sheets: wb.SheetNames }, 422);
  } catch (e) {
    return json({ error: "bad_request", detail: String(e) }, 400);
  }
});
