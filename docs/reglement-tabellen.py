#!/usr/bin/env python3
"""Erzeugt die Reglement-Tabellen für beide Apps aus unserem Katalog.

    python3 docs/reglement-tabellen.py            # nur anzeigen
    python3 docs/reglement-tabellen.py --write    # in beide Apps schreiben

Drei Tabellen entstehen:

1. **Pflicht-Folgeübungen** — Art. 8.2.028 „Übergänge" (gleichlautend in 8.1.020):
   „Ist die Endstellung eine Steigerposition, muss in dieser Steigerart die
    Folgeübung gefahren werden. Beginn und Ende eines Überganges ist die in dem
    jeweiligen Übungsnamen angegebene Anfangsstellung und Endstellung."

   Genau das steht im Übungsnamen: „Übergang <Von> <Nach>". Gesucht werden also
   die Stammnummern derselben Disziplin, deren Name mit <Nach> beginnt.
   Zwei Einschränkungen folgen aus dem Artikel selbst:

   * Nur Steigerpositionen schränken ein — 8.1.020 sagt das noch deutlicher:
     „Ist bei STEIGERÜBERGÄNGEN die Endstellung …". Fronthang, Kehrhang und
     Kehrreitsitz sind Grundpositionen, aus ihnen heraus geht fast jede Übung.
   * Die Folgeübung steht auf derselben Radzahl wie der Übergang: ein Übergang
     ist kein Radwechsel (Art. 8.2.006).

2. **„Einzeln"-Übungen** — Art. 8.1.020, höchstens drei im 2er. Das Wort steht
   nur im deutschen Namen, deshalb wird hier einmal die Nummernliste gezogen;
   die Apps prüfen dann über die Nummer und funktionieren in allen acht Sprachen.

3. **Schreibfehler des Reglements** — die Übungstabellen enthalten vier
   verschriebene Wörter („Reitzsitz" statt „Reitsitz"). Zwölf Übungen sind
   dadurch unter ihrem richtigen Namen nicht auffindbar. Der Name selbst bleibt
   wie im Reglement — auf dem Wertungsbogen muss er so stehen —, aber die Suche
   legt beide Schreibweisen übereinander.

   Auch diese Liste ist hergeleitet, nicht eingetippt: ein Wort, das im ganzen
   Katalog selten vorkommt und sich von einem sehr häufigen nur um einen
   Buchstaben unterscheidet, ist ein Verschreiber. Beugungen („Innensterne" zu
   „Innenstern") fallen heraus, weil das längere Wort das kürzere enthält — die
   Suche findet sie ohnehin.

Warum überhaupt erzeugen statt eintippen: bei der nächsten Reglement-Ausgabe
läuft das Skript erneut und die Tabellen stimmen wieder. Eine von Hand gepflegte
Liste veraltet still — und still falsche Regeln sind schlimmer als gar keine.
"""
import re
import sys
from collections import Counter
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
IOS = REPO.parent / 'artcyc-ios' / 'ArtCyc'
SEED = REPO / 'docs' / 'uci-exercises-de-seed.sql'

# Erste Übungsnummer auf EINEM Rad im 2er (Kapitel V, 8.5.012).
ERSTE_AUF_EINEM_RAD_2ER = 2261

ROW = re.compile(r"values\s*\('([0-9]+[a-z]*)',\s*'([^']*)',\s*([0-9.]+),\s*'([^']*)'")


def stamm(code):
    return re.match(r'\d+', code).group(0)


def katalog():
    """code -> (disziplin, name)"""
    out = {}
    for line in SEED.read_text(encoding='utf8').splitlines():
        m = ROW.search(line)
        if m:
            out[m.group(1)] = (m.group(2), m.group(4))
    return out


def folgeuebungen(cat):
    """Übergangs-Code -> sortierte Stammnummern, die danach kommen dürfen."""
    erster_name = {}
    for code, (disci, name) in sorted(cat.items()):
        erster_name.setdefault(stamm(code), (disci, name))

    out = {}
    for code, (disci, name) in sorted(cat.items()):
        m = re.match(r'Übergang\s+(\S+)\s+(\S+)', name)
        if not m:
            continue
        ziel = m.group(2)
        if 'steiger' not in ziel.lower():
            continue
        auf_einem_rad = disci == '2er' and int(stamm(code)) >= ERSTE_AUF_EINEM_RAD_2ER
        treffer = sorted(
            s for s, (d, n) in erster_name.items()
            if d == disci and n.startswith(ziel + ' ')
            and (d != '2er' or (int(s) >= ERSTE_AUF_EINEM_RAD_2ER) == auf_einem_rad)
        )
        if treffer:
            out[code] = treffer
    return out


def einzeln(cat):
    return sorted(c for c, (d, n) in cat.items() if d == '2er' and 'einzeln' in n.lower())


# ── Schreibfehler

