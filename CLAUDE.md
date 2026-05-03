# ArtCyc Coach — Briefing für Claude Code

## Was ist das?

**ArtCyc Coach** ist eine Trainings- und Wettkampf-Tracker-Webapp für **Kunstradsport**
(artistic cycling, UCI). Single-Page React-App, Tailwind, lucide-react Icons.

User: Beginner-Programmierer, iPhone-only Nutzer, deutsch sprechend, Sportler/Trainer.

## Wo läuft was?

- **Frontend:** React + Vite + Tailwind. Eine einzige große Komponente in `src/ArtCycCoach.jsx` (~6450 Zeilen).
- **Storage:** Aktuell nur localStorage (`artcyc:test:v3` Key) — keine Backend-Anbindung.
- **PDF-Parser:** pdfjs 3.11.174 wird über CDN (cdnjs.cloudflare.com) zur Laufzeit geladen — `loadPdfJs()` Helper.
- **UCI-Übungs-Datenbank:** Hardcoded ~2011 Übungen (1er/2er/4er/6er) in der Datei.

## Setup

```bash
npm install
npm run dev          # → http://localhost:5173
npm run build
```

## Aktueller Stand

Die App ist **funktional weitgehend fertig**.

### ✅ PDF-Import funktioniert (verifiziert mit PDF 113 → Endergebnis 181,56)

`applyImport` in `WettkampfEditor` mappt Pro-Übung-Werte korrekt aus
`parsed.exerciseRows` über das *lokale* `activeProgram`-Objekt (nicht über
die `program`-Closure) — kein Stale-Closure-Risiko. Beide Pfade getestet:
- **Pfad A** (Default-Programm `prog_default` matcht via Disziplin)
- **Pfad B** (Programme leer → `setPendingNewProgram(newProg)` legt frisches Programm an)

