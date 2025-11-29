'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { UserCircle2, LogOut, Bell, ArrowLeft } from 'lucide-react';
import { MisPostulaciones, Postulacion } from '@/components/candidato/MisPostulaciones';
import { PropuestasTrabajo, Vacante } from '@/components/candidato/PropuestasTrabajo';
import { PerfilCandidato, PerfilData } from '@/components/candidato/PerfilCandidato';

export default function PanelCandidatoPage() {
  const router = useRouter();

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }
    router.push('/');
  };

  // Mock Data - Postulaciones
  const mockPostulaciones: Postulacion[] = [
    {
      id: '1',
      puesto: 'Frontend Developer',
      empresa: 'Tech Corp',
      estado: 'pendiente',
      fecha: '2025-11-25',
    },
    {
      id: '2',
      puesto: 'React Developer',
      empresa: 'StartupXYZ',
      estado: 'entrevista',
      fecha: '2025-11-23',
    },
    {
      id: '3',
      puesto: 'Full Stack Developer',
      empresa: 'Digital Solutions',
      estado: 'rechazado',
      fecha: '2025-11-20',
    },
    {
      id: '4',
      puesto: 'UI Developer',
      empresa: 'Creative Agency',
      estado: 'aceptado',
      fecha: '2025-11-18',
    },
    {
      id: '5',
      puesto: 'Next.js Developer',
      empresa: 'WebStudio',
      estado: 'pendiente',
      fecha: '2025-11-27',
    },
    {
      id: '6',
      puesto: 'TypeScript Developer',
      empresa: 'CodeFactory',
      estado: 'entrevista',
      fecha: '2025-11-26',
    },
    {
      id: '7',
      puesto: 'JavaScript Developer',
      empresa: 'DevHub',
      estado: 'pendiente',
      fecha: '2025-11-24',
    },
    {
      id: '8',
      puesto: 'React Native Developer',
      empresa: 'MobileFirst',
      estado: 'rechazado',
      fecha: '2025-11-22',
    },
  ];

  // Mock Data - Vacantes
  const mockVacantes: Vacante[] = [
    {
      id: '1',
      titulo: 'Senior Frontend Developer',
      empresa: 'Google',
      modalidad: 'remoto',
      ubicacion: 'Anywhere',
      salario: '$80k-$120k',
      categoria: 'Desarrollo',
      descripcion:
        'Buscamos un desarrollador frontend senior con experiencia en React y TypeScript para unirse a nuestro equipo de productos.',
    },
    {
      id: '2',
      titulo: 'React Native Developer',
      empresa: 'Meta',
      modalidad: 'hibrido',
      ubicacion: 'Menlo Park, CA',
      salario: '$90k-$130k',
      categoria: 'Desarrollo',
      descripcion:
        'Únete a nuestro equipo móvil para construir la próxima generación de aplicaciones móviles con React Native.',
    },
    {
      id: '3',
      titulo: 'Full Stack Engineer',
      empresa: 'Amazon',
      modalidad: 'presencial',
      ubicacion: 'Seattle, WA',
      salario: '$100k-$150k',
      categoria: 'Desarrollo',
      descripcion:
        'Desarrolla soluciones end-to-end para millones de usuarios en la plataforma de AWS.',
    },
    {
      id: '4',
      titulo: 'UI/UX Designer',
      empresa: 'Apple',
      modalidad: 'presencial',
      ubicacion: 'Cupertino, CA',
      salario: '$85k-$125k',
      categoria: 'Diseño',
      descripcion:
        'Diseña interfaces intuitivas y hermosas para productos que impactan millones de vidas.',
    },
    {
      id: '5',
      titulo: 'Backend Developer',
      empresa: 'Microsoft',
      modalidad: 'remoto',
      ubicacion: 'Remote USA',
      salario: '$95k-$140k',
      categoria: 'Desarrollo',
      descripcion:
        'Construye servicios escalables y confiables para Azure usando .NET y tecnologías cloud.',
    },
    {
      id: '6',
      titulo: 'DevOps Engineer',
      empresa: 'Netflix',
      modalidad: 'hibrido',
      ubicacion: 'Los Gatos, CA',
      salario: '$110k-$160k',
      categoria: 'Infraestructura',
      descripcion:
        'Automatiza y optimiza nuestra infraestructura para servir contenido a 200M+ usuarios.',
    },
    {
      id: '7',
      titulo: 'Product Manager',
      empresa: 'Spotify',
      modalidad: 'remoto',
      ubicacion: 'Stockholm, Sweden',
      salario: '$90k-$135k',
      categoria: 'Producto',
      descripcion:
        'Lidera el desarrollo de nuevas funcionalidades para la plataforma de música más popular del mundo.',
    },
    {
      id: '8',
      titulo: 'Data Scientist',
      empresa: 'Tesla',
      modalidad: 'presencial',
      ubicacion: 'Palo Alto, CA',
      salario: '$105k-$155k',
      categoria: 'Data Science',
      descripcion:
        'Analiza datos de millones de vehículos para mejorar la conducción autónoma.',
    },
    {
      id: '9',
      titulo: 'Mobile Developer',
      empresa: 'Uber',
      modalidad: 'hibrido',
      ubicacion: 'San Francisco, CA',
      salario: '$95k-$145k',
      categoria: 'Desarrollo',
      descripcion:
        'Desarrolla la aplicación móvil que conecta millones de usuarios con conductores.',
    },
    {
      id: '10',
      titulo: 'Security Engineer',
      empresa: 'Airbnb',
      modalidad: 'remoto',
      ubicacion: 'Remote Worldwide',
      salario: '$100k-$150k',
      categoria: 'Seguridad',
      descripcion:
        'Protege la plataforma y los datos de millones de anfitriones y huéspedes.',
    },
    {
      id: '11',
      titulo: 'QA Engineer',
      empresa: 'Salesforce',
      modalidad: 'hibrido',
      ubicacion: 'San Francisco, CA',
      salario: '$80k-$120k',
      categoria: 'Calidad',
      descripcion:
        'Asegura la calidad de nuestros productos CRM usados por empresas Fortune 500.',
    },
    {
      id: '12',
      titulo: 'Cloud Architect',
      empresa: 'IBM',
      modalidad: 'remoto',
      ubicacion: 'Remote USA',
      salario: '$120k-$170k',
      categoria: 'Arquitectura',
      descripcion:
        'Diseña soluciones cloud enterprise para nuestros clientes corporativos más grandes.',
    },
  ];

  // Mock Data - Perfil
  const mockPerfil: PerfilData = {
    nombre: 'Juan Pérez',
    rol: 'Frontend Developer',
    experiencia: '3 años en desarrollo web',
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind', 'Node.js'],
    completitud: 75,
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-20 shadow-sm">
        <div className="px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-neutral-900 rounded-lg flex items-center justify-center">
              <UserCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-neutral-900">Panel de Candidato</h1>
              <p className="text-xs md:text-sm text-neutral-600 hidden sm:block">
                Encuentra tu próxima oportunidad
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Back Button */}
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 px-3 py-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-neutral-700" />
              <span className="hidden md:inline text-sm text-neutral-700">Volver</span>
            </button>

            {/* Notifications */}
            <button className="relative p-2 hover:bg-neutral-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-neutral-700" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4 text-neutral-700" />
              <span className="hidden md:inline text-sm text-neutral-700">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content - 3 Column Layout */}
      <main className="p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-[1600px] mx-auto">
          {/* Left Column - Postulaciones (25% on desktop) */}
          <div className="lg:col-span-1 h-[600px] lg:h-[800px]">
            <MisPostulaciones postulaciones={mockPostulaciones} />
          </div>

          {/* Center Column - Propuestas (50% on desktop) */}
          <div className="lg:col-span-2 h-[600px] lg:h-[800px]">
            <PropuestasTrabajo vacantes={mockVacantes} />
          </div>

          {/* Right Column - Perfil (25% on desktop) */}
          <div className="lg:col-span-1 h-[600px] lg:h-[800px]">
            <PerfilCandidato perfil={mockPerfil} />
          </div>
        </div>

        {/* Info Message */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-[1600px] mx-auto">
          <p className="text-sm text-blue-800 text-center">
            <strong>Panel en Modo Demo:</strong> Esta vista muestra datos de ejemplo. Las
            funcionalidades completas estarán disponibles cuando se conecte con la base de datos.
          </p>
        </div>
      </main>
    </div>
  );
}
