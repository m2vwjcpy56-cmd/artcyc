# ArtCyc Coach

Trainings- und Wettkampf-Tracker für Kunstradsport.

## Setup

```bash
npm install
npm run dev
```

Dann http://localhost:5173 im Browser öffnen.

## Build

```bash
npm run build
npm run preview
```

## Projektstruktur

```
artcyc-coach-projekt/
├── CLAUDE.md              ← Briefing für Claude Code (Bug-Status + Architektur)
├── README.md              ← Du bist hier
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── index.html
├── src/
│   ├── ArtCycCoach.jsx    ← Hauptkomponente (~6450 Zeilen)
│   ├── main.jsx           ← React Entry
│   └── index.css          ← Tailwind + Globals
├── uploads/               ← Test-PDFs + UCI-Reglement + alte Excel-Dateien
└── docs/                  ← Zusätzliche Dokumentation
```

## Wichtigste offene Punkte

- ⚠️ **PDF-Import-Bug:** Werte landen nicht in `table1`/`table2` (siehe CLAUDE.md)
- 🎨 **iOS Redesign** noch nicht überall durchgezogen (Dashboard, Settings, Editoren)

## Test

Wettkampf → Wertungsbogen erfassen → `uploads/113_Wertungsbericht_*.pdf`
hochladen. Erwartetes Endergebnis: **181,56**.
