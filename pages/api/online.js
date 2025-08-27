// pages/api/online.js
import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  try {
    const total = Number(await kv.get('nc:online:total')) || 0;

    // Grąžinam TIK bendrą skaičių (be atskirų bots/players), kaip norėjai
    return res.status(200).json({ ok: true, total });
  } catch (e) {
    return res.status(200).json({ ok: true, total: 0 });
  }
}