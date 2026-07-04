import React, { useState, useEffect } from 'react';
import {
  Trophy, ClipboardList, ScanLine, BarChart3, Users, ListChecks,
  Check, ChevronRight, X, Menu, Smartphone, ShieldCheck, Globe, BookOpen,
  User, UserCog,
} from 'lucide-react';

// =============================================================
// ArtCyc — öffentliche Landingpage (artcyc.app)
// Die Web-App liegt unter /web. Diese Seite ist die Außenwirkung:
// Start, Funktionen, FAQ, Kontakt, Impressum, Datenschutz.
// =============================================================

const APP_NAME = 'ArtCyc Coach';
// App-Store-Link: greift, sobald die App öffentlich ist (App-ID 6783066572).
// Bis dahin verweist der Banner darauf bzw. auf TestFlight (PLATZHALTER).
const APP_STORE_URL = 'https://apps.apple.com/app/id6783066572';
const ACCENT = '#FF9500';

const NAV = [
  { path: '/', label: 'Start' },
  { path: '/funktionen', label: 'Funktionen' },
  { path: '/faq', label: 'FAQ' },
  { path: '/kontakt', label: 'Kontakt' },
];

function cx(...a) { return a.filter(Boolean).join(' '); }

// ---- App-Store-Banner (oben, schließbar) -------------------------------
function AppBanner() {
  const [open, setOpen] = useState(() => {
    try { return localStorage.getItem('artcyc:banner') !== 'closed'; } catch { return true; }
  });
  if (!open) return null;
  const close = () => { setOpen(false); try { localStorage.setItem('artcyc:banner', 'closed'); } catch { /* egal */ } };
  return (
    <div className="w-full bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-3 py-2 flex items-center gap-3">
        <button onClick={close} className="p-1 text-white/60 hover:text-white shrink-0" aria-label="Schließen"><X size={16} /></button>
        <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
          <Trophy size={18} style={{ color: ACCENT }} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-semibold leading-tight truncate">{APP_NAME}</div>
          <div className="text-[11px] text-white/60 leading-tight truncate">Kunstrad-Coaching für iOS</div>
        </div>
        <a href={APP_STORE_URL} target="_blank" rel="noreferrer"
          className="shrink-0 text-[13px] font-semibold px-4 py-1.5 rounded-full"
          style={{ background: ACCENT, color: '#fff' }}>
          Laden
        </a>
      </div>
    </div>
  );
}