WORT = re.compile(r'[A-Za-zÄÖÜäöüß]{6,}')
SELTEN = 8      # bis hierhin gilt ein Wort als selten
HAEUFIG = 10    # ab hier als häufig
FAKTOR = 4      # und es muss mindestens so viel häufiger sein


def _abstand1(a, b):
    """Unterscheiden sich a und b um genau einen Buchstaben (ersetzt oder fehlend)?"""
    if abs(len(a) - len(b)) > 1:
        return False
    if len(a) == len(b):
        return sum(1 for x, y in zip(a, b) if x != y) == 1
    kurz, lang = (a, b) if len(a) < len(b) else (b, a)
    return any(lang[:i] + lang[i + 1:] == kurz for i in range(len(lang)))


def _dreher(a, b):
    """Zwei benachbarte Buchstaben vertauscht?"""
    if len(a) != len(b):
        return False
    d = [i for i in range(len(a)) if a[i] != b[i]]
    return len(d) == 2 and d[1] == d[0] + 1 and a[d[0]] == b[d[1]] and a[d[1]] == b[d[0]]


def schreibfehler(cat):
    """falsch geschriebenes Wort -> richtiges (beide klein)."""
    zahl = Counter()
    for _, name in cat.values():
        for w in WORT.findall(name):
            zahl[w.lower()] += 1
    haeufig = [w for w, k in zahl.items() if k >= HAEUFIG]

    out = {}
    for w, k in sorted(zahl.items()):
        if k > SELTEN:
            continue
        for h in haeufig:
            if zahl[h] < FAKTOR * k:
                continue
            # Beugung, keine Verschreibung: „Innensterne" enthält „Innenstern".
            if h in w or w in h:
                continue
            if _abstand1(w, h) or _dreher(w, h):
                out[w] = h
                break
    return out


# ── Ausgabe

def als_swift(folge, einz, cat):
    z = ['    static let followUpGroups: [String: [Int]] = [']
    for c in sorted(folge):
        z.append(f'        "{c}": [{", ".join(folge[c])}],'.ljust(58) + f'// {cat[c][1]}')
    z += ['    ]', '', '    static let einzelnCodes: Set<String> = [']
    for i in range(0, len(einz), 6):
        z.append('        ' + ', '.join(f'"{c}"' for c in einz[i:i + 6]) + ',')
    z.append('    ]')
    return '\n'.join(z)


def als_js(folge, einz, cat):
    z = ['const FOLLOW_UP_GROUPS = {']
    for c in sorted(folge):
        z.append(f"  '{c}': [{', '.join(folge[c])}],".ljust(56) + f'// {cat[c][1]}')
    z += ['}', '', 'const EINZELN_CODES = new Set([']
    for i in range(0, len(einz), 6):
        z.append('  ' + ', '.join(f"'{c}'" for c in einz[i:i + 6]) + ',')
    z.append('])')
    return '\n'.join(z)


def fehler_swift(fehl, cat):
    z = ['let reglementSchreibfehler: [String: String] = [']
    for w in sorted(fehl):
        n = sorted(c for c, (d, name) in cat.items() if w in name.lower())
        z.append(f'    "{w}": "{fehl[w]}",'.ljust(46) + f'// {", ".join(n)}')
    z.append(']')
    return '\n'.join(z)


def fehler_js(fehl, cat):
    z = ['const REGLEMENT_SCHREIBFEHLER = [']
    for w in sorted(fehl):
        n = sorted(c for c, (d, name) in cat.items() if w in name.lower())
        z.append(f"  ['{w}', '{fehl[w]}'],".ljust(44) + f'// {", ".join(n)}')
    z.append('];')
    return '\n'.join(z)


# ── Prüfung gegen den GANZEN Katalog

