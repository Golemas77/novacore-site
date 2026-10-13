import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import media from "../data/media.json";
import social from "../data/social.json";

export default function Media() {
  const { trailer, photos } = media;
  const [open, setOpen] = useState(-1);

  const close = useCallback(() => setOpen(-1), []);
  const step = useCallback(
    (d) => setOpen((i) => (i < 0 ? i : (i + d + photos.length) % photos.length)),
    [photos.length]
  );

  useEffect(() => {
    if (open < 0) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "ArrowRight") step(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close, step]);

  const current = open >= 0 ? photos[open] : null;

  return (
    <div className="space-y-10">
      <Head>
        <title>Medija – NovaCore</title>
        <meta
          name="description"
          content="NovaCore treileris ir ekrano nuotraukos iš žaidimo: lietuviškos užduotys, žemėlapiai ir pasaulis."
        />
        <meta property="og:image" content={`https://www.novacore.lt${trailer.poster}`} />
      </Head>

      <header className="space-y-2">
        <h2 className="text-3xl font-bold">Medija</h2>
        <p className="text-white/70 max-w-2xl">
          Treileris ir ekrano nuotraukos iš NovaCore: viskas fotografuota mūsų žaidime, su lietuviška sąsaja ir tekstais.
        </p>
      </header>

      <section className="rounded-2xl bg-white/5 backdrop-blur ring-1 ring-white/10 p-5 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold">{trailer.title}</h3>
            <p className="text-sm text-white/70">{trailer.note}</p>
          </div>
          <a href={trailer.video} download className="btn btn-ghost btn-sm">
            Atsisiųsti vaizdo įrašą
          </a>
        </div>
        <video
          controls
          playsInline
          preload="metadata"
          poster={trailer.poster}
          className="w-full rounded-xl ring-1 ring-white/10 bg-black"
        >
          <source src={trailer.video} type="video/mp4" />
          Tavo naršyklė nepalaiko vaizdo įrašų. Atsisiųsk jį ir paleisk savo grotuve.
        </video>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Nuotraukos iš žaidimo</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((p, i) => (
            <button
              key={p.file}
              type="button"
              onClick={() => setOpen(i)}
              className="group text-left rounded-xl overflow-hidden bg-white/5 ring-1 ring-white/10 hover:ring-sky-400/50 transition"
            >
              <img
                src={`/media/thumbs/${p.file}.jpg`}
                alt={p.caption}
                loading="lazy"
                className="w-full aspect-video object-cover group-hover:opacity-90 transition"
              />
              <span className="block px-3 py-2 text-sm text-white/80">{p.caption}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-white/5 backdrop-blur ring-1 ring-white/10 p-5 sm:p-6 space-y-3">
        <h3 className="text-xl font-semibold">Sek mus</h3>
        <p className="text-sm text-white/70">Naujienos, nuotraukos ir vaizdo įrašai – ten, kur jums patogiausia.</p>
        <div className="flex flex-wrap gap-3">
          {social.discord && (
            <a href={social.discord} target="_blank" rel="noreferrer" className="btn btn-primary">
              Discord
            </a>
          )}
          {social.instagram && (
            <a href={social.instagram} target="_blank" rel="noreferrer" className="btn btn-ghost">
              Instagram
            </a>
          )}
        </div>
      </section>

      {current && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={current.caption}
          onClick={close}
        >
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); step(-1); }}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-3 py-2 text-xl hover:bg-white/20"
            aria-label="Ankstesnė nuotrauka"
          >
            ‹
          </button>
          <figure className="max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={`/media/shots/${current.file}.jpg`}
              alt={current.caption}
              className="w-full max-h-[85vh] object-contain rounded-lg"
            />
            <figcaption className="mt-2 text-center text-sm text-white/80">
              {current.caption} · {open + 1}/{photos.length}
            </figcaption>
          </figure>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); step(1); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-3 py-2 text-xl hover:bg-white/20"
            aria-label="Kita nuotrauka"
          >
            ›
          </button>
          <button
            type="button"
            onClick={close}
            className="absolute right-3 top-3 rounded-full bg-white/10 px-3 py-1 text-lg hover:bg-white/20"
            aria-label="Uždaryti"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
