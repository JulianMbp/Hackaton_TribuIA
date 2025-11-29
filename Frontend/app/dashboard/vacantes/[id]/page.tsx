'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/common/Card';
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  Users,
  Calendar,
  Edit,
  Trash2,
  Briefcase,
  Clock,
} from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { ThemeToggle } from '@/components/common/ThemeToggle';

interface Vacante {
  id: string;
  titulo: string;
  departamento: string;
  ubicacion: string;
  modalidad: 'remoto' | 'hibrido' | 'presencial';
  tipoContrato: string;
  salarioMin: string;
  salarioMax: string;
  estado: 'activa' | 'pausada' | 'cerrada';
  postulantes: number;
  fechaCreacion: string;
  descripcion: string;
  requisitos: string[];
  beneficios: string[];
}

export default function VacanteDetailPage() {
  const router = useRouter();
  const params = useParams();
  const vacanteId = params.id as string;

  // Mock data - En producción esto vendría de una API
  const [vacante] = useState<Vacante>({
    id: vacanteId,
    titulo: 'Desarrollador Full Stack Senior',
    departamento: 'Tecnología',
    ubicacion: 'Ciudad de México, CDMX',
    modalidad: 'remoto',
    tipoContrato: 'Tiempo Completo',
    salarioMin: '$40,000',
    salarioMax: '$60,000',
    estado: 'activa',
    postulantes: 24,
    fechaCreacion: '2025-11-20',
    descripcion:
      'Buscamos un Desarrollador Full Stack Senior con experiencia comprobada en desarrollo de aplicaciones web modernas. El candidato ideal tendrá un fuerte dominio de tecnologías frontend y backend, con capacidad para liderar proyectos técnicos complejos.',
    requisitos: [
      '5+ años de experiencia en desarrollo web',
      'Dominio de React, Node.js y TypeScript',
      'Experiencia con bases de datos SQL y NoSQL',
      'Conocimientos de AWS o servicios cloud similares',
      'Excelentes habilidades de comunicación',
      'Experiencia liderando equipos técnicos',
    ],
    beneficios: [
      'Trabajo 100% remoto',
      'Seguro médico de gastos mayores',
      'Días de vacaciones adicionales',
      'Bonos por desempeño',
      'Capacitación continua',
      'Equipo de trabajo de última generación',
    ],
  });

  const modalidadConfig = {
    remoto: { label: 'Remoto', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' },
    hibrido: { label: 'Híbrido', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' },
    presencial: {
      label: 'Presencial',
      color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
    },
  };

  const estadoConfig = {
    activa: {
      label: 'Activa',
      color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
    },
    pausada: {
      label: 'Pausada',
      color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
    },
    cerrada: {
      label: 'Cerrada',
      color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
    },
  };

  const handleDelete = () => {
    if (window.confirm('¿Seguro quieres eliminar esta vacante?')) {
      // Lógica para eliminar
      router.push('/dashboard/vacantes');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <button
            onClick={() => router.push('/dashboard/vacantes')}
            className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Vacantes
          </button>

          <div className="flex flex-wrap gap-2 sm:gap-3">
            <ThemeToggle />
            <button
              onClick={() => router.push(`/dashboard/vacantes/${vacanteId}/editar`)}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-900 dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-100 text-white dark:text-neutral-900 rounded-lg font-medium transition-colors text-sm"
            >
              <Edit className="w-4 h-4" />
              Editar vacante
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 dark:bg-red-500 hover:bg-red-700 dark:hover:bg-red-600 text-white rounded-lg font-medium transition-colors text-sm"
            >
              <Trash2 className="w-4 h-4" />
              Eliminar
            </button>
          </div>
        </div>

        {/* Title and Status */}
        <div>
          <div className="flex items-start justify-between mb-2">
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white transition-colors duration-300">
              {vacante.titulo}
            </h1>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors duration-300 ${estadoConfig[vacante.estado].color}`}
            >
              {estadoConfig[vacante.estado].label}
            </span>
          </div>
          <p className="text-neutral-600 dark:text-neutral-400 transition-colors duration-300">
            {vacante.departamento}
          </p>
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 transition-colors duration-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center transition-colors duration-300">
                <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 transition-colors duration-300">Ubicación</p>
                <p className="text-sm font-semibold text-neutral-900 dark:text-white transition-colors duration-300">
                  {vacante.ubicacion}
                </p>
              </div>
            </div>
          </Card>

          <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 transition-colors duration-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center transition-colors duration-300">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium transition-colors duration-300 ${modalidadConfig[vacante.modalidad].color}`}
                >
                  {modalidadConfig[vacante.modalidad].label}
                </span>
              </div>
            </div>
          </Card>

          <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 transition-colors duration-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center transition-colors duration-300">
                <DollarSign className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 transition-colors duration-300">Salario</p>
                <p className="text-sm font-semibold text-neutral-900 dark:text-white transition-colors duration-300">
                  {vacante.salarioMin} - {vacante.salarioMax}
                </p>
              </div>
            </div>
          </Card>

          <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 transition-colors duration-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center transition-colors duration-300">
                <Users className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 transition-colors duration-300">Postulantes</p>
                <p className="text-sm font-semibold text-neutral-900 dark:text-white transition-colors duration-300">
                  {vacante.postulantes}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 transition-colors duration-300">
            <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 transition-colors duration-300">
              <Briefcase className="w-4 h-4" />
              <span>Tipo de Contrato: {vacante.tipoContrato}</span>
            </div>
          </Card>

          <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 transition-colors duration-300">
            <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 transition-colors duration-300">
              <Calendar className="w-4 h-4" />
              <span>Fecha de Creación: {new Date(vacante.fechaCreacion).toLocaleDateString('es-ES')}</span>
            </div>
          </Card>
        </div>

        {/* Description */}
        <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 transition-colors duration-300">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4 transition-colors duration-300">
            Descripción del Puesto
          </h2>
          <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed transition-colors duration-300">
            {vacante.descripcion}
          </p>
        </Card>

        {/* Requirements */}
        <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 transition-colors duration-300">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4 transition-colors duration-300">
            Requisitos
          </h2>
          <ul className="space-y-2">
            {vacante.requisitos.map((req, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-neutral-700 dark:text-neutral-300 transition-colors duration-300"
              >
                <span className="w-2 h-2 bg-neutral-900 dark:bg-white rounded-full mt-1.5 flex-shrink-0 transition-colors duration-300"></span>
                {req}
              </li>
            ))}
          </ul>
        </Card>

        {/* Benefits */}
        <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 transition-colors duration-300">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4 transition-colors duration-300">
            Beneficios
          </h2>
          <ul className="space-y-2">
            {vacante.beneficios.map((ben, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-neutral-700 dark:text-neutral-300 transition-colors duration-300"
              >
                <span className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full mt-1.5 flex-shrink-0 transition-colors duration-300"></span>
                {ben}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </DashboardLayout>
  );
}
