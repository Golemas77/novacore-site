import { useState } from "react";
// Veikėjo lapas (kaip „Armory“): informacija + apranga. Naudojamas „Mano kambaryje“, vėliau – viešame armory.
const QUALITY = ["#9d9d9d", "#ffffff", "#1eff00", "#0070dd", "#a335ee", "#ff8000", "#e6cc80", "#00ccff"];

export const CLASS_COLORS = {
  1: "#C79C6E", 2: "#F58CBA", 3: "#ABD473", 4: "#FFF569", 5: "#FFFFFF",
  6: "#C41F3B", 7: "#0070DE", 8: "#69CCF0", 9: "#9482C9", 11: "#FF7D0A",
};

const SLOT_LABELS = {
  0: "Galva", 1: "Kaklas", 2: "Pečiai", 3: "Marškiniai", 4: "Krūtinė", 5: "Juosmuo", 6: "Kojos", 7: "Batai", 8: "Riešai",
  9: "Rankos", 10: "Žiedas", 11: "Žiedas", 12: "Aksesuaras", 13: "Aksesuaras", 14: "Nugara", 15: "Pagrindinė ranka",
  16: "Antroji ranka", 17: "Nuotolinis ginklas", 18: "Herbas",
};

const LEFT = [0, 1, 2, 14, 4, 3, 18, 8];
const RIGHT = [9, 5, 6, 7, 10, 11, 12, 13];
const BOTTOM = [15, 16, 17];

export function formatMoney(copper) {
  const g = Math.floor(copper / 10000);
  const s = Math.floor((copper % 10000) / 100);
  const c = copper % 100;
  return `${g.toLocaleString("lt-LT")} aukso ${s} sidabro ${c} vario`;
}

export function formatPlayed(sec) {
  const d = Math.floor(sec / 86400);
  const h = Math.floor((sec % 86400) / 3600);
  const m = Math.floor((sec % 3600) / 60);
  if (d > 0) return `${d} d. ${h} val.`;
  if (h > 0) return `${h} val. ${m} min.`;
  return `${m} min.`;
}

const TIP_COLORS = { n: null, w: "#ffffff", y: "#ffd100", g: "#1eff00", x: "#8b8b8b", r: "#ff2020" };

function Tooltip({ item, color, side }) {
  const pos = side === "left" ? "right-full mr-2 top-0" : side === "up" ? "bottom-full mb-2 left-0" : "left-full ml-2 top-0";
  return (
    <div
      role="tooltip"
      className={`pointer-events-none absolute z-40 w-80 max-w-[85vw] rounded-lg border border-white/20 bg-slate-950/95 p-3 text-[13px] leading-snug shadow-xl ${pos}`}
    >
      {item.tip.map((ln, i) => {
        const [cls, left, right] = ln;
        if (!left && !right) return <div key={i} className="h-2" />;
        const style = cls === "n" ? { color, fontWeight: 700, fontSize: "15px" } : { color: TIP_COLORS[cls] || "#fff" };
        return right ? (
          <div key={i} className="flex justify-between gap-4" style={style}>
            <span>{left}</span>
            <span>{right}</span>
          </div>
        ) : (
          <div key={i} style={style}>{left}</div>
        );
      })}
    </div>
  );
}

