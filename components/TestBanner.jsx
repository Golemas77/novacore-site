// Svetainės juosta: serveris dar testuojamas, oficialus paleidimas 2027 m. sausį.
export default function TestBanner() {
  return (
    <div className="border-b border-amber-400/20 bg-amber-500/10 text-amber-100">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-3 gap-y-1 px-6 py-2 text-center text-sm">
        <span className="inline-flex items-center rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-amber-200 ring-1 ring-amber-400/30">
          Testavimas
        </span>
        <span>
          Oficialus paleidimas – <strong className="font-semibold">2027 m. sausį</strong>, tiksli diena bus paskelbta vėliau.
          Prieš jį viskas bus išvalyta, o testuotojams bus atsilyginta.
        </span>
        <a href="/news/13" className="font-medium text-amber-200 underline decoration-amber-300/50 hover:text-white">
          Plačiau
        </a>
      </div>
    </div>
  );
}
