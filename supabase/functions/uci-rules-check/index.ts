// =============================================================
// ArtCyc Coach — UCI-Reglement-Check (wöchentlich)
// =============================================================
//
// Aufgerufen von einer GitHub Action (Cron) oder Supabase pg_cron
// — siehe .github/workflows/uci-rules-cron.yml.
//
// Schritte:
//   1. Für jede Sprache in `uci_rules_versions`: HEAD (falls Server
//      Last-Modified setzt) oder GET → SHA-256 vom Body bilden.
//   2. Wenn Hash gleich → nur last_checked_at updaten.
//   3. Wenn Hash anders → DB updaten, `app_notices` einen Banner-
//      Eintrag eintragen (idempotent über `key`) und Resend-Mail
//      an FEEDBACK_EMAIL schicken.
//
// Schreibt via Service-Role — die Funktion ist NICHT für direkten
// Client-Aufruf gedacht. Schutz: requirement-Header
// `x-cron-secret: <CRON_SECRET>` (vom GitHub-Secret).
// =============================================================

// @ts-ignore Deno
import { createClient } from "jsr:@supabase/supabase-js@2";

// @ts-ignore Deno-Runtime
const SUPABASE_URL              = Deno.env.get("SUPABASE_URL") ?? "";
// @ts-ignore Deno-Runtime
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
// @ts-ignore Deno-Runtime
const RESEND_API_KEY            = Deno.env.get("RESEND_API_KEY") ?? "";
// @ts-ignore Deno-Runtime
const FEEDBACK_EMAIL            = Deno.env.get("FEEDBACK_EMAIL") ?? "";
// @ts-ignore Deno-Runtime
const RESEND_FROM               = Deno.env.get("RESEND_FROM") ?? "ArtCyc Coach <onboarding@resend.dev>";
// @ts-ignore Deno-Runtime
const CRON_SECRET               = Deno.env.get("CRON_SECRET") ?? "";

// @ts-ignore Deno-Runtime resolution
import { jsonHeaders } from "../_shared/cors.ts";

const LANG_LABEL: Record<string, string> = {
  de: "Deutsch",
  en: "Englisch (UCI offiziell)",
  fr: "Französisch",
};

async function sha256(bytes: Uint8Array): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
}

