'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/common/Card';
import { ArrowLeft, Sparkles, FileText, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NuevaVacantePage() {
  const router = useRouter();

  return (
    <DashboardLayout>
      <div className="space-y-6 md:space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 px-3 md:px-4 py-2 text-xs md:text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Volver</span>
          </button>
        </div>

        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
            Crear Nueva Vacante
          </h1>
          <p className="text-base md:text-lg text-neutral-600 dark:text-neutral-400">
            Elige cómo quieres crear tu oferta de trabajo
          </p>
        </div>

        {/* Opciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mt-12">
          {/* Opción 1: Generar con IA - PROTAGONISTA */}
          <Link href="/dashboard/cargos">
            <Card className="p-8 md:p-10 hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-neutral-900 dark:hover:border-white group relative overflow-hidden bg-white dark:bg-neutral-800">
              {/* Badge de recomendado */}
              <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                ✨ Recomendado
              </div>

              <div className="flex flex-col items-center text-center space-y-6">
                {/* Icono grande con gradiente */}
                <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="w-10 h-10 md:w-12 md:h-12 text-white" />
                </div>

                {/* Título */}
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white mb-3">
                    Generar con IA
                  </h2>
                  <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    Deja que la inteligencia artificial cree una descripción de vacante
                    profesional y completa en segundos. Solo describe lo que necesitas y la IA
                    se encarga del resto.
                  </p>
                </div>

                {/* Características */}
                <ul className="text-left space-y-3 w-full">
                  <li className="flex items-start gap-3 text-sm text-neutral-700 dark:text-neutral-300">
                    <span className="w-5 h-5 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-green-700 dark:text-green-400">
                      ✓
                    </span>
                    <span>Descripción automática basada en tu prompt</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-neutral-700 dark:text-neutral-300">
                    <span className="w-5 h-5 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-green-700 dark:text-green-400">
                      ✓
                    </span>
                    <span>Criterios técnicos generados inteligentemente</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-neutral-700 dark:text-neutral-300">
                    <span className="w-5 h-5 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-green-700 dark:text-green-400">
                      ✓
                    </span>
                    <span>Ahorra tiempo y esfuerzo</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-neutral-700 dark:text-neutral-300">
                    <span className="w-5 h-5 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-green-700 dark:text-green-400">
                      ✓
                    </span>
                    <span>Resultados profesionales al instante</span>
                  </li>
                </ul>

                {/* Botón CTA */}
                <button className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-semibold text-base md:text-lg shadow-lg transform group-hover:scale-105 transition-all duration-300">
                  Comenzar con IA
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </Card>
          </Link>

          {/* Opción 2: Formulario Manual */}
          <Link href="/dashboard/nueva-vacante/manual">
            <Card className="p-8 md:p-10 hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-neutral-300 dark:hover:border-neutral-600 group bg-white dark:bg-neutral-800">
              <div className="flex flex-col items-center text-center space-y-6">
                {/* Icono */}
                <div className="w-20 h-20 md:w-24 md:h-24 bg-neutral-100 dark:bg-neutral-700 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                  <FileText className="w-10 h-10 md:w-12 md:h-12 text-neutral-600 dark:text-neutral-300" />
                </div>

                {/* Título */}
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white mb-3">
                    Formulario Manual
                  </h2>
                  <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    Completa todos los campos manualmente si prefieres tener control total sobre
                    cada detalle de la oferta de trabajo.
                  </p>
                </div>

                {/* Características */}
                <ul className="text-left space-y-3 w-full">
                  <li className="flex items-start gap-3 text-sm text-neutral-700 dark:text-neutral-300">
                    <span className="w-5 h-5 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-blue-700 dark:text-blue-400">
                      •
                    </span>
                    <span>Control completo de cada campo</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-neutral-700 dark:text-neutral-300">
                    <span className="w-5 h-5 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-blue-700 dark:text-blue-400">
                      •
                    </span>
                    <span>Personalización detallada</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-neutral-700 dark:text-neutral-300">
                    <span className="w-5 h-5 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-blue-700 dark:text-blue-400">
                      •
                    </span>
                    <span>Formulario estructurado paso a paso</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-neutral-700 dark:text-neutral-300">
                    <span className="w-5 h-5 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-blue-700 dark:text-blue-400">
                      •
                    </span>
                    <span>Requiere más tiempo</span>
                  </li>
                </ul>

                {/* Botón */}
                <button className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl font-semibold text-base md:text-lg shadow-lg transform group-hover:scale-105 transition-all duration-300">
                  Usar Formulario
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </Card>
          </Link>
        </div>

        {/* Mensaje informativo */}
        <div className="max-w-3xl mx-auto mt-8">
          <Card className="bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3 p-4">
              <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-blue-900 dark:text-blue-200">
                  <strong>Consejo:</strong> La generación con IA es la forma más rápida y
                  eficiente de crear vacantes profesionales. Puedes editar y personalizar los
                  resultados antes de publicar.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
