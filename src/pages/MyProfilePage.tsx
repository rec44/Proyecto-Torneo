import Navegacion from "../Componentes/Navegacion";
import { useAuth } from "../hooks/useAuth";

export default function MyProfilePage() {
  const { user } = useAuth();

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
      </div>
    </>
  );
}
