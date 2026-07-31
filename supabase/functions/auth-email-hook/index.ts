// Auth Send Email Hook — sendet ArtCyc-Auth-Mails über Resend (nutzt vorhandenen RESEND_API_KEY).
// EIN einheitliches, cleanes Template für alle Typen. Signatur per StandardWebhooks geprüft.
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const HOOK_SECRET = Deno.env.get("SEND_EMAIL_HOOK_SECRET") ?? "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "https://cpxsfctijcsezkspjlxy.supabase.co";
const FROM = "ArtCyc Coach <no-reply@artcyc.app>";
const REPLY_TO = "info@artcyc.app";
const ACCENT = "#F58C21"; // App-Orange (iOS Brand.accent), NICHT das rötliche #FF7A00
const INK = "#0F172A";

async function verifySignature(body: string, headers: Headers): Promise<boolean> {
  const id = headers.get("webhook-id");
  const ts = headers.get("webhook-timestamp");
  const sigHeader = headers.get("webhook-signature");
  if (!id || !ts || !sigHeader) return false;
  const b64 = HOOK_SECRET.replace(/^v1,/, "").replace(/^whsec_/, "");
  const keyBytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  const key = await crypto.subtle.importKey("raw", keyBytes, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${id}.${ts}.${body}`));
  const expected = btoa(String.fromCharCode(...new Uint8Array(mac)));
  return sigHeader.split(" ").some((p) => p.split(",")[1] === expected);
}

type Payload = {
  user: { email: string };
  email_data: {
    token: string; token_hash: string; redirect_to: string;
    email_action_type: string; site_url: string;
    token_new?: string; token_hash_new?: string;
  };
};

function verifyLink(tokenHash: string, type: string, redirectTo: string): string {
  // Link läuft über die eigene Domain (artcyc.app/av → Vercel-Redirect auf Supabase-verify),
  // damit Link-Domain = Absender-Domain ist (bessere Zustellbarkeit / weniger Spam).
  return `https://artcyc.app/av?token=${tokenHash}&type=${type}&redirect_to=${encodeURIComponent(redirectTo || "https://artcyc.app/web")}`;
}

type Mail = { subject: string; preheader: string; heading: string; intro: string; cta?: string; link?: string; code?: string; outro: string };

function build(p: Payload): Mail {
  const d = p.email_data;
  switch (d.email_action_type) {
    case "recovery": return {
      subject: "Passwort zurücksetzen", preheader: "Setze dein ArtCyc-Passwort in einem Schritt zurück.",
      heading: "Passwort zurücksetzen", intro: "Klicke auf den Button, um ein neues Passwort für dein ArtCyc-Konto zu vergeben.",
      cta: "Neues Passwort vergeben", link: verifyLink(d.token_hash, "recovery", d.redirect_to),
      code: d.token,
      outro: "Wenn du das nicht angefragt hast, ignoriere diese E-Mail — dein Passwort bleibt unverändert.",
    };
    case "magiclink": return {
      subject: "Dein Login-Link", preheader: "Mit einem Klick bei ArtCyc anmelden.",
      heading: "Anmelden bei ArtCyc", intro: "Klicke auf den Button, um dich ohne Passwort anzumelden.",
      cta: "Jetzt anmelden", link: verifyLink(d.token_hash, "magiclink", d.redirect_to),
      code: d.token,
      outro: "Wenn du das nicht angefragt hast, ignoriere diese E-Mail einfach.",
    };
    case "invite": return {
      subject: "Einladung zu ArtCyc", preheader: "Du wurdest zu ArtCyc eingeladen.",
      heading: "Du wurdest eingeladen", intro: "Aktiviere dein Konto, um mit ArtCyc dein Kunstrad-Training zu verfolgen.",
      cta: "Konto aktivieren", link: verifyLink(d.token_hash, "invite", d.redirect_to),
      outro: "Wenn du damit nichts anfangen kannst, ignoriere diese E-Mail.",
    };
    case "email_change": return {
      subject: "Neue E-Mail-Adresse bestätigen", preheader: "Bestätige deine neue E-Mail-Adresse für ArtCyc.",
      heading: "E-Mail-Adresse bestätigen", intro: "Bitte bestätige deine neue E-Mail-Adresse, um die Änderung abzuschließen.",
      cta: "E-Mail bestätigen", link: verifyLink(d.token_hash_new || d.token_hash, "email_change", d.redirect_to),
      outro: "Wenn du das nicht warst, wende dich bitte an info@artcyc.app.",
    };
    case "reauthentication": return {
      subject: "Dein Bestätigungs-Code", preheader: "Dein ArtCyc-Bestätigungs-Code.",
      heading: "Bestätigungs-Code", intro: "Gib diesen Code in der App ein, um fortzufahren:", code: d.token,
      outro: "Wenn du das nicht angefragt hast, ignoriere diese E-Mail.",
    };
    default: return { // signup
      subject: "Bestätige deine Anmeldung", preheader: "Nur noch ein Klick, um dein ArtCyc-Konto zu aktivieren.",
      heading: "Willkommen bei ArtCyc", intro: "Schön, dass du dabei bist! Bestätige deine E-Mail-Adresse, um dein Konto zu aktivieren.",
      cta: "E-Mail bestätigen", link: verifyLink(d.token_hash, "signup", d.redirect_to),
      // Code ZUSÄTZLICH zum Link: manche Mail-Anbieter (z. B. t-online) schreiben Links
      // um oder rufen sie vorab ab, dann verpufft der Link. Mit dem Code kommt man auch
      // dann ins Konto — und ebenso, wenn die Mail auf einem anderen Gerät liegt.
      code: d.token,
      outro: "Wenn du dich nicht registriert hast, kannst du diese E-Mail ignorieren.",
    };
  }
}

function html(m: Mail): string {
  // Code-Kasten — steht bei Link-Mails UNTER dem Button (zweiter Weg), bei
  // reinen Code-Mails allein.
  const codeBox = m.code
    ? `<tr><td style="padding:4px 0 ${m.link ? "20px" : "24px"};">
         <div style="display:inline-block;font-size:30px;font-weight:700;letter-spacing:10px;background:#f1f5f9;border:1px solid #e2e8f0;border-radius:12px;padding:16px 26px;color:${INK};">${m.code}</div>
       </td></tr>`
    : "";
  const codeHint = m.code && m.link
    ? `<tr><td style="font-size:13px;color:#94a3b8;padding-bottom:6px;">Oder gib diesen Code in der App ein:</td></tr>`
    : "";
  const action = m.link
    ? `<tr><td style="padding:4px 0 24px;">
         <a href="${m.link}" style="display:inline-block;background:${ACCENT};color:#ffffff;text-decoration:none;font-weight:600;font-size:16px;line-height:1;padding:15px 30px;border-radius:12px;">${m.cta}</a>
       </td></tr>
       <tr><td style="font-size:13px;color:#94a3b8;padding-bottom:6px;">Falls der Button nicht funktioniert, öffne diesen Link:</td></tr>
       <tr><td style="font-size:12px;padding-bottom:16px;word-break:break-all;"><a href="${m.link}" style="color:${ACCENT};">${m.link}</a></td></tr>
       ${codeHint}${codeBox}`
    : codeBox;
  return `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"></head>
  <body style="margin:0;padding:0;background:#eef0f3;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${m.preheader}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef0f3;padding:32px 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 1px 3px rgba(15,23,42,.08);">
          <tr><td style="background:${INK};padding:22px 30px;">
            <table role="presentation" cellpadding="0" cellspacing="0"><tr>
              <td style="vertical-align:middle;"><img src="https://artcyc.app/pwa-192.png" width="40" height="40" alt="ArtCyc" style="display:block;border:0;border-radius:10px;"></td>
              <td style="vertical-align:middle;padding-left:12px;font-size:18px;font-weight:700;color:#ffffff;letter-spacing:-.2px;">ArtCyc <span style="color:${ACCENT};">Coach</span></td>
            </tr></table>
          </td></tr>
          <tr><td style="padding:32px 34px 34px;">
            <div style="font-size:22px;font-weight:700;color:${INK};padding-bottom:12px;">${m.heading}</div>
            <div style="font-size:15px;color:#475569;line-height:1.55;padding-bottom:22px;">${m.intro}</div>
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%">${action}</table>
            <div style="border-top:1px solid #eef0f3;margin-top:8px;padding-top:16px;font-size:13px;color:#94a3b8;line-height:1.5;">${m.outro}</div>
          </td></tr>
          <tr><td style="padding:18px 34px;background:#f8fafc;border-top:1px solid #eef0f3;font-size:12px;color:#94a3b8;">ArtCyc Coach · Coaching-Tool für Kunstradsport · <a href="https://artcyc.app" style="color:#94a3b8;text-decoration:underline;">artcyc.app</a></td></tr>
        </table>
      </td></tr>
    </table>
  </body></html>`;
}

function text(m: Mail): string {
  const body = m.link
    ? `${m.cta}:\n${m.link}` + (m.code ? `\n\nOder Code in der App eingeben: ${m.code}` : "")
    : `Code: ${m.code}`;
  return `ArtCyc\n\n${m.heading}\n\n${m.intro}\n\n${body}\n\n${m.outro}\n\n—\nArtCyc · Coaching-Tool für Kunstradsport · https://artcyc.app`;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("ok", { status: 200 });
  const raw = await req.text();
  try {
    if (HOOK_SECRET && !(await verifySignature(raw, req.headers))) {
      return new Response(JSON.stringify({ error: "invalid signature" }), { status: 401 });
    }
    const payload = JSON.parse(raw) as Payload;
    const m = build(payload);
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: FROM, to: [payload.user.email], reply_to: REPLY_TO,
        subject: `${m.subject} — ArtCyc`, html: html(m), text: text(m),
      }),
    });
    const rtext = await res.text();
    if (!res.ok) {
      console.error("resend failed", res.status, rtext);
      return new Response(JSON.stringify({ error: "send failed", status: res.status, detail: rtext }), { status: 500 });
    }
    return new Response(JSON.stringify({ ok: true, resend: rtext }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (e) {
    console.error("hook error", String(e));
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 });
  }
});
