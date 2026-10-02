// =============================================================
// DEMO-BACKEND — nur für die lokale Entwicklung (`npm run dev`, /web?demo)
// =============================================================
// Ersetzt den Supabase-Client durch einen Speicher im Browser, damit sich jede
// Ansicht ohne Login und ohne echte Datenbank durchklicken lässt — der App-Code
// läuft dabei UNVERÄNDERT (Laden, Speichern, Outbox, RPCs).
//
// Sicherheit:
//  • Wird nur geladen, wenn `import.meta.env.DEV` wahr ist (siehe supabase.js) —
//    im Produktions-Build fällt der Zweig samt Import weg.
//  • Im Demo-Modus gehen KEINE Anfragen an die echte Datenbank: Auth, Tabellen und
//    RPCs laufen hier; Fehlerberichte, Feedback-Mails und der KI-Chat werden
//    abgefangen. Nur `parse-maute` (liest eine Datei, speichert nichts) darf raus,
//    damit sich der .xls-Import testen lässt.
//
// Start:   http://localhost:5173/web?demo          (Daten bleiben über Reloads)
// Neu:     http://localhost:5173/web?demo=reset    (frische Beispieldaten)
//
// Dieses Modul hat bewusst KEINE Seiteneffekte beim Import.

const DB_KEY = 'artcyc:demo-db:v1';
const FLAG_KEY = 'artcyc:demo';

export const DEMO_USER = { id: 'dddddddd-0000-4000-8000-000000000001', email: 'demo@artcyc.local' };
const ME = DEMO_USER.id;
const OTHER_COACH = 'dddddddd-0000-4000-8000-000000000002';

export function demoRequested() {
  try {
    const sp = new URLSearchParams(window.location.search);
    if (sp.has('demo')) {
      sessionStorage.setItem(FLAG_KEY, '1');
      if (sp.get('demo') === 'reset') localStorage.removeItem(DB_KEY);
      return true;
    }
    return sessionStorage.getItem(FLAG_KEY) === '1';
  } catch { return false; }
}

// ---- Beispieldaten ------------------------------------------------------

function rng(seed) {   // deterministisch, damit Tests reproduzierbar sind
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}
function isoDaysAgo(n) {
  const d = new Date(); d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}
function uuid() {
  return (crypto && crypto.randomUUID) ? crypto.randomUUID()
    : 'xxxxxxxx-xxxx-4xxx-8xxx-xxxxxxxxxxxx'.replace(/x/g, () => ((Math.random() * 16) | 0).toString(16));
}
function code6() {
  const a = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = ''; for (let i = 0; i < 6; i++) s += a[(Math.random() * a.length) | 0];
  return s;
}

