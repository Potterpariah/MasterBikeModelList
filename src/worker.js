import {eventMapAsset} from './interactive-event-map.js';
import {discoveryMetrics} from './discovery-metrics.js';
import {publicPages} from './public-pages.js';
import {canIndex} from './seo.js';
import {editEvent} from './editorial.js';
import { homepage, readCatalog, portalAsset } from './portal.js';
import { readSavedLibrary } from './saved-library.js';

const SESSION_COOKIE = "bp_session";
const PBKDF2_ITERATIONS = 100000;
const SESSION_DAYS_DEFAULT = 30;
const MAX_JSON_BYTES = 128 * 1024;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);
      const method = request.method.toUpperCase();
      const metricResponse=await discoveryMetrics(request,env);
      if(metricResponse)return metricResponse;

      if (!["GET", "HEAD", "OPTIONS"].includes(method)) {
        const origin = request.headers.get("Origin");
        if (origin && origin !== url.origin) return json({ error: "Origin rejected" }, 403);
        if (url.pathname.startsWith('/api/') && url.pathname !== '/api/auth/logout') {
          const auth = url.pathname.startsWith('/api/auth/');
          const limiter = auth ? env.AUTH_LIMITER : env.WRITE_LIMITER;
          if (!limiter && env.ENVIRONMENT === 'production') return json({error:'Request protection is temporarily unavailable'},503);
          if (limiter) {
            const actor = auth ? request.headers.get('CF-Connecting-IP') : (await getUser(request,env)).id;
            if (!actor && env.ENVIRONMENT === 'production') return json({error:'Request protection is temporarily unavailable'},503);
            const {success} = await limiter.limit({key:'bike-portal-stage4:'+(auth?'auth:':'write:')+(actor || 'local')});
            if (!success) return json({error:'Too many requests. Please wait a minute and try again.'},429,{'Retry-After':'60'});
          }
        }
      }

      if (method === "OPTIONS") return new Response(null, { status: 204, headers: securityHeaders() });

      const page=await publicPages(request,env);
      if(page)return new Response(page.body,{status:page.status,headers:withHeaders(page.headers)});

      if (url.pathname === "/" && ["GET", "HEAD"].includes(method)) {
        const body = method === "HEAD" ? null : await homepage(request, env, { listEvents, listDiscussions });
        return new Response(body, { headers: withHeaders({ "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag":canIndex(request,env,true)?"index, follow":"noindex, nofollow" }) });
      }
      if (["GET", "HEAD"].includes(method)) {
        const asset = eventMapAsset(url.pathname) || portalAsset(url.pathname);
        if (asset) return new Response(method === "HEAD" ? null : asset.body, { headers: withHeaders({ "Content-Type": asset.type, "Cache-Control": "public, max-age=300" }) });
      }
      if (url.pathname === "/api/portal/catalog" && method === "GET") return json(await readCatalog(env));

      if (url.pathname === "/api/health" && method === "GET") {
        const row = await env.DB.prepare("SELECT value FROM schema_meta WHERE key='schema_version'").first();
        return json({ ok: true, stage: 4, schemaVersion: row?.value ?? null });
      }

      if (url.pathname === "/stage4-test" && method === "GET") return html(testPage(env));

      if (url.pathname.startsWith("/media/") && method === "GET") {
        return serveMedia(request, env, decodeURIComponent(url.pathname.slice(7)));
      }

      if (url.pathname === "/api/auth/signup" && method === "POST") return signup(request, env);
      if (url.pathname === "/api/auth/login" && method === "POST") return login(request, env);
      if (url.pathname === "/api/auth/logout" && method === "POST") return logout(request, env);

      if (url.pathname === "/api/me" && method === "GET") return getMe(request, env);
      if (url.pathname === "/api/me/activity" && method === "GET") return getActivity(request, env);
      if (url.pathname === "/api/me/library" && method === "GET") {
        const user=await getUser(request,env);
        return json(await readSavedLibrary(env,user.id));
      }
      if (url.pathname === "/api/me/profile" && method === "PATCH") return updateProfile(request, env);
      if (url.pathname === "/api/me/avatar" && method === "POST") return uploadAvatar(request, env);

      if (url.pathname.startsWith("/api/users/") && method === "GET") {
        return getPublicUser(request, env, decodeURIComponent(url.pathname.slice("/api/users/".length)));
      }

      if (url.pathname === "/api/garage" && method === "GET") return listGarage(request, env);
      if (url.pathname === "/api/garage" && method === "POST") return addGarageBike(request, env);
      if (url.pathname.startsWith("/api/garage/") && method === "DELETE") {
        return deleteGarageBike(request, env, url.pathname.slice("/api/garage/".length));
      }

      if (url.pathname === "/api/events" && method === "GET") return listEvents(request, env);
      if (url.pathname.startsWith("/api/events/")) {
        const rest = url.pathname.slice("/api/events/".length);
        const parts = rest.split("/");
        const eventId = parts[0];
        if (parts.length === 1 && method === "GET") return getEvent(request, env, eventId);
        if (parts[1] === "status" && method === "POST") return setEventStatus(request, env, eventId);
      }

      if (url.pathname === "/api/discussions" && method === "GET") return listDiscussions(request, env);
      if (url.pathname === "/api/discussions" && method === "POST") return createDiscussion(request, env);
      if (url.pathname.startsWith("/api/discussions/")) {
        const rest = url.pathname.slice("/api/discussions/".length);
        const parts = rest.split("/");
        const discussionId = parts[0];
        if (parts.length === 1 && method === "GET") return getDiscussion(request, env, discussionId);
        if (parts[1] === "comments" && method === "POST") return createComment(request, env, discussionId);
      }

      if (url.pathname === "/api/reactions" && method === "POST") return setReaction(request, env);
      if (url.pathname === "/api/follows" && method === "POST") return addGeneric(request, env, "follows");
      if (url.pathname === "/api/follows" && method === "DELETE") return removeGeneric(request, env, "follows");
      if (url.pathname === "/api/saves" && method === "POST") return addGeneric(request, env, "saved_items");
      if (url.pathname === "/api/saves" && method === "DELETE") return removeGeneric(request, env, "saved_items");

      if (url.pathname === "/api/notifications" && method === "GET") return listNotifications(request, env);
      if (/^\/api\/notifications\/[^/]+\/read$/.test(url.pathname) && method === "POST") {
        const id = url.pathname.split("/")[3];
        return markNotificationRead(request, env, id);
      }

      if (url.pathname === "/api/reports" && method === "POST") return createReport(request, env);
      if (url.pathname === "/api/mod/reports" && method === "GET") return listReports(request, env);
      if (/^\/api\/mod\/reports\/[^/]+\/resolve$/.test(url.pathname) && method === "POST") {
        const id = url.pathname.split("/")[4];
        return resolveReport(request, env, id);
      }

      return json({ error: "Not found" }, 404);
    } catch (err) {
      if (err instanceof HttpError) return handle(err);
      console.error(err);
      return json({ error: "Internal server error" }, 500);
    }
  }
};

