export default function Realms() {
  const realm = {
    name: "NovaCore PvE",
    xp: "x1.5",
    status: "online",        // "online" arba "offline"
    population: "Vidutinė"
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Realmai</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">{realm.name}</h3>
            <span className={`text-sm ${realm.status === 'online' ? 'text-green-400' : 'text-red-400'}`}>
              {realm.status === 'online' ? 'Prisijungęs' : 'Atsijungęs'}
            </span>
          </div>

          <div className="mt-2 text-white/70 text-sm">XP greitis: {realm.xp}</div>
          <div className="text-white/70 text-sm">Populiacija: {realm.population}</div>
        </div>
      </div>

      <p className="text-white/60 text-sm">Vėliau prijungsime prie realaus statuso API.</p>
    </div>
  );
}
