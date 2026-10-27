// =============================================================
// Ski-Planung — gleiche Vorschläge zusammenfassen
// Gemeinsam genutzt von der Seite (src/Ski.jsx) und der Mail-Funktion
// (ski-notify), damit beide dieselbe Gruppierung zeigen.
//
// „Arlberg", „arlberg ", „Skigebiet Arlberg" und „Arlbreg" (Tippfehler)
// landen in einer Gruppe. Verglichen wird ein normalisierter Schlüssel:
// klein geschrieben, ohne Akzente/Umlaute, ohne Satzzeichen und ohne
// Füllwörter wie „Skigebiet" oder „am". Kleine Tippfehler werden über die
// Editierdistanz erkannt (≤1 bei kurzen, ≤2 bei langen Namen).
// =============================================================

const FILLER = new Set([
  "skigebiet", "skigebiete", "skiregion", "skiort", "ski", "region", "gebiet", "resort",
  "in", "im", "am", "an", "der", "die", "das", "bei", "zum", "zur", "und", "oder", "nach",
]);

export function suggestionKey(text: string): string {
  let s = String(text || "").toLowerCase().replace(/ß/g, "ss");
  s = s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");        // ä → a, é → e
  s = s.replace(/ae/g, "a").replace(/oe/g, "o").replace(/ue/g, "u"); // Kaernten = Kärnten
  const words = s.replace(/[^a-z0-9]+/g, " ").trim().split(" ").filter(Boolean);
  const core = words.filter((w) => !FILLER.has(w));
  return (core.length ? core : words).join(" ");
}

// Editierdistanz inkl. vertauschter Nachbarbuchstaben („Arlbreg" → „Arlberg" = 1).
function editDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > 2) return 99;
  const d: number[][] = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
    }
  }
  return d[a.length][b.length];
}

function similar(a: string, b: string): boolean {
  if (a === b) return true;
  const len = Math.min(a.length, b.length);
  if (len < 5) return false;                       // kurze Namen nur exakt
  return editDistance(a, b) <= (len >= 9 ? 2 : 1);
}

export type SuggestionGroup<T> = {
  key: string;
  text: string;          // angezeigter Text (häufigste Schreibweise, sonst der erste)
  items: T[];            // alle Einzel-Vorschläge der Gruppe, älteste zuerst
  ids: string[];
};

// sugs: [{ id, text, created_at, ... }] — Reihenfolge egal.
export function groupSuggestions<T extends { id: string; text: string; created_at?: string }>(sugs: T[]): SuggestionGroup<T>[] {
  const sorted = [...sugs].sort((a, b) => String(a.created_at || "").localeCompare(String(b.created_at || "")));
  const groups: SuggestionGroup<T>[] = [];
  for (const s of sorted) {
    const k = suggestionKey(s.text);
    const g = groups.find((x) => similar(x.key, k));
    if (g) { g.items.push(s); g.ids.push(s.id); }
    else groups.push({ key: k, text: s.text.trim(), items: [s], ids: [s.id] });
  }
  for (const g of groups) {
    const counts = new Map<string, number>();
    for (const it of g.items) { const t = it.text.trim(); counts.set(t, (counts.get(t) || 0) + 1); }
    let best = g.text, n = 0;
    for (const [t, c] of counts) if (c > n) { best = t; n = c; }
    g.text = best;
  }
  return groups;
}