function seed() {
  const now = new Date().toISOString();
  const athletes = [
    { id: 'a0000000-0000-4000-8000-000000000001', name: 'Ruben', last_name: 'Geyer', type: 'athlete', discipline: '1er Kunstrad',
      notes: 'RKV Denkendorf', email: DEMO_USER.email, auth_user_id: ME, created_by_coach_id: null, claim_code: null,
      claim_code_used_at: null, join_code: null, created_at: '2024-01-01T10:00:00Z' },
    { id: 'a0000000-0000-4000-8000-000000000002', name: 'Lena', last_name: 'Maier', type: 'athlete', discipline: '1er Kunstrad',
      notes: 'RKV Denkendorf', email: null, auth_user_id: null, created_by_coach_id: ME, claim_code: '7F3K9Q',
      claim_code_used_at: null, join_code: null, created_at: '2024-02-01T10:00:00Z' },
    { id: 'a0000000-0000-4000-8000-000000000003', name: '2er Team Reudern', last_name: null, type: 'team', discipline: '2er',
      notes: 'RKV Denkendorf', email: null, auth_user_id: null, created_by_coach_id: ME, claim_code: null,
      claim_code_used_at: null, join_code: 'RVR42X', created_at: '2024-03-01T10:00:00Z' },
  ];
  const [A1, A2, T1] = athletes.map(a => a.id);
  const ex = (id, name, code, points, extra = {}) => ({
    id, owner_id: ME, name, uci_code: code, uci_disc: '1er', points, active: true, category_mode: 2,
    third_label: null, success_label: null, fail_label: null, default_series: 10, target_rate: null,
    has_rope_variant: false, created_at: '2024-01-02T10:00:00Z', deleted_at: null, ...extra,
  });
  const exercises = [
    ex('e0000000-0000-4000-8000-000000000001', 'Maute-Sprung', '1186a', 7.3,
      { category_mode: 3, third_label: 'Getroffen', success_label: 'Geklappt', fail_label: 'Gefährlich', has_rope_variant: true }),
    ex('e0000000-0000-4000-8000-000000000002', 'Lenkerstand', '1124c', 8.8),
    ex('e0000000-0000-4000-8000-000000000003', 'Steiger rw.', '1237a', 4.4),
    ex('e0000000-0000-4000-8000-000000000004', 'Kopfstand HR.', '1121a', 4.4),
    ex('e0000000-0000-4000-8000-000000000005', 'Sattelstand HR.', '1103a', 5.7),
    ex('e0000000-0000-4000-8000-000000000006', 'Standsteiger HR.', '1246a', 5.2, { active: false }),
  ];
  const r = rng(42);
  const sessions = [];
  const trained = exercises.slice(0, 5);
  for (let day = 240; day >= 0; day -= 1 + Math.floor(r() * 5)) {
    for (const e of trained) {
      if (r() < 0.45) continue;
      const n = 3 + Math.floor(r() * 9);
      const skill = 0.55 + (240 - day) / 240 * 0.25;   // wird mit der Zeit besser
      const entries = [];
      for (let i = 0; i < n; i++) {
        const x = r();
        entries.push(x < skill ? 'success' : (e.category_mode === 3 && x < skill + 0.12 ? 'third' : 'fail'));
      }
      sessions.push({
        id: uuid(), athlete_id: day % 11 === 0 ? A2 : A1, exercise_id: e.id, date: isoDaysAgo(day), entries,
        notes: '', exercise_name: e.name, with_rope: e.has_rope_variant ? r() < 0.6 : null, rep_count: null,
        created_at: now, created_by: ME, deleted_at: null,
      });
    }
  }
  const progEx = [
    { code: '1103a', name: 'Sattelstand HR.', points: 5.7 },
    { code: '1186a', name: 'Maute-Sprung', points: 7.3, marked: true },
    { code: '1124c', name: 'Lenkerstand', points: 8.8 },
    { code: '1237a', name: 'Steiger rw.', points: 4.4 },
    { code: '1121a', name: 'Kopfstand HR.', points: 4.4 },
    { code: '1246a', name: 'Standsteiger HR.', points: 5.2, marked: true },
    { code: '1104o', name: 'Frontlenkerstanddrehung aus Reitsitz T', points: 7.3 },
    { code: '1284a', name: 'Übergang Reitsitzsteiger Steuerrohrsteiger', points: 5.3 },
  ];
  const programs = [
    { id: 'p0000000-0000-4000-8000-000000000001', owner_id: ME, athlete_id: A1, name: '1er Kürprogramm',
      discipline: '1er', exercises: progEx, created_at: '2025-09-01T10:00:00Z', deleted_at: null },
    { id: 'p0000000-0000-4000-8000-000000000002', owner_id: ME, athlete_id: A2, name: 'Lena Kür',
      discipline: '1er', exercises: progEx.slice(0, 5).map(({ marked, ...e }) => e), created_at: '2025-10-01T10:00:00Z', deleted_at: null },
  ];
  const table = (seedN) => {
    const rr = rng(seedN);
    return progEx.map(e => {
      const t = { code: e.code, name: e.name, points: e.points };
      if (rr() < 0.5) t.cross = 1 + Math.floor(rr() * 2);
      if (rr() < 0.4) t.wave = 1;
      if (rr() < 0.15) t.bar = 1;
      if (rr() < 0.08) t.schwPct = 10;
      return t;
    });
  };
  const comp = (id, name, daysAgo, kind, s1, s2, kg = 2) => ({
    id, athlete_id: A1, program_id: programs[0].id, name, date: isoDaysAgo(daysAgo), location: kind === 'training' ? '' : 'Stuttgart',
    host: '', start_nr: '', table1: table(s1), table2: kg > 1 ? table(s2) : [], table3: null, table4: null,
    kampfgerichte: kg, abzug_gesamt: false, t1_schwierigkeit: 0, t2_schwierigkeit: 0, pdf_ref: null, target_score: null,
    kind, created_at: now, created_by: ME, deleted_at: null,
  });
  const competitions = [
    comp('c0000000-0000-4000-8000-000000000001', 'Kreismeisterschaft', 200, 'wettkampf', 11, 12),
    comp('c0000000-0000-4000-8000-000000000002', 'Bezirksmeisterschaft', 150, 'wettkampf', 21, 22),
    comp('c0000000-0000-4000-8000-000000000003', 'Landesmeisterschaft BW', 90, 'wettkampf', 31, 32),
    comp('c0000000-0000-4000-8000-000000000004', 'Deutschland-Cup', 30, 'wettkampf', 41, 42),
    comp('c0000000-0000-4000-8000-000000000005', 'Trainingsdurchlauf', 12, 'training', 51, 0, 1),
    comp('c0000000-0000-4000-8000-000000000006', 'Trainingsdurchlauf', 3, 'training', 61, 0, 1),
  ];
  return {
    profiles: [
      { id: ME, role: 'coach', display_name: 'Ruben', last_name: 'Geyer', license_no: '12345', created_at: '2024-01-01T10:00:00Z' },
      { id: OTHER_COACH, role: 'coach', display_name: 'Theresa', last_name: 'Trainerin', license_no: null, created_at: '2024-01-01T10:00:00Z' },
    ],
    athletes,
    team_members: [
      { id: uuid(), team_id: T1, athlete_id: A1, role: 'captain', added_by: ME, created_at: now },
      { id: uuid(), team_id: T1, athlete_id: A2, role: 'member', added_by: ME, created_at: now },
    ],
    athlete_coaches: [],
    coach_invites: [],
    exercises, sessions, programs, competitions,
    feedback_entries: [],
    user_data_snapshots: [{ user_id: ME, updated_at: now, data: {
      migrated_to_tables: true, athletes: [], programs: [], sessions: [], exercises: [], competitions: [], trainingPlans: [],
    } }],
    clubs: [{ id: uuid(), name: 'RKV Denkendorf', normalized: 'rkv denkendorf', usage_count: 5 }],
    uci_exercises: [],          // leer → App nimmt das eingebaute Reglement
    app_notices: [],
    app_notices_dismissed: [],
  };
}

