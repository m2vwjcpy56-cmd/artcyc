# ArtCyc — App-weites Design-System & Rollout-Plan

Status-Legende: ✅ erledigt · 🔁 in Arbeit · ⬜ offen

---

## Phase 0 — V2 Übungs-Detail fachlich vollständig (Kern-Fix)

Vorschau opt-in (Einstellungen → Vorschau (Beta) → „Neues Übungs-Design"),
Default AUS. Wird erst nach Abnahme zum Standard.

- ✅ **Modus-Filter zurück** (`Alle / Mit Seil / Ohne Seil`), direkt über Quick Insights.
- ✅ **State-Contract**: `selectedMode` steuert den GESAMTEN Screen (ein `vm`).
- ✅ **A/B-KPI**: Umschalter `Zahl | Ring` im Hero (Zahl bleibt primär lesbar; Ring tritt semantisch zurück).
- ✅ **Trend-Status-Semantik**: Geklappt grün (primär), Getroffen amber, Gefährlich rot — sekundär zuschaltbar; Legende = Toggle; identische Farben wie KPI-Karten; dark-fest.
- ✅ **Empty-States** pro Modus + Zeitraum.
- ⬜ Wettkampf-Cluster + XLSX-Import in V2 nachziehen (NACH KPI-Abnahme).

### State-Contract (verbindlich)
```
selectedMode ∈ { all | rope | noRope }   → ropeFilter (null|true|false)
vm = buildExerciseScreenModel(exercise, data, ropeFilter, period)

ALLE abgeleiteten Werte kommen aus EINEM vm:
- successRateCurrent, successRateLast4Weeks, successDelta
- lastSessionDate, lastSessionRate, lastSessionFraction
- sessionsCount, totalAttempts, totalSuccess, totalHit, totalDanger
- hitRate, dangerRate
- successTrendSeries, dangerTrendSeries, compositionSeries
- recentSessionsLimited, allSessions, nextFocusInsight, periodHasData
```
Regel: KEINE Kennzahl/Serie/Liste außerhalb `vm`. Filter (Zeitraum + Modus)
sind die einzigen Eingänge. Empty-States leiten sich aus `vm.periodHasData`
und den Pro-Modus-Counts ab.

---

## Design-Tokens (Single Source of Truth)

### Farbsemantik (app-weit, fix — keine dekorative Mehrfarbigkeit)
| Bedeutung   | Token            | Hell     | Dunkel   |
|-------------|------------------|----------|----------|
| success/Geklappt | `--status-success` | #34C759 | #34C759 |
| hit/Getroffen    | `--status-hit`     | #FF9F0A | #FF9F0A |
| danger/Gefährlich| `--status-danger`  | #FF3B30 | #FF453A |
| accent/Brand     | `--brand`          | #FF9500 | #FF9F0A |
| interactive      | `--tint`           | #007AFF | #0A84FF |
| neutral/admin    | slate/gray         | —        | —        |

Regel: Rot **nur** Warnsemantik, nie dominanter Hero. Grün = Erfolg.

### Spacing (8pt-Grid)
`4 / 8 / 12 / 16 / 20 / 24` — Sektionsabstand (20–24) > Intra-Card (12–16).
Bottom-Nav-Clearance: Content-Container immer `pb-28`.

### Typo-Skala (strikt)
| Rolle    | Klasse |
|----------|--------|
| eyebrow  | `text-[12px] font-semibold uppercase tracking-wider` |
| metric   | `text-[34–72px] font-bold tracking-tight tabular-nums` |
| title    | `text-[15px] font-semibold` |
| support  | `text-[13–15px] text-slate-500` |
| caption  | `text-[11–12px] text-slate-400` |
Alle KPI-Zahlen `tabular-nums`.

### Radius / Card-Ränge
- Hero: `rounded-[26px]` (einzige dominante Fläche/Screen).
- Standard-Card: `rounded-[22px]`.
- Metric-Tile/Breakdown: `rounded-[20px]`.
- Basis-Material überall `card-surface` (hat Dark-Mode-Gradient).

---

## Gemeinsame Komponenten (zu extrahieren)

| Component | Zweck | Ersetzt / vereinheitlicht |
|-----------|-------|---------------------------|
| `Screen` | Layout-Wrapper (max-w, padding, pb-28) | wiederholte `min-h-screen … pb-28`-Wrapper |
| `TopBar` | kompakter App-Bar (Titel, Back, Overflow) | diverse ad-hoc Header |
| `SegmentedControl` | iOS-Segmented (Zeitraum, Modus, A/B) | ~5 handgebaute `bg-[#E5E5EA]`-Segmente |
| `HeroKPI` | eine dominante KPI (Zahl/Ring-Variante) | Dashboard- & Detail-Hero |
| `MetricCard` | eyebrow/metric/support, gleichrangig | `StatCard`, Quick-Insight-Tiles |
| `StatusBreakdown` | success/hit/danger Karten + Farbsemantik | Breakdown-Cluster (Detail) |
| `TrendChart` | Quote-Linie + sek. Status-Linien + Legende | Detail-Chart, Dashboard-Sparkline-Logik |
| `DisclosureSection` | progressive disclosure (Coach/Verteilung/…) | wiederholte Toggle-Buttons |
| `AdminZone` | Footer-Sektion (Edit/Archiv/Delete/Import) | verstreute Admin-Blöcke |
| `EmptyState` | identische Leer-Logik je Filter | mehrere Inline-Empties |
| `statusColor()` / `statusLabel()` | zentrale Status-Semantik | hartkodierte Hex/Labels |

Beibehalten: `IOSList` / `IOSListRow` / `IOSTag` (passen ins System).
Demotiert: `ExerciseStatsCard` (durch `MetricCard`+`StatusBreakdown` ersetzt).

---

## Betroffene Screens & konkrete Änderungen

| Screen | Dominantes Objekt | Wesentliche Änderung |
|--------|-------------------|----------------------|
| **ExerciseDetail (V2)** | Erfolgsquote-Hero | ✅ Kern-Fix; Vorlage fürs System |
| **Dashboard** | Saison-Erfolg/Status-Hero | Hero + 3 MetricCards + 1 TrendChart; „Lange nicht trainiert" als DisclosureSection; Admin raus |
| **TrainingView** | Erfolgsquote-Hero | StatCards → MetricCards; Liste in IOSList; Trainingsplan-Eintrag als Standard-Row |
| **WettkampfView** | letztes Ergebnis-Hero | KPI-Hero (Endergebnis) + MetricCards (KG1/KG2/Abzug); Segmented vereinheitlichen |
| **WettkampfDetail** | Endergebnis-Hero | gleiche Hero/MetricCard-Sprache; Wertungstisch als DisclosureSection |
| **ProgrammeView / SportlerView / UebungenView** | Liste | IOSList-Konsistenz, EmptyState, Admin-Trennung |
| **SettingsView** | Liste | bereits IOSList; Token-Angleich |

Globale Regeln je Screen: genau **ein** dominantes Objekt, gleiche Card-Ränge,
gleiche Empty-Logik, gleiche Chart-Rahmung/Farbsemantik, Admin im Footer,
Bottom-Nav-Clearance.

---

## Rollout-Reihenfolge (nicht alles sofort live)

1. ✅/🔁 **V2 Übungs-Detail** fachlich korrigieren (Phase 0) → Abnahme.
2. ⬜ Tokens + Shared Components extrahieren (`src/ui/`), V2 darauf umstellen (keine Optik-Änderung).
3. ⬜ Gleiche Sprache auf **Dashboard → Wettkampf → Sportler → Listen → Detailseiten** anwenden (jeweils hinter demselben Vorschau-Flag).
4. ⬜ **App-weite Vorschau** einmal komplett durchziehen (ein Flag schaltet ALLE neuen Screens).
5. ⬜ Erst nach Gesamt-Abnahme **Default aktivieren** und Alt-Screens entfernen.

Kein Schritt geht ungefragt live; Default-Umschaltung ist der letzte Schritt.
