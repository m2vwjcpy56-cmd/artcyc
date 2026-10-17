// Erinnert rechtzeitig an alles, was abläuft — Zertifikate, Schlüssel, Domain.
//
// Warum serverseitig und nicht als geplante Aufgabe auf dem Mac: der Mac schläft
// (belegt in remote-control-abbrueche) und wäre genau dann aus, wenn die Erinnerung
// fällig ist. pg_cron ruft diese Function täglich; sie entscheidet selbst, ob es
// etwas zu melden gibt, und schickt höchstens EINE Mail pro Lauf.
//
// Stand der Dinge liegt in public.expiries. Neue Posten einfach dort eintragen —
// an dieser Function ist dafür nichts zu ändern.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ACCENT = "#F58C21"; // App-Orange, wie in auth-email-hook
const INK = "#0F172A";
const FROM = "ArtCyc Coach <no-reply@artcyc.app>";
const TO = "info@artcyc.app";

/** Nach der ersten Meldung alle 7 Tage erinnern, bis der Posten erledigt ist. */
const REPEAT_DAYS = 7;

type Row = {
  id: string;
  title: string;
  due_on: string;
  lead_days: number;
  note: string | null;
  action_url: string | null;
  last_notified_on: string | null;
};

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const deDate = (iso: string) => {
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
};

const daysUntil = (iso: string) => {
  const today = new Date(new Date().toISOString().slice(0, 10) + "T00:00:00Z").getTime();
  return Math.round((Date.parse(iso + "T00:00:00Z") - today) / 86400000);
};

/** Dringlichkeit bestimmt Farbe und Wortwahl — nicht jede Meldung ist ein Alarm. */
function urgency(days: number) {
  if (days < 0) return { color: "#DC2626", label: `seit ${Math.abs(days)} Tagen abgelaufen` };
  if (days === 0) return { color: "#DC2626", label: "läuft heute ab" };
  if (days <= 7) return { color: "#DC2626", label: `noch ${days} Tage` };
  if (days <= 21) return { color: ACCENT, label: `noch ${days} Tage` };
  return { color: "#64748B", label: `noch ${days} Tage` };
}

