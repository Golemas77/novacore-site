import { useEffect, useState } from 'react';

export default function Realms() {
  const [count, setCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetch('/api/online-public', { cache: 'no-store' });
        const j = await r.json();
        if (!alive) return;
        if (j.ok) {
          setCount(j.total ?? 0);
        } else {
          setErr(j.error || 'Nepavyko gauti duomenų');
          setCount(null);
        }
      } catch (e) {
        if (!alive) return;
        setErr(String(e));
        setCount(null);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const nice = (n) =>
    typeof n === 'number' ? new Intl.NumberFormat('lt-LT').format(n) : '—';

  // Paprastas populiacijos labelis (gali pasikoreguoti slenksčius)
  const population =
    count == null
      ? 'Nežinoma'
      : count < 200
      ? 'Žema'
      : count < 1000
      ? 'Vidutinė'
      : 'Didelė';

  return (
    <main className="min-h-screen pt-20 pb-24 text-white">
      <div className="mx-auto max-w-5xl px-4">
        <h1 className="text-3xl font-extrabold mb-6">Realm ai</h1>

        <div className="grid gap-6">
          <div className="rounded-2xl bg-white/5 backdrop-blur ring-1 ring-white/10 p-5 sm:p-6 lg:p-7 relative overflow-hidden">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">NovaCore PvE</h2>
                <p className="mt-2 text-sm/6 text-white/70">
                  XP greitis: <span className="font-medium text-white">x1.5</span>
                </p>
                <p className="text-sm/6 text-white/70">
                  Populiacija:{' '}
                  <span className="font-medium text-white">{population}</span>
                </p>
              </div>

              <div className="shrink-0 text-right">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-1.5 ring-1 ring-emerald-400/30">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_2px_rgba(52,211,153,.6)]" />
                  <span className="text-sm font-medium text-emerald-200">
                    Prisijungę
                  </span>
                </div>

                <div className="mt-3 text-2xl font-bold tracking-tight">
                  {loading ? (
                    <span className="text-white/70">Kraunama…</span>
                  ) : count == null ? (
                    <span className="text-white/70">Nepasiekiama</span>
                  ) : (
                    nice(count)
                  )}
                </div>

                {err && (
                  <p className="mt-1 text-xs text-red-300/80 max-w-[20rem]">
                    {err}
                  </p>
                )}
              </div>
            </div>

            {/* Dekoras */}
            <div className="pointer-events-none absolute -right-24 -top-24 size-56 rounded-full bg-sky-400/10 blur-2xl" />
          </div>

          {/* Jei vėliau turėsi daugiau realmų – pridėk papildomų kortelių */}
        </div>

        <p className="mt-6 text-sm text-white/60">
          Vėliau prijungsime pilną realmo statusą (login/uptime, delay, ping ir pan.)
        </p>
      </div>
    </main>
  );
}