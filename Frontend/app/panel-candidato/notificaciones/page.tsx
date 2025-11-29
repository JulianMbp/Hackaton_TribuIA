'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Bell,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  Check,
  AlertCircle,
} from 'lucide-react';
import { Card } from '@/components/common/Card';
import { ThemeToggle } from '@/components/common/ThemeToggle';

interface Notificacion {
  id: string;
  tipo: 'exito' | 'rechazo' | 'pendiente' | 'info';
  titulo: string;
  mensaje: string;
  fecha: string;
  leida: boolean;
}

export default function NotificacionesPage() {
  const router = useRouter();
  const [filtro, setFiltro] = useState<string>('todas');

  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([
    {
      id: '1',
      tipo: 'exito',
      titulo: 'Postulación Aceptada',
      mensaje: 'Tu postulación para Frontend Developer en Tech Corp ha sido aceptada. Te contactaremos pronto.',
      fecha: '2025-11-28 10:30',
      leida: false,
    },
    {
      id: '2',
      tipo: 'info',
      titulo: 'Nueva Entrevista Programada',
      mensaje: 'Se ha programado una entrevista para el puesto de React Developer en StartupXYZ para el 30 de noviembre.',
      fecha: '2025-11-27 15:45',
      leida: false,
    },
    {
      id: '3',
      tipo: 'pendiente',
      titulo: 'Postulación en Revisión',
      mensaje: 'Tu postulación para Full Stack Developer está siendo revisada por el equipo de Digital Solutions.',
      fecha: '2025-11-26 09:15',
      leida: true,
    },
    {
      id: '4',
      tipo: 'rechazo',
      titulo: 'Postulación No Seleccionada',
      mensaje: 'Lamentamos informarte que no has sido seleccionado para el puesto de UI Developer en Creative Agency.',
      fecha: '2025-11-25 14:20',
      leida: true,
    },
    {
      id: '5',
      tipo: 'exito',
      titulo: 'Perfil Actualizado',
      mensaje: 'Tu perfil ha sido actualizado exitosamente. Ahora tienes un 85% de completitud.',
      fecha: '2025-11-24 11:00',
      leida: true,
    },
    {
      id: '6',
      tipo: 'info',
      titulo: 'Nueva Vacante Disponible',
      mensaje: 'Hay una nueva vacante que coincide con tu perfil: Senior Frontend Developer en Google.',
      fecha: '2025-11-23 16:30',
      leida: true,
    },
  ]);

  const tipoConfig = {
    exito: {
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-100 dark:bg-green-900/30',
    },
    rechazo: {
      icon: <XCircle className="w-5 h-5" />,
      color: 'text-red-600 dark:text-red-400',
      bg: 'bg-red-100 dark:bg-red-900/30',
    },
    pendiente: {
      icon: <Clock className="w-5 h-5" />,
      color: 'text-yellow-600 dark:text-yellow-400',
      bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    },
    info: {
      icon: <AlertCircle className="w-5 h-5" />,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-100 dark:bg-blue-900/30',
    },
  };

  const notificacionesFiltradas = notificaciones.filter((n) => {
    if (filtro === 'todas') return true;
    if (filtro === 'no-leidas') return !n.leida;
    return n.tipo === filtro;
  });

  const marcarComoLeida = (id: string) => {
    setNotificaciones((prev) =>
      prev.map((n) => (n.id === id ? { ...n, leida: true } : n))
    );
  };

  const marcarTodasComoLeidas = () => {
    setNotificaciones((prev) => prev.map((n) => ({ ...n, leida: true })));
  };

  const eliminarNotificacion = (id: string) => {
    setNotificaciones((prev) => prev.filter((n) => n.id !== id));
  };

  const noLeidas = notificaciones.filter((n) => !n.leida).length;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors duration-500">
      {/* Header */}
      <header className="bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-20 shadow-sm dark:shadow-neutral-900/50 transition-all duration-500">
        <div className="px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/panel-candidato')}
              className="flex items-center gap-2 px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
              <span className="hidden sm:inline text-sm text-neutral-700 dark:text-neutral-300">
                Volver
              </span>
            </button>
            <div className="w-10 h-10 bg-neutral-900 dark:bg-white rounded-lg flex items-center justify-center transition-colors duration-300">
              <Bell className="w-6 h-6 text-white dark:text-neutral-900" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-neutral-900 dark:text-white transition-colors duration-300">
                Notificaciones
              </h1>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 transition-colors duration-300">
                {noLeidas > 0 ? `${noLeidas} sin leer` : 'Todas al día'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {noLeidas > 0 && (
              <button
                onClick={marcarTodasComoLeidas}
                className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-2 bg-neutral-900 dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-100 text-white dark:text-neutral-900 rounded-lg text-xs sm:text-sm font-medium transition-colors"
              >
                <Check className="w-4 h-4" />
                <span className="hidden md:inline">Marcar todas como leídas</span>
                <span className="md:hidden">Marcar leídas</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Filters */}
          <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 transition-colors duration-300">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFiltro('todas')}
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  filtro === 'todas'
                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => setFiltro('no-leidas')}
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  filtro === 'no-leidas'
                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                }`}
              >
                No leídas {noLeidas > 0 && `(${noLeidas})`}
              </button>
              <button
                onClick={() => setFiltro('exito')}
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  filtro === 'exito'
                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                }`}
              >
                Éxitos
              </button>
              <button
                onClick={() => setFiltro('info')}
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  filtro === 'info'
                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                }`}
              >
                Info
              </button>
              <button
                onClick={() => setFiltro('pendiente')}
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  filtro === 'pendiente'
                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                }`}
              >
                Pendientes
              </button>
            </div>
          </Card>

          {/* Mark all as read button for mobile */}
          {noLeidas > 0 && (
            <button
              onClick={marcarTodasComoLeidas}
              className="sm:hidden w-full flex items-center justify-center gap-2 px-4 py-3 bg-neutral-900 dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-100 text-white dark:text-neutral-900 rounded-lg text-sm font-medium transition-colors"
            >
              <Check className="w-4 h-4" />
              Marcar todas como leídas
            </button>
          )}

          {/* Notifications List */}
          <div className="space-y-3 sm:space-y-4">
            {notificacionesFiltradas.length === 0 ? (
              <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 transition-colors duration-300">
                <p className="text-center text-neutral-600 dark:text-neutral-400 py-8">
                  No hay notificaciones para mostrar
                </p>
              </Card>
            ) : (
              notificacionesFiltradas.map((notif) => (
                <Card
                  key={notif.id}
                  className={`bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 transition-all duration-300 ${
                    !notif.leida ? 'border-l-4 border-l-neutral-900 dark:border-l-white' : ''
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                    {/* Icon */}
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${tipoConfig[notif.tipo].bg}`}
                    >
                      <div className={tipoConfig[notif.tipo].color}>
                        {tipoConfig[notif.tipo].icon}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3
                          className={`text-sm sm:text-base font-bold transition-colors duration-300 ${
                            !notif.leida
                              ? 'text-neutral-900 dark:text-white'
                              : 'text-neutral-600 dark:text-neutral-400'
                          }`}
                        >
                          {notif.titulo}
                        </h3>
                        {!notif.leida && (
                          <span className="w-2 h-2 bg-neutral-900 dark:bg-white rounded-full flex-shrink-0 mt-1.5"></span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mb-3 transition-colors duration-300">
                        {notif.mensaje}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                        <span className="text-xs text-neutral-500 dark:text-neutral-500 transition-colors duration-300">
                          {new Date(notif.fecha).toLocaleString('es-ES')}
                        </span>
                        <div className="flex gap-2">
                          {!notif.leida && (
                            <button
                              onClick={() => marcarComoLeida(notif.id)}
                              className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white font-medium transition-colors"
                            >
                              Marcar como leída
                            </button>
                          )}
                          <button
                            onClick={() => eliminarNotificacion(notif.id)}
                            className="text-xs sm:text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium transition-colors flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span className="hidden sm:inline">Eliminar</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