async function sendMail(subject: string, html: string, text: string): Promise<{ ok: boolean; error?: string }> {
  if (!RESEND_API_KEY) return { ok: false, error: "no RESEND_API_KEY" };
  if (!FEEDBACK_EMAIL) return { ok: false, error: "no FEEDBACK_EMAIL" };
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": "Bearer " + RESEND_API_KEY },
    body: JSON.stringify({ from: RESEND_FROM, to: FEEDBACK_EMAIL, subject, html, text }),
  });
  if (!res.ok) return { ok: false, error: `Resend ${res.status}: ${await res.text()}` };
  return { ok: true };
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// @ts-ignore Deno-Runtime
Deno.serve(async (req: Request) => {
  // Auth: nur mit gültigem CRON_SECRET-Header oder Service-Role
  if (CRON_SECRET) {
    const got = req.headers.get("x-cron-secret") || "";
    if (got !== CRON_SECRET) {
      return new Response(JSON.stringify({ error: "forbidden" }), { status: 403, headers: jsonHeaders(req) });
    }
  }
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return new Response(JSON.stringify({ error: "Supabase-Env-Vars fehlen" }), { status: 500, headers: jsonHeaders(req) });
  }

  const supa = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const { data: versions, error: vErr } = await supa.from("uci_rules_versions").select("*");
  if (vErr || !versions) {
    return new Response(JSON.stringify({ error: "DB read failed: " + (vErr?.message || "no data") }), { status: 500, headers: jsonHeaders(req) });
  }

  const results: any[] = [];
  const changed: any[] = [];

  for (const row of versions) {
    const r: any = { lang: row.lang, url: row.pdf_url };
    try {
      const res = await fetch(row.pdf_url, { redirect: "follow" });
      if (!res.ok) {
        r.error = `HTTP ${res.status}`;
        results.push(r);
        continue;
      }
      const lastModified = res.headers.get("last-modified");
      const etag = res.headers.get("etag");
      const buf = new Uint8Array(await res.arrayBuffer());
      const hash = await sha256(buf);
      r.last_modified = lastModified;
      r.etag = etag;
      r.content_hash = hash;
      r.size = buf.byteLength;

      const prevHash = row.content_hash;
      const isChanged = !!prevHash && prevHash !== hash;
      const isFirstSeen = !prevHash;

      // Update Version-Row
      await supa
        .from("uci_rules_versions")
        .update({
          last_modified: lastModified,
          etag,
          content_hash: hash,
          last_checked_at: new Date().toISOString(),
          ...(isChanged || isFirstSeen ? { last_changed_at: new Date().toISOString() } : {}),
        })
        .eq("lang", row.lang);

      r.was_changed = isChanged;
      r.was_first_seen = isFirstSeen;
      if (isChanged) changed.push(r);
    } catch (e) {
      r.error = (e as Error).message;
    }
    results.push(r);
  }

  // Wenn sich irgendwas geändert hat: app_notice + Mail
  if (changed.length > 0) {
    const today = new Date().toISOString().slice(0, 10);
    const noticeKey = `uci_rules_updated_${today}`;
    const langs = changed.map(c => c.lang.toUpperCase()).join(", ");
    await supa
      .from("app_notices")
      .upsert({
        key: noticeKey,
        category: "update",
        title: "Neues UCI-Reglement erkannt",
        body: `Die UCI-Quelle für ${langs} wurde aktualisiert. Bitte das Reglement prüfen — Übungen und Punkte könnten sich geändert haben.`,
        link_url: changed[0].url,
        link_label: "Reglement öffnen",
      }, { onConflict: "key" });

    const subject = `⚠ ArtCyc Coach — neues UCI-Reglement (${langs})`;
    const html = `
      <div style="font-family:-apple-system,system-ui,sans-serif;font-size:14px;line-height:1.5;color:#0f172a">
        <h2 style="margin:0 0 12px;font-size:18px">Neues UCI-Reglement erkannt</h2>
        <p>Der wöchentliche Check hat eine Hash-Änderung bei folgenden Quellen festgestellt:</p>
        <ul style="padding-left:20px">
          ${changed.map(c => `<li><strong>${escapeHtml(LANG_LABEL[c.lang] || c.lang)}</strong> &mdash; <a href="${escapeHtml(c.url)}">${escapeHtml(c.url)}</a><br/><small style="color:#64748b">Last-Modified: ${escapeHtml(c.last_modified || "—")} · Hash: ${escapeHtml(c.content_hash || "—").slice(0, 16)}…</small></li>`).join("")}
        </ul>
        <p style="margin-top:14px">Action: PDFs herunterladen, durchschauen, dann die Übungs-DB ggf. neu seeden (Skript <code>scripts/seed-uci-db.mjs</code>).</p>
        <hr style="border:0;border-top:1px solid #e2e8f0;margin:14px 0" />
        <p style="color:#64748b;font-size:12px">In-App-Banner ist gesetzt (notice key: <code>${escapeHtml(noticeKey)}</code>).</p>
      </div>
    `;
    const plain = [
      `Neues UCI-Reglement erkannt — ${langs}`,
      ``,
      ...changed.map(c => `- ${LANG_LABEL[c.lang] || c.lang}: ${c.url}\n  Last-Modified: ${c.last_modified || "—"}\n  Hash: ${c.content_hash || "—"}`),
      ``,
      `In-App-Banner gesetzt: ${noticeKey}`,
    ].join("\n");
    const mailRes = await sendMail(subject, html, plain);
    if (!mailRes.ok) {
      console.warn("[uci-rules-check] mail failed:", mailRes.error);
    }
  }

  return new Response(JSON.stringify({
    ok: true,
    checked: results.length,
    changed: changed.length,
    results,
  }), { headers: jsonHeaders(req) });
});
