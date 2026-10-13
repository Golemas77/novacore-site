// POST /api/acct-result  { ticket, status, id, username }  (tik su x-cron-secret) - NovaCore serveris praneša prisijungimo rezultatą
import { kv } from '../../lib/store';
import { isAuthorized } from '../../lib/registration';

const STATUSES = ['ok', 'bad', 'banned', 'error'];

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false });
  }
  if (!isAuthorized(req)) return res.status(401).json({ ok: false, error: 'Unauthorized' });

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  const ticket = String(body?.ticket ?? '');
  const status = String(body?.status ?? '');
  const id = Number(body?.id);
  const username = String(body?.username ?? '');
  if (!/^[a-f0-9]{24}$/.test(ticket) || !STATUSES.includes(status)) {
    return res.status(400).json({ ok: false, error: 'Bad payload' });
  }
  if (status === 'ok' && !(Number.isInteger(id) && id > 0 && /^[A-Z0-9]{3,16}$/.test(username))) {
    return res.status(400).json({ ok: false, error: 'Bad payload' });
  }

  try {
    await kv.set(`login:res:${ticket}`, status === 'ok' ? { status, id, u: username } : { status }, { ex: 120 });
    await kv.lrem('reg:pending', 0, `L${ticket}`);
    await kv.del(`login:req:${ticket}`);          // ištriname užšifruotą slaptažodį
    return res.status(200).json({ ok: true });
  } catch {
    return res.status(502).json({ ok: false, error: 'Storage error' });
  }
}
