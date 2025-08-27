// C:\NovaCoreSite\components\Navbar.jsx
export default function Navbar() {
  const links = [
    { href: "/news", label: "Naujienos" },
    { href: "/realms", label: "Realmai" },
    { href: "/register", label: "Registracija" },
  ];

  return (
    <nav className="w-full border-b border-white/10 bg-slate-900/70 backdrop-blur supports-[backdrop-filter]:bg-slate-900/50">
      {/* šiek tiek aukštesnė juosta, kad tilptų didesnis logotipas */}
      <div className="max-w-6xl mx-auto h-16 px-6 flex items-center justify-between">
        {/* Kairėje – TIK logotipas (be teksto) */}
        <a href="/" aria-label="NovaCore – pradžia" className="flex items-center">
          <img
            src="/logo.svg"
            alt="NovaCore"
            className="h-32 w-32 md:h-32 md:w-32 lg:h-48 lg:w-48 drop-shadow-[0_0_6px_rgba(56,189,248,.35)]"
          />
        </a>

        {/* Viduryje – meniu */}
        <div className="hidden md:flex items-center gap-8 text-sm">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-sky-300">
              {l.label}
            </a>
          ))}
        </div>

        {/* Dešinėje – CTA */}
        <div className="flex items-center gap-2">
          <a href="/register" className="btn btn-primary btn-sm">Prisijunk</a>
        </div>
      </div>
    </nav>
  );
}