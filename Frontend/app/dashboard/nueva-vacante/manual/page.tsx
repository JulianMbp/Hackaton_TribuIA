'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { ArrowLeft, Briefcase, MapPin, DollarSign, Users, Clock, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useNotification } from '@/lib/contexts/NotificationContext';

export default function FormularioManualPage() {
  const router = useRouter();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    titulo: '',
    departamento: '',
    ubicacion: '',
    modalidad: 'remoto' as 'remoto' | 'hibrido' | 'presencial',
    tipoContrato: 'tiempo_completo' as 'tiempo_completo' | 'medio_tiempo' | 'contrato' | 'freelance',
    salarioMin: '',
    salarioMax: '',
    experiencia: '',
    descripcion: '',
    requisitos: '',
    beneficios: '',
    vacantes: '1',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulación de guardado
    setTimeout(() => {
      setLoading(false);
      showNotification('success', 'Vacante creada exitosamente');
      router.push('/dashboard/vacantes');
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/dashboard/nueva-vacante')}
            className="flex items-center gap-2 px-3 md:px-4 py-2 text-xs md:text-sm text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Volver</span>
          </button>
        </div>

        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">Formulario Manual</h1>
          <p className="text-sm md:text-base text-neutral-600 mt-2">
            Completa la información de la oferta de trabajo
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Básica */}
          <Card>
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="w-5 h-5 text-neutral-700" />
                <h2 className="text-lg md:text-xl font-semibold text-neutral-900">Información Básica</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Título de la Vacante *
                  </label>
                  <input
                    type="text"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleChange}
                    required
                    placeholder="Ej. Desarrollador Full Stack Senior"
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Departamento *
                  </label>
                  <input
                    type="text"
                    name="departamento"
                    value={formData.departamento}
                    onChange={handleChange}
                    required
                    placeholder="Ej. Tecnología"
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Ubicación *
                  </label>
                  <input
                    type="text"
                    name="ubicacion"
                    value={formData.ubicacion}
                    onChange={handleChange}
                    required
                    placeholder="Ej. Ciudad de México, CDMX"
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Modalidad de Trabajo *
                  </label>
                  <select
                    name="modalidad"
                    value={formData.modalidad}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none text-sm"
                  >
                    <option value="remoto">Remoto</option>
                    <option value="hibrido">Híbrido</option>
                    <option value="presencial">Presencial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Tipo de Contrato *
                  </label>
                  <select
                    name="tipoContrato"
                    value={formData.tipoContrato}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none text-sm"
                  >
                    <option value="tiempo_completo">Tiempo Completo</option>
                    <option value="medio_tiempo">Medio Tiempo</option>
                    <option value="contrato">Por Contrato</option>
                    <option value="freelance">Freelance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    <Users className="w-4 h-4 inline mr-1" />
                    Número de Vacantes *
                  </label>
                  <input
                    type="number"
                    name="vacantes"
                    value={formData.vacantes}
                    onChange={handleChange}
                    required
                    min="1"
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none text-sm"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Compensación */}
          <Card>
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-5 h-5 text-neutral-700" />
                <h2 className="text-lg md:text-xl font-semibold text-neutral-900">Compensación</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Salario Mínimo (MXN/mes)
                  </label>
                  <input
                    type="number"
                    name="salarioMin"
                    value={formData.salarioMin}
                    onChange={handleChange}
                    placeholder="Ej. 30000"
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Salario Máximo (MXN/mes)
                  </label>
                  <input
                    type="number"
                    name="salarioMax"
                    value={formData.salarioMax}
                    onChange={handleChange}
                    placeholder="Ej. 50000"
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Años de Experiencia
                  </label>
                  <input
                    type="text"
                    name="experiencia"
                    value={formData.experiencia}
                    onChange={handleChange}
                    placeholder="Ej. 3-5 años"
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none text-sm"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Detalles */}
          <Card>
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-neutral-700" />
                <h2 className="text-lg md:text-xl font-semibold text-neutral-900">Detalles de la Vacante</h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Descripción del Puesto *
                </label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Describe las responsabilidades principales del puesto..."
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none resize-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Requisitos *
                </label>
                <textarea
                  name="requisitos"
                  value={formData.requisitos}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Lista los requisitos técnicos y habilidades necesarias (uno por línea)..."
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none resize-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Beneficios
                </label>
                <textarea
                  name="beneficios"
                  value={formData.beneficios}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe los beneficios que ofreces (uno por línea)..."
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none resize-none text-sm"
                />
              </div>
            </div>
          </Card>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <button
              type="button"
              onClick={() => router.push('/dashboard/nueva-vacante')}
              className="px-6 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors text-sm md:text-base"
            >
              Cancelar
            </button>
            <Button type="submit" loading={loading} className="w-full sm:w-auto">
              Publicar Vacante
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
