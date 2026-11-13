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
      pass: { name: 'Oberstdorf – Kleinwalsertal', km: 130, anlagen: 48 },
      gebiet: { name: 'Oberstdorf – Kleinwalsertal', km: 130, anlagen: 48, weg: 'Nebelhorn 1,2 km' },
      auch: { name: 'Fellhorn – Kanzelwand', km: 36, weg: '6,8 km · 13 Min' },
      betten: '8 auf 4 Wohnungen (4 Schlafsofas, 4 Doppelbetten)',
      sofas: 4,
      baeder: '4, je Wohnung eines',
      kueche: 'je Wohnung eine eigene',
      storno: 'kostenlos stornierbar',
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
      pass: { name: 'Montafon Brandnertal Card', km: 292, anlagen: 75, hinweis: 'sieben Gebiete, inkl. Skirouten' },
      gebiet: { name: 'Brandnertal', km: 64, anlagen: 13, weg: 'Skilift 250 m', fuss: true },
      betten: 'je Wohnung 2 (1 Etagenbett, 1 Doppelbett)',
      kueche: 'je Wohnung eine eigene',
      storno: 'kostenlos stornierbar',
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
      pass: { name: 'Montafon Brandnertal Card', km: 292, anlagen: 75, hinweis: 'sieben Gebiete, inkl. Skirouten' },
      gebiet: { name: 'Brandnertal', km: 64, anlagen: 13, weg: '6,9 km · 9 Min' },
      auch: { name: 'Silvretta Montafon', km: 140, weg: 'rund 25 Min' },
      betten: 'je Wohnung 2 (1 großes Doppelbett, 1 Schlafsofa)',
      sofas: 3,
      baeder: 'je Wohnung eines',
      kueche: 'je Wohnung eine eigene',
      storno: 'kostenlos stornierbar',
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
      pass: { name: 'Allgäuer Hörnerdörfer', km: 90, hinweis: 'fünf Orte auf einem Pass' },
      gebiet: { name: 'Hörnerbahn Bolsterlang', km: 17, anlagen: 6, weg: '4,1 km · 7 Min' },
      auch: { name: 'Oberstdorf (Fellhorn)', km: 36, weg: '16,4 km · 22 Min' },
      betten: '9 auf 4 Wohnungen (2 Schlafsofas, 2 Etagenbetten, 4 Doppelbetten, 1 Einzelbett)',
      sofas: 2,
      baeder: '4, je Wohnung eines',
      storno: 'kostenlos stornierbar',
      kueche: 'je Wohnung eine eigene',
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
      pass: { name: 'Montafon Brandnertal Card', km: 292, anlagen: 75, hinweis: 'sieben Gebiete, inkl. Skirouten' },
      gebiet: { name: 'Golm', km: 44, anlagen: 9, weg: '5,4 km · 8 Min' },
      auch: { name: 'Brandnertal', km: 64, weg: '10,1 km · 11 Min' },
      betten: 'je Haus 3 (2 Einzelbetten, 1 großes Doppelbett)',
      baeder: 'je Haus 3',
      kueche: 'je Haus eine eigene',
      storno: 'kostenlos stornierbar',
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
      pass: { name: 'Montafon Brandnertal Card', km: 292, anlagen: 75, hinweis: 'sieben Gebiete, inkl. Skirouten' },
      gebiet: { name: 'Brandnertal', km: 64, anlagen: 13, weg: '12,8 km · 17 Min' },
      betten: 'je Haus 4 (2 Einzelbetten, 1 Schlafsofa, 1 Doppelbett)',
      sofas: 3,
      baeder: 'je Haus eines',
      kueche: 'je Haus eine eigene',
      storno: 'kostenlos stornierbar',
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
      pass: { name: 'Montafon Brandnertal Card', km: 292, anlagen: 75, hinweis: 'sieben Gebiete, inkl. Skirouten' },
      gebiet: { name: 'Golm', km: 44, anlagen: 9, weg: '2,8 km · 5 Min' },
      betten: 'je Wohnung 2 (1 französisches Doppelbett, 1 Schlafsofa)',
      sofas: 4,
      baeder: '4, je Wohnung eines',
      kueche: 'je Wohnung Küchenzeile mit Spülmaschine',
      storno: 'kostenlos bis 30. Dezember 2026',
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
      pass: { name: 'Montafon Brandnertal Card', km: 292, anlagen: 75, hinweis: 'sieben Gebiete, inkl. Skirouten' },
      gebiet: { name: 'Gargellen', km: 31, anlagen: 8, weg: 'Skilift 250 m', fuss: true },
      betten: 'nicht ausgewiesen; die drei Wohnungen fassen zusammen genau 14',
      baeder: '3, je Wohnung eines',
      kueche: 'je Wohnung eine eigene',
      rating: 8.4,
      reviews: 31,
      einheiten: ['3 Ferienwohnungen: 1× 65 m², 2× kleiner'],
      gross: 65,
      badge: { text: 'Einfach ausgestattet', art: 'warn' },
      kurz: 'Billigste mit Lift zu Fuß — dafür Ferienpark in Reihe, längste Fahrt, kleinstes Gebiet.',
      created_at: '2026-11-11T09:00:00Z',
    },

    // ---------------------------------------------------------------
    // Zweite Runde, 13.11.2026. Die erste Recherche hing an Vorarlberg und
    // am Oberallgäu; gesucht wurde diesmal gezielt ausserhalb davon.
    //
    // ⚠️ Was dabei herauskam, raeumt mit zwei Annahmen auf:
    //   1. Das Lechtal ist von Denkendorf NAEHER als der Arlberg (2:51 h nach
    //      Elbigenalp gegen 3:12 h nach St. Anton) und deutlich billiger —
    //      und ueber Warth haengt es am selben Skiverbund.
    //   2. Das Oberallgaeu ist konkurrenzlos nah: Burgberg 2:08 h, Oberjoch
    //      2:00 h. Das ist eine ganze Stunde weniger als Montafon.
    //
    // ⚠️ Paznaun/Ischgl ist NICHT dabei, und zwar gemessen: Kappl 3:39 h,
    // Ischgl noch weiter. Nicht erneut vorschlagen.
    // ---------------------------------------------------------------
    {
      id: 'cfg-bergheimat-burgberg',
      name: 'Ruben Geyer',
      rank: 9,
      title: 'Landhaus Bergheimat',
      // ⚠️ DIESELBE Unterkunft steht auf BEIDEN Portalen — und die Portale sind
      // sich nicht einig. Booking: 3.230 € und Note 9,4 aus **7** Stimmen.
      // Airbnb: 3.070 € und 4,9 aus **123** Stimmen. Hier steht der Airbnb-Link,
      // weil er 160 € billiger ist UND die Note auf siebzehnmal so vielen
      // Bewertungen steht. Wer vergleicht, muss BEIDE Portale aufmachen —
      // sonst zahlt man den Aufschlag fuer die duennere Datenlage.
      // Booking-Seite: /hotel/de/landhaus-bergheimat-burgberg-im-allgau2
      url: 'https://www.airbnb.de/rooms/21261609?check_in=2027-01-29&check_out=2027-02-01&adults=14',
      price_total: 3070,
      persons: 14,
      ort: 'Burgberg im Allgäu',
      fahrzeit: '2:08 h',
      km: '202 km',
      // Kein Lift vor der Tuer, dafuer drei Gebiete im gleichen Umkreis.
      pass: { name: 'Allgäuer Hörnerdörfer', km: 90, hinweis: 'fünf Orte auf einem Pass' },
      gebiet: { name: 'Grünten / Ofterschwang', weg: '10 km' },
      auch: { name: 'Oberjoch', weg: '19 km' },
      // ⚠️ Hier steht bewusst die BOOKING-Note, obwohl der Link zu Airbnb geht:
      // Airbnbs 4,9 von 5 waeren umgerechnet 9,8 — neben Bookings 8,8 sieht das
      // nach „deutlich besser" aus, ist es aber nicht. Airbnb-Noten liegen
      // systematisch hoeher (fast alles ueber 4,7). Zwei Skalen in einer Spalte
      // vergleichen heisst, die Reihenfolge zu faelschen. Eine Skala fuer alle,
      // die 123 Airbnb-Stimmen stehen stattdessen im Satz darunter.
      betten: '10 Betten auf 7 Schlafzimmer',
      baeder: '3,5',
      kueche: 'eine für alle',
      rating: 9.4,
      reviews: 7,
      einheiten: ['1 ganzes Ferienhaus: 7 Schlafzimmer, 10 Betten, 3,5 Badezimmer'],
      badge: { text: 'Alle unter einem Dach', art: 'gut' },
      kurz: 'Einziges Haus für alle 14 und kürzeste Fahrt — über Airbnb 160 € billiger, dort mit 4,9 aus 123 Bewertungen statt 7.',
      created_at: '2026-11-13T09:00:00Z',
    },
    {
      id: 'cfg-haus-montana-elbigenalp',
      name: 'Ruben Geyer',
      rank: 10,
      title: 'Haus Montana',
      url: 'https://www.booking.com/hotel/at/haus-montana-elbigenalp.de.html?checkin=2027-01-29&checkout=2027-02-01&group_adults=14&no_rooms=1&group_children=0',
      price_total: 1796,
      persons: 14,
      ort: 'Elbigenalp',
      fahrzeit: '2:51 h',
      km: '253 km',
      gebiet: { name: 'Jöchelspitze (Lechtal)', km: 5, weg: '6 km' },
      auch: { name: 'Warth – Ski Arlberg', weg: 'rund 35 km' },
      betten: '10 (6 Schlafsofas, 4 Doppelbetten)',
      sofas: 6,
      baeder: '2',
      storno: 'KEINE kostenlose Stornierung angeboten',
      rating: 8.7,
      reviews: 138,
      einheiten: ['2 Ferienwohnungen mit zusammen 4 Schlafzimmern, 2 Wohnzimmern'],
      badge: { text: 'Nur 5 km Pisten vor Ort', art: 'warn' },
      kurz: 'Mit 128 € pro Kopf der günstigste Fund — aber die Jöchelspitze hat nur 5 km Pisten, für alles andere sind es 50 km nach Warth.',
      created_at: '2026-11-13T09:00:00Z',
    },
    {
      id: 'cfg-wolf-retreat-bach',
      name: 'Ruben Geyer',
      rank: 11,
      title: 'WOLF RETREAT Apartments',
      url: 'https://www.booking.com/hotel/at/appartementhaus-michaela.de.html?checkin=2027-01-29&checkout=2027-02-01&group_adults=14&no_rooms=1&group_children=0',
      price_total: 2299,
      persons: 14,
      ort: 'Bach (Lechtal)',
      fahrzeit: '2:53 h',
      km: '255 km',
      // Booking: „nur 5 Gehminuten von der Seilbahn Joechelspitzbahn".
      gebiet: { name: 'Jöchelspitze (Lechtal)', km: 5, weg: 'Seilbahn 5 Gehminuten', fuss: true },
      auch: { name: 'Warth – Ski Arlberg', weg: 'rund 30 km' },
      betten: 'je Apartment 2 (1 Schlafsofa, 1 Doppelbett)',
      baeder: 'je Apartment eines',
      kueche: 'je Apartment eine eigene',
      storno: 'kostenlos stornierbar',
      rating: 9.2,
      reviews: 232,
      einheiten: ['Mehrere Apartments im Haus, Sauna und Solarium'],
      badge: { text: 'Nur 5 km Pisten vor Ort', art: 'warn' },
      kurz: 'Seilbahn zu Fuß und beste Note der Liste — nur führt sie in ein 5-km-Gebiet; für mehr sind es 45 km nach Warth.',
      created_at: '2026-11-13T09:00:00Z',
    },
    {
      id: 'cfg-ferienhaus-gruenten-fischen',
      name: 'Ruben Geyer',
      rank: 12,
      title: 'Ferienhaus Grünten',
      url: 'https://www.booking.com/hotel/de/ferienhaus-grunten.de.html?checkin=2027-01-29&checkout=2027-02-01&group_adults=14&no_rooms=1&group_children=0',
      price_total: 2026,
      persons: 14,
      // ⚠️ Der Name sagt Gruenten, die Unterkunft steht aber in FISCHEN —
      // zwischen Sonthofen und Oberstdorf. Das ist die bessere Lage.
      ort: 'Fischen im Allgäu',
      fahrzeit: '2:12 h',
      km: '205 km',
      pass: { name: 'Allgäuer Hörnerdörfer', km: 90, hinweis: 'fünf Orte auf einem Pass' },
      gebiet: { name: 'Hörnerdörfer / Fischen', weg: 'im Ort' },
      auch: { name: 'Oberstdorf – Kleinwalsertal', km: 130, weg: 'rund 10 km' },
      betten: '7 auf 4 Wohnungen (1 Schlafsofa, 4 Doppelbetten, 2 Einzelbetten)',
      sofas: 1,
      baeder: '4, je Wohnung eines',
      storno: 'kostenlos stornierbar',
      kueche: 'je Wohnung Küchenzeile',
      rating: 8.3,
      reviews: 25,
      einheiten: ['Mehrere Wohneinheiten mit Balkon und Küchenzeile'],
      kurz: 'Billig und nah an Oberstdorf — der Name führt in die Irre, es steht in Fischen.',
      created_at: '2026-11-13T09:00:00Z',
    },
    {
      id: 'cfg-myrelaxs-little-villa',
      name: 'Ruben Geyer',
      rank: 13,
      title: 'my Relaxs little Villa',
      url: 'https://www.booking.com/hotel/at/my-relaxs-little-villa.de.html?checkin=2027-01-29&checkout=2027-02-01&group_adults=14&no_rooms=1&group_children=0',
      price_total: 2157,
      persons: 14,
      ort: 'St. Anton im Montafon',
      fahrzeit: '2:39 h',
      km: '264 km',
      pass: { name: 'Montafon Brandnertal Card', km: 292, anlagen: 75, hinweis: 'sieben Gebiete, inkl. Skirouten' },
      gebiet: { name: 'Golm', km: 44, anlagen: 9, weg: 'rund 3 km' },
      betten: '7 (2 Schlafsofas, 5 Doppelbetten)',
      sofas: 2,
      baeder: '2',
      kueche: 'eine für alle',
      storno: 'kostenlos stornierbar',
      rating: 7.9,
      reviews: 24,
      einheiten: ['1 Ferienwohnung: 5 Schlafzimmer, Wohnzimmer, 2 Badezimmer, 130 m²'],
      gross: 130,
      badge: { text: 'Schwächste Note der Liste', art: 'warn' },
      kurz: 'Halb so teuer wie die Frigo Appartments im selben Ort, aber nur 7,9 — da lohnt der Blick in die Bewertungen.',
      created_at: '2026-11-13T09:00:00Z',
    },
    {
      id: 'cfg-ferienhaus-wechner',
      name: 'Ruben Geyer',
      rank: 14,
      title: 'Ferienhaus Wechner',
      url: 'https://www.booking.com/hotel/at/ferienhaus-wechner-haselgehr.de.html?checkin=2027-01-29&checkout=2027-02-01&group_adults=14&no_rooms=1&group_children=0',
      price_total: 2467,
      persons: 14,
      ort: 'Häselgehr (Lechtal)',
      fahrzeit: '2:55 h',
      km: '251 km',
      gebiet: { name: 'Jöchelspitze (Lechtal)', km: 5, weg: 'rund 10 km' },
      auch: { name: 'Warth – Ski Arlberg', weg: 'rund 40 km' },
      betten: '13 (6 Einzelbetten, 3 Schlafsofas, 4 Doppelbetten)',
      sofas: 3,
      baeder: '5',
      kueche: 'eine für alle',
      storno: 'kostenlos stornierbar',
      rating: 8.5,
      reviews: 2,
      einheiten: ['1 ganzes Ferienhaus: 6 Schlafzimmer, 5 Badezimmer, 180 m², 13 Betten'],
      gross: 180,
      badge: { text: 'Nur 5 km Pisten vor Ort', art: 'warn' },
      // Steht auch auf Airbnb (/rooms/1749101647984374546) — dort aber 3.297 €
      // statt 2.467 €. Beim Bergheimat ist es umgekehrt. Es gibt also KEIN
      // Portal, das grundsaetzlich billiger ist; es hilft nur Nachsehen.
      kurz: '13 echte Betten auf 180 m², das großzügigste Angebot — aber nur 5 km Pisten vor Ort und zwei Bewertungen.',
      created_at: '2026-11-13T09:00:00Z',
    },
    {
      id: 'cfg-mellau-zwei-appartements',
      name: 'Ruben Geyer',
      rank: 15,
      title: 'Zwei Appartements, 250 m²',
      url: 'https://www.airbnb.de/rooms/50277398?check_in=2027-01-29&check_out=2027-02-01&adults=14',
      price_total: 3370,
      persons: 14,
      ort: 'Mellau (Bregenzerwald)',
      fahrzeit: '2:44 h',
      km: '242 km',
      // Einziger Fund im Bregenzerwald, der fuer 14 Leute ueberhaupt in Frage
      // kommt — Booking hatte dort nur Bodensee-Adressen ohne Skigebiet.
      pass: { name: 'Damüls – Mellau', km: 109, anlagen: 29 },
      gebiet: { name: 'Damüls – Mellau', weg: 'Bergbahn im Ort' },
      // Airbnb-Note 4,95 aus 19 Stimmen; hier NICHT auf die Booking-Skala
      // umgerechnet (siehe Begruendung beim Bergheimat), darum kein `rating`.
      betten: '12 Betten auf 6 Schlafzimmer',
      baeder: '3',
      kueche: 'je Appartement eine eigene',
      einheiten: ['2 Appartements mit zusammen 250 m²: 6 Schlafzimmer, 12 Betten, 3 Badezimmer'],
      gross: 250,
      kurz: 'Größte Wohnfläche der Liste und Bergbahn im Ort — auf Airbnb mit 4,95 aus 19 Bewertungen.',
      created_at: '2026-11-13T09:00:00Z',
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
