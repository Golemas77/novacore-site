// pages/api/push-online.js
import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  // Saugumas: reikia paslėpto rakto
  const secret = req.query.secret || req.headers['x-cron-secret'];
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return res.status(401).json({ ok: false, error: 'Unauthorized' });
  }

  const { total, bots = 0, players = 0 } = req.body || {};
  if (typeof total !== 'number') {
    return res.status(400).json({ ok: false, error: 'Body must contain a numeric "total"' });
  }

  const now = Date.now();

  // Išsaugom KV (Upstash)
  await kv.mset({
    'nc:online:total': total,
    'nc:online:bots': bots,
    'nc:online:players': players,
    'nc:online:updatedAt': now,
  });

  return res.status(200).json({ ok: true, total, bots, players, updatedAt: now });
}