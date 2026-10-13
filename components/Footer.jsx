// C:\NovaCoreSite\components\Footer.jsx
import social from "../data/social.json";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-white/10 bg-slate-900/60">
      <div className="max-w-6xl mx-auto px-6 py-4 text-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="text-white/60">
          © {year} NovaCore. Neoficialus WoW privatus projektas.
        </p>

        {/* Dešinėje – nuorodos (socialinės nuorodos – data/social.json; tuščios nerodomos) */}
        <nav className="flex flex-wrap items-center justify-center gap-6">
          {/* Serverio šaltinis: AGPLv3 reikalauja pasiūlyti žaidėjams pakeistą kodą */}
          <a
            href="https://github.com/Golemas77/novacore-server"
            target="_blank"
            rel="noreferrer"
            className="hover:text-sky-300"
            title="Serverio šaltinio kodas (AGPL-3.0)"
          >
            Šaltinio kodas
          </a>

          <a href="/media" className="hover:text-sky-300">
            Medija
          </a>

          {/* Nuolatinis kvietimas (galiojimas: niekada) */}
          {social.discord && (
            <a
              href={social.discord}
              target="_blank"
              rel="noreferrer"
              className="hover:text-sky-300"
            >
              Discord
            </a>
          )}

          {social.instagram && (
            <a
              href={social.instagram}
              target="_blank"
              rel="noreferrer"
              className="hover:text-sky-300"
            >
              Instagram
            </a>
          )}

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