function Slot({ slot, item, side = "right" }) {
  const [open, setOpen] = useState(false);
  const color = item ? QUALITY[item.q] || QUALITY[1] : "rgba(255,255,255,0.15)";
  const hasTip = !!(item && item.tip && item.tip.length);
  return (
    <div
      className="relative flex items-center gap-2"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onClick={() => setOpen((v) => !v)}
      title={hasTip ? undefined : item ? item.name : SLOT_LABELS[slot]}
    >
      <div
        className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-black/40"
        style={{ border: `2px solid ${color}`, boxShadow: item ? `0 0 8px ${color}55` : "none" }}
      >
        {item && item.icon ? (
          <img
            src={`https://wow.zamimg.com/images/wow/icons/medium/${item.icon}.jpg`}
            alt={item.name}
            loading="lazy"
            className="h-full w-full object-cover"
            onError={(e) => { e.currentTarget.style.visibility = "hidden"; }}
          />
        ) : null}
      </div>
      <div className="min-w-0 text-xs leading-tight">
        {item ? (
          <>
            <div className="truncate font-medium" style={{ color }}>{item.name}</div>
            <div className="text-white/50">{item.il}{item.e ? " · užkerėta" : ""}</div>
          </>
        ) : (
          <div className="text-white/30">{SLOT_LABELS[slot]}</div>
        )}
      </div>
      {open && hasTip && <Tooltip item={item} color={color} side={side} />}
    </div>
  );
}

function Column({ slots, items, side }) {
  return (
    <div className="space-y-2">
      {slots.map((s) => <Slot key={s} slot={s} item={items[String(s)]} side={side} />)}
    </div>
  );
}

export default function Armory({ c }) {
  const color = CLASS_COLORS[c.classId] || "#fff";
  const items = c.items || {};
  const faction = c.faction === "A" ? "Aljansas" : "Orda";
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="text-2xl font-bold" style={{ color }}>{c.name}</h3>
          <p className="text-white/70">
            {c.level} lygis · {c.race} · <span style={{ color }}>{c.class}</span> · {faction}
            {c.guild ? <> · &lt;{c.guild}&gt;</> : null}
          </p>
        </div>
        <div className="text-right text-sm text-white/60">
          {c.online ? <span className="text-emerald-300">Žaidime dabar</span> : c.lastSeen ? `Paskutinį kartą: ${new Date(c.lastSeen * 1000).toLocaleString("lt-LT")}` : ""}
          {c.zone ? <div>{c.zone}</div> : null}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_auto_1fr]">
        <Column slots={LEFT} items={items} side="right" />
        <div className="hidden lg:flex w-40 flex-col items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10 px-3 py-6 text-center">
          <div className="text-4xl font-bold" style={{ color }}>{c.level}</div>
          <div className="text-xs text-white/50">lygis</div>
          <div className="mt-4 text-2xl font-semibold text-white">{c.ilvl || "–"}</div>
          <div className="text-xs text-white/50">aprangos lygis</div>
        </div>
        <Column slots={RIGHT} items={items} side="left" />
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        {BOTTOM.map((s) => <Slot key={s} slot={s} item={items[String(s)]} side="up" />)}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm">
        <Stat label="Aprangos lygis" value={c.ilvl || "–"} />
        <Stat label="Pasiekimai" value={`${c.achCount} (${c.achPoints} tšk.)`} />
        <Stat label="Garbės nužudymai" value={c.honorKills} />
        <Stat label="Žaista" value={formatPlayed(c.played)} />
        <Stat label="Pinigai" value={formatMoney(c.money)} wide />
      </div>

      {c.prof && c.prof.length > 0 && (
        <div>
          <h4 className="mb-2 text-sm font-semibold text-white/80">Profesijos</h4>
          <div className="flex flex-wrap gap-2">
            {c.prof.map((p) => (
              <span key={p.n} className="rounded-full bg-white/10 px-3 py-1 text-sm">{p.n} {p.v}/{p.m}</span>
            ))}
          </div>
        </div>
      )}

      {c.arena && c.arena.length > 0 && (
        <div>
          <h4 className="mb-2 text-sm font-semibold text-white/80">Arenos komandos</h4>
          <ul className="space-y-1 text-sm text-white/80">
            {c.arena.map((a) => (
              <li key={`${a.t}-${a.n}`}>
                {a.t}x{a.t} · {a.n} · reitingas {a.r} · {a.w}/{a.g} pergalių
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, wide }) {
  return (
    <div className={`rounded-lg bg-white/5 ring-1 ring-white/10 px-3 py-2 ${wide ? "sm:col-span-2" : ""}`}>
      <div className="text-xs text-white/50">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}