function card(r: Row): string {
  const d = daysUntil(r.due_on);
  const u = urgency(d);
  const link = r.action_url
    ? `<div style="padding-top:10px;"><a href="${esc(r.action_url)}" style="color:${ACCENT};font-size:13px;font-weight:600;text-decoration:none;">Dort erledigen &rsaquo;</a></div>`
    : "";
  const note = r.note
    ? `<div style="font-size:13px;color:#475569;line-height:1.55;padding-top:8px;">${esc(r.note)}</div>`
    : "";
  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
         style="border:1px solid #e8ebef;border-radius:14px;margin-bottom:12px;">
    <tr><td style="padding:16px 18px;border-left:4px solid ${u.color};border-radius:14px 0 0 14px;">
      <div style="font-size:12px;font-weight:700;color:${u.color};text-transform:uppercase;letter-spacing:.05em;">${esc(u.label)}</div>
      <div style="font-size:16px;font-weight:700;color:${INK};padding-top:4px;">${esc(r.title)}</div>
      <div style="font-size:13px;color:#94a3b8;padding-top:2px;">Stichtag ${deDate(r.due_on)}</div>
      ${note}${link}
    </td></tr>
  </table>`;
}

function html(rows: Row[]): string {
  const soonest = Math.min(...rows.map((r) => daysUntil(r.due_on)));
  const heading = soonest < 0
    ? "Etwas ist abgelaufen"
    : rows.length === 1 ? "Ein Termin steht an" : `${rows.length} Termine stehen an`;
  return `<!doctype html><html lang="de"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"></head>
<body style="margin:0;padding:0;background:#eef0f3;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(rows[0].title)} — Stichtag ${deDate(rows[0].due_on)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef0f3;padding:32px 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 1px 3px rgba(15,23,42,.08);">
        <tr><td style="background:${INK};padding:22px 30px;">
          <table role="presentation" cellpadding="0" cellspacing="0"><tr>
            <td style="vertical-align:middle;"><img src="https://artcyc.app/pwa-192.png" width="40" height="40" alt="ArtCyc" style="display:block;border:0;border-radius:10px;"></td>
            <td style="vertical-align:middle;padding-left:12px;font-size:18px;font-weight:700;color:#ffffff;letter-spacing:-.2px;">ArtCyc <span style="color:${ACCENT};">Coach</span></td>
          </tr></table>
        </td></tr>
        <tr><td style="padding:32px 30px 30px;">
          <div style="font-size:22px;font-weight:700;color:${INK};padding-bottom:10px;">${heading}</div>
          <div style="font-size:15px;color:#475569;line-height:1.55;padding-bottom:22px;">
            Diese Erinnerung kommt automatisch, solange der Posten offen ist — danach hört sie von selbst auf.
          </div>
          ${rows.map(card).join("")}
          <div style="border-top:1px solid #eef0f3;margin-top:10px;padding-top:16px;font-size:13px;color:#94a3b8;line-height:1.5;">
            Erledigt? Dann das neue Datum in der Tabelle <code style="font-family:ui-monospace,Menlo,monospace;">expiries</code> eintragen, sonst meldet sich die Erinnerung weiter.
          </div>
        </td></tr>
        <tr><td style="padding:18px 30px;background:#f8fafc;border-top:1px solid #eef0f3;font-size:12px;color:#94a3b8;">ArtCyc Coach · Coaching-Tool für Kunstradsport · <a href="https://artcyc.app" style="color:#94a3b8;text-decoration:underline;">artcyc.app</a></td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function plain(rows: Row[]): string {
  return rows.map((r) => {
    const u = urgency(daysUntil(r.due_on));
    return `${r.title}\n  ${u.label} — Stichtag ${deDate(r.due_on)}`
      + (r.note ? `\n  ${r.note}` : "")
      + (r.action_url ? `\n  ${r.action_url}` : "");
  }).join("\n\n");
}

Deno.serve(async (req) => {
  // Geteiltes Geheimnis statt verify_jwt: pg_cron schickt es im Kopf mit. Ohne
  // Prüfung könnte jeder die Adresse zumüllen.
  const secret = Deno.env.get("EXPIRY_CRON_SECRET");
  if (!secret || req.headers.get("x-expiry-secret") !== secret) {
    return new Response("forbidden", { status: 403 });
  }

  const db = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
  const { data, error } = await db.from("expiries").select("*").order("due_on");
  if (error) return new Response(error.message, { status: 500 });

  const today = new Date().toISOString().slice(0, 10);
  const due = (data as Row[]).filter((r) => {
    // Noch nicht im Vorlauf? Dann schweigen.
    if (daysUntil(r.due_on) > r.lead_days) return false;
    // Schon gemeldet? Erst nach der Wiederholfrist wieder.
    if (r.last_notified_on) {
      const since = Math.round(
        (Date.parse(today) - Date.parse(r.last_notified_on)) / 86400000,
      );
      if (since < REPEAT_DAYS) return false;
    }
    return true;
  });

  if (due.length === 0) return Response.json({ sent: false, due: 0 });

  // Trockenlauf zum Prüfen, ohne jemandem eine Mail zu schicken.
  const dry = new URL(req.url).searchParams.get("dry") === "1";
  if (dry) return Response.json({ sent: false, dry: true, titles: due.map((r) => r.title) });

  const soonest = Math.min(...due.map((r) => daysUntil(r.due_on)));
  const subject = soonest < 0
    ? `ArtCyc: ${due.length === 1 ? due[0].title : due.length + " Posten"} abgelaufen`
    : `ArtCyc: ${due[0].title} läuft in ${soonest} Tagen ab`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM, to: [TO], reply_to: TO,
      subject, html: html(due), text: plain(due),
    }),
  });
  if (!res.ok) return new Response(`resend: ${await res.text()}`, { status: 502 });

  await db.from("expiries").update({ last_notified_on: today })
    .in("id", due.map((r) => r.id));
  return Response.json({ sent: true, due: due.length, titles: due.map((r) => r.title) });
});
