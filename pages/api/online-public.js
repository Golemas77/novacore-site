import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET');
      return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
    }
    // >>> TURI sutapti su push-online rakto pavadinimu
    const snap = (await kv.get('online:current')) || { total: 0 };
    const total = typeof snap.total === 'number' ? snap.total : 0;
    return res.status(200).json({ ok: true, total });
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e?.message || e) });
  }
}