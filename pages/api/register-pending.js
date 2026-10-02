// GET /api/register-pending  (tik su x-cron-secret) - namu kompiuteris pasiima laukiancias registracijas
import { kv } from '@vercel/kv';
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
    for (const t of tickets) {
      const data = await kv.get(`reg:req:${t}`);
      if (data && typeof data === 'object') {
        items.push({ ticket: t, username: data.u, email: data.e, salt: data.s, verifier: data.v });
      } else {
        await kv.lrem('reg:pending', 0, t);     // pasibaigusi uzklausa
      }
    }
    return res.status(200).json({ ok: true, items });
  } catch {
    return res.status(502).json({ ok: false, error: 'Storage error' });
  }
}
