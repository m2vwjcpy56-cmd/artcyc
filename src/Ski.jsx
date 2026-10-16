import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { ArrowLeft, ArrowRight, Check, ThumbsUp, Share2, RefreshCw, Pencil, Trophy } from 'lucide-react';
import { supabase } from './lib/supabase.js';
import { SKI_TRIP } from './ski/config.js';

// =============================================================
// Ski-Planung — Fragebogen-Website unter /ski (kein Login, kein App-Look).
// Eine Frage pro Bildschirm, große Antwort-Kacheln, automatisch weiter,
// am Ende die Ergebnis-Seite. Inhalte: src/ski/config.js.
// Daten: Supabase ski_votes (eine Zeile pro Person + Frage) und
// ski_suggestions (Vorschläge, Daumen hoch läuft über ski_votes 'likes').
// =============================================================

const NAME_KEY = 'artcyc:ski:name';
const DEVICE_KEY = 'artcyc:ski:device';
const DONE_KEY = 'artcyc:ski:done';
const LIKES_POLL = 'likes';

function lsGet(k) { try { return localStorage.getItem(k); } catch { return null; } }
function lsSet(k, v) { try { localStorage.setItem(k, v); } catch { /* privater Modus */ } }
function deviceId() {
  let d = lsGet(DEVICE_KEY);
  if (!d) {
    d = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID()
      : Math.random().toString(36).slice(2) + Date.now().toString(36);
    lsSet(DEVICE_KEY, d);
  }
  return d;
}
function nameKey(n) { return (n || '').trim().toLowerCase(); }
function cx(...a) { return a.filter(Boolean).join(' '); }

