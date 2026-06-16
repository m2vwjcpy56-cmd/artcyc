import { createClient } from '@supabase/supabase-js';
import { normClub } from './clubs.js';

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

// Setzt den Nachnamen des aktuell eingeloggten Users (profiles.last_name).
// Wird beim Nachtrag-Pop-up für Bestands-User genutzt. Schreibt zusätzlich
// in die Auth-Metadaten, damit der Wert konsistent bleibt.
export async function updateMyLastName(lastName) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: { message: 'Nicht angemeldet' } };
  const clean = (lastName || '').trim();
  const { data, error } = await supabase
    .from('profiles')
    .update({ last_name: clean })
    .eq('id', user.id)
    .select()
    .single();
  // Nachname auch in den eigenen Sportler-Eintrag spiegeln, damit er im
  // Sportler-Editor auftaucht (sonst bleibt athletes.last_name leer).
  try { await supabase.from('athletes').update({ last_name: clean }).eq('auth_user_id', user.id); } catch { /* egal */ }
  // Best-effort: Auth-Metadaten mitschreiben (nicht zwingend für die App).
  try { await supabase.auth.updateUser({ data: { last_name: clean } }); } catch { /* egal */ }
  return { data, error };
}

// Setzt die Lizenznummer (profiles.license_no) des eingeloggten Users.
export async function updateMyLicense(licenseNo) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: { message: 'Nicht angemeldet' } };
  const clean = (licenseNo || '').trim();
  const { data, error } = await supabase
    .from('profiles')
    .update({ license_no: clean })
    .eq('id', user.id)
    .select()
    .single();
  return { data, error };
}

// Schreibt eine (z. B. aus einem Wertungsbogen erkannte) Lizenznummer in das
// eigene Profil — aber NUR, wenn dort noch keine hinterlegt ist (nie
// überschreiben). Best effort für die PDF-Auto-Erkennung.
export async function saveLicenseIfEmpty(licenseNo) {
  const clean = (licenseNo || '').trim();
  if (!clean) return { skipped: true };
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { skipped: true };
  const { data: prof } = await supabase
    .from('profiles').select('license_no').eq('id', user.id).maybeSingle();
  if (prof && (prof.license_no || '').trim()) return { skipped: true };
  const { error } = await supabase.from('profiles').update({ license_no: clean }).eq('id', user.id);
  return { error, saved: !error };
}

// Setzt den Verein (athletes.notes) des eigenen Sportler-Eintrags.
export async function updateMyClub(club) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: { message: 'Nicht angemeldet' } };
  const clean = (club || '').trim();
  const { data, error } = await supabase
    .from('athletes')
    .update({ notes: clean })
    .eq('auth_user_id', user.id)
    .select()
    .maybeSingle();
  return { data, error };
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
    .select('id, name, last_name, type, discipline, notes, email, auth_user_id, created_by_coach_id, claim_code, join_code, created_at')
    .order('created_at', { ascending: true });
  if (error) {
    console.warn('Athletes fetch fehlgeschlagen:', error.message);
    return [];
  }
  return data || [];
}

export async function createAthlete({ name, last_name = '', type = 'athlete', notes = '', email = '' }) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: { message: 'Nicht angemeldet' } };
  const payload = {
    name,
    last_name: last_name || '',
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

// =============================================================
// FEEDBACK — Coaching-Feedback pro Übung (+ Sportler/Team).
// Sichtbarkeit via RLS (can_access_athlete) — eigene + Trainer + Team.
// =============================================================

// Lädt alle Feedbacks für ein Subjekt (Sportler oder Team). Optional auf eine
// Übung gefiltert (exercise_ref ODER exercise_code).
export async function fetchFeedback(athleteId) {
  if (!athleteId) return [];
  const { data, error } = await supabase
    .from('feedback_entries')
    .select('*')
    .eq('athlete_id', athleteId)
    .order('created_at', { ascending: false });
  if (error) { console.warn('feedback fetch fehlgeschlagen:', error.message); return []; }
  return data || [];
}

export async function addFeedback(entry) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: { message: 'Nicht angemeldet' } };
  const payload = { ...entry, created_by: user.id };
  const { data, error } = await supabase
    .from('feedback_entries').insert(payload).select().single();
  return { data, error };
}

