// =============================================================
// ArtCyc Coach — Error-Reporting-Edge-Function
// =============================================================
//
// Nimmt Frontend-Fehler entgegen (window.onerror / unhandledrejection /
// React-ErrorBoundary / manuelle reportError-Aufrufe) und mailt sie
// per Resend an FEEDBACK_EMAIL. Schreibt optional auch in die Tabelle
// `public.error_reports`, falls sie existiert (Schema in
// docs/error-reports-setup.sql).
//
// Aufruf vom Client:
//   POST /functions/v1/report-error
//   Headers: Authorization: Bearer <anon-key oder user-jwt>
//   Body: {
//     message, stack?, source?, lineno?, colno?,
//     url, user_agent, app_version,
//     context?, lang?, fingerprint?
//   }
//
// Antwort:
//   { ok: true, mail_sent: boolean, id?: uuid }
//
// Env-Vars:
//   FEEDBACK_EMAIL  — Empfänger (Default: hardgecodet)
//   RESEND_API_KEY  — falls gesetzt, wird Mail verschickt
//   RESEND_FROM     — Absender (Default onboarding@resend.dev)
// =============================================================

// @ts-ignore Deno
import { createClient } from "jsr:@supabase/supabase-js@2";

// @ts-ignore Deno-Runtime
const SUPABASE_URL              = Deno.env.get("SUPABASE_URL") ?? "";
// @ts-ignore Deno-Runtime
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
// @ts-ignore Deno-Runtime
const SUPABASE_ANON_KEY         = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
// @ts-ignore Deno-Runtime
const RESEND_API_KEY            = Deno.env.get("RESEND_API_KEY") ?? "";
// @ts-ignore Deno-Runtime
const FEEDBACK_EMAIL            = Deno.env.get("FEEDBACK_EMAIL") ?? "attika-schubladen-0v@icloud.com";
// @ts-ignore Deno-Runtime
const RESEND_FROM               = Deno.env.get("RESEND_FROM") ?? "ArtCyc Coach <onboarding@resend.dev>";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const JSON_HEADERS = { ...CORS_HEADERS, "Content-Type": "application/json; charset=utf-8" };

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function sendMail({ subject, html, text }: { subject: string; html: string; text: string }) {
  if (!RESEND_API_KEY) return { ok: false, error: "no api key" };
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + RESEND_API_KEY,
    },
    body: JSON.stringify({ from: RESEND_FROM, to: FEEDBACK_EMAIL, subject, html, text }),
  });
  if (!res.ok) {
    return { ok: false, error: `Resend ${res.status}: ${await res.text()}` };
  }
  return { ok: true };
}

