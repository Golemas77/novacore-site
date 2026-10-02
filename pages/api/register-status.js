// GET /api/register-status?ticket=...  ->  { status: 'pending' | 'ok' | 'exists' | 'email_limit' | 'error' | 'unknown' }
import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const ticket = String(req.query.ticket ?? '');
  if (!/^[a-f0-9]{24}$/.test(ticket)) return res.status(400).json({ status: 'unknown' });

  try {
    const result = await kv.get(`reg:res:${ticket}`);
    if (result && typeof result === 'object' && result.status) return res.status(200).json({ status: result.status });
    const pending = await kv.get(`reg:req:${ticket}`);
    return res.status(200).json({ status: pending ? 'pending' : 'unknown' });
  } catch {
    return res.status(200).json({ status: 'pending' });
  }
}
