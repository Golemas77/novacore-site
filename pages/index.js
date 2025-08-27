export default function Home() {
  return (
    <section className="py-28 text-center">
     <h1 className="text-4xl md:text-6xl font-extrabold">
  Sveiki atvykę į World of Warcraft:{' '}
  <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
    NovaCore
  </span>
</h1>
      <p className="mt-6 text-white/70 max-w-2xl mx-auto">
        Modernus, greitas ir pilnai integruotas privatus serveris, paremtas AzerothCore.
      </p>
      <div className="mt-10 flex justify-center gap-4">
        <a href="/how-to-connect" className="btn btn-primary">Kaip prisijungti</a>
        <a href="/downloads" className="btn btn-primary">Atsisiuntimai</a>
      </div>

    </section>
  );
}
