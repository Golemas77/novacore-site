// POST /api/register-result  { ticket, status }  (tik su x-cron-secret) - namu kompiuteris pranesa rezultata
import { kv } from '@vercel/kv';
import { isAuthorized } from '../../lib/registration';

const STATUSES = ['ok', 'exists', 'email_limit', 'error'];

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
  if (!/^[a-f0-9]{24}$/.test(ticket) || !STATUSES.includes(status)) {
    return res.status(400).json({ ok: false, error: 'Bad payload' });
  }

  try {
    const data = await kv.get(`reg:req:${ticket}`);
    await kv.set(`reg:res:${ticket}`, { status, at: Date.now() }, { ex: 60 * 60 * 24 });
    await kv.lrem('reg:pending', 0, ticket);
    await kv.del(`reg:req:${ticket}`);                   // istrinam salt/verifier
    if (data && typeof data === 'object' && data.u) await kv.del(`reg:name:${data.u}`);
    return res.status(200).json({ ok: true });
  } catch {
    return res.status(502).json({ ok: false, error: 'Storage error' });
  }
}
