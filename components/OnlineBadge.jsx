import { useEffect, useState } from "react";

export default function OnlineBadge() {
  const [total, setTotal] = useState(null);   // null = kraunasi, 0 = gauta

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/online-public", { cache: "no-store" });
        const json = await res.json();
        if (!cancelled) setTotal(Number(json.total ?? 0));
      } catch {
        if (!cancelled) setTotal(0);
      }
    }

    load();                        // pirmas užklausimas
    const id = setInterval(load, 10_000); // poll kas 10 s
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  const label =
    total === null ? "Kraunama..." :
    `${total} online`;

  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-emerald-600/10 text-emerald-700 px-3 py-1 text-sm">
      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      {label}
    </span>
  );
}