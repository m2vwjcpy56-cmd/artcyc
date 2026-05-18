# admin-users — Owner-Only Account-Verwaltung

Privilegierte Edge-Function, die nur der App-Owner (info@neue-weberei.de)
ausführen darf. Server-seitiger Owner-Check über `OWNER_EMAILS` Env-Var
(default = info@neue-weberei.de).

## Deploy

```bash
# einmalig: Service-Role-Key muss verfügbar sein (ist in Supabase automatisch
# gesetzt, kein manuelles Secret nötig). Owner-Allowlist nur setzen wenn
# abweichend vom Default:
supabase secrets set OWNER_EMAILS="info@neue-weberei.de"

# Function deployen
supabase functions deploy admin-users
```

Falls die Supabase-CLI noch nicht eingerichtet ist:

```bash
npm i -g supabase
supabase login
supabase link --project-ref cpxsfctijcsezkspjlxy
```

## Was die Function kann

| Action | Payload | Effekt |
|---|---|---|
| `list_users` | — | Alle auth.users + Profile + verknüpfte Sportler |
| `get_user` | `{user_id}` oder `{email}` | Detail eines Users |
| `resend_confirmation` | `{user_id}` oder `{email}` | Neue Bestätigungs-Mail (Supabase-SMTP) |
| `send_magic_link` | `{user_id}` oder `{email}` | Passwortloser Login-Link |
| `send_password_reset` | `{user_id}` oder `{email}` | Passwort-Reset-Link |
| `confirm_email` | `{user_id}` | Manuell als bestätigt markieren |
| `set_role` | `{user_id, role}` | athlete / coach / admin |
| `set_display_name` | `{user_id, display_name}` | profiles.display_name |
| `update_email` | `{user_id, email, confirm?}` | E-Mail ändern (+ ggf. bestätigen) |
| `delete_user` | `{user_id}` | User komplett löschen (Cascade) |
| `create_impersonation` | `{user_id}` | Magic-Link zurückgeben, damit Owner als User einloggen kann |

## Sicherheit

- Caller-JWT wird via `auth.getUser()` validiert
- `caller.email.toLowerCase() in OWNER_EMAILS` — sonst 403
- Self-Demotion blockiert (`set_role` darf eigene Admin-Rolle nicht entfernen)
- Self-Deletion blockiert (`delete_user` darf eigenen Account nicht löschen)
- Action-Links für Mail-Aktionen werden zusätzlich zur Mail im Response
  zurückgegeben — Owner kann sie kopieren und an den User direkt schicken,
  falls Mail nicht ankommt (Supabase-Default-SMTP Ratelimit etc.)
