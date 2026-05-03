# Entwicklungs-Historie & Bug-Hunt

Diese Datei dokumentiert wichtige Entscheidungen und Bug-Fixes,
damit Claude Code nicht denselben Boden zweimal betritt.

## Test-PDFs Übersicht

| Datei | Wettkampf | Endergebnis (Soll) |
|---|---|---|
| `113_..._Qualifikation_Elite-EM_2026.pdf` | Qualifikation Elite-EM 2026 | **181,56** |
| `117_..._DM_Elite_2025_Finale.pdf` | DM Elite 2025 Finale | **192,15** |
| `133_..._DM_Elite_2025.pdf` | DM Elite 2025 | — |
| `104_..._1__German_Masters_2025_ZR.pdf` | 1. German Masters 2025 ZR | — |

## Bestätigte Bug-Fixes (DON'T REGRESS)

### 1. Y-Koordinaten in `extractPdfItems`
**Problem:** `yTop = viewport.height - yBottom - it.height`
führte bei pdfjs-Items mit unterschiedlichen heights (manche=0, andere=9)
zu unterschiedlichen y-Werten in derselben PDF-Zeile → Daten-Items wurden
nicht zur Anker-Zeile gematcht.

**Fix:** Baseline-Y direkt nutzen `y = viewport.height - yBaseline`
ohne Höhe abzuziehen. Alle Items in derselben Zeile haben gleichen y.

### 2. Anchor-Sanity-Check (verhinderte 32 statt 30 Übungen)
**Problem:** Mit zu großzügiger Toleranz (15) wurden Footer-Werte
(„180,67" Ausgefahrene Punkte und „11,33" Gesamtabzug) **fälschlich** als
Anchor-Items für Übungs-Zeilen erkannt → 32 Übungen statt 30 → Aufgestellt
383 statt 191.

**Fix:** Toleranz **12** (nicht 15) PLUS Sanity-Check `val >= 0.5 && val <= 20`
für Punktwerte. Footer-Werte (>20) werden so zuverlässig ausgeschlossen.

### 3. Footer KG1/KG2-Vertauschung
**Problem:** `parseWertungsbericht` (Text-Stream) hatte Footer-Werte
falsch zugeordnet bei Layouts mit kompakten Zeilenabständen.

**Fix:** `parseFooterPositional()` nutzt X/Y-Koordinaten direkt:
- Linke Spalte (x<420) = KG1
- Rechte (x>420) = KG2
- Nutzt `includes('Schwierigkeit')` statt strikter String-Match
- Werte aus Text-Stream werden vor positions-Werten gelöscht (lieber leer als falsch)

### 4. Atomares Speichern (React Stale Closure)
**Problem:** PDF-Import rief separat `onAddProgram → setData(...)` und beim
Speichern `upsert → setData(...)`. Beide nutzten ihre Kopie vom alten
`data` → zweiter Call überschrieb ersten → Programm verloren.

**Fix:** `pendingNewProgram` + `pendingNewExercises` State im
`WettkampfEditor`. Bei Save: ALLES als Payload `{competition, newProgram,
newExercises}` übergeben. WettkampfView macht **EINEN** `setData`-Call
atomar (`onSave` Handler in `WettkampfView`).

### 5. TDZ-Fehler (Temporal Dead Zone)
**Problem:** `pendingNewProgram` wurde verwendet bevor deklariert
(in `program`-Variable Definition).

**Fix:** State-Deklaration **vor** der `program`-Variable verschoben.

### 6. parseWertungsbogenRows Line-Clustering
**Problem:** Items pro Anchor mit y-Toleranz suchen war fragil bei Items
mit grenzwertigen y-Werten.

**Fix:** Items werden **vorab** in Zeilen geclustert (Toleranz 5).
Pro Zeile wird Anchor gesucht. Code+Name in **separaten Pässen** (nicht im
selben Loop wie Number-Parsing) — verhindert dass `continue` Statements
sich gegenseitig beeinflussen.

### 7. iOS DeleteConfirmModal statt confirm()
**Problem:** `window.confirm()` ist auf iOS unzuverlässig — wurde manchmal
nicht angezeigt oder direkt mit „cancel" zurückgegeben.

**Fix:** Eigene `DeleteConfirmModal`-Komponente mit setTimeout-Sequenz für
saubere Modal-Schliessung.

### 8. `Brand`-Komponente fehlte → ReferenceError beim Mount
**Problem:** `<Brand size="…" />` wurde an drei Stellen (Mobile-Header,
Desktop-Sidebar, Mobile-Drawer) referenziert, aber nirgends definiert oder
importiert. Folge: `ReferenceError: Brand is not defined` beim ersten
Render — App mountete gar nicht. Wirkte wie der vermutete „PDF-Import-Bug",
weil der Editor leer aussah.

