'use client';

import React from 'react';
import { User, Briefcase, Award, Edit, CheckCircle2 } from 'lucide-react';

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
  return (
    <div className="bg-white rounded-xl border border-neutral-200 h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-neutral-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-neutral-900">Mi Perfil</h2>
          <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
            <Edit className="w-4 h-4 text-neutral-600" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 bg-neutral-200 rounded-full flex items-center justify-center mb-3">
            {perfil.foto ? (
              <img
                src={perfil.foto}
                alt={perfil.nombre}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="w-10 h-10 text-neutral-600" />
            )}
          </div>
          <h3 className="font-bold text-base text-neutral-900 text-center">{perfil.nombre}</h3>
          <p className="text-sm text-neutral-600 text-center">{perfil.rol}</p>
        </div>

        {/* Experience */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="w-4 h-4 text-neutral-600" />
            <span className="text-xs font-semibold text-neutral-900">Experiencia</span>
          </div>
          <p className="text-sm text-neutral-700 pl-6">{perfil.experiencia}</p>
        </div>

        {/* Skills */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-4 h-4 text-neutral-600" />
            <span className="text-xs font-semibold text-neutral-900">Habilidades</span>
          </div>
          <div className="flex flex-wrap gap-2 pl-6">
            {perfil.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-xs font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Profile Completeness */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-neutral-600" />
              <span className="text-xs font-semibold text-neutral-900">Completitud del Perfil</span>
            </div>
            <span className="text-sm font-bold text-neutral-900">{perfil.completitud}%</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                perfil.completitud >= 75
                  ? 'bg-green-500'
                  : perfil.completitud >= 50
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${perfil.completitud}%` }}
            />
          </div>

          {perfil.completitud < 100 && (
            <p className="text-xs text-neutral-600 mt-2">
              Completa tu perfil para mejorar tus oportunidades
            </p>
          )}
        </div>

        {/* Edit Button */}
        <button className="w-full px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-sm font-medium transition-colors">
          Editar Perfil
        </button>
      </div>
    </div>
  );
};