export async function updateFeedback(id, fields) {
  const { data, error } = await supabase
    .from('feedback_entries').update(fields).eq('id', id).select().single();
  return { data, error };
}

export async function deleteFeedback(id) {
  const { error } = await supabase.from('feedback_entries').delete().eq('id', id);
  return { error };
}

// KI-Zusammenfassung der Feedbacks zu einer Übung. items = [{fehlerbild, handlungsanweisung}].
// Gibt { summary } oder null bei Fehler.
export async function summarizeFeedback(exercise, items) {
  try {
    const { data, error } = await supabase.functions.invoke('summarize-feedback', {
      body: { exercise, items }
    });
    if (error) { console.warn('summarize-feedback fehlgeschlagen:', error.message); return null; }
    return data || null;
  } catch (e) {
    console.warn('summarize-feedback Ausnahme:', e?.message); return null;
  }
}

// =============================================================
// TEAMS — ein Team ist eine athletes-Zeile mit type='team' (eigenes
// Trainings-Subjekt). team_members verknüpft echte Accounts damit.
// =============================================================

// Alle Mitgliedschaften, die ich sehen darf (RLS filtert auf meine Teams).
export async function fetchTeamMembers() {
  const { data, error } = await supabase
    .from('team_members')
    .select('team_id, athlete_id, role, added_by, created_at');
  if (error) {
    console.warn('team_members fetch fehlgeschlagen:', error.message);
    return [];
  }
  return data || [];
}

// Legt ein Team-Subjekt an und fügt den Ersteller (falls er einen eigenen
// Athleten-Eintrag hat) direkt als Captain hinzu.
export async function createTeam({ name, discipline = '', club = '' }) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: { message: 'Nicht angemeldet' } };
  const { data: team, error } = await supabase
    .from('athletes')
    .insert({
      name,
      type: 'team',
      discipline: discipline || '',
      notes: club || '',
      created_by_coach_id: user.id
    })
    .select()
    .single();
  if (error) return { error };
  // Ersteller als Captain (nur wenn er selbst einen Athleten-Eintrag hat)
  const { data: me } = await supabase
    .from('athletes').select('id').eq('auth_user_id', user.id).limit(1).maybeSingle();
  if (me?.id) {
    const { error: memErr } = await supabase
      .from('team_members')
      .insert({ team_id: team.id, athlete_id: me.id, role: 'captain', added_by: user.id });
    if (memErr) console.warn('Captain-Zuordnung fehlgeschlagen:', memErr.message);
  }
  return { data: team };
}

export async function updateTeam(id, fields) {
  const { data, error } = await supabase
    .from('athletes').update(fields).eq('id', id).select().single();
  return { data, error };
}

export async function deleteTeam(id) {
  // team_members werden per ON DELETE CASCADE mit entfernt.
  const { error } = await supabase.from('athletes').delete().eq('id', id);
  return { error };
}

export async function addTeamMember(teamId, athleteId, role = 'member') {
  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from('team_members')
    .insert({ team_id: teamId, athlete_id: athleteId, role, added_by: user?.id || null })
    .select()
    .single();
  return { data, error };
}

export async function removeTeamMember(teamId, athleteId) {
  const { error } = await supabase
    .from('team_members').delete().eq('team_id', teamId).eq('athlete_id', athleteId);
  return { error };
}

// Selbstlernende Vereinsliste: lädt von Nutzern eingegebene Vereine, die oft
// genug genannt wurden (>= minCount), als Vorschläge für alle.
export async function fetchClubs(minCount = 2) {
  const { data, error } = await supabase
    .from('clubs')
    .select('name, country, usage_count')
    .gte('usage_count', minCount)
    .order('usage_count', { ascending: false })
    .limit(1000);
  if (error) { console.warn('clubs fetch fehlgeschlagen:', error.message); return []; }
  return data || [];
}

