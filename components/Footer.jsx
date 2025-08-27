// C:\NovaCoreSite\components\Footer.jsx
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-white/10 bg-slate-900/60">
      <div className="max-w-6xl mx-auto px-6 py-4 text-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="text-white/60">
          © {year} NovaCore. Neoficialus WoW privatus projektas.
        </p>

        {/* Dešinėje – paliekam tik Discord */}
        <nav className="flex items-center gap-6">
          {/* Pakeisk nuorodą į savo tikrą kvietimą */}
          <a
            href="https://discord.gg/fsMXA7vY"
            target="_blank"
            rel="noreferrer"
            className="hover:text-sky-300"
          >
            Discord
          </a>

          {/*
          Vėliau galėsim pridėti:
          <a href="mailto:support@tavodomenas.lt" className="hover:text-sky-300">Pagalba</a>
          <a href="https://twitter.com/..." target="_blank" rel="noreferrer" className="hover:text-sky-300">Twitter</a>
          <a href="https://facebook.com/..." target="_blank" rel="noreferrer" className="hover:text-sky-300">Facebook</a>
          */}
        </nav>
      </div>
    </footer>
  );
}