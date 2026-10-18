// Mitglieder der WhatsApp-Gruppe „Skifahren 26/27".
// EINE Liste für beide Seiten: die Fragebogen-Seite (src/ski/config.js) zeigt
// sie zum Antippen, die Edge Function ski-notify erkennt damit, wann alle
// abgestimmt haben. Neue Leute einfach hier ergänzen.
export const SKI_MEMBERS: string[] = [
    'Emilio Arellano',
    'Benedikt Bugner',
    'Jonas Beiter',
    'Lukas Beiter',
    'Ruben Geyer',
    'Simon Halter',
    'Max Hanselmann',
    'Moritz Herbst',
    'Simeon Hufen',
    'Simon Köcher',
    'Niklas Kreuzmann',
    'Jonas Mächtig',
    'Max Maute',
    'Philipp Rapp',
    'Simon Riedinger',
    'Sea Schefold',
    'Patrick Tisch',
    'Tim Kühne',
    'Simon Vogel',
    'Markus Wechner',
];

// Falsch geschriebene Namen, unter denen schon abgestimmt wurde → richtiger Name.
// Alte Einträge werden beim Laden auf den richtigen Namen umgebogen, damit
// niemand doppelt erscheint oder seine Antworten verliert.
export const SKI_ALIASES: Record<string, string> = {
  'markus wechtner': 'Markus Wechner',
};

export function canonicalName(name: string): string {
  const k = String(name || '').trim().toLowerCase();
  return SKI_ALIASES[k] || String(name || '').trim();
}

// Stimmen auf richtige Namen umbiegen; gibt es danach für dieselbe Person und
// Frage zwei Einträge, gilt der neuere.
export function canonicalVotes<T extends { name: string; name_key?: string; poll_id: string; updated_at?: string }>(votes: T[]): T[] {
  const out = new Map<string, T>();
  for (const v of votes || []) {
    const name = canonicalName(v.name);
    const cv = { ...v, name, name_key: name.toLowerCase() };
    const k = cv.name_key + '|' + cv.poll_id;
    const prev = out.get(k);
    if (!prev || String(cv.updated_at || '') >= String(prev.updated_at || '')) out.set(k, cv);
  }
  return [...out.values()];
}
