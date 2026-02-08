import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import TournamentDetail from "../pages/TournamentDetail";
import CreateTournamentPage from "../pages/createTournamentPage";
import HomePage from "../pages/HomePage"; 
import { ProtectedRoute } from "./ProtectedRoute";
import MyTournamentsPage from "../pages/MyTournamentsPage";
import MyProfilePage from "../pages/MyProfilePage";
import InscripcionEquipoPage from "../pages/InscripcionEquipoPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/tournament/:id" element={<TournamentDetail />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/create" element={<CreateTournamentPage />} />
        <Route path="/MyTournaments/:id" element={<MyTournamentsPage />} />
        <Route path="/MyProfile" element={<MyProfilePage />} />
        <Route path="/inscribir/:id" element={<InscripcionEquipoPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}