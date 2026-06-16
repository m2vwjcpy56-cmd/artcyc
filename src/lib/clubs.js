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
  { name: 'RKV Denkendorf', country: 'DE' },
  { name: 'RSV Wendlingen', country: 'DE' },
  { name: 'RV Pfeil Magstadt', country: 'DE' },
  { name: 'RV Nufringen', country: 'DE' },
  { name: 'RV Gärtringen', country: 'DE' },
  { name: 'SportKultur Stuttgart', country: 'DE' },
  { name: 'RKV Ilsfeld', country: 'DE' },
  { name: 'RSV Frisch Auf Öschelbronn', country: 'DE' },
  { name: 'RSV Volkertshausen', country: 'DE' },
  { name: 'RMSV Concordia Kirchehrenbach', country: 'DE' },
  { name: 'Soli Bruckmühl', country: 'DE' },
  { name: 'RMSV Burgheim', country: 'DE' },
  { name: 'RV Mainz-Ebersheim', country: 'DE' },
  { name: 'RV 1910 Hechtsheim', country: 'DE' },
  { name: 'RSV Undenheim', country: 'DE' },
  { name: 'RV Rheindürkheim', country: 'DE' },
  { name: 'VfH Worms', country: 'DE' },
  { name: 'RV Bolanden', country: 'DE' },
  { name: 'RCV Speyer', country: 'DE' },
  { name: 'RSV Edelweiß Kartung', country: 'DE' },
  { name: 'GRMSV Moers', country: 'DE' },
  { name: 'RSG Teuto Antrup-Wechte', country: 'DE' },
  { name: 'RSV Löwe Gifhorn', country: 'DE' },
  { name: 'RSV Förste', country: 'DE' },
  { name: 'VfH Mücheln', country: 'DE' },
  { name: 'RSV Wallbach', country: 'DE' },

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

// Normalisiert für die Suche/Dedup: Umlaute/ß auflösen, Sonderzeichen → Space.
export function normClub(s) {
  return (s || '')
    .toLowerCase()
    .replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

// Liefert bis zu `limit` Vorschläge zu `query`. Treffer am Wortanfang zuerst.
// `dynamic` = zusätzliche, von Nutzern eingegebene Vereine (Crowdsource), z. B.
//   [{ name, country, usage_count }]. Wird mit der kuratierten Liste gemerged
//   (Dedup über normalisierten Namen; kuratiert hat Vorrang).
// Exakte Eingabe (Verein schon vollständig getippt) erzeugt keine Vorschläge.
export function suggestClubs(query, dynamic = [], limit = 8) {
  const q = normClub(query);
  if (!q) return [];
  // Merge: kuratiert zuerst, dann dynamische (ohne Dubletten).
  const seen = new Set(CLUBS.map(c => normClub(c.name)));
  const merged = [...CLUBS];
  for (const c of dynamic || []) {
    const n = normClub(c.name);
    if (!n || seen.has(n)) continue;
    seen.add(n);
    merged.push(c);
  }
  const starts = [];
  const contains = [];
  for (const c of merged) {
    const n = normClub(c.name);
    if (n === q) return []; // exakt getroffen → keine Liste mehr zeigen
    if (n.startsWith(q)) starts.push(c);
    else if (n.includes(q)) contains.push(c);
  }
  return [...starts, ...contains].slice(0, limit);
}
