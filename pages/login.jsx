import Head from "next/head";
import { useEffect, useRef, useState } from "react";

const MESSAGES = {
  bad: "Neteisingas vartotojo vardas arba slaptažodis.",
  banned: "Ši paskyra užblokuota.",
  error: "Nepavyko patikrinti paskyros. Bandyk dar kartą po kelių minučių.",
  expired: "Užklausa nebegalioja. Bandyk dar kartą.",
  timeout: "Serveris šiuo metu neatsako. Bandyk vėliau arba parašyk mums Discord serveryje.",
};

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    // jau prisijungęs – tiesiai į kambarį
    fetch("/api/me").then((r) => { if (r.ok && alive.current) window.location.replace("/account"); }).catch(() => {});
    return () => { alive.current = false; };
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setError("");
    setBusy(true);
    try {
      const r = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j.ok) {
        setError(j.error || MESSAGES.error);
        setBusy(false);
        return;
      }
      for (let i = 0; i < 30 && alive.current; i++) {
        await new Promise((res) => setTimeout(res, 1000));
        const s = await fetch(`/api/login-status?ticket=${j.ticket}`).then((x) => x.json()).catch(() => ({ status: "pending" }));
        if (s.status === "ok") {
          window.location.assign("/account");
          return;
        }
        if (s.status !== "pending") {
          setError(MESSAGES[s.status] || MESSAGES.error);
          setBusy(false);
          return;
        }
      }
      setError(MESSAGES.timeout);
    } catch {
      setError(MESSAGES.error);
    }
    setBusy(false);
  };

  return (
    <div className="mx-auto max-w-md space-y-6">
      <Head>
        <title>Prisijungimas – NovaCore</title>
        <meta name="description" content="Prisijunk prie NovaCore paskyros: matyk savo veikėjus, jų aprangą ir pasiekimus." />
      </Head>

      <header className="space-y-2">
        <h2 className="text-3xl font-bold">Prisijungimas</h2>
        <p className="text-white/70">
          Naudok tą patį vartotojo vardą ir slaptažodį, kaip žaidime. Prisijungęs matysi savo veikėjus ir jų aprangą.
        </p>
      </header>

      <form onSubmit={submit} className="space-y-4 rounded-2xl bg-white/5 backdrop-blur ring-1 ring-white/10 p-5 sm:p-6">
        <label className="block space-y-1">
          <span className="text-sm text-white/70">Vartotojo vardas</span>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            maxLength={16}
            required
            className="w-full rounded-lg bg-black/30 px-3 py-2 ring-1 ring-white/15 focus:outline-none focus:ring-sky-400"
          />
        </label>
        <label className="block space-y-1">
          <span className="text-sm text-white/70">Slaptažodis</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            maxLength={16}
            required
            className="w-full rounded-lg bg-black/30 px-3 py-2 ring-1 ring-white/15 focus:outline-none focus:ring-sky-400"
          />
        </label>
        {error && <p className="rounded-lg bg-rose-500/15 px-3 py-2 text-sm text-rose-200" role="alert">{error}</p>}
        <button type="submit" disabled={busy} className="btn btn-primary btn-lg w-full">
          {busy ? "Tikrinama…" : "Prisijungti"}
        </button>
        <p className="text-sm text-white/60">
          Neturi paskyros? <a href="/register" className="text-sky-300 hover:text-sky-200">Susikurk ją</a>. Nori žaisti?{" "}
          <a href="/how-to-connect" className="text-sky-300 hover:text-sky-200">Kaip prisijungti prie žaidimo</a>.
        </p>
      </form>
    </div>
  );
}
