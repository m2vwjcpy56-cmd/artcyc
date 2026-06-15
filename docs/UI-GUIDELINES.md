# ArtCyc Coach — UI/UX-Leitfaden

> Verbindliche Design- und Wahrnehmungs-Regeln, gesammelt aus dem Redesign
> (Juni 2026). **Bei neuen Screens/Änderungen zuerst hier nachsehen.**
> Tokens & Komponenten leben in `src/ui/tokens.js` + `src/ui/primitives.jsx`.

---

## 0. Leitprinzip
Ein Screen ist in **< 2 Sekunden** erfassbar. Alle Haupttabs wirken wie **ein
gemeinsames System** (gleiche Header-Logik, KPI-Ränge, Action-Hierarchie,
Listen-/Disclosure-Regeln, Farben), nicht wie Spezialbereiche.

---

## 1. Wahrnehmung / Informationsarchitektur
- **Ein dominantes Objekt pro Screen.** Kein zweites, gleichrangiges Element daneben.
- **Reihenfolge:** Overview → Trends → Details. (Dashboard = Cockpit, kein Detail-Screen.)
- **Progressive Disclosure:** Sekundäres/Selten-Genutztes (Verlauf, KI-Coach,
  Verteilung, „lange nicht trainiert", Roh-Sessions) hinter Disclosure/Toggle.
- **Admin/Neben-Aktionen** raus aus dem KPI-Flow → in eine Footer-/Verwalten-Zone.
- **Listen nicht sofort in Rohdaten kippen** — kompakter Einstieg, Details auf Tap.
- **Keine Doppelung:** dieselbe Information nicht zweimal zeigen (z. B. KG-Scores
  als KPI-Karte UND nochmal als Tab-Label → nur einmal).
- **Eyeguidance:** Titel oben-links → dominante Zahl → lateraler Scan über
  gleichrangige Karten → kontrollierter Abstieg in Details.

## 2. Status-Farbsemantik (app-weit, fix)
- **Grün = Geklappt/Erfolg**, **Amber = Getroffen/Hinweis**, **Rot = Gefährlich (zurückhaltend!)**.
- **Rot nur als Warnsignal**, nie als dominante Hero-Wirkung. **Erfolgsquote nie rot**
  einfärben (liest sich sonst wie Fehler — neutral/violet/grün verwenden).
- Charts: gleiche Farbzuordnung wie KPI-Karten/Labels/Legenden. Im Chart-Default
  ist die Erfolgs-Linie primär; Getroffen/Gefährlich **standardmäßig mit an**
  (nicht erst einblenden müssen). Dark-Mode muss lesbar bleiben.
- Identitäts-Akzente (Tokens `TONE`/`ACCENT`): sky/violet/amber/emerald — **gedämpft/getönt**.

## 3. KPI-Karten (Hybrid)
- **Getönte Identitäts-Karten:** subtiler Tint + farbiger Rahmen + farbiges
  Icon/Label, aber **Zahl bleibt weiß/maximal lesbar**. Reduzierte Sättigung,
  **keine schweren Vollflächen**.
- Gleiche Bedeutung → gleicher Accent (app-weit). Lange Texte (z. B. Wettkampfname)
  **umbrechen statt abschneiden** (`subLines={2}`), nicht hart slicen.
- KPI-Werte immer `tabular-nums`.

## 4. Status-Buttons (Erfassen/Plan)
- „Geklappt/Getroffen/Gefährlich" und „Geklappt/Nicht" als **tonale Karten**
  (`bg-*-50` + Rand/Text), **nicht** als laute gesättigte Vollflächen.
- Bei erreichter Anzahl: **markenkonforme Celebration** (Brand-Pop, Pokal/Sparkle,
  kurzer Ring-Glow) — nicht der Standard-Grün-Text.

## 5. Header / Utility-Zone
- Mobiler Header: nur **Brand · Daten-Switcher (kleine Pille) · Einstellungen**.
- **Daten-/Sportler-Switcher** ist Kontext, nicht Primärinhalt → kleine Pille in der
  Utility-Zone, keine eigene breite Zeile. Inhalt soll früh beginnen.
- **Kein KI-Coach im Header** (und derzeit auch kein mobiler KI-FAB — auf Wunsch entfernt).
- Primäre Quick-Action (z. B. „Erfassen") klein **oben am Header**, nicht als großer
  Full-Width-Block weit unten.

## 6. Overlays / FAB
- Floating-Buttons dürfen **nicht** mit Content/Bottom-Nav kollidieren; in dichten
  Flows (Erfassen/Trainingsplan) ausblenden. Immer `pb-28` Bottom-Nav-Clearance.

## 7. Spacing / Grid / Typo
- **8pt-Grid.** Sektionsabstand > Intra-Card. Ein Radius-System
  (Hero `rounded-[26px]`, Card `rounded-[22px]`, Tile `rounded-[20px]`).
- Typo-Skala strikt: eyebrow / metric / title / support / caption.
- Basis-Material überall `card-surface` (Dark-Mode-fest). EmptyState überall gleich.

---

## 8. Screen-spezifische Entscheidungen
- **Dashboard (Cockpit):** kein monolithisches Einzel-KPI. Oben 2×2 getönte Karten
  **Sessions · Aktuelle Serie · Letzter Wettkampf · Bestleistung** (Training + Wettkampf
  gemeinsam, Bestleistung & Letzter Wettkampf nebeneinander). „Aktuelle Serie" in
  **Wochen** (aufeinanderfolgende Trainingswochen). Darunter **Trends** (Wettkampf-
  Verlauf + **„Übung im Fokus"** = eine konkrete, datenreichste Übung als Default,
  Dropdown-Auswahl, alle Kategorien automatisch sichtbar). Dann Details (Top/Flop
  „wichtigste Übungen", kompakt). Kein allgemeiner Erfolgs-Trend über *alle* Übungen.
- **Übungs-Detail:** Hero = Erfolgsquote (A/B Zahl|Ring, **Zahl ist Default/primär**),
  Modus-Filter **Alle/Mit Seil/Ohne Seil** steuert den **ganzen** Screen (ein vm),
  Badge-Counts folgen dem Zeitraum-Filter. Breakdown (Geklappt stark, Getroffen mittel,
  Gefährlich dezent). Trend (alle Status-Linien default an). Wettkampf-Cluster + XLSX-
  Import als sekundäre Disclosure/Utility, nicht im KPI-Flow.
- **Training:** Actions oben dezent (Ghost/kompakt). KPIs getönt, Erfolgsquote nicht rot.
  Kompakter Einstieg: Übungen-Liste primär, Roh-Verlauf (Suche/Filter/Sessions) hinter
  „Verlauf anzeigen".
- **Wettkampf:** Tab als SegmentedControl, dezente Actions, getönte Overview-Karten,
  „Verlauf"-Chart, Jahres-Listen.
- **Listen (Übungen/Programme/Sportler/Settings):** IOSList + einheitlicher EmptyState.

---

## 9. Import / Scan (Wertungsbogen)
- Zwei Buttons: **„PDF / Dokument"** (genauest, inkl. Einzelabzüge) und **„Foto scannen"**
  (ein Button → native Auswahl Kamera/Galerie/Datei; nicht drei App-Buttons).
- **Einzelbild** beim Foto; **mehrere** Bögen nur über die **Bulk-Funktion**.
- Fortschritt als **System-Karte** (Spinner + indeterminater Balken), gilt für PDF & Bild.
- **Foto → KI-Vision** (Edge-Function `scan-wertungsbogen`, OpenRouter-Vision):
  - **Zwei getrennte Calls** — (1) Stammdaten+Footer (klein, zuverlässig, muss klappen),
    (2) Übungstabelle (best effort, darf den Scan nicht umkippen). Pro-Übung-Werte werden
    **per Reihenfolge** aufs aktive Programm gemappt (nur bei passender Anzahl, kein
    Programm-Neuaufbau).
  - **Fallback** auf Tesseract-OCR (mit Auto-Ausrichtung Hoch/Quer) wenn Vision scheitert.
  - **Nachsichtig:** Teilerkennung übernehmen, Rest manuell — nicht komplett scheitern.
  - Diagnose-Disclosure zeigt die Roh-Antwort der Tabellen-KI, wenn keine Übungen erkannt.
- **Lektion:** Pro-Übung-Tabelle + Stammdaten in EINEM Call sprengt das Token-/Stabilitäts-
  Budget → kippt alles. Riskante Teil-Extraktion immer **isolieren** (eigener Call), damit
  der zuverlässige Teil geschützt bleibt. Für 100 % exakte Einzelabzüge bleibt das **PDF**.

---

## 10. System-/Daten-Regeln
- **Neues Design ist Default für alle** (kein Opt-in/Opt-out-Schalter mehr).
- **Tabellen-first by default:** neue Nutzer starten `migrated_to_tables: true`;
  bestehende werden beim Login automatisch (idempotent) migriert → Trainer/Admin sehen
  Sportler-Daten ohne manuellen Schritt.
- **Pro-Übung-Namen** lassen sich aus eigenen benannten Programmen herleiten
  (identische Punktfolge) bzw. per Re-Import füllen.
- Versionierung: SemVer-light in `package.json` (siehe `CLAUDE.md`) — bei live gehenden
  Änderungen Version hochziehen.

---

## 11. Arbeitsweise (Prozess)
- **Screen-by-Screen** umbauen; pro fertigem Screen kurzer Zwischen-Check / Abnahme,
  damit sich keine Systemfehler fortpflanzen.
- Pro Schritt: bauen (`npm run build`) → Version bump → committen → PR → mergen.
- Nicht nur Komponenten migrieren, sondern **pro Screen die Blickführung explizit prüfen
  und das dominante Objekt benennen.**
