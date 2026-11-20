// =============================================================
// Ski-Planung — Inhalte des Fragebogens unter /ski
//
// Alles Inhaltliche (Texte, Fragen, Antworten) wird HIER gepflegt. Die
// Antworten der Leute liegen in Supabase (ski_votes / ski_suggestions,
// siehe docs/ski-planung-setup.sql).
//
// Neuer Trip / neues Jahr: `slug` ändern → Fragebogen startet leer.
// =============================================================

import { SKI_MEMBERS } from '../../supabase/functions/_shared/ski-members.ts';
export { canonicalVotes, canonicalName } from '../../supabase/functions/_shared/ski-members.ts';

export const SKI_TRIP = {
  slug: 'ski-2027',

  title: 'Skifahren 2027',
  tagline: 'Planung Saison 26/27',

  // Mitglieder der WhatsApp-Gruppe „Skifahren 26/27" — gepflegt in
  // supabase/functions/_shared/ski-members.ts (gemeinsam mit der Mail-Funktion).
  members: SKI_MEMBERS,

  // Startbildschirm — kurz und knackig, Rest kommt in den Fragen.
  welcome: {
    headline: 'Nächstes Jahr wieder auf die Piste?',
    text: 'Zwei Termine stehen zur Auswahl. Wir fahren wieder Samstag + Sonntag, plus Freitag oder Montag. Die Unterkunft buchen wir für 3 Tage, später anreisen oder früher abreisen geht immer. Dauert eine Minute.',
    button: 'Los geht’s',
  },

  // Fragen in Reihenfolge. type:
  //   'name'   → Namensauswahl aus `members` (antippen)
  //   'choice' → genau eine Antwort (große Kacheln, geht automatisch weiter)
  //   'text'   → freie Eingabe, optional (wird als Vorschlag gespeichert)
  // short = Spaltentitel in der Ergebnis-Tabelle.
  // showIf(antworten) → Frage nur zeigen, wenn true. Übersprungene Fragen
  // werden beim Abschicken für diese Person gelöscht.
  // Antworten: { id, label, sub?, short? (Kurzform für Ergebnis-Seite), emoji? }
  questions: [
    {
      id: 'name',
      type: 'name',
      title: 'Wer bist du?',
      sub: 'Tipp auf deinen Namen.',
    },
    {
      id: 'dabei',
      type: 'choice',
      title: 'Bist du 2027 dabei?',
      short: 'Dabei',
      options: [
        { id: 'ja', label: 'Ja, klar!', short: 'Ja', emoji: '🎿' },
        { id: 'vielleicht', label: 'Vielleicht', sub: 'Weiß ich noch nicht sicher', short: '?', emoji: '🤔' },
        { id: 'nein', label: 'Dieses Jahr nicht', short: 'Nein', emoji: '😢' },
      ],
    },
    {
      id: 'we-jan-23',
      type: 'choice',
      title: 'Sa 23. – So 24. Januar',
      showIf: (a) => a.dabei !== 'nein',   // wer absagt, wird nichts weiter gefragt
      short: '23./24.1.',
      sub: 'Passt dir dieses Wochenende?',
      kind: 'availability',   // Ja / Vielleicht / Nein → Ergebnis als Favorit-Vergleich
      options: [
        { id: 'yes', label: 'Passt', short: '✓' },
        { id: 'maybe', label: 'Vielleicht', short: '?' },
        { id: 'no', label: 'Geht nicht', short: '✗' },
      ],
    },
    {
      id: 'we-jan-30',
      type: 'choice',
      title: 'Sa 30. – So 31. Januar',
      showIf: (a) => a.dabei !== 'nein',   // wer absagt, wird nichts weiter gefragt
      short: '30./31.1.',
      sub: 'Und dieses Wochenende?',
      kind: 'availability',
      options: [
        { id: 'yes', label: 'Passt', short: '✓' },
        { id: 'maybe', label: 'Vielleicht', short: '?' },
        { id: 'no', label: 'Geht nicht', short: '✗' },
      ],
    },
    {
      id: 'zusatztag',
      type: 'choice',
      title: 'Zusätzlich zu Sa + So?',
      // nur fragen, wenn dabei und mindestens ein Wochenende nicht „Geht nicht“ ist
      showIf: (a) => a.dabei !== 'nein' && !(a['we-jan-23'] === 'no' && a['we-jan-30'] === 'no'),
      short: 'Zusatztag',
      sub: 'Wir hängen einen Tag dran — Freitag oder Montag. Die Unterkunft ist für 3 Tage gebucht, später anreisen oder früher abreisen geht immer.',
      options: [
        { id: 'fr-mo', label: 'Freitag und Montag', sub: 'Beides möglich', short: 'Fr + Mo' },
        { id: 'fr', label: 'Nur Freitag', short: 'Fr' },
        { id: 'mo', label: 'Nur Montag', short: 'Mo' },
      ],
    },
    {
      id: 'vorschlag',
      type: 'text',
      title: 'Vorschläge fürs Skigebiet?',
      showIf: (a) => a.dabei !== 'nein',   // wer absagt, wird nichts weiter gefragt
      sub: 'Optional, gerne mehrere. Unterkünfte kannst du danach in der Übersicht eintragen.',
      placeholder: 'z. B. Zillertal Arena, Arlberg …',
      optional: true,
    },
  ],

  // Sollen die recherchierten Vorschläge unten für alle sichtbar sein?
  // false = nur über `/ski?unterkuenfte` (zum Selbst-Durchsehen, bevor die
  // Gruppe sie bekommt). Was Leute über die Seite eintragen, ist davon nicht
  // betroffen und immer für alle sichtbar.
  lodgingsPublic: false,

  // ===========================================================
  // Unterkünfte, die der Organisator fest einträgt. Sie erscheinen zusätzlich
  // zu den Einträgen, die andere über die Seite machen. `id` nie ändern —
  // die Daumen hoch hängen daran. price_total in Euro, null = noch offen.
  //
  // ⚠️ OBERGRENZE: 350 € pro Person für die drei Nächte. Seit 17.11.2026 wird
  // für ZWÖLF Leute gerechnet (= 4.200 € gesamt), nachdem die Abstimmung genau
  // zwölf feste Zusagen ergeben hat. Ein dreizehnter ist optional: dann 4.550 €.
  // Alles darüber gehört hier nicht rein, auch wenn es schön ist.
  //
  // ⚠️ Zwölf statt vierzehn ist keine Preisrechnung, sondern ein anderer Markt.
  // Unter 14 Betten öffnen sich Häuser, die vorher gar nicht erst in der Liste
  // auftauchten — und Preise fallen stärker als um 2/14. Die ganze Liste wurde
  // deshalb am 17.11.2026 neu abgefragt, kein Eintrag ist hochgerechnet.
  //
  // Felder, die NUR hier gesetzt werden (Einträge von der Seite haben sie
  // nicht; die Anzeige blendet jedes fehlende Feld einfach aus):
  //   ort        Ortsname laut Booking — nicht der Name der Unterkunft!
  //   fahrzeit   ab Denkendorf, über OSRM gemessen, ohne Verkehr
  //   km         Fahrstrecke ab Denkendorf
  //   gebiet     { name, km, anlagen, weg, fuss } — das Hausgebiet
  //   auch       { name, km, weg } — das nächstgrößere, optional
  //   rating / reviews   Booking-Note und Anzahl Bewertungen
  //   einheiten  Wie die 12 Leute verteilt werden (Booking „für Ihre Gruppe")
  //   gross      Größte Einheit in m² — die Zahl, an der hängt, ob abends
  //              alle an einem Tisch sitzen können
  //   kurz       EIN Satz. Kein Absatz. Die Zahlen stehen schon daneben.
  //   badge      { text, art: 'gut' | 'warn' }
  //   rank       Reihenfolge, solange niemand Daumen hoch gegeben hat
  //
  // ⚠️ Der Ortsname kommt aus dem Titel der Booking-Seite, NICHT aus dem Namen
  // der Unterkunft. „Landal Hochmontafon" steht in Gargellen, einem Seitental,
  // und „bsundrix … Bludenz" steht in Lorüns. Das sind jedes Mal ein anderes
  // Skigebiet und eine andere Fahrzeit als der Name verspricht.
  //
  // `gebiet.weg` ist gefahren, nicht Luftlinie: Unterkunft → Talstation über
  // OSRM. `fuss: true` nur, wenn Booking einen Lift unter 500 m ausweist —
  // dann steht dort der Fußweg, keine Fahrzeit.
  // ===========================================================
  lodgings: [
    // =====================================================================
    // Stand 17.11.2026 — komplett neu abgefragt für ZWÖLF Erwachsene.
    // Sortiert nach Preis pro Person. Die Ränge 1–3 sind die drei, bei denen
    // Lage, Preis und Bettenzahl gleichzeitig stimmen.
    // =====================================================================
    {
      id: 'cfg-ferienhaus-gruenten-fischen',
      name: 'Ruben Geyer',
      rank: 1,
      title: 'Ferienhaus Grünten',
      // ⚠️ Der Name führt in die Irre: der Grünten liegt 20 km weiter nördlich.
      // Das Haus steht in Fischen, also im Oberstdorfer Gebiet.
      url: 'https://www.booking.com/hotel/de/ferienhaus-grunten.de.html?checkin=2027-01-29&checkout=2027-02-01&group_adults=12&no_rooms=1&group_children=0',
      price_total: 1576,
      persons: 12,
      ort: 'Fischen im Allgäu',
      fahrzeit: '2:10 h',
      km: '211 km',
      pass: { name: 'Oberstdorf – Kleinwalsertal', km: 130, anlagen: 48 },
      gebiet: { name: 'Nebelhorn / Fellhorn', km: 130, weg: '9,5 km · 16 Min' },
      auch: { name: 'Hörnerdörfer (Bolsterlang, Balderschwang)', km: 90, weg: 'eigener Verbundpass' },
      betten: '6 auf 3 Wohnungen (1 Schlafsofa, 4 Doppelbetten, 2 Einzelbetten)',
      sofas: 1,
      baeder: '3, je Wohnung eines',
      kueche: 'je Wohnung eine eigene',
      storno: 'kostenlos stornierbar',
      rating: 8.3,
      reviews: 25,
      einheiten: ['3 Ferienwohnungen, je 1 Schlafzimmer, ab 50 m²'],
      gross: 50,
      badge: { text: 'Günstigster Treffer der Liste', art: 'gut' },
      kurz: 'Mit 131 € pro Kopf das Billigste, was im Oberstdorfer Gebiet überhaupt zu finden ist — dafür nur 25 Bewertungen.',
      created_at: '2026-11-17T09:00:00Z',
    },
    {
      id: 'cfg-alpenland',
      name: 'Ruben Geyer',
      rank: 2,
      title: 'Haus Alpenland / Schneider',
      url: 'https://www.booking.com/hotel/de/haus-alpenland-obermaiselstein.de.html?checkin=2027-01-29&checkout=2027-02-01&group_adults=12&no_rooms=1&group_children=0',
      price_total: 1662,
      persons: 12,
      ort: 'Obermaiselstein',
      fahrzeit: '2:11 h',
      km: '211 km',
      pass: { name: 'Oberstdorf – Kleinwalsertal', km: 130, anlagen: 48 },
      gebiet: { name: 'Grasgehren / Riedbergpass', weg: 'im Ort' },
      auch: { name: 'Fellhorn – Kanzelwand', km: 36, weg: '12 km · 18 Min' },
      betten: '7 auf 3 Wohnungen (2 Etagenbetten, 4 Doppelbetten, 1 Schlafsofa)',
      sofas: 1,
      baeder: '3, je Wohnung eines',
      kueche: 'je Wohnung eine eigene',
      storno: 'kostenlos stornierbar',
      rating: 8.8,
      reviews: 12,
      einheiten: ['3 Ferienwohnungen, je 1 Schlafzimmer, ab 55 m²'],
      gross: 55,
      badge: { text: 'Nur 12 Bewertungen', art: 'warn' },
      kurz: 'Zweitbilligster Treffer und gut benotet — aber zwölf Stimmen sind zu wenig, um der Note zu trauen.',
      created_at: '2026-11-17T09:00:00Z',
    },
    {
      id: 'cfg-alpenruhe-pool-lodge',
      name: 'Ruben Geyer',
      rank: 3,
      title: 'Alpenruhe Pool Lodge — Snow & Spa',
      url: 'https://www.booking.com/hotel/de/ferienwohnung-bad-hindelang.de.html?checkin=2027-01-29&checkout=2027-02-01&group_adults=12&no_rooms=1&group_children=0',
      price_total: 1769,
      persons: 12,
      ort: 'Bad Hindelang',
      fahrzeit: '2:05 h',
      km: '206 km',
      pass: { name: 'Oberjoch – Bad Hindelang', km: 32, anlagen: 6 },
      gebiet: { name: 'Oberjoch (Iseler, Wiedhag)', km: 32, weg: '8,9 km · 13 Min' },
      // ⚠️ Das ist der einzige Eintrag, bei dem ALLE zwölf in EINEM Haus
      // schlafen und trotzdem jeder ein richtiges Bett hat: fünf Schlafzimmer
      // mit fünf Doppelbetten und zwei Einzelbetten = genau 12 Plaetze. Die
      // drei Schlafsofas sind Reserve, nicht Teil der Rechnung.
      betten: '12 in 5 Schlafzimmern (5 Doppelbetten, 2 Einzelbetten) — Schlafsofas zusätzlich',
      sofas: 3,
      baeder: '6',
      kueche: 'eine gemeinsame',
      storno: 'kostenlos stornierbar',
      rating: 10,
      reviews: 1,
      einheiten: ['1 Chalet, 420 m², 5 Schlafzimmer, 2 Wohnzimmer, 6 Bäder, eigener Pool'],
      gross: 420,
      badge: { text: 'Ein Haus, 12 echte Betten, 6 Bäder', art: 'gut' },
      // ⚠️ Fuer DREIZEHN verschwindet dieser Eintrag aus der Booking-Suche —
      // bei zwoelf ist die Kapazitaet erschoepft. Wer den 13. mitnehmen will,
      // muss hier beim Vermieter nachfragen oder etwas anderes nehmen.
      kurz: '420 m² für alle zwölf unter einem Dach, sechs Bäder, Pool — und mit 147 € der drittbilligste Eintrag; der Haken ist die einzige Bewertung.',
      created_at: '2026-11-17T09:00:00Z',
    },
    {
      id: 'cfg-myrelaxs-little-villa',
      name: 'Ruben Geyer',
      rank: 4,
      title: 'my Relaxs little Villa',
      url: 'https://www.booking.com/hotel/at/my-relaxs-little-villa.de.html?checkin=2027-01-29&checkout=2027-02-01&group_adults=12&no_rooms=1&group_children=0',
      price_total: 1971,
      persons: 12,
      ort: 'St. Anton im Montafon',
      fahrzeit: '2:42 h',
      km: '265 km',
      pass: { name: 'Montafon Brandnertal Card', km: 297, anlagen: 79 },
      gebiet: { name: 'Silvretta Montafon', km: 140, weg: '14 km · 18 Min' },
      betten: '7 in 5 Schlafzimmern (5 Doppelbetten, 2 Schlafsofas)',
      sofas: 2,
      baeder: '2',
      kueche: 'eine gemeinsame',
      storno: 'kostenlos stornierbar',
      rating: 7.9,
      reviews: 24,
      einheiten: ['1 Wohnung, 130 m², 5 Schlafzimmer, 1 Wohnzimmer'],
      gross: 130,
      badge: { text: 'Größtes zusammenhängendes Gebiet', art: 'gut' },
      kurz: 'Auch alle unter einem Dach, und die Silvretta Montafon ist mit 140 verbundenen Kilometern das größte Gebiet hier — nur zwei Bäder für zwölf.',
      created_at: '2026-11-17T09:00:00Z',
    },
    {
      id: 'cfg-oberstdorf-ferienwelt',
      name: 'Ruben Geyer',
      rank: 5,
      title: 'Oberstdorfer Ferienwelt',
      url: 'https://www.booking.com/hotel/de/oberstdorfer-ferienwelt.de.html?checkin=2027-01-29&checkout=2027-02-01&group_adults=12&no_rooms=1&group_children=0',
      price_total: 2177,
      persons: 12,
      ort: 'Oberstdorf',
      fahrzeit: '2:16 h',
      km: '215 km',
      pass: { name: 'Oberstdorf – Kleinwalsertal', km: 130, anlagen: 48 },
      gebiet: { name: 'Oberstdorf – Kleinwalsertal', km: 130, anlagen: 48, weg: 'Nebelhorn 1,2 km' },
      auch: { name: 'Fellhorn – Kanzelwand', km: 36, weg: '5,1 km · 15 Min' },
      betten: '6 auf 3 Wohnungen (3 Schlafsofas, 3 Doppelbetten)',
      sofas: 3,
      baeder: '3, je Wohnung eines',
      kueche: 'je Wohnung eine eigene',
      storno: 'kostenlos stornierbar',
      rating: 8.8,
      reviews: 332,
      einheiten: ['3 Ferienwohnungen, je 1 Schlafzimmer, 40–48 m²'],
      gross: 48,
      badge: { text: '332 Bewertungen — belastbarste Note im Allgäu', art: 'gut' },
      kurz: 'Bei zwölf statt vierzehn fällt der Preis von 2.813 auf 2.177 € — nur reicht es dann für drei Wohnungen, also halbe Gruppe pro Küche.',
      created_at: '2026-11-17T09:00:00Z',
    },
    {
      id: 'cfg-landal-gargellen',
      name: 'Ruben Geyer',
      rank: 6,
      title: 'Landal Hochmontafon',
      // ⚠️ Steht NICHT im Montafon-Haupttal, sondern in Gargellen, einem
      // Seitental — daher 3:05 h statt 2:42 h.
      url: 'https://www.booking.com/hotel/at/landal-hochmontafon.de.html?checkin=2027-01-29&checkout=2027-02-01&group_adults=12&no_rooms=1&group_children=0',
      price_total: 2250,
      persons: 12,
      ort: 'Gargellen',
      fahrzeit: '3:05 h',
      km: '286 km',
      pass: { name: 'Montafon Brandnertal Card', km: 297, anlagen: 79 },
      gebiet: { name: 'Gargellen', km: 31, weg: 'im Ort' },
      auch: { name: 'Silvretta Montafon', km: 140, weg: '20 km · 25 Min' },
      betten: 'nicht ausgewiesen; die beiden Wohnungen fassen je 6 Erwachsene',
      baeder: '2, je Wohnung eines',
      kueche: 'je Wohnung eine eigene',
      storno: 'kostenlos stornierbar',
      rating: 8.4,
      reviews: 31,
      einheiten: ['2 Apartments mit je 2 Schlafzimmern, je 65 m², je 6 Personen'],
      gross: 65,
      badge: { text: 'Gebiet im Ort', art: 'gut' },
      kurz: 'Zwei saubere Sechser-Wohnungen und der Lift vor der Tür — dafür die längste Anfahrt der Allgäu-Alternativen.',
      created_at: '2026-11-17T09:00:00Z',
    },
    {
      id: 'cfg-chalet-rotenstein-berwang',
      name: 'Ruben Geyer',
      rank: 7,
      title: 'Chalet Rotenstein',
      url: 'https://www.booking.com/hotel/at/chalets-zur-rose-und-rotenstein.de.html?checkin=2027-01-29&checkout=2027-02-01&group_adults=12&no_rooms=1&group_children=0',
      price_total: 2308,
      persons: 12,
      ort: 'Berwang',
      // ⚠️ 236 km, aber 3:10 h — Berwang liegt auf einer Bergstrasse ueber dem
      // Tal. Ehrwald ist 4 km WEITER und trotzdem fast eine halbe Stunde naeher.
      fahrzeit: '3:10 h',
      km: '236 km',
      pass: { name: 'Tiroler Zugspitz Arena', km: 143, hinweis: 'sieben Gebiete; mit der Top Snow Card dazu Garmisch und Mittenwald' },
      gebiet: { name: 'Berwang – Bichlbach', km: 38, weg: 'im Ort' },
      betten: '2 Wohnungen, zusammen für 12 ausgelegt',
      baeder: '2, je Wohnung eines',
      kueche: 'je Wohnung eine eigene',
      storno: 'kostenlos stornierbar',
      rating: 8.4,
      reviews: 69,
      einheiten: ['2 Ferienwohnungen, je ca. 80 m², je 2 Schlafzimmer'],
      gross: 80,
      badge: { text: '3:10 h trotz nur 236 km', art: 'warn' },
      kurz: 'Fällt bei zwölf von 3.009 auf 2.308 € und hat das Gebiet im Ort — die Bergstraße kostet aber eine halbe Stunde extra.',
      created_at: '2026-11-17T09:00:00Z',
    },
    {
      id: 'cfg-oberstdorf-hostel',
      name: 'Ruben Geyer',
      rank: 8,
      title: 'Oberstdorf Hostel',
      url: 'https://www.booking.com/hotel/de/oberstdorf-hostel.de.html?checkin=2027-01-29&checkout=2027-02-01&group_adults=12&no_rooms=1&group_children=0',
      price_total: 2405,
      persons: 12,
      ort: 'Oberstdorf',
      fahrzeit: '2:16 h',
      km: '215 km',
      pass: { name: 'Oberstdorf – Kleinwalsertal', km: 130, anlagen: 48 },
      gebiet: { name: 'Oberstdorf – Kleinwalsertal', km: 130, anlagen: 48, weg: 'Fellhorn 5,1 km · 15 Min' },
      // Zwei Schlafsaele zu je sechs Plaetzen, jeder mit eigenem Bad. Fuer eine
      // Gruppe, die ohnehin zusammen sein will, ist das kein Nachteil — nur
      // schlaeft man im Etagenbett und kocht nicht selbst.
      betten: '12 Etagenbett-Plätze in 2 Sechser-Räumen',
      sofas: 0,
      baeder: '2, je Raum eines',
      kueche: 'keine eigene — dafür Frühstück inbegriffen',
      storno: 'nicht kostenlos stornierbar',
      rating: 8.4,
      reviews: 1314,
      einheiten: ['2 Schlafsäle à 6 Plätze, je 30 m², je eigenes Bad'],
      gross: 30,
      badge: { text: '1.314 Bewertungen — mit Abstand die sicherste Note', art: 'gut' },
      kurz: 'Frühstück inbegriffen, 200 € pro Kopf und die einzige Note der Liste, an der es nichts zu deuteln gibt — dafür Etagenbett statt Ferienwohnung.',
      created_at: '2026-11-17T09:00:00Z',
    },
    {
      id: 'cfg-alpura-hindelang',
      name: 'Ruben Geyer',
      rank: 9,
      title: 'ALPURA Allgäu — Hotel, Gym & Sauna',
      url: 'https://www.booking.com/hotel/de/berghotel-muhle.de.html?checkin=2027-01-29&checkout=2027-02-01&group_adults=12&no_rooms=1&group_children=0',
      price_total: 2408,
      persons: 12,
      ort: 'Bad Hindelang',
      fahrzeit: '2:05 h',
      km: '206 km',
      pass: { name: 'Oberjoch – Bad Hindelang', km: 32, anlagen: 6 },
      gebiet: { name: 'Oberjoch (Iseler, Wiedhag)', km: 32, weg: '8,9 km · 13 Min' },
      betten: '6 auf 2 Suiten (4 Doppelbetten, 2 Schlafsofas)',
      sofas: 2,
      baeder: '2, je Suite eines',
      kueche: 'keine',
      storno: 'kostenlos stornierbar',
      rating: 8.9,
      reviews: 76,
      einheiten: ['2 Suiten mit je 2 Schlafzimmern und eigenem Wohnzimmer'],
      badge: { text: 'Gym und Sauna im Haus', art: 'gut' },
      kurz: 'Zwei große Suiten statt verteilter Wohnungen, kürzeste Anfahrt der Liste — aber nur zwei Bäder und sechs Betten für zwölf Leute.',
      created_at: '2026-11-17T09:00:00Z',
    },
    {
      id: 'cfg-rosengarten',
      name: 'Ruben Geyer',
      rank: 10,
      title: 'Rosengarten Apartments',
      url: 'https://www.booking.com/hotel/at/rosengarten-apartments.de.html?checkin=2027-01-29&checkout=2027-02-01&group_adults=12&no_rooms=1&group_children=0',
      price_total: 2415,
      persons: 12,
      ort: 'Bürs',
      fahrzeit: '2:36 h',
      km: '259 km',
      pass: { name: 'Montafon Brandnertal Card', km: 297, anlagen: 79 },
      gebiet: { name: 'Brandnertal', km: 64, weg: '11 km · 15 Min' },
      auch: { name: 'Silvretta Montafon', km: 140, weg: '18 km · 22 Min' },
      betten: 'je Wohnung 3 (2 große Doppelbetten, 1 Schlafsofa)',
      baeder: 'je Wohnung eines',
      kueche: 'je Wohnung eine eigene',
      storno: 'kostenlos stornierbar',
      rating: 9.0,
      reviews: 61,
      einheiten: ['Apartments mit je 2 Schlafzimmern, je 70 m²'],
      gross: 70,
      badge: { text: 'Zwei Gebiete in Reichweite', art: 'gut' },
      kurz: 'Note 9,0 und zwei große Gebiete in je einer Viertelstunde — Bürs selbst ist allerdings Stadtrand, kein Skiort.',
      created_at: '2026-11-17T09:00:00Z',
    },
    {
      id: 'cfg-charivari-bolsterlang',
      name: 'Ruben Geyer',
      rank: 11,
      title: 'Vintage Hotel Charivari',
      url: 'https://www.booking.com/hotel/de/charivaris-wintergarten.de.html?checkin=2027-01-29&checkout=2027-02-01&group_adults=12&no_rooms=1&group_children=0',
      price_total: 2665,
      persons: 12,
      ort: 'Bolsterlang',
      fahrzeit: '2:18 h',
      km: '212 km',
      pass: { name: 'Hörnerdörfer', km: 90, hinweis: 'fünf Gebiete: Bolsterlang, Balderschwang, Ofterschwang, Grasgehren, Fischen' },
      gebiet: { name: 'Hörnerbahn Bolsterlang', km: 17, weg: '3,3 km · 13 Min' },
      auch: { name: 'Fellhorn – Kanzelwand', km: 36, weg: '16 km · 22 Min' },
      betten: '11 in 3 Zimmern (Etagen- und Doppelbetten gemischt)',
      baeder: '3, je Zimmer eines',
      kueche: 'keine — Frühstück inbegriffen, Restaurant im Haus',
      storno: 'kostenlos stornierbar',
      rating: 8.3,
      reviews: 386,
      einheiten: ['1 Deluxe-Zimmer und 2 Superior-Familienzimmer'],
      badge: { text: 'Frühstück und Restaurant im Haus', art: 'gut' },
      kurz: 'Frühstück, Restaurant und 386 Bewertungen im Rücken — die Hörnerbahn ist aber mit 17 km ein kleiner Berg.',
      created_at: '2026-11-17T09:00:00Z',
    },
    {
      id: 'cfg-bergheimat-burgberg',
      name: 'Ruben Geyer',
      rank: 12,
      title: 'Landhaus Bergheimat',
      // ⚠️ DIESELBE Unterkunft steht auf BEIDEN Portalen und die Portale sind
      // sich nicht einig. Hier steht der Airbnb-Link, weil er billiger ist UND
      // die Note dort auf siebzehnmal so vielen Stimmen steht.
      // Booking-Seite: /hotel/de/landhaus-bergheimat-burgberg-im-allgau2
      url: 'https://www.airbnb.de/rooms/21261609?check_in=2027-01-29&check_out=2027-02-01&adults=12',
      price_total: 2890,
      persons: 12,
      ort: 'Burgberg im Allgäu',
      fahrzeit: '2:08 h',
      km: '202 km',
      // Kein Lift vor der Tuer, dafuer drei Gebiete im gleichen Umkreis.
      pass: { name: 'Allgäuer Hörnerdörfer', km: 90, hinweis: 'fünf Orte auf einem Pass' },
      gebiet: { name: 'Grünten / Ofterschwang', weg: '10 km' },
      auch: { name: 'Oberjoch', weg: '19 km' },
      betten: '10 Betten auf 7 Schlafzimmer',
      baeder: '3,5',
      kueche: 'eine für alle',
      storno: 'siehe Airbnb',
      // ⚠️ Hier steht bewusst die BOOKING-Note, obwohl der Link zu Airbnb geht:
      // Airbnbs 4,9 von 5 waeren umgerechnet 9,8 — neben Bookings 8,8 sieht das
      // nach „deutlich besser" aus, ist es aber nicht. Airbnb-Noten liegen
      // systematisch hoeher. Zwei Skalen in einer Spalte vergleichen heisst,
      // die Reihenfolge zu faelschen. Die 123 Airbnb-Stimmen stehen im Satz.
      rating: 9.4,
      reviews: 7,
      einheiten: ['1 ganzes Ferienhaus: 7 Schlafzimmer, 10 Betten, 3,5 Badezimmer'],
      badge: { text: 'Alle unter einem Dach', art: 'gut' },
      kurz: 'Sieben Schlafzimmer für alle zwölf und kurze Fahrt — über Airbnb mit 4,9 aus 123 Bewertungen statt Bookings 7.',
      created_at: '2026-11-17T09:00:00Z',
    },
    {
      id: 'cfg-hoernerhaus-bolsterlang',
      name: 'Ruben Geyer',
      rank: 13,
      title: 'Berggasthof Hörnerhaus',
      url: 'https://www.booking.com/hotel/de/berggasthof-hornerhaus.de.html?checkin=2027-01-29&checkout=2027-02-01&group_adults=12&no_rooms=1&group_children=0',
      price_total: 3149,
      persons: 12,
      ort: 'Bolsterlang',
      fahrzeit: '2:18 h',
      km: '212 km',
      pass: { name: 'Hörnerdörfer', km: 90, hinweis: 'fünf Gebiete: Bolsterlang, Balderschwang, Ofterschwang, Grasgehren, Fischen' },
      gebiet: { name: 'Hörnerbahn Bolsterlang', km: 17, weg: '3,3 km · 13 Min' },
      // Der einzige Eintrag mit HALBPENSION. 262 € p. P. klingt nach viel,
      // enthaelt aber drei Fruehstuecke UND drei Abendessen — rechnet man die
      // mit 25 € je Abendessen, liegt die reine Uebernachtung bei rund 190 €.
      betten: '12 Etagenbett-Plätze in 3 Vierbettzimmern',
      sofas: 0,
      baeder: '3, je Zimmer eines',
      kueche: 'keine — Frühstück UND Abendessen inbegriffen',
      storno: 'teilweise erstattbar',
      rating: 8.5,
      reviews: 155,
      einheiten: ['3 Vierbettzimmer, je 15 m², mit Bergblick'],
      gross: 15,
      badge: { text: 'Einziger mit Halbpension', art: 'gut' },
      kurz: 'Frühstück und Abendessen inbegriffen — damit ist das trotz der 262 € rechnerisch der günstigste Eintrag, wenn man das Essen gegenrechnet.',
      created_at: '2026-11-17T09:00:00Z',
    },
    {
      id: 'cfg-myrelaxs',
      name: 'Ruben Geyer',
      rank: 14,
      title: 'myRelaxs Frigo Appartments',
      url: 'https://www.booking.com/hotel/at/myrelaxs-frigo-appartments.de.html?checkin=2027-01-29&checkout=2027-02-01&group_adults=12&no_rooms=1&group_children=0',
      price_total: 3150,
      persons: 12,
      ort: 'St. Anton im Montafon',
      fahrzeit: '2:42 h',
      km: '265 km',
      pass: { name: 'Montafon Brandnertal Card', km: 297, anlagen: 79 },
      gebiet: { name: 'Silvretta Montafon', km: 140, weg: '14 km · 18 Min' },
      betten: 'je Wohnung 2 (1 Doppelbett, 1 Schlafsofa)',
      baeder: 'je Wohnung eines',
      kueche: 'je Wohnung eine eigene',
      storno: 'kostenlos stornierbar',
      einheiten: ['Apartments mit je 1 Schlafzimmer, je 45 m²'],
      gross: 45,
      badge: { text: 'Keine einzige Bewertung', art: 'warn' },
      kurz: 'Gleiches Gebiet wie die little Villa, aber 1.200 € teurer und ohne eine einzige Bewertung.',
      created_at: '2026-11-17T09:00:00Z',
    },
    {
      id: 'cfg-chalet-allgaeu-fischen',
      name: 'Ruben Geyer',
      rank: 15,
      title: 'Chalet Allgäu',
      url: 'https://www.booking.com/hotel/de/haus-stoll-am-rubihorn-fischen-im-allgau.de.html?checkin=2027-01-29&checkout=2027-02-01&group_adults=12&no_rooms=1&group_children=0',
      price_total: 3226,
      persons: 12,
      ort: 'Fischen im Allgäu',
      fahrzeit: '2:10 h',
      km: '211 km',
      pass: { name: 'Oberstdorf – Kleinwalsertal', km: 130, anlagen: 48 },
      gebiet: { name: 'Nebelhorn / Fellhorn', km: 130, weg: '9,5 km · 16 Min' },
      auch: { name: 'Hörnerdörfer', km: 90, weg: 'eigener Verbundpass' },
      betten: '8 auf 3 Chalets (6 große Doppelbetten, 1 Schlafsofa, 1 Doppelbett)',
      sofas: 1,
      baeder: '3, je Chalet eines',
      kueche: 'je Chalet eine eigene',
      storno: 'kostenlos stornierbar',
      rating: 9.5,
      reviews: 92,
      einheiten: ['1 Chalet 130 m² (3 Schlafzimmer), 2 Chalets 80–100 m² (je 2 Schlafzimmer)'],
      gross: 130,
      badge: { text: 'Beste Note mit belastbarer Stimmenzahl: 9,5 aus 92', art: 'gut' },
      kurz: 'Die höchste Note der Liste, die auf genug Stimmen steht — eigene Chalets mit großen Doppelbetten statt Schlafsofas.',
      created_at: '2026-11-17T09:00:00Z',
    },
    {
      id: 'cfg-zweistapfenweg-oberstdorf',
      name: 'Ruben Geyer',
      rank: 16,
      title: 'Zweistapfenweg 9a',
      url: 'https://www.booking.com/hotel/de/zweistapfenweg-9a.de.html?checkin=2027-01-29&checkout=2027-02-01&group_adults=12&no_rooms=1&group_children=0',
      price_total: 3553,
      persons: 12,
      ort: 'Oberstdorf',
      fahrzeit: '2:16 h',
      km: '215 km',
      pass: { name: 'Oberstdorf – Kleinwalsertal', km: 130, anlagen: 48 },
      gebiet: { name: 'Oberstdorf – Kleinwalsertal', km: 130, anlagen: 48, weg: 'Fellhorn 5,1 km · 15 Min' },
      betten: '8 auf 4 Wohnungen (3 Einzelbetten, 5 Doppelbetten)',
      sofas: 0,
      baeder: '4, je Wohnung eines',
      kueche: 'je Wohnung eine eigene',
      storno: 'kostenlos stornierbar',
      rating: 8.4,
      reviews: 108,
      einheiten: ['4 Ferienwohnungen: 2× 65 m², 1× 55 m², 1× 45 m²'],
      gross: 65,
      badge: { text: 'Kein einziges Schlafsofa', art: 'gut' },
      kurz: 'Vier Wohnungen mitten in Oberstdorf, in denen niemand auf dem Sofa landet — kostet aber 115 € pro Kopf mehr als die Ferienwelt nebenan.',
      created_at: '2026-11-17T09:00:00Z',
    },
    {
      id: 'cfg-huesle',
      name: 'Ruben Geyer',
      rank: 17,
      title: 'HŪSLE by UNIQUE PLACES',
      url: 'https://www.booking.com/hotel/at/unique-places-ferienhauser.de.html?checkin=2027-01-29&checkout=2027-02-01&group_adults=12&no_rooms=1&group_children=0',
      price_total: 3660,
      persons: 12,
      ort: 'Bludenz',
      fahrzeit: '2:38 h',
      km: '260 km',
      pass: { name: 'Montafon Brandnertal Card', km: 297, anlagen: 79 },
      gebiet: { name: 'Brandnertal', km: 64, weg: '13 km · 17 Min' },
      auch: { name: 'Silvretta Montafon', km: 140, weg: '16 km · 20 Min' },
      betten: 'je Haus 4 (2 Einzelbetten, 1 Schlafsofa, 1 Doppelbett)',
      baeder: 'je Haus eines',
      kueche: 'je Haus eine eigene',
      storno: 'kostenlos stornierbar',
      rating: 8.4,
      reviews: 112,
      einheiten: ['Ferienhäuser mit je 2 Schlafzimmern, je 60 m²'],
      gross: 60,
      badge: { text: 'Eigene kleine Häuser', art: 'gut' },
      kurz: 'Eigene Tiny Houses statt Wohnungen im Block — der Preis pro Kopf ist dafür doppelt so hoch wie beim Spitzenreiter.',
      created_at: '2026-11-17T09:00:00Z',
    },
    {
      id: 'cfg-zugspitz-lodge-ehrwald',
      name: 'Ruben Geyer',
      rank: 18,
      title: 'Zugspitz Lodge',
      url: 'https://www.booking.com/hotel/at/zugspitzlodge.de.html?checkin=2027-01-29&checkout=2027-02-01&group_adults=12&no_rooms=1&group_children=0',
      price_total: 3948,
      persons: 12,
      ort: 'Ehrwald',
      fahrzeit: '2:42 h',
      km: '240 km',
      pass: { name: 'Tiroler Zugspitz Arena', km: 143, hinweis: 'sieben Gebiete; mit der Top Snow Card dazu Garmisch und Mittenwald' },
      gebiet: { name: 'Ehrwalder Alm / Zugspitzplatt', weg: 'im Ort' },
      betten: '6 auf 3 Chalets (3 große Doppelbetten, 3 Schlafsofas)',
      sofas: 3,
      baeder: '3, je Chalet eines',
      kueche: 'je Chalet eine eigene',
      storno: 'kostenlos stornierbar',
      rating: 9.3,
      reviews: 237,
      einheiten: ['3 eigene Chalets mit je Schlafzimmer, Wohnzimmer, Bad und Küche'],
      badge: { text: '9,3 aus 237 Stimmen', art: 'gut' },
      kurz: 'War bei vierzehn mit 4.855 € über dem Deckel und ist jetzt drunter — bleibt mit 329 € trotzdem einer der teuersten Einträge.',
      created_at: '2026-11-17T09:00:00Z',
    },
    {
      id: 'cfg-bsundrix',
      name: 'Ruben Geyer',
      rank: 19,
      title: 'bsundrix — Alpine Chalets',
      // ⚠️ Heisst „Bludenz" im Booking-Text, steht aber in Loruens.
      url: 'https://www.booking.com/hotel/at/bsundrix-living-tiny-skadi.de.html?checkin=2027-01-29&checkout=2027-02-01&group_adults=12&no_rooms=1&group_children=0',
      price_total: 3955,
      persons: 12,
      ort: 'Lorüns',
      fahrzeit: '2:39 h',
      km: '262 km',
      pass: { name: 'Montafon Brandnertal Card', km: 297, anlagen: 79 },
      gebiet: { name: 'Silvretta Montafon', km: 140, weg: '12 km · 16 Min' },
      betten: 'je Haus 4 (3 große Doppelbetten, 1 weiteres)',
      baeder: 'je Haus drei',
      kueche: 'je Haus eine eigene',
      storno: 'kostenlos stornierbar',
      rating: 8.6,
      reviews: 16,
      einheiten: ['Ferienhäuser mit je 3 Schlafzimmern und 3 Bädern, je 74 m²'],
      gross: 74,
      badge: { text: 'Nur 16 Bewertungen', art: 'warn' },
      kurz: 'Drei Bäder pro Haus ist der beste Schnitt der Liste — zu 330 € pro Kopf und auf nur 16 Stimmen.',
      created_at: '2026-11-17T09:00:00Z',
    },
    {
      id: 'cfg-alpine-lodge-kloesterle',
      name: 'Ruben Geyer',
      rank: 20,
      title: 'Alpine Lodge Klösterle am Arlberg',
      url: 'https://www.booking.com/hotel/at/alpine-lodge-klosterle-am-arlberg.de.html?checkin=2027-01-29&checkout=2027-02-01&group_adults=12&no_rooms=1&group_children=0',
      price_total: 4138,
      persons: 12,
      ort: 'Klösterle am Arlberg',
      fahrzeit: '2:54 h',
      km: '280 km',
      // ⚠️ Kloesterle liegt am Arlberg, das HAUSGEBIET ist aber der Sonnenkopf
      // mit 30 km. Ski Arlberg (305 km) faengt erst in Stuben an, 9 km weiter.
      pass: { name: 'Sonnenkopf', km: 30, hinweis: 'Ski Arlberg mit 305 km beginnt 9 km weiter in Stuben, eigener Pass' },
      gebiet: { name: 'Sonnenkopf Klösterle', km: 30, weg: 'im Ort' },
      auch: { name: 'Ski Arlberg (St. Anton, Lech, Zürs)', km: 305, weg: '9 km · 10 Min nach Stuben' },
      betten: '6 auf 2 Wohnungen (4 große Doppelbetten, 2 weitere)',
      baeder: '2, je Wohnung eines',
      kueche: 'je Wohnung eine eigene',
      storno: 'kostenlos stornierbar',
      rating: 8.1,
      reviews: 164,
      einheiten: ['2 Apartments mit je 2 Schlafzimmern und Balkon'],
      badge: { text: 'Einziger Eintrag am Arlberg', art: 'gut' },
      kurz: 'Der einzige Weg, mit zwölf Leuten unter dem Deckel an den Arlberg zu kommen — mit 345 € pro Kopf schrammt er gerade so drunter durch.',
      created_at: '2026-11-17T09:00:00Z',
    },
  ],

  // ===========================================================
  // Skigebiete & Anfahrt — aufklappbarer Kasten unter den Unterkünften.
  // Erklärt, was an den Zahlen oben dranhängt: welcher Pass wo gilt, und was
  // „297 km" wert sind, wenn zwischen den Gebieten eine Autofahrt steht.
  // ===========================================================
  regions: {
    title: 'Skigebiete & Anfahrt',
    teaser: 'Was der Skipass abdeckt · Fahrzeiten ab Denkendorf',
    lead: 'Die wichtigste Unterscheidung steht nicht in der Kilometerzahl: Im Allgäu und im Montafon steht zwischen den Bergen eine Autofahrt. Zusammenhängend fährt man nur innerhalb eines Gebiets.',

    // Gemessen über einen Routendienst, ohne Verkehr. Freitagnachmittag im
    // Januar kommen realistisch 10–20 % dazu.
    drives: [
      { ort: 'Bad Hindelang / Oberjoch', zeit: '2:05 h', km: '206 km' },
      { ort: 'Burgberg im Allgäu', zeit: '2:08 h', km: '202 km' },
      { ort: 'Fischen im Allgäu', zeit: '2:10 h', km: '211 km' },
      { ort: 'Obermaiselstein', zeit: '2:11 h', km: '211 km' },
      { ort: 'Oberstdorf', zeit: '2:16 h', km: '215 km' },
      { ort: 'Bolsterlang', zeit: '2:18 h', km: '212 km' },
      { ort: 'Bürs', zeit: '2:36 h', km: '259 km' },
      { ort: 'Bludenz', zeit: '2:38 h', km: '260 km' },
      { ort: 'Lorüns', zeit: '2:39 h', km: '262 km' },
      { ort: 'St. Anton im Montafon', zeit: '2:42 h', km: '265 km' },
      { ort: 'Ehrwald', zeit: '2:42 h', km: '240 km' },
      { ort: 'Brand', zeit: '2:53 h', km: '267 km' },
      { ort: 'Klösterle am Arlberg', zeit: '2:54 h', km: '280 km' },
      { ort: 'Schröcken', zeit: '3:03 h', km: '272 km' },
      { ort: 'Gargellen', zeit: '3:05 h', km: '286 km' },
      // ⚠️ Berwang steht hier UNTER Gargellen, obwohl es 50 km naeher liegt:
      // die letzten Kilometer gehen als Bergstrasse hoch. Deshalb ist diese
      // Liste nach ZEIT sortiert und nicht nach Entfernung.
      { ort: 'Berwang', zeit: '3:10 h', km: '236 km' },
      { ort: 'Warth am Arlberg', zeit: '3:14 h', km: '278 km' },
    ],

    passes: [
      {
        name: 'Oberstdorf – Kleinwalsertal',
        gross: 'rund 130 km',
        sub: '5 Berge · 44–48 Anlagen',
        areas: [
          ['Fellhorn / Kanzelwand', '36 km'],
          ['Ifen', 'rund 24 km'],
          ['Söllereck', '14 km'],
          ['Nebelhorn, Walmendingerhorn', 'getrennt'],
        ],
        verbunden: false,
        // Der fette Vorspann („Nicht per Lift verbunden.") kommt aus
        // `verbunden`, hier steht nur, was danach folgt.
        text: 'Nur Fellhorn und Kanzelwand hängen zusammen, die anderen Berge sind getrennt. Dafür die kürzeste Anfahrt der ganzen Liste.',
      },
      {
        name: 'Montafon Brandnertal Card',
        gross: 'rund 297 km',
        sub: '9 Gebiete · rund 79 Anlagen',
        areas: [
          ['Silvretta Montafon', '140 km'],
          ['Brandnertal', '64 km'],
          ['Golm', '44 km'],
          ['Gargellen', '31 km'],
          ['Kristberg, Muttersberg …', 'klein'],
        ],
        verbunden: false,
        text: 'Zusammenhängend sind nur die 140 km der Silvretta Montafon — mehr, als wir an drei Tagen abfahren. Bus und Bahn sind im Pass enthalten, der Wechsel kostet also Zeit, kein Geld.',
      },
      {
        name: 'Ski Arlberg',
        gross: 'rund 305 km',
        sub: '85–88 Lifte · größtes Gebiet Österreichs',
        areas: [
          ['St. Anton · Stuben · Zürs · Lech', 'verbunden'],
          ['Warth · Schröcken', 'verbunden'],
        ],
        verbunden: true,
        // Am 17.11.2026 fuer ZWOELF neu durchsucht. Das aendert das Bild nur
        // halb: In Warth und Schroecken selbst gibt es weiterhin fast nichts —
        // drei Treffer insgesamt, davon zwei mit zu wenig Betten. Neu unter dem
        // Deckel ist die Alpine Lodge in KLOESTERLE fuer 4.138 € (345 € p. P.).
        // ⚠️ Kloesterle liegt zwar „am Arlberg", sein Hausgebiet ist aber der
        // Sonnenkopf mit 30 km. Bis zum eigentlichen Ski Arlberg sind es 9 km
        // nach Stuben — und dort gilt ein anderer, teurerer Pass.
        text: 'Das beste Skifahren, aber die Unterkünfte bleiben das Problem: In Warth und Schröcken gibt es für zwölf Leute drei Angebote, davon zwei mit zu wenig Betten. Unter dem Deckel liegt nur die Alpine Lodge in Klösterle — und die hängt am Sonnenkopf mit 30 km, nicht am großen Gebiet.',
      },
      {
        name: 'Oberjoch – Bad Hindelang',
        gross: 'rund 32 km',
        sub: '5–6 Anlagen · höchstgelegener Ort im Allgäu',
        areas: [
          ['Iselerbahn · Wiedhagbahn', '32 km'],
          ['Spieser Unterjoch', 'klein, eigener Lift'],
        ],
        verbunden: true,
        // Erst am 17.11.2026 dazugekommen, weil Bad Hindelang mit 2:05 h die
        // KUERZESTE Anfahrt der ganzen Liste hat — naeher als Oberstdorf.
        // Die Pistenkilometer schwanken je nach Quelle zwischen 32 und 35.
        text: 'Das kleinste Gebiet hier, aber mit 2:05 h die kürzeste Anfahrt überhaupt — und innerhalb der 32 km hängt alles zusammen, man muss also nirgends umsteigen.',
      },
      {
        name: 'Allgäuer Hörnerdörfer',
        gross: 'rund 90 km',
        sub: '5 Gebiete auf einem Pass',
        areas: [
          ['Balderschwang', 'größtes der fünf'],
          ['Ofterschwang – Gunzesried', 'Weltcup-Abfahrt'],
          ['Hörnerbahn Bolsterlang', '17 km'],
          ['Grasgehren, Fischen', 'klein'],
        ],
        verbunden: false,
        // Ein eigener Verbundpass, der NICHT identisch mit Oberstdorf–
        // Kleinwalsertal ist, auch wenn die Orte nebeneinander liegen.
        text: 'Fünf getrennte Berge auf einem Pass, zusammen rund 90 km. Jeder einzelne ist klein — Bolsterlang hat 17 km —, dafür liegen alle fünf innerhalb einer halben Stunde.',
      },
      {
        name: 'Tiroler Zugspitz Arena',
        gross: 'rund 143 km',
        sub: '7 Gebiete · rund 57 Anlagen',
        areas: [
          ['Ehrwalder Alm · Wettersteinbahnen', '36 km'],
          ['Berwang – Bichlbach', '38 km'],
          ['Grubigstein Lermoos', '27 km'],
          ['Zugspitzplatt', '20 km'],
          ['Marienberg Biberwier, Heiterwang', 'klein'],
        ],
        verbunden: false,
        // Erst am 13.11.2026 dazugekommen. Die Zahlen schwanken je nach Quelle
        // und Saison (143 km / 105 km beschneit ist der Stand der Region selbst);
        // die Top Snow Card nennt 89 Anlagen, zaehlt aber Garmisch mit.
        text: 'Die kürzeste Anfahrt aller österreichischen Gebiete hier — Ehrwald liegt näher als jeder Ort im Montafon. Die sieben Berge sind nicht verbunden, dafür deckt die Top Snow Card zusätzlich Garmisch, Mittenwald und Grainau ab.',
      },
    ],

    notes: [
      'Preise: Booking.com, abgefragt am 17. November 2026 für Fr 29. Januar bis Mo 1. Februar 2027, zwölf Erwachsene in einer Buchung. Gesamtpreis für alle drei Nächte und alle Einheiten; „pro Person" ist durch 12 geteilt. Die Preise ändern sich täglich.',
      'Warum zwölf: Die Abstimmung ergab genau zwölf feste Zusagen (dazu fünf „vielleicht"). Jeder Eintrag wurde für zwölf neu abgefragt, keiner ist von vierzehn heruntergerechnet — unter 14 Betten öffnen sich Häuser, die vorher gar nicht in der Suche auftauchten.',
      'Für einen dreizehnten: Die meisten Einträge gehen auch mit 13, etwa 200–270 € pro Kopf. Zwei nicht — Ferienhaus Grünten und Haus Alpenland verschwinden bei 13 aus der Suche, ebenso die Alpenruhe Pool Lodge, deren Kapazität bei zwölf endet.',
      'Fahrzeiten: über einen Routendienst ab Denkendorf gerechnet, ohne Verkehr — Freitagnachmittag im Januar kommen 10–20 % dazu. Der Weg zum Lift ist gefahren, nicht Luftlinie.',
      'Pistenkilometer von bergfex: Silvretta Montafon 140, Brandnertal 64, Golm 44, Fellhorn/Kanzelwand 36, Gargellen 31. Für Oberstdorf–Kleinwalsertal, Oberjoch (32 km) und die Hörnerdörfer (90 km) gibt es nur Drittquellen, die um ±10 % schwanken.',
      'Airbnb wurde für zwölf Gäste mitgesucht (Oberstdorf, Bad Hindelang, Tannheimer Tal, Ehrwald) und hat in keinem Skiort etwas geliefert — die Trefferlisten füllen sich mit Kempten, Unterammergau und am Ende mit Pennsylvania. Nur das Landhaus Bergheimat steht dort günstiger als auf Booking.',
      'Nicht geprüft: ob die Einheiten einer Unterkunft nebeneinander liegen. Bei drei Wohnungen im selben Haus sitzt man abends zusammen, bei drei Häusern im Ort nicht. Das steht in keiner Suchliste und beantwortet nur eine Mail an den Vermieter.',
    ],
  },

  // Tricount-Box auf der Ergebnis-Seite. Erscheint nur, wenn `url` gesetzt ist.
  tricount: {
    url: 'https://tricount.com/tqoqjHpzgEfgktMAgf',   // Link aus der Tricount-App („Teilen")
    title: 'Gemeinsame Kosten in Tricount',
    text: 'Unterkunft, Skipass, Essen: Wer etwas für die Gruppe zahlt, trägt es hier ein. Tricount rechnet aus, wer wem wie viel schuldet.',
  },

  // Ergebnis-Seite
  results: {
    thanks: 'Danke, {name}!',
    text: 'Deine Antworten sind gespeichert. So steht’s gerade:',
    weekends: ['we-jan-23', 'we-jan-30'],   // Fragen-IDs der Terminwahl (Favorit-Vergleich)
    weekendLabels: { 'we-jan-23': '23. – 24. Jan', 'we-jan-30': '30. – 31. Jan' },
    // Zusatztage je Wochenende für den Tagesplan auf der Ergebnis-Seite
    weekendDays: {
      'we-jan-23': { fr: 'Fr 22.1.', main: 'Sa 23. + So 24.', mo: 'Mo 25.1.' },
      'we-jan-30': { fr: 'Fr 29.1.', main: 'Sa 30. + So 31.', mo: 'Mo 1.2.' },
    },
  },
};
