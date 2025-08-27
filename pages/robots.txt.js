export default function handler(req, res) {
  const host = (req.headers.host || '').toLowerCase();

  // Blokuojam preview / vercel.app
  const isPreview = host.endsWith('.vercel.app');

  const body = isPreview
    ? `User-agent: *
Disallow: /`
    : `User-agent: *
Allow: /
Sitemap: https://${host}/sitemap.xml`;

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.status(200).send(body);
}