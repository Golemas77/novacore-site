import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="text-center py-24">
      <h1 className="text-5xl font-extrabold">404</h1>
      <p className="mt-3 text-white/70">Puslapis nerastas.</p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/" className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20">Į pradžią</Link>
        <Link href="/how-to-connect" className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10">
          Kaip prisijungti
        </Link>
      </div>
    </div>
  );
}
