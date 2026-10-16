// =============================================================
// Ski-Planung — Inhalte der Unterseite /ski
//
// Alles, was auf der Seite steht (Titel, Infos, Abstimmungen), wird HIER
// gepflegt. Die Stimmen, Vorschläge und Kommentare selbst liegen in Supabase
// (Tabellen ski_votes / ski_suggestions / ski_comments,
// siehe docs/migration-ski-planung.sql).
//
// Ändert sich der Trip grundlegend (neues Jahr), einfach `slug` hochzählen —
// dann starten Abstimmung und Kommentare leer, die alten Daten bleiben erhalten.
// =============================================================

export const SKI_TRIP = {
  // Kennung in der Datenbank — pro Trip eindeutig.
  slug: 'ski-2027',

  title: 'Skifahren 2027',
  subtitle: 'Planung Saison 26/27 — Termin, Zusatztag, wer ist dabei',

  // Einleitung oben auf der Seite. Zeilen = Absätze.
  intro: [
    'Hallo zusammen, die Planung für nächstes Jahr soll langsam Fahrt aufnehmen. Es stehen zwei Termine zur Auswahl. Wir planen wieder Samstag + Sonntag zu gehen, plus Montag oder Freitag.',
    'Bitte stimmt schnellstmöglich ab, ob ihr dieses Jahr dabei seid und an welchen Tagen ihr könnt.',
    'Anschließend schaue ich nach einer Unterkunft und abhängig davon auch, in welches Skigebiet wir dieses Jahr gehen. Vorschläge gerne erwünscht — einfach unten eintragen.',
  ],

  // Info-Block (Fakten, die schon feststehen).
  infos: [
    { label: 'Wann', value: 'Januar 2027 — Sa + So, plus Fr oder Mo' },
    { label: 'Unterkunft', value: 'Wird nach der Abstimmung gesucht' },
    { label: 'Skigebiet', value: 'Offen — Vorschläge erwünscht' },
  ],

  // Abstimmungen. type:
  //   'availability' → pro Option Ja / Vielleicht / Nein (Terminfindung)
  //   'single'       → genau eine Option wählen
  //   'multi'        → mehrere Optionen möglich
  // Optionen: { id, label, short? (Kurzform für die Übersichtstabelle), sub? }
  // overview: true → Frage erscheint als Spalte in der Teilnehmer-Übersicht
  //                  (short = Spaltentitel).
  polls: [
    {
      id: 'dabei',
      type: 'single',
      title: 'Bist du 2027 dabei?',
      short: 'Dabei?',
      overview: true,
      options: [
        { id: 'ja', label: 'Ja, ich bin dabei', short: 'Ja' },
        { id: 'vielleicht', label: 'Vielleicht — weiß ich noch nicht', short: '?' },
        { id: 'nein', label: 'Nein, dieses Jahr nicht', short: 'Nein' },
      ],
    },
    {
      id: 'termin',
      type: 'availability',
      title: 'Welches Wochenende passt dir?',
      hint: 'Pro Wochenende: Ja, Vielleicht oder Nein. Gerne beide, wenn beides geht.',
      overview: true,
      options: [
        { id: 'jan-23', label: 'Sa 23. – So 24. Jan 2027', short: '23./24.1.', sub: 'Zusatztag: Fr 22. oder Mo 25.' },
        { id: 'jan-30', label: 'Sa 30. – So 31. Jan 2027', short: '30./31.1.', sub: 'Zusatztag: Fr 29. oder Mo 1.2.' },
      ],
    },
    {
      id: 'zusatztag',
      type: 'single',
      title: 'Zusätzlich zu Sa + So kann ich …',
      short: 'Zusatztag',
      hint: 'Falls das je nach Wochenende unterschiedlich ist: kurz in die Kommentare schreiben.',
      overview: true,
      options: [
        { id: 'fr-mo', label: 'Freitag UND Montag', short: 'Fr + Mo' },
        { id: 'fr', label: 'Nur Freitag', short: 'Fr' },
        { id: 'mo', label: 'Nur Montag', short: 'Mo' },
        { id: 'keiner', label: 'Keinen Zusatztag — nur Sa + So', short: '–' },
      ],
    },
  ],

  // Vorschlagsliste: jeder kann Vorschläge eintragen, andere geben Daumen hoch.
  suggestions: {
    title: 'Vorschläge Skigebiet & Unterkunft',
    hint: 'Eigene Vorschläge eintragen, gute Ideen mit Daumen hoch unterstützen.',
    placeholder: 'z. B. Zillertal Arena, Heustadl …',
  },

  // Kommentare/Notizen unter den Abstimmungen erlauben.
  comments: true,
};
