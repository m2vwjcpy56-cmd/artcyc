// =============================================================
// ArtCyc Coach — Admin-Users Edge-Function
// =============================================================
//
// Privilegierte Auth-Admin-Aktionen — NUR für den App-Owner
// (Ruben, info@neue-weberei.de) aufrufbar. Auch ein User mit
// profiles.role = 'admin' kommt hier NICHT durch, solange seine
// E-Mail nicht in der Owner-Allowlist steht.
// Service-Role-Key bleibt server-seitig, der Client schickt nur
// seinen User-JWT.
//
// Aufruf vom Client:
//   POST /functions/v1/admin-users
//   Headers: Authorization: Bearer <admin-user-jwt>
//   Body: { action: "...", ...payload }
//
// Actions:
//   list_users              → Liste aller auth.users + profiles + linked athletes
//   get_user                → { user_id } | { email }
//   resend_confirmation     → { email } | { user_id }   (Bestätigungs-Mail erneut)
//   send_magic_link         → { email }                 (passwortloser Login)
//   send_password_reset     → { email }                 (Passwort-Reset)
//   confirm_email           → { user_id }               (manuell bestätigen)
//   set_role                → { user_id, role }         (athlete|coach|admin)
//   set_display_name        → { user_id, display_name }
//   update_email            → { user_id, email }
//   delete_user             → { user_id }
//   create_impersonation    → { user_id }               (Magic-Link für Admin)
//
// Env-Vars:
//   SUPABASE_URL
//   SUPABASE_ANON_KEY
//   SUPABASE_SERVICE_ROLE_KEY
// =============================================================

// @ts-ignore Deno
import { createClient } from "jsr:@supabase/supabase-js@2";
// @ts-ignore Deno-Runtime
import { corsHeaders, jsonHeaders } from "../_shared/cors.ts";

// @ts-ignore Deno-Runtime
const SUPABASE_URL              = Deno.env.get("SUPABASE_URL") ?? "";
// @ts-ignore Deno-Runtime
const SUPABASE_ANON_KEY         = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
// @ts-ignore Deno-Runtime
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
// Owner-Allowlist — primärer Anker ist die stabile auth.users.id.
// Komma-separierte UID-Liste in OWNER_USER_IDS. Defense-in-Depth:
// Email-Fallback aus OWNER_EMAILS. Beide Defaults sind hardgecodet,
// damit die Function auch ohne explizit gesetzte Env-Vars sicher ist.
// @ts-ignore Deno-Runtime
const OWNER_USER_IDS_RAW = Deno.env.get("OWNER_USER_IDS") ?? "339bfe2b-e0c5-4a1b-8a94-d44d2c0cb3d4";
const OWNER_USER_IDS = OWNER_USER_IDS_RAW
  .split(",")
  .map(s => s.trim().toLowerCase())
  .filter(Boolean);
// @ts-ignore Deno-Runtime
const OWNER_EMAILS_RAW = Deno.env.get("OWNER_EMAILS") ?? "felder-regenbogen9q@icloud.com,info@neue-weberei.de";
const OWNER_EMAILS = OWNER_EMAILS_RAW
  .split(",")
  .map(s => s.trim().toLowerCase())
  .filter(Boolean);

const VALID_ROLES = ["athlete", "coach", "admin"];

function badRequest(req: Request, msg: string, status = 400) {
  return new Response(JSON.stringify({ error: msg }), { status, headers: jsonHeaders(req) });
}

function ok(req: Request, body: Record<string, unknown>) {
  return new Response(JSON.stringify({ ok: true, ...body }), { headers: jsonHeaders(req) });
}