// ---- Kopfzeile / Navigation --------------------------------------------
function Header({ path }) {
  const [menu, setMenu] = useState(false);
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/70">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <a href="/" className="flex items-center gap-2 font-bold text-[18px] tracking-tight">
          <span className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#0F172A' }}>
            <Trophy size={18} style={{ color: ACCENT }} />
          </span>
          ArtCyc
        </a>
        <nav className="hidden sm:flex items-center gap-1">
          {NAV.map(n => (
            <a key={n.path} href={n.path}
              className={cx('px-3 py-2 rounded-full text-[14px] font-medium transition',
                path === n.path ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50')}>
              {n.label}
            </a>
          ))}
          <a href="/web" className="ml-2 px-4 py-2 rounded-full text-[14px] font-semibold text-white transition active:scale-95"
            style={{ background: ACCENT }}>Zur Web-App</a>
        </nav>
        <button className="sm:hidden p-2 text-slate-700" onClick={() => setMenu(m => !m)} aria-label="Menü">
          {menu ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {menu && (
        <div className="sm:hidden border-t border-slate-200/70 bg-white px-4 py-2 flex flex-col gap-1">
          {NAV.map(n => <a key={n.path} href={n.path} className="px-2 py-2.5 rounded-lg text-[15px] font-medium text-slate-700">{n.label}</a>)}
          <a href="/web" className="mt-1 px-2 py-2.5 rounded-lg text-[15px] font-semibold text-white text-center" style={{ background: ACCENT }}>Zur Web-App</a>
        </div>
      )}
    </header>
  );
}

function Section({ children, className }) {
  return <section className={cx('max-w-6xl mx-auto px-4', className)}>{children}</section>;
}

// ---- Start ---------------------------------------------------------------
const FEATURES = [
  { icon: ClipboardList, title: 'Training protokollieren', text: 'Übungen mit Geklappt/Nicht erfassen, Serien zählen, mit/ohne Seil — schnell direkt aus dem Trainingsplan.' },
  { icon: ScanLine, title: 'Wertungsbögen scannen', text: 'Wettkampf-Wertungsbogen abfotografieren — die KI liest Übungen, Abzüge und Endergebnis automatisch aus.' },
  { icon: BarChart3, title: 'Statistik & Trends', text: 'Erfolgsquoten pro Übung, Verlauf über Wochen/Monate, Ø-Punktabzug pro Wettkampf und Bestleistungen.' },
  { icon: ListChecks, title: 'Trainingspläne', text: 'Stehende Pläne mit verknüpften Übungen — direkt protokollieren, mit Verlaufs-Protokoll je Plan.' },
  { icon: Users, title: 'Mehrere Trainer & Sportler', text: 'Sportler per Code einladen, Co-Trainer verwalten — alle sehen dieselben Daten in Echtzeit.' },
  { icon: Trophy, title: 'Wettkämpfe & Export', text: 'Wettkämpfe erfassen, taktische Aufwertungen, und Excel-Exporte erstellen.' },
  { icon: BookOpen, title: 'Komplettes Reglement', text: 'Alle offiziellen Kunstrad-Übungen mit Übungsnummer und Punkten sind hinterlegt — Übung suchen, antippen, fertig.' },
];

// Beispiel-Übungen aus dem hinterlegten UCI-Reglement (Nummer · Name · Punkte).
const REGLEMENT_SAMPLE = [
  { c: '1104a', n: 'Frontlenkerstand HR.', p: '4,0' },
  { c: '1124c', n: 'Lenkerstand', p: '8,8' },
  { c: '1186a', n: 'Maute-Sprung', p: '7,3' },
  { c: '1249a', n: 'Kehrstandsteiger rw. HR.', p: '5,5' },
  { c: '1237a', n: 'Steiger rw.', p: '4,4' },
  { c: '1217b', n: 'Dornstandsteiger rw.', p: '6,0' },
];

const PREVIEWS = [
  { img: 'dashboard', label: 'Dashboard' },
  { img: 'trend', label: 'Übungs-Trend' },
  { img: 'wettkampf', label: 'Wettkämpfe' },
  { img: 'uebungen', label: 'Übungen' },
];

function Home() {
  return (
    <>
      <Section className="pt-14 pb-16 sm:pt-20 sm:pb-24 text-center">
        <div className="inline-flex items-center gap-2 text-[13px] font-medium text-slate-500 bg-slate-100 rounded-full px-3 py-1 mb-6">
          <span className="w-2 h-2 rounded-full" style={{ background: ACCENT }} /> Für Kunstradsport
        </div>
        <h1 className="text-[40px] sm:text-[56px] font-bold tracking-tight leading-[1.05]">
          Dein Training.<br /><span style={{ color: ACCENT }}>Sauber im Blick.</span>
        </h1>
        <p className="mt-5 text-[17px] sm:text-[19px] text-slate-600 max-w-2xl mx-auto">
          {APP_NAME} ist das Coaching-Tool für Kunstradsport: Training protokollieren, Wertungsbögen scannen,
          Fortschritt sehen — auf iOS und im Web.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a href="/web" className="px-6 py-3 rounded-full text-white font-semibold active:scale-95 transition" style={{ background: ACCENT }}>
            Web-App öffnen
          </a>
          <a href={APP_STORE_URL} target="_blank" rel="noreferrer"
            className="px-6 py-3 rounded-full font-semibold border border-slate-300 text-slate-800 active:scale-95 transition flex items-center gap-2">
            <Smartphone size={18} /> Im App Store
          </a>
        </div>
        <p className="mt-3 text-[12px] text-slate-400">iOS-App derzeit in der Beta (TestFlight) — App-Store-Release in Kürze.</p>
      </Section>

      <Section className="pb-16 sm:pb-24">
        <h2 className="text-center text-[13px] font-semibold uppercase tracking-wider text-slate-400 mb-8">Ein Blick in die App</h2>
        <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:overflow-visible sm:flex-wrap sm:justify-center">
          {PREVIEWS.map((p) => (
            <figure key={p.img} className="snap-center shrink-0 w-[210px] sm:w-[200px]">
              <img src={`/previews/${p.img}.jpg`} alt={`${APP_NAME} – ${p.label}`} loading="lazy" width="497" height="1080"
                className="w-full rounded-[2rem] border border-slate-200/70 shadow-[0_12px_45px_rgba(0,0,0,0.14)]" />
              <figcaption className="mt-3 text-center text-[13px] font-medium text-slate-500">{p.label}</figcaption>
            </figure>
          ))}
        </div>
      </Section>

      <Section className="pb-16 sm:pb-24">
        <h2 className="text-center text-[13px] font-semibold uppercase tracking-wider text-slate-400 mb-8">Einblicke, die zählen</h2>
        <div className="grid sm:grid-cols-3 gap-4">

          {/* Erfolgsquote */}
          <div className="bg-white rounded-3xl border border-slate-200/70 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="text-[13px] text-slate-500 font-medium mb-1">Trainings-Erfolgsquote</div>
            <div className="text-[40px] font-bold tracking-tight leading-none">83<span className="text-[24px] text-slate-400"> %</span></div>
            <div className="mt-4 flex h-2.5 rounded-full overflow-hidden">
              <div style={{ width: '83%', background: '#34C759' }} />
              <div style={{ width: '9%', background: '#FF9F0A' }} />
              <div style={{ width: '8%', background: '#FF453A' }} />
            </div>
            <div className="mt-3 flex items-center gap-3 text-[12px] text-slate-500 flex-wrap">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm" style={{ background: '#34C759' }} />Geklappt</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm" style={{ background: '#FF9F0A' }} />Getroffen</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm" style={{ background: '#FF453A' }} />Gefährlich</span>
            </div>
          </div>

          {/* Übungs-Trend */}
          <div className="bg-white rounded-3xl border border-slate-200/70 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="text-[13px] text-slate-500 font-medium mb-1">Übungs-Trend</div>
            <div className="text-[22px] font-bold tracking-tight">75 % → 83 %</div>
            <div className="text-[13px] font-semibold text-emerald-600 mt-0.5">↗ +8 % ggü. Vorzeitraum</div>
            <svg viewBox="0 0 240 70" className="w-full mt-3" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="artcyc-trend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#34C759" stopOpacity="0.25" />
                  <stop offset="1" stopColor="#34C759" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,52 L60,50 L120,42 L180,30 L240,18 L240,70 L0,70 Z" fill="url(#artcyc-trend)" />
              <path d="M0,52 L60,50 L120,42 L180,30 L240,18" fill="none" stroke="#34C759" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Bestleistung */}
          <div className="bg-white rounded-3xl border border-slate-200/70 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="text-[13px] text-slate-500 font-medium mb-1">Wettkampf-Bestleistung</div>
            <div className="text-[40px] font-bold tracking-tight leading-none">179,45</div>
            <div className="text-[13px] text-slate-500 mt-0.5">Punkte · Saison-Verlauf ↑</div>
            <svg viewBox="0 0 240 70" className="w-full mt-4" aria-hidden="true">
              {[30, 42, 52, 64].map((h, i) => (
                <rect key={i} x={12 + i * 58} y={70 - h} width="34" height={h} rx="6" fill={ACCENT} opacity={0.4 + i * 0.2} />
              ))}
            </svg>
          </div>

        </div>
      </Section>

      <Section className="pb-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <div key={i} className="bg-white rounded-3xl border border-slate-200/70 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4" style={{ background: ACCENT + '22' }}>
                <f.icon size={22} style={{ color: ACCENT }} />
              </div>
              <h3 className="font-semibold text-[17px] mb-1.5">{f.title}</h3>
              <p className="text-[14px] text-slate-600 leading-relaxed">{f.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="pb-16 sm:pb-24">
        <div className="bg-white rounded-3xl border border-slate-200/70 p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)] grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-[12px] font-semibold text-white rounded-full px-3 py-1 mb-4" style={{ background: ACCENT }}>2000+ Übungen</div>
            <h2 className="text-[26px] sm:text-[32px] font-bold tracking-tight leading-tight">Das komplette Reglement — schon drin.</h2>
            <p className="mt-3 text-[15px] sm:text-[16px] text-slate-600 leading-relaxed">Alle offiziellen Kunstrad-Übungen mit Übungsnummer und Punktzahl sind hinterlegt. Übung suchen, antippen — fertig. Kein manuelles Anlegen, kein Punkte-Tabellen-Wälzen.</p>
          </div>
          <div className="rounded-2xl border border-slate-200/70 overflow-hidden bg-slate-50/50">
            {REGLEMENT_SAMPLE.map((f, i) => (
              <div key={f.c} className={'flex items-center gap-3 px-4 py-3 ' + (i > 0 ? 'border-t border-slate-200/60' : '')}>
                <span className="text-[12px] font-mono text-slate-400 tabular-nums w-14 shrink-0">{f.c}</span>
                <span className="flex-1 text-[14px] font-medium truncate">{f.n}</span>
                <span className="text-[13px] font-semibold tabular-nums shrink-0" style={{ color: ACCENT }}>{f.p}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section className="pb-16 sm:pb-24">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-[12px] font-semibold text-white rounded-full px-3 py-1 mb-4" style={{ background: ACCENT }}>Zusammen trainieren</div>
          <h2 className="text-[26px] sm:text-[32px] font-bold tracking-tight leading-tight">Sportler, Trainer & Teams — ein Datenstand</h2>
          <p className="mt-3 text-[15px] sm:text-[16px] text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Ob Einzelsportler, Trainer mit mehreren Schützlingen oder ganzer Verein: Alle arbeiten mit
            denselben Daten in Echtzeit — jeder mit den passenden Rechten.
          </p>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { icon: User, title: 'Sportler', text: 'Protokolliere dein eigenes Training und deine Wettkämpfe. Deine Daten gehören dir — du entscheidest, welche Trainer sie sehen.',
              points: ['Eigener Fortschritt & Trends', 'Wettkämpfe & Bestleistungen', 'Trainer per Code freischalten'] },
            { icon: UserCog, title: 'Trainer', text: 'Betreue mehrere Sportler an einem Ort. Trage Trainings & Wettkämpfe ein und verfolge Quoten und Trends jedes Sportlers.',
              points: ['Mehrere Sportler im Blick', 'Co-Trainer teilen sich einen Sportler', 'Platzhalter-Sportler ohne eigenen Account'] },
            { icon: Users, title: 'Teams & Verein', text: 'Bündle Sportler und Trainer in einem Team. Neue Mitglieder treten per Beitritts-Code bei — ohne Zettelwirtschaft.',
              points: ['Team per Code beitreten', 'Mitglieder & Rollen verwalten', 'Gemeinsamer Überblick'] },
          ].map((r) => (
            <div key={r.title} className="bg-white rounded-3xl border border-slate-200/70 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4" style={{ background: ACCENT + '22' }}>
                <r.icon size={22} style={{ color: ACCENT }} />
              </div>
              <h3 className="font-semibold text-[18px] mb-1.5">{r.title}</h3>
              <p className="text-[14px] text-slate-600 leading-relaxed">{r.text}</p>
              <ul className="mt-4 space-y-2">
                {r.points.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-[13.5px] text-slate-700">
                    <Check size={16} className="mt-0.5 shrink-0" style={{ color: ACCENT }} /> {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-start gap-3 bg-slate-50 rounded-2xl border border-slate-200/70 p-5">
          <ShieldCheck size={22} className="shrink-0" style={{ color: ACCENT }} />
          <div>
            <div className="font-semibold text-[15px]">Feine Rechte-Kontrolle & Papierkorb</div>
            <p className="text-[14px] text-slate-600 leading-relaxed mt-0.5">
              Jeder Sportler legt pro Trainer fest, ob dieser nur eintragen oder auch bearbeiten und löschen darf
              („Volle Rechte"). Gelöschtes landet 30 Tage im Papierkorb und lässt sich jederzeit wiederherstellen.
            </p>
          </div>
        </div>
      </Section>

      <div className="bg-slate-900 text-white">
        <Section className="py-16 text-center">
          <h2 className="text-[28px] sm:text-[34px] font-bold tracking-tight">Bereit loszulegen?</h2>
          <p className="mt-3 text-white/70 max-w-xl mx-auto">Im Browser sofort starten oder die iOS-App holen.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a href="/web" className="px-6 py-3 rounded-full font-semibold text-white active:scale-95 transition" style={{ background: ACCENT }}>Web-App öffnen</a>
            <a href={APP_STORE_URL} target="_blank" rel="noreferrer" className="px-6 py-3 rounded-full font-semibold bg-white/10 hover:bg-white/15 transition">Im App Store</a>
          </div>
        </Section>
      </div>
    </>
  );
}

// ---- Funktionen ----------------------------------------------------------
function Funktionen() {
  return (
    <Section className="py-14 max-w-3xl">
      <h1 className="text-[34px] font-bold tracking-tight mb-8">Funktionen</h1>
      <div className="space-y-7">
        {FEATURES.map((f, i) => (
          <div key={i} className="flex gap-4">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0" style={{ background: ACCENT + '22' }}>
              <f.icon size={22} style={{ color: ACCENT }} />
            </div>
            <div>
              <h3 className="font-semibold text-[18px]">{f.title}</h3>
              <p className="text-[15px] text-slate-600 leading-relaxed mt-1">{f.text}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-10 flex items-center gap-3 text-[14px] text-slate-500">
        <ShieldCheck size={18} style={{ color: ACCENT }} /> Daten sicher in der Cloud · <Globe size={16} /> Web & iOS synchron
      </div>
    </Section>
  );
}

// ---- FAQ -----------------------------------------------------------------
const FAQS = [
  { q: 'Was ist ArtCyc?', a: 'Ein Coaching-Tool speziell für Kunstradsport: Training protokollieren, Wettkampf-Wertungsbögen auswerten und den Fortschritt von Sportlern verfolgen.' },
  { q: 'Brauche ich die App oder reicht der Browser?', a: 'Beides geht. Die Web-App läuft im Browser unter artcyc.app/web. Die iOS-App bietet zusätzlich Foto-Scan und Push-Erinnerungen.' },
  { q: 'Was kostet ArtCyc?', a: 'Aktuell befindet sich ArtCyc im Aufbau. Details zu Preisen folgen.' },
  { q: 'Wie lade ich Sportler oder Co-Trainer ein?', a: 'In der App über einen Einlade-Code: Du erstellst pro Sportler bzw. Trainer einen Code, der einmalig eingelöst wird.' },
  { q: 'Können mehrere Trainer denselben Sportler betreuen?', a: 'Ja. Ein Sportler kann mehrere (Co-)Trainer freischalten — alle sehen dieselben Daten in Echtzeit. Jeder Sportler legt dabei pro Trainer fest, ob dieser nur eintragen oder auch bearbeiten und löschen darf.' },
  { q: 'Gibt es eine Team-/Vereinsfunktion?', a: 'Ja. Sportler und Trainer lassen sich in Teams bündeln; neue Mitglieder treten per Beitritts-Code bei. So behält ein Verein alle Aktiven an einem Ort im Blick.' },
  { q: 'Sind meine Daten sicher?', a: 'Die Daten liegen verschlüsselt in der Cloud. Nur du und die von dir freigegebenen Trainer haben Zugriff.' },
  { q: 'Funktioniert der Wertungsbogen-Scan zuverlässig?', a: 'Die Erkennung prüft sich selbst gegen die Prüfsumme des Bogens und liest bei Bedarf nach, um Abzüge und Endergebnis korrekt zu übernehmen.' },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-200/70">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between gap-4 py-4 text-left">
        <span className="font-medium text-[16px]">{q}</span>
        <ChevronRight size={18} className={cx('shrink-0 text-slate-400 transition-transform', open && 'rotate-90')} />
      </button>
      {open && <p className="pb-4 text-[15px] text-slate-600 leading-relaxed">{a}</p>}
    </div>
  );
}

function FAQ() {
  return (
    <Section className="py-14 max-w-3xl">
      <h1 className="text-[34px] font-bold tracking-tight mb-6">Häufige Fragen</h1>
      <div>{FAQS.map((f, i) => <FAQItem key={i} {...f} />)}</div>
    </Section>
  );
}

// ---- Kontakt -------------------------------------------------------------
function Kontakt() {
  return (
    <Section className="py-14 max-w-3xl">
      <h1 className="text-[34px] font-bold tracking-tight mb-4">Kontakt</h1>
      <p className="text-[16px] text-slate-600 leading-relaxed">
        Fragen, Feedback oder Wünsche? Am schnellsten direkt aus der App über
        <span className="font-medium"> Einstellungen → Feedback</span> — das landet sofort beim Entwickler.
      </p>
      <div className="mt-6 bg-white rounded-3xl border border-slate-200/70 p-6">
        <div className="text-[13px] uppercase tracking-wide text-slate-400 font-medium mb-2">E-Mail</div>
        <a href="mailto:info@artcyc.app" className="text-[16px] font-medium" style={{ color: ACCENT }}>info@artcyc.app</a>
      </div>
    </Section>
  );
}

// ---- Impressum ----------------------------------------------------------
function Impressum() {
  return (
    <Section className="py-14 max-w-3xl">
      <h1 className="text-[34px] font-bold tracking-tight mb-6">Impressum</h1>
      <div className="space-y-5 text-[15px] text-slate-700 leading-relaxed">
        <div>
          <div className="font-semibold">Angaben gemäß § 5 DDG</div>
          <p>Rad- und Kraftfahrerverein Denkendorf 1909 e.&nbsp;V.<br />
            Löcherhaldenstraße 36<br />
            73770 Denkendorf</p>
        </div>
        <div>
          <div className="font-semibold">Vertreten durch den Vorstand</div>
          <p>Hermann Alber (1. Vorsitzender)<br />
            Dagmar Staudinger (stellvertretende Vorsitzende)<br />
            Jasmin Wörner (Vorstand Finanzen)</p>
        </div>
        <div>
          <div className="font-semibold">Registereintrag</div>
          <p>Vereinsregister – Amtsgericht Stuttgart<br />Registernummer: VR 210271</p>
        </div>
        <div>
          <div className="font-semibold">Kontakt</div>
          <p>E-Mail: info@artcyc.app<br />Telefon: +49 160 8280306</p>
        </div>
        <div>
          <div className="font-semibold">Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</div>
          <p>Hermann Alber, Anschrift wie oben</p>
        </div>
        <div>
          <div className="font-semibold">Haftung für Inhalte &amp; Links</div>
          <p>Für eigene Inhalte auf diesen Seiten sind wir nach den allgemeinen Gesetzen verantwortlich. Für Inhalte externer Links sind ausschließlich deren Betreiber verantwortlich; zum Zeitpunkt der Verlinkung waren keine Rechtsverstöße erkennbar.</p>
        </div>
      </div>
    </Section>
  );
}

// ---- Datenschutz (Vorlage) ----------------------------------------------
function Datenschutz() {
  return (
    <Section className="py-14 max-w-3xl">
      <h1 className="text-[34px] font-bold tracking-tight mb-6">Datenschutzerklärung</h1>
      <div className="space-y-5 text-[15px] text-slate-700 leading-relaxed">
        <div><div className="font-semibold">1. Verantwortlicher</div><p>Rad- und Kraftfahrerverein Denkendorf 1909 e.&nbsp;V., Löcherhaldenstraße 36, 73770 Denkendorf. Kontakt: info@artcyc.app (weitere Angaben im Impressum).</p></div>
        <div><div className="font-semibold">2. Welche Daten wir verarbeiten</div><p>Konto-Daten (Name, E-Mail) sowie die von dir eingegebenen Trainings-, Wettkampf- und Sportlerdaten. Diese sind nötig, um die App-Funktionen bereitzustellen.</p></div>
        <div><div className="font-semibold">3. Hosting & Speicherung</div><p>Die App wird über Vercel ausgeliefert; Daten werden bei Supabase (Rechenzentrum EU) gespeichert. Mit diesen Anbietern bestehen Verträge zur Auftragsverarbeitung.</p></div>
        <div><div className="font-semibold">4. Wertungsbogen-Scan (KI)</div><p>Nutzt du die optionale Scan-Funktion, wird das aufgenommene Foto des Wertungsbogens zur automatischen Texterkennung an den KI-Dienst Google Gemini (Google, auch USA) übertragen und dort verarbeitet. Die Funktion ist freiwillig; Rechtsgrundlage ist deine Einwilligung bzw. die Vertragserfüllung (Art. 6 Abs. 1 lit. a/b DSGVO). Ohne Nutzung des Scans findet diese Übermittlung nicht statt.</p></div>
        <div><div className="font-semibold">5. Zweck & Rechtsgrundlage</div><p>Die Verarbeitung erfolgt zur Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO) bzw. auf Grundlage deiner Einwilligung.</p></div>
        <div><div className="font-semibold">6. Deine Rechte</div><p>Du hast das Recht auf Auskunft, Berichtigung, Löschung und Datenübertragbarkeit. Konto und Daten kannst du jederzeit in der App löschen (Einstellungen → Konto löschen).</p></div>
        <div><div className="font-semibold">7. Kontakt</div><p>Bei Datenschutz-Fragen: info@artcyc.app.</p></div>
      </div>
    </Section>
  );
}

// ---- Footer --------------------------------------------------------------
function Footer() {
  return (
    <footer className="border-t border-slate-200/70 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col sm:flex-row gap-6 justify-between">
        <div>
          <div className="flex items-center gap-2 font-bold text-[16px]">
            <span className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#0F172A' }}>
              <Trophy size={15} style={{ color: ACCENT }} />
            </span>
            ArtCyc
          </div>
          <p className="text-[13px] text-slate-500 mt-2 max-w-xs">Coaching-Tool für Kunstradsport — Web & iOS.</p>
        </div>
        <div className="flex flex-col gap-1.5 text-[14px]">
          <a href="/funktionen" className="text-slate-600 hover:text-slate-900">Funktionen</a>
          <a href="/faq" className="text-slate-600 hover:text-slate-900">FAQ</a>
          <a href="/kontakt" className="text-slate-600 hover:text-slate-900">Kontakt</a>
          <a href="/web" className="text-slate-600 hover:text-slate-900">Zur Web-App</a>
        </div>
        <div className="flex flex-col gap-1.5 text-[14px]">
          <a href="/impressum" className="text-slate-600 hover:text-slate-900">Impressum</a>
          <a href="/datenschutz" className="text-slate-600 hover:text-slate-900">Datenschutz</a>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 pb-8 text-[12px] text-slate-400">© {new Date().getFullYear()} ArtCyc</div>
    </footer>
  );
}

const PAGES = {
  '/': Home, '/funktionen': Funktionen, '/faq': FAQ,
  '/kontakt': Kontakt, '/impressum': Impressum, '/datenschutz': Datenschutz,
};

export default function Landing() {
  const path = (typeof window !== 'undefined' ? window.location.pathname : '/').replace(/\/+$/, '') || '/';
  const Page = PAGES[path] || Home;

  // Dark Mode: der App-Bereich setzt html[data-theme] selbst — die Landingpage
  // nicht. Deshalb hier spiegeln: folgt dem System (prefers-color-scheme) bzw.
  // einer im App gesetzten Theme-Präferenz (localStorage 'artcyc:theme').
  // Die vorhandenen Dark-Regeln in index.css greifen dann automatisch.
  useEffect(() => {
    const KEY = 'artcyc:theme'; // identisch zu THEME_KEY in ArtCycCoach.jsx
    const apply = () => {
      let pref = 'system';
      try { const v = localStorage.getItem(KEY); if (v === 'light' || v === 'dark') pref = v; } catch { /* ignore */ }
      const dark = pref === 'dark'
        || (pref === 'system' && typeof window.matchMedia === 'function'
            && window.matchMedia('(prefers-color-scheme: dark)').matches);
      document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    };
    apply();
    const mq = typeof window.matchMedia === 'function' ? window.matchMedia('(prefers-color-scheme: dark)') : null;
    if (mq?.addEventListener) { mq.addEventListener('change', apply); return () => mq.removeEventListener('change', apply); }
    if (mq?.addListener) { mq.addListener(apply); return () => mq.removeListener(apply); }
  }, []);
  return (
    <div className="min-h-screen bg-white text-slate-900" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}>
      <AppBanner />
      <Header path={path} />
      <main><Page /></main>
      <Footer />
    </div>
  );
}
