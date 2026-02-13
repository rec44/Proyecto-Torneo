/**
 * TournamentForm
 * 
 * Formulario para crear o editar un torneo.
 * - Valida todos los campos relevantes (nombre, deporte, fechas, equipos, jugadores, localización, etc.).
 * - Permite seleccionar comunidad y provincia dinámicamente.
 * - Permite establecer mínimo y máximo de equipos y jugadores por equipo.
 * - Llama a la función onSubmit con los datos validados.
 * - Muestra errores de validación en tiempo real.
 */

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import type { Tournament } from "../../types/tournament";
import { locationService } from "../../services/locationServices";
import type { Comunidad, Provincia } from "../../types/location";

type FormValues = Omit<
  Tournament,
  "id" | "currentTeams" | "createdAt" | "participants" | "ownerId"
> & {
  description?: string;
};

// Esquema de validación para el formulario de torneo
const schema: yup.ObjectSchema<FormValues> = yup.object({
  name: yup.string().required("El nombre es obligatorio"),
  sport: yup.string().required("El deporte es obligatorio"),
  category: yup.string().required("El nivel es obligatorio"),
  maxTeams: yup
    .number()
    .min(2, "Mínimo 2 equipos")
    .required("El número máximo de equipos es obligatorio"),
  minTeams: yup
    .number()
    .min(2, "Mínimo 2 equipos")
    .required("El número mínimo de equipos es obligatorio"),
  maxPlayersPerTeam: yup
    .number()
    .min(1, "Mínimo 1 jugador")
    .required("El número máximo de jugadores por equipo es obligatorio"),
  minPlayersPerTeam: yup
    .number()
    .min(1, "Mínimo 1 jugador")
    .required("El número mínimo de jugadores por equipo es obligatorio"),
  startDate: yup.string().required("La fecha de inicio es obligatoria"),
  endDate: yup.string().required("La fecha de fin es obligatoria"),
  community: yup.string().required("La comunidad es obligatoria"),
  province: yup.string().required("La provincia es obligatoria"),
  city: yup.string().required("La ciudad es obligatoria"),
  venue: yup.string().required("La calle es obligatoria"),
  description: yup.string().optional(),
  status: yup.mixed<"open" | "closed" | "finished">().required(),
});

const defaultValues: FormValues = {
  name: "",
  sport: "",
  category: "",
  maxTeams: 2,
  maxPlayersPerTeam: 1,
  minPlayersPerTeam: 1,
  startDate: "",
  endDate: "",
  community: "",
  province: "",
  city: "",
  venue: "",
  description: "",
  status: "open",
  minTeams: 2,
};

interface Props {
  onSubmit: (data: FormValues) => void;
  initialValues?: FormValues;
  submitLabel?: string;
}

/**
 * Componente principal del formulario de torneo.
 */
