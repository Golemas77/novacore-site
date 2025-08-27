import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
    }

    // Paprasta autorizacija per query ?secret=
    const ok = process.env.CRON_SECRET && req.query.secret === process.env.CRON_SECRET;
    if (!ok) return res.status(403).json({ ok: false, error: 'Forbidden' });

    const body = typeof req.body === 'object' ? req.body : JSON.parse(req.body || '{}');
    const total = Number(body?.total) || 0;
    const bots = Number(body?.bots) || 0;
    const players = Number(body?.players) || 0;

    const snapshot = { total, bots, players, at: Date.now() };

    // >>> TURI sutapti su /api/online-public
    await kv.set('online:current', snapshot);
    // (nebūtina) galim uždėti TTL, kad nedingtų senas skaičius per restartus:
    // await kv.expire('online:current', 60 * 60); // 1h

    return res.status(200).json({ ok: true, snapshot });
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e?.message || e) });
  }
}