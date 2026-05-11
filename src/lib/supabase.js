import { createClient } from '@supabase/supabase-js';

// Anon-Key ist explizit als public gedacht und durch Row Level Security
// in der DB abgesichert — kann/darf im Frontend stehen.
const SUPABASE_URL = 'https://cpxsfctijcsezkspjlxy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNweHNmY3RpamNzZXprc3BqbHh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4MjA0NzUsImV4cCI6MjA5MzM5NjQ3NX0.kbEF8fYUUoznrQMdmAKvoGQ03kSTCh3qN505Af9yNS4';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});

export async function getCurrentProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  return profile ? { ...profile, email: user.email } : null;
}

// =============================================================
// Cloud-Snapshot (Phase 3a — JSONB-basierte Datensynchronisation)
// =============================================================

// Lädt den letzten Snapshot des aktuellen Users.
// Mit targetUserId: lädt Snapshot eines anderen Users (Coach-Lesezugriff).
// Gibt zurück: { data, updated_at } oder null wenn nichts vorhanden.
export async function fetchCloudSnapshot(targetUserId = null) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const uid = targetUserId || user.id;
  const { data, error } = await supabase
    .from('user_data_snapshots')
    .select('data, updated_at')
    .eq('user_id', uid)
    .maybeSingle();
  if (error) {
    console.warn('Cloud-Snapshot fetch fehlgeschlagen:', error.message);
    return null;
  }
  return data;
}

// Schreibt den aktuellen App-State in die Cloud.
// upsert: ersetzt vorhandene Zeile. Last-write-wins.
export async function pushCloudSnapshot(appData) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: { message: 'Nicht angemeldet' } };
  const { error } = await supabase
    .from('user_data_snapshots')
    .upsert({ user_id: user.id, data: appData, updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
  if (error) console.warn('Cloud-Push fehlgeschlagen:', error.message);
  return { error };
}

// =============================================================
// Athletes — relationale Tabelle (Phase 9a)
// =============================================================
// Sichtbar für: eigenen Eintrag, vom Coach erstellte Einträge, Admin sieht alle.
// Schreibrechte: Coach/Admin können anlegen, eigener User + Coach können editieren.

// Lädt alle Profiles (Display-Name + Rolle) für Anzeige.
// RLS erlaubt allen Authenticated das Lesen der Profile-Tabelle.
export async function fetchProfiles() {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, role, display_name');
  if (error) {
    console.warn('Profiles fetch fehlgeschlagen:', error.message);
    return [];
  }
  return data || [];
}

export async function fetchAthletes() {
  const { data, error } = await supabase
    .from('athletes')
    .select('id, name, type, notes, email, auth_user_id, created_by_coach_id, claim_code, created_at')
    .order('created_at', { ascending: true });
  if (error) {
    console.warn('Athletes fetch fehlgeschlagen:', error.message);
    return [];
  }
  return data || [];
}

export async function createAthlete({ name, type = 'athlete', notes = '', email = '' }) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: { message: 'Nicht angemeldet' } };
  const payload = {
    name,
    type,
    notes: notes || '',
    email: email || '',
    created_by_coach_id: user.id
  };
  const { data, error } = await supabase
    .from('athletes')
    .insert(payload)
    .select()
    .single();
  return { data, error };
}

export async function updateAthlete(id, fields) {
  const { data, error } = await supabase
    .from('athletes')
    .update(fields)
    .eq('id', id)
    .select()
    .single();
  return { data, error };
}

export async function deleteAthlete(id) {
  const { error } = await supabase.from('athletes').delete().eq('id', id);
  return { error };
}

export async function generateClaimCodeForAthlete(athleteId) {
  // Server-Funktion generiert den Code (vermeidet Race-Conditions bei Code-Kollisionen)
  const { data: codeData, error: rpcError } = await supabase.rpc('generate_claim_code');
  if (rpcError) return { error: rpcError };
  const { data, error } = await supabase
    .from('athletes')
    .update({ claim_code: codeData, claim_code_used_at: null })
    .eq('id', athleteId)
    .select()
    .single();
  return { data, error };
}

// Setzt den Claim-Code wieder zurück (z.B. wenn User den Code nicht mehr teilen will)
export async function clearClaimCodeForAthlete(athleteId) {
  const { data, error } = await supabase
    .from('athletes')
    .update({ claim_code: null })
    .eq('id', athleteId)
    .select()
    .single();
  return { data, error };
}

