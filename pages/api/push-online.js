// pages/api/push-online.js
import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  const { secret } = req.query;
  if (!secret || secret !== process.env.CRON_SECRET) {
    return res.status(403).json({ ok: false, error: 'Forbidden' });
  }

  try {
    const { total = 0, bots = 0, players = 0 } = req.body || {};

    // SAUGOM TA PATĮ RAKTĄ, kurį skaito /api/online
    await kv.hset('novacore:online', {
      total: Number(total) || 0,
      bots: Number(bots) || 0,
      players: Number(players) || 0,
      updatedAt: Date.now(),
    });

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ ok: false, error: 'KV write error' });
  }
}