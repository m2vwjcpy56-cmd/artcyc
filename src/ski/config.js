// =============================================================
// Ski-Planung — Inhalte der Unterseite /ski
//
// Alles, was auf der Seite steht (Titel, Infos, Abstimmungen), wird HIER
// gepflegt. Die Stimmen und Kommentare selbst liegen in Supabase
// (Tabellen ski_votes / ski_comments, siehe docs/migration-ski-planung.sql).
//
// Ändert sich der Trip grundlegend (neues Jahr), einfach `slug` hochzählen —
// dann starten Abstimmung und Kommentare leer, die alten Daten bleiben erhalten.
// =============================================================

export const SKI_TRIP = {
  // Kennung in der Datenbank — pro Trip eindeutig.
  slug: 'ski-2027',

  title: 'Skifahren 2027',
  subtitle: 'Gemeinsame Planung — Termin, Ziel, wer ist dabei',

  // Kurze Einleitung oben auf der Seite. Zeilen = Absätze.
  intro: [
    'Hier stimmen wir ab, wann und wohin es geht. Trag deinen Namen ein, klick dich durch die Fragen — fertig.',
    'Du kannst deine Antworten jederzeit ändern, einfach die Seite wieder öffnen.',
  ],

  // Info-Block (Fakten, die schon feststehen). Leer lassen, wenn noch nichts fix ist.
  infos: [
    { label: 'Stand', value: 'Infos folgen in Kürze' },
  ],

  // Abstimmungen. type:
  //   'availability' → pro Option Ja / Vielleicht / Nein (Terminfindung)
  //   'single'       → genau eine Option wählen
  //   'multi'        → mehrere Optionen möglich
  // Optionen: { id, label, short? (Kurzform für die Übersichtstabelle), sub? }
  polls: [
    {
      id: 'termin',
      type: 'availability',
      title: 'Wann passt es dir?',
      hint: 'Pro Termin: Ja, Vielleicht oder Nein.',
      options: [
        { id: 'jan-15', label: 'Fr 15. – So 17. Jan 2027', short: '15.–17.1.', sub: 'Wochenende' },
        { id: 'jan-22', label: 'Fr 22. – So 24. Jan 2027', short: '22.–24.1.', sub: 'Wochenende' },
        { id: 'feb-05', label: 'Fr 05. – So 07. Feb 2027', short: '5.–7.2.', sub: 'Wochenende' },
        { id: 'mar-05', label: 'Fr 05. – So 07. Mär 2027', short: '5.–7.3.', sub: 'Wochenende' },
      ],
    },
    {
      id: 'dauer',
      type: 'single',
      title: 'Wie lange?',
      options: [
        { id: 'we', label: 'Wochenende (2 Nächte)' },
        { id: 'we-lang', label: 'Verlängertes Wochenende (3–4 Nächte)' },
        { id: 'woche', label: 'Eine Woche' },
      ],
    },
    {
      id: 'ziel',
      type: 'multi',
      title: 'Wohin?',
      hint: 'Alles ankreuzen, was für dich in Frage kommt.',
      options: [
        { id: 'allgaeu', label: 'Allgäu / Oberstdorf' },
        { id: 'tirol', label: 'Tirol' },
        { id: 'suedtirol', label: 'Südtirol' },
        { id: 'egal', label: 'Mir egal — Hauptsache Schnee' },
      ],
    },
  ],

  // Kommentare/Notizen unter den Abstimmungen erlauben.
  comments: true,
};
