# ArtCyc Coach → iPhone über TestFlight

Die Web-App (Vite + React PWA) wurde mit **Capacitor 8** in eine native iOS-App
verpackt. Das native Xcode-Projekt liegt unter [`ios/`](ios/).

> Capacitor 8 nutzt **Swift Package Manager** — **kein CocoaPods/Homebrew nötig.**

---

## ✅ Schon erledigt (von Claude eingerichtet)

- Capacitor integriert (`@capacitor/core`, `/cli`, `/ios`), Config in
  [`capacitor.config.json`](capacitor.config.json)
- **Bundle-ID:** `de.neueweberei.artcyc` · **App-Name:** „ArtCyc Coach"
- iOS-Xcode-Projekt erzeugt (`ios/App/App.xcodeproj`)
- App-Icon (1024 + alle Größen) + Splashscreen aus `public/icon-source.svg` generiert
- Export-Compliance vorbeantwortet (`ITSAppUsesNonExemptEncryption = false` → keine
  Verschlüsselungs-Rückfrage beim Upload)
- **Build erfolgreich getestet** im iOS-Simulator (App rendert, Login-Screen lädt)
- npm-Skripte: `npm run ios:sync` (Web bauen + ins iOS-Projekt kopieren),
  `npm run ios:open` (Xcode öffnen)

---

## ⏳ Schritt 1 — Apple Developer Program (DU, dauert 1–2 Tage)

TestFlight geht **nur** mit kostenpflichtiger Mitgliedschaft (**99 €/Jahr**).

1. Auf <https://developer.apple.com/programs/enroll/> mit deiner Apple-ID anmelden
   (Zwei-Faktor muss aktiv sein).
2. Kontotyp wählen:
   - **Einzelperson (Individual)** — am einfachsten/schnellsten. App erscheint dann
     unter deinem Namen. **Empfohlen für den Start.**
   - **Organisation** — nur wenn die App offiziell unter „Neue Weberei" laufen soll;
     braucht eine **D-U-N-S-Nummer** und dauert deutlich länger.
3. Bezahlen (99 €). Freigabe kommt per Mail, meist innerhalb von 24–48 h.

➡️ Sag mir Bescheid, sobald die Mitgliedschaft aktiv ist — dann machen wir Schritt 2–5.

---

## ⏳ Schritt 2 — Signing in Xcode (zusammen, 5 Min)

```bash
npm run ios:open      # öffnet ios/App/App.xcodeproj in Xcode
```

In Xcode: Target **App** → Reiter **Signing & Capabilities**
- ✅ „Automatically manage signing"
- **Team** = dein Apple-Developer-Account auswählen
  (Xcode registriert dann automatisch die Bundle-ID `de.neueweberei.artcyc`)

---

## ⏳ Schritt 3 — App in App Store Connect anlegen (DU, 5 Min)

Auf <https://appstoreconnect.apple.com> → **Apps** → **+** → **Neue App**
- Plattform: **iOS**
- Name: **ArtCyc Coach**
- Primärsprache: **Deutsch**
- Bundle-ID: **de.neueweberei.artcyc** (erscheint nach Schritt 2 in der Liste)
- SKU: frei wählbar, z. B. `artcyc-coach`

---

## ⏳ Schritt 4 — Archivieren & hochladen (zusammen, ~15 Min)

In Xcode:
1. Geräteziel oben auf **„Any iOS Device (arm64)"** stellen (NICHT Simulator).
2. Menü **Product → Archive** → es baut ein Release-Archiv.
3. Im **Organizer**-Fenster: Archiv auswählen → **Distribute App** →
   **TestFlight & App Store** → **Upload**.
4. Apple verarbeitet den Build (~10–20 Min, du bekommst eine Mail).

> **Build-Nummer:** bei jedem neuen Upload muss `CFBundleVersion` (Build) hochgezählt
> werden. In Xcode unter Target → General → „Build". Die Versionsnummer (`0.16.3`)
> kommt aus `package.json`.

---

## ⏳ Schritt 5 — Testen auf dem iPhone (DU)

In App Store Connect → deine App → Reiter **TestFlight**:
- **Interne Tester** (bis 100 Personen, dein eigener Account): sofort verfügbar,
  **keine Apple-Review** nötig. Füge deine Apple-ID als Tester hinzu.
- **Externe Tester:** brauchen eine kurze Beta-Review von Apple (1–2 Tage).

Auf dem iPhone: **TestFlight-App** aus dem App Store laden → Einladung annehmen →
ArtCyc Coach installieren. Fertig. 🎉

---

## Workflow bei Code-Änderungen danach

```bash
npm run ios:sync      # baut die Web-App neu + kopiert sie ins iOS-Projekt
npm run ios:open      # Xcode öffnen → Build-Nummer +1 → Archive → Upload
```

## Hinweise

- Die App braucht **Internet** für Login (Supabase) und PDF-Import (pdf.js via CDN).
- Erste TestFlight-Build = noch „Beta" — passt zur Versionierung `0.x` (siehe CLAUDE.md).
