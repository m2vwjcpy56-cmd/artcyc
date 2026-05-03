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
