// =============================================================
// Kunstrad-/Hallenradsport-Vereine — Auswahlliste für Autocomplete
// =============================================================
//
// KURATIERTE STARTLISTE. Alle Namen sind aus echten Wettkampf-/Verbands-
// Quellen verifiziert (rad-net Hallenradsport, Landesverbände, DM/SM-
// Ergebnislisten, Vereins-Websites). Die Liste ist bewusst NICHT vollständig
// — eine komplette Welt-Liste existiert nirgends. Sie dient als Vorschlag:
// Im Editor kann jederzeit frei getippt und ein nicht gelisteter Verein
// einfach überschrieben werden.
//
// Erweitern: einfach Zeilen ergänzen ({ name, country }). country = ISO-Code
// für das Fähnchen in der Vorschlagsliste (siehe COUNTRY_FLAG in der App).

export const CLUBS = [
  // ---- Deutschland 🇩🇪 ----
  { name: 'RMSV Edelweiß Aach', country: 'DE' },
  { name: 'RSV Steinhöring', country: 'DE' },
  { name: 'RSV Tailfingen', country: 'DE' },
  { name: 'RMSV Bad Schussenried', country: 'DE' },
  { name: 'RV Mainz-Ebersheim', country: 'DE' },
  { name: 'RSV Volkertshausen', country: 'DE' },
  { name: 'RSV Frisch Auf Öschelbronn', country: 'DE' },
  { name: 'GRMSV Moers', country: 'DE' },
  { name: 'RSV Edelweiß Kartung', country: 'DE' },
  { name: 'RV Rheindürkheim', country: 'DE' },
  { name: 'RKV Denkendorf', country: 'DE' },
  { name: 'RCV Speyer', country: 'DE' },
  { name: 'RMSV Burgheim', country: 'DE' },
  { name: 'RSV Antrup-Wechte', country: 'DE' },
  { name: 'VfH Mücheln', country: 'DE' },
  { name: 'VfH Worms', country: 'DE' },
  { name: 'RSV Wallbach', country: 'DE' },
  { name: 'RSV Löwe Gifhorn', country: 'DE' },

  // ---- Österreich 🇦🇹 ----
  { name: 'RV Sulz', country: 'AT' },
  { name: 'RC Höchst', country: 'AT' },

  // ---- Schweiz 🇨🇭 ----
  { name: 'RMV Pfungen', country: 'CH' },
  { name: 'RV Mosnang', country: 'CH' },
  { name: 'RC Winterthur', country: 'CH' },
  { name: 'RV Wetzikon', country: 'CH' },
  { name: 'RV Frauenfeld', country: 'CH' },
];

// ISO-Code → Fähnchen-Emoji für die Vorschlagszeile.
export const COUNTRY_FLAG = {
  DE: '🇩🇪', AT: '🇦🇹', CH: '🇨🇭',
  CZ: '🇨🇿', JP: '🇯🇵', HK: '🇭🇰', BE: '🇧🇪', US: '🇺🇸', HU: '🇭🇺',
};

// Normalisiert für die Suche: Umlaute/ß auflösen, Sonderzeichen → Space.
function norm(s) {
  return (s || '')
    .toLowerCase()
    .replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

// Liefert bis zu `limit` Vorschläge zu `query`. Treffer am Wortanfang zuerst.
// Exakte Eingabe (Verein schon vollständig getippt) erzeugt keine Vorschläge.
export function suggestClubs(query, limit = 8) {
  const q = norm(query);
  if (!q) return [];
  const starts = [];
  const contains = [];
  for (const c of CLUBS) {
    const n = norm(c.name);
    if (n === q) return []; // exakt getroffen → keine Liste mehr zeigen
    if (n.startsWith(q)) starts.push(c);
    else if (n.includes(q)) contains.push(c);
  }
  return [...starts, ...contains].slice(0, limit);
}
