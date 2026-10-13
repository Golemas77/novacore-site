// POST /api/login  { username, password }  (application/json)
// Slaptažodis į eilę (KV) patenka tik užšifruotas ir 2 min.; NovaCore serveris jį patikrina su žaidimo paskyros SRP6 parašu
// ir grąžina rezultatą (/api/acct-result). Naršyklė laukia per /api/login-status.
import crypto from 'crypto';
import { kv } from '../../lib/store';
import { clientKey } from '../../lib/registration';
import { encryptLogin, isJson, ticketCookie } from '../../lib/secure';

const USER_RE = /^[A-Za-z0-9]{3,16}$/;
const PASS_RE = /^[\x21-\x7E]{1,16}$/;
const PER_IP_PER_HOUR = 30;
const PER_USER_PER_15MIN = 8;

async function limit(key, max, ttl) {
  const n = await kv.incr(key);
  if (n === 1) await kv.expire(key, ttl);
  return n <= max;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Metodas neleidžiamas.' });
  }
  if (!isJson(req)) return res.status(415).json({ ok: false, error: 'Netinkama užklausa.' });

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  const username = String(body?.username ?? '').trim().toUpperCase();
  const password = String(body?.password ?? '');
  if (!USER_RE.test(username) || !PASS_RE.test(password) || /^RNDBOT/.test(username)) {
    return res.status(400).json({ ok: false, error: 'Neteisingas vartotojo vardas arba slaptažodis.' });
  }

  try {
    const slot15 = Math.floor(Date.now() / (15 * 60 * 1000));
    const hour = Math.floor(Date.now() / (60 * 60 * 1000));
    const okIp = await limit(`lg:ip:${clientKey(req)}:${hour}`, PER_IP_PER_HOUR, 3700);
    const okUser = await limit(`lg:u:${username}:${slot15}`, PER_USER_PER_15MIN, 1000);
    if (!okIp || !okUser) {
      return res.status(429).json({ ok: false, error: 'Per daug bandymų. Palauk keliolika minučių ir bandyk dar kartą.' });
    }

    const ticket = crypto.randomBytes(12).toString('hex');
    const enc = encryptLogin(ticket, username, password);
    await kv.set(`login:req:${ticket}`, { ...enc, at: Date.now() }, { ex: 120 });
    await kv.rpush('reg:pending', `L${ticket}`);
    res.setHeader('Set-Cookie', ticketCookie(ticket));
    return res.status(200).json({ ok: true, ticket });
  } catch {
    return res.status(503).json({ ok: false, error: 'Prisijungimas laikinai neveikia. Bandyk vėliau.' });
  }
}
