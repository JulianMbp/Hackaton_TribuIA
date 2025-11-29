'use client';

import React, { useState } from 'react';
import { Briefcase, Calendar, Building2, Filter, ExternalLink, CheckCircle2, Video, Sparkles, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';

export interface Postulacion {
  id: string;
  puesto: string;
  empresa: string;
  estado: 'pendiente' | 'entrevista' | 'rechazado' | 'aceptado';
  fecha: string;
  logo?: string;
  microFrontendUrl?: string;
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
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      icon: <Clock className="w-4 h-4" />,
    },
    entrevista: {
      label: 'Entrevista',
      color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
      borderColor: 'border-blue-200 dark:border-blue-800',
      icon: <Video className="w-4 h-4" />,
    },
    rechazado: {
      label: 'Rechazado',
      color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
      borderColor: 'border-red-200 dark:border-red-800',
      icon: <span className="text-lg">✕</span>,
    },
    aceptado: {
      label: 'Aprobado',
      color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
      borderColor: 'border-green-200 dark:border-green-800',
      icon: <CheckCircle2 className="w-4 h-4" />,
    },
  };

  const handleAccederMicroFrontend = (postulacion: Postulacion) => {
    const microFrontendUrl = postulacion.microFrontendUrl ||
                             process.env.NEXT_PUBLIC_MICRO_FRONTEND_URL ||
                             '/candidato-aprobado';

    const url = `${microFrontendUrl}?postulacion=${postulacion.id}&puesto=${encodeURIComponent(postulacion.puesto)}&empresa=${encodeURIComponent(postulacion.empresa)}`;
    window.location.href = url;
  };

  const handleIniciarEntrevista = (postulacion: Postulacion) => {
    // Aquí se redirige a la página de entrevista con IA
    router.push(`/entrevista-ia?postulacion=${postulacion.id}&puesto=${encodeURIComponent(postulacion.puesto)}&empresa=${encodeURIComponent(postulacion.empresa)}`);
  };

  const postulacionesFiltradas = postulaciones.filter((p) =>
    filtroEstado === 'todos' || p.estado === filtroEstado
  );

  const candidatosAceptados = postulaciones.filter(p => p.estado === 'aceptado').length;

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 h-full flex flex-col transition-colors duration-300 shadow-sm hover:shadow-md dark:hover:shadow-neutral-800/50">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-neutral-200 dark:border-neutral-800 bg-gradient-to-r from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-800/50 rounded-t-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white transition-colors duration-300">
              Mis Postulaciones
            </h2>
          </div>
          {candidatosAceptados > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-lg">
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span className="text-white text-xs font-bold">
                {candidatosAceptados} aprobado{candidatosAceptados > 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>

        {/* Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-neutral-500" />
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent outline-none text-sm transition-all duration-300 hover:border-neutral-400 dark:hover:border-neutral-600"
          >
            <option value="todos">Todas las postulaciones</option>
            <option value="pendiente">⏳ Pendientes</option>
            <option value="entrevista">🎥 En entrevista</option>
            <option value="aceptado">✅ Aprobadas</option>
            <option value="rechazado">❌ Rechazadas</option>
          </select>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {postulacionesFiltradas.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-neutral-400 dark:text-neutral-600" />
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 transition-colors duration-300">
              No hay postulaciones para mostrar
            </p>
          </div>
        ) : (
          postulacionesFiltradas.map((postulacion) => (
            <div
              key={postulacion.id}
              className={`group relative p-4 border-2 rounded-xl transition-all duration-300 hover:shadow-lg dark:hover:shadow-neutral-900/50 ${
                postulacion.estado === 'aceptado'
                  ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800 hover:border-green-300 dark:hover:border-green-700'
                  : 'bg-white dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
              }`}
            >
              {/* Aprobado Badge */}
              {postulacion.estado === 'aceptado' && (
                <div className="absolute top-2 right-2">
                  <div className="flex items-center gap-1 px-2 py-1 bg-green-500 dark:bg-green-600 rounded-full shadow-md">
                    <Sparkles className="w-3 h-3 text-white animate-pulse" />
                    <span className="text-[10px] font-bold text-white">APROBADO</span>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                {/* Logo */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 ${
                  postulacion.estado === 'aceptado'
                    ? 'bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg'
                    : 'bg-neutral-100 dark:bg-neutral-700'
                }`}>
                  <Building2 className={`w-6 h-6 ${
                    postulacion.estado === 'aceptado'
                      ? 'text-white'
                      : 'text-neutral-600 dark:text-neutral-400'
                  }`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base text-neutral-900 dark:text-white truncate transition-colors duration-300 mb-1">
                    {postulacion.puesto}
                  </h3>
                  <div className="space-y-1 mb-3">
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 flex items-center gap-1.5 transition-colors duration-300">
                      <Building2 className="w-3.5 h-3.5" />
                      {postulacion.empresa}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-500 flex items-center gap-1.5 transition-colors duration-300">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(postulacion.fecha).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>

                  {/* Estado y Acciones */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${estadoConfig[postulacion.estado].color} ${estadoConfig[postulacion.estado].borderColor} border`}
                    >
                      {estadoConfig[postulacion.estado].icon}
                      {estadoConfig[postulacion.estado].label}
                    </span>

                    {/* Botones para candidatos aprobados */}
                    {postulacion.estado === 'aceptado' && (
                      <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                        <button
                          onClick={() => handleIniciarEntrevista(postulacion)}
                          className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg text-xs font-bold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl group"
                        >
                          <Sparkles className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
                          Entrevista IA
                        </button>
                        <button
                          onClick={() => handleAccederMicroFrontend(postulacion)}
                          className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 text-white rounded-lg text-xs font-bold transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Portal
                        </button>
                      </div>
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
