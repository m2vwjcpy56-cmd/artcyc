// =============================================================
// ArtCyc Coach — Feedback-Submission-Edge-Function
// =============================================================
//
// Speichert ein Feedback-Eintrag in der `public.feedback`-Tabelle und
// schickt optional eine Mail an die in der FEEDBACK_EMAIL-Env-Var
// gesetzte Adresse (via Resend, falls RESEND_API_KEY gesetzt ist).
//
// Aufruf vom Client:
//   POST /functions/v1/submit-feedback
//   Headers: Authorization: Bearer <user-jwt>
//   Body: { text, category, source, app_version?, user_agent?, url? }
//
// Antwort:
//   { ok: true, id: "uuid", mail_sent: boolean }
//
// Env-Vars (Supabase Dashboard → Edge Functions → Secrets):
//   FEEDBACK_EMAIL  — Empfänger-Adresse (Default: hardgecodet unten)
//   RESEND_API_KEY  — falls gesetzt, wird Auto-Mail verschickt;
//                     sonst nur DB-Eintrag.
// =============================================================

// @ts-ignore Deno
import { createClient } from "jsr:@supabase/supabase-js@2";

// @ts-ignore Deno-Runtime
const SUPABASE_URL              = Deno.env.get("SUPABASE_URL") ?? "";
// @ts-ignore Deno-Runtime
const SUPABASE_ANON_KEY         = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
// @ts-ignore Deno-Runtime
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
// @ts-ignore Deno-Runtime
const RESEND_API_KEY            = Deno.env.get("RESEND_API_KEY") ?? "";
// @ts-ignore Deno-Runtime
const FEEDBACK_EMAIL            = Deno.env.get("FEEDBACK_EMAIL") ?? "attika-schubladen-0v@icloud.com";
// Resend liefert Mails unter dem onboarding@resend.dev-Sender ohne
// Domain-Verification — perfekt für den schnellen Start.
// @ts-ignore Deno-Runtime
const RESEND_FROM               = Deno.env.get("RESEND_FROM") ?? "ArtCyc Coach <onboarding@resend.dev>";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const JSON_HEADERS = { ...CORS_HEADERS, "Content-Type": "application/json; charset=utf-8" };

const CATEGORY_LABELS: Record<string, string> = {
  bug: "🐛 Bug",
  idea: "💡 Idee",
  question: "❓ Frage",
  other: "📝 Sonstiges",
};

type ResendAttachment = { filename: string; content: string; content_type?: string };