Beide ergeben: `table1`/`table2` mit korrekten Werten, Validierung gegen
PDF-Soll OK. Falls die App vorher nicht startete: `Brand`-Komponente war
nicht definiert (siehe HISTORY #8).

### 📋 WAS NOCH OFFEN IST (Priorität 2)

iOS 26 Redesign ist begonnen aber nicht durchgängig:
- ✅ Bottom-Bar als Liquid-Glass-Pille (`rounded-full`, backdrop-blur 40px)
- ✅ Übungen, Wettkämpfe, Programme, Sportler als IOSList (Inset-Grouped)
- ✅ Wettkampf/Programme-Tabs als iOS Segmented Control
- ✅ Übungs-Detail mit Training+Wettkampf-Statistik
- ❌ **Dashboard** noch alt — sollte als IOSList für Top-Übungen + Statistik-Cards
- ❌ **Settings** noch alt — sollte als gruppierte IOSList wie iOS Settings App
- ❌ **Editor-Forms** (ExerciseEditor, WettkampfEditor, AthleteEditor, ProgrammEditor) noch alt — sollten iOS-Forms-Style mit Listen-Sektionen
- ❌ **Modals** (DeleteConfirmModal, InviteModal) sollten als iOS-Action-Sheets

## Architektur / Wichtige Funktionen

### Hauptkomponenten in `src/ArtCycCoach.jsx`

| Komponente | Zweck |
|---|---|
| `App` | Root, Setup-Check, View-Routing, Layout (Header/Sidebar/Bottom-Bar) |
| `Dashboard` | Statistik-Übersicht mit Sparklines |
| `TrainingView` | Liste der Sessions, Erfassung |
| `SessionEditor` | Serie protokollieren — geklappt/nicht/Maute-Sprung |
| `UebungenView` | Liste aller Übungen — IOSList |
| `ExerciseDetail` | **Detail-Ansicht** mit Training+Wettkampf-Statistik |
| `ExerciseEditor` | Übung anlegen/bearbeiten + UCI-DB-Suche |
| `WettkampfView` | Liste der Wettkämpfe + Sub-Tab Programme |
| `WettkampfEditor` | **PDF-Import + Wertungstisch-Editor (HIER IST DER BUG)** |
| `WettkampfDetail` | Read-Only Detail-Ansicht |
| `WertungstischEditor` | Pro-Übung-Eingabe mit x/~/\|/○ und Schw-% |
| `ValidationCheck` | Vergleicht App-Ist mit PDF-Soll, Toleranz 0,01 |
| `ProgrammeView` | Liste der Programme |
| `ProgrammEditor` | Programm anlegen + Übungen hinzufügen |
| `SportlerView` | Sportler-Liste mit Einladungs-Codes |
| `SettingsView` | Reset, About, etc. |
| `ExportView` | CSV-Export Maute-Format |

### iOS UI Helper (in der Datei oben)

```jsx
<IOSList header="..." footer="...">
  <IOSListRow onClick={...} trailing={...}>...</IOSListRow>
</IOSList>
<IOSTag color="blue|orange|green|red|purple|gray">...</IOSTag>
```

### Wertungsbogen-Parser-Logik (PDF-Import)

PDF-Spalten via X-Koordinaten gemappt (siehe `WERTUNGSBERICHT_COLS`):
- `Pkte` (339.3) — Punktwert pro Übung (= Anker für Zeile)
- `T1/T2/T3` (364.7/390.3/415.8) — Anerkannte taktische Aufwertung
- `%1/%2/%3` (441.3/466.9/492.4) — Schwierigkeitsabwertung in %
- `X1/X2/X3` (517.8/543.4/569.0) — `x` Kreuze (×0,2)
- `W1/W2/W3` (594.4/620.0/645.6) — `~` Wellen (×0,5)
- `S1/S2/S3` (670.9/696.5/722.1) — `|` Striche (×1,0)
- `K1/K2/K3` (747.4/773.0/798.6) — `○` Kreise/Sturz (×2,0)

**Anker-Logik:** Item mit `\d+,\d+` in Pkte-Spalte (Toleranz 12, Wert zwischen 0,5 und 20)
ist eine Übungs-Zeile. Items mit ähnlichem y-Wert (`yBaseline`-basiert, Toleranz 5)
gehören dazu.

**Footer:** Ausgefahrene Punkte / Schwierigkeit / Gesamtabzug pro KG werden
positional via `parseFooterPositional()` extrahiert (linke Spalte = KG1, rechte = KG2).

### Datenstruktur (localStorage `artcyc:test:v3`)

```js
{
  athletes: [{ id, name, type, email?, invite_status?, invite_code?, ... }],
  exercises: [{ id, name, uci_code?, uci_disc?, points, active, category_mode, third_label?, default_series }],
  programs: [{ id, name, discipline, exercises: [{ id, nr, name, code, points }] }],
  sessions: [{ id, athleteId, exerciseId, date, entries: ['success'|'fail'|'third', ...] }],
  competitions: [{
    id, name, date, location, host, start_nr, athlete_id, program_id,
    table1: [{ exerciseId, included, cross, wave, bar, circle, schwPct, taktischePunkte }],
    table2: [...],  // KG2
    t1_schwierigkeit, t2_schwierigkeit,
    pdf_ref: { kg1_ausfuehrung, kg1_schwierigkeit, kg1_gesamt, kg2_..., final }
  }]
}
```

## Test-Daten (in `uploads/`)

- **PDF 113** — Qualifikation Elite-EM 2026, Endergebnis 181,56 — primärer Test
- **PDF 117** — DM Elite 2025 Finale, Endergebnis 192,15 — alternative
- **PDF 104** — 1. German Masters 2025 ZR
- **xls/numbers** — historische Wettkampf-Statistiken (Maute-Format) als Referenz
- **UCI-Reglement_Kunstrad_2026_deutsch.pdf** — vollständiges Reglement (zur Logik-Klärung bei Punkt-Berechnungen)

## Vorgehen für Claude Code

1. **Projekt installieren:** `npm install` dann `npm run dev`
2. **Im Browser** `localhost:5173` öffnen, App aufrufen, „Starten" klicken
3. **Bug reproduzieren:** Wettkampf-Tab → Wertungsbogen erfassen → PDF 113 hochladen → Übernehmen
4. **DEBUG-Banner** beobachten — der lila Banner zeigt was wirklich in `table1`/`table2` ist
5. **Bug fixen** (siehe oben „Vermutung")
6. Sobald Parser-State-Flow läuft: **iOS-Redesign weiterführen** auf Dashboard, Settings, Editoren

## Style-Guide (iOS 26)

### Farben (iOS System Colors)
- Background: `#F2F2F7` (systemGroupedBackground)
- Primary text: `#000`
- Secondary text: `#8E8E93` (systemGray)
- Tertiary text: `#C7C7CC` (systemGray2)
- Divider: `rgba(198, 198, 200, 0.4)` (separator)
- Active tap: `rgba(209, 209, 214, 0.4)` (systemGray4)
- Accent (Brand): `#FF9500` (systemOrange)
- Interactive: `#007AFF` (systemBlue)
- Success: `#34C759` (systemGreen)
- Destructive: `#FF3B30` (systemRed)
- Warning: `#FF9500` (systemOrange)

### Typografie
- Large Title: `text-[34px] font-bold tracking-tight leading-none`
- Title 1: `text-[28px] font-bold tracking-tight`
- Body: `text-[15px]`
- Footnote: `text-[13px] text-[#8E8E93]`
- Caption: `text-[12px]`

### Patterns
- Listen IMMER als `IOSList` (zusammenhängende weiße Card mit Innen-Dividern)
- Buttons als runde Pills (`rounded-full`)
- Back-Chevrons in Brand-Color (`text-[#FF9500]`, strokeWidth 2.6)
- Tap-Feedback `active:scale-95` oder `active:opacity-50`
- Shadows subtle: `shadow-[0_1px_2px_rgba(0,0,0,0.04)]`

## Was NICHT angefasst werden sollte

- **Parser-Logik** (`extractPdfItems`, `parseWertungsbogenRows`, `parseFooterPositional`,
  `WERTUNGSBERICHT_COLS`) — Funktioniert. Bestätigt durch Node-Tests.
- **UCI-DB-Daten** (`UCI_DB_2026`) — Teil der Datei, ~120KB, keine externen Dependencies
- **Reglement-Berechnungen** (`calcExerciseDeduction`, `calcTableResult`,
  `getAnerkanntePunkte`) — geprüft gegen UCI 8.4.027 + Test-PDFs

## Was als nächstes ansteht

1. **PDF-Bug fixen** (siehe oben)
2. **iOS-Redesign vervollständigen** (Dashboard, Settings, Editor-Forms)
3. **Supabase-Integration** (DB existiert bereits — siehe `docs/supabase-setup.sql`)
4. **GitHub + Vercel-Deployment**
