import Link from 'next/link';
import OnlineBadge from '../components/OnlineBadge';
import news from '../data/news.json';

const features = [
  {
    title: 'Lietuvių kalba',
    text: 'Užduotys, NPC pokalbiai, burtai, daiktai, pasiekimai, žemėlapių ir požemių užrašai. Terminai laikosi vieno žodyno.',
    tag: 'Veikia',
  },
  {
    title: 'Lietuviški žemėlapiai',
    text: 'Zonų ir požemių žemėlapių užrašai išversti, todėl vietovių pavadinimai skamba lietuviškai ir ten, kur jų nepasiekia tekstai.',
    tag: 'Veikia',
  },
  {
    title: 'HD klientas',
    text: 'Gražesnės tekstūros ir lietuviška sąsaja viename kliente, be papildomų taisymų.',
    tag: 'Veikia',
  },
  {
    title: 'Hardkoro režimas',
    text: 'Viena gyvybė iki 80 lygio. Pasieki ją gyvas ir gauni pasiekimą, titulą „Nepalaužiamasis“ bei protodrakoną.',
    tag: 'Veikia',
    href: '/hardcore',
  },
  {
    title: 'Asmeninis grobis',
    text: 'Kiekvienas grupės narys mato ir pasiima tik savo grobį. Nebelieka ginčų dėl daiktų.',
    tag: 'Veikia',
  },
  {
    title: 'Burto švytėjimas',
    text: 'Auksinis rėmelis ant burto mygtuko, kai gauni proc’ą, kaip Retail. Papildomų priedų nereikia.',
    tag: 'Veikia',
  },
  {
    title: 'Karo režimas',
    text: '+20 % patirties už priešus ir užduotis. PvP vyksta tik tarp karo režimo žaidėjų.',
    tag: 'Testuojama',
  },
  {
    title: 'Požemių pasiuntiniai',
    text: 'Prie požemių įėjimų stovi NPC, kuris duoda ir priima požemių užduotis.',
    tag: 'Testuojama',
  },
  {
    title: 'Išvaizdos meistrė',
    text: 'Pakeisk daikto išvaizdą nekeisdamas jo savybių. Kolekcija bendra visai paskyrai.',
    tag: 'Testuojama',
  },
];

function Tag({ children }) {
  const testing = children === 'Testuojama';
  return (
    <span
      className={
        'inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ' +
        (testing
          ? 'bg-amber-500/15 text-amber-200 ring-amber-400/30'
          : 'bg-emerald-500/15 text-emerald-200 ring-emerald-400/30')
      }
    >
      {children}
    </span>
  );
}

export default function Home() {
  const latest = [...news].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);

  return (
    <div className="space-y-20">
      {/* HERO */}
      <section className="py-16 md:py-24 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold">
          Sveiki atvykę į World of Warcraft:{' '}
          <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
            NovaCore
          </span>
        </h1>
        <p className="mt-6 text-white/70 max-w-2xl mx-auto">
          Ličo Karaliaus rūstybės (3.3.5a) serveris, paremtas AzerothCore. Pilnai išverstas į lietuvių kalbą,
          su HD klientu ir mūsų pačių sukurtomis sistemomis.
        </p>
        <div className="mt-6 flex justify-center">
          <OnlineBadge />
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a href="/how-to-connect" className="btn btn-primary">Kaip prisijungti</a>
          <a href="/downloads" className="btn btn-primary">Atsisiuntimai</a>
          <a href="/hardcore" className="btn btn-outline">Hardkoro režimas</a>
        </div>
      </section>

      {/* SISTEMOS */}
      <section id="sistemos" className="space-y-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">Ką rasi NovaCore</h2>
          <p className="mt-2 text-white/70 max-w-2xl">
            Šias sistemas sukūrėme patys. Kai kurios jau išbandytos žaidime, kitos dar testuojamos, todėl pažymėtos atskirai.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => {
            const inner = (
              <div className="h-full rounded-2xl bg-white/5 backdrop-blur ring-1 ring-white/10 p-5 transition hover:bg-white/10">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold">{f.title}</h3>
                  <Tag>{f.tag}</Tag>
                </div>
                <p className="mt-2 text-sm/6 text-white/70">{f.text}</p>
              </div>
            );
            return f.href ? (
              <Link key={f.title} href={f.href} className="block">{inner}</Link>
            ) : (
              <div key={f.title}>{inner}</div>
            );
          })}
        </div>
      </section>

      {/* NAUJIENOS */}
      <section className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl md:text-3xl font-bold">Naujausios naujienos</h2>
          <Link href="/news" className="text-sm text-sky-300 hover:text-sky-200">Visos naujienos →</Link>
        </div>
        <div className="space-y-4">
          {latest.map((item) => (
            <Link key={item.id} href={`/news/${item.id}`} className="block">
              <article className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition">
                <div className="text-xs text-white/50">{item.date}</div>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-white/80">{item.excerpt}</p>
              </article>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