// =============================================================
// Sessions / Competitions / Programs / Exercises CRUD (Phase 9d-3)
// =============================================================

export async function fetchSessions() {
  const { data, error } = await supabase
    .from('sessions')
    .select('id, athlete_id, exercise_id, date, entries, notes, exercise_name, created_at')
    .order('date', { ascending: false });
  if (error) { console.warn('Sessions fetch:', error.message); return []; }
  return data || [];
}

export async function insertSession({ athlete_id, exercise_id, date, entries, notes = '', exercise_name = '' }) {
  const { data, error } = await supabase
    .from('sessions')
    .insert({ athlete_id, exercise_id, date, entries, notes, exercise_name })
    .select()
    .single();
  return { data, error };
}

export async function updateSession(id, fields) {
  const { data, error } = await supabase.from('sessions').update(fields).eq('id', id).select().single();
  return { data, error };
}

export async function deleteSession(id) {
  const { error } = await supabase.from('sessions').delete().eq('id', id);
  return { error };
}

export async function bulkInsertSessions(sessions) {
  if (!sessions || sessions.length === 0) return { data: [], error: null };
  const { data, error } = await supabase.from('sessions').insert(sessions).select();
  return { data, error };
}

export async function deleteSessionsByExercise(exerciseId) {
  const { error } = await supabase.from('sessions').delete().eq('exercise_id', exerciseId);
  return { error };
}

// === Competitions ===
export async function fetchCompetitions() {
  const { data, error } = await supabase
    .from('competitions')
    .select('id, athlete_id, program_id, name, date, location, host, start_nr, table1, table2, t1_schwierigkeit, t2_schwierigkeit, pdf_ref, target_score, created_at')
    .order('date', { ascending: false });
  if (error) { console.warn('Competitions fetch:', error.message); return []; }
  return data || [];
}
export async function upsertCompetition(comp) {
  const payload = { ...comp };
  // Falls keine id, lass DB generieren
  if (!payload.id) delete payload.id;
  const { data, error } = await supabase.from('competitions').upsert(payload).select().single();
  return { data, error };
}
export async function deleteCompetition(id) {
  const { error } = await supabase.from('competitions').delete().eq('id', id);
  return { error };
}

// === Programs ===
export async function fetchPrograms() {
  const { data, error } = await supabase
    .from('programs')
    .select('id, owner_id, name, discipline, exercises, created_at')
    .order('created_at', { ascending: true });
  if (error) { console.warn('Programs fetch:', error.message); return []; }
  return data || [];
}
export async function upsertProgram(prog) {
  const payload = { ...prog };
  if (!payload.id) delete payload.id;
  const { data, error } = await supabase.from('programs').upsert(payload).select().single();
  return { data, error };
}
export async function deleteProgram(id) {
  const { error } = await supabase.from('programs').delete().eq('id', id);
  return { error };
}

// === Exercises ===
export async function fetchExercises() {
  const { data, error } = await supabase
    .from('exercises')
    .select('id, owner_id, name, uci_code, uci_disc, points, active, category_mode, third_label, success_label, fail_label, default_series, target_rate, created_at')
    .order('created_at', { ascending: true });
  if (error) { console.warn('Exercises fetch:', error.message); return []; }
  return data || [];
}
export async function upsertExercise(ex) {
  const payload = { ...ex };
  if (!payload.id) delete payload.id;
  const { data, error } = await supabase.from('exercises').upsert(payload).select().single();
  return { data, error };
}
export async function deleteExercise(id) {
  const { error } = await supabase.from('exercises').delete().eq('id', id);
  return { error };
}

// Phase 9d-2: migriert Blob-Daten (sessions/competitions/programs/exercises)
// in die relationalen DB-Tabellen. Idempotent durch Setzen eines Flags.
export async function migrateBlobToTables() {
  const { data, error } = await supabase.rpc('migrate_blob_to_tables');
  return { data, error };
}

// Bidirektionaler Code-Einlöser (Phase 9b):
// - Wenn der gefundene Athlet keinen User-Account hat → setzt eigenen User als auth_user_id
// - Wenn der gefundene Athlet keinen Coach hat → setzt eigenen User als coach (nur für coach/admin)
export async function redeemAthleteCode(code) {
  const { data, error } = await supabase.rpc('redeem_athlete_code', { input_code: code });
  return { data, error };
}