// @ts-ignore Deno-Runtime
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS_HEADERS });
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: CORS_HEADERS });
  }

  let body: any = {};
  try { body = await req.json(); } catch {}
  const message    = String(body?.message    || "").slice(0, 2000);
  const stack      = String(body?.stack      || "").slice(0, 8000);
  const source     = String(body?.source     || "").slice(0, 500);
  const url        = String(body?.url        || "").slice(0, 500);
  const userAgent  = String(body?.user_agent || "").slice(0, 500);
  const appVersion = String(body?.app_version || "").slice(0, 50);
  const context    = String(body?.context    || "").slice(0, 1000);
  const lang       = String(body?.lang       || "").slice(0, 10);
  const fingerprint= String(body?.fingerprint|| "").slice(0, 64);
  if (!message) {
    return new Response(JSON.stringify({ error: "message fehlt" }), { status: 400, headers: JSON_HEADERS });
  }

  // Optional: User-Identifikation aus Bearer Token (User-JWT, nicht anon).
  // Anon-Calls schlagen hier nicht fehl — wir kriegen einfach keinen User.
  let userId: string | null = null;
  let userEmail: string | null = null;
  let userDisplayName: string | null = null;
  const authHeader = req.headers.get("Authorization") || "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (token && SUPABASE_URL && SUPABASE_ANON_KEY && token !== SUPABASE_ANON_KEY) {
    try {
      const supaUser = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        global: { headers: { Authorization: "Bearer " + token } },
      });
      const { data: userData } = await supaUser.auth.getUser();
      if (userData?.user) {
        userId = userData.user.id;
        userEmail = userData.user.email ?? null;
        const { data: profile } = await supaUser
          .from("profiles")
          .select("display_name")
          .eq("id", userId)
          .maybeSingle();
        userDisplayName = profile?.display_name ?? null;
      }
    } catch { /* schweigend ignorieren */ }
  }

  // DB-Insert (best effort) via Service-Role, damit auch anonyme User-Crashes
  // landen können. RLS bleibt aktiv für SELECT.
  let rowId: string | null = null;
  if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const supaService = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
      const { data: row } = await supaService
        .from("error_reports")
        .insert({
          user_id: userId,
          user_email: userEmail,
          display_name: userDisplayName,
          message,
          stack,
          source,
          url,
          user_agent: userAgent,
          app_version: appVersion,
          context,
          lang,
          fingerprint,
        })
        .select("id")
        .maybeSingle();
      if (row?.id) rowId = row.id;
    } catch { /* Tabelle fehlt evtl. — Mail trotzdem schicken */ }
  }

  // Mail
  let mailSent = false;
  let mailError: string | null = null;
  if (RESEND_API_KEY) {
    const userPart = userEmail
      ? `${escapeHtml(userDisplayName || "")} &lt;${escapeHtml(userEmail)}&gt;`
      : "anonym";
    const subject = `⚠ ArtCyc Coach Crash — ${message.slice(0, 80)}`;
    const html = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display',system-ui,sans-serif;font-size:14px;line-height:1.5;color:#0f172a">
        <h2 style="margin:0 0 12px;font-size:18px;color:#dc2626">ArtCyc Coach — Frontend-Fehler</h2>
        <p style="margin:0 0 6px"><strong>User:</strong> ${userPart}</p>
        <p style="margin:0 0 6px"><strong>App:</strong> ${escapeHtml(appVersion)} · <strong>Sprache:</strong> ${escapeHtml(lang)}</p>
        ${context ? `<p style="margin:0 0 6px"><strong>Kontext:</strong> ${escapeHtml(context)}</p>` : ""}
        <hr style="border:0;border-top:1px solid #e2e8f0;margin:14px 0" />
        <div style="font-family:ui-monospace,Menlo,Consolas,monospace;background:#0f172a;color:#f8fafc;padding:12px;border-radius:8px;white-space:pre-wrap;font-size:12px;line-height:1.45">
${escapeHtml(message)}${stack ? "\n\n" + escapeHtml(stack) : ""}
        </div>
        <hr style="border:0;border-top:1px solid #e2e8f0;margin:14px 0" />
        <p style="color:#64748b;font-size:12px;margin:0">
          URL: ${escapeHtml(url)}<br/>
          UA: ${escapeHtml(userAgent.slice(0, 180))}<br/>
          ${source ? `Quelle: ${escapeHtml(source)}<br/>` : ""}
          Fingerprint: ${escapeHtml(fingerprint)}<br/>
          ${rowId ? `Report-ID: ${escapeHtml(rowId)}` : "(DB-Insert übersprungen)"}
        </p>
      </div>
    `;
    const plain = [
      `ArtCyc Coach — Frontend-Fehler`,
      `User: ${userDisplayName || ""} <${userEmail || "anonym"}>`,
      `App: ${appVersion} · Sprache: ${lang}`,
      context ? `Kontext: ${context}` : "",
      ``,
      message,
      stack ? "\n" + stack : "",
      ``,
      `URL: ${url}`,
      `UA: ${userAgent}`,
      source ? `Quelle: ${source}` : "",
      `Fingerprint: ${fingerprint}`,
      rowId ? `Report-ID: ${rowId}` : "",
    ].filter(Boolean).join("\n");
    const r = await sendMail({ subject, html, text: plain });
    if (r.ok) mailSent = true; else mailError = r.error || "unknown";
  } else {
    mailError = "RESEND_API_KEY fehlt";
  }

  return new Response(
    JSON.stringify({ ok: true, id: rowId, mail_sent: mailSent, mail_error: mailError }),
    { headers: JSON_HEADERS }
  );
});