// ---- Speicher -----------------------------------------------------------

let db = null;
function load() {
  if (db) return db;
  try { db = JSON.parse(localStorage.getItem(DB_KEY) || 'null'); } catch { db = null; }
  if (!db) { db = seed(); persist(); }
  return db;
}
function persist() { try { localStorage.setItem(DB_KEY, JSON.stringify(db)); } catch { /* voll */ } }
function table(name) { const d = load(); if (!d[name]) d[name] = []; return d[name]; }
const clone = (x) => (x == null ? x : JSON.parse(JSON.stringify(x)));

// ---- Abfragen (PostgREST-ähnlich) ---------------------------------------

class Query {
  constructor(tableName) {
    this.t = tableName; this.op = 'select'; this.payload = null; this.filters = [];
    this.orderBy = []; this.lim = null; this.rng = null; this.one = null; this.returning = false; this.opts = {};
  }
  select(_cols, o = {}) { if (this.op !== 'select') this.returning = true; if (o.count) this.countMode = o.count; if (o.head) this.head = true; return this; }
  insert(v) { this.op = 'insert'; this.payload = v; return this; }
  upsert(v, opts = {}) { this.op = 'upsert'; this.payload = v; this.opts = opts; return this; }
  update(v) { this.op = 'update'; this.payload = v; return this; }
  delete() { this.op = 'delete'; return this; }
  eq(c, v) { this.filters.push(r => r[c] === v || (r[c] != null && v != null && String(r[c]) === String(v))); return this; }
  neq(c, v) { this.filters.push(r => r[c] !== v); return this; }
  is(c, v) { this.filters.push(r => (v === null ? r[c] == null : r[c] === v)); return this; }
  gte(c, v) { this.filters.push(r => r[c] != null && r[c] >= v); return this; }
  gt(c, v) { this.filters.push(r => r[c] != null && r[c] > v); return this; }
  lte(c, v) { this.filters.push(r => r[c] != null && r[c] <= v); return this; }
  lt(c, v) { this.filters.push(r => r[c] != null && r[c] < v); return this; }
  in(c, arr) { this.filters.push(r => (arr || []).includes(r[c])); return this; }
  not(c, op, v) {
    if (op === 'is') this.filters.push(r => (v === null ? r[c] != null : r[c] !== v));
    else if (op === 'eq') this.filters.push(r => r[c] !== v);
    return this;
  }
  contains(c, v) { this.filters.push(r => Array.isArray(r[c]) && [].concat(v).every(x => r[c].includes(x))); return this; }
  match(obj) { for (const [k, v] of Object.entries(obj || {})) this.eq(k, v); return this; }
  order(c, { ascending = true } = {}) { this.orderBy.push([c, ascending]); return this; }
  limit(n) { this.lim = n; return this; }
  range(a, b) { this.rng = [a, b]; return this; }
  single() { this.one = 'single'; return this; }
  maybeSingle() { this.one = 'maybe'; return this; }
  throwOnError() { return this; }
  abortSignal() { return this; }
  then(res, rej) { return Promise.resolve().then(() => this.run()).then(res, rej); }

