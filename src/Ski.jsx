import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Snowflake, Check, HelpCircle, X, Users, MessageCircle, Send, Info,
  RefreshCw, Trash2, Share2,
} from 'lucide-react';
import { supabase } from './lib/supabase.js';
import { SKI_TRIP } from './ski/config.js';

// =============================================================
// Ski-Planung — eigenständige Unterseite unter /ski (ohne Login).
// Inhalte: src/ski/config.js · Daten: Supabase ski_votes / ski_comments.
// Alle Teilnehmer sehen dieselbe Abstimmung; Zuordnung läuft über den
// eingetragenen Namen (wie bei Doodle). Ein Geräte-Token merkt sich,
// welche Einträge von diesem Handy stammen.
// =============================================================

const NAME_KEY = 'artcyc:ski:name';
const DEVICE_KEY = 'artcyc:ski:device';
const TINT = '#007AFF';

function cx(...a) { return a.filter(Boolean).join(' '); }

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

function fmtTime(iso) {
  try {
    return new Date(iso).toLocaleString('de-DE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  } catch { return ''; }
}

// ---- UI-Bausteine (iOS-Look, bewusst unabhängig von der großen App-Datei) ----
function Card({ header, footer, children }) {
  return (
    <section className="mb-5">
      {header && <div className="px-4 pb-1.5 text-[13px] uppercase tracking-wide text-[#8E8E93]">{header}</div>}
      <div className="bg-white rounded-[16px] overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04)]">{children}</div>
      {footer && <div className="px-4 pt-1.5 text-[13px] text-[#8E8E93]">{footer}</div>}
    </section>
  );
}

function Row({ children, className }) {
  return (
    <div className={cx('px-4 py-3 border-b last:border-b-0', className)} style={{ borderColor: 'rgba(198,198,200,0.4)' }}>
      {children}
    </div>
  );
}

const AVAIL = [
  { v: 'yes',   label: 'Ja',          Icon: Check,      on: 'bg-[#34C759] text-white', off: 'text-[#34C759]' },
  { v: 'maybe', label: 'Vielleicht',  Icon: HelpCircle, on: 'bg-[#FF9500] text-white', off: 'text-[#FF9500]' },
  { v: 'no',    label: 'Nein',        Icon: X,          on: 'bg-[#FF3B30] text-white', off: 'text-[#FF3B30]' },
];

// ---- Abstimmung: Verfügbarkeit (Ja/Vielleicht/Nein je Option) ------------
function AvailabilityPoll({ poll, answers, onChange, votes, disabled }) {
  const tally = useMemo(() => {
    const t = {};
    for (const o of poll.options) t[o.id] = { yes: [], maybe: [], no: [] };
    for (const v of votes) {
      for (const o of poll.options) {
        const a = v.answers?.[o.id];
        if (a && t[o.id][a]) t[o.id][a].push(v.name);
      }
    }
    return t;
  }, [poll, votes]);
  const best = useMemo(() => {
    let max = 0;
    for (const o of poll.options) max = Math.max(max, tally[o.id].yes.length);
    return max > 0 ? poll.options.filter(o => tally[o.id].yes.length === max).map(o => o.id) : [];
  }, [poll, tally]);

  return (
    <Card header={poll.title} footer={poll.hint}>
      {poll.options.map(o => {
        const cur = answers?.[o.id];
        const t = tally[o.id];
        return (
          <Row key={o.id}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[15px] font-medium text-slate-900 flex items-center gap-2">
                  {o.label}
                  {best.includes(o.id) && <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded-full bg-[#34C759]/15 text-[#34C759]">Favorit</span>}
                </div>
                {o.sub && <div className="text-[13px] text-[#8E8E93]">{o.sub}</div>}
                <div className="text-[12px] text-[#8E8E93] mt-1 tabular-nums">
                  <span className="text-[#34C759] font-semibold">{t.yes.length}</span> ja ·{' '}
                  <span className="text-[#FF9500] font-semibold">{t.maybe.length}</span> vielleicht ·{' '}
                  <span className="text-[#FF3B30] font-semibold">{t.no.length}</span> nein
                </div>
              </div>
              <div className="flex gap-1.5 shrink-0">
                {AVAIL.map(({ v, label, Icon, on, off }) => (
                  <button key={v} type="button" disabled={disabled} aria-label={label} title={label}
                    onClick={() => onChange({ ...(answers || {}), [o.id]: cur === v ? undefined : v })}
                    className={cx('w-10 h-10 rounded-full flex items-center justify-center transition active:scale-95 disabled:opacity-40',
                      cur === v ? on : cx('bg-[#F2F2F7]', off))}>
                    <Icon size={18} strokeWidth={2.6} />
                  </button>
                ))}
              </div>
            </div>
            {(t.yes.length + t.maybe.length) > 0 && (
              <div className="mt-1.5 text-[12px] text-slate-500 leading-snug">
                {t.yes.length > 0 && <span>✓ {t.yes.join(', ')}</span>}
                {t.yes.length > 0 && t.maybe.length > 0 && <span> · </span>}
                {t.maybe.length > 0 && <span>? {t.maybe.join(', ')}</span>}
              </div>
            )}
          </Row>
        );
      })}
    </Card>
  );
}

// ---- Abstimmung: Auswahl (eine / mehrere Optionen) -----------------------
function ChoicePoll({ poll, answers, onChange, votes, disabled }) {
  const multi = poll.type === 'multi';
  const selected = new Set(Array.isArray(answers?.selected) ? answers.selected : []);
  const tally = useMemo(() => {
    const t = {};
    for (const o of poll.options) t[o.id] = [];
    for (const v of votes) {
      const sel = Array.isArray(v.answers?.selected) ? v.answers.selected : [];
      for (const id of sel) if (t[id]) t[id].push(v.name);
    }
    return t;
  }, [poll, votes]);
  const total = votes.filter(v => (v.answers?.selected || []).length > 0).length;

  const toggle = (id) => {
    let next;
    if (multi) { next = new Set(selected); next.has(id) ? next.delete(id) : next.add(id); }
    else next = selected.has(id) ? new Set() : new Set([id]);
    onChange({ selected: Array.from(next) });
  };

  return (
    <Card header={poll.title} footer={poll.hint || (multi ? 'Mehrfachauswahl möglich.' : 'Eine Option wählen.')}>
      {poll.options.map(o => {
        const on = selected.has(o.id);
        const n = tally[o.id].length;
        const pct = total > 0 ? Math.round((n / total) * 100) : 0;
        return (
          <button key={o.id} type="button" disabled={disabled} onClick={() => toggle(o.id)}
            className="w-full text-left block active:bg-[rgba(209,209,214,0.4)] disabled:opacity-40">
            <Row>
              <div className="flex items-center gap-3">
                <span className={cx('w-6 h-6 shrink-0 flex items-center justify-center border-2 transition',
                  multi ? 'rounded-[7px]' : 'rounded-full',
                  on ? 'border-[#007AFF] bg-[#007AFF] text-white' : 'border-[#C7C7CC]')}>
                  {on && <Check size={14} strokeWidth={3} />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[15px] text-slate-900">{o.label}</div>
                  {o.sub && <div className="text-[13px] text-[#8E8E93]">{o.sub}</div>}
                  <div className="mt-1.5 h-1.5 rounded-full bg-[#F2F2F7] overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: pct + '%', background: TINT }} />
                  </div>
                  {n > 0 && <div className="text-[12px] text-slate-500 mt-1">{tally[o.id].join(', ')}</div>}
                </div>
                <div className="text-[13px] text-[#8E8E93] tabular-nums shrink-0">{n}</div>
              </div>
            </Row>
          </button>
        );
      })}
    </Card>
  );
}

// ---- Teilnehmer-Übersicht (Matrix für die Terminfrage) -------------------
function Overview({ trip, votes }) {
  const avail = trip.polls.find(p => p.type === 'availability');
  const names = useMemo(() => {
    const set = new Map();
    for (const v of votes) if (!set.has(v.name_key)) set.set(v.name_key, v.name);
    return Array.from(set.values()).sort((a, b) => a.localeCompare(b, 'de'));
  }, [votes]);
  if (names.length === 0) return null;
  const byName = (name, pollId) => votes.find(v => v.name === name && v.poll_id === pollId)?.answers || {};
  const mark = (a) => a === 'yes' ? <Check size={14} strokeWidth={3} className="text-[#34C759]" />
    : a === 'maybe' ? <HelpCircle size={14} strokeWidth={2.6} className="text-[#FF9500]" />
    : a === 'no' ? <X size={14} strokeWidth={3} className="text-[#FF3B30]" />
    : <span className="text-[#C7C7CC]">–</span>;
  return (
    <Card header={`Wer ist dabei (${names.length})`}>
      {avail ? (
        <div className="overflow-x-auto">
          <table className="min-w-full text-[13px]">
            <thead>
              <tr className="text-[#8E8E93]">
                <th className="text-left font-medium px-4 py-2 sticky left-0 bg-white">Name</th>
                {avail.options.map(o => (
                  <th key={o.id} className="font-medium px-2 py-2 whitespace-nowrap text-center">{o.short || o.label.replace(/\s*\d{4}$/, '')}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {names.map(n => {
                const a = byName(n, avail.id);
                return (
                  <tr key={n} className="border-t" style={{ borderColor: 'rgba(198,198,200,0.4)' }}>
                    <td className="px-4 py-2 font-medium text-slate-900 whitespace-nowrap sticky left-0 bg-white">{n}</td>
                    {avail.options.map(o => <td key={o.id} className="px-2 py-2 text-center"><span className="inline-flex justify-center">{mark(a[o.id])}</span></td>)}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <Row><div className="text-[15px] text-slate-900">{names.join(', ')}</div></Row>
      )}
    </Card>
  );
}

// ---- Kommentare ----------------------------------------------------------
function Comments({ trip, name, comments, onPost, onDelete, dev }) {
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    const t = text.trim();
    if (!t || !name.trim()) return;
    setBusy(true);
    try { await onPost(t); setText(''); } finally { setBusy(false); }
  };
  return (
    <Card header={<span className="inline-flex items-center gap-1.5"><MessageCircle size={13} /> Kommentare</span>}>
      {comments.length === 0 && <Row><div className="text-[14px] text-[#8E8E93]">Noch keine Kommentare.</div></Row>}
      {comments.map(c => (
        <Row key={c.id}>
          <div className="flex items-baseline justify-between gap-2">
            <div className="text-[13px] font-semibold text-slate-900">{c.name}</div>
            <div className="text-[11px] text-[#8E8E93] tabular-nums flex items-center gap-2">
              {fmtTime(c.created_at)}
              {c.device === dev && (
                <button type="button" onClick={() => onDelete(c.id)} aria-label="Löschen" className="text-[#FF3B30] active:opacity-50"><Trash2 size={13} /></button>
              )}
            </div>
          </div>
          <div className="text-[15px] text-slate-900 whitespace-pre-wrap mt-0.5">{c.text}</div>
        </Row>
      ))}
      <form onSubmit={submit} className="px-3 py-2.5 flex items-end gap-2" style={{ borderTop: comments.length ? '1px solid rgba(198,198,200,0.4)' : 'none' }}>
        <textarea value={text} onChange={e => setText(e.target.value)} rows={1}
          placeholder={name.trim() ? 'Kommentar schreiben…' : 'Erst oben deinen Namen eintragen'}
          disabled={!name.trim()}
          className="flex-1 resize-none bg-[#F2F2F7] rounded-[14px] px-3 py-2 text-[15px] outline-none disabled:opacity-50" />
        <button type="submit" disabled={busy || !text.trim() || !name.trim()} aria-label="Senden"
          className="w-9 h-9 rounded-full flex items-center justify-center text-white disabled:opacity-40 active:scale-95"
          style={{ background: TINT }}><Send size={16} /></button>
      </form>
    </Card>
  );
}

// ---- Seite ---------------------------------------------------------------
export default function Ski() {
  const trip = SKI_TRIP;
  const dev = useMemo(deviceId, []);
  const [name, setName] = useState(() => lsGet(NAME_KEY) || '');
  const [votes, setVotes] = useState([]);
  const [comments, setComments] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ok | error | missing
  const [errMsg, setErrMsg] = useState('');
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const saveTimers = useRef({});

  // Dark Mode wie auf der Landingpage: folgt System oder App-Einstellung.
  useEffect(() => {
    const apply = () => {
      let pref = 'system';
      const v = lsGet('artcyc:theme'); if (v === 'light' || v === 'dark') pref = v;
      const dark = pref === 'dark' || (pref === 'system' && typeof window.matchMedia === 'function'
        && window.matchMedia('(prefers-color-scheme: dark)').matches);
      document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    };
    apply();
    document.title = `${trip.title} · Planung`;
    const mq = typeof window.matchMedia === 'function' ? window.matchMedia('(prefers-color-scheme: dark)') : null;
    if (mq?.addEventListener) { mq.addEventListener('change', apply); return () => mq.removeEventListener('change', apply); }
  }, [trip.title]);

  const load = useCallback(async () => {
    const [v, c] = await Promise.all([
      supabase.from('ski_votes').select('*').eq('trip', trip.slug),
      supabase.from('ski_comments').select('*').eq('trip', trip.slug).order('created_at', { ascending: true }),
    ]);
    const err = v.error || c.error;
    if (err) {
      // 42P01 = Tabelle fehlt → Migration noch nicht eingespielt.
      setStatus(err.code === '42P01' || /does not exist|schema cache/i.test(err.message || '') ? 'missing' : 'error');
      setErrMsg(err.message || String(err));
      return;
    }
    setVotes(v.data || []);
    setComments(c.data || []);
    setStatus('ok');
  }, [trip.slug]);

  useEffect(() => {
    load();
    const iv = setInterval(() => { if (!document.hidden) load(); }, 20000);
    const vis = () => { if (!document.hidden) load(); };
    document.addEventListener('visibilitychange', vis);
    return () => { clearInterval(iv); document.removeEventListener('visibilitychange', vis); };
  }, [load]);

  const myKey = nameKey(name);
  const hasName = myKey.length > 0;
  const myAnswers = (pollId) => votes.find(v => v.poll_id === pollId && v.name_key === myKey)?.answers || {};

  const setAnswers = (pollId, answers) => {
    if (!hasName) return;
    const clean = Object.fromEntries(Object.entries(answers).filter(([, v]) => v !== undefined && v !== null));
    const display = name.trim();
    // Sofort lokal anzeigen, dann (gebündelt) speichern.
    setVotes(prev => {
      const rest = prev.filter(v => !(v.poll_id === pollId && v.name_key === myKey));
      return [...rest, { id: 'local-' + pollId, trip: trip.slug, poll_id: pollId, name: display, name_key: myKey, answers: clean, device: dev }];
    });
    clearTimeout(saveTimers.current[pollId]);
    saveTimers.current[pollId] = setTimeout(async () => {
      setSaving(true);
      const { error } = await supabase.from('ski_votes')
        .upsert({ trip: trip.slug, poll_id: pollId, name: display, answers: clean, device: dev, updated_at: new Date().toISOString() },
          { onConflict: 'trip,poll_id,name_key' });
      setSaving(false);
      if (error) { setStatus('error'); setErrMsg(error.message); } else load();
    }, 500);
  };

  const removeMe = async () => {
    if (!hasName) return;
    if (!window.confirm(`Alle Antworten von „${name.trim()}" löschen?`)) return;
    await supabase.from('ski_votes').delete().eq('trip', trip.slug).eq('name_key', myKey);
    load();
  };

  const postComment = async (text) => {
    const { error } = await supabase.from('ski_comments').insert({ trip: trip.slug, name: name.trim(), text, device: dev });
    if (error) { setStatus('error'); setErrMsg(error.message); } else load();
  };
  const deleteComment = async (id) => {
    await supabase.from('ski_comments').delete().eq('id', id).eq('device', dev);
    load();
  };

  const share = async () => {
    const url = window.location.origin + '/ski';
    try {
      if (navigator.share) { await navigator.share({ title: trip.title, url }); return; }
      await navigator.clipboard.writeText(url);
      setCopied(true); setTimeout(() => setCopied(false), 1500);
    } catch { /* abgebrochen */ }
  };

  return (
    <div className="min-h-screen bg-[#F2F2F7] text-slate-900"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif', paddingTop: 'env(safe-area-inset-top)' }}>
      <div className="max-w-xl mx-auto px-4 pt-6 pb-16">
        {/* Kopf */}
        <header className="mb-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="w-11 h-11 rounded-[14px] flex items-center justify-center text-white shrink-0" style={{ background: TINT }}>
                <Snowflake size={24} />
              </span>
              <div>
                <h1 className="text-[28px] font-bold tracking-tight leading-none">{trip.title}</h1>
                {trip.subtitle && <div className="text-[13px] text-[#8E8E93] mt-1">{trip.subtitle}</div>}
              </div>
            </div>
            <button type="button" onClick={share} aria-label="Link teilen"
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-[0_1px_2px_rgba(0,0,0,0.04)] active:scale-95" style={{ color: TINT }}>
              {copied ? <Check size={18} /> : <Share2 size={18} />}
            </button>
          </div>
          {trip.intro?.length > 0 && (
            <div className="mt-4 space-y-1.5 text-[15px] text-slate-700">
              {trip.intro.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          )}
        </header>

        {/* Status-Hinweise */}
        {status === 'missing' && (
          <div className="mb-5 rounded-[16px] bg-[#FF9500]/10 border border-[#FF9500]/30 px-4 py-3 text-[13px] text-slate-800">
            <div className="font-semibold mb-1">Datenbank noch nicht eingerichtet</div>
            Die Tabellen für die Abstimmung fehlen. Einmalig <code>docs/migration-ski-planung.sql</code> im Supabase-SQL-Editor ausführen, dann Seite neu laden.
          </div>
        )}
        {status === 'error' && (
          <div className="mb-5 rounded-[16px] bg-[#FF3B30]/10 border border-[#FF3B30]/30 px-4 py-3 text-[13px] text-slate-800 flex items-start gap-2">
            <div className="flex-1"><div className="font-semibold">Verbindung fehlgeschlagen</div><div className="text-[#8E8E93] break-all">{errMsg}</div></div>
            <button type="button" onClick={load} className="shrink-0 p-1" style={{ color: TINT }} aria-label="Neu laden"><RefreshCw size={16} /></button>
          </div>
        )}

        {/* Infos */}
        {trip.infos?.length > 0 && (
          <Card header={<span className="inline-flex items-center gap-1.5"><Info size={13} /> Infos</span>}>
            {trip.infos.map((i, idx) => (
              <Row key={idx}>
                <div className="flex justify-between gap-3 text-[15px]">
                  <span className="text-[#8E8E93]">{i.label}</span>
                  <span className="text-right text-slate-900">{i.value}</span>
                </div>
              </Row>
            ))}
          </Card>
        )}

        {/* Name */}
        <Card header={<span className="inline-flex items-center gap-1.5"><Users size={13} /> Dein Name</span>}
          footer={hasName ? 'Deine Antworten werden automatisch gespeichert.' : 'Ohne Namen kann nicht abgestimmt werden.'}>
          <Row>
            <input value={name} onChange={e => { setName(e.target.value); lsSet(NAME_KEY, e.target.value); }}
              placeholder="Vorname" autoComplete="given-name" autoCapitalize="words"
              className="w-full bg-transparent text-[17px] outline-none placeholder:text-[#C7C7CC]" />
          </Row>
        </Card>

        {/* Abstimmungen */}
        {trip.polls.map(p => {
          const pv = votes.filter(v => v.poll_id === p.id);
          const common = { poll: p, answers: myAnswers(p.id), onChange: (a) => setAnswers(p.id, a), votes: pv, disabled: !hasName || status !== 'ok' };
          return p.type === 'availability' ? <AvailabilityPoll key={p.id} {...common} /> : <ChoicePoll key={p.id} {...common} />;
        })}

        <Overview trip={trip} votes={votes} />

        {trip.comments && (
          <Comments trip={trip} name={name} comments={comments} onPost={postComment} onDelete={deleteComment} dev={dev} />
        )}

        {hasName && votes.some(v => v.name_key === myKey) && (
          <button type="button" onClick={removeMe} className="w-full text-center text-[13px] text-[#FF3B30] py-2 active:opacity-50">
            Meine Antworten löschen
          </button>
        )}

        <footer className="mt-8 text-center text-[12px] text-[#C7C7CC]">
          {saving ? 'Speichert…' : status === 'ok' ? 'Live · aktualisiert sich automatisch' : ''}
          <div className="mt-1"><a href="/" className="text-[#C7C7CC]">ArtCyc</a></div>
        </footer>
      </div>
    </div>
  );
}
