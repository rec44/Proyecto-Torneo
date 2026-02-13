/**
 * CreateUserPage
 * 
 * Página para crear un nuevo usuario desde el panel de administración.
 * - Muestra el formulario de registro con campo de rol.
 * - Al crear, muestra confirmación y redirige al panel de admin.
 */
import Navegacion from "../../Componentes/Navegacion";
import RegisterForm from "../../Componentes/LoginComponentes/RegisterForm";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function CreateUserPage() {
  const navigate = useNavigate();

  // Muestra confirmación y redirige tras crear usuario
  const handleSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Usuario creado correctamente",
      timer: 1500,
      showConfirmButton: false,
    }).then(() => navigate("/admin"));
  };

  // Render principal
  return (
    <>
      <Navegacion />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md">
          <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">Crear usuario</h1>
          <RegisterForm
            showRoleField
            submitLabel="Crear usuario"
            onSuccess={handleSuccess}
          />
        </div>
      </div>
    </>
  );
}