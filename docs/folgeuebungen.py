#!/usr/bin/env python3
"""Erzeugt die Reglement-Tabellen für den Programmprüfer aus unserem Katalog.

    python3 docs/folgeuebungen.py            # nur anzeigen
    python3 docs/folgeuebungen.py --write    # in beide Apps schreiben

Zwei Tabellen entstehen:

1. **Pflicht-Folgeübungen** — Art. 8.2.028 „Übergänge":
   „Ist die Endstellung eine Steigerposition, muss in dieser Steigerart die
    Folgeübung gefahren werden. Beginn und Ende eines Überganges ist die in dem
    jeweiligen Übungsnamen angegebene Anfangsstellung und Endstellung."

   Genau das steht im Übungsnamen: „Übergang <Von> <Nach>". Gesucht werden also
   die Stammnummern derselben Disziplin, deren Name mit <Nach> beginnt.
   Zwei Einschränkungen folgen aus dem Artikel selbst:

   * Nur Steigerpositionen schränken ein. Fronthang, Kehrhang und Kehrreitsitz
     sind Grundpositionen — aus ihnen heraus geht fast jede Übung.
   * Die Folgeübung steht auf derselben Radzahl wie der Übergang: ein Übergang
     ist kein Radwechsel (Art. 8.2.006).

2. **„Einzeln"-Übungen** — Art. 8.1.020, höchstens drei im 2er. Das Wort steht
   nur im deutschen Namen, deshalb wird hier einmal die Nummernliste gezogen;
   die Apps prüfen dann über die Nummer und funktionieren in allen acht Sprachen.

Warum überhaupt erzeugen statt eintippen: bei der nächsten Reglement-Ausgabe
läuft das Skript erneut und die Tabellen stimmen wieder. Eine von Hand gepflegte
Liste veraltet still — und still falsche Regeln sind schlimmer als gar keine.
"""
import re
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
SEED = REPO / 'docs' / 'uci-exercises-de-seed.sql'
JS_ZIEL = REPO / 'src' / 'lib' / 'uciRules.js'
SWIFT_ZIEL = REPO.parent / 'artcyc-ios' / 'ArtCyc' / 'ProgramRules.swift'

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


ANFANG = 'erzeugt:anfang'
ENDE = 'erzeugt:ende'


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
print(f'Katalog {len(cat)} Übungen → {len(folge)} Übergänge, {len(einz)} „Einzeln"')

if '--write' in sys.argv:
    swift = als_swift(folge, einz, cat)
    js = als_js(folge, einz, cat)
    g1 = ersetze(SWIFT_ZIEL, swift + '\n')
    g2 = ersetze(JS_ZIEL, js + '\n')
    print('ProgramRules.swift:', 'geändert' if g1 else 'unverändert')
    print('uciRules.js:       ', 'geändert' if g2 else 'unverändert')
else:
    print('\n--- Swift ---\n' + als_swift(folge, einz, cat))
    print('\n--- JS ---\n' + als_js(folge, einz, cat))
