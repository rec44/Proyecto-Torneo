/**
 * TournamentCard
 * 
 * Componente visual para mostrar la información básica de un torneo en una tarjeta.
 * - Muestra nombre, deporte, localización, fecha, equipos inscritos, nivel y estado.
 * - El estado se calcula dinámicamente y se muestra con color.
 * - Incluye botón para navegar a la página de detalles del torneo.
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import { getTournamentStatus } from "../../utils/getTournamentStatus";
import { useTeams } from "../../hooks/useTeams";
import type { Tournament } from "../../types/tournament";

interface TournamentCardProps {
  tournament: Tournament;
}

// Mapeo de estados a etiquetas en español
const statusMap: Record<string, string> = {
  open: "Abierto",
  closed: "Cerrado",
  finished: "Finalizado",
  inprogress: "En curso",
};

// Mapeo de estados a colores de fondo y texto
const statusColorMap: Record<string, string> = {
  open: "bg-green-200 text-green-800",
  closed: "bg-red-200 text-red-800",
  finished: "bg-gray-200 text-gray-800",
  inprogress: "bg-blue-200 text-blue-800",
};

/**
 * Formatea una fecha a DD/MM/YYYY.
 */
function formatDate(dateString: string) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Componente principal de la tarjeta de torneo.
 */
const TournamentCard: React.FC<TournamentCardProps> = ({ tournament }) => {
  const { id, name, sport, maxTeams, province, city, startDate, category } = tournament;
  const navigate = useNavigate();
  // Obtiene los equipos inscritos en el torneo
  const { teams } = useTeams(id);
  // Calcula el estado del torneo
  const status = getTournamentStatus(tournament, teams);

  // Render principal de la tarjeta
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow flex flex-col">
      <h2 className="text-xl font-bold mb-2">{name}</h2>
      <p className="text-gray-600 mb-2">
        Deporte: <span className="font-semibold">{sport}</span>
      </p>
      <p className="text-gray-600 mb-2">
        Localización: <span className="font-semibold">{province}, {city}</span>
      </p>
      <p className="text-gray-600 mb-2">
        Fecha de inicio: <span className="font-semibold">{formatDate(startDate)}</span>
      </p>
      <p className="text-gray-600 mb-4">
        Equipos: {teams?.length || 0}/{maxTeams}
      </p>
      <p className="text-gray-600 mb-4">
        Nivel: {category}
      </p>
      <div className="flex justify-between items-center mt-auto">
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColorMap[status] || "bg-gray-200 text-gray-800"}`}
        >
          {statusMap[status] || status}
        </span>
        {/* Botón para ir a la página de detalles del torneo */}
        <button
          onClick={() => navigate(`/tournament/${id}`)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Más información
        </button>
      </div>
    </div>
  );
};

export default TournamentCard;
