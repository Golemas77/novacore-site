// Bendras prisijungusiu skaicius (kas 10 s). Vienas uzklausimu ciklas visiems komponentams.
import { useEffect, useState } from 'react';

let state = { loaded: false, ok: false, online: false, total: 0 };
const subs = new Set();
let timer = null;

async function load() {
  try {
    const r = await fetch('/api/online-public', { cache: 'no-store' });
    const j = await r.json();
    state = {
      loaded: true,
      ok: j?.ok !== false,
      online: j?.online !== undefined ? !!j.online : true,
      total: Number(j?.total ?? 0),
    };
  } catch {
    state = { loaded: true, ok: false, online: false, total: 0 };
  }
  subs.forEach((fn) => fn(state));
}

export default function useOnline() {
  const [s, setS] = useState(state);

  useEffect(() => {
    subs.add(setS);
    if (!timer) {
      load();
      timer = setInterval(load, 10_000);
    } else {
      setS(state);
    }
    return () => {
      subs.delete(setS);
      if (!subs.size && timer) {
        clearInterval(timer);
        timer = null;
      }
    };
  }, []);

  return s;
}

export const formatCount = (n) =>
  typeof n === 'number' && !Number.isNaN(n) ? new Intl.NumberFormat('lt-LT').format(n) : '—';
