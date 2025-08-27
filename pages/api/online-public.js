// pages/api/online-public.js
import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  try {
    let data = await kv.get('online:current');

    if (!data) {
      res.setHeader('Cache-Control', 'no-store, no-cache, max-age=0, must-revalidate');
      return res.status(200).json({ ok: true, total: 0 });
    }

    // jei saugoma kaip stringas – parse
    if (typeof data === 'string') {
      try { data = JSON.parse(data); } catch { data = { total: 0 }; }
    }

    const total = Number(data?.total ?? 0);

    res.setHeader('Cache-Control', 'no-store, no-cache, max-age=0, must-revalidate');
    return res.status(200).json({ ok: true, total });
  } catch (e) {
    return res.status(200).json({ ok: false, error: String(e) });
  }
}