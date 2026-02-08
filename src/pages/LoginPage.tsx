import Navegacion from "../Componentes/Navegacion";
import { Link } from "react-router-dom";
import LoginForm from "../Componentes/LoginForm";

export default function LoginPage() {
  return (
    <>
      <Navegacion showLinks={false}/>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md">
          <h1 className="text-3xl font-bold text-center text-blue-700 mb-2">
            Bienvenido
          </h1>
          <p className="text-center text-gray-500 mb-8">
            Inicia sesión para continuar
          </p>
          <LoginForm />
          <p className="mt-4 text-center text-sm text-gray-600">
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="text-blue-500 hover:underline">
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}