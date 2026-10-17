import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { ArrowLeft, ArrowRight, Check, ThumbsUp, Share2, RefreshCw, Pencil, Trophy, Plus, X } from 'lucide-react';
import { supabase } from './lib/supabase.js';
import { SKI_TRIP } from './ski/config.js';
import { groupSuggestions } from '../supabase/functions/_shared/ski-suggest.ts';

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

// Anzeigename: Vorname, bei gleichen Vornamen in der Gruppe plus Initiale
// („Jonas B.", „Jonas M."). Namen außerhalb der Liste bleiben wie eingegeben.
function makeShort(members) {
  const first = (n) => n.trim().split(/\s+/)[0];
  const count = {};
  for (const m of members) count[first(m).toLowerCase()] = (count[first(m).toLowerCase()] || 0) + 1;
  const known = new Map(members.map(m => [nameKey(m), m]));
  return (name) => {
    const full = known.get(nameKey(name));
    if (!full) return name;
    const parts = full.trim().split(/\s+/);
    return count[parts[0].toLowerCase()] > 1 && parts[1] ? `${parts[0]} ${parts[1][0]}.` : parts[0];
  };
}

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
.ski-plus{flex-shrink:0;width:52px;border-radius:16px;border:0;background:#fff;color:#0B1F3A;display:flex;align-items:center;justify-content:center;transition:transform .12s,opacity .15s}
.ski-plus:active{transform:scale(.95)}.ski-plus:disabled{opacity:.3}
.ski-chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}
.ski-chip{display:inline-flex;align-items:center;gap:6px;padding:8px 8px 8px 14px;border-radius:999px;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.25);font-size:15px;font-weight:600}
.ski-chip button{width:22px;height:22px;border-radius:999px;border:0;background:rgba(255,255,255,.2);color:#fff;display:flex;align-items:center;justify-content:center}
.ski-del{background:none;border:0;color:rgba(255,255,255,.45);padding:4px;display:flex}
.ski-grp{display:flex;align-items:center;gap:6px;margin-top:12px;font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase}
.ski-grp.g{color:#4ADE80}.ski-grp.y{color:#FBBF24}.ski-grp.r{color:#F87171}.ski-grp.o{color:rgba(255,255,255,.5)}
.ski-pills{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}
.ski-pill{display:inline-flex;align-items:center;gap:5px;padding:5px 11px;border-radius:999px;font-size:14px;font-weight:600;border:1px solid}
.ski-pill.g{background:rgba(74,222,128,.14);border-color:rgba(74,222,128,.45);color:#DCFCE7}
.ski-pill.y{background:rgba(251,191,36,.14);border-color:rgba(251,191,36,.45);color:#FEF3C7}
.ski-pill.r{background:rgba(248,113,113,.14);border-color:rgba(248,113,113,.45);color:#FEE2E2}
.ski-pill.o{background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.18);color:rgba(255,255,255,.65)}
.ski-pill em{font-style:normal;font-size:11px;font-weight:800;padding:1px 6px;border-radius:999px;background:rgba(255,255,255,.16)}
.ski-cmp{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:18px}
.ski-cmp-t{position:relative;border-radius:20px;padding:16px 16px 14px;background:rgba(255,255,255,.08);border:1.5px solid rgba(255,255,255,.14)}
.ski-cmp-t.win{background:rgba(74,222,128,.16);border-color:rgba(74,222,128,.7)}
.ski-cmp-t .lbl{font-size:15px;font-weight:700;opacity:.85}
.ski-cmp-t .num{font-size:52px;font-weight:800;line-height:1;margin-top:8px;letter-spacing:-.02em}
.ski-cmp-t.win .num{color:#4ADE80}
.ski-cmp-t .sub{font-size:15px;font-weight:600;opacity:.8}
.ski-cmp-t .mb{font-size:13px;color:#FBBF24;font-weight:600;margin-top:6px}
.ski-cmp-t .badge{display:inline-block;margin-top:10px;font-size:11px;font-weight:800;padding:3px 9px;border-radius:999px;background:#4ADE80;color:#0B1F3A}
.ski-card-win{border-color:rgba(74,222,128,.5)}
.ski-day{display:grid;grid-template-columns:1fr auto;column-gap:10px;align-items:baseline;padding:12px 0;border-top:1px solid rgba(255,255,255,.1)}
.ski-day:first-of-type{border-top:0;padding-top:2px}
.ski-day .d{font-size:16px;font-weight:800}
.ski-day .c{font-size:22px;font-weight:800;text-align:right}
.ski-day .n{grid-column:1 / -1;font-size:14px;line-height:1.45;color:rgba(255,255,255,.75);margin-top:3px}
.ski-day.m .d,.ski-day.m .c{color:#4ADE80}
.ski-day.y .d,.ski-day.y .c{color:#FBBF24;font-size:14px}
.ski-day.r .d,.ski-day.r .c{color:#F87171;font-size:14px}
.ski-day.y .n,.ski-day.r .n{font-size:13px;color:rgba(255,255,255,.55)}
.ski-multi{display:inline-block;margin-left:8px;vertical-align:middle;font-size:11px;font-weight:800;padding:2px 8px;border-radius:999px;background:rgba(255,149,0,.2);color:#FFB340}
.ski-names-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:22px}
.ski-name{position:relative;text-align:left;padding:12px 14px;border-radius:16px;border:1.5px solid rgba(255,255,255,.18);background:rgba(255,255,255,.08);color:#fff;transition:transform .12s,background .15s;-webkit-tap-highlight-color:transparent}
.ski-name:active{transform:scale(.97)}
.ski-name.on{background:#fff;color:#0B1F3A;border-color:#fff}
.ski-name .f{display:block;font-size:17px;font-weight:700;line-height:1.15}
.ski-name .l{display:block;font-size:13px;opacity:.65;margin-top:1px}
.ski-name .v{position:absolute;top:8px;right:8px;width:18px;height:18px;border-radius:999px;background:#4ADE80;color:#0B1F3A;display:flex;align-items:center;justify-content:center}
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

function NameStep({ q, members, voted, value, onPick }) {
  const [other, setOther] = useState(false);
  const [custom, setCustom] = useState('');
  const [flash, setFlash] = useState(null);
  const pick = (n) => { setFlash(n); setTimeout(() => onPick(n), 220); };
  const cur = nameKey(flash || value);
  return (
    <div className="ski-step" style={{ justifyContent: 'flex-start', paddingTop: 28 }}>
      <h2 className="ski-h2">{q.title}</h2>
      {q.sub && <p className="ski-sub">{q.sub}</p>}
      <div className="ski-names-grid">
        {[...members].sort((a, b) => a.localeCompare(b, 'de')).map(n => {
          const [f, ...rest] = n.split(' ');
          return (
            <button key={n} type="button" className={cx('ski-name', cur === nameKey(n) && 'on')} onClick={() => pick(n)}>
              <span className="f">{f}</span>
              <span className="l">{rest.join(' ')}</span>
              {voted.has(nameKey(n)) && <span className="v"><Check size={11} strokeWidth={3.2} /></span>}
            </button>
          );
        })}
      </div>
      {voted.size > 0 && <div className="ski-names" style={{ marginTop: 10 }}>✓ = hat schon abgestimmt. Antippen, um die Antworten zu ändern.</div>}
      {!other ? (
        <button type="button" className="ski-link" style={{ marginTop: 14, justifyContent: 'center' }} onClick={() => setOther(true)}>Mein Name fehlt</button>
      ) : (
        <form onSubmit={e => { e.preventDefault(); if (custom.trim()) onPick(custom.trim()); }} style={{ marginTop: 6 }}>
          <input className="ski-input" autoFocus value={custom} onChange={e => setCustom(e.target.value)} placeholder="Vor- und Nachname" autoCapitalize="words" maxLength={40} enterKeyHint="next" />
          <button type="submit" className="ski-btn" disabled={!custom.trim()} style={{ width: '100%', marginTop: 12 }}>Weiter <ArrowRight size={18} strokeWidth={2.6} /></button>
        </form>
      )}
    </div>
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

// Eingabe für mehrere Vorschläge: Text eintippen → „+" (oder Enter) → Chip.
function SuggestionInput({ placeholder, onAdd, autoFocus }) {
  const [v, setV] = useState('');
  const add = () => { const t = v.trim(); if (t) { onAdd(t); setV(''); } };
  return (
    <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
      <input className="ski-input" style={{ marginTop: 0, fontSize: 18, padding: '13px 16px' }} value={v} autoFocus={autoFocus}
        onChange={e => setV(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
        placeholder={placeholder} maxLength={120} enterKeyHint="enter" />
      <button type="button" className="ski-plus" onClick={add} disabled={!v.trim()} aria-label="Vorschlag hinzufügen"><Plus size={22} strokeWidth={2.8} /></button>
    </div>
  );
}

function TextStep({ q, items, onAddItem, onRemoveItem, onNext }) {
  return (
    <div className="ski-step">
      <h2 className="ski-h2">{q.title}</h2>
      {q.sub && <p className="ski-sub">{q.sub}</p>}
      <SuggestionInput placeholder={items.length ? 'Noch ein Vorschlag …' : q.placeholder} onAdd={onAddItem} />
      {items.length > 0 && (
        <div className="ski-chips">
          {items.map((t, i) => (
            <span key={i} className="ski-chip">{t}<button type="button" onClick={() => onRemoveItem(i)} aria-label="Entfernen"><X size={14} strokeWidth={2.8} /></button></span>
          ))}
        </div>
      )}
      <div style={{ marginTop: 22 }}>
        <button type="button" className="ski-btn" style={{ width: '100%' }} onClick={onNext}>
          {items.length ? `Abschicken (${items.length} ${items.length === 1 ? 'Vorschlag' : 'Vorschläge'})` : 'Ohne Vorschlag abschicken'} <Check size={18} strokeWidth={2.6} />
        </button>
      </div>
    </div>
  );
}

// Alt-Einträge aus der Zeit, als man den Namen noch eintippte (z. B. „Ruben"),
// ausblenden, wenn sie eindeutig zu einem Listen-Mitglied gehören, das inzwischen
// selbst abgestimmt hat — sonst steht die Person doppelt in der Übersicht.
function legacyDuplicates(votes, members) {
  const memberKeys = new Set(members.map(nameKey));
  const byFirst = {};
  for (const m of members) (byFirst[nameKey(m).split(' ')[0]] ||= []).push(nameKey(m));
  const voted = new Set(votes.filter(v => v.poll_id === 'dabei').map(v => v.name_key));
  const out = new Set();
  for (const k of new Set(votes.map(v => v.name_key))) {
    if (memberKeys.has(k)) continue;
    const cands = byFirst[k];
    if (cands && cands.length === 1 && voted.has(cands[0])) out.add(k);
  }
  return out;
}

function Results({ trip, short, name, votes: rawVotes, suggestions, myKey, dev, onLike, onAddSuggestion, onDeleteSuggestion, onEdit, onShare, copied, status, onReload }) {
  // Wer abgesagt hat (dabei = nein), zählt bei Terminen und Zusatztag nicht mit —
  // auch wenn noch alte Antworten von vor der Absage gespeichert sind.
  const votes = useMemo(() => {
    const declined = new Set(rawVotes.filter(v => v.poll_id === 'dabei' && v.answers?.value === 'nein').map(v => v.name_key));
    const legacy = legacyDuplicates(rawVotes, trip.members || []);
    return rawVotes.filter(v => !legacy.has(v.name_key)
      && (v.poll_id === 'dabei' || v.poll_id === LIKES_POLL || !declined.has(v.name_key)));
  }, [rawVotes, trip.members]);
  const qs = trip.questions;
  const r = trip.results;
  const byQ = (qid) => votes.filter(v => v.poll_id === qid);
  const nameOf = (v) => short(v.name);
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

  // ---- Übersicht „wer kann / wer nicht" über ALLE Mitglieder ----
  const members = trip.members || [];
  const statusOf = (k) => answerOf(k, 'dabei');                     // ja | vielleicht | nein | undefined
  const allPeople = useMemo(() => {
    const m = new Map(members.map(n => [nameKey(n), n]));
    for (const p of people) if (!m.has(p.k)) m.set(p.k, p.n);    // auch „Mein Name fehlt"-Einträge
    return Array.from(m.entries()).map(([k, n]) => ({ k, n }));
  }, [members, people]);
  const pill = (p) => ({ k: p.k, n: short(p.n) });
  const stOffen = allPeople.filter(p => !statusOf(p.k)).map(p => pill(p));
  // Tagesplan je Wochenende: wer kann Sa+So, wer zusätzlich Fr / Mo
  const zOf = (k) => answerOf(k, 'zusatztag');
  const weekendPlan = (qid) => {
    const yes = [], maybe = [], no = [];
    for (const p of allPeople) {
      const st = statusOf(p.k), a = answerOf(p.k, qid);
      if (st === 'nein') continue;            // Absagen stehen separat, nicht beim Termin
      if (a === 'no') no.push(p);
      else if (a === 'yes') yes.push(p);
      else if (a === 'maybe') maybe.push(p);
    }
    const fr = yes.filter(p => ['fr', 'fr-mo'].includes(zOf(p.k)));
    const mo = yes.filter(p => ['mo', 'fr-mo'].includes(zOf(p.k)));
    return { yes, maybe, no, fr, mo };
  };
  const namesOf = (arr) => arr.map(p => short(p.n)).sort((a, b) => a.localeCompare(b, 'de')).join(', ');
  const absagen = allPeople.filter(p => statusOf(p.k) === 'nein').map(p => short(p.n)).sort((a, b) => a.localeCompare(b, 'de'));
  const plans = weekends.map(w => ({ ...w, plan: weekendPlan(w.qid), days: r.weekendDays?.[w.qid] || {} }));
  const bestYes = Math.max(0, ...plans.map(w => w.plan.yes.length));
  const plansSorted = [...plans].sort((a, b) => b.plan.yes.length - a.plan.yes.length);

  const rank = (k) => ({ ja: 0, vielleicht: 1, nein: 2 }[statusOf(k)] ?? 3);
  const tableRows = [...allPeople].sort((a, b) => rank(a.k) - rank(b.k) || short(a.n).localeCompare(short(b.n), 'de'));

  // Einfache Auswahlfragen (ohne Termin, ohne Name/Text)
  const choices = qs.filter(q => q.type === 'choice' && q.kind !== 'availability');
  const likes = useMemo(() => {
    const m = {};
    for (const v of votes) if (v.poll_id === LIKES_POLL) for (const id of (v.answers?.selected || [])) (m[id] ||= []).push({ key: v.name_key, name: short(v.name), mine: v.name_key === myKey });
    return m;
  }, [votes, myKey]);
  // Gleiche Vorschläge (Schreibweise, Füllwörter, kleine Tippfehler) zusammenfassen.
  // Unterstützer = alle, die ihn vorgeschlagen ODER mit Daumen hoch markiert haben.
  const sugGroups = useMemo(() => groupSuggestions(suggestions).map(g => {
    const uniq = (arr) => Array.from(new Map(arr.map(x => [x.key, x])).values());
    const proposers = uniq(g.items.map(it => ({ key: nameKey(it.name), name: short(it.name) })));
    const likers = uniq(g.ids.flatMap(id => (likes[id] || []).map(l => ({ key: l.key, name: l.name, mine: l.mine }))));
    const support = new Set([...proposers, ...likers].map(x => x.key)).size;
    const mineItem = g.items.find(it => it.device === dev && !(likes[it.id] || []).length);
    return { ...g, proposers, likers, support, on: likers.some(l => l.mine), mineItem };
  }).sort((a, b) => b.support - a.support || b.likers.length - a.likers.length), [suggestions, likes, dev, short]);
  const overviewCols = [...choices.filter(q => q.id === 'dabei'), ...qs.filter(q => q.kind === 'availability'), ...choices.filter(q => q.id !== 'dabei')];
  const shortOf = (q, val) => q.options.find(o => o.id === val)?.short ?? (val ? '•' : '–');
  const tone = (q, val) => q.kind === 'availability' || q.id === 'dabei'
    ? (val === 'yes' || val === 'ja' ? '#4ADE80' : val === 'maybe' || val === 'vielleicht' ? '#FBBF24' : val === 'no' || val === 'nein' ? '#F87171' : 'rgba(255,255,255,.35)')
    : (val ? '#fff' : 'rgba(255,255,255,.35)');

  return (
    <div className="ski-step" style={{ justifyContent: 'flex-start' }}>
      <h2 className="ski-h2">{!name.trim() ? 'Zwischenstand'
        : answerOf(myKey, 'dabei') === 'nein' ? `Schade, ${name.trim().split(/\s+/)[0]}! Danke fürs Bescheidgeben 💙`
        : (r.thanks || 'Danke, {name}!').replace('{name}', name.trim().split(/\s+/)[0]) + ' 🙌'}</h2>
      <p className="ski-sub">{r.text}</p>

      {status === 'error' && (
        <div className="ski-note">Verbindung fehlgeschlagen. <button className="ski-link" style={{ padding: 0 }} onClick={onReload}><RefreshCw size={14} /> Neu laden</button></div>
      )}

      {/* Vergleich auf einen Blick */}
      {plans.length > 0 && (
        <div className="ski-cmp">
          {plans.map(w => {
            const win = bestYes > 0 && w.plan.yes.length === bestYes;
            return (
              <div key={w.qid} className={cx('ski-cmp-t', win && 'win')}>
                <div className="lbl">{w.label}</div>
                <div className="num">{w.plan.yes.length}</div>
                <div className="sub">{w.plan.yes.length === 1 ? 'kann' : 'können'}</div>
                {w.plan.maybe.length > 0 && <div className="mb">+ {w.plan.maybe.length} vielleicht</div>}
                {win && <div className="badge">Die meisten</div>}
              </div>
            );
          })}
        </div>
      )}

      {/* Tagesplan je Wochenende (Favorit zuerst) */}
      {plansSorted.map(w => {
        const win = bestYes > 0 && w.plan.yes.length === bestYes;
        const row = (label, arr, tone) => (
          <div className={cx('ski-day', tone)}>
            <div className="d">{label}</div>
            <div className="c">{arr.length}</div>
            <div className="n">{arr.length ? namesOf(arr) : '—'}</div>
          </div>
        );
        return (
          <div key={w.qid} className={cx('ski-card', win && 'ski-card-win')}>
            <h3>{w.label}{win && <span className="ski-fav">Favorit</span>}</h3>
            {row(`${w.days.fr || 'Freitag'} · zusätzlich`, w.plan.fr, 'x')}
            {row(w.days.main || 'Sa + So', w.plan.yes, 'm')}
            {row(`${w.days.mo || 'Montag'} · zusätzlich`, w.plan.mo, 'x')}
            {w.plan.maybe.length > 0 && row('Vielleicht', w.plan.maybe, 'y')}
            {w.plan.no.length > 0 && row('Geht nicht', w.plan.no, 'r')}
          </div>
        );
      })}

      {/* Noch nicht abgestimmt */}
      <div className="ski-card">
        <h3>Noch nicht abgestimmt · {stOffen.length} von {allPeople.length}</h3>
        {stOffen.length
          ? <div className="ski-pills">{stOffen.map(it => <span key={it.k} className="ski-pill o">{it.n}</span>)}</div>
          : <div style={{ fontSize: 16, fontWeight: 700, color: '#4ADE80' }}>Alle haben abgestimmt ✓</div>}
      </div>

      {/* Absagen — separat, zählen bei keinem Termin mit */}
      {absagen.length > 0 && (
        <div className="ski-card">
          <h3>Dieses Jahr nicht dabei · {absagen.length}</h3>
          <div className="ski-pills">{absagen.map(n => <span key={n} className="ski-pill r">{n}</span>)}</div>
        </div>
      )}

      {/* Vorschläge */}
      <div className="ski-card">
        <h3>Vorschläge Skigebiet & Unterkunft</h3>
        {sugGroups.length === 0 && <div style={{ fontSize: 15, color: 'rgba(255,255,255,.6)' }}>Noch keine Vorschläge.</div>}
        {sugGroups.map((g, i) => (
          <div key={g.ids[0]} style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: i ? 12 : 0 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 16, fontWeight: 600 }}>
                {g.text}
                {g.proposers.length > 1 && <span className="ski-multi">{g.proposers.length}× vorgeschlagen</span>}
              </div>
              <div className="ski-names">
                von {g.proposers.map(p => p.name).join(', ')}
                {g.likers.length > 0 && <> · 👍 {g.likers.map(l => l.name).join(', ')}</>}
              </div>
            </div>
            {g.mineItem && g.items.length === 1 && (
              <button type="button" className="ski-del" onClick={() => onDeleteSuggestion(g.mineItem.id)} aria-label="Eigenen Vorschlag löschen"><X size={16} strokeWidth={2.6} /></button>
            )}
            <button type="button" className={cx('ski-like', g.on && 'on')} onClick={() => onLike(g.ids, g.on)} aria-label="Daumen hoch">
              <ThumbsUp size={15} strokeWidth={2.4} /> {g.likers.length}
            </button>
          </div>
        ))}
        {name.trim() && <SuggestionInput placeholder="Weiterer Vorschlag …" onAdd={onAddSuggestion} />}
      </div>

      {/* Übersicht */}
      {allPeople.length > 0 && (
        <div className="ski-card">
          <h3>Alle Antworten</h3>
          <div className="ski-scroll">
            <table className="ski-table">
              <thead><tr><th>Name</th>{overviewCols.map(q => <th key={q.id}>{q.short || q.title}</th>)}</tr></thead>
              <tbody>
                {tableRows.map(p => (
                  <tr key={p.k}>
                    <td style={{ fontWeight: 600 }}>{short(p.n)}</td>
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
  const [pendingSugs, setPendingSugs] = useState([]);
  const [screen, setScreen] = useState(() => (lsGet(DONE_KEY) === '1' && lsGet(NAME_KEY)) ? 'results' : 'welcome'); // welcome | q | results
  const [step, setStep] = useState(0);
  const [votes, setVotes] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [status, setStatus] = useState('loading');     // loading | ok | error | missing
  const [errMsg, setErrMsg] = useState('');
  const [copied, setCopied] = useState(false);
  const myKey = nameKey(name);
  const members = trip.members || [];
  const short = useMemo(() => makeShort(members), [members]);
  const voted = useMemo(() => new Set(votes.filter(v => v.poll_id !== LIKES_POLL).map(v => v.name_key)), [votes]);

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

  // Fragen mit showIf(antworten) === false werden übersprungen (z. B. wer absagt,
  // bekommt keine Termin- und Zusatztag-Fragen mehr).
  const isShown = (x, ans) => !x.showIf || x.showIf(ans || {});
  const start = (toResults) => { setStep(0); setScreen(toResults ? 'results' : 'q'); };
  const next = (ans = answers) => {
    for (let i = step + 1; i < qs.length; i++) if (isShown(qs[i], ans)) { setStep(i); return; }
    finish(ans);
  };
  const back = () => {
    for (let i = step - 1; i >= 0; i--) if (isShown(qs[i], answers)) { setStep(i); return; }
    setScreen('welcome');
  };

  const pick = (q, id) => {
    const ans = { ...answers, [q.id]: id };
    setAnswers(ans);
    saveVote(q.id, { value: id });
    next(ans);
  };

  const finish = async (ans = answers) => {
    lsSet(NAME_KEY, name.trim());
    lsSet(DONE_KEY, '1');
    // Antworten auf übersprungene Fragen entfernen (z. B. Termine nach Absage).
    const hidden = qs.filter(x => x.type === 'choice' && !isShown(x, ans)).map(x => x.id);
    if (hidden.length && myKey) {
      setVotes(prev => prev.filter(v => !(v.name_key === myKey && hidden.includes(v.poll_id))));
      setAnswers(a => { const c = { ...a }; hidden.forEach(h => delete c[h]); return c; });
      const { error } = await supabase.from('ski_votes').delete().eq('trip', trip.slug).eq('name_key', myKey).in('poll_id', hidden);
      if (error) { setStatus('error'); setErrMsg(error.message); }
    }
    if (pendingSugs.length) {
      const rows = pendingSugs.map(t => ({ trip: trip.slug, name: name.trim(), text: t, device: dev }));
      const { error } = await supabase.from('ski_suggestions').insert(rows);
      if (error) { setStatus('error'); setErrMsg(error.message); }
      setPendingSugs([]);
    }
    notify('submit');
    setScreen('results');
    load();
  };

  // Mail an den Organisator (Edge Function ski-notify). Läuft im Hintergrund,
  // ein Fehler hier darf den Fragebogen nie blockieren.
  const notify = (kind) => {
    const polls = qs.filter(x => x.type === 'choice').map(x => ({
      id: x.id, title: x.title, kind: x.kind, options: x.options.map(o => ({ id: o.id, label: o.label })),
    }));
    supabase.functions.invoke('ski-notify', { body: { trip: trip.slug, name: name.trim(), kind, polls } }).catch(() => {});
  };

  const addSuggestion = async (t) => {
    if (!name.trim()) return;
    const { error } = await supabase.from('ski_suggestions').insert({ trip: trip.slug, name: name.trim(), text: t, device: dev });
    if (error) { setStatus('error'); setErrMsg(error.message); } else notify('suggestion');
    load();
  };
  const deleteSuggestion = async (id) => {
    setSuggestions(prev => prev.filter(x => x.id !== id));
    const { error } = await supabase.from('ski_suggestions').delete().eq('id', id).eq('device', dev);
    if (error) { setStatus('error'); setErrMsg(error.message); }
    load();
  };

  // Daumen gilt für die ganze Gruppe gleicher Vorschläge: an = erste ID merken,
  // aus = alle IDs der Gruppe entfernen.
  const like = (ids, on) => {
    const cur = new Set(votes.find(v => v.poll_id === LIKES_POLL && v.name_key === myKey)?.answers?.selected || []);
    if (on) ids.forEach(id => cur.delete(id)); else cur.add(ids[0]);
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
  const shownQs = qs.filter(x => isShown(x, answers));
  const shownPos = Math.max(0, shownQs.indexOf(q)) + 1;
  const progress = screen === 'q' ? (shownPos / shownQs.length) * 100 : screen === 'results' ? 100 : 0;

  return (
    <div className="ski-root">
      <style>{CSS}</style>
      <div className="ski-wrap">
        {screen !== 'welcome' && (
          <>
            <div className="ski-top">
              <button className="ski-link" onClick={screen === 'q' ? back : () => setScreen('welcome')} style={{ padding: 0 }}><ArrowLeft size={16} /> {screen === 'q' && step > 0 ? 'Zurück' : 'Start'}</button>
              <span>{screen === 'q' ? `Frage ${shownPos} von ${shownQs.length}` : trip.title}</span>
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

        {screen === 'q' && q.type === 'name' && <NameStep key={q.id} q={q} members={members} voted={voted} value={name} onPick={(n) => { setAnswers({}); setName(n); lsSet(NAME_KEY, n); next(); }} />}
        {screen === 'q' && q.type === 'choice' && <ChoiceStep key={q.id} q={q} value={answers[q.id]} onPick={(id) => pick(q, id)} />}
        {screen === 'q' && q.type === 'text' && <TextStep key={q.id} q={q} items={pendingSugs} onAddItem={(t) => setPendingSugs(a => [...a, t])} onRemoveItem={(i) => setPendingSugs(a => a.filter((_, j) => j !== i))} onNext={() => finish()} />}

        {screen === 'results' && (
          <Results trip={trip} short={short} name={name} votes={votes} suggestions={suggestions} myKey={myKey} dev={dev}
            onLike={like} onAddSuggestion={addSuggestion} onDeleteSuggestion={deleteSuggestion} onEdit={() => start(false)} onShare={share} copied={copied} status={status} onReload={load} />
        )}
      </div>
    </div>
  );
}