async function sendMail({ from, to, subject, html, text, attachments }: {
  from: string; to: string; subject: string; html: string; text: string;
  attachments?: ResendAttachment[];
}) {
  const body: Record<string, unknown> = { from, to, subject, html, text };
  if (attachments && attachments.length) body.attachments = attachments;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + RESEND_API_KEY,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Resend ${res.status}: ${errText}`);
  }
  return await res.json();
}

// Validiert/Normalisiert Anhänge aus dem Request. Filter raus was zu groß
// ist (Resend-Limit liegt bei ~40 MB inkl. HTML — wir gehen auf 25 MB
// summe und 10 MB pro File, damit der Insert nicht failt). Akzeptiert
// pro Eintrag { name, type, content_base64 }.
const MAX_PER_FILE_MB  = 10;
const MAX_TOTAL_MB     = 25;
function normalizeAttachments(raw: unknown): { atts: ResendAttachment[]; warning: string | null } {
  if (!Array.isArray(raw) || raw.length === 0) return { atts: [], warning: null };
  const out: ResendAttachment[] = [];
  let totalBytes = 0;
  let skipped = 0;
  for (const a of raw) {
    if (!a || typeof a !== "object") { skipped++; continue; }
    const filename = String((a as any).name || "attachment").slice(0, 200);
    const type     = String((a as any).type || "application/octet-stream");
    const content  = String((a as any).content_base64 || "");
    if (!content) { skipped++; continue; }
    // Base64 → ungefähre Byte-Größe = len * 0.75
    const approxBytes = Math.floor(content.length * 0.75);
    if (approxBytes > MAX_PER_FILE_MB * 1024 * 1024) { skipped++; continue; }
    if (totalBytes + approxBytes > MAX_TOTAL_MB * 1024 * 1024) { skipped++; continue; }
    totalBytes += approxBytes;
    out.push({ filename, content, content_type: type });
  }
  const warning = skipped > 0 ? `${skipped} Anhang/Anhänge übersprungen (Größenlimit)` : null;
  return { atts: out, warning };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// @ts-ignore Deno-Runtime
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: CORS_HEADERS });
  }
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
    return new Response(JSON.stringify({ error: "Supabase-Env-Vars fehlen" }), {
      status: 500, headers: JSON_HEADERS,
    });
  }

  // Auth — wir lesen den Bearer-Token aus, prüfen die User-Identität.
  const authHeader = req.headers.get("Authorization") || "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!token) {
    return new Response(JSON.stringify({ error: "Nicht angemeldet" }), {
      status: 401, headers: JSON_HEADERS,
    });
  }

  // Client mit User-JWT, damit RLS greift
  const supaUser = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: "Bearer " + token } },
  });
  const { data: userData, error: userErr } = await supaUser.auth.getUser();
  if (userErr || !userData?.user) {
    return new Response(JSON.stringify({ error: "User nicht erkannt" }), {
      status: 401, headers: JSON_HEADERS,
    });
  }
  const user = userData.user;

  // Profil laden (display_name, role)
  const { data: profile } = await supaUser
    .from("profiles")
    .select("display_name, role")
    .eq("id", user.id)
    .maybeSingle();

  let body: any = {};
  try { body = await req.json(); } catch { /* leeres body */ }
  const text = String(body?.text || "").trim();
  if (!text) {
    return new Response(JSON.stringify({ error: "Text fehlt" }), {
      status: 400, headers: JSON_HEADERS,
    });
  }
  const category = ["bug", "idea", "question", "other"].includes(body?.category)
    ? body.category : "other";
  const source = ["user", "ai"].includes(body?.source) ? body.source : "user";

  // Anhänge — werden NICHT in der DB persistiert (zu groß für JSONB-Spalten),
  // aber an die Resend-Mail angehängt. Falls die Mail wegen Größe failt,
  // bleibt das Feedback selbst trotzdem in der DB.
  const { atts: attachments, warning: attWarning } = normalizeAttachments(body?.attachments);

  // Insert via User-Client → RLS greift, user_id muss = auth.uid() sein
  const { data: row, error: insertErr } = await supaUser
    .from("feedback")
    .insert({
      user_id: user.id,
      user_email: user.email,
      display_name: profile?.display_name ?? null,
      text,
      category,
      source,
      app_version: String(body?.app_version || ""),
      user_agent:  String(body?.user_agent  || ""),
      url:         String(body?.url         || ""),
    })
    .select("id")
    .single();
  if (insertErr) {
    return new Response(JSON.stringify({ error: "DB-Insert fehlgeschlagen: " + insertErr.message }), {
      status: 500, headers: JSON_HEADERS,
    });
  }

  // Mail verschicken (nur wenn Resend-Key da ist)
  let mailSent = false;
  let mailError: string | null = null;
  if (RESEND_API_KEY) {
    const subject = `ArtCyc Coach Feedback — ${CATEGORY_LABELS[category] || category}`;
    const safeText = escapeHtml(text);
    const attachList = attachments.length
      ? `<p style="margin:0 0 6px"><strong>Anhänge:</strong> ${attachments.length} · ${escapeHtml(attachments.map(a => a.filename).join(", "))}</p>`
      : "";
    const html = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display',system-ui,sans-serif;font-size:15px;line-height:1.5;color:#0f172a">
        <h2 style="margin:0 0 12px;font-size:18px">Neues Feedback in ArtCyc Coach</h2>
        <p style="margin:0 0 6px"><strong>Kategorie:</strong> ${CATEGORY_LABELS[category] || category}</p>
        <p style="margin:0 0 6px"><strong>Quelle:</strong> ${source === "ai" ? "KI-Coach" : "User"}</p>
        <p style="margin:0 0 6px"><strong>User:</strong> ${escapeHtml(profile?.display_name || "")} &lt;${escapeHtml(user.email || "")}&gt;</p>
        ${attachList}
        <hr style="border:0;border-top:1px solid #e2e8f0;margin:14px 0" />
        <div style="white-space:pre-wrap">${safeText}</div>
        <hr style="border:0;border-top:1px solid #e2e8f0;margin:14px 0" />
        <p style="color:#64748b;font-size:12px;margin:0">
          App: ${escapeHtml(String(body?.app_version || "?"))} · UA: ${escapeHtml(String(body?.user_agent || "?").slice(0, 120))}<br/>
          Feedback-ID: ${row.id}<br/>
          ${body?.url ? `URL: ${escapeHtml(String(body.url))}` : ""}
        </p>
      </div>
    `;
    const plain = [
      `Neues Feedback in ArtCyc Coach`,
      `Kategorie: ${CATEGORY_LABELS[category] || category}`,
      `Quelle: ${source === "ai" ? "KI-Coach" : "User"}`,
      `User: ${profile?.display_name || ""} <${user.email || ""}>`,
      ``,
      text,
      ``,
      `--`,
      `App: ${body?.app_version || "?"}`,
      `Feedback-ID: ${row.id}`,
    ].join("\n");
    try {
      await sendMail({
        from: RESEND_FROM,
        to: FEEDBACK_EMAIL,
        subject,
        html,
        text: plain,
        attachments,
      });
      mailSent = true;
    } catch (e) {
      mailError = (e as Error).message;
    }
  }

  return new Response(
    JSON.stringify({
      ok: true,
      id: row.id,
      mail_sent: mailSent,
      mail_error: mailError,
      attachment_warning: attWarning,
      attachment_count: attachments.length,
    }),
    { headers: JSON_HEADERS }
  );
});
