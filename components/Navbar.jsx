export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/70 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        {/* Logotipas + pavadinimas */}
        <a href="/" className="flex items-center gap-3">
          <img
            src="/logo.svg"
            alt="NovaCore"
            className="h-8 w-8 md:h-8 md:w-8 lg:h-10 lg:w-10 drop-shadow-[0_0_6px_rgba(56,189,248,.35)]"
          />
          <span
            className="hidden sm:inline font-bold text-lg tracking-wide
                       bg-gradient-to-r from-sky-400 via-sky-300 to-indigo-400
                       bg-clip-text text-transparent
                       drop-shadow-[0_0_18px_rgba(56,189,248,.25)]"
          >
            NovaCore
          </span>
        </a>

        {/* Meniu */}
        <nav className="hidden md:flex items-center gap-8 text-sm text-white/80">
          <a href="/news" className="hover:text-white transition">Naujienos</a>
          <a href="/realms" className="hover:text-white transition">Realmai</a>
          <a href="/register" className="hover:text-white transition">Registracija</a>

          <a
            href="/how-to-connect"
            className="rounded-md bg-gradient-to-r from-sky-500 to-indigo-500 px-3 py-1.5 font-medium text-white shadow hover:opacity-90"
          >
            Prisijunk
          </a>
        </nav>
      </div>
    </header>
  );
}