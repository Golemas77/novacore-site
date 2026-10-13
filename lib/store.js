// Saugykla paskyros funkcijoms: tikra Vercel KV (Upstash) arba atmintyje veikianti imitacija vietiniam bandymui (NC_MEM_KV=1).
import { kv as realKv } from '@vercel/kv';

function memStore() {
  const g = globalThis;
  if (!g.__ncmem) g.__ncmem = { data: new Map(), lists: new Map() };
  const { data, lists } = g.__ncmem;
  const alive = (k) => {
    const e = data.get(k);
    if (!e) return null;
    if (e.exp && e.exp < Date.now()) { data.delete(k); return null; }
    return e;
  };
  return {
    async get(k) { const e = alive(k); return e ? e.v : null; },
    async set(k, v, opts = {}) {
      if (opts.nx && alive(k)) return null;
      data.set(k, { v, exp: opts.ex ? Date.now() + opts.ex * 1000 : 0 });
      return 'OK';
    },
    async del(k) { data.delete(k); lists.delete(k); return 1; },
    async incr(k) {
      const e = alive(k);
      const n = (e ? Number(e.v) : 0) + 1;
      data.set(k, { v: n, exp: e ? e.exp : 0 });
      return n;
    },
    async expire(k, s) { const e = alive(k); if (e) e.exp = Date.now() + s * 1000; return 1; },
    async rpush(k, v) { const l = lists.get(k) || []; l.push(v); lists.set(k, l); return l.length; },
    async lrange(k, a, b) { const l = lists.get(k) || []; return l.slice(a, b === -1 ? undefined : b + 1); },
    async lrem(k, _c, v) { const l = lists.get(k) || []; lists.set(k, l.filter((x) => x !== v)); return 1; },
  };
}

export const kv = process.env.NC_MEM_KV === '1' ? memStore() : realKv;
