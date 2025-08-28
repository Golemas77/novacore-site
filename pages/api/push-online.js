// POST /api/push-online
import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  const secret = req.headers['x-cron-secret'] || req.query.secret;
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return res.status(401).json({ ok: false, error: 'Unauthorized' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch { body = {}; }
    } else if (!body || typeof body !== 'object') {
      body = {};
    }

    const bots = Number.isFinite(Number(body.bots)) ? Number(body.bots) : 0;
    const players = Number.isFinite(Number(body.players)) ? Number(body.players) : 0;

    let total = Number(body.total);
    if (!Number.isFinite(total)) total = bots + players;

    const payload = { total, bots, players, at: Date.now() };
    await kv.set('online:current', payload);

    return res.status(200).json({ ok: true, saved: payload });
  } catch (e) {
    return res.status(400).json({ ok: false, error: 'Bad payload' });
  }
}