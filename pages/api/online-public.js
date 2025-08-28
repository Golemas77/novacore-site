// GET /api/online-public
import { kv } from '@vercel/kv';

function noCache(res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, max-age=0, s-maxage=0, must-revalidate');
  res.setHeader('CDN-Cache-Control', 'no-store');
  res.setHeader('Vercel-CDN-Cache-Control', 'no-store');
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  try {
    let data = await kv.get('online:current'); // gali būti objektas arba string

    if (typeof data === 'string') {
      try { data = JSON.parse(data); } catch { data = null; }
    }

    const total = Number(data?.total ?? 0);

    noCache(res);
    return res.status(200).json({ total });
  } catch (e) {
    noCache(res);
    return res.status(200).json({ total: 0 });
  }
}