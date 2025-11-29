'use client';

import React, { useState } from 'react';
import { Briefcase, Calendar, Building2, Filter } from 'lucide-react';

export interface Postulacion {
  id: string;
  puesto: string;
  empresa: string;
  estado: 'pendiente' | 'entrevista' | 'rechazado' | 'aceptado';
  fecha: string;
  logo?: string;
}

interface MisPostulacionesProps {
  postulaciones: Postulacion[];
}

export const MisPostulaciones: React.FC<MisPostulacionesProps> = ({ postulaciones }) => {
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');

  const estadoConfig = {
    pendiente: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-700' },
    entrevista: { label: 'Entrevista', color: 'bg-blue-100 text-blue-700' },
    rechazado: { label: 'Rechazado', color: 'bg-red-100 text-red-700' },
    aceptado: { label: 'Aceptado', color: 'bg-green-100 text-green-700' },
  };

  const postulacionesFiltradas = postulaciones.filter((p) =>
    filtroEstado === 'todos' || p.estado === filtroEstado
  );

  return (
    <div className="bg-white rounded-xl border border-neutral-200 h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-neutral-200">
        <h2 className="text-lg font-bold text-neutral-900 mb-3">Mis Postulaciones</h2>

        {/* Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none text-sm"
          >
            <option value="todos">Todos</option>
            <option value="pendiente">Pendiente</option>
            <option value="entrevista">Entrevista</option>
            <option value="rechazado">Rechazado</option>
            <option value="aceptado">Aceptado</option>
          </select>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {postulacionesFiltradas.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-neutral-600">No hay postulaciones</p>
          </div>
        ) : (
          postulacionesFiltradas.map((postulacion) => (
            <div
              key={postulacion.id}
              className="p-4 border border-neutral-200 rounded-lg hover:shadow-md transition-all duration-300 cursor-pointer hover:border-neutral-400"
            >
              <div className="flex items-start gap-3">
                {/* Logo */}
                <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-5 h-5 text-neutral-600" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-neutral-900 truncate">
                    {postulacion.puesto}
                  </h3>
                  <p className="text-xs text-neutral-600 mt-1 flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    {postulacion.empresa}
                  </p>
                  <p className="text-xs text-neutral-500 mt-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(postulacion.fecha).toLocaleDateString('es-ES')}
                  </p>
                  <span
                    className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium ${estadoConfig[postulacion.estado].color}`}
                  >
                    {estadoConfig[postulacion.estado].label}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
