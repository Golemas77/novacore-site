// POST /api/logout - pašalina sesijos slapuką
import { clearSessionCookie, isJson } from '../../lib/secure';

export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false });
  }
  if (!isJson(req)) return res.status(415).json({ ok: false });
  res.setHeader('Set-Cookie', clearSessionCookie());
  return res.status(200).json({ ok: true });
}
