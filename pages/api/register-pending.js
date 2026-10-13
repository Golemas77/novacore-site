// GET /api/register-pending  (tik su x-cron-secret) - NovaCore serveris pasiima laukiančias registracijas IR prisijungimo užklausas.
// Viena eilė (reg:pending): registracijos bilietai (24 hex) ir prisijungimų bilietai (L + 24 hex) - vienas skaitymas per apklausą.
import { kv } from '../../lib/store';
import { isAuthorized } from '../../lib/registration';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false });
  }
  if (!isAuthorized(req)) return res.status(401).json({ ok: false, error: 'Unauthorized' });

  try {
    const tickets = (await kv.lrange('reg:pending', 0, 9)) || [];
    const items = [];
    const logins = [];
    for (const t of tickets) {
      if (typeof t === 'string' && /^L[a-f0-9]{24}$/.test(t)) {
        const ticket = t.slice(1);
        const data = await kv.get(`login:req:${ticket}`);
        if (data && typeof data === 'object' && data.c && data.n) {
          logins.push({ ticket, c: data.c, n: data.n });
        } else {
          await kv.lrem('reg:pending', 0, t);     // pasibaigusi uzklausa
        }
        continue;
      }
      const data = await kv.get(`reg:req:${t}`);
      if (data && typeof data === 'object') {
        items.push({ ticket: t, username: data.u, email: data.e, salt: data.s, verifier: data.v });
      } else {
        await kv.lrem('reg:pending', 0, t);     // pasibaigusi uzklausa
      }
    }
    return res.status(200).json({ ok: true, items, logins });
  } catch {
    return res.status(502).json({ ok: false, error: 'Storage error' });
  }
}
