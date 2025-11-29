'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  Upload,
  X,
  User,
  Briefcase,
  Award,
  Mail,
  Phone,
  MapPin,
  FileText,
} from 'lucide-react';
import { Card } from '@/components/common/Card';
import { ThemeToggle } from '@/components/common/ThemeToggle';

interface PerfilForm {
  nombre: string;
  email: string;
  telefono: string;
  ubicacion: string;
  rol: string;
  experiencia: string;
  sobreMi: string;
  skills: string[];
  nuevoSkill: string;
}

export default function EditarPerfilPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<PerfilForm>({
    nombre: 'Juan Pérez',
    email: 'juan.perez@ejemplo.com',
    telefono: '+52 55 1234 5678',
    ubicacion: 'Ciudad de México, México',
    rol: 'Frontend Developer',
    experiencia: '3 años en desarrollo web',
    sobreMi:
      'Desarrollador frontend apasionado por crear experiencias de usuario excepcionales. Especializado en React, TypeScript y Next.js.',
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind', 'Node.js'],
    nuevoSkill: '',
  });

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [fotoFile, setFotoFile] = useState<File | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAgregarSkill = () => {
    if (formData.nuevoSkill.trim() && !formData.skills.includes(formData.nuevoSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, prev.nuevoSkill.trim()],
        nuevoSkill: '',
      }));
    }
  };

  const handleEliminarSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const handleCvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCvFile(e.target.files[0]);
    }
  };

  const handleFotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFotoFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para guardar los cambios
    console.log('Guardando perfil:', formData);
    if (cvFile) console.log('CV:', cvFile.name);
    if (fotoFile) console.log('Foto:', fotoFile.name);
    router.push('/panel-candidato');
  };

  const handleCancel = () => {
    if (window.confirm('¿Descartar los cambios realizados?')) {
      router.push('/panel-candidato');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors duration-500">
      {/* Header */}
      <header className="bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-20 shadow-sm dark:shadow-neutral-900/50 transition-all duration-500">
        <div className="px-4 md:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/panel-candidato')}
              className="flex items-center gap-2 px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
              <span className="text-sm text-neutral-700 dark:text-neutral-300">Volver</span>
            </button>
            <div className="w-10 h-10 bg-neutral-900 dark:bg-white rounded-lg flex items-center justify-center transition-colors duration-300">
              <User className="w-6 h-6 text-white dark:text-neutral-900" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-neutral-900 dark:text-white transition-colors duration-300">
                Editar Perfil
              </h1>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 transition-colors duration-300">
                Actualiza tu información y CV
              </p>
            </div>
          </div>

          <div className="flex gap-2 sm:gap-3">
            <ThemeToggle />
            <button
              onClick={handleCancel}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3 sm:px-4 py-2 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg text-sm font-medium transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Cancelar</span>
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-neutral-900 dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-100 text-white dark:text-neutral-900 rounded-lg text-sm font-medium transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Guardar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 md:p-8">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
          {/* Foto de Perfil */}
          <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 transition-colors duration-300">
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white mb-4 transition-colors duration-300">
              Foto de Perfil
            </h2>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-neutral-200 dark:bg-neutral-700 rounded-full flex items-center justify-center transition-colors duration-300">
                {fotoFile ? (
                  <img
                    src={URL.createObjectURL(fotoFile)}
                    alt="Preview"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 sm:w-16 sm:h-16 text-neutral-600 dark:text-neutral-400" />
                )}
              </div>
              <div className="flex-1 w-full">
                <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-600 rounded-lg cursor-pointer transition-colors text-sm sm:text-base">
                  <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>{fotoFile ? fotoFile.name : 'Subir foto de perfil'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFotoUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 text-center sm:text-left transition-colors duration-300">
                  JPG, PNG o GIF. Max 5MB
                </p>
              </div>
            </div>
          </Card>

          {/* Información Personal */}
          <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 transition-colors duration-300">
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white mb-4 transition-colors duration-300">
              Información Personal
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="nombre"
                  className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 transition-colors duration-300"
                >
                  Nombre Completo *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-neutral-400 dark:text-neutral-500" />
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 rounded-lg focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-500 focus:border-transparent outline-none transition-colors duration-300 text-sm sm:text-base"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 transition-colors duration-300"
                >
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-neutral-400 dark:text-neutral-500" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 rounded-lg focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-500 focus:border-transparent outline-none transition-colors duration-300 text-sm sm:text-base"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="telefono"
                  className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 transition-colors duration-300"
                >
                  Teléfono
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-neutral-400 dark:text-neutral-500" />
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    className="w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 rounded-lg focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-500 focus:border-transparent outline-none transition-colors duration-300 text-sm sm:text-base"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="ubicacion"
                  className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 transition-colors duration-300"
                >
                  Ubicación
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-neutral-400 dark:text-neutral-500" />
                  <input
                    type="text"
                    id="ubicacion"
                    name="ubicacion"
                    value={formData.ubicacion}
                    onChange={handleChange}
                    className="w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 rounded-lg focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-500 focus:border-transparent outline-none transition-colors duration-300 text-sm sm:text-base"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Información Profesional */}
          <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 transition-colors duration-300">
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white mb-4 transition-colors duration-300">
              Información Profesional
            </h2>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="rol"
                  className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 transition-colors duration-300"
                >
                  Rol / Título Profesional *
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-neutral-400 dark:text-neutral-500" />
                  <input
                    type="text"
                    id="rol"
                    name="rol"
                    value={formData.rol}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 rounded-lg focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-500 focus:border-transparent outline-none transition-colors duration-300 text-sm sm:text-base"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="experiencia"
                  className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 transition-colors duration-300"
                >
                  Experiencia
                </label>
                <input
                  type="text"
                  id="experiencia"
                  name="experiencia"
                  value={formData.experiencia}
                  onChange={handleChange}
                  placeholder="Ej: 3 años en desarrollo web"
                  className="w-full px-4 py-2.5 sm:py-3 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 rounded-lg focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-500 focus:border-transparent outline-none transition-colors duration-300 text-sm sm:text-base"
                />
              </div>

              <div>
                <label
                  htmlFor="sobreMi"
                  className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 transition-colors duration-300"
                >
                  Sobre Mí
                </label>
                <textarea
                  id="sobreMi"
                  name="sobreMi"
                  value={formData.sobreMi}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Cuéntanos sobre ti, tu experiencia y tus objetivos profesionales..."
                  className="w-full px-4 py-2.5 sm:py-3 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 rounded-lg focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-500 focus:border-transparent outline-none transition-colors duration-300 text-sm sm:text-base"
                />
              </div>
            </div>
          </Card>

          {/* Habilidades */}
          <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 transition-colors duration-300">
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white mb-4 transition-colors duration-300">
              Habilidades
            </h2>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  name="nuevoSkill"
                  value={formData.nuevoSkill}
                  onChange={handleChange}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAgregarSkill();
                    }
                  }}
                  placeholder="Agregar habilidad..."
                  className="flex-1 px-4 py-2.5 sm:py-3 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 rounded-lg focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-500 focus:border-transparent outline-none transition-colors duration-300 text-sm sm:text-base"
                />
                <button
                  type="button"
                  onClick={handleAgregarSkill}
                  className="px-4 sm:px-6 py-2.5 sm:py-3 bg-neutral-900 dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-100 text-white dark:text-neutral-900 rounded-lg font-medium transition-colors text-sm sm:text-base"
                >
                  Agregar
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-full text-xs sm:text-sm font-medium flex items-center gap-2 transition-colors duration-300"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleEliminarSkill(skill)}
                      className="hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    >
                      <X className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </Card>

          {/* CV */}
          <Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 transition-colors duration-300">
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white mb-4 transition-colors duration-300">
              Currículum Vitae (CV)
            </h2>
            <label className="flex flex-col sm:flex-row items-center justify-center gap-3 px-4 py-6 sm:py-8 border-2 border-dashed border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-600 rounded-lg cursor-pointer transition-colors">
              <FileText className="w-8 h-8 sm:w-10 sm:h-10" />
              <div className="text-center sm:text-left">
                <span className="block text-sm sm:text-base font-medium">
                  {cvFile ? cvFile.name : 'Subir CV actualizado'}
                </span>
                <span className="block text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                  PDF, DOC o DOCX. Max 10MB
                </span>
              </div>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleCvUpload}
                className="hidden"
              />
            </label>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="w-full sm:w-auto px-6 py-3 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-neutral-900 dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-100 text-white dark:text-neutral-900 rounded-lg font-medium transition-colors"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
