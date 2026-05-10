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
// Gibt zurück: { data, updated_at } oder null wenn nichts vorhanden.
export async function fetchCloudSnapshot() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from('user_data_snapshots')
    .select('data, updated_at')
    .eq('user_id', user.id)
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

// Bidirektionaler Code-Einlöser (Phase 9b):
// - Wenn der gefundene Athlet keinen User-Account hat → setzt eigenen User als auth_user_id
// - Wenn der gefundene Athlet keinen Coach hat → setzt eigenen User als coach (nur für coach/admin)
export async function redeemAthleteCode(code) {
  const { data, error } = await supabase.rpc('redeem_athlete_code', { input_code: code });
  return { data, error };
}
