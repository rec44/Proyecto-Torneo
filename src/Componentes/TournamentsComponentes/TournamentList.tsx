/**
 * TournamentList
 * 
 * Muestra una lista de tarjetas de torneos en un grid responsivo.
 * - Recibe un array de torneos y renderiza un TournamentCard por cada uno.
 * - Se utiliza para mostrar la lista principal de torneos en la aplicación.
 */

import React from "react";
import type { Tournament } from "../../types/tournament";
import TournamentCard from "../TournamentsComponentes/TournamentCard";

interface TournamentListProps {
  tournaments: Tournament[];
}

/**
 * Renderiza la lista de torneos como un grid de tarjetas.
 */
const TournamentList: React.FC<TournamentListProps> = ({ tournaments }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {tournaments.map((tournament) => (
        <TournamentCard
          key={tournament.id}
          tournament={tournament}
        />
      ))}
    </div>
  );
};

export default TournamentList;