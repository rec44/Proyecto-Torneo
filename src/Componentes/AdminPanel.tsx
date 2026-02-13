/**
 * AdminPanel
 * 
 * Panel de administración para gestionar usuarios, torneos y equipos.
 * - Permite cambiar entre pestañas: Usuarios, Torneos y Equipos.
 * - Muestra tablas con información y botones para editar/eliminar cada entidad.
 * - Permite crear nuevos usuarios y torneos.
 * - En torneos, el botón "Ver detalles" lleva al bracket del torneo.
 * - En equipos, el enlace lleva al torneo y el botón permite editar/eliminar el equipo.
 */

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import type { User } from "../types/user";
import type { Tournament } from "../types/tournament";
import type { Team } from "../types/team";

const TABS = ["Usuarios", "Torneos", "Equipos"] as const;
type Tab = typeof TABS[number];

interface Props {
  tab: Tab;
  setTab: (tab: Tab) => void;
  users: User[];
  tournaments: Tournament[];
  teams: Team[];
  onDeleteUser: (id: number | string) => void;
  onDeleteTournament: (id: string) => void;
  onDeleteTeam: (id: string) => void;
}

/**
 * Componente principal del panel de administración.
 */
const AdminPanel: React.FC<Props> = ({
  tab,
  setTab,
  users,
  tournaments,
  teams,
  onDeleteUser,
  onDeleteTournament,
  onDeleteTeam,
}) => {
  const navigate = useNavigate();

  // Render principal con pestañas y tablas según la entidad seleccionada
  return (
    <div className="max-w-6xl mx-auto mt-10 bg-white rounded-xl shadow p-8">
      {/* Botones de pestañas */}
      <div className="flex gap-4 mb-6">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded font-semibold ${
              tab === t ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tabla de usuarios */}
      {tab === "Usuarios" && (
        <section>
          <h2 className="text-xl font-bold mb-4">Usuarios</h2>
          <table className="w-full mb-4">
            <thead>
              <tr>
                <th className="text-left">ID</th>
                <th className="text-left">Nombre</th>
                <th className="text-left">Email</th>
                <th className="text-left">Rol</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>
                    {/* Botón para editar usuario */}
                    <button
                      className="text-blue-600 mr-2"
                      onClick={() => navigate(`/admin/edit-user/${u.id}`)}
                    >
                      Editar
                    </button>
                    {/* Botón para eliminar usuario */}
                    <button className="text-red-600" onClick={() => onDeleteUser(u.id)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Botón para crear usuario */}
          <button
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={() => navigate("/admin/crear-usuario")}
          >
            Crear usuario
          </button>
        </section>
      )}

      {/* Tabla de torneos */}
      {tab === "Torneos" && (
        <section>
          <h2 className="text-xl font-bold mb-4">Torneos</h2>
          <table className="w-full mb-4">
            <thead>
              <tr>
                <th className="text-left">ID</th>
                <th className="text-left">Nombre</th>
                <th className="text-left">Deporte</th>
                <th className="text-left">Estado</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {tournaments.map((t) => (
                <tr key={t.id}>
                  <td>{t.id}</td>
                  <td>{t.name}</td>
                  <td>{t.sport}</td>
                  <td>{t.status}</td>
                  <td>
                    {/* Botón para ver bracket del torneo */}
                    <button
                      className="text-blue-600 mr-2"
                      onClick={() => navigate(`/tournamentBracket/${t.id}`)}
                    >
                      Ver detalles
                    </button>
                    {/* Botón para eliminar torneo */}
                    <button className="text-red-600" onClick={() => onDeleteTournament(t.id)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Botón para crear torneo */}
          <button className="bg-green-600 text-white px-4 py-2 rounded">Crear torneo</button>
        </section>
      )}

      {/* Tabla de equipos */}
      {tab === "Equipos" && (
        <section>
          <h2 className="text-xl font-bold mb-4">Equipos</h2>
          <table className="w-full mb-4">
            <thead>
              <tr>
                <th className="text-left">ID</th>
                <th className="text-left">Nombre</th>
                <th className="text-left">Torneo</th>
                <th className="text-left">Capitán</th>
                <th className="text-left">Jugadores</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {teams.map((team) => (
                <tr key={team.id}>
                  <td>{team.id}</td>
                  <td>{team.name}</td>
                  <td>
                    {/* Enlace para ver torneo */}
                    <Link
                      to={`/tournament/${team.tournamentId}`}
                      className="text-blue-600 underline hover:text-blue-800"
                    >
                      {team.tournamentId}
                    </Link>
                  </td>
                  <td>{team.captainId}</td>
                  <td>{team.players.join(", ")}</td>
                  <td>
                    {/* Botón para editar equipo */}
                    <button
                      className="text-blue-600 mr-2"
                      onClick={() => navigate(`/admin/edit-team/${team.id}`)}
                    >
                      Editar
                    </button>
                    {/* Botón para eliminar equipo */}
                    <button
                      className="text-red-600"
                      onClick={() => onDeleteTeam(team.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
};

export default AdminPanel;