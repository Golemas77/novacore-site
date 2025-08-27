import Link from 'next/link';
import news from '../data/news.json';

export default function News() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Naujienos</h2>
      <div className="space-y-4">
        {news.map(item => (
          <Link key={item.id} href={`/news/${item.id}`}>
            <article className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition">
              <div className="text-xs text-white/50">{item.date}</div>
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="text-white/80">{item.excerpt}</p>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
