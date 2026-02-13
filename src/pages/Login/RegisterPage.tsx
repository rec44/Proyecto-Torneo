/**
 * RegisterPage
 * 
 * Página de registro de usuario.
 * - Renderiza el formulario de registro.
 * - Incluye enlace para ir a la página de inicio de sesión si ya tienes cuenta.
 */


import Navegacion from "../../Componentes/Navegacion";
import { Link } from "react-router-dom";
import RegisterForm from "../../Componentes/LoginComponentes/RegisterForm";

export default function RegisterPage() {
  return (
    <>
      <Navegacion showLinks={false}/>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-xl">
          <h1 className="text-3xl font-bold text-center text-emerald-700 mb-2">
            Crear cuenta
          </h1>
          <p className="text-center text-gray-500 mb-8">
            Únete para gestionar tus torneos
          </p>
          <RegisterForm />
          <p className="mt-4 text-center text-sm text-gray-600">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}