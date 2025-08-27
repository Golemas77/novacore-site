const PAGES = [
  '/',
  '/how-to-connect',
  '/downloads',
  '/news',
  '/realms',
  '/register'
];

export default function handler(req, res) {
  const host = (req.headers.host || '').toLowerCase();
  const base = `https://${host}`;

  const urls = PAGES.map(p => `<url><loc>${base}${p}</loc></url>`).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.status(200).send(xml);
}