  run() {
    const rows = table(this.t);
    const match = (r) => this.filters.every(f => f(r));
    let out = [];
    if (this.op === 'select') {
      out = rows.filter(match);
    } else if (this.op === 'insert' || this.op === 'upsert') {
      const list = [].concat(this.payload || []);
      const key = (this.opts.onConflict || (this.t === 'user_data_snapshots' ? 'user_id' : 'id')).split(',')[0].trim();
      for (const raw of list) {
        // Wie PostgREST: undefined-Felder fallen beim JSON weg und bleiben unverändert.
        const row = JSON.parse(JSON.stringify(raw));
        if (this.t !== 'user_data_snapshots' && this.t !== 'app_notices_dismissed' && !row.id) row.id = uuid();
        const i = (this.op === 'upsert' && row[key] != null) ? rows.findIndex(x => x[key] === row[key]) : -1;
        if (i >= 0) { rows[i] = { ...rows[i], ...row }; out.push(rows[i]); continue; }
        // Nur beim Anlegen: Spalten-Defaults wie in der DB.
        if (!row.created_at && this.t !== 'user_data_snapshots') row.created_at = new Date().toISOString();
        if (this.t === 'sessions' || this.t === 'competitions') row.created_by = row.created_by || ME;
        rows.push(row); out.push(row);
      }
      persist();
    } else if (this.op === 'update') {
      for (let i = 0; i < rows.length; i++) if (match(rows[i])) { rows[i] = { ...rows[i], ...this.payload }; out.push(rows[i]); }
      persist();
    } else if (this.op === 'delete') {
      const keep = [];
      for (const r of rows) (match(r) ? out : keep).push(r);
      load()[this.t] = keep; persist();
    }
    for (const [c, asc] of [...this.orderBy].reverse()) {
      out = [...out].sort((a, b) => {
        const x = a[c], y = b[c];
        if (x == null && y == null) return 0; if (x == null) return 1; if (y == null) return -1;
        return (x < y ? -1 : x > y ? 1 : 0) * (asc ? 1 : -1);
      });
    }
    if (this.rng) out = out.slice(this.rng[0], this.rng[1] + 1);
    if (this.lim != null) out = out.slice(0, this.lim);
    // count/head wie supabase-js: Anzahl der Treffer, bei head ohne Zeilen.
    if (this.countMode && this.op === 'select') return { data: this.head ? null : clone(out), count: out.length, error: null };
    const data = clone(out);
    if (this.op !== 'select' && !this.returning && !this.one) return { data: null, error: null };
    if (this.one === 'single') {
      if (data.length !== 1) return { data: null, error: { message: 'JSON object requested, multiple (or no) rows returned', code: 'PGRST116' } };
      return { data: data[0], error: null };
    }
    if (this.one === 'maybe') return { data: data[0] || null, error: null };
    return { data, error: null };
  }
}

