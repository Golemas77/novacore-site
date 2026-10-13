// POST /api/acct-push  { accounts: { "<paskyros id>": { ...veikėjų suvestinė } } }  (tik su x-cron-secret)
// NovaCore serveris periodiškai atsiunčia kiekvienos paskyros veikėjų suvestinę (gyvų žaidėjų, ne botų).
import { kv } from '../../lib/store';
import { isAuthorized } from '../../lib/registration';

export const config = { api: { bodyParser: { sizeLimit: '2mb' } } };

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false });
  }
  if (!isAuthorized(req)) return res.status(401).json({ ok: false, error: 'Unauthorized' });

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  const accounts = body && typeof body.accounts === 'object' ? body.accounts : null;
  if (!accounts) return res.status(400).json({ ok: false, error: 'Bad payload' });

  try {
    let saved = 0;
    for (const [id, data] of Object.entries(accounts)) {
      if (!/^[0-9]{1,9}$/.test(id) || !data || typeof data !== 'object') continue;
      const json = JSON.stringify(data);
      if (json.length > 400 * 1024) continue;
      await kv.set(`acct:${id}`, json);
      saved += 1;
    }
    return res.status(200).json({ ok: true, saved });
  } catch {
    return res.status(502).json({ ok: false, error: 'Storage error' });
  }
}
