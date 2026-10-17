// =============================================================
// ArtCyc — Ski-Planung: Mail an den Organisator bei neuer Abgabe
// =============================================================
//
// Die Fragebogen-Seite /ski ruft diese Function auf, sobald jemand den
// Fragebogen abschickt oder auf der Ergebnis-Seite einen Vorschlag ergänzt.
// Die Function liest die ANTWORTEN SELBST aus der Datenbank (Service-Role),
// der Client liefert nur Name, Trip und die Beschriftungen der Fragen.
// Ohne gespeicherte Antworten/Vorschläge zu diesem Namen wird nichts
// verschickt — so lässt sich die Function nicht als Spam-Schleuder nutzen.
//
// Aufruf vom Client:
//   POST /functions/v1/ski-notify   (Authorization: Bearer <anon-key>)
//   Body: { trip, name, kind: 'submit' | 'suggestion', polls: [...] }
//
// Env-Vars:
//   RESEND_API_KEY    — Pflicht (ist für die anderen Mails schon gesetzt)
//   SKI_NOTIFY_EMAIL  — Empfänger, Default info@artcyc.app
// =============================================================

// @ts-ignore Deno
import { createClient } from "jsr:@supabase/supabase-js@2";
// @ts-ignore Deno-Runtime resolution
import { corsHeaders, jsonHeaders } from "../_shared/cors.ts";
// @ts-ignore Deno-Runtime resolution
import { SKI_MEMBERS } from "../_shared/ski-members.ts";

// @ts-ignore Deno-Runtime
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
// @ts-ignore Deno-Runtime
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
// @ts-ignore Deno-Runtime
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
// @ts-ignore Deno-Runtime
const TO = Deno.env.get("SKI_NOTIFY_EMAIL") || "info@artcyc.app";
const FROM = "ArtCyc Ski-Planung <no-reply@artcyc.app>";
const PAGE_URL = "https://artcyc.app/ski";
const LIKES_POLL = "likes";

// ---- Rate-Limits (in-memory, pro Function-Instanz) -----------------------
const ipBuckets = new Map<string, number[]>();
const cooldown = new Map<string, number>();
const IP_WINDOW_MS = 10 * 60_000;
const IP_MAX = 20;
const NAME_COOLDOWN_MS = 30_000;

function clientIp(req: Request): string {
  return (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
}
function ipAllowed(ip: string): boolean {
  const now = Date.now();
  const hits = (ipBuckets.get(ip) || []).filter((t) => now - t < IP_WINDOW_MS);
  if (hits.length >= IP_MAX) { ipBuckets.set(ip, hits); return false; }
  hits.push(now); ipBuckets.set(ip, hits);
  return true;
}

function esc(s: unknown): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

type Option = { id: string; label: string };
type Poll = { id: string; title: string; kind?: string; options: Option[] };

// Beschriftungen vom Client nur zur Darstellung übernehmen — begrenzt und bereinigt.
function cleanPolls(raw: unknown): Poll[] {
  if (!Array.isArray(raw)) return [];
  return raw.slice(0, 20).map((p: any) => ({
    id: String(p?.id ?? "").slice(0, 40),
    title: String(p?.title ?? "").slice(0, 120),
    kind: p?.kind === "availability" ? "availability" : undefined,
    options: Array.isArray(p?.options)
      ? p.options.slice(0, 12).map((o: any) => ({ id: String(o?.id ?? "").slice(0, 40), label: String(o?.label ?? "").slice(0, 120) }))
      : [],
  })).filter((p) => p.id && p.options.length);
}

async function sendMail(subject: string, html: string, text: string) {
  if (!RESEND_API_KEY) return { ok: false, error: "RESEND_API_KEY fehlt" };
  if (!TO) return { ok: false, error: "kein Empfaenger (SKI_NOTIFY_EMAIL) gesetzt" };
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": "Bearer " + RESEND_API_KEY },
    body: JSON.stringify({ from: FROM, to: [TO], subject, html, text }),
  });
  if (!res.ok) return { ok: false, error: `Resend ${res.status}: ${await res.text()}` };
  return { ok: true };
}

