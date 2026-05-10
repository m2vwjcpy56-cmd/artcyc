// Aktualisiert alle Supabase-Auth-E-Mail-Templates auf ArtCyc-Branding.
// Per Supabase Management API.
const fs = require('fs');

const env = {};
fs.readFileSync('.env.local', 'utf8').split(/\r?\n/).forEach(l => {
  const m = l.match(/^([A-Z_]+)=(.*)/);
  if (m) env[m[1]] = m[2];
});

// Gemeinsamer Wrapper: Header mit Logo, Footer, CTA-Style
function wrap(title, intro, ctaLabel, ctaUrl, outro) {
  const button = ctaUrl ? `
    <table cellspacing="0" cellpadding="0" border="0" align="center" style="margin:24px auto 8px">
      <tr><td style="border-radius:14px;background:#FF9500" align="center">
        <a href="${ctaUrl}" target="_blank" style="display:inline-block;padding:14px 28px;color:#fff;text-decoration:none;font-weight:600;font-size:16px;font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',Helvetica,Arial,sans-serif;border-radius:14px">
          ${ctaLabel}
        </a>
      </td></tr>
    </table>` : '';
  const outroPart = outro ? `<p style="color:#475569;font-size:14px;line-height:1.55;margin:16px 0 0">${outro}</p>` : '';
  return `<!DOCTYPE html>
<html lang="de">
<body style="margin:0;padding:0;background:#F2F2F7;font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',Helvetica,Arial,sans-serif">
  <table cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#F2F2F7;padding:32px 12px">
    <tr><td align="center">
      <table cellspacing="0" cellpadding="0" border="0" width="520" style="max-width:520px;width:100%;background:#fff;border-radius:24px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06)">
        <tr><td style="background:linear-gradient(135deg,#0F172A,#334155);padding:28px 32px;text-align:center">
          <div style="display:inline-block;width:56px;height:56px;border-radius:14px;background:rgba(255,255,255,0.08);line-height:56px;text-align:center;font-size:30px">🏆</div>
          <div style="color:#fff;font-size:22px;font-weight:700;margin-top:10px;letter-spacing:-0.3px">ArtCyc Coach</div>
          <div style="color:#94a3b8;font-size:13px;margin-top:2px">Kunstradsport-Tracker</div>
        </td></tr>
        <tr><td style="padding:32px 32px 28px">
          <h1 style="margin:0 0 12px;color:#0f172a;font-size:22px;font-weight:700;line-height:1.3">${title}</h1>
          <p style="color:#334155;font-size:15px;line-height:1.55;margin:0">${intro}</p>
          ${button}
          ${outroPart}
        </td></tr>
        <tr><td style="background:#F9FAFB;padding:18px 32px;border-top:1px solid #E5E5EA;color:#94a3b8;font-size:12px;line-height:1.5;text-align:center">
          Diese E-Mail wurde von ArtCyc Coach automatisch versendet. Wenn du sie nicht angefordert hast, kannst du sie einfach ignorieren.<br>
          <a href="https://artcyc.vercel.app" style="color:#FF9500;text-decoration:none">artcyc.vercel.app</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

const templates = {
  // Signup-Bestätigung
  mailer_subjects_confirmation: 'Bestätige deine Anmeldung bei ArtCyc Coach',
  mailer_templates_confirmation_content: wrap(
    'Willkommen bei ArtCyc Coach',
    'Schön dass du dich registriert hast. Bestätige bitte deine E-Mail-Adresse, damit wir sicher sein können dass du der/die Richtige bist.',
    'E-Mail bestätigen',
    '{{ .ConfirmationURL }}',
    'Der Link ist 24 Stunden gültig. Danach musst du dich nochmal registrieren.'
  ),

  // Magic Link (passwordless)
  mailer_subjects_magic_link: 'Dein Login-Link für ArtCyc Coach',
  mailer_templates_magic_link_content: wrap(
    'Login per Magic Link',
    'Tippe auf den Button unten um dich automatisch einzuloggen — kein Passwort nötig.',
    'Jetzt einloggen',
    '{{ .ConfirmationURL }}',
    'Der Link funktioniert nur einmal und läuft nach 1 Stunde ab.'
  ),

  // Passwort-Reset
  mailer_subjects_recovery: 'Passwort zurücksetzen — ArtCyc Coach',
  mailer_templates_recovery_content: wrap(
    'Passwort zurücksetzen',
    'Du hast einen Passwort-Reset angefordert. Klicke auf den Button um ein neues Passwort zu vergeben.',
    'Neues Passwort festlegen',
    '{{ .ConfirmationURL }}',
    'Falls du den Reset nicht angefordert hast, ignoriere diese E-Mail — dein Konto bleibt sicher.'
  ),

  // E-Mail-Adresse ändern
  mailer_subjects_email_change: 'Neue E-Mail-Adresse bestätigen — ArtCyc Coach',
  mailer_templates_email_change_content: wrap(
    'E-Mail-Wechsel bestätigen',
    'Du hast deine E-Mail-Adresse geändert. Bestätige die neue Adresse mit einem Klick.',
    'Neue Adresse bestätigen',
    '{{ .ConfirmationURL }}',
    null
  ),

  // Einladung (für Admin-Flow falls aktiv)
  mailer_subjects_invite: 'Einladung zu ArtCyc Coach',
  mailer_templates_invite_content: wrap(
    'Du wurdest eingeladen',
    'Jemand hat dich zu ArtCyc Coach eingeladen — dem Trainings- und Wettkampf-Tool für Kunstradsport. Erstelle dein Konto mit einem Klick.',
    'Account einrichten',
    '{{ .ConfirmationURL }}',
    null
  ),

  // Reauthentication mit Code
  mailer_subjects_reauthentication: 'Bestätigungs-Code — ArtCyc Coach',
  mailer_templates_reauthentication_content: wrap(
    'Sicherheits-Bestätigung',
    'Dein Bestätigungs-Code lautet:<br><br><div style="font-family:ui-monospace,SFMono-Regular,monospace;font-size:28px;letter-spacing:6px;font-weight:700;color:#0f172a;background:#F2F2F7;padding:14px;border-radius:12px;text-align:center">{{ .Token }}</div>',
    '', '',
    'Bitte gib diesen Code in der App ein. Er ist 5 Minuten gültig.'
  )
};

const url = `https://api.supabase.com/v1/projects/${env.SUPABASE_PROJECT_REF}/config/auth`;
fetch(url, {
  method: 'PATCH',
  headers: {
    'Authorization': 'Bearer ' + env.SUPABASE_PAT,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(templates)
})
  .then(r => r.json())
  .then(data => {
    if (data.message) {
      console.error('FEHLER:', data.message);
    } else {
      console.log('✓ E-Mail-Templates aktualisiert. Aktive Subjects:');
      for (const k of Object.keys(templates)) {
        if (k.includes('subjects')) console.log('  ' + k + ' = ' + data[k]);
      }
    }
  });
