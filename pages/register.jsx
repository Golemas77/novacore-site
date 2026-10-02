import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import { validateRegistration } from "../lib/registration";

const POLL_MS = 2500;
const POLL_MAX = 36;            // ~90 s

const RESULT_TEXT = {
  ok: null,
  exists: "Šis vartotojo vardas jau užimtas. Pasirink kitą.",
  email_limit: "Su šiuo el. paštu jau sukurta per daug paskyrų.",
  error: "Nepavyko sukurti paskyros. Bandyk dar kartą arba parašyk mums Discord serveryje.",
};

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "", password2: "", website: "" });
  const [phase, setPhase] = useState("form");   // form | sending | waiting | done | slow
  const [error, setError] = useState("");
  const [account, setAccount] = useState("");
  const loadedAt = useRef(0);
  const timer = useRef(null);

  useEffect(() => {
    loadedAt.current = Date.now();
    return () => clearTimeout(timer.current);
  }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const poll = (ticket, tries = 0) => {
    timer.current = setTimeout(async () => {
      try {
        const r = await fetch(`/api/register-status?ticket=${ticket}`, { cache: "no-store" });
        const j = await r.json();
        if (j.status === "ok") { setPhase("done"); return; }
        if (j.status && j.status !== "pending" && j.status !== "unknown") {
          setError(RESULT_TEXT[j.status] || RESULT_TEXT.error);
          setPhase("form");
          return;
        }
      } catch { /* bandysim dar kartą */ }
      if (tries + 1 >= POLL_MAX) { setPhase("slow"); return; }
      poll(ticket, tries + 1);
    }, POLL_MS);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.password2) { setError("Slaptažodžiai nesutampa."); return; }
    const problem = validateRegistration(form);
    if (problem) { setError(problem); return; }

    setPhase("sending");
    try {
      const r = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
          website: form.website,
          elapsed: Date.now() - loadedAt.current,
        }),
      });
      const j = await r.json();
      if (!r.ok || !j.ok) { setError(j.error || "Nepavyko išsiųsti užklausos."); setPhase("form"); return; }
      setAccount(form.username.toUpperCase());
      setForm((f) => ({ ...f, password: "", password2: "" }));
      setPhase("waiting");
      poll(j.ticket);
    } catch {
      setError("Nepavyko prisijungti prie svetainės. Bandyk dar kartą.");
      setPhase("form");
    }
  };

  const busy = phase === "sending" || phase === "waiting";

  if (phase === "done") {
    return (
      <div className="max-w-md space-y-6">
        <Head><title>Registracija – NovaCore</title></Head>
        <h2 className="text-3xl font-bold">Paskyra sukurta</h2>
        <div className="card space-y-3">
          <p className="text-emerald-300">Paskyra <b>{account}</b> sėkmingai sukurta.</p>
          <p className="text-white/80 text-sm">
            Dabar atsisiųsk klientą ir nurodyk serverį, o prisijunk su savo vartotojo vardu ir slaptažodžiu.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="/how-to-connect" className="btn btn-primary">Kaip prisijungti</a>
            <a href="/downloads" className="btn btn-outline">Atsisiuntimai</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md space-y-6">
      <Head><title>Registracija – NovaCore</title></Head>
      <h2 className="text-3xl font-bold">Registracija</h2>
      <p className="text-white/70 text-sm">
        Susikurk žaidimo paskyrą ir galėsi iškart prisijungti prie serverio. Slaptažodis niekur nesaugomas atviru tekstu.
      </p>

      <form onSubmit={onSubmit} className="space-y-4" autoComplete="off">
        <div>
          <label className="label" htmlFor="username">Vartotojo vardas</label>
          <input id="username" name="username" value={form.username} onChange={onChange} className="input"
                 required minLength={3} maxLength={16} disabled={busy} autoComplete="username" />
          <p className="text-xs text-white/50 mt-1">3-16 simbolių: lotyniškos raidės ir skaitmenys.</p>
        </div>
        <div>
          <label className="label" htmlFor="email">El. paštas</label>
          <input id="email" type="email" name="email" value={form.email} onChange={onChange} className="input"
                 required disabled={busy} autoComplete="email" />
        </div>
        <div>
          <label className="label" htmlFor="password">Slaptažodis</label>
          <input id="password" type="password" name="password" value={form.password} onChange={onChange} className="input"
                 required minLength={6} maxLength={16} disabled={busy} autoComplete="new-password" />
          <p className="text-xs text-white/50 mt-1">6-16 simbolių, be tarpų, tik lotyniškais simboliais.</p>
        </div>
        <div>
          <label className="label" htmlFor="password2">Pakartok slaptažodį</label>
          <input id="password2" type="password" name="password2" value={form.password2} onChange={onChange} className="input"
                 required minLength={6} maxLength={16} disabled={busy} autoComplete="new-password" />
        </div>

        {/* robotų spąstai: žmogus šio lauko nemato */}
        <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", height: 0, overflow: "hidden" }}>
          <label htmlFor="website">Svetainė</label>
          <input id="website" name="website" value={form.website} onChange={onChange} tabIndex={-1} autoComplete="off" />
        </div>

        <button className="btn btn-primary" disabled={busy}>
          {phase === "sending" ? "Siunčiama…" : phase === "waiting" ? "Kuriama paskyra…" : "Sukurti paskyrą"}
        </button>
      </form>

      {error && <div className="text-red-300 text-sm" role="alert">{error}</div>}
      {phase === "waiting" && (
        <div className="text-sky-200 text-sm">
          Užklausa priimta, paskyra kuriama. Tai užtrunka kelias sekundes, nešvaistyk puslapio.
        </div>
      )}
      {phase === "slow" && (
        <div className="text-amber-300 text-sm">
          Užklausa priimta, bet serveris jos dar neapdorojo (galbūt jis išjungtas). Paskyra bus sukurta, kai tik serveris ją pasieks.
          Po kelių minučių pabandyk prisijungti su savo vardu ir slaptažodžiu. Jei nepavyks, parašyk mums Discord serveryje.
        </div>
      )}
      <p className="text-white/50 text-sm">Jau turi paskyrą? Tiesiog <a className="underline" href="/how-to-connect">prisijunk prie serverio</a>.</p>
    </div>
  );
}
