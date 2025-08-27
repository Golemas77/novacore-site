// pages/api/online.js
import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  // jokio secreto čia nereikia – tai viešas GET
  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  // kad naršyklė nekešuotų
  res.setHeader('Cache-Control', 'no-store');

  try {
    // SKAITYK TA PATĮ RAKTĄ, kurį rašo push endpoint'as
    const data = await kv.hgetall('novacore:online');

    const total   = Number(data?.total)   || 0;
    const bots    = Number(data?.bots)    || 0;
    const players = Number(data?.players) || 0;

    return res.status(200).json({ ok: true, total, bots, players });
  } catch (e) {
    return res.status(500).json({ ok: false, error: 'KV read error' });
  }
}