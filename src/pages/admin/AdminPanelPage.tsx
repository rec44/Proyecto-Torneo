/**
 * AdminPanelPage
 * 
 * Página principal del panel de administración.
 * - Permite cambiar entre pestañas: Usuarios, Torneos y Equipos.
 * - Carga y gestiona la lista de usuarios, torneos y equipos.
 * - Permite eliminar usuarios, torneos y equipos.
 */
import { useEffect, useState } from "react";
import Navegacion from "../../Componentes/Navegacion";
import AdminPanel from "../../Componentes/AdminPanel";
import { userService } from "../../services/userServices";
import { tournamentService } from "../../services/tournamentService";
import { teamService } from "../../services/teamService";
import type { User } from "../../types/user";
import type { Tournament } from "../../types/tournament";
import type { Team } from "../../types/team";

const TABS = ["Usuarios", "Torneos", "Equipos"] as const;
type Tab = typeof TABS[number];

export default function AdminPanelPage() {
  const [tab, setTab] = useState<Tab>("Usuarios");
  const [users, setUsers] = useState<User[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);

  // Al montar, carga usuarios, torneos y equipos
  useEffect(() => {
    userService.getAll().then(setUsers);
    tournamentService.getAll().then(setTournaments);
    teamService.getAll().then(setTeams);
  }, []);

  // Elimina usuario y actualiza estado
  const handleDeleteUser = async (id: number | string) => {
    await userService.delete(id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  // Elimina torneo y actualiza estado
  const handleDeleteTournament = async (id: string) => {
    await tournamentService.delete(id);
    setTournaments((prev) => prev.filter((t) => t.id !== id));
  };

  // Elimina equipo y actualiza estado
  const handleDeleteTeam = async (id: string) => {
    await teamService.delete(id);
    setTeams((prev) => prev.filter((t) => t.id !== id));
  };

  // Render principal
  return (
    <>
      <Navegacion />
      <AdminPanel
        tab={tab}
        setTab={setTab}
        users={users}
        tournaments={tournaments}
        teams={teams}
        onDeleteUser={handleDeleteUser}
        onDeleteTournament={handleDeleteTournament}
        onDeleteTeam={handleDeleteTeam}
      />
    </>
  );
}