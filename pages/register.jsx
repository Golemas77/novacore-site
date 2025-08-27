import { useState } from "react";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [msg, setMsg] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    // TODO: čia vėliau darysim tikrą užklausą į backend (AzerothCore auth)
    // pvz. POST /api/register
    setMsg("Paskyros kūrimo užklausa nusiųsta (demo). Vėliau sujungsime su backend.");
  };

  return (
    <div className="max-w-md space-y-6">
      <h2 className="text-3xl font-bold">Registracija</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Vartotojo vardas</label>
          <input
            name="username"
            value={form.username}
            onChange={onChange}
            className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 outline-none"
            required
            minLength={3}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">El. paštas</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Slaptažodis</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={onChange}
            className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 outline-none"
            required
            minLength={6}
          />
          <p className="text-xs text-white/50 mt-1">Mažiausiai 6 simboliai.</p>
        </div>

        <button className="btn btn-primary">Sukurti paskyrą</button>

      </form>
      {msg && <div className="text-green-400 text-sm">{msg}</div>}
      <p className="text-white/50 text-sm">
        Jau turi paskyrą? Prisijungimas bus pridėtas netrukus.
      </p>
    </div>
  );
}
