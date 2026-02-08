import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface LoginFormValues {
  email: string;
  password: string;
}

const schema: yup.ObjectSchema<LoginFormValues> = yup.object({
  email: yup.string().required("El email es obligatorio").email("El email no es válido"),
  password: yup.string().required("La contraseña es obligatoria").min(6, "La contraseña debe tener al menos 6 caracteres"),
});

const LoginForm: React.FC = () => {
  const { login, error, findUserByEmail } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, setError, reset } = useForm<LoginFormValues>({
    resolver: yupResolver(schema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const onSubmit = async (data: LoginFormValues) => {
    const user = await findUserByEmail(data.email);
    if (!user) {
      setError("email", { type: "manual", message: "El email no existe." });
      return;
    }
    if (user.password !== data.password) {
      setError("password", { type: "manual", message: "La contraseña es incorrecta." });
      return;
    }
    const ok = await login(data.email, data.password);
    if (ok) {
      reset();
      navigate("/");
    }
  };

  const globalError = errors.email?.message || errors.password?.message || error;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {globalError && <div className="text-red-500 text-sm mb-2">{globalError}</div>}
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input type="email" {...register("email")} className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Contraseña</label>
        <input type="password" {...register("password")} className="w-full border rounded px-3 py-2" />
      </div>
      <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded">
        Iniciar sesión
      </button>
    </form>
  );
};

export default LoginForm;