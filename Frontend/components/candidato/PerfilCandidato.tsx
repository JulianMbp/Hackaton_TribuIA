'use client';

import React from 'react';
import { User, Briefcase, Award, Edit, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export interface PerfilData {
  nombre: string;
  rol: string;
  experiencia: string;
  foto?: string;
  skills: string[];
  completitud: number; // 0-100
}

interface PerfilCandidatoProps {
  perfil: PerfilData;
}

export const PerfilCandidato: React.FC<PerfilCandidatoProps> = ({ perfil }) => {
  const router = useRouter();

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 h-full flex flex-col transition-colors duration-300">
      {/* Header */}
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white transition-colors duration-300">Mi Perfil</h2>
          <button
            onClick={() => router.push('/panel-candidato/editar-perfil')}
            className="p-1.5 sm:p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-600 dark:text-neutral-400" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-4 sm:mb-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-neutral-200 dark:bg-neutral-700 rounded-full flex items-center justify-center mb-2 sm:mb-3 transition-colors duration-300">
            {perfil.foto ? (
              <img
                src={perfil.foto}
                alt={perfil.nombre}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="w-8 h-8 sm:w-10 sm:h-10 text-neutral-600 dark:text-neutral-400" />
            )}
          </div>
          <h3 className="font-bold text-sm sm:text-base text-neutral-900 dark:text-white text-center transition-colors duration-300">{perfil.nombre}</h3>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 text-center transition-colors duration-300">{perfil.rol}</p>
        </div>

        {/* Experience */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
            <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-600 dark:text-neutral-400" />
            <span className="text-xs font-semibold text-neutral-900 dark:text-white transition-colors duration-300">Experiencia</span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 pl-5 sm:pl-6 transition-colors duration-300">{perfil.experiencia}</p>
        </div>

        {/* Skills */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
            <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-600 dark:text-neutral-400" />
            <span className="text-xs font-semibold text-neutral-900 dark:text-white transition-colors duration-300">Habilidades</span>
          </div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2 pl-5 sm:pl-6">
            {perfil.skills.map((skill, index) => (
              <span
                key={index}
                className="px-2 py-0.5 sm:px-3 sm:py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-full text-xs font-medium transition-colors duration-300"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Profile Completeness */}
        <div className="mb-3 sm:mb-4">
          <div className="flex items-center justify-between mb-1.5 sm:mb-2">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-600 dark:text-neutral-400" />
              <span className="text-xs font-semibold text-neutral-900 dark:text-white transition-colors duration-300">Completitud del Perfil</span>
            </div>
            <span className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white transition-colors duration-300">{perfil.completitud}%</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-1.5 sm:h-2 overflow-hidden transition-colors duration-300">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                perfil.completitud >= 75
                  ? 'bg-green-500 dark:bg-green-400'
                  : perfil.completitud >= 50
                  ? 'bg-yellow-500 dark:bg-yellow-400'
                  : 'bg-red-500 dark:bg-red-400'
              }`}
              style={{ width: `${perfil.completitud}%` }}
            />
          </div>

          {perfil.completitud < 100 && (
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1.5 sm:mt-2 transition-colors duration-300">
              Completa tu perfil para mejorar tus oportunidades
            </p>
          )}
        </div>

        {/* Edit Button */}
        <button
          onClick={() => router.push('/panel-candidato/editar-perfil')}
          className="w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-neutral-900 dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-100 text-white dark:text-neutral-900 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-300"
        >
          Editar Perfil
        </button>
      </div>
    </div>
  );
};
