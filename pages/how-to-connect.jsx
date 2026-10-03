import { useState } from "react";
import useOnline from "../lib/useOnline";

export default function HowToConnect() {
  const [copied, setCopied] = useState(false);
  const { loaded, address } = useOnline();

  // Serverio adresas ateina is paties serverio (atsinaujina automatiskai, jei pasikeicia IP)
  const REALMLIST = address ? `set realmlist ${address}` : null;

  const copy = async () => {
    if (!REALMLIST) return;
    try {
      await navigator.clipboard.writeText(REALMLIST);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Kaip prisijungti</h2>
      <ol className="list-decimal pl-6 space-y-2 text-white/80">
        <li>
          Atsisiųsk <a className="underline" href="/downloads">NovaCore paleidiklį</a>: jis įdiegia klientą (3.3.5a, HD, su lietuvių kalba), pats jį atnaujina ir
          įrašo serverio adresą. Tuomet pereik prie paskyros kūrimo.
        </li>
        <li>Jei naudoji kliento failus be paleidiklio, atidaryk <code>Data/enUS/realmlist.wtf</code> ir įrašyk:
          <div className="mt-2 p-3 bg-black/30 rounded flex items-center justify-between">
            {REALMLIST ? (
              <>
                <code>{REALMLIST}</code>
                <button onClick={copy} className="ml-4 btn btn-primary btn-sm">
                  {copied ? "Nukopijuota!" : "Kopijuoti"}
                </button>
              </>
            ) : (
              <span className="text-white/60 text-sm">
                {loaded ? "Serverio adresas šiuo metu nepasiekiamas. Parašyk mums Discord serveryje." : "Kraunamas serverio adresas…"}
              </span>
            )}
          </div>
        </li>
        <li>Susikurk paskyrą svetainėje (arba <a className="underline" href="/register">registruokis čia</a>).</li>
        <li>Paleisk žaidimą per <code>WoW.exe</code>.</li>
      </ol>
      <div className="rounded-lg bg-amber-500/10 ring-1 ring-amber-400/30 p-4 text-sm/6 text-amber-100">
        <strong>Šiuo metu vyksta testavimas.</strong> Oficialus paleidimas – 2027 m. sausį (tiksli diena bus paskelbta vėliau).
        Prieš jį viskas bus išvalyta, o testavime dalyvavusiems žaidėjams bus atsilyginta.{' '}
        <a className="underline" href="/news/13">Plačiau</a>
      </div>
      <p className="text-white/60 text-sm">
        Nori hardkoro? Pasirink jį su naujai sukurtu personažu, kol dar negavai nė taško patirties.{' '}
        <a className="underline" href="/hardcore">Daugiau apie hardkorą</a>.
      </p>
    </div>
  );
}
