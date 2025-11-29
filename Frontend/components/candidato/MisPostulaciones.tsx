'use client';

import React, { useState } from 'react';
import { Briefcase, Calendar, Building2, Filter, ExternalLink, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export interface Postulacion {
  id: string;
  puesto: string;
  empresa: string;
  estado: 'pendiente' | 'entrevista' | 'rechazado' | 'aceptado';
  fecha: string;
  logo?: string;
  microFrontendUrl?: string; // URL del micro frontend para candidatos aceptados
}

interface MisPostulacionesProps {
  postulaciones: Postulacion[];
}

export const MisPostulaciones: React.FC<MisPostulacionesProps> = ({ postulaciones }) => {
  const router = useRouter();
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');

  const estadoConfig = {
    pendiente: {
      label: 'Pendiente',
      color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
      darkColor: 'dark:bg-yellow-900/30 dark:text-yellow-400'
    },
    entrevista: {
      label: 'Entrevista',
      color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
      darkColor: 'dark:bg-blue-900/30 dark:text-blue-400'
    },
    rechazado: {
      label: 'Rechazado',
      color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
      darkColor: 'dark:bg-red-900/30 dark:text-red-400'
    },
    aceptado: {
      label: 'Aceptado',
      color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
      darkColor: 'dark:bg-green-900/30 dark:text-green-400'
    },
  };

  const handleAccederMicroFrontend = (postulacion: Postulacion) => {
    // URL del micro frontend - puedes configurar esto desde variables de entorno
    const microFrontendUrl = postulacion.microFrontendUrl ||
                             process.env.NEXT_PUBLIC_MICRO_FRONTEND_URL ||
                             '/candidato-aprobado'; // Ruta por defecto

    // Pasar datos del candidato como query params
    const url = `${microFrontendUrl}?postulacion=${postulacion.id}&puesto=${encodeURIComponent(postulacion.puesto)}&empresa=${encodeURIComponent(postulacion.empresa)}`;

    // Abrir en nueva pestaña o redirigir
    window.location.href = url;
    // O si prefieres abrir en nueva pestaña:
    // window.open(url, '_blank');
  };

  const postulacionesFiltradas = postulaciones.filter((p) =>
    filtroEstado === 'todos' || p.estado === filtroEstado
  );

  // Contar candidatos aceptados
  const candidatosAceptados = postulaciones.filter(p => p.estado === 'aceptado').length;

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 h-full flex flex-col transition-colors duration-300">
      {/* Header */}
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white transition-colors duration-300">
            Mis Postulaciones
          </h2>
          {candidatosAceptados > 0 && (
            <span className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-medium transition-colors duration-300">
              <CheckCircle2 className="w-3 h-3" />
              {candidatosAceptados} aprobado{candidatosAceptados > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-neutral-500" />
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-lg focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-500 focus:border-transparent outline-none text-sm transition-colors duration-300"
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
            <p className="text-sm text-neutral-600 dark:text-neutral-400 transition-colors duration-300">
              No hay postulaciones
            </p>
          </div>
        ) : (
          postulacionesFiltradas.map((postulacion) => (
            <div
              key={postulacion.id}
              className="p-4 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800/50 rounded-lg hover:shadow-md dark:hover:shadow-neutral-900/50 transition-all duration-300 hover:border-neutral-400 dark:hover:border-neutral-600"
            >
              <div className="flex items-start gap-3">
                {/* Logo */}
                <div className="w-10 h-10 bg-neutral-100 dark:bg-neutral-700 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-300">
                  <Building2 className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-neutral-900 dark:text-white truncate transition-colors duration-300">
                    {postulacion.puesto}
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 flex items-center gap-1 transition-colors duration-300">
                    <Building2 className="w-3 h-3" />
                    {postulacion.empresa}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1 flex items-center gap-1 transition-colors duration-300">
                    <Calendar className="w-3 h-3" />
                    {new Date(postulacion.fecha).toLocaleDateString('es-ES')}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium transition-colors duration-300 ${estadoConfig[postulacion.estado].color}`}
                    >
                      {estadoConfig[postulacion.estado].label}
                    </span>

                    {/* Botón para candidatos aprobados */}
                    {postulacion.estado === 'aceptado' && (
                      <button
                        onClick={() => handleAccederMicroFrontend(postulacion)}
                        className="flex items-center gap-1 px-3 py-1 bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 text-white rounded-lg text-xs font-medium transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Acceder
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
