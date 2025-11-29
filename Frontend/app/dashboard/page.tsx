'use client';

// ============================================
// DASHBOARD PAGE - MAIN OVERVIEW
// ============================================

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/common/Card';
import { Loading } from '@/components/common/Loading';
import { candidatoService, entrevistaService } from '@/lib/api/services';
import { Candidato, Entrevista } from '@/lib/types';
import Link from 'next/link';

export default function DashboardPage() {
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [entrevistas, setEntrevistas] = useState<Entrevista[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [candidatosRes, entrevistasRes] = await Promise.all([
      candidatoService.getAll(),
      entrevistaService.getAll(),
    ]);

    if (candidatosRes.success && candidatosRes.data) {
      setCandidatos(candidatosRes.data);
    }

    if (entrevistasRes.success && entrevistasRes.data) {
      setEntrevistas(entrevistasRes.data);
    }

    setLoading(false);
  };

  const stats = [
    {
      name: 'Total Candidatos',
      value: candidatos.length,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
    },
    {
      name: 'Entrevistas Activas',
      value: entrevistas.filter((e) => e.status === 'in_progress').length,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      ),
    },
    {
      name: 'Completadas',
      value: entrevistas.filter((e) => e.status === 'completed').length,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <Loading text="Cargando dashboard..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 relative">
        {/* Efectos de fondo decorativos */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-100/20 dark:from-purple-900/10 to-blue-100/20 dark:to-blue-900/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-emerald-100/20 dark:from-emerald-900/10 to-cyan-100/20 dark:to-cyan-900/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <div className="flex items-center gap-3">
          <div className="w-1 h-12 bg-gradient-to-b from-purple-500 via-blue-500 to-emerald-500 rounded-full"></div>
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Dashboard</h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-2">
              Gestiona candidatos, entrevistas y resultados en un solo lugar
            </p>
          </div>
        </div>

        {/* Stats con animaciones */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div key={stat.name} style={{ animationDelay: `${index * 100}ms` }} className="animate-fade-in-up">
              <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm border border-neutral-200 dark:border-neutral-700 group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">{stat.name}</p>
                    <p className="text-3xl font-bold text-neutral-900 dark:text-white mt-2">{stat.value}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 dark:from-purple-900/50 to-blue-100 dark:to-blue-900/50 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>

        {/* Quick actions con efectos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm border border-neutral-200 dark:border-neutral-700 group cursor-pointer">
            <Link href="/dashboard/nueva-vacante" className="block">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                    Agregar Vacante
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                    Crea una nueva oferta de trabajo y define los requisitos del puesto
                  </p>
                </div>
              </div>
            </Link>
          </Card>

          <Card className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm border border-neutral-200 dark:border-neutral-700 group cursor-pointer">
            <Link href="/dashboard/vacantes" className="block">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">Vacantes Creadas</h3>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                    Administra y visualiza todas las vacantes publicadas y sus postulantes
                  </p>
                </div>
              </div>
            </Link>
          </Card>
        </div>

        {/* Recent job postings */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Vacantes Publicadas Recientemente</h2>
            <Link
              href="/dashboard/vacantes"
              className="text-sm text-neutral-800 dark:text-neutral-200 hover:text-neutral-900 dark:hover:text-white font-medium"
            >
              Ver todas →
            </Link>
          </div>

          {candidatos.length === 0 ? (
            <Card className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm border border-neutral-200 dark:border-neutral-700">
              <p className="text-center text-neutral-600 dark:text-neutral-400 py-8">
                No hay vacantes publicadas aún. Crea tu primera vacante para comenzar a recibir postulaciones.
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {candidatos.slice(0, 5).map((candidato, index) => (
                <div key={candidato.id} style={{ animationDelay: `${index * 50}ms` }} className="animate-fade-in-up">
                  <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm border border-neutral-200 dark:border-neutral-700 cursor-pointer">
                    <Link href={`/dashboard/vacantes/${candidato.id}`} className="block">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-neutral-900 dark:text-white">{candidato.nombre}</p>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400">{candidato.email}</p>
                        </div>
                        <div
                          className={`
                            px-3 py-1 rounded-full text-xs font-medium
                            ${candidato.status === 'completed'
                              ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                              : candidato.status === 'in_interview'
                              ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                              : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-600'
                            }
                          `}
                        >
                          {candidato.status}
                        </div>
                      </div>
                    </Link>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </DashboardLayout>
  );
}
