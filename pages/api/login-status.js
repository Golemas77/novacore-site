// GET /api/login-status?ticket=...  ->  { status: 'pending' | 'ok' | 'bad' | 'banned' | 'error' | 'expired' }
// Sėkmės atveju (vienkartinai) nustato sesijos slapuką.
import { kv } from '../../lib/store';
import { clearTicketCookie, parseCookies, sessionCookie, TICKET_COOKIE } from '../../lib/secure';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const ticket = String(req.query.ticket ?? '');
  if (!/^[a-f0-9]{24}$/.test(ticket) || parseCookies(req)[TICKET_COOKIE] !== ticket) {
    return res.status(400).json({ status: 'expired' });
  }

  try {
    const result = await kv.get(`login:res:${ticket}`);
    if (result && typeof result === 'object' && result.status) {
      await kv.del(`login:res:${ticket}`);
      const cookies = [clearTicketCookie()];
      if (result.status === 'ok' && Number.isInteger(result.id) && typeof result.u === 'string') {
        cookies.push(sessionCookie(result.id, result.u));
      }
      res.setHeader('Set-Cookie', cookies);
      return res.status(200).json({ status: result.status });
    }
    const pending = await kv.get(`login:req:${ticket}`);
    return res.status(200).json({ status: pending ? 'pending' : 'expired' });
  } catch {
    return res.status(200).json({ status: 'pending' });
  }
}
