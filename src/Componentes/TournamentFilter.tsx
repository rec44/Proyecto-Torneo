import React from "react";

interface FilterProps {
  filters: {
    search: string;
    sport: string;
    status: string;
    community: string;
    province: string;
  };
  onFilterChange: (filters: any) => void;
  comunidades?: { codigo: string; nombre: string }[];
  provincias?: { codigo: string; nombre: string }[];
}

const TournamentFilter: React.FC<FilterProps> = ({
  filters,
  onFilterChange,
  comunidades = [],
  provincias = [],
}) => {
  return (
    <div className="flex flex-wrap gap-4 p-4 bg-white rounded-lg shadow mb-6">
      <input
        type="text"
        placeholder="Buscar torneo..."
        value={filters.search}
        onChange={e => onFilterChange({ ...filters, search: e.target.value })}
        className="border rounded px-3 py-2"
      />

      <select
        value={filters.sport}
        onChange={e => onFilterChange({ ...filters, sport: e.target.value })}
        className="border rounded px-3 py-2"
      >
        <option value="">Todos los deportes</option>
        <option value="futbol">Fútbol</option>
        <option value="baloncesto">Baloncesto</option>
        <option value="voleibol">Voleibol</option>
      </select>

      <select
        value={filters.status}
        onChange={e => onFilterChange({ ...filters, status: e.target.value })}
        className="border rounded px-3 py-2"
      >
        <option value="">Todos los estados</option>
        <option value="open">Abierto</option>
        <option value="closed">Cerrado</option>
        <option value="finished">Finalizado</option>
      </select>

      <select
        value={filters.community}
        onChange={e => onFilterChange({ ...filters, community: e.target.value, province: "" })}
        className="border rounded px-3 py-2"
      >
        <option value="">Todas las comunidades</option>
        {comunidades.map(c => (
          <option key={c.codigo} value={c.codigo}>{c.nombre}</option>
        ))}
      </select>

      <select
        value={filters.province}
        onChange={e => onFilterChange({ ...filters, province: e.target.value })}
        className={`border rounded px-3 py-2 transition-colors ${
          !filters.community
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : ""
        }`}
        disabled={!filters.community}
      >
        <option value="">Todas las provincias</option>
        {provincias.map(p => (
          <option key={p.codigo} value={p.nombre}>{p.nombre}</option>
        ))}
      </select>
    </div>
  );
};

export default TournamentFilter;