// GET /api/online-public  ->  { ok, total, up, fresh, online }
//   total  - bendras prisijungusiu skaicius
//   online - serveris veikia IR duomenys atnaujinti per paskutines 3 minutes
import { kv } from '@vercel/kv';

const FRESH_MS = 3 * 60 * 1000;

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

  noCache(res);

  try {
    let data = await kv.get('online:current'); // gali būti objektas arba string

    if (typeof data === 'string') {
      try { data = JSON.parse(data); } catch { data = null; }
    }

    const total = Number(data?.total ?? 0);
    const up = data?.up === undefined ? true : Boolean(data.up);
    const at = Number(data?.at ?? 0);
    const fresh = at > 0 && Date.now() - at < FRESH_MS;

    const address = typeof data?.ip === 'string' ? data.ip : null;

    return res.status(200).json({ ok: true, total, up, fresh, online: up && fresh, address });
  } catch (e) {
    // saugykla nepasiekiama - nerodome klaidingo skaiciaus
    return res.status(200).json({ ok: false, total: 0, up: false, fresh: false, online: false });
  }
}
