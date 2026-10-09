/** @type {import('next').NextConfig} */
// Nuo 2026-10-09 svetainė gyvena adresu https://www.novacore.lt. Senas adresas novacore-site.vercel.app lieka veikti
// tik paleidikliui (/api, /launcher, torrent), o naršyklės puslapiai persiunčiami į naują domeną.
module.exports = {
  async redirects() {
    return [
      {
        source: '/:path((?!api/|launcher/|_next/|NovaCore-3\.3\.5a\.torrent).*)',
        has: [{ type: 'host', value: 'novacore-site.vercel.app' }],
        destination: 'https://www.novacore.lt/:path',
        permanent: false,
      },
    ];
  },
};