// ---- RPCs (nachgebildet, so weit die App sie braucht) --------------------

function rpc(name, args = {}) {
  const athletes = table('athletes');
  const ok = (data) => ({ data, error: null });
  const fail = (message) => ({ data: null, error: { message } });
  const canManage = (id) => {
    const a = athletes.find(x => x.id === id);
    return !!a && (a.auth_user_id === ME || (a.auth_user_id == null && a.created_by_coach_id === ME));
  };
  switch (name) {
    case 'generate_claim_code': return ok(code6());
    case 'regenerate_team_join_code': {
      const t = athletes.find(x => x.id === args.team_uuid);
      if (!t || !canManage(t.id)) return fail('Keine Berechtigung');
      t.join_code = code6(); persist(); return ok(t.join_code);
    }
    case 'generate_coach_invite': {
      if (!canManage(args.target_athlete_id)) return fail('Du darfst keinen Code fuer diesen Sportler generieren');
      const row = { id: uuid(), athlete_id: args.target_athlete_id, claim_code: code6(), label: args.label_text || null,
        claim_code_rotated_at: new Date().toISOString(), used_at: null, used_by_coach_id: null, created_at: new Date().toISOString() };
      table('coach_invites').push(row); persist();
      return ok({ id: row.id, claim_code: row.claim_code, label: row.label, rotated_at: row.claim_code_rotated_at });
    }
    case 'rotate_stale_coach_invites': return ok(0);
    case 'join_team': {
      const t = athletes.find(x => x.type === 'team' && x.join_code && x.join_code === String(args.input_code || args.code || '').trim().toUpperCase());
      if (!t) return fail('Code ungültig');
      const me = athletes.find(x => x.auth_user_id === ME);
      const tm = table('team_members');
      if (me && !tm.some(m => m.team_id === t.id && m.athlete_id === me.id)) tm.push({ id: uuid(), team_id: t.id, athlete_id: me.id, role: 'member', added_by: ME, created_at: new Date().toISOString() });
      persist(); return ok({ team_id: t.id, team_name: t.name });
    }
    case 'redeem_athlete_code': return fail('Im Demo-Modus nicht möglich (braucht ein zweites Konto).');
    case 'move_athlete_data': {
      const { p_source, p_target, p_sessions = true, p_competitions = true } = args;
      if (!canManage(p_source)) return fail('Keine Berechtigung');
      let s = 0, c = 0;
      if (p_sessions) for (const r of table('sessions')) if (r.athlete_id === p_source && !r.deleted_at) { r.athlete_id = p_target; s++; }
      if (p_competitions) for (const r of table('competitions')) if (r.athlete_id === p_source && !r.deleted_at) { r.athlete_id = p_target; c++; }
      persist(); return ok({ sessions: s, competitions: c });
    }
    case 'merge_athlete': {
      const { p_source, p_target } = args;
      for (const r of table('sessions')) if (r.athlete_id === p_source) r.athlete_id = p_target;
      for (const r of table('competitions')) if (r.athlete_id === p_source) r.athlete_id = p_target;
      load().athletes = athletes.filter(a => a.id !== p_source); persist(); return ok(true);
    }
    case 'register_club': return ok(true);
    case 'migrate_blob_to_tables': return ok({ ok: true });
    case 'delete_my_account': return fail('Im Demo-Modus nicht möglich.');
    default: return fail('RPC ' + name + ' gibt es im Demo-Modus nicht.');
  }
}

