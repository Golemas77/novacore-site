import { useState } from "react";
const REALMLIST = "set realmlist login.novacore.gg";

export default function HowToConnect() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
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
        <li>Atsisiųsk WoW klientą (palaikomą versiją).</li>
        <li>Atidaryk <code>Data/enUS (ar ruRU)/realmlist.wtf</code> ir įrašyk:
          <div className="mt-2 p-3 bg-black/30 rounded flex items-center justify-between">
            <code>{REALMLIST}</code>
            <button onClick={copy} className="ml-4 btn btn-primary btn-sm">
              {copied ? "Nukopijuota!" : "Kopijuoti"}
            </button>

          </div>
        </li>
        <li>Susikurk paskyrą svetainėje (arba <a className="underline" href="/register">registruokis čia</a>).</li>
        <li>Paleisk žaidimą per <code>WoW.exe</code>.</li>
      </ol>
    </div>
  );
}
