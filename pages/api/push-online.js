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
    if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
    if (!body || typeof body !== 'object') body = {};

    // Pagrindinė schema: total
    let total = Number(body.total);

    // Back-compat: jei pateikti bots/players – suskaičiuojam
    if (!Number.isFinite(total)) {
      const bots = Number(body.bots ?? 0);
      const players = Number(body.players ?? 0);
      total = (Number.isFinite(bots) ? bots : 0) + (Number.isFinite(players) ? players : 0);
    }

    if (!Number.isFinite(total) || total < 0) total = 0;

    const payload = { total, at: Date.now() };
    await kv.set('online:current', payload);

    return res.status(200).json({ ok: true, total });
  } catch {
    return res.status(400).json({ ok: false, error: 'Bad payload' });
  }
}