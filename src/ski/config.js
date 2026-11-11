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
  // ⚠️ OBERGRENZE: 350 € pro Person für die drei Nächte (= 4.900 € gesamt bei
  // 14 Leuten). Alles darüber gehört hier nicht rein, auch wenn es schön ist.
  //
  // Felder, die NUR hier gesetzt werden (Einträge von der Seite haben sie
  // nicht; die Anzeige blendet jedes fehlende Feld einfach aus):
  //   ort        Ortsname laut Booking — nicht der Name der Unterkunft!
  //   fahrzeit   ab Denkendorf, über OSRM gemessen, ohne Verkehr
  //   km         Fahrstrecke ab Denkendorf
  //   gebiet     { name, km, anlagen, weg, fuss } — das Hausgebiet
  //   auch       { name, km, weg } — das nächstgrößere, optional
  //   rating / reviews   Booking-Note und Anzahl Bewertungen
  //   einheiten  Wie die 14 Leute verteilt werden (Booking „für Ihre Gruppe")
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
    {
      id: 'cfg-oberstdorf-ferienwelt',
      name: 'Ruben Geyer',
      rank: 1,
      title: 'Oberstdorfer Ferienwelt',
      url: 'https://www.booking.com/hotel/de/oberstdorfer-ferienwelt.de.html?checkin=2027-01-29&checkout=2027-02-01&group_adults=14&no_rooms=1&group_children=0',
      price_total: 2813,
      persons: 14,
      ort: 'Oberstdorf',
      fahrzeit: '2:16 h',
      km: '215 km',
      gebiet: { name: 'Oberstdorf – Kleinwalsertal', km: 130, anlagen: 48, weg: 'Nebelhorn 1,2 km' },
      auch: { name: 'Fellhorn – Kanzelwand', km: 36, weg: '6,8 km · 13 Min' },
      rating: 8.8,
      reviews: 334,
      einheiten: ['4 Ferienwohnungen, je 1 Schlafzimmer, 40–46 m²'],
      gross: 46,
      badge: { text: 'Kürzeste Anfahrt', art: 'gut' },
      kurz: 'Größtes Gebiet und kürzeste Fahrt — dafür vier kleine Wohnungen statt zwei großen.',
      created_at: '2026-11-11T09:00:00Z',
    },
    {
      id: 'cfg-montanara',
      name: 'Ruben Geyer',
      rank: 2,
      title: 'Montanara Lodge',
      url: 'https://www.booking.com/hotel/at/montanara-lodge.de.html?checkin=2027-01-29&checkout=2027-02-01&group_adults=14&no_rooms=1&group_children=0',
      price_total: 4825,
      persons: 14,
      ort: 'Brand',
      fahrzeit: '2:53 h',
      km: '267 km',
      // Booking: „Skilift Schedlerhof 250 m", dazu Dorfbahn 900 m. Die einzige
      // in der Liste mit „Direkter Zugang zur Skipiste".
      gebiet: { name: 'Brandnertal', km: 64, anlagen: 13, weg: 'Skilift 250 m', fuss: true },
      rating: 8.9,
      reviews: 34,
      einheiten: ['3 Ferienwohnungen: 52, 80 und 80 m²'],
      gross: 80,
      badge: { text: 'Lift vor der Tür', art: 'gut' },
      kurz: 'Als Einzige mit Lift zu Fuß und direktem Pistenzugang — reizt das Budget aber aus.',
      created_at: '2026-11-11T09:00:00Z',
    },
    {
      id: 'cfg-rosengarten',
      name: 'Ruben Geyer',
      rank: 3,
      title: 'Rosengarten Apartments',
      url: 'https://www.booking.com/hotel/at/rosengarten-apartments.de.html?checkin=2027-01-29&checkout=2027-02-01&group_adults=14&no_rooms=1&group_children=0',
      price_total: 3235,
      persons: 14,
      ort: 'Bürs',
      fahrzeit: '2:36 h',
      km: '259 km',
      gebiet: { name: 'Brandnertal', km: 64, anlagen: 13, weg: '6,9 km · 9 Min' },
      auch: { name: 'Silvretta Montafon', km: 140, weg: 'rund 25 Min' },
      rating: 9.0,
      reviews: 61,
      einheiten: ['3 Ferienwohnungen: 2× 55 m², 1× 70 m²'],
      gross: 70,
      badge: { text: 'Beste Note', art: 'gut' },
      kurz: 'Beste Bewertung der Liste zum niedrigen Preis — morgens neun Minuten hoch ins Gebiet.',
      created_at: '2026-11-11T09:00:00Z',
    },
    {
      id: 'cfg-alpenland',
      name: 'Ruben Geyer',
      rank: 4,
      title: 'Haus Alpenland',
      url: 'https://www.booking.com/hotel/de/haus-alpenland-obermaiselstein.de.html?checkin=2027-01-29&checkout=2027-02-01&group_adults=14&no_rooms=1&group_children=0',
      price_total: 2014,
      persons: 14,
      ort: 'Obermaiselstein',
      fahrzeit: '2:11 h',
      km: '211 km',
      gebiet: { name: 'Hörnerbahn Bolsterlang', km: 17, anlagen: 6, weg: '4,1 km · 7 Min' },
      auch: { name: 'Oberstdorf (Fellhorn)', km: 36, weg: '16,4 km · 22 Min' },
      rating: 8.8,
      reviews: 12,
      einheiten: ['4 Ferienwohnungen: 46 bis 55 m²'],
      gross: 55,
      badge: { text: 'Günstigster', art: 'gut' },
      kurz: 'Halber Preis, Sauberkeit und Komfort je 9,8 — das Hausgebiet ist dafür klein.',
      created_at: '2026-11-11T09:00:00Z',
    },
    {
      id: 'cfg-bsundrix',
      name: 'Ruben Geyer',
      rank: 5,
      title: 'bsundrix Alpine Chalets',
      url: 'https://www.booking.com/hotel/at/bsundrix-living-tiny-skadi.de.html?checkin=2027-01-29&checkout=2027-02-01&group_adults=14&no_rooms=1&group_children=0',
      price_total: 4871,
      persons: 14,
      ort: 'Lorüns',
      fahrzeit: '2:39 h',
      km: '262 km',
      gebiet: { name: 'Golm', km: 44, anlagen: 9, weg: '5,4 km · 8 Min' },
      auch: { name: 'Brandnertal', km: 64, weg: '10,1 km · 11 Min' },
      rating: 8.6,
      reviews: 16,
      einheiten: ['3 ganze Häuser: 2× 70 m², 1× 74 m² — je 3 Bäder'],
      gross: 74,
      badge: { text: 'Drei ganze Häuser', art: 'gut' },
      kurz: 'Drei eigene Häuser mit je drei Bädern — die Lage-Note ist mit 7,8 die schwächste.',
      created_at: '2026-11-11T09:00:00Z',
    },
    {
      id: 'cfg-huesle',
      name: 'Ruben Geyer',
      rank: 6,
      title: 'HŪSLE Tiny Houses',
      url: 'https://www.booking.com/hotel/at/unique-places-ferienhauser.de.html?checkin=2027-01-29&checkout=2027-02-01&group_adults=14&no_rooms=1&group_children=0',
      price_total: 3900,
      persons: 14,
      ort: 'Bludenz',
      fahrzeit: '2:38 h',
      km: '260 km',
      gebiet: { name: 'Brandnertal', km: 64, anlagen: 13, weg: '12,8 km · 17 Min' },
      rating: 8.4,
      reviews: 111,
      einheiten: ['3 Tiny Houses à 60 m²'],
      gross: 60,
      badge: { text: 'Drei getrennte Häuschen', art: 'warn' },
      kurz: 'Modern und mit 111 Bewertungen gut belegt — aber kein Raum, in den alle 14 passen.',
      created_at: '2026-11-11T09:00:00Z',
    },
    {
      id: 'cfg-myrelaxs',
      name: 'Ruben Geyer',
      rank: 7,
      title: 'myRelaxs Frigo Appartments',
      url: 'https://www.booking.com/hotel/at/myrelaxs-frigo-appartments.de.html?checkin=2027-01-29&checkout=2027-02-01&group_adults=14&no_rooms=1&group_children=0',
      price_total: 4200,
      persons: 14,
      ort: 'St. Anton im Montafon',
      fahrzeit: '2:42 h',
      km: '265 km',
      gebiet: { name: 'Golm', km: 44, anlagen: 9, weg: '2,8 km · 5 Min' },
      rating: null,
      reviews: null,
      einheiten: ['4 Ferienwohnungen à 45 m²'],
      gross: 45,
      badge: { text: 'Noch keine Bewertungen', art: 'warn' },
      kurz: 'Am dichtesten am Golm, aber noch ohne jede Bewertung — und vier kleine Wohnungen.',
      created_at: '2026-11-11T09:00:00Z',
    },
    {
      id: 'cfg-landal-gargellen',
      name: 'Ruben Geyer',
      rank: 8,
      title: 'Landal Hochmontafon',
      url: 'https://www.booking.com/hotel/at/landal-hochmontafon.de.html?checkin=2027-01-29&checkout=2027-02-01&group_adults=14&no_rooms=1&group_children=0',
      price_total: 2424,
      persons: 14,
      ort: 'Gargellen',
      fahrzeit: '3:05 h',
      km: '286 km',
      gebiet: { name: 'Gargellen', km: 31, anlagen: 8, weg: 'Skilift 250 m', fuss: true },
      rating: 8.4,
      reviews: 31,
      einheiten: ['3 Ferienwohnungen: 1× 65 m², 2× kleiner'],
      gross: 65,
      badge: { text: 'Einfach ausgestattet', art: 'warn' },
      kurz: 'Billigste mit Lift zu Fuß — dafür Ferienpark in Reihe, längste Fahrt, kleinstes Gebiet.',
      created_at: '2026-11-11T09:00:00Z',
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
      { ort: 'Obermaiselstein', zeit: '2:11 h', km: '211 km' },
      { ort: 'Oberstdorf', zeit: '2:16 h', km: '215 km' },
      { ort: 'Bürs', zeit: '2:36 h', km: '259 km' },
      { ort: 'Bludenz', zeit: '2:38 h', km: '260 km' },
      { ort: 'Lorüns', zeit: '2:39 h', km: '262 km' },
      { ort: 'St. Anton im Montafon', zeit: '2:42 h', km: '265 km' },
      { ort: 'Brand', zeit: '2:53 h', km: '267 km' },
      { ort: 'Gargellen', zeit: '3:05 h', km: '286 km' },
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
        text: 'Wäre das beste Skifahren — steht hier aber nicht zur Wahl: Für 14 Leute haben wir am Arlberg nichts unter 350 € pro Kopf gefunden. Das Günstigste lag bei 977 €.',
      },
    ],

    notes: [
      'Preise: Booking.com, abgefragt am 11. November 2026 für Fr 29. Januar bis Mo 1. Februar 2027, 14 Erwachsene in einer Buchung. Gesamtpreis für alle drei Nächte und alle Einheiten; „pro Person" ist durch 14 geteilt. Die Preise ändern sich täglich.',
      'Fahrzeiten: über einen Routendienst ab Denkendorf gerechnet, ohne Verkehr — Freitagnachmittag im Januar kommen 10–20 % dazu. Der Weg zum Lift ist gefahren, nicht Luftlinie.',
      'Pistenkilometer von bergfex: Silvretta Montafon 140, Brandnertal 64, Golm 44, Fellhorn/Kanzelwand 36, Gargellen 31. Für Oberstdorf–Kleinwalsertal und die Hörnerbahn gibt es nur Drittquellen, die um ±10 % schwanken.',
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
