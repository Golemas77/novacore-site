import Head from "next/head";
import { useState } from "react";
import useOnline from "../lib/useOnline";
import downloads from "../data/downloads.json";

const REQUIREMENTS = [
  "Windows 10 arba 11 (64 bitų).",
  "Apie 30 GB laisvos vietos diske.",
  "Atskiras aplankas ne „Program Files“, pavyzdžiui, C:\\Games\\NovaCore.",
  "Interneto ryšys prisijungimui prie serverio.",
];

export default function Downloads() {
  const { client } = downloads;
  const links = client.links || [];
  const hasLink = links.some((l) => l.url);
  const { loaded, address } = useOnline();
  const [copied, setCopied] = useState(false);
  const realmlist = address ? `set realmlist ${address}` : null;

  const copy = async () => {
    if (!realmlist) return;
    try {
      await navigator.clipboard.writeText(realmlist);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="space-y-10">
      <Head>
        <title>Atsisiuntimai – NovaCore</title>
        <meta name="description" content="Atsisiųsk NovaCore klientą (WotLK 3.3.5a, HD, lietuvių kalba) ir sužinok, kaip jį įdiegti." />
      </Head>

      <header className="space-y-2">
        <h2 className="text-3xl font-bold">Atsisiuntimai</h2>
        <p className="text-white/70 max-w-2xl">
          Viename kliente yra viskas: HD tekstūros, lietuviška sąsaja ir mūsų priedai. Nieko papildomai atnaujinti nereikia.
        </p>
      </header>

      <section className="rounded-2xl bg-white/5 backdrop-blur ring-1 ring-white/10 p-5 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold">{client.title}</h3>
            <p className="text-sm text-white/70">{client.subtitle}</p>
          </div>
          <span className="inline-flex items-center rounded-full bg-sky-500/15 px-3 py-1 text-sm text-sky-200 ring-1 ring-sky-400/30">
            {client.size}
          </span>
        </div>

        <div className="flex flex-wrap gap-3">
          {links.map((l) =>
            l.url ? (
              <a
                key={l.label}
                href={l.url}
                {...(l.download ? { download: true } : {})}
                {...(/^https?:/i.test(l.url) ? { target: "_blank", rel: "noreferrer" } : {})}
                className="btn btn-primary"
              >
                {l.label}
              </a>
            ) : (
              <span key={l.label} className="btn btn-ghost opacity-60 cursor-not-allowed" aria-disabled="true">
                {l.label} (netrukus)
              </span>
            )
          )}
        </div>
        {hasLink && client.note && <p className="text-sm text-white/60">{client.note}</p>}
        {!hasLink && (
          <p className="text-sm text-amber-300">
            Atsisiuntimo nuoroda bus paskelbta netrukus. Naujienas sek mūsų Discord serveryje.
          </p>
        )}
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl bg-white/5 backdrop-blur ring-1 ring-white/10 p-5 sm:p-6">
          <h3 className="text-xl font-semibold">Reikalavimai</h3>
          <ul className="mt-4 list-disc pl-5 space-y-2 text-white/80">
            {REQUIREMENTS.map((r) => <li key={r}>{r}</li>)}
          </ul>
        </div>

        <div className="rounded-2xl bg-white/5 backdrop-blur ring-1 ring-white/10 p-5 sm:p-6">
          <h3 className="text-xl font-semibold">Kaip įdiegti</h3>
          <ol className="mt-4 list-decimal pl-5 space-y-2 text-white/80">
            <li>Atsisiųsk klientą ir išpakuok jį į atskirą aplanką.</li>
            <li>
              Atidaryk <code>Data/enUS/realmlist.wtf</code> ir, jei ten kitas adresas, įrašyk:
              <div className="mt-2 p-3 bg-black/30 rounded flex items-center justify-between gap-3">
                {realmlist ? (
                  <>
                    <code className="break-all">{realmlist}</code>
                    <button onClick={copy} className="btn btn-primary btn-sm shrink-0">
                      {copied ? "Nukopijuota!" : "Kopijuoti"}
                    </button>
                  </>
                ) : (
                  <span className="text-white/60 text-sm">
                    {loaded ? "Adresas šiuo metu nepasiekiamas, parašyk mums Discord serveryje." : "Kraunamas serverio adresas…"}
                  </span>
                )}
              </div>
            </li>
            <li>Susikurk paskyrą <a className="underline" href="/register">svetainėje</a>.</li>
            <li>Paleisk žaidimą per <code>WoW.exe</code> ir prisijunk su savo vardu bei slaptažodžiu.</li>
          </ol>
          <p className="mt-4 text-sm text-white/60">
            Jei žaidimas nepasileidžia, paleisk <code>WoW.exe</code> dešiniu pelės mygtuku pasirinkęs „Run as administrator“.
          </p>
        </div>
      </section>

      <p className="text-sm text-white/50">
        NovaCore yra nepelno entuziastų projektas, nesusijęs su Blizzard Entertainment.
      </p>
    </div>
  );
}