// Eigene Styles — bewusst unabhängig von index.css/Dark-Mode-Overrides der App.
const CSS = `
.ski-root{min-height:100dvh;background:#0B1F3A;background-image:radial-gradient(1200px 600px at 10% -10%,#2C6BD1 0%,rgba(44,107,209,0) 60%),radial-gradient(900px 500px at 110% 110%,#1FA2A8 0%,rgba(31,162,168,0) 55%);color:#fff;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Inter",system-ui,sans-serif;-webkit-font-smoothing:antialiased}
.ski-wrap{max-width:560px;margin:0 auto;padding:0 20px calc(28px + env(safe-area-inset-bottom));min-height:100dvh;display:flex;flex-direction:column}
.ski-top{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:calc(16px + env(safe-area-inset-top)) 0 10px;font-size:13px;color:rgba(255,255,255,.65)}
.ski-prog{height:4px;border-radius:999px;background:rgba(255,255,255,.15);overflow:hidden}
.ski-prog>i{display:block;height:100%;border-radius:999px;background:#fff;transition:width .35s cubic-bezier(.2,.8,.2,1)}
.ski-step{flex:1;display:flex;flex-direction:column;justify-content:center;padding:24px 0;animation:ski-in .32s cubic-bezier(.2,.8,.2,1) both}
@keyframes ski-in{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
.ski-h1{font-size:34px;line-height:1.08;font-weight:800;letter-spacing:-.02em;margin:0}
.ski-h2{font-size:28px;line-height:1.12;font-weight:800;letter-spacing:-.02em;margin:0}
.ski-sub{font-size:17px;line-height:1.4;color:rgba(255,255,255,.75);margin:10px 0 0}
.ski-opts{display:flex;flex-direction:column;gap:10px;margin-top:28px}
.ski-opt{display:flex;align-items:center;gap:14px;width:100%;text-align:left;padding:16px 18px;border-radius:18px;border:1.5px solid rgba(255,255,255,.18);background:rgba(255,255,255,.08);color:#fff;font-size:18px;font-weight:600;line-height:1.2;transition:transform .12s,background .15s,border-color .15s;-webkit-tap-highlight-color:transparent}
.ski-opt:active{transform:scale(.98)}
.ski-opt.on{background:#fff;color:#0B1F3A;border-color:#fff}
.ski-opt .e{font-size:24px;width:32px;text-align:center;flex-shrink:0}
.ski-opt .s{display:block;font-size:14px;font-weight:400;opacity:.7;margin-top:2px}
.ski-opt .k{margin-left:auto;width:26px;height:26px;border-radius:999px;display:flex;align-items:center;justify-content:center;background:#0B1F3A;color:#fff;flex-shrink:0}
.ski-input{width:100%;margin-top:28px;padding:16px 18px;border-radius:18px;border:1.5px solid rgba(255,255,255,.25);background:rgba(255,255,255,.1);color:#fff;font-size:22px;font-weight:600;outline:none}
.ski-input::placeholder{color:rgba(255,255,255,.4);font-weight:500}
.ski-input:focus{border-color:#fff;background:rgba(255,255,255,.14)}
.ski-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:16px 24px;border-radius:999px;background:#fff;color:#0B1F3A;font-size:17px;font-weight:700;border:0;transition:transform .12s,opacity .15s;-webkit-tap-highlight-color:transparent}
.ski-btn:active{transform:scale(.97)}
.ski-btn:disabled{opacity:.35}
.ski-btn.ghost{background:transparent;color:rgba(255,255,255,.8);border:1.5px solid rgba(255,255,255,.3)}
.ski-promo{display:block;text-decoration:none;color:#fff;margin-top:28px;border-radius:22px;padding:20px;background:linear-gradient(135deg,rgba(255,149,0,.22),rgba(255,149,0,.06));border:1px solid rgba(255,149,0,.45);transition:transform .12s;-webkit-tap-highlight-color:transparent}
.ski-promo:active{transform:scale(.98)}
.ski-promo .ic{width:44px;height:44px;border-radius:13px;background:#0F172A;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.ski-promo .cta{display:inline-flex;align-items:center;gap:6px;margin-top:14px;padding:11px 18px;border-radius:999px;background:#FF9500;color:#fff;font-size:15px;font-weight:700}
.ski-link{background:none;border:0;color:rgba(255,255,255,.7);font-size:15px;padding:10px 0;display:inline-flex;align-items:center;gap:6px}
.ski-card{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.14);border-radius:20px;padding:16px 18px;margin-top:14px}
.ski-card h3{margin:0 0 10px;font-size:13px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:rgba(255,255,255,.6)}
.ski-bar{height:10px;border-radius:999px;background:rgba(255,255,255,.12);overflow:hidden;margin-top:6px}
.ski-bar>i{display:block;height:100%;border-radius:999px;background:#fff;transition:width .4s}
.ski-bar.g>i{background:#4ADE80}.ski-bar.y>i{background:#FBBF24}.ski-bar.r>i{background:#F87171}
.ski-names{font-size:13px;color:rgba(255,255,255,.6);margin-top:4px;line-height:1.35}
.ski-row{display:flex;align-items:baseline;justify-content:space-between;gap:10px;font-size:16px;font-weight:600}
.ski-row small{font-size:14px;font-weight:500;color:rgba(255,255,255,.7)}
.ski-fav{font-size:11px;font-weight:700;padding:3px 8px;border-radius:999px;background:#4ADE80;color:#0B1F3A;margin-left:8px;vertical-align:middle}
.ski-like{display:inline-flex;align-items:center;gap:6px;padding:8px 12px;border-radius:999px;border:1.5px solid rgba(255,255,255,.25);background:transparent;color:#fff;font-size:14px;font-weight:700;flex-shrink:0}
.ski-like.on{background:#fff;color:#0B1F3A;border-color:#fff}
.ski-note{background:rgba(251,191,36,.15);border:1px solid rgba(251,191,36,.4);border-radius:16px;padding:12px 14px;font-size:14px;line-height:1.4;margin-top:16px}
.ski-note code{font-family:ui-monospace,Menlo,monospace;font-size:12px}
.ski-table{width:100%;border-collapse:collapse;font-size:14px;margin-top:4px}
.ski-table th{text-align:left;font-weight:500;color:rgba(255,255,255,.55);padding:6px 6px 8px 0;white-space:nowrap}
.ski-table td{padding:8px 6px 8px 0;border-top:1px solid rgba(255,255,255,.1);white-space:nowrap}
.ski-table th:not(:first-child),.ski-table td:not(:first-child){text-align:center;padding-left:6px}
.ski-scroll{overflow-x:auto;margin:0 -18px;padding:0 18px}
`;