function securityHeaders() {
  return {
    "X-Robots-Tag": "noindex, nofollow",
    "Content-Security-Policy": "default-src 'self'; img-src 'self' data: https://tile.openstreetmap.org; connect-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com; frame-src https://challenges.cloudflare.com; base-uri 'self'; form-action 'self'; frame-ancestors 'none'",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()"
  };
}
function withHeaders(headers = {}) { return { ...securityHeaders(), ...headers }; }
function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), { status, headers: withHeaders({ "Content-Type": "application/json; charset=utf-8", "Cache-Control":"no-store", ...headers }) });
}
function html(body, status = 200) {
  return new Response(body, { status, headers: withHeaders({ "Content-Type": "text/html; charset=utf-8" }) });
}
async function readJson(request) {
  const len = Number(request.headers.get("content-length") || "0");
  if (len > MAX_JSON_BYTES) throw new HttpError(413, "Request too large");
  if (!request.headers.get("content-type")?.includes("application/json")) throw new HttpError(415, "JSON required");
  try { return await request.json(); } catch { throw new HttpError(400, "Invalid JSON"); }
}
class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}
function cleanText(value, max, required = false) {
  const v = typeof value === "string" ? value.trim() : "";
  if (required && !v) throw new HttpError(400, "Required field missing");
  if (v.length > max) throw new HttpError(400, `Field exceeds ${max} characters`);
  return v;
}
function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) && v.length <= 254; }
function isUsername(v) { return /^[A-Za-z0-9_]{3,30}$/.test(v); }
function slugify(v) {
  return v.toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 90) || crypto.randomUUID();
}
function bytesToB64(bytes) {
  let s = ""; for (const b of bytes) s += String.fromCharCode(b); return btoa(s);
}
function b64ToBytes(s) {
  const raw = atob(s); return Uint8Array.from(raw, c => c.charCodeAt(0));
}
function bytesToHex(bytes) { return [...bytes].map(b => b.toString(16).padStart(2,"0")).join(""); }
async function sha256Hex(text) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return bytesToHex(new Uint8Array(digest));
}
async function hashPassword(password, saltB64, iterations = PBKDF2_ITERATIONS) {
  const salt = saltB64 ? b64ToBytes(saltB64) : crypto.getRandomValues(new Uint8Array(16));
  const material = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations, hash: "SHA-256" }, material, 256);
  return { hash: bytesToB64(new Uint8Array(bits)), salt: bytesToB64(salt), iterations };
}
async function verifyPassword(password, row) {
  const candidate = await hashPassword(password, row.password_salt, row.password_iterations);
  const a = b64ToBytes(candidate.hash), b = b64ToBytes(row.password_hash);
  if (a.byteLength !== b.byteLength) return false;
  if (crypto.subtle.timingSafeEqual) return crypto.subtle.timingSafeEqual(a, b);
  let diff = 0; for (let i=0;i<a.length;i++) diff |= a[i] ^ b[i]; return diff === 0;
}
function randomToken() {
  const b = crypto.getRandomValues(new Uint8Array(32));
  return bytesToB64(b).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
}
function parseCookies(request) {
  const out = {}; const raw = request.headers.get("Cookie") || "";
  for (const part of raw.split(";")) {
    const idx = part.indexOf("="); if (idx < 0) continue;
    out[part.slice(0, idx).trim()] = decodeURIComponent(part.slice(idx+1).trim());
  }
  return out;
}
function sessionCookie(token, env, maxAge) {
  const secure = env.ENVIRONMENT === "production" ? "; Secure" : "";
  return `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax${secure}; Max-Age=${maxAge}`;
}
async function getUser(request, env, required = true) {
  const token = parseCookies(request)[SESSION_COOKIE];
  if (!token) { if (required) throw new HttpError(401, "Sign in required"); return null; }
  const tokenHash = await sha256Hex(token);
  const row = await env.DB.prepare(`
    SELECT u.id,u.email,u.username,u.display_name,u.role,u.status,u.bio,u.location_text,u.website_url,u.avatar_key,
           s.expires_at
    FROM sessions s JOIN users u ON u.id=s.user_id
    WHERE s.token_hash=? AND s.expires_at > CURRENT_TIMESTAMP AND u.status='active'
  `).bind(tokenHash).first();
  if (!row) { if (required) throw new HttpError(401, "Session expired"); return null; }
  env.DB.prepare("UPDATE sessions SET last_seen_at=CURRENT_TIMESTAMP WHERE token_hash=?").bind(tokenHash).run().catch(()=>{});
  return row;
}
async function issueSession(userId, env) {
  const raw = randomToken();
  const tokenHash = await sha256Hex(raw);
  const days = Math.max(1, Math.min(90, Number(env.SESSION_TTL_DAYS || SESSION_DAYS_DEFAULT)));
  await env.DB.prepare("INSERT INTO sessions(token_hash,user_id,expires_at) VALUES(?,?,datetime('now',?))")
    .bind(tokenHash, userId, `+${days} days`).run();
  return { raw, maxAge: days * 86400 };
}
async function validateTurnstile(token, request, env) {
  if (!env.TURNSTILE_SECRET) {
    if (env.ENVIRONMENT === "production") throw new HttpError(500, "Turnstile secret is not configured");
    return true;
  }
  if (!token) throw new HttpError(400, "Turnstile validation required");
  const form = new FormData();
  form.append("secret", env.TURNSTILE_SECRET);
  form.append("response", token);
  const ip = request.headers.get("CF-Connecting-IP");
  if (ip) form.append("remoteip", ip);
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: form });
  const data = await res.json();
  if (!data.success) throw new HttpError(400, "Human verification failed");
  return true;
}

