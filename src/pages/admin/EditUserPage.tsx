/**
 * EditUserPage
 * 
 * Página para editar un usuario existente desde el panel de administración.
 * - Carga los datos del usuario por ID.
 * - Muestra el formulario de registro en modo edición.
 */
import Navegacion from "../../Componentes/Navegacion";
import RegisterForm from "../../Componentes/LoginComponentes/RegisterForm";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { userService } from "../../services/userServices";
import type { RegisterFormValues } from "../../Componentes/LoginComponentes/RegisterForm";

export default function EditUserPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState<RegisterFormValues | null>(null);

  // Al montar, carga los datos del usuario a editar
  useEffect(() => {
    userService.getById(id).then(u => {
      if (u) {
        setUser({
          name: u.name,
          email: u.email,
          password: u.password,
          confirm: u.password,
          role: u.role,
        });
      }
    });
  }, [id]);

  // Muestra confirmación y redirige tras editar
  const handleSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Usuario actualizado correctamente",
      timer: 1500,
      showConfirmButton: false,
    }).then(() => navigate("/admin"));
  };

  // Maneja el envío del formulario de edición
  const handleEdit = async (data: RegisterFormValues) => {
    if (!id) return;
    await userService.update(id, {
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
    });
    handleSuccess();
  };

  if (!user) return <div>Cargando usuario...</div>;

  // Render principal
  return (
    <>
      <Navegacion />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md">
          <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">Editar usuario</h1>
          <RegisterForm
            showRoleField
            submitLabel="Guardar cambios"
            initialValues={user}
            onSubmitForm={handleEdit}
          />
        </div>
      </div>
    </>
  );
}