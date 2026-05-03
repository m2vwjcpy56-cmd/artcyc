# Deployment-Anleitung — ArtCyc Coach auf Vercel

Diese App ist eine **PWA** (Progressive Web App). iPhone-Nutzer können sie
direkt aus Safari über „Zum Home-Bildschirm hinzufügen" installieren —
sie sieht dann aus und verhält sich fast wie eine native App.

## Schritt 1 — GitHub-Repo erstellen

1. Öffne <https://github.com/new> (am iPhone in Safari oder am Mac).
2. Repository-Name: `artcyc-coach` (oder beliebig).
3. Sichtbarkeit: **Private** wählen — nur du sollst den Code sehen.
4. **Nicht** „Initialize with README" o.ä. — der Code ist schon da.
5. Klick „Create repository". GitHub zeigt eine Seite mit Anweisungen.

## Schritt 2 — Lokalen Code zu GitHub pushen

Auf dem Mac im Terminal (im Projekt-Ordner):

```bash
git add .
git commit -m "Initial commit — ArtCyc Coach PWA"
git remote add origin https://github.com/<DEIN-USER>/artcyc-coach.git
git push -u origin main
```

Falls Git nach Login fragt: GitHub-Username + ein **Personal Access Token**
als Passwort (unter <https://github.com/settings/tokens> erstellen, Scope
`repo` reicht).

## Schritt 3 — Vercel verbinden

1. Auf <https://vercel.com> mit GitHub-Account einloggen.
2. „Add New… → Project" klicken.
3. Dein `artcyc-coach`-Repo auswählen, „Import" drücken.
4. Vercel erkennt **Vite** automatisch — alle Standardwerte passen:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
5. „Deploy" klicken. Erste Build dauert ~1 Minute.
6. Du bekommst eine URL wie `https://artcyc-coach.vercel.app`.

Ab jetzt: **jeder `git push` deployt automatisch eine neue Version**.

## Schritt 4 — Auf dem iPhone installieren

1. URL in **Safari** öffnen (nicht Chrome — nur Safari kann iOS-PWAs installieren).
2. Teilen-Symbol unten mittig (Quadrat mit Pfeil nach oben).
3. „Zum Home-Bildschirm hinzufügen".
4. Name bestätigen → fertig. Icon erscheint auf dem Home-Bildschirm,
   App startet ohne Browser-Leiste, Daten bleiben offline gespeichert.

Sportler einladen: ihnen einfach den Vercel-Link schicken („Öffne in Safari,
Teilen → Zum Home-Bildschirm").

## Eigene Domain (optional, später)

Wenn du eine richtige Adresse willst (`artcyc.de` o.ä.):
1. Domain bei einem Anbieter kaufen (z.B. INWX, Netcup — ~10 €/Jahr für `.de`).
2. In Vercel: Project → Settings → Domains → Add → deine Domain eintippen.
3. Vercel zeigt dir DNS-Werte → die beim Domain-Anbieter eintragen.
4. Nach 5–60 Min ist die Domain aktiv (HTTPS-Zertifikat von Vercel automatisch).

## Was tun wenn…

**Build schlägt fehl auf Vercel:** Logs anschauen (Vercel zeigt sie direkt).
Meistens: Node-Version. In Vercel-Settings → General → Node.js Version 20.x setzen.

**App startet nicht offline:** Service Worker greift erst nach 2. Aufruf.
Einmal mit Internet öffnen, dann funktioniert sie auch im Funkloch.

**Icon falsch / alte Version klebt:** iOS cached PWA-Icons aggressiv.
App vom Home-Bildschirm löschen und neu hinzufügen.

**Updates erscheinen nicht:** Service-Worker hat ein 24h-Cache-Fenster.
Hard-Reload in Safari (Adressleiste lange drücken → „Seite neu laden").

## Daten-Synchronisation zwischen Geräten?

Aktuell **nein** — alle Daten liegen pro iPhone in `localStorage`.
Für Sync zwischen Sportler/Trainer-Geräten ist Supabase nötig
(Schema steht bereits in `docs/supabase-setup.sql`, siehe Priorität 3 in CLAUDE.md).
