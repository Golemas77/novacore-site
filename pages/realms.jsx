import useOnline, { formatCount } from '../lib/useOnline';

export default function Realms() {
  const { loaded, ok, online, total, bots, players } = useOnline();
  const split = typeof bots === 'number' && typeof players === 'number';

  const population =
    !loaded || !ok || !online ? 'Nežinoma'
    : total < 200 ? 'Žema'
    : total < 1000 ? 'Vidutinė'
    : 'Didelė';

  return (
    <main className="min-h-screen pt-20 pb-24 text-white">
      <div className="mx-auto max-w-5xl px-4">
        <h1 className="text-3xl font-extrabold mb-6">Realmai</h1>

        <div className="mb-6 rounded-lg bg-amber-500/10 ring-1 ring-amber-400/30 p-4 text-sm/6 text-amber-100">
          <strong>Testavimo realmas.</strong> Oficialus paleidimas – 2027 m. sausį (tiksli diena bus paskelbta vėliau). Prieš jį viskas
          bus pilnai išvalyta, o testavime dalyvavusiems žaidėjams bus atsilyginta. <a className="underline" href="/news/13">Plačiau</a>
        </div>

        <div className="grid gap-6">
          <div className="rounded-2xl bg-white/5 backdrop-blur ring-1 ring-white/10 p-5 sm:p-6 lg:p-7 relative overflow-hidden">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">NovaCore PvE</h2>
                <p className="mt-2 text-sm/6 text-white/70">
                  XP greitis: <span className="font-medium text-white">x1.5</span>
                </p>
                <p className="text-sm/6 text-white/70">
                  Populiacija: <span className="font-medium text-white">{population}</span>
                </p>
                <p className="text-sm/6 text-white/70">
                  Versija: <span className="font-medium text-white">3.3.5a (Ličo Karaliaus rūstybė)</span>
                </p>
                <p className="text-sm/6 text-white/70">
                  Kalba: <span className="font-medium text-white">lietuvių</span>
                </p>
                <p className="text-sm/6 text-white/70">
                  Režimai: <span className="font-medium text-white">hardkoras, karo režimas, asmeninis grobis</span>
                </p>
              </div>

              <div className="shrink-0 text-right">
                {online ? (
                  <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-1.5 ring-1 ring-emerald-400/30">
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_2px_rgba(52,211,153,.6)]" />
                    <span className="text-sm font-medium text-emerald-200">Prisijungę</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 ring-1 ring-white/15">
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-slate-400" />
                    <span className="text-sm font-medium text-white/70">
                      {!loaded ? 'Kraunama…' : ok ? 'Serveris išjungtas' : 'Būsena nepasiekiama'}
                    </span>
                  </div>
                )}

                <div className="mt-3 text-2xl font-bold tracking-tight">
                  {!loaded ? (
                    <span className="text-white/70">…</span>
                  ) : online ? (
                    split ? (
                      <>
                        {formatCount(players)}
                        <span className="block text-sm font-normal text-white/60">žaidėjų online · {formatCount(bots)} botų</span>
                      </>
                    ) : (
                      formatCount(total)
                    )
                  ) : (
                    <span className="text-white/50">—</span>
                  )}
                </div>
              </div>
            </div>

            <div className="pointer-events-none absolute -right-24 -top-24 size-56 rounded-full bg-sky-400/10 blur-2xl" />
          </div>
        </div>

        <p className="mt-6 text-sm text-white/60">
          Vėliau prijungsime pilną realmo statusą (login/uptime, delay, ping ir pan.)
        </p>
      </div>
    </main>
  );
}