// KI-Abgleich eines neuen Vereinsnamens (Tippfehler/Dublette/Schreibweise).
// candidates = kleine Liste bekannter Namen zur Dubletten-Erkennung.
// Gibt { canonical, country, isClub, duplicateOf } oder null bei Fehler.
export async function normalizeClub(name, candidates = []) {
  try {
    const { data, error } = await supabase.functions.invoke('normalize-club', {
      body: { name, candidates }
    });
    if (error) { console.warn('normalize-club fehlgeschlagen:', error.message); return null; }
    return data || null;
  } catch (e) {
    console.warn('normalize-club Ausnahme:', e?.message); return null;
  }
}

// Registriert einen eingegebenen Verein (Crowdsource). p_norm wird im Client
// mit normClub() berechnet (gleiche Normalisierung wie die Vorschlagssuche).
export async function registerClub(name, norm, country = '') {
  if (!name || !norm) return { data: null };
  const { data, error } = await supabase.rpc('register_club', {
    p_name: name, p_norm: norm, p_country: country
  });
  if (error) console.warn('register_club fehlgeschlagen:', error.message);
  return { data, error };
}

// Einen eingegebenen Verein erfassen: bekannte Vereine nur hochzählen, neue
// erst per KI normalisieren (Tippfehler/Dublette/Land), dann registrieren.
// knownNames = kuratierte + bereits bekannte Namen (für Dubletten-Abgleich).
export async function recordClubEntry(name, knownNames = []) {
  const clean = (name || '').trim();
  const norm = normClub(clean);
  if (!clean || !norm) return;
  const knownSet = new Set((knownNames || []).map(normClub));
  if (knownSet.has(norm)) { await registerClub(clean, norm); return; }
  let finalName = clean, country = '';
  try {
    const res = await normalizeClub(clean, (knownNames || []).slice(0, 40));
    if (res?.duplicateOf) finalName = res.duplicateOf;
    else if (res?.canonical) { finalName = res.canonical; country = res.country || ''; }
  } catch { /* KI optional */ }
  await registerClub(finalName, normClub(finalName), country);
}

// Beitritt per Code (Self-Join). Gibt { data: teamId } oder { error }.
export async function joinTeamByCode(code) {
  const normalized = (code || '').toUpperCase().replace(/[\s-]/g, '');
  const { data, error } = await supabase.rpc('join_team', { input_code: normalized });
  return { data, error };
}

// (Re)generiert den Beitritts-Code eines Teams (nur Verwalter). Gibt Code zurück.
export async function regenerateTeamJoinCode(teamId) {
  const { data, error } = await supabase.rpc('regenerate_team_join_code', { team_uuid: teamId });
  return { data, error };
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
    .select('id, athlete_id, exercise_id, date, entries, notes, exercise_name, with_rope, created_at')
    .order('date', { ascending: false });
  if (error) { console.warn('Sessions fetch:', error.message); return []; }
  return data || [];
}