async function signup(request, env) {
  try {
    const body = await readJson(request);
    await validateTurnstile(body.turnstileToken, request, env);
    const email = cleanText(body.email, 254, true).toLowerCase();
    const username = cleanText(body.username, 30, true);
    const password = typeof body.password === "string" ? body.password : "";
    if (!isEmail(email)) throw new HttpError(400, "Invalid email");
    if (!isUsername(username)) throw new HttpError(400, "Username must be 3-30 letters, numbers, or underscores");
    const passwordBytes = new TextEncoder().encode(password).byteLength;
    if (passwordBytes < 10) throw new HttpError(400, "Password must be at least 10 characters");
    if (passwordBytes > 1024) throw new HttpError(400, "Password is too long");
    const existing = await env.DB.prepare("SELECT id FROM users WHERE email=? OR username=? COLLATE NOCASE").bind(email, username).first();
    if (existing) throw new HttpError(409, "Email or username already exists");
    const p = await hashPassword(password);
    const id = crypto.randomUUID();
    await env.DB.prepare(`
      INSERT INTO users(id,email,username,display_name,password_hash,password_salt,password_iterations)
      VALUES(?,?,?,?,?,?,?)
    `).bind(id,email,username,username,p.hash,p.salt,p.iterations).run();
    const s = await issueSession(id, env);
    return json({ ok: true, user: { id, email, username, display_name: username, role: "member" } }, 201, {
      "Set-Cookie": sessionCookie(s.raw, env, s.maxAge)
    });
  } catch (e) { return handle(e); }
}
async function login(request, env) {
  try {
    const body = await readJson(request);
    const identity = cleanText(body.identity, 254, true).toLowerCase();
    const password = typeof body.password === "string" ? body.password : "";
    const row = await env.DB.prepare(`
      SELECT id,email,username,display_name,role,status,password_hash,password_salt,password_iterations
      FROM users WHERE lower(email)=? OR lower(username)=?
    `).bind(identity, identity).first();
    if (!row || row.status !== "active" || !(await verifyPassword(password, row))) throw new HttpError(401, "Invalid credentials");
    await env.DB.batch([
      env.DB.prepare("UPDATE users SET last_login_at=CURRENT_TIMESTAMP WHERE id=?").bind(row.id),
      env.DB.prepare("DELETE FROM sessions WHERE expires_at <= CURRENT_TIMESTAMP")
    ]);
    const s = await issueSession(row.id, env);
    return json({ ok: true, user: { id: row.id, email: row.email, username: row.username, display_name: row.display_name, role: row.role } }, 200, {
      "Set-Cookie": sessionCookie(s.raw, env, s.maxAge)
    });
  } catch (e) { return handle(e); }
}
async function logout(request, env) {
  try {
    const token = parseCookies(request)[SESSION_COOKIE];
    if (token) await env.DB.prepare("DELETE FROM sessions WHERE token_hash=?").bind(await sha256Hex(token)).run();
    return json({ ok: true }, 200, { "Set-Cookie": sessionCookie("", env, 0) });
  } catch (e) { return handle(e); }
}
async function getMe(request, env) {
  try {
    const u = await getUser(request, env);
    return json({ user: publicUserShape(u, true) });
  } catch (e) { return handle(e); }
}
async function updateProfile(request, env) {
  try {
    const u = await getUser(request, env);
    const body = await readJson(request);
    const display = cleanText(body.display_name ?? u.display_name ?? u.username, 80);
    const bio = cleanText(body.bio ?? u.bio ?? "", 500);
    const location = cleanText(body.location_text ?? u.location_text ?? "", 80);
    const website = cleanText(body.website_url ?? u.website_url ?? "", 200);
    if (website && !/^https?:\/\//i.test(website)) throw new HttpError(400, "Website must begin with http:// or https://");
    await env.DB.prepare(`
      UPDATE users SET display_name=?,bio=?,location_text=?,website_url=?,updated_at=CURRENT_TIMESTAMP WHERE id=?
    `).bind(display,bio,location,website,u.id).run();
    return json({ ok: true });
  } catch (e) { return handle(e); }
}
async function uploadAvatar(request, env) {
  try {
    const u = await getUser(request, env);
    if (!env.MEDIA) throw new HttpError(503, "R2 media binding is not configured");
    const fd = await request.formData();
    const file = fd.get("file");
    if (!(file instanceof File)) throw new HttpError(400, "Image file required");
    if (!IMAGE_TYPES.has(file.type)) throw new HttpError(415, "JPEG, PNG, or WebP only");
    if (file.size > MAX_IMAGE_BYTES) throw new HttpError(413, "Image must be 5 MB or smaller");
    const bytes = new Uint8Array(await file.arrayBuffer());
    const png = [137,80,78,71,13,10,26,10].every((b,i)=>bytes[i]===b);
    const jpg = bytes[0]===255 && bytes[1]===216 && bytes[2]===255;
    const webp = String.fromCharCode(...bytes.slice(0,4))==='RIFF' && String.fromCharCode(...bytes.slice(8,12))==='WEBP';
    if (!(file.type==='image/png' && png || file.type==='image/jpeg' && jpg || file.type==='image/webp' && webp)) throw new HttpError(415,'Image contents do not match the selected image type');
    const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    const key = `avatars/${u.id}/${crypto.randomUUID()}.${ext}`;
    await env.MEDIA.put(key, bytes, { httpMetadata: { contentType: file.type, cacheControl: "public, max-age=3600" } });
    await env.DB.batch([
      env.DB.prepare("INSERT INTO media_assets(id,owner_user_id,r2_key,media_type,bytes,purpose) VALUES(?,?,?,?,?,?)")
        .bind(crypto.randomUUID(),u.id,key,file.type,file.size,"avatar"),
      env.DB.prepare("UPDATE users SET avatar_key=?,updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(key,u.id)
    ]);
    return json({ ok: true, avatar_url: `/media/${encodeURIComponent(key)}` }, 201);
  } catch (e) { return handle(e); }
}
async function serveMedia(request, env, key) {
  if (!env.MEDIA) return json({ error: "Media unavailable" }, 503);
  const obj = await env.MEDIA.get(key);
  if (!obj) return json({ error: "Not found" }, 404);
  const h = new Headers(securityHeaders());
  obj.writeHttpMetadata(h);
  h.set("ETag", obj.httpEtag);
  h.set("X-Content-Type-Options", "nosniff");
  return new Response(obj.body, { headers: h });
}
function publicUserShape(u, privateFields=false) {
  const out = {
    id: u.id, username: u.username, display_name: u.display_name, role: u.role,
    bio: u.bio, location_text: u.location_text, website_url: u.website_url,
    avatar_url: u.avatar_key ? `/media/${encodeURIComponent(u.avatar_key)}` : null
  };
  if (privateFields) out.email = u.email;
  return out;
}
async function getPublicUser(request, env, username) {
  try {
    const u = await env.DB.prepare(`
      SELECT id,username,display_name,role,bio,location_text,website_url,avatar_key
      FROM users WHERE username=? COLLATE NOCASE AND status='active'
    `).bind(username).first();
    if (!u) throw new HttpError(404, "User not found");
    const bikes = await env.DB.prepare(`
      SELECT ub.id,ub.model_year,ub.nickname,ub.notes,ub.is_current,
             COALESCE(b.name,ub.custom_brand) brand, COALESCE(m.name,ub.custom_model) model
      FROM user_bikes ub LEFT JOIN brands b ON b.id=ub.brand_id LEFT JOIN bike_models m ON m.id=ub.model_id
      WHERE ub.user_id=? ORDER BY ub.is_current DESC, ub.created_at DESC LIMIT 50
    `).bind(u.id).all();
    return json({ user: publicUserShape(u), garage: bikes.results });
  } catch (e) { return handle(e); }
}
async function listGarage(request, env) {
  try {
    const u = await getUser(request, env);
    const rows = await env.DB.prepare(`
      SELECT ub.*, b.name brand_name, m.name model_name
      FROM user_bikes ub LEFT JOIN brands b ON b.id=ub.brand_id LEFT JOIN bike_models m ON m.id=ub.model_id
      WHERE ub.user_id=? ORDER BY ub.is_current DESC, ub.created_at DESC
    `).bind(u.id).all();
    return json({ bikes: rows.results });
  } catch (e) { return handle(e); }
}
async function addGarageBike(request, env) {
  try {
    const u = await getUser(request, env);
    const b = await readJson(request);
    const id = crypto.randomUUID();
    const year = b.model_year == null ? null : Number(b.model_year);
    if (year != null && (!Number.isInteger(year) || year < 1880 || year > 2100)) throw new HttpError(400, "Invalid model year");
    await env.DB.prepare(`
      INSERT INTO user_bikes(id,user_id,brand_id,model_id,custom_brand,custom_model,model_year,nickname,notes,is_current)
      VALUES(?,?,?,?,?,?,?,?,?,?)
    `).bind(
      id,u.id,b.brand_id||null,b.model_id||null,cleanText(b.custom_brand,80),cleanText(b.custom_model,100),
      year,cleanText(b.nickname,80),cleanText(b.notes,1000),b.is_current === false ? 0 : 1
    ).run();
    return json({ ok: true, id }, 201);
  } catch (e) { return handle(e); }
}
async function deleteGarageBike(request, env, id) {
  try {
    const u = await getUser(request, env);
    await env.DB.prepare("DELETE FROM user_bikes WHERE id=? AND user_id=?").bind(id,u.id).run();
    return json({ ok: true });
  } catch (e) { return handle(e); }
}

async function listEvents(request, env) {
  try {
    const url = new URL(request.url);
    const city = cleanText(url.searchParams.get("city"), 80);
    const discipline = cleanText(url.searchParams.get("discipline"), 40);
    const from = cleanText(url.searchParams.get("from"), 10);
    const to = cleanText(url.searchParams.get("to"), 10);
    const limit = Math.min(100, Math.max(1, Number(url.searchParams.get("limit") || 50)));
    let sql = "SELECT id,slug,title,start_date,end_date,city,state,venue_name,disciplines_json,event_types_json,distances_json,source_url,registration_url,verification_status,verified_on,notes FROM events WHERE 1=1";
    const args = [];
    if (city) { sql += " AND city=? COLLATE NOCASE"; args.push(city); }
    if (from) { sql += " AND start_date>=?"; args.push(from); }
    if (to) { sql += " AND start_date<=?"; args.push(to); }
    if (discipline) { sql += " AND disciplines_json LIKE ?"; args.push(`%${discipline}%`); }
    sql += " ORDER BY start_date ASC, title ASC LIMIT ?";
    args.push(limit);
    const rows = await env.DB.prepare(sql).bind(...args).all();
    return json({ events: rows.results.map(e=>parseEventJsonFields(editEvent(e))) });
  } catch (e) { return handle(e); }
}
function parseEventJsonFields(e) {
  for (const k of ["disciplines_json","event_types_json","distances_json"]) {
    try { e[k.replace("_json","")] = JSON.parse(e[k] || "[]"); } catch { e[k.replace("_json","")] = []; }
    delete e[k];
  }
  return e;
}
async function getEvent(request, env, id) {
  try {
    const e = await env.DB.prepare("SELECT * FROM events WHERE id=? OR slug=?").bind(id,id).first();
    if (!e) throw new HttpError(404, "Event not found");
    const u = await getUser(request, env, false);
    let user_status = null;
    if (u) user_status = (await env.DB.prepare("SELECT status FROM event_user_status WHERE user_id=? AND event_id=?").bind(u.id,e.id).first())?.status || null;
    e.raw = JSON.parse(e.raw_json || "{}"); delete e.raw_json;
    return json({ event: parseEventJsonFields(editEvent(e)), user_status });
  } catch (er) { return handle(er); }
}
async function setEventStatus(request, env, eventId) {
  try {
    const u = await getUser(request, env);
    const b = await readJson(request);
    if (!["interested","going","completed"].includes(b.status)) throw new HttpError(400, "Invalid event status");
    const exists = await env.DB.prepare("SELECT id FROM events WHERE id=?").bind(eventId).first();
    if (!exists) throw new HttpError(404, "Event not found");
    await env.DB.prepare(`
      INSERT INTO event_user_status(user_id,event_id,status,updated_at) VALUES(?,?,?,CURRENT_TIMESTAMP)
      ON CONFLICT(user_id,event_id) DO UPDATE SET status=excluded.status,updated_at=CURRENT_TIMESTAMP
    `).bind(u.id,eventId,b.status).run();
    return json({ ok: true, status: b.status });
  } catch (e) { return handle(e); }
}

async function listDiscussions(request, env) {
  try {
    const url = new URL(request.url);
    const limit = Math.min(50, Math.max(1, Number(url.searchParams.get("limit") || 25)));
    const rows = await env.DB.prepare(`
      SELECT d.id,d.slug,d.title,d.body,d.entity_type,d.entity_id,d.status,d.created_at,d.updated_at,
             u.username,u.display_name,
             (SELECT COUNT(*) FROM comments c WHERE c.discussion_id=d.id AND c.status='published') comment_count,
             (SELECT COUNT(*) FROM reactions r WHERE r.target_type='discussion' AND r.target_id=d.id AND r.reaction_type='helpful') helpful_count
      FROM discussions d JOIN users u ON u.id=d.author_user_id
      WHERE d.status IN ('published','locked')
      ORDER BY d.updated_at DESC LIMIT ?
    `).bind(limit).all();
    return json({ discussions: rows.results });
  } catch (e) { return handle(e); }
}
async function createDiscussion(request, env) {
  try {
    const u = await getUser(request, env);
    const b = await readJson(request);
    const title = cleanText(b.title, 140, true);
    const body = cleanText(b.body, 10000, true);
    const entityType = cleanText(b.entity_type, 30);
    const entityId = cleanText(b.entity_id, 150);
    const id = crypto.randomUUID();
    const slug = `${slugify(title)}-${id.slice(0,8)}`;
    await env.DB.prepare(`
      INSERT INTO discussions(id,author_user_id,title,body,slug,entity_type,entity_id)
      VALUES(?,?,?,?,?,?,?)
    `).bind(id,u.id,title,body,slug,entityType||null,entityId||null).run();
    return json({ ok: true, id, slug }, 201);
  } catch (e) { return handle(e); }
}
async function getDiscussion(request, env, id) {
  try {
    const d = await env.DB.prepare(`
      SELECT d.*,u.username,u.display_name
      FROM discussions d JOIN users u ON u.id=d.author_user_id
      WHERE (d.id=? OR d.slug=?) AND d.status<>'deleted'
    `).bind(id,id).first();
    if (!d || d.status === "hidden") throw new HttpError(404, "Discussion not found");
    const comments = await env.DB.prepare(`
      SELECT c.id,c.parent_comment_id,c.body,c.created_at,c.updated_at,u.username,u.display_name,
             (SELECT COUNT(*) FROM reactions r WHERE r.target_type='comment' AND r.target_id=c.id AND r.reaction_type='helpful') helpful_count
      FROM comments c JOIN users u ON u.id=c.author_user_id
      WHERE c.discussion_id=? AND c.status='published'
      ORDER BY c.created_at ASC LIMIT 500
    `).bind(d.id).all();
    return json({ discussion: d, comments: comments.results });
  } catch (e) { return handle(e); }
}
async function createComment(request, env, discussionId) {
  try {
    const u = await getUser(request, env);
    const d = await env.DB.prepare("SELECT id,author_user_id,status,title FROM discussions WHERE id=? OR slug=?").bind(discussionId,discussionId).first();
    if (!d) throw new HttpError(404, "Discussion not found");
    if (d.status !== "published") throw new HttpError(409, "Discussion is not open for replies");
    const b = await readJson(request);
    const body = cleanText(b.body, 5000, true);
    const id = crypto.randomUUID();
    if (b.parent_comment_id) {
      const parent = await env.DB.prepare("SELECT id FROM comments WHERE id=? AND discussion_id=?").bind(b.parent_comment_id,d.id).first();
      if (!parent) throw new HttpError(400, "Invalid parent comment");
    }
    await env.DB.prepare("INSERT INTO comments(id,discussion_id,author_user_id,parent_comment_id,body) VALUES(?,?,?,?,?)")
      .bind(id,d.id,u.id,b.parent_comment_id||null,body).run();
    if (d.author_user_id !== u.id) {
      await env.DB.prepare("INSERT INTO notifications(id,user_id,type,actor_user_id,entity_type,entity_id,message) VALUES(?,?,?,?,?,?,?)")
        .bind(crypto.randomUUID(),d.author_user_id,"discussion_reply",u.id,"discussion",d.id,`${u.username} replied to "${d.title}"`).run();
    }
    await env.DB.prepare("UPDATE discussions SET updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(d.id).run();
    return json({ ok: true, id }, 201);
  } catch (e) { return handle(e); }
}
async function setReaction(request, env) {
  try {
    const u = await getUser(request, env);
    const b = await readJson(request);
    if (!["discussion","comment"].includes(b.target_type)) throw new HttpError(400, "Invalid target type");
    if (!["helpful","like"].includes(b.reaction_type)) throw new HttpError(400, "Invalid reaction");
    const targetId = cleanText(b.target_id, 150, true);
    await requireTarget(env,b.target_type,targetId);
    await env.DB.prepare(`
      INSERT OR REPLACE INTO reactions(user_id,target_type,target_id,reaction_type,created_at)
      VALUES(?,?,?,?,CURRENT_TIMESTAMP)
    `).bind(u.id,b.target_type,targetId,b.reaction_type).run();
    return json({ ok: true });
  } catch (e) { return handle(e); }
}
async function addGeneric(request, env, table) {
  try {
    const u = await getUser(request, env);
    const b = await readJson(request);
    const et = cleanText(b.entity_type, 30, true), ei = cleanText(b.entity_id, 150, true);
    await requireTarget(env,et,ei);
    await env.DB.prepare(`INSERT OR IGNORE INTO ${table}(user_id,entity_type,entity_id) VALUES(?,?,?)`).bind(u.id,et,ei).run();
    return json({ ok: true });
  } catch (e) { return handle(e); }
}
async function removeGeneric(request, env, table) {
  try {
    const u = await getUser(request, env);
    const url = new URL(request.url);
    const et = cleanText(url.searchParams.get("entity_type"),30,true);
    const ei = cleanText(url.searchParams.get("entity_id"),150,true);
    await env.DB.prepare(`DELETE FROM ${table} WHERE user_id=? AND entity_type=? AND entity_id=?`).bind(u.id,et,ei).run();
    return json({ ok: true });
  } catch (e) { return handle(e); }
}
async function listNotifications(request, env) {
  try {
    const u = await getUser(request, env);
    const rows = await env.DB.prepare("SELECT * FROM notifications WHERE user_id=? ORDER BY created_at DESC LIMIT 100").bind(u.id).all();
    const unread = await env.DB.prepare('SELECT COUNT(*) AS count FROM notifications WHERE user_id=? AND read_at IS NULL').bind(u.id).first();
    return json({ notifications: rows.results, unread_count: unread.count });
  } catch (e) { return handle(e); }
}
async function requireTarget(env,type,id) {
  const targets={discussion:"SELECT id FROM discussions WHERE id=? AND status='published'",comment:"SELECT id FROM comments WHERE id=? AND status='published'",user:"SELECT id FROM users WHERE id=? AND status='active'",event:'SELECT id FROM events WHERE id=?',guide:"SELECT id FROM guides WHERE id=? AND status='published'",brand:'SELECT id FROM brands WHERE id=?',bike:'SELECT id FROM bike_models WHERE id=?'};
  if (!targets[type]) throw new HttpError(400,'Unsupported item type');
  if (!await env.DB.prepare(targets[type]).bind(id).first()) throw new HttpError(404,'Item not found');
}
async function getActivity(request,env) {
  try {
    const u=await getUser(request,env);
    const results=await Promise.all(['reactions','follows','saved_items'].map(table=>env.DB.prepare(`SELECT * FROM ${table} WHERE user_id=? ORDER BY created_at DESC LIMIT 500`).bind(u.id).all()));
    return json({reactions:results[0].results,follows:results[1].results,saves:results[2].results});
  } catch(e) {return handle(e);}
}
async function markNotificationRead(request, env, id) {
  try {
    const u = await getUser(request, env);
    await env.DB.prepare("UPDATE notifications SET read_at=CURRENT_TIMESTAMP WHERE id=? AND user_id=?").bind(id,u.id).run();
    return json({ ok: true });
  } catch (e) { return handle(e); }
}
async function createReport(request, env) {
  try {
    const u = await getUser(request, env);
    const b = await readJson(request);
    if (!["discussion","comment","user"].includes(b.target_type)) throw new HttpError(400, "Invalid report target");
    await requireTarget(env,b.target_type,cleanText(b.target_id,150,true));
    const id = crypto.randomUUID();
    await env.DB.prepare("INSERT INTO reports(id,reporter_user_id,target_type,target_id,reason,details) VALUES(?,?,?,?,?,?)")
      .bind(id,u.id,b.target_type,cleanText(b.target_id,150,true),cleanText(b.reason,100,true),cleanText(b.details,1000)).run();
    return json({ ok: true, id }, 201);
  } catch (e) { return handle(e); }
}
async function requireModerator(request, env) {
  const u = await getUser(request, env);
  if (!["moderator","admin"].includes(u.role)) throw new HttpError(403, "Moderator access required");
  return u;
}
async function listReports(request, env) {
  try {
    await requireModerator(request, env);
    const rows = await env.DB.prepare("SELECT * FROM reports WHERE status IN ('open','reviewing') ORDER BY created_at ASC LIMIT 200").all();
    return json({ reports: rows.results });
  } catch (e) { return handle(e); }
}
async function resolveReport(request, env, id) {
  try {
    const mod = await requireModerator(request, env);
    const b = await readJson(request);
    if (!["resolved","dismissed"].includes(b.status)) throw new HttpError(400,'Invalid report outcome');
    const report = await env.DB.prepare('SELECT id,status FROM reports WHERE id=?').bind(id).first();
    if (!report) throw new HttpError(404,'Report not found');
    if (!['open','reviewing'].includes(report.status)) throw new HttpError(409,'Report is already closed');
    const outcome = b.status;
    await env.DB.batch([
      env.DB.prepare("UPDATE reports SET status=?,resolved_at=CURRENT_TIMESTAMP,resolved_by_user_id=? WHERE id=?").bind(outcome,mod.id,id),
      env.DB.prepare("INSERT INTO moderation_actions(id,moderator_user_id,action_type,target_type,target_id,reason) VALUES(?,?,?,?,?,?)")
        .bind(crypto.randomUUID(),mod.id,`report_${outcome}`,"report",id,cleanText(b.reason,500))
    ]);
    return json({ ok: true, status: outcome });
  } catch (e) { return handle(e); }
}
function handle(e) {
  if (e instanceof HttpError) return json({ error: e.message }, e.status);
  console.error(e); return json({ error: "Internal server error" }, 500);
}

function testPage(env) {
  const siteKey = env.TURNSTILE_SITE_KEY || "";
  const turnstile = siteKey ? `
    <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
    <div class="cf-turnstile" data-sitekey="${siteKey}"></div>` : `<p><small>Turnstile site key not configured. Local/non-production testing can proceed without it.</small></p>`;
  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Bike Portal Stage 4 Test</title><style>
body{font:16px system-ui;max-width:900px;margin:40px auto;padding:0 18px;line-height:1.45}
form,section{border:1px solid #ddd;padding:16px;margin:16px 0;border-radius:10px}
input,textarea,button{font:inherit;padding:8px;margin:4px;max-width:100%} textarea{width:95%;min-height:100px}
pre{background:#f5f5f5;padding:12px;overflow:auto} .row{display:flex;flex-wrap:wrap;gap:8px}
</style></head><body>
<h1>Bike Portal — Stage 4 persistence test</h1>
<p>This is a diagnostic page, not the final design. It verifies accounts, sessions, profiles, events, discussions and comments.</p>
<section><h2>1. Sign up</h2><form id="signup">
<input name="email" type="email" placeholder="email" required>
<input name="username" placeholder="username" required>
<input name="password" type="password" placeholder="password (10+ chars)" required>
${turnstile}
<button>Create account</button></form></section>
<section><h2>2. Login</h2><form id="login">
<input name="identity" placeholder="email or username" required>
<input name="password" type="password" required><button>Login</button></form>
<button id="logout">Logout</button> <button id="me">Who am I?</button></section>
<section><h2>3. Create discussion</h2><form id="discussion">
<input name="title" placeholder="Discussion title" required style="width:70%">
<textarea name="body" placeholder="Body" required></textarea><button>Create discussion</button></form></section>
<section><h2>4. Check Texas events</h2><button id="events">Load next 10 events</button></section>
<h2>Output</h2><pre id="out">Ready.</pre>
<script>
const out=document.querySelector('#out');
async function api(path,opts={}){ const r=await fetch(path,{credentials:'same-origin',...opts}); const t=await r.text(); let j; try{j=JSON.parse(t)}catch{j=t} out.textContent=JSON.stringify(j,null,2); return j; }
document.querySelector('#signup').onsubmit=async e=>{e.preventDefault();const f=new FormData(e.target);await api('/api/auth/signup',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email:f.get('email'),username:f.get('username'),password:f.get('password'),turnstileToken:f.get('cf-turnstile-response')||''})})}
document.querySelector('#login').onsubmit=async e=>{e.preventDefault();const f=new FormData(e.target);await api('/api/auth/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({identity:f.get('identity'),password:f.get('password')})})}
document.querySelector('#logout').onclick=()=>api('/api/auth/logout',{method:'POST'});
document.querySelector('#me').onclick=()=>api('/api/me');
document.querySelector('#events').onclick=()=>api('/api/events?limit=10');
document.querySelector('#discussion').onsubmit=async e=>{e.preventDefault();const f=new FormData(e.target);await api('/api/discussions',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({title:f.get('title'),body:f.get('body')})})}
</script></body></html>`;
}
