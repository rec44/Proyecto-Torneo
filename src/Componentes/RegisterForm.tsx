import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { userService } from "../services/userServices";

export type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
  confirm: string;
  role: "usuario" | "admin";
};

interface RegisterFormProps {
  showRoleField?: boolean;
  defaultRole?: RegisterFormValues["role"];
  submitLabel?: string;
  onSuccess?: () => void;
  initialValues?: RegisterFormValues;
  onSubmitForm?: (data: RegisterFormValues) => Promise<void>;
}

const schema: yup.ObjectSchema<RegisterFormValues> = yup.object({
  name: yup.string().required("El nombre es obligatorio").matches(/^[^\d]+$/, "El nombre no puede contener números"),
  email: yup.string().required("El email es obligatorio").email("El email no es válido"),
  password: yup.string().required("La contraseña es obligatoria").min(6, "La contraseña debe tener al menos 6 caracteres"),
  confirm: yup.string().oneOf([yup.ref("password")], "Las contraseñas no coinciden").required("Repite la contraseña"),
  role: yup.string().oneOf(["usuario", "admin"]).required(),
});

const RegisterForm: React.FC<RegisterFormProps> = ({
  showRoleField = false,
  defaultRole = "usuario",
  submitLabel = "Registrarse",
  onSuccess,
  initialValues,
  onSubmitForm,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    setError,
    reset,
  } = useForm<RegisterFormValues>({
    resolver: yupResolver(schema),
    mode: "onBlur",
    defaultValues: { role: defaultRole },
  });

  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (initialValues) reset(initialValues);
  }, [initialValues, reset]);

  const getInputClass = (field: keyof RegisterFormValues) => {
    if (errors[field]) return "border-red-500";
    if (touchedFields[field] && !errors[field]) return "border-green-500";
    return "border-gray-300";
  };

  const onSubmit = async (data: RegisterFormValues) => {
    setSuccess(null);

    if (onSubmitForm) {
      await onSubmitForm(data);
      if (onSuccess) onSuccess();
      return;
    }

    const existing = await userService.getByEmail(data.email);
    if (existing) {
      setError("email", { type: "manual", message: "Este email ya está registrado" });
      return;
    }

    await userService.create({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
    });

    reset({ name: "", email: "", password: "", confirm: "", role: defaultRole });

    if (onSuccess) onSuccess();
    else setSuccess("¡Registro exitoso!");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Nombre</label>
        <input
          type="text"
          {...register("name")}
          className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${getInputClass("name")}`}
        />
        {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          {...register("email")}
          className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${getInputClass("email")}`}
        />
        {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Contraseña</label>
        <input
          type="password"
          {...register("password")}
          className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${getInputClass("password")}`}
        />
        {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Repetir contraseña</label>
        <input
          type="password"
          {...register("confirm")}
          className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${getInputClass("confirm")}`}
        />
        {errors.confirm && <span className="text-red-500 text-sm">{errors.confirm.message}</span>}
      </div>

      {showRoleField ? (
        <div>
          <label className="block text-sm font-medium mb-1">Rol</label>
          <select
            {...register("role")}
            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${getInputClass("role")}`}
          >
            <option value="usuario">Usuario</option>
            <option value="admin">Administrador</option>
          </select>
          {errors.role && <span className="text-red-500 text-sm">{errors.role.message}</span>}
        </div>
      ) : (
        <input type="hidden" value={defaultRole} {...register("role")} />
      )}

      <button
        type="submit"
        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded transition-colors"
      >
        {submitLabel}
      </button>

      {success && <div className="text-green-600 text-center">{success}</div>}
    </form>
  );
};

export default RegisterForm;