// ---- Client -------------------------------------------------------------

export function createDemoClient() {
  load();
  let signedIn = true;
  const listeners = new Set();
  const session = () => (signedIn ? { access_token: 'demo', token_type: 'bearer', user: { ...DEMO_USER, aud: 'authenticated' } } : null);
  const emit = (evt) => setTimeout(() => listeners.forEach(cb => { try { cb(evt, session()); } catch { /* egal */ } }), 0);
  const notInDemo = (what) => Promise.resolve({ data: null, error: { message: what + ' ist im Demo-Modus nicht verfügbar.' } });

  installFetchGuard();

  return {
    __demo: true,
    from: (t) => new Query(t),
    rpc: (name, args) => Promise.resolve().then(() => rpc(name, args)),
    functions: { invoke: (name) => notInDemo('Server-Funktion „' + name + '"') },
    storage: { from: () => ({ upload: () => notInDemo('Datei-Upload'), getPublicUrl: () => ({ data: { publicUrl: '' } }), remove: () => notInDemo('Löschen') }) },
    channel: () => ({ on() { return this; }, subscribe() { return this; }, unsubscribe() {} }),
    removeChannel: () => {},
    auth: {
      getSession: async () => ({ data: { session: session() }, error: null }),
      getUser: async () => ({ data: { user: signedIn ? { ...DEMO_USER } : null }, error: null }),
      onAuthStateChange: (cb) => { listeners.add(cb); return { data: { subscription: { unsubscribe: () => listeners.delete(cb) } } }; },
      signInWithPassword: async () => { signedIn = true; emit('SIGNED_IN'); return { data: { session: session(), user: DEMO_USER }, error: null }; },
      signUp: async () => ({ data: { user: DEMO_USER, session: null }, error: null }),
      signOut: async () => { signedIn = false; emit('SIGNED_OUT'); return { error: null }; },
      updateUser: async (u) => ({ data: { user: { ...DEMO_USER, ...u } }, error: null }),
      verifyOtp: async () => { signedIn = true; emit('SIGNED_IN'); return { data: { session: session() }, error: null }; },
      setSession: async () => ({ data: { session: session() }, error: null }),
      resetPasswordForEmail: async () => ({ data: {}, error: null }),
      resend: async () => ({ data: {}, error: null }),
      exchangeCodeForSession: async () => ({ data: { session: session() }, error: null }),
    },
  };
}

// Fehlerberichte, Feedback-Mails und KI-Chat dürfen aus der Demo NICHT an den echten
// Server. `parse-maute` darf (liest nur eine Datei, speichert nichts).
function installFetchGuard() {
  if (window.__artcycDemoFetch) return;
  window.__artcycDemoFetch = true;
  const orig = window.fetch.bind(window);
  window.fetch = (input, init) => {
    const url = typeof input === 'string' ? input : (input && input.url) || '';
    if (/supabase\.co\//.test(url) && !/\/functions\/v1\/parse-maute/.test(url)) {
      console.info('[Demo] Anfrage abgefangen:', url.replace(/\?.*$/, ''));
      const body = /\/functions\/v1\/chat/.test(url)
        ? { reply: 'Der KI-Coach ist im Demo-Modus aus.', demo: true }
        : { ok: true, demo: true };
      return Promise.resolve(new Response(JSON.stringify(body), { status: 200, headers: { 'Content-Type': 'application/json' } }));
    }
    return orig(input, init);
  };
}
