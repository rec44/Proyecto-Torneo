import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import TournamentDetail from "../pages/TournamentDetail";
import CreateTournamentPage from "../pages/CreateTournamentPage";
import HomePage from "../pages/HomePage"; 
import { ProtectedRoute } from "./ProtectedRoute";
import MyTournamentsPage from "../pages/MyTournamentsPage";
import MyProfilePage from "../pages/MyProfilePage";
import InscripcionEquipoPage from "../pages/InscripcionEquipoPage";
import AdminPanelPage from "../pages/admin/AdminPanelPage";
import EditTournamentPage from "../pages/EditTournamentPage";
import CreateUserPage from "../pages/admin/CreateUserPage";
import { AdminRoute } from "./AdminRoute";
import EditUserPage from "../pages/admin/EditUserPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/tournament/:id" element={<TournamentDetail />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/create-tournament" element={<CreateTournamentPage />} />
        <Route path="/MyTournaments/:id" element={<MyTournamentsPage />} />
        <Route path="/MyProfile" element={<MyProfilePage />} />
        <Route path="/inscribir/:id" element={<InscripcionEquipoPage />} />
        <Route path="/edit-tournament/:id" element={<EditTournamentPage />} />

        {/* Rutas solo para admin */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminPanelPage />} />
          <Route path="/admin/create-user" element={<CreateUserPage />} />
          <Route path="/admin/edit-user/:id" element={<EditUserPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}