**Fix:** Kleine `Brand`-Komponente (Trophy-Icon + „ArtCyc Coach"-Text) vor
`App` definiert. Danach reproduziert der „PDF-Import-Bug" nicht mehr —
`applyImport` setzt `table1`/`table2` korrekt, Endergebnis stimmt mit
PDF-Soll überein (181,56 für PDF 113).

### 9. PDF-Import-State-Flow verifiziert (kein Stale-Closure)
Der vermutete React-Stale-Closure in `applyImport` existiert nicht: das
Mapping `newT1 = activeProgram.exercises.map(...)` nutzt die *lokale*
Variable `activeProgram` (auf `newProg` gesetzt), nicht die `program`-
Closure. Live-Test mit PDF 113 in beiden Pfaden:
- mit Default-Programm `prog_default`: 14 nonZero in table1/table2, Ergebnis 181,56 ✓
- mit leerem `programs[]` (forciert `setPendingNewProgram`): 14 nonZero, Ergebnis 181,56 ✓

DEBUG-Banner aus `WettkampfEditor` entfernt.

## Schwierigkeit-Reglement (UCI 8.4.027)

Abzüge pro Übungs-Fehler:
- **x** (Kreuz, Fehlergruppe 1a/1b) = ×0,2 Punkte
- **~** (Welle, Fehlergruppe 1a-1h) = ×0,5 Punkte
- **|** (Strich, Fehlergruppe 2) = ×1,0 Punkte
- **○** (Kreis, Fehlergruppe 3 = Sturz) = ×2,0 Punkte

## Schwierigkeitsabwertung pro Übung
- 0% (keine), 10% (kleine), 50% (mittlere), 100% (komplette Abwertung)
- Statt Pauschal-Abwertung: pro Übung individuell setzbar
- UI als Buttons 0/10/50/100%

## Taktische Aufwertung (UCI 8.1.023)
> "Schwierigkeitspunkte zuzüglich taktische Punkte ergeben Gesamtpunkte"

Beispiel PDF 113: Übung „1104o T" hat Standard 7,3 Pkt, anerkannt aber 8,3 Pkt
(taktische Aufwertung +1,0). Differenz erklärte fehlende +1,00 in Aufgestellt.

**Implementierung:**
- Pro-Übung-Eintrag bekommt `taktischePunkte`-Feld
- `calcExerciseSchwierigkeit` nutzt **anerkannten** Punktwert für %-Rechnung
- Aufgestellt = Σ `getAnerkanntePunkte(eintrag, exercise)`
- UI: Badge "7̶,̶3̶ → 8,3 Pkt [T]" nur bei betroffenen Übungen

## Spalten-Mapping (PDF X-Koordinaten)

```js
const WERTUNGSBERICHT_COLS = {
  Pkte: 339.3,
  T1: 364.7, T2: 390.3, T3: 415.8,    // Taktische Aufwertung
  p1: 441.3, p2: 466.9, p3: 492.4,    // Schwierigkeitsabwertung %
  X1: 517.8, X2: 543.4, X3: 569.0,    // Kreuze
  W1: 594.4, W2: 620.0, W3: 645.6,    // Wellen
  S1: 670.9, S2: 696.5, S3: 722.1,    // Striche
  K1: 747.4, K2: 773.0, K3: 798.6     // Kreise (Sturz)
};
```

3 KGs weil: KG1, KG2, KG3 (3. Kampfgericht im Trio-Format).

## Node-Test des Parsers

`docs/parser-test.cjs` ist ein eigenständiges Node-Skript das den Parser
**außerhalb des Browsers** testet. Bestätigt:
- 30 Anchors gefunden
- KG1 14× KG2 14× Schw 4× Takt 1× (matches Vorschau im Browser)
- Sum points = 191.00 ✓

```bash
cd docs
npm install pdfjs-dist
node parser-test.cjs
```

Output sollte 30 Anchors + KG1/KG2 Daten ausgeben.

## User-Kontext

- **iPhone-only Beginner** — braucht klare Tests („App neu laden, X tippen")
- **Spricht Deutsch** — alle UI-Texte deutsch, Code-Kommentare deutsch oder englisch
- **Reagiert gut auf:** ehrliche Diagnose, kompakte UI, atomare Schritte
- **Reagiert schlecht auf:** falsche Versprechen, „so jetzt klappts" wenn nicht
- **Mag:** weniger Optionen, mehr Auto-Erkennung (PDF erkennt Programm und legt es selbst an)

## Wichtige Datenstruktur-Entscheidungen

- Kein `recharts` (Crash-Risiko) → SVG-Sparklines manuell gezeichnet
- Kein `xlsx`-Library → CSV-only Export
- Pro-Übung-Eintrag fields: `{ exerciseId, included, cross, wave, bar, circle, schwPct, taktischePunkte }`

## Geplante Erweiterungen (nicht angefangen)

- Maute-Sprung-Sonderlogik (3-Status: gesprungen/gestanden/nicht)
- Multi-Athlet-Support (Trainer-Konto mit mehreren Sportlern)
- Supabase-Sync (Schema bereits angelegt — siehe `docs/supabase-setup.sql`)
- Vercel-Deployment
- iOS PWA Manifest + Icons
