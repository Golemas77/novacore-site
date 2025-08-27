import Head from 'next/head';
import Link from 'next/link';
import news from '../../data/news.json';

export async function getStaticPaths() {
  return { paths: news.map(n => ({ params: { id: String(n.id) } })), fallback: false };
}
export async function getStaticProps({ params }) {
  const item = news.find(n => n.id === Number(params.id)) || null;
  return { props: { item } };
}

export default function NewsPost({ item }) {
  if (!item) return <div>Įrašas nerastas.</div>;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  const content = item.content || item.excerpt;

  return (
    <div className="space-y-6">
      <Head>
        <title>{item.title} – NovaCore</title>
        <meta name="description" content={item.excerpt} />
        <meta property="og:title" content={`${item.title} – NovaCore`} />
        <meta property="og:description" content={item.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`${baseUrl}/news/${item.id}`} />
        <meta property="og:image" content={`${baseUrl}/og-default.jpg`} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <Link href="/news" className="text-sm text-white/60 hover:text-white/80">← Atgal į naujienas</Link>
      <header className="space-y-2">
        <div className="text-xs text-white/50">{item.date}</div>
        <h1 className="text-3xl font-bold">{item.title}</h1>
      </header>
      <article className="prose prose-invert max-w-none">
        <p>{content}</p>
      </article>
    </div>
  );
}