export async function insertSession({ athlete_id, exercise_id, date, entries, notes = '', exercise_name = '', with_rope = null }) {
  const { data, error } = await supabase
    .from('sessions')
    .insert({ athlete_id, exercise_id, date, entries, notes, exercise_name, with_rope })
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

/**
 * Sessions in einer SQL-Anfrage massenhaft aktualisieren.
 * filter: { exercise_id?, with_rope_is? } — beides optional, beide AND-kombiniert
 * fields: { with_rope?, notes?, date?, entries? } — DB-Feldnamen (snake_case)
 */
export async function bulkUpdateSessions(filter = {}, fields = {}) {
  let q = supabase.from('sessions').update(fields);
  if (filter.exercise_id) q = q.eq('exercise_id', filter.exercise_id);
  if (typeof filter.with_rope_is === 'boolean') q = q.eq('with_rope', filter.with_rope_is);
  const { data, error } = await q.select('id');
  return { data, error, count: data?.length || 0 };
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
  // owner_id IMMER setzen — die RLS-Policy programs_write verlangt
  // owner_id = auth.uid() im WITH CHECK. Ohne owner_id wird der INSERT
  // still verworfen (z. B. ein beim Wettkampf-Import neu angelegtes Programm),
  // wodurch danach auch der Wettkampf (program_id-FK) nicht gespeichert wird.
  if (payload.owner_id == null) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) payload.owner_id = user.id;
  }
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
    .select('id, owner_id, name, uci_code, uci_disc, points, active, category_mode, third_label, success_label, fail_label, default_series, target_rate, has_rope_variant, created_at')
    .order('created_at', { ascending: true });
  if (error) { console.warn('Exercises fetch:', error.message); return []; }
  return data || [];
}
export async function upsertExercise(ex) {
  const payload = { ...ex };
  if (!payload.id) delete payload.id;
  // owner_id IMMER setzen — sonst landen Bulk-Importe als „globale UCI-Übungen"
  // (owner_id IS NULL), was nur Admin-/Seed-Daten vorbehalten ist und beim
  // PDF-Import zu Müll-Einträgen mit generischen Namen geführt hat.
  if (payload.owner_id == null) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) payload.owner_id = user.id;
  }
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

// =============================================================
// Multi-Trainer (Phase 11) — athlete_coaches + coach_invites
// =============================================================
// Mehrere Trainer pro Sportler. Jeder Trainer hat seinen eigenen Code.
// Codes rotieren automatisch, wenn sie >24h alt und nicht eingelöst sind
// (Lazy-Rotation beim Anzeigen).

export async function generateCoachInvite(athleteId, label = null) {
  const { data, error } = await supabase.rpc('generate_coach_invite', {
    target_athlete_id: athleteId,
    label_text: label,
  });
  return { data, error };
}

export async function rotateStaleCoachInvites(athleteId) {
  const { data, error } = await supabase.rpc('rotate_stale_coach_invites', {
    target_athlete_id: athleteId,
  });
  return { data, error };
}

export async function fetchCoachInvites(athleteId = null) {
  let q = supabase.from('coach_invites')
    .select('id, athlete_id, claim_code, label, claim_code_rotated_at, used_at, used_by_coach_id, created_at')
    .order('created_at', { ascending: false });
  if (athleteId) q = q.eq('athlete_id', athleteId);
  const { data, error } = await q;
  if (error) { console.warn('coach_invites fetch:', error.message); return []; }
  return data || [];
}

export async function deleteCoachInvite(id) {
  const { error } = await supabase.from('coach_invites').delete().eq('id', id);
  return { error };
}

export async function fetchAthleteCoaches(athleteId = null) {
  let q = supabase.from('athlete_coaches')
    .select('athlete_id, coach_id, added_at')
    .order('added_at', { ascending: true });
  if (athleteId) q = q.eq('athlete_id', athleteId);
  const { data, error } = await q;
  if (error) { console.warn('athlete_coaches fetch:', error.message); return []; }
  return data || [];
}

export async function removeAthleteCoach(athleteId, coachId) {
  const { error } = await supabase.from('athlete_coaches')
    .delete()
    .eq('athlete_id', athleteId)
    .eq('coach_id', coachId);
  // Wenn das der „Haupt-Coach" (athletes.created_by_coach_id) war, dann auch dort entfernen.
  await supabase.from('athletes')
    .update({ created_by_coach_id: null })
    .eq('id', athleteId)
    .eq('created_by_coach_id', coachId);
  return { error };
}

// Bidirektionaler Code-Einlöser (Phase 9b):
// - Wenn der gefundene Athlet keinen User-Account hat → setzt eigenen User als auth_user_id
// - Wenn der gefundene Athlet keinen Coach hat → setzt eigenen User als coach (nur für coach/admin)
export async function redeemAthleteCode(code) {
  const { data, error } = await supabase.rpc('redeem_athlete_code', { input_code: code });
  return { data, error };
}

