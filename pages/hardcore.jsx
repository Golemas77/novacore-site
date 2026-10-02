import Head from 'next/head';

const rules = [
  'Jokių grupių su kitais žaidėjais, PvP, dvikovų, mūšio laukų, požemių ir aukciono.',
  'Priešai turi 1,5 karto daugiau gyvybių ir daro 1,5 karto daugiau žalos.',
  'Patirties reitas lieka x1, nesvarbu, koks nustatytas serveris.',
  'Žuvus režimas panaikinamas, bet personažas lieka ir toliau žaidi įprastai.',
];

const rewards = [
  { k: 'Pasiekimas', v: 'Viena gyvybė, 80 lygis', note: '50 pasiekimo taškų' },
  { k: 'Titulas', v: 'Vardas Nepalaužiamasis', note: 'Rodomas prie tavo vardo' },
  { k: 'Jojamasis gyvūnas', v: 'Laike pasiklydęs protodrakonas', note: 'Išmokstamas iškart' },
];

export default function Hardcore() {
  return (
    <div className="space-y-10">
      <Head>
        <title>Hardkoro režimas – NovaCore</title>
        <meta
          name="description"
          content="NovaCore hardkoro režimas: viena gyvybė iki 80 lygio, o pasiekus jį gyvam – pasiekimas, titulas Nepalaužiamasis ir protodrakonas."
        />
      </Head>

      <header className="space-y-3">
        <h1 className="text-3xl md:text-5xl font-extrabold">
          Viena gyvybė.{' '}
          <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
            Aštuoniasdešimt lygių.
          </span>
        </h1>
        <p className="text-white/70 max-w-2xl">
          Savanoriškas iššūkis ne kiekvienam. Žūsti ir režimas baigiasi, bet personažas lieka. Pasieki 80 lygį gyvas ir gauni
          apdovanojimus, o visas serveris sužino apie tavo pasiekimą.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl bg-white/5 backdrop-blur ring-1 ring-white/10 p-5 sm:p-6">
          <h2 className="text-xl font-semibold">Taisyklės</h2>
          <ul className="mt-4 space-y-3 text-white/80">
            {rules.map((r) => (
              <li key={r} className="flex gap-3">
                <span className="mt-1 text-red-300">✕</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl bg-white/5 backdrop-blur ring-1 ring-white/10 p-5 sm:p-6">
          <h2 className="text-xl font-semibold">Kaip pradėti</h2>
          <ol className="mt-4 list-decimal pl-5 space-y-3 text-white/80">
            <li>Sukurk naują personažą. Režimą gali pasirinkti tik tas, kuris dar negavo nė taško patirties.</li>
            <li>
              Starto zonoje pasikalbėk su NPC <b>„Hardkoras“</b> arba parašyk <code className="rounded bg-black/30 px-1.5 py-0.5">.hardcore</code>.
            </li>
            <li>Priimk sąlygas. Virš tavęs užsidegs kaukolės aura, o kas dešimt lygių serveris visiems paskelbs tavo pasiekimą.</li>
          </ol>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Atlygis už 80 lygį</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {rewards.map((r) => (
            <div
              key={r.k}
              className="rounded-2xl bg-white/5 backdrop-blur ring-1 ring-amber-400/30 p-5"
            >
              <div className="text-xs uppercase tracking-wide text-amber-200/80">{r.k}</div>
              <div className="mt-1 text-lg font-semibold">{r.v}</div>
              <div className="mt-1 text-sm text-white/60">{r.note}</div>
            </div>
          ))}
        </div>
        <p className="text-sm text-white/60">
          Pasiekus 80 lygį gyvam, hardkoro apribojimai nuimami, o apdovanojimai lieka visam laikui.
        </p>
      </section>
    </div>
  );
}