const TournamentForm: React.FC<Props> = ({ onSubmit, initialValues, submitLabel = "Crear torneo" }) => {
  // Hook de formulario con validación y valores por defecto
  const {
    register,
    handleSubmit,
    watch,
    reset,
    resetField,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues,
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  // Estado para comunidades y provincias
  const [comunidades, setComunidades] = useState<Comunidad[]>([]);
  const [provincias, setProvincias] = useState<Provincia[]>([]);

  // Comunidad seleccionada para cargar provincias
  const selectedCommunity = watch("community");

  // Carga las comunidades al montar el componente
  useEffect(() => {
    locationService.getComunidades().then(setComunidades);
  }, []);

  // Carga las provincias cuando cambia la comunidad seleccionada
  useEffect(() => {
    if (selectedCommunity) {
      locationService
        .getProvinciasByComunidad(selectedCommunity)
        .then(setProvincias);
    } else {
      setProvincias([]);
    }
    resetField("province");
    resetField("city");
  }, [selectedCommunity, resetField]);

  // Si hay valores iniciales (modo edición), los carga en el formulario
  useEffect(() => {
    if (initialValues) reset(initialValues);
  }, [initialValues, reset]);

  /**
   * Devuelve la clase CSS del input según si hay error o está rellenado.
   */
  const getInputClass = (field: keyof FormValues) => {
    if (errors[field]) return "border-red-500";
    if (watch(field) && !errors[field]) return "border-green-500";
    return "border-gray-300";
  };

  // Render principal del formulario
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Campo nombre */}
      <div>
        <label className="block font-medium">Nombre</label>
        <input
          {...register("name")}
          className={`w-full rounded px-3 py-2 border ${getInputClass("name")}`}
        />
        <span className="text-red-500 text-sm">{errors.name?.message}</span>
      </div>

      {/* Campo deporte */}
      <div>
        <label className="block font-medium">Deporte</label>
        <select
          {...register("sport")}
          className={`w-full rounded px-3 py-2 border ${getInputClass("sport")}`}
        >
          <option value="">Selecciona un deporte</option>
          <option value="Fútbol">Fútbol</option>
          <option value="Baloncesto">Baloncesto</option>
          <option value="Voleibol">Voleibol</option>
        </select>
        <span className="text-red-500 text-sm">{errors.sport?.message}</span>
      </div>

      {/* Campos de equipos y jugadores */}
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block font-medium">Mín. equipos</label>
          <input
            type="number"
            {...register("minTeams", { valueAsNumber: true })}
            className={`w-full rounded px-3 py-2 border ${getInputClass("minTeams")}`}
            min={2}
            max={watch("maxTeams") || undefined}
          />
          <span className="text-red-500 text-sm">
            {errors.minTeams?.message}
          </span>
        </div>
        <div className="flex-1">
          <label className="block font-medium">Máx. equipos</label>
          <input
            type="number"
            {...register("maxTeams", { valueAsNumber: true })}
            className={`w-full rounded px-3 py-2 border ${getInputClass("maxTeams")}`}
            min={2}
          />
          <span className="text-red-500 text-sm">
            {errors.maxTeams?.message}
          </span>
        </div>
        <div className="flex-1">
          <label className="block font-medium">Mín. jugadores/equipo</label>
          <input
            type="number"
            {...register("minPlayersPerTeam", { valueAsNumber: true })}
            className={`w-full rounded px-3 py-2 border ${getInputClass("minPlayersPerTeam")}`}
            min={1}
          />
          <span className="text-red-500 text-sm">
            {errors.minPlayersPerTeam?.message}
          </span>
        </div>
         <div className="flex-1">
          <label className="block font-medium">Máx. jugadores/equipo</label>
          <input
            type="number"
            {...register("maxPlayersPerTeam", { valueAsNumber: true })}
            className={`w-full rounded px-3 py-2 border ${getInputClass("maxPlayersPerTeam")}`}
            min={1}
          />
          <span className="text-red-500 text-sm">
            {errors.maxPlayersPerTeam?.message}
          </span>
        </div>
      </div>

      {/* Fechas */}
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block font-medium">Fecha inicio</label>
          <input
            type="date"
            {...register("startDate")}
            min={new Date().toISOString().split("T")[0]}
            className={`w-full border rounded px-3 py-2 ${getInputClass("startDate")}`}
          />
          <span className="text-red-500 text-sm">
            {errors.startDate?.message}
          </span>
        </div>
        <div className="flex-1">
          <label className="block font-medium">Fecha fin</label>
          <input
            type="date"
            {...register("endDate")}
            min={watch("startDate") || new Date().toISOString().split("T")[0]}
            className={`w-full border rounded px-3 py-2 ${getInputClass("endDate")}`}
          />
          <span className="text-red-500 text-sm">
            {errors.endDate?.message}
          </span>
        </div>
      </div>

      {/* Comunidad y provincia */}
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block font-medium">Comunidad</label>
          <select
            {...register("community")}
            className={`w-full border rounded px-3 py-2 ${getInputClass("community")}`}
          >
            <option value="">Selecciona una comunidad</option>
            {comunidades.map((c) => (
              <option key={c.codigo} value={c.codigo}>
                {c.nombre}
              </option>
            ))}
          </select>
          <span className="text-red-500 text-sm">
            {errors.community?.message}
          </span>
        </div>

        <div className="flex-1">
          <label className="block font-medium">Provincia</label>
          <select
            {...register("province")}
            disabled={!selectedCommunity}
            className={`w-full border rounded px-3 py-2 ${!selectedCommunity ? "bg-gray-200 text-gray-500 cursor-not-allowed" : ""}`}
          >
            <option value="">Selecciona una provincia</option>
            {provincias.map((p) => (
              <option key={p.codigo} value={p.nombre}>
                {p.nombre}
              </option>
            ))}
          </select>
          <span className="text-red-500 text-sm">
            {errors.province?.message}
          </span>
        </div>
      </div>

      {/* Ciudad */}
      <div>
        <label className="block font-medium">Ciudad</label>
        <input
          {...register("city")}
          className={`w-full border rounded px-3 py-2 ${getInputClass("city")}`}
        />
        <span className="text-red-500 text-sm">{errors.city?.message}</span>
      </div>

      {/* Calle */}
      <div>
        <label className="block font-medium">Calle</label>
        <input
          {...register("venue")}
          className={`w-full border rounded px-3 py-2 ${getInputClass("venue")}`}
        />
        <span className="text-red-500 text-sm">{errors.venue?.message}</span>
      </div>

      {/* Descripción */}
      <div>
        <label className="block font-medium">Descripción</label>
        <textarea
          {...register("description")}
          className={`w-full border rounded px-3 py-2 ${getInputClass("description")}`}
        />
      </div>

      {/* Nivel */}
      <div>
        <label className="block font-medium">Nivel de jugadores:</label>
        <select
          {...register("category")}
          className={`w-full border rounded px-3 py-2 ${getInputClass("category")}`}
        >
          <option value="">Selecciona un nivel</option>
          <option value="alto">Alto</option>
          <option value="medio">Medio</option>
          <option value="bajo">Bajo</option>
        </select>
        <span className="text-red-500 text-sm">{errors.category?.message}</span>
      </div>

      {/* Botón de envío */}
      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded"
      >
        {submitLabel}
      </button>
    </form>
  );
};

export default TournamentForm;