// ---- Bildschirme -----------------------------------------------------------
function Welcome({ trip, onStart, known }) {
  const w = trip.welcome;
  return (
    <div className="ski-step">
      <div style={{ fontSize: 56, lineHeight: 1 }}>⛷️</div>
      <div style={{ fontSize: 13, letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,.6)', marginTop: 24, fontWeight: 600 }}>{trip.title} · {trip.tagline}</div>
      <h1 className="ski-h1" style={{ marginTop: 8 }}>{w.headline}</h1>
      <p className="ski-sub">{w.text}</p>
      <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button className="ski-btn" onClick={() => onStart(false)}>{w.button} <ArrowRight size={18} strokeWidth={2.6} /></button>
        {known && <button className="ski-link" style={{ justifyContent: 'center' }} onClick={() => onStart(true)}>Direkt zu den Ergebnissen</button>}
      </div>
    </div>
  );
}

function NameStep({ q, value, onChange, onNext }) {
  const ref = useRef(null);
  useEffect(() => { const t = setTimeout(() => ref.current?.focus(), 350); return () => clearTimeout(t); }, []);
  const ok = value.trim().length > 0;
  return (
    <form className="ski-step" onSubmit={e => { e.preventDefault(); if (ok) onNext(); }}>
      <h2 className="ski-h2">{q.title}</h2>
      {q.sub && <p className="ski-sub">{q.sub}</p>}
      <input ref={ref} className="ski-input" value={value} onChange={e => onChange(e.target.value)}
        placeholder="Dein Vorname" autoComplete="given-name" autoCapitalize="words" enterKeyHint="next" maxLength={40} />
      <div style={{ marginTop: 20 }}>
        <button type="submit" className="ski-btn" disabled={!ok} style={{ width: '100%' }}>Weiter <ArrowRight size={18} strokeWidth={2.6} /></button>
      </div>
    </form>
  );
}

function ChoiceStep({ q, value, onPick }) {
  const [flash, setFlash] = useState(null);
  const pick = (id) => {
    setFlash(id);
    setTimeout(() => onPick(id), 260);   // kurze Bestätigung, dann automatisch weiter
  };
  const cur = flash || value;
  return (
    <div className="ski-step">
      <h2 className="ski-h2">{q.title}</h2>
      {q.sub && <p className="ski-sub">{q.sub}</p>}
      <div className="ski-opts">
        {q.options.map(o => (
          <button key={o.id} type="button" className={cx('ski-opt', cur === o.id && 'on')} onClick={() => pick(o.id)}>
            {o.emoji && <span className="e">{o.emoji}</span>}
            <span>{o.label}{o.sub && <span className="s">{o.sub}</span>}</span>
            {cur === o.id && <span className="k"><Check size={15} strokeWidth={3} /></span>}
          </button>
        ))}
      </div>
    </div>
  );
}

function TextStep({ q, value, onChange, onNext }) {
  return (
    <form className="ski-step" onSubmit={e => { e.preventDefault(); onNext(); }}>
      <h2 className="ski-h2">{q.title}</h2>
      {q.sub && <p className="ski-sub">{q.sub}</p>}
      <input className="ski-input" value={value} onChange={e => onChange(e.target.value)} placeholder={q.placeholder} maxLength={120} enterKeyHint="done" />
      <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button type="submit" className="ski-btn" style={{ width: '100%' }}>
          {value.trim() ? 'Abschicken' : 'Ohne Vorschlag abschicken'} <Check size={18} strokeWidth={2.6} />
        </button>
      </div>
    </form>
  );
}

function Results({ trip, name, votes, suggestions, myKey, dev, onLike, onEdit, onShare, copied, status, onReload }) {
  const qs = trip.questions;
  const r = trip.results;
  const byQ = (qid) => votes.filter(v => v.poll_id === qid);
  const nameOf = (v) => v.name;
  const people = useMemo(() => {
    const m = new Map();
    for (const v of votes) if (v.poll_id !== LIKES_POLL && !m.has(v.name_key)) m.set(v.name_key, v.name);
    return Array.from(m.entries()).map(([k, n]) => ({ k, n })).sort((a, b) => a.n.localeCompare(b.n, 'de'));
  }, [votes]);
  const answerOf = (k, qid) => votes.find(v => v.name_key === k && v.poll_id === qid)?.answers?.value;

  // Terminvergleich
  const weekends = (r.weekends || []).map(qid => {
    const q = qs.find(x => x.id === qid);
    const vs = byQ(qid);
    const yes = vs.filter(v => v.answers?.value === 'yes').map(nameOf);
    const maybe = vs.filter(v => v.answers?.value === 'maybe').map(nameOf);
    const no = vs.filter(v => v.answers?.value === 'no').map(nameOf);
    return { qid, label: r.weekendLabels?.[qid] || q?.title || qid, yes, maybe, no, total: vs.length };
  });
  const maxYes = Math.max(0, ...weekends.map(w => w.yes.length));

  // Einfache Auswahlfragen (ohne Termin, ohne Name/Text)
  const choices = qs.filter(q => q.type === 'choice' && q.kind !== 'availability');
  const likes = useMemo(() => {
    const m = {};
    for (const v of votes) if (v.poll_id === LIKES_POLL) for (const id of (v.answers?.selected || [])) (m[id] ||= []).push({ name: v.name, mine: v.name_key === myKey });
    return m;
  }, [votes, myKey]);
  const sortedSug = [...suggestions].sort((a, b) => (likes[b.id]?.length || 0) - (likes[a.id]?.length || 0) || a.created_at.localeCompare(b.created_at));
  const overviewCols = [...choices.filter(q => q.id === 'dabei'), ...qs.filter(q => q.kind === 'availability'), ...choices.filter(q => q.id !== 'dabei')];
  const shortOf = (q, val) => q.options.find(o => o.id === val)?.short ?? (val ? '•' : '–');
  const tone = (q, val) => q.kind === 'availability' || q.id === 'dabei'
    ? (val === 'yes' || val === 'ja' ? '#4ADE80' : val === 'maybe' || val === 'vielleicht' ? '#FBBF24' : val === 'no' || val === 'nein' ? '#F87171' : 'rgba(255,255,255,.35)')
    : (val ? '#fff' : 'rgba(255,255,255,.35)');

  return (
    <div className="ski-step" style={{ justifyContent: 'flex-start' }}>
      <h2 className="ski-h2">{name.trim() ? (r.thanks || 'Danke, {name}!').replace('{name}', name.trim()) + ' 🙌' : 'Zwischenstand'}</h2>
      <p className="ski-sub">{r.text}</p>

      {status === 'error' && (
        <div className="ski-note">Verbindung fehlgeschlagen. <button className="ski-link" style={{ padding: 0 }} onClick={onReload}><RefreshCw size={14} /> Neu laden</button></div>
      )}

      {/* Dabei */}
      {choices.filter(q => q.id === 'dabei').map(q => {
        const vs = byQ(q.id);
        return (
          <div className="ski-card" key={q.id}>
            <h3>Wer ist dabei · {vs.length} {vs.length === 1 ? 'Antwort' : 'Antworten'}</h3>
            {q.options.map((o, i) => {
              const ns = vs.filter(v => v.answers?.value === o.id).map(nameOf);
              const pct = vs.length ? Math.round(ns.length / vs.length * 100) : 0;
              return (
                <div key={o.id} style={{ marginTop: i ? 12 : 0 }}>
                  <div className="ski-row"><span>{o.emoji} {o.label}</span><small>{ns.length}</small></div>
                  <div className={cx('ski-bar', i === 0 ? 'g' : i === 1 ? 'y' : 'r')}><i style={{ width: pct + '%' }} /></div>
                  {ns.length > 0 && <div className="ski-names">{ns.join(', ')}</div>}
                </div>
              );
            })}
          </div>
        );
      })}

      {/* Termine */}
      {weekends.length > 0 && (
        <div className="ski-card">
          <h3>Welches Wochenende</h3>
          {weekends.map((w, i) => {
            const pct = w.total ? Math.round(w.yes.length / w.total * 100) : 0;
            const fav = maxYes > 0 && w.yes.length === maxYes;
            return (
              <div key={w.qid} style={{ marginTop: i ? 14 : 0 }}>
                <div className="ski-row">
                  <span>{w.label}{fav && <span className="ski-fav">Favorit</span>}</span>
                  <small><b style={{ color: '#4ADE80' }}>{w.yes.length}</b> passt · <b style={{ color: '#FBBF24' }}>{w.maybe.length}</b> vielleicht · <b style={{ color: '#F87171' }}>{w.no.length}</b> nicht</small>
                </div>
                <div className="ski-bar g"><i style={{ width: pct + '%' }} /></div>
                {(w.yes.length + w.maybe.length) > 0 && (
                  <div className="ski-names">{w.yes.length > 0 && <>✓ {w.yes.join(', ')}</>}{w.yes.length > 0 && w.maybe.length > 0 && ' · '}{w.maybe.length > 0 && <>? {w.maybe.join(', ')}</>}</div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Weitere Auswahlfragen */}
      {choices.filter(q => q.id !== 'dabei').map(q => {
        const vs = byQ(q.id);
        return (
          <div className="ski-card" key={q.id}>
            <h3>{q.title}</h3>
            {q.options.map((o, i) => {
              const ns = vs.filter(v => v.answers?.value === o.id).map(nameOf);
              const pct = vs.length ? Math.round(ns.length / vs.length * 100) : 0;
              return (
                <div key={o.id} style={{ marginTop: i ? 12 : 0 }}>
                  <div className="ski-row"><span>{o.label}</span><small>{ns.length}</small></div>
                  <div className="ski-bar"><i style={{ width: pct + '%' }} /></div>
                  {ns.length > 0 && <div className="ski-names">{ns.join(', ')}</div>}
                </div>
              );
            })}
          </div>
        );
      })}

      {/* Vorschläge */}
      <div className="ski-card">
        <h3>Vorschläge Skigebiet & Unterkunft</h3>
        {sortedSug.length === 0 && <div style={{ fontSize: 15, color: 'rgba(255,255,255,.6)' }}>Noch keine Vorschläge.</div>}
        {sortedSug.map((s, i) => {
          const l = likes[s.id] || [];
          const on = l.some(x => x.mine);
          return (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: i ? 12 : 0 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 16, fontWeight: 600 }}>{s.text}</div>
                <div className="ski-names">von {s.name}{l.length > 0 && <> · 👍 {l.map(x => x.name).join(', ')}</>}</div>
              </div>
              <button type="button" className={cx('ski-like', on && 'on')} onClick={() => onLike(s.id)} aria-label="Daumen hoch">
                <ThumbsUp size={15} strokeWidth={2.4} /> {l.length}
              </button>
            </div>
          );
        })}
      </div>

      {/* Übersicht */}
      {people.length > 0 && (
        <div className="ski-card">
          <h3>Alle Antworten</h3>
          <div className="ski-scroll">
            <table className="ski-table">
              <thead><tr><th>Name</th>{overviewCols.map(q => <th key={q.id}>{q.short || q.title}</th>)}</tr></thead>
              <tbody>
                {people.map(p => (
                  <tr key={p.k}>
                    <td style={{ fontWeight: 600 }}>{p.n}</td>
                    {overviewCols.map(q => { const v = answerOf(p.k, q.id); return <td key={q.id} style={{ color: tone(q, v), fontWeight: 700 }}>{shortOf(q, v)}</td>; })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button className="ski-btn ghost" onClick={onEdit}><Pencil size={16} /> Meine Antworten ändern</button>
        <button className="ski-btn ghost" onClick={onShare}>{copied ? <Check size={16} /> : <Share2 size={16} />} {copied ? 'Link kopiert' : 'Link teilen'}</button>
      </div>
      {/* Hinweis auf ArtCyc — Zusammenfassung bleibt oben stehen, Link führt zur Homepage */}
      <a className="ski-promo" href="/">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="ic"><Trophy size={22} color="#FF9500" /></span>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: '#FFB340' }}>Gebaut mit ArtCyc</div>
            <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: '-.01em', marginTop: 2 }}>Entdecke die ArtCyc App</div>
          </div>
        </div>
        <div style={{ fontSize: 15, lineHeight: 1.4, color: 'rgba(255,255,255,.78)', marginTop: 10 }}>
          Das Coaching-Tool für Kunstradsport: Training protokollieren, Wertungsbögen scannen, Fortschritt sehen. Für iOS und im Browser.
        </div>
        <span className="cta">Zur ArtCyc-Website <ArrowRight size={16} strokeWidth={2.6} /></span>
      </a>

      <div style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,.35)', marginTop: 24 }}>Aktualisiert sich automatisch</div>
    </div>
  );
}

// ---- Seite ----------------------------------------------------------------
export default function Ski() {
  const trip = SKI_TRIP;
  const qs = trip.questions;
  const dev = useMemo(deviceId, []);
  const [name, setName] = useState(() => lsGet(NAME_KEY) || '');
  const [answers, setAnswers] = useState({});          // { [qid]: value }
  const [text, setText] = useState('');
  const [screen, setScreen] = useState(() => (lsGet(DONE_KEY) === '1' && lsGet(NAME_KEY)) ? 'results' : 'welcome'); // welcome | q | results
  const [step, setStep] = useState(0);
  const [votes, setVotes] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [status, setStatus] = useState('loading');     // loading | ok | error | missing
  const [errMsg, setErrMsg] = useState('');
  const [copied, setCopied] = useState(false);
  const myKey = nameKey(name);

  useEffect(() => {
    document.title = `${trip.title} · Abstimmung`;
    // Dark-Mode-Overrides der App (html[data-theme=dark]) sollen hier nicht greifen.
    document.documentElement.setAttribute('data-theme', 'light');
    const meta = document.querySelector('meta[name="theme-color"]:not([media])') || document.createElement('meta');
    meta.setAttribute('name', 'theme-color'); meta.setAttribute('content', '#0B1F3A'); document.head.appendChild(meta);
  }, [trip.title]);

  const load = useCallback(async () => {
    const [v, sg] = await Promise.all([
      supabase.from('ski_votes').select('*').eq('trip', trip.slug),
      supabase.from('ski_suggestions').select('*').eq('trip', trip.slug).order('created_at', { ascending: true }),
    ]);
    const err = v.error || sg.error;
    if (err) {
      setStatus(err.code === '42P01' || /does not exist|schema cache/i.test(err.message || '') ? 'missing' : 'error');
      setErrMsg(err.message || String(err));
      return;
    }
    setVotes(v.data || []);
    setSuggestions(sg.data || []);
    setStatus('ok');
  }, [trip.slug]);

  useEffect(() => {
    load();
    const iv = setInterval(() => { if (!document.hidden) load(); }, 20000);
    const vis = () => { if (!document.hidden) load(); };
    document.addEventListener('visibilitychange', vis);
    return () => { clearInterval(iv); document.removeEventListener('visibilitychange', vis); };
  }, [load]);

  // Eigene bisherige Antworten (gleicher Name) in den Fragebogen übernehmen.
  useEffect(() => {
    if (!myKey) return;
    const mine = {};
    for (const v of votes) if (v.name_key === myKey && v.poll_id !== LIKES_POLL && v.answers?.value) mine[v.poll_id] = v.answers.value;
    setAnswers(a => ({ ...mine, ...a }));
  }, [votes, myKey]);

  const saveVote = async (qid, value) => {
    const display = name.trim();
    if (!display) return;
    setVotes(prev => [...prev.filter(v => !(v.poll_id === qid && v.name_key === myKey)),
      { id: 'local-' + qid, trip: trip.slug, poll_id: qid, name: display, name_key: myKey, answers: value, device: dev }]);
    const { error } = await supabase.from('ski_votes')
      .upsert({ trip: trip.slug, poll_id: qid, name: display, answers: value, device: dev, updated_at: new Date().toISOString() },
        { onConflict: 'trip,poll_id,name_key' });
    if (error) { setStatus('error'); setErrMsg(error.message); }
  };

  const start = (toResults) => { setStep(0); setScreen(toResults ? 'results' : 'q'); };
  const next = () => {
    if (step + 1 < qs.length) setStep(step + 1);
    else finish();
  };
  const back = () => { if (step === 0) setScreen('welcome'); else setStep(step - 1); };

  const pick = (q, id) => {
    setAnswers(a => ({ ...a, [q.id]: id }));
    saveVote(q.id, { value: id });
    next();
  };

  const finish = async () => {
    lsSet(NAME_KEY, name.trim());
    lsSet(DONE_KEY, '1');
    const t = text.trim();
    if (t) {
      const { error } = await supabase.from('ski_suggestions').insert({ trip: trip.slug, name: name.trim(), text: t, device: dev });
      if (error) { setStatus('error'); setErrMsg(error.message); }
      setText('');
    }
    setScreen('results');
    load();
  };

  const like = (id) => {
    const cur = new Set(votes.find(v => v.poll_id === LIKES_POLL && v.name_key === myKey)?.answers?.selected || []);
    cur.has(id) ? cur.delete(id) : cur.add(id);
    saveVote(LIKES_POLL, { selected: Array.from(cur) });
  };

  const share = async () => {
    const url = window.location.origin + '/ski';
    try {
      if (navigator.share) { await navigator.share({ title: trip.title, text: 'Kurz abstimmen: Termin fürs Skifahren 2027', url }); return; }
      await navigator.clipboard.writeText(url);
      setCopied(true); setTimeout(() => setCopied(false), 1500);
    } catch { /* abgebrochen */ }
  };

  const q = qs[step];
  const progress = screen === 'q' ? ((step + 1) / qs.length) * 100 : screen === 'results' ? 100 : 0;

  return (
    <div className="ski-root">
      <style>{CSS}</style>
      <div className="ski-wrap">
        {screen !== 'welcome' && (
          <>
            <div className="ski-top">
              <button className="ski-link" onClick={screen === 'q' ? back : () => setScreen('welcome')} style={{ padding: 0 }}><ArrowLeft size={16} /> {screen === 'q' && step > 0 ? 'Zurück' : 'Start'}</button>
              <span>{screen === 'q' ? `Frage ${step + 1} von ${qs.length}` : trip.title}</span>
            </div>
            <div className="ski-prog"><i style={{ width: progress + '%' }} /></div>
          </>
        )}

        {status === 'missing' && (
          <div className="ski-note"><b>Datenbank noch nicht eingerichtet.</b> Einmalig <code>docs/ski-planung-setup.sql</code> im Supabase-SQL-Editor ausführen, dann Seite neu laden.</div>
        )}
        {status === 'error' && screen !== 'results' && (
          <div className="ski-note"><b>Verbindung fehlgeschlagen.</b> {errMsg} <button className="ski-link" style={{ padding: 0 }} onClick={load}><RefreshCw size={14} /> Neu laden</button></div>
        )}

        {screen === 'welcome' && <Welcome trip={trip} onStart={start} known={!!lsGet(NAME_KEY)} />}

        {screen === 'q' && q.type === 'name' && <NameStep key={q.id} q={q} value={name} onChange={setName} onNext={() => { lsSet(NAME_KEY, name.trim()); next(); }} />}
        {screen === 'q' && q.type === 'choice' && <ChoiceStep key={q.id} q={q} value={answers[q.id]} onPick={(id) => pick(q, id)} />}
        {screen === 'q' && q.type === 'text' && <TextStep key={q.id} q={q} value={text} onChange={setText} onNext={finish} />}

        {screen === 'results' && (
          <Results trip={trip} name={name} votes={votes} suggestions={suggestions} myKey={myKey} dev={dev}
            onLike={like} onEdit={() => start(false)} onShare={share} copied={copied} status={status} onReload={load} />
        )}
      </div>
    </div>
  );
}
