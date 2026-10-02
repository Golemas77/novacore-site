// POST /api/push-online
// Zaidimo serveris (C:\NovaCore\push-online-total.ps1) kas minute siuncia { total, up }:
//   total - BENDRAS prisijungusiu skaicius, up - ar veikia zaidimo serveris.
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

  // up: ar veikia zaidimo serveris (jei nepateikta - laikom, kad veikia)
  const up = body.up === undefined ? true : Boolean(body.up);

  try {
    await kv.set('online:current', { total, up, at: Date.now() });
  } catch {
    // saugykla (Vercel KV / Upstash) nepasiekiama arba nesukonfiguruota
    return res.status(502).json({ ok: false, error: 'Storage error' });
  }

  return res.status(200).json({ ok: true, total, up });
}
