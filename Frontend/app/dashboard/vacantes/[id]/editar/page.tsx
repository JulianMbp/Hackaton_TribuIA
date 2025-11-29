'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/common/Card';
import { ArrowLeft, Save, X } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { ThemeToggle } from '@/components/common/ThemeToggle';

interface VacanteForm {
  titulo: string;
  departamento: string;
  ubicacion: string;
  modalidad: 'remoto' | 'hibrido' | 'presencial';
  tipoContrato: string;
  salarioMin: string;
  salarioMax: string;
  estado: 'activa' | 'pausada' | 'cerrada';
  descripcion: string;
  requisitos: string;
  beneficios: string;
}

export default function EditarVacantePage() {
  const router = useRouter();
  const params = useParams();
  const vacanteId = params.id as string;

  // Mock data inicial - En producción vendría de una API
  const [formData, setFormData] = useState<VacanteForm>({
    titulo: 'Desarrollador Full Stack Senior',
    departamento: 'Tecnología',
    ubicacion: 'Ciudad de México, CDMX',
    modalidad: 'remoto',
    tipoContrato: 'Tiempo Completo',
    salarioMin: '40000',
    salarioMax: '60000',
    estado: 'activa',
    descripcion:
      'Buscamos un Desarrollador Full Stack Senior con experiencia comprobada en desarrollo de aplicaciones web modernas.',
    requisitos:
      '5+ años de experiencia en desarrollo web\nDominio de React, Node.js y TypeScript\nExperiencia con bases de datos SQL y NoSQL',
    beneficios:
      'Trabajo 100% remoto\nSeguro médico de gastos mayores\nDías de vacaciones adicionales\nBonos por desempeño',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para guardar los cambios
    console.log('Guardando cambios:', formData);
    router.push(`/dashboard/vacantes/${vacanteId}`);
  };

  const handleCancel = () => {
    if (window.confirm('¿Descartar los cambios realizados?')) {
      router.push(`/dashboard/vacantes/${vacanteId}`);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <button
            onClick={() => router.push(`/dashboard/vacantes/${vacanteId}`)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </button>

          <div className="flex flex-wrap gap-2 sm:gap-3">
            <ThemeToggle />
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg font-medium transition-colors text-sm"
            >
              <X className="w-4 h-4" />
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-900 dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-100 text-white dark:text-neutral-900 rounded-lg font-medium transition-colors text-sm"
            >
              <Save className="w-4 h-4" />
              Guardar Cambios
            </button>
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white transition-colors duration-300">
            Editar Vacante
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2 transition-colors duration-300">
            Modifica la información de la vacante
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Básica */}
          <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 transition-colors duration-300">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4 transition-colors duration-300">
              Información Básica
            </h2>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="titulo"
                  className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 transition-colors duration-300"
                >
                  Título del Puesto *
                </label>
                <input
                  type="text"
                  id="titulo"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 rounded-lg focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-500 focus:border-transparent outline-none transition-colors duration-300"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="departamento"
                    className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 transition-colors duration-300"
                  >
                    Departamento *
                  </label>
                  <input
                    type="text"
                    id="departamento"
                    name="departamento"
                    value={formData.departamento}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 rounded-lg focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-500 focus:border-transparent outline-none transition-colors duration-300"
                  />
                </div>

                <div>
                  <label
                    htmlFor="ubicacion"
                    className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 transition-colors duration-300"
                  >
                    Ubicación *
                  </label>
                  <input
                    type="text"
                    id="ubicacion"
                    name="ubicacion"
                    value={formData.ubicacion}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 rounded-lg focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-500 focus:border-transparent outline-none transition-colors duration-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="modalidad"
                    className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 transition-colors duration-300"
                  >
                    Modalidad *
                  </label>
                  <select
                    id="modalidad"
                    name="modalidad"
                    value={formData.modalidad}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-lg focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-500 focus:border-transparent outline-none transition-colors duration-300"
                  >
                    <option value="remoto">Remoto</option>
                    <option value="hibrido">Híbrido</option>
                    <option value="presencial">Presencial</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="tipoContrato"
                    className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 transition-colors duration-300"
                  >
                    Tipo de Contrato *
                  </label>
                  <input
                    type="text"
                    id="tipoContrato"
                    name="tipoContrato"
                    value={formData.tipoContrato}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 rounded-lg focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-500 focus:border-transparent outline-none transition-colors duration-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="salarioMin"
                    className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 transition-colors duration-300"
                  >
                    Salario Mínimo (MXN) *
                  </label>
                  <input
                    type="number"
                    id="salarioMin"
                    name="salarioMin"
                    value={formData.salarioMin}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 rounded-lg focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-500 focus:border-transparent outline-none transition-colors duration-300"
                  />
                </div>

                <div>
                  <label
                    htmlFor="salarioMax"
                    className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 transition-colors duration-300"
                  >
                    Salario Máximo (MXN) *
                  </label>
                  <input
                    type="number"
                    id="salarioMax"
                    name="salarioMax"
                    value={formData.salarioMax}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 rounded-lg focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-500 focus:border-transparent outline-none transition-colors duration-300"
                  />
                </div>

                <div>
                  <label
                    htmlFor="estado"
                    className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 transition-colors duration-300"
                  >
                    Estado *
                  </label>
                  <select
                    id="estado"
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-lg focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-500 focus:border-transparent outline-none transition-colors duration-300"
                  >
                    <option value="activa">Activa</option>
                    <option value="pausada">Pausada</option>
                    <option value="cerrada">Cerrada</option>
                  </select>
                </div>
              </div>
            </div>
          </Card>

          {/* Descripción */}
          <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 transition-colors duration-300">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4 transition-colors duration-300">
              Descripción
            </h2>
            <div>
              <label
                htmlFor="descripcion"
                className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 transition-colors duration-300"
              >
                Descripción del Puesto *
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 rounded-lg focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-500 focus:border-transparent outline-none transition-colors duration-300"
              />
            </div>
          </Card>

          {/* Requisitos */}
          <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 transition-colors duration-300">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4 transition-colors duration-300">
              Requisitos
            </h2>
            <div>
              <label
                htmlFor="requisitos"
                className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 transition-colors duration-300"
              >
                Requisitos (uno por línea) *
              </label>
              <textarea
                id="requisitos"
                name="requisitos"
                value={formData.requisitos}
                onChange={handleChange}
                required
                rows={6}
                placeholder="5+ años de experiencia&#10;Dominio de React&#10;Experiencia con TypeScript"
                className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 rounded-lg focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-500 focus:border-transparent outline-none transition-colors duration-300"
              />
            </div>
          </Card>

          {/* Beneficios */}
          <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 transition-colors duration-300">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4 transition-colors duration-300">
              Beneficios
            </h2>
            <div>
              <label
                htmlFor="beneficios"
                className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 transition-colors duration-300"
              >
                Beneficios (uno por línea) *
              </label>
              <textarea
                id="beneficios"
                name="beneficios"
                value={formData.beneficios}
                onChange={handleChange}
                required
                rows={6}
                placeholder="Trabajo 100% remoto&#10;Seguro médico&#10;Vacaciones adicionales"
                className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 rounded-lg focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-500 focus:border-transparent outline-none transition-colors duration-300"
              />
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-neutral-900 dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-100 text-white dark:text-neutral-900 rounded-lg font-medium transition-colors"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
