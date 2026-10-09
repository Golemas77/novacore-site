import useOnline, { formatCount } from "../lib/useOnline";

// Rodo bendra prisijungusiu skaiciu. Jei serveris islaustas – pilka zyme; jei duomenu nera – nieko nerodo.
export default function OnlineBadge({ compact = false }) {
  const { loaded, ok, online, total, bots, players } = useOnline();

  const size = (compact ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm") + " whitespace-nowrap";

  if (!loaded) {
    return (
      <span className={`inline-flex items-center gap-2 rounded-full bg-white/10 text-white/60 ring-1 ring-white/10 ${size}`}>
        Kraunama…
      </span>
    );
  }
  if (!ok) return null;

  if (!online) {
    return (
      <span className={`inline-flex items-center gap-2 rounded-full bg-white/10 text-white/70 ring-1 ring-white/15 ${size}`}>
        <span className="h-2 w-2 rounded-full bg-slate-400" />
        Serveris išjungtas
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-2 rounded-full bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-400/30 ${size}`}>
      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
      {typeof bots === "number" && typeof players === "number"
        ? `${formatCount(players)} ${players === 1 ? "žaidėjas" : "žaidėjų"} online · ${formatCount(bots)} botų`
        : `${formatCount(total)} online`}
    </span>
  );
}
