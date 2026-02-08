import React from "react";
import type { Tournament } from "../types/tournament";
import TournamentCard from "./TournamentCard";

interface TournamentListProps {
  tournaments: Tournament[];
}

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