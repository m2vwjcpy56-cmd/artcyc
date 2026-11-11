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
  // Felder, die NUR hier gesetzt werden (Einträge von der Seite haben sie nicht;
  // die Anzeige blendet jedes fehlende Feld einfach aus):
  //   ort       Ortsname laut Booking — nicht der Name der Unterkunft!
  //   fahrzeit  ab Denkendorf, gemessen über OSRM ohne Verkehr
  //   gebiet    welches Skigebiet tatsächlich vor der Tür liegt
  //   rating / reviews   Booking-Note und Anzahl Bewertungen
  //   einheiten Wie die 14 Leute verteilt werden (Booking „für Ihre Gruppe")
  //   urteil    Einschätzung im Klartext, inkl. Haken
  //   badge     { text, art: 'gut' | 'warn' }
  //   rank      Reihenfolge, solange niemand Daumen hoch gegeben hat
  //
  // ⚠️ Der Ortsname kommt aus dem Titel der Booking-Seite, NICHT aus dem Namen
  // der Unterkunft. „Alm-Lodges Montafon" und „Landal Hochmontafon" stehen beide
  // in Gargellen, einem Seitental — das sind 15 Minuten mehr Fahrt und ein
  // Skigebiet, das ein Fünftel so groß ist wie das, was der Name verspricht.
  // ===========================================================
  lodgings: [
    {
      id: 'cfg-silvretta-panorama',
      name: 'Ruben Geyer',
      rank: 1,
      title: 'Silvretta Panorama Suites',
      url: 'https://www.booking.com/hotel/at/uplandparcs-silvretta.de.html?checkin=2027-01-29&checkout=2027-02-01&group_adults=14&no_rooms=1&group_children=0',
      price_total: 5501,
      persons: 14,
      ort: 'Schruns',
      fahrzeit: '2:50 h',
      gebiet: 'Silvretta Montafon direkt vor Ort — 140 km auf 35 Anlagen, alles am Stück befahrbar. Das größte zusammenhängende Gebiet, das der Pass hergibt.',
      rating: 9.1,
      reviews: 20,
      einheiten: ['1× Appartement für 8, zwei Schlafzimmer', '1× Appartement für 6, zwei Schlafzimmer, 81 m²'],
      badge: { text: 'Wenigste Einheiten', art: 'gut' },
      urteil: 'Die beste Antwort auf „nicht in Doppelzimmern verteilt": nur zwei Wohnungen, in einer davon passen acht Leute an einen Tisch. Dazu als Einzige direkt am großen Gebiet. Haken: nur 20 Bewertungen, also wenig Erfahrung von anderen.',
      created_at: '2026-11-11T00:00:00Z',
    },
    {
      id: 'cfg-rosengarten',
      name: 'Ruben Geyer',
      rank: 2,
      title: 'Rosengarten Apartments',
      url: 'https://www.booking.com/hotel/at/rosengarten-apartments.de.html?checkin=2027-01-29&checkout=2027-02-01&group_adults=14&no_rooms=1&group_children=0',
      price_total: 3247,
      persons: 14,
      ort: 'Bürs',
      fahrzeit: '2:35 h',
      gebiet: 'Liegt im Tal, ohne eigenen Lift. Brandnertal 10–15 Min hinauf (64 km, 13 Anlagen), Montafon rund 20 Min — Bus ist im Pass enthalten.',
      rating: 9.0,
      reviews: 61,
      einheiten: ['1× Wohnung für 6', '2× Wohnung für 4, je 55 m²'],
      badge: { text: 'Bestes Verhältnis', art: 'gut' },
      urteil: 'Kürzeste Anfahrt der ganzen Liste und der beste Preis, der eine belastbare Note dahinter hat: 9,0 aus 61 Bewertungen. Haken: jeden Morgen erst ins Skigebiet hoch.',
      created_at: '2026-11-11T00:00:00Z',
    },
    {
      id: 'cfg-casalpin',
      name: 'Ruben Geyer',
      rank: 4,
      title: 'CASALPIN Chalets',
      url: 'https://www.booking.com/hotel/at/casalpin.de.html?checkin=2027-01-29&checkout=2027-02-01&group_adults=14&no_rooms=1&group_children=0',
      price_total: 5236,
      persons: 14,
      ort: 'Brand',
      fahrzeit: '2:45 h',
      gebiet: 'Brandnertal vor der Tür — 64 km auf 13 Anlagen. Ins Montafon rund 30 Min.',
      rating: 9.5,
      reviews: 41,
      einheiten: ['1× Ferienhaus für 6, 2 Schlafzimmer', '2× Ferienhaus für 4, je 80 m²'],
      urteil: 'Ganze Häuser statt Wohnungen, 9,5 aus 41 Bewertungen — die solideste gute Note hier. Drei getrennte Häuser heißt aber auch: abends geht man rüber, nicht ins Nebenzimmer.',
      created_at: '2026-11-11T00:00:00Z',
    },
    {
      id: 'cfg-fuchsbau',
      name: 'Ruben Geyer',
      rank: 5,
      title: 'Alpenlodge Fuchsbau',
      url: 'https://www.booking.com/hotel/at/alpenlodge-fuchsbau.de.html?checkin=2027-01-29&checkout=2027-02-01&group_adults=14&no_rooms=1&group_children=0',
      price_total: 5188,
      persons: 14,
      ort: 'Bürserberg',
      fahrzeit: '2:38 h',
      gebiet: 'Brandnertal, Bürserberg ist der untere Einstieg — 64 km auf 13 Anlagen.',
      rating: 9.6,
      reviews: 14,
      einheiten: ['1× Wohnung mit 2 Schlafzimmern, 66 m²', '2× weitere Wohnung'],
      urteil: 'Die höchste Note der Liste — allerdings aus nur 14 Bewertungen, das trägt noch nicht. Preislich auf Höhe der Chalets, die 41 Bewertungen haben.',
      created_at: '2026-11-11T00:00:00Z',
    },
    {
      id: 'cfg-montanara',
      name: 'Ruben Geyer',
      rank: 6,
      title: 'Montanara Lodge',
      url: 'https://www.booking.com/hotel/at/montanara-lodge.de.html?checkin=2027-01-29&checkout=2027-02-01&group_adults=14&no_rooms=1&group_children=0',
      price_total: 4823,
      persons: 14,
      ort: 'Brand',
      fahrzeit: '2:45 h',
      gebiet: 'Brandnertal vor der Tür — 64 km auf 13 Anlagen.',
      rating: 8.9,
      einheiten: ['1× Superior-Wohnung, 52 m²', '2× Wohnung mit 2 Schlafzimmern und Balkon'],
      urteil: 'Unauffällig solide: Lage gut, Note gut, Preis in der Mitte. Der Vorschlag, gegen den niemand etwas sagt und für den sich auch niemand begeistert.',
      created_at: '2026-11-11T00:00:00Z',
    },
    {
      id: 'cfg-landal-gargellen',
      name: 'Ruben Geyer',
      rank: 7,
      title: 'Landal Hochmontafon',
      url: 'https://www.booking.com/hotel/at/landal-hochmontafon.de.html?checkin=2027-01-29&checkout=2027-02-01&group_adults=14&no_rooms=1&group_children=0',
      price_total: 2424,
      persons: 14,
      ort: 'Gargellen',
      fahrzeit: '3:05 h',
      gebiet: 'Gargellen — 29–33 km, das kleinste der großen Montafon-Gebiete. Ins Haupttal zu den 140 km sind es rund 25 Min bergab.',
      rating: 8.4,
      einheiten: ['1× Wohnung für 6, 2 Schlafzimmer, 65 m²', '2× Wohnung für 4, 1 Schlafzimmer'],
      badge: { text: 'Günstigster', art: 'gut' },
      urteil: '173 € pro Kopf für drei Nächte ist konkurrenzlos. Der Name führt in die Irre: „Hochmontafon" liegt in Gargellen, dem Seitental — längste Anfahrt und kleinstes Gebiet der Liste. Dazu ein Ferienpark, die Häuser stehen in Reihe.',
      created_at: '2026-11-11T00:00:00Z',
    },
    {
      id: 'cfg-alm-lodges',
      name: 'Ruben Geyer',
      rank: 8,
      title: 'Alm-Lodges Montafon',
      url: 'https://www.booking.com/hotel/at/alm-lodges-montafon.de.html?checkin=2027-01-29&checkout=2027-02-01&group_adults=14&no_rooms=1&group_children=0',
      price_total: 6258,
      persons: 14,
      ort: 'Gargellen',
      fahrzeit: '3:05 h',
      gebiet: 'Gargellen — 29–33 km. Laut Booking Ski-in/Ski-out, aber eben an diesem kleinen Gebiet.',
      rating: 9.3,
      einheiten: ['2× Ski-in/Ski-out-Wohnung, je 2 Schlafzimmer, 2 Bäder, 72 m²'],
      urteil: 'Nur zwei Einheiten und Skischuhe an der Haustür ausziehen — dafür der teuerste buchbare Vorschlag, die längste Anfahrt und das kleinste Gebiet. Auch hier täuscht „Montafon" im Namen.',
      created_at: '2026-11-11T00:00:00Z',
    },
    {
      id: 'cfg-huesle',
      name: 'Ruben Geyer',
      rank: 9,
      title: 'HŪSLE Tiny Houses',
      url: 'https://www.booking.com/hotel/at/unique-places-ferienhauser.de.html?checkin=2027-01-29&checkout=2027-02-01&group_adults=14&no_rooms=1&group_children=0',
      price_total: 3900,
      persons: 14,
      ort: 'Bludenz',
      fahrzeit: '2:37 h',
      gebiet: 'Bludenz liegt im Talkessel, kein eigenes Skigebiet. Brandnertal rund 15 Min, Montafon rund 20 Min.',
      rating: 8.4,
      reviews: 111,
      einheiten: ['3× Ferienhaus mit 2 Schlafzimmern, je ca. 60 m²'],
      urteil: '111 Bewertungen — die breiteste Erfahrungsbasis hier. Aber 60 m² je Haus ist für fünf Leute eng, und zu vierzehnt gemeinsam sitzen geht nirgends.',
      created_at: '2026-11-11T00:00:00Z',
    },
    {
      id: 'cfg-sonnblick',
      name: 'Ruben Geyer',
      // Steht bewusst weit oben: es ist der einzige Vorschlag, der die
      // ursprüngliche Vorgabe („ein Haus, alle zusammen") wirklich erfüllt.
      // Ob 977 € das wert sind, entscheidet die Abstimmung, nicht ich.
      rank: 3,
      title: 'Chalet Sonnblick',
      url: 'https://www.booking.com/hotel/at/chalet-sonnblick-stuben.de.html?checkin=2027-01-29&checkout=2027-02-01&group_adults=14&no_rooms=1&group_children=0',
      price_total: 13680,
      persons: 14,
      ort: 'Stuben',
      fahrzeit: '3:00 h',
      gebiet: 'Ski Arlberg — rund 305 km, 85+ Lifte, durchgehend mit dem Lift befahrbar. Mit Abstand das größte Gebiet dieser Liste.',
      einheiten: ['1× ganzes Chalet: 10 Schlafzimmer (2 Einzel-, 8 Doppelbetten), 10 Bäder, 1 Wohnzimmer, eigene Küche — Booking: „max. Personenzahl: 14"'],
      badge: { text: 'Ein Haus für alle 14', art: 'gut' },
      note: 'Preis ist der echte Haken: 977 € pro Kopf — mehr als das Fünffache des günstigsten Vorschlags.',
      urteil: 'Der Einzige, der die ursprüngliche Idee wirklich erfüllt: ein Haus, alle vierzehn drin, ein Wohnzimmer — und dazu das größte Skigebiet der Liste bei 3:00 h Anfahrt. Die Note 10 steht auf nur 8 externen Bewertungen, das ist keine Booking-Gästebewertung. Wenn euch die 977 € pro Kopf nicht schrecken, ist das hier die Antwort.',
      created_at: '2026-11-11T00:00:00Z',
    },
  ],

  // ===========================================================
  // Skigebiete & Anfahrt — aufklappbarer Kasten unter den Unterkünften.
  // Erklärt, was an den Zahlen oben dranhängt: Welcher Pass gilt wo, und was
  // „297 km" wert sind, wenn zwischen den Gebieten eine Autofahrt steht.
  // ===========================================================
  regions: {
    title: 'Skigebiete & Anfahrt',
    teaser: 'Was der Skipass abdeckt · Fahrzeiten ab Denkendorf',
    lead: 'Die wichtigste Unterscheidung steht nicht in der Kilometerzahl: Am Arlberg fährt man die Gebiete mit dem Lift ab. Im Montafon und im Brandnertal steht zwischen den Bergen eine Autofahrt.',

    // Gemessen über einen Routendienst, ohne Verkehr. Freitagnachmittag im
    // Januar kommen realistisch 10–20 % dazu.
    drives: [
      { ort: 'Bürs', zeit: '2:35 h', km: '259 km' },
      { ort: 'Bludenz', zeit: '2:37 h', km: '260 km' },
      { ort: 'Bürserberg', zeit: '2:38 h', km: '261 km' },
      { ort: 'Brand', zeit: '2:45 h', km: '267 km' },
      { ort: 'Tschagguns', zeit: '2:50 h', km: '270 km' },
      { ort: 'Schruns', zeit: '2:51 h', km: '271 km' },
      { ort: 'Stuben am Arlberg', zeit: '3:00 h', km: '287 km' },
      { ort: 'Gargellen', zeit: '3:05 h', km: '285 km' },
    ],

    passes: [
      {
        name: 'Montafon Brandnertal Card',
        gross: 'rund 297 km',
        sub: '9 Gebiete · rund 79 Anlagen',
        areas: [
          ['Silvretta Montafon', '140 km'],
          ['Brandnertal', '64 km'],
          ['Golm', '44 km'],
          ['Gargellen', '29–33 km'],
          ['Kristberg', '5–10 km'],
          ['Muttersberg, Bielerhöhe, Schnifis …', 'klein'],
        ],
        verbunden: false,
        // Der fette Vorspann („Nicht per Lift verbunden.") kommt aus `verbunden`,
        // hier steht nur, was danach folgt.
        text: 'Zusammenhängend sind nur die 140 km der Silvretta Montafon — und das ist schon mehr, als wir an drei Tagen abfahren. Bus und Bahn sind im Pass enthalten, der Wechsel kostet also kein Geld, aber Zeit. Dieser Pass gilt bei allen Unterkünften oben außer dem Chalet Sonnblick.',
      },
      {
        name: 'Ski Arlberg',
        gross: 'rund 305 km',
        sub: '85–88 Lifte · größtes Gebiet Österreichs',
        areas: [
          ['St. Anton · St. Christoph · Stuben', 'verbunden'],
          ['Zürs · Lech · Oberlech', 'verbunden'],
          ['Warth · Schröcken', 'verbunden'],
          ['Sonnenkopf (Klösterle)', 'per Straße'],
        ],
        verbunden: true,
        text: 'Die Flexenbahn schließt St. Anton an Zürs an, der Auenfeldjet Lech an Warth. Man startet morgens in Stuben und steht abends in Warth. Nur: die einzige Unterkunft, die wir dort für 14 Leute gefunden haben, kostet 977 € pro Kopf.',
      },
      {
        name: 'Oberstdorf – Kleinwalsertal',
        gross: 'rund 130 km',
        sub: '5 Berge · 44–48 Lifte',
        areas: [
          ['Fellhorn / Kanzelwand', '36 km'],
          ['Ifen', 'rund 24 km'],
          ['Söllereck', '14 km'],
          ['Nebelhorn, Walmendingerhorn', '—'],
        ],
        verbunden: false,
        text: 'Nur Fellhorn und Kanzelwand hängen zusammen, die anderen Berge sind getrennt. Dafür mit 2:15–2:48 h die kürzeste Anfahrt überhaupt. Hier ist noch nichts gesucht — wenn jemand das Allgäu will, sagt Bescheid.',
      },
    ],

    notes: [
      'Preise: Booking.com, abgefragt am 10./11. November 2026 für Fr 29. Januar bis Mo 1. Februar 2027, 14 Erwachsene in einer Buchung. Gesamtpreis für alle drei Nächte und alle Einheiten zusammen; „pro Person" ist durch 14 geteilt. Die Preise ändern sich täglich.',
      'Fahrzeiten: über einen Routendienst ab Denkendorf gerechnet, ohne Verkehr — Freitagnachmittag im Januar kommen 10–20 % dazu.',
      'Pistenkilometer: Brandnertal (64 km) und Silvretta Montafon (140 km) von bergfex. Die Gesamtangabe des Passes schwankt je nach Quelle zwischen 226 und 297 km, je nachdem ob Skirouten mitgezählt werden.',
      'Nicht geprüft: ob die Einheiten einer Unterkunft nebeneinander liegen. Bei drei Wohnungen im selben Haus sitzt man abends zusammen, bei drei Häusern im Ort nicht. Das steht in keiner Suchliste und beantwortet nur eine Mail an den Vermieter.',
      'Was fehlt: echte Gruppenhäuser — ein Gebäude, 14 Betten, ein großer Aufenthaltsraum. Die stehen meist nicht auf Booking, sondern auf Spezialportalen.',
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
