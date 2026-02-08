import Navegacion from "../Componentes/Navegacion";
import { useAuth } from "../hooks/useAuth";
import { useTournaments } from "../hooks/useTournaments";

export default function MyTournamentsPage() {
  const { user } = useAuth();
  const { tournaments } = useTournaments();

  const myTournaments = tournaments.filter(t => t.ownerId === user?.id);

  return (
    <>
      <Navegacion />
      <div className="min-h-screen bg-gray-100 px-4 py-10">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Mis Torneos</h1>
          {myTournaments.length === 0 ? (
            <div className="text-gray-500 text-center">No has creado ningún torneo.</div>
          ) : (
            <ul className="space-y-4">
              {myTournaments.map(t => (
                <li key={t.id} className="border rounded-lg p-4 bg-blue-50">
                  <div className="font-semibold text-lg">{t.name}</div>
                  <div className="text-sm text-gray-600">{t.city} - {t.sport}</div>
                  <div className="text-xs text-gray-400">Inicio: {t.startDate} | Fin: {t.endDate}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