// @ts-ignore Deno-Runtime
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders(req) });
  }
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders(req) });
  }
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
    return badRequest(req, "Supabase-Env-Vars fehlen", 500);
  }

  // 1) Auth — Bearer-Token muss zu einem Admin gehören
  const token = (req.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "").trim();
  if (!token) return badRequest(req, "Nicht angemeldet", 401);

  const supaUser = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: "Bearer " + token } },
  });
  const { data: userData, error: userErr } = await supaUser.auth.getUser();
  if (userErr || !userData?.user) return badRequest(req, "User nicht erkannt", 401);
  const callerId = userData.user.id;
  const callerEmail = (userData.user.email || "").toLowerCase();

  // 2) Owner-Check: stabile UID als primärer Anker (überlebt Email-Wechsel
  // und iCloud-Hide-My-Email-Toggles), E-Mail als Defense-in-Depth-Fallback.
  // Auch ein User, der versehentlich profiles.role=admin bekommt, kommt hier
  // nicht durch — er muss explizit in einer der Allowlists stehen.
  const idOk = OWNER_USER_IDS.includes(callerId.toLowerCase());
  const emailOk = !!callerEmail && OWNER_EMAILS.includes(callerEmail);
  if (!idOk && !emailOk) {
    return badRequest(req, "Nur der App-Owner darf diese Aktion ausführen", 403);
  }

  // Service-Role-Client für privilegierte Operationen (bypasses RLS).
  const supaAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // 3) Body parsen + Action dispatchen
  let body: any = {};
  try { body = await req.json(); } catch { /* empty body OK für list */ }
  const action = String(body?.action || "").trim();
  if (!action) return badRequest(req, "action fehlt");

  // Helper: User auflösen (per id oder email)
  async function resolveUser(input: { user_id?: string; email?: string }) {
    if (input.user_id) {
      const { data, error } = await supaAdmin.auth.admin.getUserById(input.user_id);
      if (error) throw new Error("User-Lookup: " + error.message);
      return data.user;
    }
    if (input.email) {
      // listUsers ist paginiert — wir filtern lokal
      let page = 1;
      const perPage = 200;
      while (true) {
        const { data, error } = await supaAdmin.auth.admin.listUsers({ page, perPage });
        if (error) throw new Error("User-Lookup: " + error.message);
        const hit = data.users.find(u => (u.email || "").toLowerCase() === input.email!.toLowerCase());
        if (hit) return hit;
        if (data.users.length < perPage) return null;
        page++;
        if (page > 50) return null; // safety
      }
    }
    return null;
  }

  // Origin für Redirect-URLs ableiten — bevorzugt der Browser-Origin
  const redirectOrigin = (req.headers.get("origin") || "").trim() || "https://artcyc.vercel.app";

  try {
    switch (action) {
      // ─────────────────────────────────────────────────────
      case "list_users": {
        // Alle auth.users laden (paginiert), dazu profiles und linked athletes joinen
        const usersAll: any[] = [];
        let page = 1;
        const perPage = 200;
        while (true) {
          const { data, error } = await supaAdmin.auth.admin.listUsers({ page, perPage });
          if (error) throw new Error(error.message);
          usersAll.push(...data.users);
          if (data.users.length < perPage) break;
          page++;
          if (page > 50) break;
        }
        const ids = usersAll.map(u => u.id);
        const [{ data: profilesData }, { data: athletesData }] = await Promise.all([
          supaAdmin.from("profiles").select("id, role, display_name, created_at").in("id", ids),
          supaAdmin.from("athletes")
            .select("id, name, auth_user_id, created_by_coach_id, type, email, created_at")
            .or("auth_user_id.in.(" + ids.join(",") + "),created_by_coach_id.in.(" + ids.join(",") + ")"),
        ]);
        const profileById = new Map((profilesData || []).map((p: any) => [p.id, p]));
        const athletesByUser = new Map<string, any[]>();
        (athletesData || []).forEach((a: any) => {
          if (a.auth_user_id) {
            const list = athletesByUser.get(a.auth_user_id) || [];
            list.push({ ...a, link: "self" });
            athletesByUser.set(a.auth_user_id, list);
          }
          if (a.created_by_coach_id) {
            const list = athletesByUser.get(a.created_by_coach_id) || [];
            list.push({ ...a, link: "coach" });
            athletesByUser.set(a.created_by_coach_id, list);
          }
        });

        const result = usersAll.map(u => ({
          id: u.id,
          email: u.email,
          phone: u.phone,
          created_at: u.created_at,
          last_sign_in_at: u.last_sign_in_at,
          email_confirmed_at: u.email_confirmed_at,
          confirmed_at: u.confirmed_at,
          banned_until: (u as any).banned_until ?? null,
          is_super_admin: (u as any).is_super_admin ?? false,
          user_metadata: u.user_metadata || {},
          app_metadata: u.app_metadata || {},
          profile: profileById.get(u.id) || null,
          athletes: athletesByUser.get(u.id) || [],
        }));
        return ok(req, { users: result, count: result.length });
      }

      // ─────────────────────────────────────────────────────
      case "get_user": {
        const u = await resolveUser({ user_id: body.user_id, email: body.email });
        if (!u) return badRequest(req, "User nicht gefunden", 404);
        const { data: prof } = await supaAdmin.from("profiles").select("*").eq("id", u.id).maybeSingle();
        const { data: aths } = await supaAdmin
          .from("athletes")
          .select("id, name, auth_user_id, created_by_coach_id, type, email, claim_code, created_at")
          .or(`auth_user_id.eq.${u.id},created_by_coach_id.eq.${u.id}`);
        return ok(req, { user: u, profile: prof, athletes: aths || [] });
      }

      // ─────────────────────────────────────────────────────
      case "resend_confirmation": {
        const u = await resolveUser({ user_id: body.user_id, email: body.email });
        if (!u) return badRequest(req, "User nicht gefunden", 404);
        if (u.email_confirmed_at) return badRequest(req, "E-Mail ist bereits bestätigt");
        // generateLink mit type=signup erzeugt einen neuen Bestätigungslink und
        // Supabase verschickt die Mail (sofern SMTP konfiguriert).
        const { data, error } = await supaAdmin.auth.admin.generateLink({
          type: "signup",
          email: u.email!,
          options: { redirectTo: redirectOrigin },
        });
        if (error) throw new Error(error.message);
        return ok(req, { sent: true, action_link: data?.properties?.action_link });
      }

      // ─────────────────────────────────────────────────────
      case "send_magic_link": {
        const u = await resolveUser({ user_id: body.user_id, email: body.email });
        if (!u) return badRequest(req, "User nicht gefunden", 404);
        const { data, error } = await supaAdmin.auth.admin.generateLink({
          type: "magiclink",
          email: u.email!,
          options: { redirectTo: redirectOrigin },
        });
        if (error) throw new Error(error.message);
        return ok(req, { sent: true, action_link: data?.properties?.action_link });
      }

      // ─────────────────────────────────────────────────────
      case "send_password_reset": {
        const u = await resolveUser({ user_id: body.user_id, email: body.email });
        if (!u) return badRequest(req, "User nicht gefunden", 404);
        const { data, error } = await supaAdmin.auth.admin.generateLink({
          type: "recovery",
          email: u.email!,
          options: { redirectTo: redirectOrigin },
        });
        if (error) throw new Error(error.message);
        return ok(req, { sent: true, action_link: data?.properties?.action_link });
      }

      // ─────────────────────────────────────────────────────
      case "confirm_email": {
        if (!body.user_id) return badRequest(req, "user_id fehlt");
        const { data, error } = await supaAdmin.auth.admin.updateUserById(body.user_id, {
          email_confirm: true,
        });
        if (error) throw new Error(error.message);
        return ok(req, { user: data.user });
      }

      // ─────────────────────────────────────────────────────
      case "set_role": {
        if (!body.user_id) return badRequest(req, "user_id fehlt");
        if (!VALID_ROLES.includes(body.role)) return badRequest(req, "role ungültig");
        // Self-demotion blocken (Admin darf sich nicht selbst die Admin-Rolle wegnehmen,
        // sonst kann er sich aussperren)
        if (body.user_id === callerId && body.role !== "admin") {
          return badRequest(req, "Du kannst dir selbst die Admin-Rolle nicht entziehen");
        }
        const { data, error } = await supaAdmin
          .from("profiles")
          .update({ role: body.role })
          .eq("id", body.user_id)
          .select()
          .maybeSingle();
        if (error) throw new Error(error.message);
        return ok(req, { profile: data });
      }

      // ─────────────────────────────────────────────────────
      case "set_display_name": {
        if (!body.user_id) return badRequest(req, "user_id fehlt");
        const newName = String(body.display_name || "").trim();
        if (!newName) return badRequest(req, "display_name fehlt");
        const { data, error } = await supaAdmin
          .from("profiles")
          .update({ display_name: newName })
          .eq("id", body.user_id)
          .select()
          .maybeSingle();
        if (error) throw new Error(error.message);
        return ok(req, { profile: data });
      }

      // ─────────────────────────────────────────────────────
      case "update_email": {
        if (!body.user_id) return badRequest(req, "user_id fehlt");
        const newEmail = String(body.email || "").trim().toLowerCase();
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(newEmail)) return badRequest(req, "E-Mail ungültig");
        const { data, error } = await supaAdmin.auth.admin.updateUserById(body.user_id, {
          email: newEmail,
          email_confirm: !!body.confirm,
        });
        if (error) throw new Error(error.message);
        return ok(req, { user: data.user });
      }

      // ─────────────────────────────────────────────────────
      case "delete_user": {
        if (!body.user_id) return badRequest(req, "user_id fehlt");
        if (body.user_id === callerId) return badRequest(req, "Du kannst dich nicht selbst löschen");
        // ON DELETE CASCADE in der DB löscht profiles + verknüpfte Daten automatisch.
        const { error } = await supaAdmin.auth.admin.deleteUser(body.user_id);
        if (error) throw new Error(error.message);
        return ok(req, { deleted: true });
      }

      // ─────────────────────────────────────────────────────
      case "create_impersonation": {
        // Erzeugt einen Magic-Link, mit dem der Admin sich AS dem Ziel-User
        // einloggen kann. Der Link wird NICHT per Mail verschickt — er wird
        // direkt an den Admin zurückgegeben und kann im Browser geöffnet werden.
        if (!body.user_id) return badRequest(req, "user_id fehlt");
        const { data: targetUser, error: getErr } = await supaAdmin.auth.admin.getUserById(body.user_id);
        if (getErr || !targetUser?.user) return badRequest(req, "Ziel-User nicht gefunden", 404);
        if (!targetUser.user.email) return badRequest(req, "Ziel-User hat keine E-Mail");
        const { data, error } = await supaAdmin.auth.admin.generateLink({
          type: "magiclink",
          email: targetUser.user.email,
          options: { redirectTo: redirectOrigin },
        });
        if (error) throw new Error(error.message);
        return ok(req, {
          action_link: data?.properties?.action_link,
          target_user: { id: targetUser.user.id, email: targetUser.user.email },
        });
      }

      // ─────────────────────────────────────────────────────
      default:
        return badRequest(req, "Unbekannte action: " + action);
    }
  } catch (e) {
    return badRequest(req, (e as Error).message || "Interner Fehler", 500);
  }
});
