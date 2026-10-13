// Paskyros prisijungimo kriptografija ir sesijos slapukas.
// Raktai išvedami iš CRON_SECRET (jis jau yra Vercel aplinkoje ir NovaCore serveryje) – naujo kintamojo nereikia.
import crypto from 'crypto';

export const SESSION_COOKIE = 'nc_session';
export const TICKET_COOKIE = 'nc_lt';
const SESSION_DAYS = 14;

function key(label) {
  const secret = process.env.CRON_SECRET;
  if (!secret) throw new Error('CRON_SECRET nenustatytas');
  return Buffer.from(crypto.hkdfSync('sha256', secret, 'novacore', label, 32));
}

// Slaptažodis eilėje (KV) laikomas tik užšifruotas (AES-256-GCM, 2 min.) – NovaCore serveris jį iššifruoja ir patikrina su SRP6 parašu.
export function encryptLogin(ticket, username, password) {
  const nonce = crypto.randomBytes(12);
  const c = crypto.createCipheriv('aes-256-gcm', key('nc-login-v1'), nonce);
  c.setAAD(Buffer.from(ticket));
  const ct = Buffer.concat([c.update(`${username}\0${password}`, 'utf8'), c.final()]);
  return { c: Buffer.concat([ct, c.getAuthTag()]).toString('base64'), n: nonce.toString('base64') };
}

function b64url(buf) {
  return Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function sign(payload) {
  return b64url(crypto.createHmac('sha256', key('nc-session-v1')).update(payload).digest());
}

export function makeSession(id, username) {
  const payload = b64url(JSON.stringify({ i: id, u: username, e: Math.floor(Date.now() / 1000) + SESSION_DAYS * 86400 }));
  return `${payload}.${sign(payload)}`;
}

export function parseCookies(req) {
  const out = {};
  const raw = req.headers.cookie;
  if (typeof raw !== 'string') return out;
  for (const part of raw.split(';')) {
    const i = part.indexOf('=');
    if (i > 0) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}

export function getSession(req) {
  try {
    const raw = parseCookies(req)[SESSION_COOKIE];
    if (!raw) return null;
    const [payload, sig] = raw.split('.');
    if (!payload || !sig) return null;
    const expected = sign(payload);
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
    const data = JSON.parse(Buffer.from(payload.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8'));
    if (!data || typeof data.i !== 'number' || typeof data.u !== 'string' || data.e < Date.now() / 1000) return null;
    return { id: data.i, username: data.u };
  } catch {
    return null;
  }
}

function cookie(name, value, maxAge) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`;
}

export function sessionCookie(id, username) {
  return cookie(SESSION_COOKIE, makeSession(id, username), SESSION_DAYS * 86400);
}
export const clearSessionCookie = () => cookie(SESSION_COOKIE, '', 0);
export const ticketCookie = (ticket) => cookie(TICKET_COOKIE, ticket, 120);
export const clearTicketCookie = () => cookie(TICKET_COOKIE, '', 0);

export function isJson(req) {
  return String(req.headers['content-type'] || '').toLowerCase().startsWith('application/json');
}
