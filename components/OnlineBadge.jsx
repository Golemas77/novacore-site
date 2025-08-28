import { useEffect, useState } from "react";

export default function OnlineBadge() {
  const [total, setTotal] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/online-public", { cache: "no-store" });
        const json = await res.json();
        if (!cancelled) setTotal(json.total ?? 0);
      } catch {
        if (!cancelled) setTotal(0);
      }
    }

    load();
    const id = setInterval(load, 10_000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600/10 text-emerald-700 px-2 py-1 text-sm">
      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      {total === null ? "loading..." : `${total} online`}
    </span>
  );
}