// =============================================================
// Admin-Users — privilegierte Auth-Aktionen
// =============================================================
// Diese Funktionen sind NUR für den App-Owner (Ruben) gedacht.
// Die Edge-Function lehnt Aufrufe von allen anderen E-Mails ab.
// Wir prüfen die Owner-Eigenschaft zusätzlich im Frontend (s.u.),
// damit Buttons gar nicht erst angezeigt werden.

// Wer ist Owner? Primärer Anker ist die stabile Supabase-Auth-UID.
// Email kann sich ändern (iCloud-Hide-My-Email, Provider-Wechsel) —
// die UUID nicht. Email-Allowlist bleibt als Defense-in-Depth-Fallback.
export const OWNER_USER_IDS = [
  '339bfe2b-e0c5-4a1b-8a94-d44d2c0cb3d4', // Ruben
];
export const OWNER_EMAILS = [
  'felder-regenbogen9q@icloud.com',
  'info@neue-weberei.de',
];

export function isAppOwner(session) {
  const u = session?.user;
  if (!u) return false;
  if (OWNER_USER_IDS.includes(u.id)) return true;
  const email = (u.email || '').toLowerCase();
  return !!email && OWNER_EMAILS.includes(email);
}

// Wertungsbogen-Foto per Vision-LLM auslesen (Edge-Function scan-wertungsbogen).
// Gibt { data, error } zurück; data = strukturierte Felder oder null.
export async function scanWertungsbogenVision(imageDataUrl) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return { data: null, error: { message: 'Nicht angemeldet' } };
  const { data, error } = await supabase.functions.invoke('scan-wertungsbogen', {
    body: { image: imageDataUrl },
  });
  if (error) return { data: null, error };
  if (!data || data.ok !== true) return { data: null, error: { message: (data && data.error) || 'Bilderkennung fehlgeschlagen' } };
  return { data: data.data || null, error: null };
}

async function callAdminFn(action, payload = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return { error: { message: 'Nicht angemeldet' } };
  const { data, error } = await supabase.functions.invoke('admin-users', {
    body: { action, ...payload },
  });
  if (error) {
    // Edge-Function-Fehler kommen oft als FunctionsHttpError mit
    // einem context-Body — den extrahieren wir lesbar.
    let msg = error.message || 'Admin-Aufruf fehlgeschlagen';
    try {
      const ctx = error.context;
      if (ctx && typeof ctx.json === 'function') {
        const body = await ctx.json();
        if (body?.error) msg = body.error;
      }
    } catch { /* ignore */ }
    return { error: { message: msg } };
  }
  if (data?.error) return { error: { message: data.error } };
  return { data };
}

export async function adminListUsers() {
  return callAdminFn('list_users');
}
export async function adminGetUser({ user_id, email } = {}) {
  return callAdminFn('get_user', { user_id, email });
}
export async function adminResendConfirmation({ user_id, email } = {}) {
  return callAdminFn('resend_confirmation', { user_id, email });
}
export async function adminSendMagicLink({ user_id, email } = {}) {
  return callAdminFn('send_magic_link', { user_id, email });
}
export async function adminSendPasswordReset({ user_id, email } = {}) {
  return callAdminFn('send_password_reset', { user_id, email });
}
export async function adminConfirmEmail(user_id) {
  return callAdminFn('confirm_email', { user_id });
}
export async function adminSetRole(user_id, role) {
  return callAdminFn('set_role', { user_id, role });
}
export async function adminSetDisplayName(user_id, display_name) {
  return callAdminFn('set_display_name', { user_id, display_name });
}
export async function adminUpdateEmail(user_id, email, confirm = false) {
  return callAdminFn('update_email', { user_id, email, confirm });
}
export async function adminDeleteUser(user_id) {
  return callAdminFn('delete_user', { user_id });
}
export async function adminCreateImpersonation(user_id) {
  return callAdminFn('create_impersonation', { user_id });
}
