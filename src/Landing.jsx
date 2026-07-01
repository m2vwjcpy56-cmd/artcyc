import React, { useState } from 'react';
import {
  Trophy, ClipboardList, ScanLine, BarChart3, Users, ListChecks,
  Check, ChevronRight, X, Menu, Smartphone, ShieldCheck, Globe,
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
          <div className="text-[11px] text-white/60 leading-tight truncate">Kunstrad-Coaching für iPhone</div>
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
  { icon: Trophy, title: 'Wettkämpfe & Maute', text: 'Wettkämpfe erfassen, taktische Aufwertungen, und Export im Maute-Statistik-Format.' },
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
          Fortschritt sehen — auf dem iPhone und im Web.
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
        <p className="mt-3 text-[12px] text-slate-400">iPhone-App derzeit in der Beta (TestFlight) — App-Store-Release in Kürze.</p>
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

      <div className="bg-slate-900 text-white">
        <Section className="py-16 text-center">
          <h2 className="text-[28px] sm:text-[34px] font-bold tracking-tight">Bereit loszulegen?</h2>
          <p className="mt-3 text-white/70 max-w-xl mx-auto">Im Browser sofort starten oder die iPhone-App holen.</p>
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
        <ShieldCheck size={18} style={{ color: ACCENT }} /> Daten sicher in der Cloud · <Globe size={16} /> Web & iPhone synchron
      </div>
    </Section>
  );
}

// ---- FAQ -----------------------------------------------------------------
const FAQS = [
  { q: 'Was ist ArtCyc?', a: 'Ein Coaching-Tool speziell für Kunstradsport: Training protokollieren, Wettkampf-Wertungsbögen auswerten und den Fortschritt von Sportlern verfolgen.' },
  { q: 'Brauche ich die App oder reicht der Browser?', a: 'Beides geht. Die Web-App läuft im Browser unter artcyc.app/web. Die iPhone-App bietet zusätzlich Foto-Scan und Push-Erinnerungen.' },
  { q: 'Was kostet ArtCyc?', a: 'Aktuell befindet sich ArtCyc im Aufbau. Details zu Preisen folgen.' },
  { q: 'Wie lade ich Sportler oder Co-Trainer ein?', a: 'In der App über einen Einlade-Code: Du erstellst pro Sportler bzw. Trainer einen Code, der einmalig eingelöst wird.' },
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
        {/* PLATZHALTER — durch echte Kontakt-Adresse ersetzen */}
        <div className="text-[16px] font-medium">kontakt@artcyc.app <span className="text-[12px] text-amber-600">(Platzhalter)</span></div>
      </div>
    </Section>
  );
}

// ---- Impressum (PLATZHALTER) --------------------------------------------
function Impressum() {
  return (
    <Section className="py-14 max-w-3xl">
      <h1 className="text-[34px] font-bold tracking-tight mb-6">Impressum</h1>
      <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl p-4 text-[14px] mb-6">
        ⚠️ Platzhalter — vor Veröffentlichung mit den gesetzlich erforderlichen Angaben (§ 5 DDG) füllen:
        ladungsfähige Anschrift, Name, Kontakt. Eine reine Postfach-/Fantasieadresse genügt rechtlich nicht.
      </div>
      <div className="space-y-4 text-[15px] text-slate-700 leading-relaxed">
        <div>
          <div className="font-semibold">Angaben gemäß § 5 DDG</div>
          <p>[Name / Verantwortliche Person]<br />[Straße &amp; Hausnummer]<br />[PLZ Ort]</p>
        </div>
        <div>
          <div className="font-semibold">Kontakt</div>
          <p>E-Mail: [kontakt@artcyc.app]</p>
        </div>
        <div>
          <div className="font-semibold">Verantwortlich für den Inhalt</div>
          <p>[Name]</p>
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
      <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl p-4 text-[14px] mb-6">
        ⚠️ Vorlage — bitte vor Veröffentlichung prüfen/ergänzen (Verantwortlicher, konkrete Dienste, Aufbewahrung).
      </div>
      <div className="space-y-5 text-[15px] text-slate-700 leading-relaxed">
        <div><div className="font-semibold">1. Verantwortlicher</div><p>Siehe Impressum.</p></div>
        <div><div className="font-semibold">2. Welche Daten wir verarbeiten</div><p>Konto-Daten (Name, E-Mail), sowie die von dir eingegebenen Trainings-, Wettkampf- und Sportlerdaten. Diese sind nötig, um die App-Funktionen bereitzustellen.</p></div>
        <div><div className="font-semibold">3. Hosting & Speicherung</div><p>Die App wird über Vercel ausgeliefert; Daten werden bei Supabase (EU) gespeichert. Mit diesen Anbietern bestehen entsprechende Verträge zur Auftragsverarbeitung.</p></div>
        <div><div className="font-semibold">4. Zweck & Rechtsgrundlage</div><p>Die Verarbeitung erfolgt zur Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO) bzw. auf Grundlage deiner Einwilligung.</p></div>
        <div><div className="font-semibold">5. Deine Rechte</div><p>Du hast das Recht auf Auskunft, Berichtigung, Löschung und Datenübertragbarkeit. Konto und Daten können in der App gelöscht werden.</p></div>
        <div><div className="font-semibold">6. Kontakt</div><p>Bei Datenschutz-Fragen: siehe Impressum/Kontakt.</p></div>
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
          <p className="text-[13px] text-slate-500 mt-2 max-w-xs">Coaching-Tool für Kunstradsport — Web & iPhone.</p>
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
  return (
    <div className="min-h-screen bg-white text-slate-900" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}>
      <AppBanner />
      <Header path={path} />
      <main><Page /></main>
      <Footer />
    </div>
  );
}
