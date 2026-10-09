// POST /api/push-online
// Zaidimo serveris (C:\NovaCore\push-online-total.ps1) kas minute siuncia { total, bots, players, up }:
//   total - BENDRAS prisijungusiu skaicius, bots - botai, players - tikri zaidejai, up - ar veikia zaidimo serveris.
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

  // Atskiri skaiciai (nuo 2026-10-09): botai ir tikri zaidejai. Jei nepateikti - null (rodomas tik bendras).
  const nb = Number(body.bots);
  const np = Number(body.players);
  const bots = Number.isFinite(nb) && nb >= 0 ? Math.floor(nb) : null;
  const players = Number.isFinite(np) && np >= 0 ? Math.floor(np) : null;

  // up: ar veikia zaidimo serveris (jei nepateikta - laikom, kad veikia)
  const up = body.up === undefined ? true : Boolean(body.up);

  // ip: serverio viesas adresas (realmlist); priimame tik tikra IPv4
  const ip = typeof body.ip === 'string' && /^(\d{1,3}\.){3}\d{1,3}$/.test(body.ip) &&
    body.ip.split('.').every((n) => Number(n) <= 255) ? body.ip : undefined;

  try {
    const prev = await kv.get('online:current');
    const keepIp = ip || (prev && typeof prev === 'object' ? prev.ip : undefined);
    await kv.set('online:current', { total, bots, players, up, ip: keepIp, at: Date.now() });
  } catch {
    // saugykla (Vercel KV / Upstash) nepasiekiama arba nesukonfiguruota
    return res.status(502).json({ ok: false, error: 'Storage error' });
  }

  return res.status(200).json({ ok: true, total, bots, players, up });
}
