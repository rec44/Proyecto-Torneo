/**
 * MyProfilePage
 * 
 * Página de perfil del usuario.
 * - Muestra información básica del usuario (nombre, email, rol).
 * - Permite cambiar entre el calendario de torneos y el historial de partidos mediante pestañas.
 */
import { useState } from "react";
import Navegacion from "../Componentes/Navegacion";
import { useAuth } from "../hooks/useAuth";
import UserMatchHistory from "../Componentes/ProfileComponentes/UserMatchHistory";
import UserTournamentCalendar from "../Componentes/ProfileComponentes/UserTournamentCalendar";

export default function MyProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"calendar" | "history">("calendar");

  // Render principal: info de usuario y pestañas de calendario/historial
  return (
    <>
      <Navegacion />
      <div className="min-h-screen bg-gray-100 px-4 py-10">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Mi perfil</h1>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <span className="text-gray-500">Nombre</span>
              <span className="text-lg font-semibold">{user?.name}</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <span className="text-gray-500">Email</span>
              <span className="text-lg font-semibold">{user?.email}</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <span className="text-gray-500">Rol</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
                {user?.role === "admin" ? "Administrador" : "Usuario"}
              </span>
            </div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto mt-8">
          {/* Pestañas para cambiar entre calendario e historial */}
          <div className="flex gap-3 mb-6">
            <button
              className={`flex-1 py-2 rounded-lg font-semibold ${
                activeTab === "calendar"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setActiveTab("calendar")}
            >
              Calendario
            </button>
            <button
              className={`flex-1 py-2 rounded-lg font-semibold ${
                activeTab === "history"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setActiveTab("history")}
            >
              Historial
            </button>
          </div>

          {/* Renderiza el calendario o el historial según la pestaña activa */}
          {user && activeTab === "calendar" && (
            <UserTournamentCalendar userId={user.id} />
          )}
          {user && activeTab === "history" && (
            <div className="mt-8">
              <UserMatchHistory userId={user.id} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
