# Supabase-Setup für ArtCyc Coach

Schritt-für-Schritt-Anleitung. Du machst alles im Browser, dauert ~10 Minuten.
Am Ende schickst du mir 2 Zeichenfolgen — dann implementiere ich Login & Sync.

---

## Schritt 1 — Supabase-Account & Projekt anlegen

1. <https://supabase.com> öffnen → **„Start your project"** → **„Sign in with GitHub"**.
   Verwende den `m2vwjcpy56-cmd`-Account (selber Account wie GitHub für Konsistenz).
2. **„New project"** klicken.
3. Eingeben:
   - **Name:** `artcyc-coach`
   - **Database Password:** **kopier es in deinen Passwort-Manager**, du brauchst es selten aber Verlust ist ärgerlich
   - **Region:** `Frankfurt (eu-central-1)` — kürzeste Latenz aus DE
   - **Pricing Plan:** Free
4. „Create new project" → 2 Minuten warten bis das Setup fertig ist.

---

## Schritt 2 — SQL-Schema einspielen

1. In der Sidebar links: **SQL Editor** öffnen.
2. **„+ New query"**.
3. Den **kompletten Inhalt** von `docs/supabase-setup.sql` kopieren und einfügen:
   - In Windows-Explorer: `C:\Users\RubenGeyer\iCloudDrive\Kunstrad\ArtCyc App\docs\supabase-setup.sql`
   - Im Editor (z.B. Notepad) öffnen, Strg+A → Strg+C → in Supabase Strg+V
4. **„Run"** unten rechts klicken.
5. Erwartete Ausgabe: **„Success. No rows returned."** — dauert <1 Sekunde.
   Falls eine Fehlermeldung kommt, kopier sie mir und ich fixe das Schema.

---

## Schritt 3 — Auth-Einstellungen härten

In der Sidebar: **Authentication** → **Providers** → **Email**:

- **„Enable Email Provider"** = ON
- **„Confirm email"** = ON  *(User muss E-Mail-Link klicken bevor er einloggen kann)*
- **„Secure email change"** = ON
- Save

Sidebar: **Authentication** → **Policies** *(oben in der Page-Navigation)*:

- **Password Strength → Minimum length** = 10
- **Leaked Password Protection** = ON  *(prüft gegen HaveIBeenPwned-Datenbank)*
- Save

Sidebar: **Authentication** → **URL Configuration**:

- **Site URL** = `https://artcyc.vercel.app`
- **Redirect URLs** (eine pro Zeile, „Add URL" klicken):
  - `https://artcyc.vercel.app/**`
  - `http://localhost:5173/**`  *(für lokale Entwicklung)*
- Save

Sidebar: **Authentication** → **Multi-Factor Auth**:

- **TOTP (Authenticator App)** = Enable
- Save

Sidebar: **Authentication** → **Rate Limits** *(falls vorhanden, optional)*:

- Lass die Defaults — sie sind bereits restriktiv genug.

---

## Schritt 4 — Project-URL und Anon-Key kopieren

Sidebar: **Project Settings** (Zahnrad unten) → **API**.

Du siehst zwei Felder:
- **Project URL** — sieht aus wie `https://abcdefghijklmnop.supabase.co`
- **Project API keys → anon / public** — eine sehr lange Zeichenkette

**Beide kopieren und mir hier in den Chat schicken.**

⚠️ Der **anon-Key ist öffentlich** (wird im Frontend benutzt) — kein Problem ihn zu teilen.
⚠️ Der **service_role-Key** auf der gleichen Seite ist **geheim** — den brauchen wir nicht und du sollst ihn niemandem zeigen.

---

## Was als nächstes passiert

Sobald du mir URL + Anon-Key gibst:
1. Ich integriere `@supabase/supabase-js` in die App
2. Login/Signup-UI mit Rollen-Wahl (Sportler/Trainer)
3. Du registrierst dich als allererster User → wirst automatisch Admin
4. Wir testen das Login-Flow auf deinem iPhone
5. Phase 3: Daten-Sync (eintägig)

---

## Troubleshooting

**Schritt 2 SQL-Fehler:** Schick mir den exakten Fehlertext. Häufigste Ursache: Schema schon teilweise vorhanden — dann lösche `profiles`, `athletes`, `exercises`, `programs`, `sessions`, `competitions` (Tabellen) im Table Editor und führ das SQL erneut aus.

**Email-Bestätigung kommt nicht an:** Beim Free-Tier verschickt Supabase E-Mails über den eigenen SMTP-Server, der manchmal in Spam landet. Schau im Spam-Ordner. Für Produktion solltest du später einen eigenen SMTP-Anbieter eintragen (z.B. Resend, kostenlos bis 3000 Mails/Monat).

**Vergessenes DB-Passwort:** Project Settings → Database → „Reset database password". Schadet nichts.
