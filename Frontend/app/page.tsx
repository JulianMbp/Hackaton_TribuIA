'use client';

// ============================================
// HOME PAGE - ROLE SELECTION
// ============================================

import React from 'react';
import { useRouter } from 'next/navigation';
import { Building2, UserCircle2 } from 'lucide-react';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { AnimatedLogo } from '@/components/common/AnimatedLogo';

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
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-200 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 flex items-center justify-center px-4 transition-colors duration-500">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10">
        <ThemeToggle />
      </div>

      <div className="max-w-5xl w-full">
        {/* Header with Animated Logo */}
        <div className="text-center mb-8 sm:mb-12">
          {/* Animated Logo */}
          <div className="flex justify-center mb-6">
            <AnimatedLogo size="xl" showText={true} animate={true} />
          </div>

          <p className="text-base sm:text-lg md:text-xl text-neutral-700 dark:text-neutral-200 transition-colors duration-500">
            Plataforma de entrevistas inteligentes
          </p>
          <p className="text-xs sm:text-sm md:text-base text-neutral-600 dark:text-neutral-400 mt-2 transition-colors duration-500">
            Selecciona cómo quieres ingresar
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {/* Empresa Card */}
          <button
            onClick={handleEmpresaClick}
            type="button"
            className="group relative bg-white dark:bg-neutral-900 rounded-2xl border-2 border-neutral-200 dark:border-neutral-800 hover:border-neutral-900 dark:hover:border-neutral-600 shadow-lg hover:shadow-2xl dark:shadow-neutral-900/50 dark:hover:shadow-neutral-700/50 transition-all duration-300 p-6 sm:p-8 md:p-10 lg:p-12 text-left transform hover:-translate-y-2 hover:scale-[1.02] active:scale-[0.98] w-full overflow-hidden"
          >
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-50/50 to-transparent dark:from-neutral-800/50 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>

            <div className="relative flex flex-col items-center text-center space-y-4 sm:space-y-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-neutral-900 dark:bg-white rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg dark:shadow-neutral-700/50">
                <Building2 className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white dark:text-neutral-900 transition-all duration-300" />
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white mb-2 transition-colors duration-300">
                  Soy Empresa
                </h2>
                <p className="text-neutral-600 dark:text-neutral-300 text-xs sm:text-sm md:text-base transition-colors duration-300">
                  Gestiona entrevistas, evalúa candidatos y toma decisiones informadas
                </p>
              </div>

              <div className="pt-2 sm:pt-4 flex items-center text-neutral-900 dark:text-white font-medium group-hover:gap-3 gap-2 transition-all text-sm sm:text-base">
                <span>Acceder al panel</span>
                <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </button>

          {/* Candidato Card */}
          <button
            onClick={handleCandidatoClick}
            type="button"
            className="group relative bg-white dark:bg-neutral-900 rounded-2xl border-2 border-neutral-200 dark:border-neutral-800 hover:border-neutral-900 dark:hover:border-neutral-600 shadow-lg hover:shadow-2xl dark:shadow-neutral-900/50 dark:hover:shadow-neutral-700/50 transition-all duration-300 p-6 sm:p-8 md:p-10 lg:p-12 text-left transform hover:-translate-y-2 hover:scale-[1.02] active:scale-[0.98] w-full overflow-hidden"
          >
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-50/50 to-transparent dark:from-neutral-800/50 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>

            <div className="relative flex flex-col items-center text-center space-y-4 sm:space-y-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-neutral-900 dark:bg-white rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg dark:shadow-neutral-700/50">
                <UserCircle2 className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white dark:text-neutral-900 transition-all duration-300" />
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white mb-2 transition-colors duration-300">
                  Soy Candidato
                </h2>
                <p className="text-neutral-600 dark:text-neutral-300 text-xs sm:text-sm md:text-base transition-colors duration-300">
                  Accede a tus entrevistas programadas y completa tu proceso
                </p>
              </div>

              <div className="pt-2 sm:pt-4 flex items-center text-neutral-900 dark:text-white font-medium group-hover:gap-3 gap-2 transition-all text-sm sm:text-base">
                <span>Acceder al panel</span>
                <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 sm:mt-12">
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 transition-colors duration-500">
            ¿Tienes problemas para acceder?{' '}
            <a href="#" className="text-neutral-900 dark:text-white font-medium hover:underline decoration-2 underline-offset-4 transition-all duration-300">
              Contacta soporte
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