// Komplette Auswertung für die Abschluss-Mail.
function buildFinal(polls: Poll[], allVotes: any[], rawVotes: any[], sugs: any[]) {
  const names = (pid: string, oid: string) => allVotes.filter((v) => v.poll_id === pid && v.answers?.value === oid).map((v) => v.name);
  const avail = polls.filter((p) => p.kind === "availability");
  let fav = "";
  let best = -1;
  for (const p of avail) {
    const n = names(p.id, "yes").length;
    if (n > best) { best = n; fav = p.title; } else if (n === best) fav += " / " + p.title;
  }
  const likes: Record<string, string[]> = {};
  for (const v of rawVotes) if (v.poll_id === LIKES_POLL) for (const id of (v.answers?.selected || [])) (likes[id] ||= []).push(v.name);
  const sortedSugs = [...sugs].sort((a, b) => (likes[b.id]?.length || 0) - (likes[a.id]?.length || 0));

  const sec = (title: string, body: string) => `<h3 style="margin:20px 0 8px;font-size:13px;text-transform:uppercase;letter-spacing:.06em;color:#94A3B8">${esc(title)}</h3>${body}`;
  const pollHtml = polls.map((p) => sec(p.title, `<table style="border-collapse:collapse;font-size:14px;width:100%">${p.options.map((o) => {
    const ns = names(p.id, o.id);
    return `<tr><td style="padding:5px 10px 5px 0;vertical-align:top;white-space:nowrap;font-weight:700;color:#0F172A">${esc(o.label)} · ${ns.length}</td><td style="padding:5px 0;color:#475569">${esc(ns.join(", ") || "—")}</td></tr>`;
  }).join("")}</table>`)).join("");
  const sugHtml = sortedSugs.length
    ? sec("Vorschläge", `<ul style="margin:0;padding-left:18px;font-size:14px;color:#0F172A">${sortedSugs.map((s) => `<li>${esc(s.text)} <span style="color:#64748B">(von ${esc(s.name)}${likes[s.id]?.length ? `, 👍 ${likes[s.id].length}` : ""})</span></li>`).join("")}</ul>`)
    : "";
  const count = new Set(allVotes.map((v) => v.name_key)).size;
  const subject = `✅ Ski 2027: Alle ${SKI_MEMBERS.length} haben abgestimmt`;
  const html = `<!doctype html><html><body style="margin:0;background:#F1F5F9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <div style="max-width:600px;margin:0 auto;padding:24px 16px">
    <div style="background:#0B1F3A;color:#fff;border-radius:16px 16px 0 0;padding:20px 22px">
      <div style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;opacity:.7">Skifahren 2027 · Auswertung</div>
      <div style="font-size:22px;font-weight:800;margin-top:4px">Alle ${SKI_MEMBERS.length} haben abgestimmt 🎉</div>
      ${fav && best > 0 ? `<div style="margin-top:10px;font-size:15px">Favorit: <b>${esc(fav)}</b> mit ${best}× „Passt"</div>` : ""}
    </div>
    <div style="background:#fff;border-radius:0 0 16px 16px;padding:6px 22px 20px">
      ${pollHtml}${sugHtml}
      <p style="margin:22px 0 0"><a href="${PAGE_URL}" style="display:inline-block;background:#FF9500;color:#fff;text-decoration:none;font-weight:700;padding:11px 18px;border-radius:999px">Ergebnisse ansehen</a></p>
    </div>
  </div></body></html>`;
  const text = [
    `Alle ${SKI_MEMBERS.length} haben abgestimmt (${count} Antworten).`,
    fav && best > 0 ? `Favorit: ${fav} mit ${best}x "Passt"` : "",
    "",
    ...polls.flatMap((p) => [p.title, ...p.options.map((o) => { const ns = names(p.id, o.id); return `  ${o.label} (${ns.length}): ${ns.join(", ") || "-"}`; }), ""]),
    ...(sortedSugs.length ? ["Vorschläge:", ...sortedSugs.map((s) => `  - ${s.text} (von ${s.name}${likes[s.id]?.length ? `, ${likes[s.id].length} Daumen` : ""})`), ""] : []),
    PAGE_URL,
  ].join("\n");
  return { subject, html, text };
}

// @ts-ignore Deno-Runtime
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders(req) });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: corsHeaders(req) });
  const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: jsonHeaders(req) });

  if (!ipAllowed(clientIp(req))) return json({ error: "rate limited" }, 429);
  if (parseInt(req.headers.get("content-length") || "0", 10) > 32 * 1024) return json({ error: "body too large" }, 413);

  let body: any = {};
  try { body = await req.json(); } catch { /* leer */ }
  const trip = String(body?.trip ?? "").trim();
  const name = String(body?.name ?? "").trim();
  const kind = body?.kind === "suggestion" ? "suggestion" : "submit";
  if (!/^[a-z0-9-]{1,40}$/.test(trip) || name.length < 1 || name.length > 40) return json({ error: "ungueltige Eingabe" }, 400);
  const polls = cleanPolls(body?.polls);
  const nameKey = name.toLowerCase();

  const ck = `${trip}|${nameKey}|${kind}`;
  const last = cooldown.get(ck) || 0;
  if (Date.now() - last < NAME_COOLDOWN_MS) return json({ ok: true, mail_sent: false, reason: "cooldown" });

  if (!SUPABASE_URL || !SERVICE_ROLE) return json({ error: "server config" }, 500);
  const db = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });
  const [{ data: votes, error: vErr }, { data: sugs, error: sErr }] = await Promise.all([
    db.from("ski_votes").select("poll_id,name,name_key,answers").eq("trip", trip),
    db.from("ski_suggestions").select("id,name,text,created_at").eq("trip", trip).order("created_at", { ascending: true }),
  ]);
  if (vErr || sErr) return json({ error: (vErr || sErr)?.message }, 500);

  const allVotes = (votes || []).filter((v: any) => v.poll_id !== LIKES_POLL);
  const mine = allVotes.filter((v: any) => v.name_key === nameKey);
  const mySugs = (sugs || []).filter((s: any) => String(s.name).trim().toLowerCase() === nameKey);
  if (mine.length === 0 && mySugs.length === 0) return json({ ok: true, mail_sent: false, reason: "nichts gespeichert" });
  const display = mine[0]?.name || mySugs[0]?.name || name;

  // Antworten der Person
  const labelOf = (p: Poll, val: unknown) => p.options.find((o) => o.id === val)?.label ?? (val ? String(val) : "—");
  const answerRows = polls.map((p) => {
    const v = mine.find((x: any) => x.poll_id === p.id);
    return [p.title, labelOf(p, v?.answers?.value)];
  });

  // Gesamtstand
  const people = new Set(allVotes.map((v: any) => v.name_key));
  // „abgestimmt" = hat die erste Frage (dabei?) beantwortet
  const keyPoll = polls.find((p) => p.id === "dabei")?.id || polls[0]?.id;
  const votedKeys = new Set(allVotes.filter((v: any) => v.poll_id === keyPoll).map((v: any) => v.name_key));
  const missing = SKI_MEMBERS.filter((m) => !votedKeys.has(m.trim().toLowerCase()));
  const allDone = !!keyPoll && SKI_MEMBERS.length > 0 && missing.length === 0;
  const standRows = polls.map((p) => {
    const counts = p.options.map((o) => ({ label: o.label, n: allVotes.filter((v: any) => v.poll_id === p.id && v.answers?.value === o.id).length }));
    return [p.title, counts.map((c) => `${c.label}: ${c.n}`).join(" · ")];
  });

  const isSug = kind === "suggestion";
  const subject = isSug ? `⛷️ Ski 2027: neuer Vorschlag von ${display}` : `⛷️ Ski 2027: ${display} hat abgestimmt`;
  const sugList = isSug ? mySugs.slice(-3) : mySugs;

  const tr = (a: string, b: string) => `<tr><td style="padding:6px 12px 6px 0;color:#64748B;vertical-align:top">${esc(a)}</td><td style="padding:6px 0;font-weight:600;color:#0F172A">${esc(b)}</td></tr>`;
  const html = `<!doctype html><html><body style="margin:0;background:#F1F5F9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <div style="max-width:560px;margin:0 auto;padding:24px 16px">
    <div style="background:#0B1F3A;color:#fff;border-radius:16px 16px 0 0;padding:20px 22px">
      <div style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;opacity:.7">Skifahren 2027</div>
      <div style="font-size:22px;font-weight:800;margin-top:4px">${esc(isSug ? `Neuer Vorschlag von ${display}` : `${display} hat abgestimmt`)}</div>
    </div>
    <div style="background:#fff;border-radius:0 0 16px 16px;padding:18px 22px">
      ${!isSug && answerRows.length ? `<h3 style="margin:0 0 6px;font-size:13px;text-transform:uppercase;letter-spacing:.06em;color:#94A3B8">Antworten</h3><table style="border-collapse:collapse;font-size:15px">${answerRows.map(([a, b]) => tr(a, b)).join("")}</table>` : ""}
      ${sugList.length ? `<h3 style="margin:18px 0 6px;font-size:13px;text-transform:uppercase;letter-spacing:.06em;color:#94A3B8">Vorschläge</h3><ul style="margin:0;padding-left:18px;font-size:15px;color:#0F172A">${sugList.map((s: any) => `<li>${esc(s.text)}</li>`).join("")}</ul>` : ""}
      <h3 style="margin:18px 0 6px;font-size:13px;text-transform:uppercase;letter-spacing:.06em;color:#94A3B8">Zwischenstand · ${people.size} ${people.size === 1 ? "Person" : "Personen"}</h3>
      <table style="border-collapse:collapse;font-size:14px">${standRows.map(([a, b]) => tr(a, b)).join("")}</table>
      ${missing.length ? `<p style="margin:16px 0 0;font-size:14px;color:#64748B">Es fehlen noch ${missing.length}: ${esc(missing.join(", "))}</p>` : `<p style="margin:16px 0 0;font-size:14px;font-weight:700;color:#16A34A">Alle haben abgestimmt ✓</p>`}
      <p style="margin:22px 0 0"><a href="${PAGE_URL}" style="display:inline-block;background:#FF9500;color:#fff;text-decoration:none;font-weight:700;padding:11px 18px;border-radius:999px">Alle Ergebnisse ansehen</a></p>
    </div>
  </div></body></html>`;
  const text = [
    isSug ? `Neuer Vorschlag von ${display}` : `${display} hat abgestimmt`,
    "",
    ...(!isSug ? answerRows.map(([a, b]) => `${a}: ${b}`) : []),
    ...(sugList.length ? ["", "Vorschläge:", ...sugList.map((s: any) => `- ${s.text}`)] : []),
    "",
    `Zwischenstand (${people.size}):`,
    ...standRows.map(([a, b]) => `${a}: ${b}`),
    missing.length ? `Es fehlen noch ${missing.length}: ${missing.join(", ")}` : "Alle haben abgestimmt.",
    "",
    PAGE_URL,
  ].join("\n");

  const r = await sendMail(subject, html, text);
  if (r.ok) cooldown.set(ck, Date.now());

  // ---- Abschluss-Mail, sobald ALLE aus der Namensliste abgestimmt haben ----
  // Einmalig: ski_events merkt sich den Versand (Primärschlüssel trip+event).
  // Kommt später jemand neu auf die Liste, gibt es nach dessen Abstimmung
  // eine neue Abschluss-Mail (event enthält die Listenlänge).
  let finalSent = false;
  if (allDone) {
    const event = `all-voted:${SKI_MEMBERS.length}`;
    const { error: evErr } = await db.from("ski_events").insert({ trip, event });
    if (!evErr) {
      const f = buildFinal(polls, allVotes, votes || [], sugs || []);
      const fr = await sendMail(f.subject, f.html, f.text);
      if (!fr.ok) await db.from("ski_events").delete().eq("trip", trip).eq("event", event);
      finalSent = fr.ok;
    }
  }
  return json({ ok: r.ok, mail_sent: r.ok, final_sent: finalSent, error: r.ok ? undefined : r.error }, r.ok ? 200 : 502);
});
