'use client';

import React, { useState } from 'react';
import { MapPin, DollarSign, Briefcase, Search, Filter } from 'lucide-react';

export interface Vacante {
  id: string;
  titulo: string;
  empresa: string;
  modalidad: 'remoto' | 'hibrido' | 'presencial' | null;
  ubicacion: string;
  salario: string;
  categoria: string;
  descripcion: string;
}

interface PropuestasTrabajoProps {
  vacantes: Vacante[];
}

export const PropuestasTrabajo: React.FC<PropuestasTrabajoProps> = ({ vacantes }) => {
  const [busqueda, setBusqueda] = useState('');
  const [filtroModalidad, setFiltroModalidad] = useState<string>('todos');

  const modalidadConfig: Record<string, { label: string; color: string }> = {
    remoto: { label: 'Remoto', color: 'bg-green-100 text-green-700' },
    hibrido: { label: 'Híbrido', color: 'bg-blue-100 text-blue-700' },
    presencial: { label: 'Presencial', color: 'bg-purple-100 text-purple-700' },
  };

  const getModalidadConfig = (modalidad: string | null) => {
    if (!modalidad) {
      return { label: 'No especificada', color: 'bg-gray-100 text-gray-700' };
    }
    return modalidadConfig[modalidad] || { label: 'No especificada', color: 'bg-gray-100 text-gray-700' };
  };

  const vacantesFiltradas = vacantes.filter((v) => {
    const matchesBusqueda =
      v.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      v.empresa.toLowerCase().includes(busqueda.toLowerCase()) ||
      v.categoria.toLowerCase().includes(busqueda.toLowerCase());
    const matchesModalidad = filtroModalidad === 'todos' || v.modalidad === filtroModalidad;
    return matchesBusqueda && matchesModalidad;
  });

  return (
    <div className="bg-white rounded-xl border border-neutral-200 h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-neutral-200">
        <h2 className="text-lg font-bold text-neutral-900 mb-3">Propuestas de Trabajo</h2>

        {/* Filters */}
        <div className="space-y-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Buscar por puesto, empresa, categoría..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none text-sm"
            />
          </div>

          {/* Modalidad Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <select
              value={filtroModalidad}
              onChange={(e) => setFiltroModalidad(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none text-sm"
            >
              <option value="todos">Todas las modalidades</option>
              <option value="remoto">Remoto</option>
              <option value="hibrido">Híbrido</option>
              <option value="presencial">Presencial</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {vacantesFiltradas.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-neutral-600">No se encontraron vacantes</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {vacantesFiltradas.map((vacante) => (
              <div
                key={vacante.id}
                className="p-4 border border-neutral-200 rounded-lg hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-neutral-400"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-base text-neutral-900">{vacante.titulo}</h3>
                    <p className="text-sm text-neutral-600 mt-1">{vacante.empresa}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getModalidadConfig(vacante.modalidad).color}`}
                  >
                    {getModalidadConfig(vacante.modalidad).label}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-2 mb-3">
                  <p className="text-xs text-neutral-600 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {vacante.ubicacion}
                  </p>
                  <p className="text-xs text-neutral-600 flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    {vacante.salario}
                  </p>
                  <p className="text-xs text-neutral-600 flex items-center gap-1">
                    <Briefcase className="w-3 h-3" />
                    {vacante.categoria}
                  </p>
                </div>

                {/* Description */}
                <p className="text-xs text-neutral-700 line-clamp-2 mb-3">
                  {vacante.descripcion}
                </p>

                {/* Action */}
                <button className="w-full px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-sm font-medium transition-colors">
                  Postularme
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
