# UCI Kunstradsport 2026 — Programm-Validierungs-Regeln

Quelle: UCI Reglement 8-INA-2026-G (deutsche BDR-Übersetzung, Stand 2025-11-02).

PDF: <https://www.badischer-radsportverband.de/fileadmin/user_upload/uci-reglement-kuras_dt-version_8-ina-2026-g_2025-11-02.pdf>

Dieses Dokument fasst die für die App-Validierung relevanten Regeln zusammen. Implementierung in `src/lib/uciRules.js` (Funktion `validateProgram`).

## MUST — harte Validierung (blockiert Speichern)

### 1. Übungsanzahl-Cap (Art. 8.2.002 / 8.2.003)

| Disziplin | Elite/Junioren | Schüler |
|---|---|---|
| 1er | max. 30 | max. 25 |
| 2er | max. 25 | max. 20 |
| 4er | max. 25 | max. 25 |
| 6er | max. 25 | max. 25 |

### 2. Identische Übungsnummer-Stämme (Art. 8.1.019)

> *„Von jeder Übungsnummer darf immer nur eine Übung (entweder a, b, c usw.) gewählt werden."*

Identität = Stamm-Code ohne Buchstaben. `1001a` und `1001b` zusammen sind verboten.

### 3. Disziplin-Konsistenz (Art. 8.1.019)

Code-Präfix muss zur Programm-Disziplin passen:
- 1er → Codes 1xxx
- 2er → Codes 2xxx
- 4er → Codes 4xxx
- 6er → Codes 6xxx

### 4. 2er-Splitting (Art. 8.2.002 / 8.2.003)

Programm muss Übungen auf einem Rad **und** auf zwei Rädern enthalten:

| Klasse | auf einem Rad |
|---|---|
| Elite/Junioren | 8–15 |
| Schüler | 4–12 |

Rest = auf zwei Rädern (≥ 1).

### 5. 2er-Standdrehungen (Art. 8.1.020)

Max. 3 Übungen aus Gruppe „Standdrehungen auf zwei Rädern" (Codes 8.5.009 → 2090–2099).

### 6. 2er-„einzeln"-Übungen (Art. 8.1.020)

Max. 3 Übungen mit dem Begriff „einzeln" im Namen, außer in Gruppe „Übergänge auf zwei Rädern".

### 7. Schlussübungs-Position (Art. 8.2.011)

Schlussübungen (Gruppe 8.5.006 für 1er, 8.5.011 für 2er) dürfen nur stehen:
- als letzte Übung des Programms
- oder direkt vor einem Radwechsel (nur 2er)

### 8. Steigerübergang-Konsistenz (Art. 8.1.020)

Nach Steigerübergang mit Endposition Steiger muss die Folgeübung in derselben Steigerart sein.

## SHOULD — Warnung, kein Block

### 9. Punktzahl-Plausibilität

Erfahrungswerte:
- 1er Elite: 80 – 300 Punkte
- ähnliche Bands pro Klasse, hartcodiert oder über User-Settings

### 10. Programm-Vollständigkeit

Hinweis wenn weniger als ~70 % der Cap-Anzahl genutzt — meist taktisch suboptimal.

## Code-Gruppen (Kapitel V)

| Disziplin | Gruppe | Artikel | Code-Bereich (geschätzt) |
|---|---|---|---|
| 1er | Niederrad | 8.5.002 | 1001–1099 |
| 1er | Wenden/Hocken/Sprünge | 8.5.003 | 1100–1199 |
| 1er | Steiger | 8.5.004 | 1200–1299 |
| 1er | Steigerübergänge | 8.5.005 | 1300–1399 |
| 1er | Schluss | 8.5.006 | 1400–1499 |
| 2er | Niederrad (2 Räder) | 8.5.007 | 2001–2049 |
| 2er | Steiger (2 Räder) | 8.5.008 | 2050–2079 |
| 2er | Standdrehungen (2 Räder) | 8.5.009 | 2080–2099 |
| 2er | Übergänge (2 Räder) | 8.5.010 | 2100–2199 |
| 2er | Schluss (2 Räder) | 8.5.011 | 2200–2229 |
| 2er | Niederrad (1 Rad) | 8.5.012 | 2300–2399 |
| 2er | Steiger (1 Rad) | 8.5.013 | 2400–2499 |
| 2er | Übergänge (1 Rad) | 8.5.014 | 2500–2599 |
| 4er | Übungstabelle | 8.5.015 | 4xxx |
| 6er | Übungstabelle | 8.5.016 | 6xxx |

Die exakten Bereiche bitte gegen das PDF prüfen — die obigen sind Schätzungen für die Validator-Implementierung.

## Implementations-Reihenfolge

1. **Schnell** (D2-α): Regeln 1, 2, 3, 6 — alle ohne Gruppen-Klassifikation machbar.
2. **Mit Gruppen-Mapping** (D2-β): Regeln 4, 5, 7. Benötigt Code-Range-Mapping.
3. **Komplex** (D2-γ): Regel 8 (Steigerübergang-Folge).
4. **SHOULD** (optional): Regeln 9, 10.

## Was die App heute nicht prüfen muss / kann

- Griffverbindungen (Art. 8.2.034) — keine Griff-Metadaten in der App.
- Programm-Struktur (Präsentation, Bodenstand etc.) — nicht durch Programm-Inhalt prüfbar.
- Altersklasse selbst — der User wählt sie manuell beim Wettkampf.

## Was WeBo / Kuras / BIKY zusätzlich machen

- WeBo validiert beim Speichern (Übungsanzahl, Disziplin, Identität, 2er-Splitting).
- WeBo erkennt entfallene Übungsnummern bei Reglement-Updates.
- WeBo exportiert ins BDR-Meldeformat (XML) für Kuras.
- Keines dieser Tools macht Reihenfolge-Vorschläge oder Punktzahl-Optimierung — das bleibt Trainerarbeit.
