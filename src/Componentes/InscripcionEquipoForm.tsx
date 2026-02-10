import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { teamService } from "../services/teamService";
import type { Tournament } from "../types/tournament";
import type { Team } from "../types/team";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

interface Props {
  tournament: Tournament;
  onSuccess?: () => void;
  team?: Team;
  submitLabel?: string;
  mode?: "create" | "edit";
}

export default function InscripcionEquipoForm({
  tournament,
  onSuccess,
  team,
  submitLabel,
  mode = "create",
}: Props) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [teamName, setTeamName] = useState("");
  const [players, setPlayers] = useState<string[]>([""]);
  const [error, setError] = useState<string | null>(null);
  const max = tournament.maxPlayersPerTeam;
  const min = tournament.minPlayersPerTeam;

  const isEdit = mode === "edit" || Boolean(team);

  useEffect(() => {
    if (team) {
      setTeamName(team.name);
      setPlayers(team.players.length ? team.players : [""]);
    }
  }, [team]);

  const finalSubmitLabel = submitLabel ?? (isEdit ? "Guardar cambios" : "Inscribir equipo");

  const handlePlayerChange = (idx: number, value: string) => {
    const updated = [...players];
    updated[idx] = value;
    setPlayers(updated);
  };

  const addPlayer = () => {
    if (players.length < max) setPlayers([...players, ""]);
  };

  const removePlayer = (idx: number) => {
    if (players.length > min) setPlayers(players.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const cleanPlayers = players.map(p => p.trim()).filter(Boolean);

    if (!teamName.trim()) {
      setError("El nombre del equipo es obligatorio.");
      return;
    }
    if (cleanPlayers.length < min) {
      setError(`Debes añadir al menos ${min} jugadores.`);
      return;
    }
    if (cleanPlayers.length > max) {
      setError(`No puedes añadir más de ${max} jugadores.`);
      return;
    }

    try {
      if (isEdit && team) {
        await teamService.update(team.id, {
          name: teamName.trim(),
          players: cleanPlayers,
          tournamentId: team.tournamentId, // Mantiene el torneo
          captainId: team.captainId,       // Mantiene el capitán
        });
        await Swal.fire({
          icon: "success",
          title: "Equipo actualizado",
          timer: 1500,
          showConfirmButton: false,
        });
        onSuccess?.();
      } else {
        await teamService.create({
          name: teamName.trim(),
          tournamentId: tournament.id,
          captainId: user!.id,
          players: cleanPlayers,
        });
        await Swal.fire({
          icon: "success",
          title: "¡Equipo inscrito correctamente!",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate(`/MyTournaments/${user!.id}`);
        onSuccess?.();
      }
    } catch {
      setError(isEdit ? "Error al actualizar el equipo." : "Error al inscribir el equipo.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-blue-50 p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-2">Inscribir equipo</h2>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <div>
        <label className="block font-medium mb-1">Nombre del equipo</label>
        <input
          type="text"
          value={teamName}
          onChange={e => setTeamName(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="block font-medium mb-1">
          Jugadores ({players.length}/{max})
        </label>
        {players.map((player, idx) => (
          <div key={idx} className="flex items-center gap-2 mb-2">
            <input
              type="text"
              value={player}
              onChange={e => handlePlayerChange(idx, e.target.value)}
              className="flex-1 border rounded px-3 py-2"
              placeholder={`Jugador ${idx + 1}`}
            />
            {players.length > min && (
              <button
                type="button"
                onClick={() => removePlayer(idx)}
                className="text-red-500 font-bold px-2"
                title="Eliminar jugador"
              >
                ×
              </button>
            )}
          </div>
        ))}
        {players.length < max && (
          <button
            type="button"
            onClick={addPlayer}
            className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
          >
            Añadir jugador
          </button>
        )}
      </div>
      <button
        type="submit"
        className={`w-full ${isEdit ? "bg-yellow-600 hover:bg-yellow-700" : "bg-green-600 hover:bg-green-700"} text-white font-semibold py-2 rounded`}
      >
        {finalSubmitLabel}
      </button>
    </form>
  );
}