def pruefe(cat, folge, einz, fehl):
    """Hält jede erzeugte Zeile gegen den Katalog. Gibt die Zahl der Mängel zurück."""
    erster_name = {}
    for code, (disci, name) in sorted(cat.items()):
        erster_name.setdefault(stamm(code), (disci, name))
    ziffer = {'1er': '1', '2er': '2', '4er': '4', '6er': '6'}
    mangel = 0

    def sag(zeile):
        nonlocal mangel
        mangel += 1
        print('  ✗ ' + zeile)

    # 1 — Jede Übung, die „Übergang" heißt, ist entweder geprüft oder begründet nicht.
    offen = []
    for c, (d, n) in sorted(cat.items()):
        if not n.startswith('Übergang') or c in folge:
            continue
        m = re.match(r'Übergang\s+(\S+)\s+(\S+)', n)
        if not m:
            sag(f'{c}: „{n}" passt nicht auf „Übergang <Von> <Nach>"')
        elif 'steiger' in m.group(2).lower():
            sag(f'{c}: Ziel „{m.group(2)}" ist eine Steigerposition, aber ohne Regel')
        else:
            offen.append((c, m.group(2)))
    print(f'  · {len(folge)} Übergänge mit Regel, {len(offen)} ohne '
          f'(Ziel keine Steigerposition: {", ".join(sorted({z for _, z in offen}))})')

    # 2 — Jede erlaubte Folgenummer muss es geben, in derselben Disziplin,
    #     auf derselben Radzahl, und ihr Name muss mit der Endstellung beginnen.
    for c in sorted(folge):
        d, n = cat[c]
        ziel = re.match(r'Übergang\s+(\S+)\s+(\S+)', n).group(2)
        for s in map(str, folge[c]):
            if s not in erster_name:
                sag(f'{c} → {s}: Stammnummer gibt es nicht'); continue
            dd, nn = erster_name[s]
            if dd != d:
                sag(f'{c} [{d}] → {s} [{dd}]: andere Disziplin')
            if not nn.startswith(ziel + ' '):
                sag(f'{c} → {s}: „{nn}" beginnt nicht mit „{ziel}"')
            if d == '2er' and ((int(stamm(c)) >= ERSTE_AUF_EINEM_RAD_2ER)
                               != (int(s) >= ERSTE_AUF_EINEM_RAD_2ER)):
                sag(f'{c} → {s}: Radwechsel mitten im Übergang')

    # 3 — „Einzeln" muss genau die Übungen treffen, die so heißen.
    soll = set(einzeln(cat))
    if soll != set(einz):
        sag(f'„Einzeln" weicht ab: {sorted(soll ^ set(einz))}')

    # 4 — Die Disziplin-Prüfung der Apps hängt an der ersten Ziffer.
    for c, (d, n) in sorted(cat.items()):
        if not c.startswith(ziffer.get(d, 'x')):
            sag(f'{c}: Nummer passt nicht zur Disziplin {d}')

    # 5 — Jeder Verschreiber muss im Katalog wirklich vorkommen.
    for w, r in sorted(fehl.items()):
        if not any(w in n.lower() for _, n in cat.values()):
            sag(f'Schreibfehler „{w}" kommt im Katalog nicht vor')
        if not any(r in n.lower() for _, n in cat.values()):
            sag(f'richtige Schreibweise „{r}" kommt im Katalog nicht vor')

    return mangel


ANFANG = 'erzeugt:anfang'
ENDE = 'erzeugt:ende'


def steht_drin(pfad, neu):
    """Steht zwischen den Marken schon genau das, was wir erzeugen würden?"""
    text = pfad.read_text(encoding='utf8')
    if ANFANG not in text or ENDE not in text:
        return False
    i = text.index('\n', text.index(ANFANG)) + 1
    j = text.rindex('\n', 0, text.index(ENDE)) + 1
    return text[i:j] == neu


def ersetze(pfad, neu):
    """Tauscht alles zwischen den beiden Marken — die Marken selbst bleiben stehen.

    Ohne Marken wird nichts geschrieben: lieber ein klarer Abbruch als eine Datei,
    die nur fast richtig ist.
    """
    text = pfad.read_text(encoding='utf8')
    if ANFANG not in text or ENDE not in text:
        raise SystemExit(f'{pfad.name}: Marken {ANFANG}/{ENDE} fehlen.')
    i = text.index('\n', text.index(ANFANG)) + 1
    j = text.rindex('\n', 0, text.index(ENDE)) + 1
    if text[i:j] == neu:
        return False
    pfad.write_text(text[:i] + neu + text[j:], encoding='utf8')
    return True


cat = katalog()
folge = folgeuebungen(cat)
einz = einzeln(cat)
fehl = schreibfehler(cat)
print(f'Katalog {len(cat)} Übungen → {len(folge)} Übergänge, {len(einz)} „Einzeln", '
      f'{len(fehl)} Schreibfehler')

ZIELE = [
    (IOS / 'ProgramRules.swift', lambda: als_swift(folge, einz, cat)),
    (REPO / 'src' / 'lib' / 'uciRules.js', lambda: als_js(folge, einz, cat)),
    (IOS / 'Models.swift', lambda: fehler_swift(fehl, cat)),
    (REPO / 'src' / 'ArtCycCoach.jsx', lambda: fehler_js(fehl, cat)),
]

if '--check' in sys.argv:
    mangel = pruefe(cat, folge, einz, fehl)
    # Und: steht in beiden Apps auch wirklich das Erzeugte?
    for pfad, mach in ZIELE:
        if not steht_drin(pfad, mach() + '\n'):
            print(f'  ✗ {pfad.name}: Tabelle weicht ab — „--write" läuft nicht mehr durch')
            mangel += 1
    print('  → alles sauber.' if not mangel else f'  → {mangel} Mängel.')
    sys.exit(1 if mangel else 0)
elif '--write' in sys.argv:
    for pfad, mach in ZIELE:
        geaendert = ersetze(pfad, mach() + '\n')
        print(f'  {pfad.name:20s} {"geändert" if geaendert else "unverändert"}')
else:
    for pfad, mach in ZIELE:
        print(f'\n--- {pfad.name} ---\n' + mach())
