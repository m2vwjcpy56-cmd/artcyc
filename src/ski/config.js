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
      title: 'Vorschläge für Skigebiet oder Unterkunft?',
      sub: 'Optional, gerne mehrere. Unterkunft und Skigebiet suche ich nach der Abstimmung.',
      placeholder: 'z. B. Zillertal Arena, Heustadl …',
      optional: true,
    },
  ],

  // Ergebnis-Seite
  results: {
    thanks: 'Danke, {name}!',
    text: 'Deine Antworten sind gespeichert. So steht’s gerade:',
    weekends: ['we-jan-23', 'we-jan-30'],   // Fragen-IDs der Terminwahl (Favorit-Vergleich)
    weekendLabels: { 'we-jan-23': '23. – 24. Jan', 'we-jan-30': '30. – 31. Jan' },
  },
};
