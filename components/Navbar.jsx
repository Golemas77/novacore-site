export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/70 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        {/* Logotipas + pavadinimas */}
        <a href="/" className="flex items-center gap-3">
          <img
            src="/logo.svg"
            alt="NovaCore"
            className="h-9 w-9 md:h-10 md:w-10 lg:h-12 lg:w-12
                       drop-shadow-[0_0_10px_rgba(56,189,248,.45)]"
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

        {/* Viršutinis meniu */}
        <nav className="hidden md:flex items-center gap-8 text-sm text-white/80">
          <a href="/news" className="hover:text-white transition">Naujienos</a>
          <a href="/hardcore" className="hover:text-white transition">Hardkoras</a>
          <a href="/realms" className="hover:text-white transition">Realmai</a>
          <a href="/downloads" className="hover:text-white transition">Atsisiuntimai</a>
          <a href="/register" className="hover:text-white transition">Registracija</a>
          <a
            href="/how-to-connect"
            className="rounded-md bg-gradient-to-r from-sky-500 to-indigo-500 px-3 py-1.5 font-medium text-white shadow hover:opacity-90"
          >
            Prisijunk
          </a>
        </nav>
      </div>

      {/* Telefono meniu: viena slenkama eilutė */}
      <nav className="md:hidden flex items-center gap-5 overflow-x-auto whitespace-nowrap border-t border-white/10 px-6 py-2 text-sm text-white/80">
        <a href="/news" className="hover:text-white">Naujienos</a>
        <a href="/hardcore" className="hover:text-white">Hardkoras</a>
        <a href="/realms" className="hover:text-white">Realmai</a>
        <a href="/downloads" className="hover:text-white">Atsisiuntimai</a>
        <a href="/register" className="hover:text-white">Registracija</a>
        <a href="/how-to-connect" className="font-medium text-sky-300 hover:text-sky-200">Prisijunk</a>
      </nav>
    </header>
  );
}