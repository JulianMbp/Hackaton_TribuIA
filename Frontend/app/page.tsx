'use client';

// ============================================
// HOME PAGE - ROLE SELECTION
// ============================================

import React from 'react';
import { useRouter } from 'next/navigation';
import { Building2, UserCircle2 } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  const handleEmpresaClick = () => {
    console.log('Click en Empresa - Redirigiendo a /auth/login/empresa');
    router.push('/auth/login/empresa');
  };

  const handleCandidatoClick = () => {
    console.log('Click en Candidato - Redirigiendo a /auth/login/candidato');
    router.push('/auth/login/candidato');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center px-4">
      <div className="max-w-5xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-neutral-900 mb-4">
            CrewAI
          </h1>
          <p className="text-lg md:text-xl text-neutral-700">
            Plataforma de entrevistas inteligentes
          </p>
          <p className="text-sm md:text-base text-neutral-600 mt-2">
            Selecciona cómo quieres ingresar
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {/* Empresa Card */}
          <button
            onClick={handleEmpresaClick}
            type="button"
            className="group relative bg-white rounded-2xl border-2 border-neutral-200 hover:border-neutral-900 shadow-lg hover:shadow-2xl transition-all duration-300 p-6 sm:p-8 md:p-10 lg:p-12 text-left transform hover:-translate-y-2 hover:scale-[1.02] active:scale-[0.98] w-full"
          >
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-neutral-900 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Building2 className="w-10 h-10 md:w-12 md:h-12 text-white" />
              </div>

              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-2">
                  Soy Empresa
                </h2>
                <p className="text-neutral-600 text-sm md:text-base">
                  Gestiona entrevistas, evalúa candidatos y toma decisiones informadas
                </p>
              </div>

              <div className="pt-4 flex items-center text-neutral-900 font-medium group-hover:gap-3 gap-2 transition-all">
                <span>Acceder al panel</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </button>

          {/* Candidato Card */}
          <button
            onClick={handleCandidatoClick}
            type="button"
            className="group relative bg-white rounded-2xl border-2 border-neutral-200 hover:border-neutral-900 shadow-lg hover:shadow-2xl transition-all duration-300 p-6 sm:p-8 md:p-10 lg:p-12 text-left transform hover:-translate-y-2 hover:scale-[1.02] active:scale-[0.98] w-full"
          >
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-neutral-900 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <UserCircle2 className="w-10 h-10 md:w-12 md:h-12 text-white" />
              </div>

              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-2">
                  Soy Candidato
                </h2>
                <p className="text-neutral-600 text-sm md:text-base">
                  Accede a tus entrevistas programadas y completa tu proceso
                </p>
              </div>

              <div className="pt-4 flex items-center text-neutral-900 font-medium group-hover:gap-3 gap-2 transition-all">
                <span>Acceder al panel</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-sm text-neutral-600">
            ¿Tienes problemas para acceder?{' '}
            <a href="#" className="text-neutral-900 font-medium hover:underline">
              Contacta soporte
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
