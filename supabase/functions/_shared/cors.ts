// =============================================================
// CORS-Helper für alle Edge Functions
// =============================================================
//
// Statt `Access-Control-Allow-Origin: *` (was theoretisch jede Website
// erlaubt mit dem anon-Key Calls abzusetzen) prüfen wir den Origin
// gegen eine Allowlist und antworten nur mit exaktem Match.
//
// Allowed:
//   • https://artcyc.vercel.app       — Production
//   • https://*.vercel.app            — Preview-Deploys (Branch-URLs)
//   • http://localhost:*              — lokale Entwicklung
//   • Server-to-Server-Calls (kein Origin-Header) — durchgelassen für
//     GitHub-Actions, curl, edge-internal calls
//
// Browser-Requests von anderen Origins kriegen keinen CORS-Header
// zurück — Browser blockt dann den Response.
// =============================================================

const ALLOWED_PATTERNS = [
  /^https:\/\/artcyc\.vercel\.app$/,
  /^https:\/\/[a-z0-9-]+\.vercel\.app$/,
  /^http:\/\/localhost(:\d+)?$/,
  /^http:\/\/127\.0\.0\.1(:\d+)?$/,
];

function isAllowedOrigin(origin: string): boolean {
  return ALLOWED_PATTERNS.some(re => re.test(origin));
}

/**
 * Liefert CORS-Header für die aktuelle Request. Wenn der Origin nicht
 * auf der Allowlist steht, fehlt der `Access-Control-Allow-Origin`-
 * Header — der Browser blockt dann den Response. Server-zu-Server-
 * Calls (kein Origin) gehen durch.
 */
export function corsHeaders(req: Request, allowMethods = "POST, OPTIONS"): Record<string, string> {
  const origin = req.headers.get("origin") || "";
  const base: Record<string, string> = {
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-cron-secret",
    "Access-Control-Allow-Methods": allowMethods,
    "Vary": "Origin",
  };
  if (!origin) {
    // Server-to-Server — wildcardig OK, kein Schaden weil kein Credential-Mode
    base["Access-Control-Allow-Origin"] = "*";
  } else if (isAllowedOrigin(origin)) {
    base["Access-Control-Allow-Origin"] = origin;
  }
  // sonst: keine Allow-Origin-Header → Browser blockt
  return base;
}

/**
 * JSON-Response-Header (CORS + Content-Type).
 */
export function jsonHeaders(req: Request, allowMethods?: string): Record<string, string> {
  return { ...corsHeaders(req, allowMethods), "Content-Type": "application/json; charset=utf-8" };
}
