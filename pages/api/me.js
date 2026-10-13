// GET /api/me          -> { ok, user: { id, username } }      (401, jei neprisijungta)
// GET /api/me?full=1   -> { ok, user, data }                   (data = veikėjų suvestinė iš žaidimo serverio)
import { kv } from '../../lib/store';
import { getSession } from '../../lib/secure';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const user = getSession(req);
  if (!user) return res.status(401).json({ ok: false });

  if (req.query.full !== '1') return res.status(200).json({ ok: true, user });

  try {
    const raw = await kv.get(`acct:${user.id}`);
    let data = null;
    if (typeof raw === 'string') { try { data = JSON.parse(raw); } catch { data = null; } }
    else if (raw && typeof raw === 'object') data = raw;
    return res.status(200).json({ ok: true, user, data });
  } catch {
    return res.status(200).json({ ok: true, user, data: null, error: 'storage' });
  }
}
