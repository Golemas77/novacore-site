import Head from "next/head";
import { useEffect, useState } from "react";
import Armory, { CLASS_COLORS } from "../components/Armory";

export default function Account() {
  const [state, setState] = useState({ loading: true });
  const [sel, setSel] = useState(0);

  useEffect(() => {
    let alive = true;
    fetch("/api/me?full=1")
      .then(async (r) => {
        if (r.status === 401) { window.location.replace("/login"); return null; }
        return r.json();
      })
      .then((j) => { if (alive && j) setState({ loading: false, user: j.user, data: j.data }); })
      .catch(() => { if (alive) setState({ loading: false, error: true }); });
    return () => { alive = false; };
  }, []);

  const logout = async () => {
    await fetch("/api/logout", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" }).catch(() => {});
    window.location.assign("/");
  };

  const chars = state.data?.characters || [];
  const current = chars[Math.min(sel, Math.max(0, chars.length - 1))];

  return (
    <div className="space-y-8">
      <Head>
        <title>Mano kambarys – NovaCore</title>
        <meta name="robots" content="noindex" />
      </Head>

      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-3xl font-bold">Mano kambarys</h2>
          {state.user && <p className="text-white/70">Paskyra: <span className="font-medium text-white">{state.user.username}</span></p>}
        </div>
        <button type="button" onClick={logout} className="btn btn-ghost btn-sm">Atsijungti</button>
      </header>

      {state.loading && <p className="text-white/60">Kraunama…</p>}
      {state.error && <p className="text-rose-200">Nepavyko įkelti duomenų. Bandyk dar kartą vėliau.</p>}

      {!state.loading && !state.error && !state.data && (
        <section className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-5 space-y-2">
          <h3 className="text-xl font-semibold">Duomenys dar ruošiami</h3>
          <p className="text-white/70">
            Veikėjų suvestinė atnaujinama kas kelias minutes. Jei ką tik susikūrei paskyrą ar veikėją, pabandyk po 5 minučių.
          </p>
        </section>
      )}

      {state.data && chars.length === 0 && (
        <section className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-5 space-y-2">
          <h3 className="text-xl font-semibold">Veikėjų dar nėra</h3>
          <p className="text-white/70">
            Prisijunk prie žaidimo ir susikurk pirmą veikėją – jis atsiras čia. Kaip prisijungti, rasi{" "}
            <a href="/how-to-connect" className="text-sky-300 hover:text-sky-200">čia</a>.
          </p>
        </section>
      )}

      {chars.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <nav className="space-y-2" aria-label="Mano veikėjai">
            {chars.map((c, i) => (
              <button
                key={c.guid}
                type="button"
                onClick={() => setSel(i)}
                className={`w-full rounded-xl px-3 py-2 text-left ring-1 transition ${
                  i === sel ? "bg-white/15 ring-sky-400/60" : "bg-white/5 ring-white/10 hover:bg-white/10"
                }`}
              >
                <div className="font-semibold" style={{ color: CLASS_COLORS[c.classId] || "#fff" }}>{c.name}</div>
                <div className="text-xs text-white/60">{c.level} lygis · {c.race} · {c.class}</div>
              </button>
            ))}
          </nav>
          <section className="rounded-2xl bg-white/5 backdrop-blur ring-1 ring-white/10 p-5 sm:p-6">
            {current && <Armory c={current} />}
          </section>
        </div>
      )}
    </div>
  );
}
