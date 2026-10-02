// POST /api/register  { username, email, password, website (honeypot), elapsed }
// Slaptazodis NESAUGOMAS: cia apskaiciuojamas SRP6 salt+verifier, i eile (KV) padedama tik tai.
// Namu kompiuteryje veikiantis C:\NovaCore\register-worker.ps1 uzklausas paima ir sukuria paskyra serverio DB.
import { kv } from '@vercel/kv';
import crypto from 'crypto';
import { makeRegistrationData } from '../../lib/srp6';
import { validateRegistration, clientKey } from '../../lib/registration';

const PER_IP_PER_DAY = 3;
const PER_DAY_TOTAL = 200;
const REQ_TTL = 60 * 60 * 48;   // 48 val.

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Metodas neleidžiamas.' });
  }

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  if (!body || typeof body !== 'object') body = {};

  // robotu spastai: paslėptas laukas turi būti tuščias, forma negali būti išsiųsta per greitai
  if (body.website || !(Number(body.elapsed) >= 2500)) {
    return res.status(400).json({ ok: false, error: 'Užklausa atmesta. Palauk kelias sekundes ir bandyk dar kartą.' });
  }

  const username = String(body.username ?? '').trim();
  const email = String(body.email ?? '').trim().toLowerCase();
  const password = String(body.password ?? '');

  const problem = validateRegistration({ username, email, password });
  if (problem) return res.status(400).json({ ok: false, error: problem });

  try {
    // dienos ribos
    const day = new Date().toISOString().slice(0, 10);
    const ipKey = `reg:ip:${clientKey(req)}:${day}`;
    const totalKey = `reg:day:${day}`;
    const ipCount = await kv.incr(ipKey);
    if (ipCount === 1) await kv.expire(ipKey, 60 * 60 * 26);
    if (ipCount > PER_IP_PER_DAY) {
      return res.status(429).json({ ok: false, error: 'Per daug registracijų iš šio adreso. Bandyk rytoj arba parašyk mums Discord serveryje.' });
    }
    const total = await kv.incr(totalKey);
    if (total === 1) await kv.expire(totalKey, 60 * 60 * 26);
    if (total > PER_DAY_TOTAL) {
      return res.status(429).json({ ok: false, error: 'Šiandien registracijų limitas pasiektas. Bandyk rytoj.' });
    }

    // tas pats vardas jau laukia eileje?
    const upper = username.toUpperCase();
    const ticket = crypto.randomBytes(12).toString('hex');
    const locked = await kv.set(`reg:name:${upper}`, ticket, { nx: true, ex: 60 * 60 });
    if (!locked) {
      return res.status(409).json({ ok: false, error: 'Šis vartotojo vardas šiuo metu registruojamas. Pasirink kitą.' });
    }

    const { salt, verifier } = makeRegistrationData(upper, password);
    await kv.set(`reg:req:${ticket}`, { u: upper, e: email, s: salt, v: verifier, at: Date.now() }, { ex: REQ_TTL });
    await kv.rpush('reg:pending', ticket);

    return res.status(200).json({ ok: true, ticket });
  } catch {
    return res.status(503).json({ ok: false, error: 'Registracija laikinai neveikia. Bandyk vėliau.' });
  }
}
