'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/common/Card';
import {
  ArrowLeft,
  Plus,
  Search,
  MapPin,
  DollarSign,
  Users,
  Calendar,
  Eye,
  Edit,
  Trash2,
  Filter,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
}

export default function VacantesPage() {
  const router = useRouter();
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');

  // Datos Mock
  const [vacantes] = useState<Vacante[]>([
    {
      id: '1',
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
    },
    {
      id: '2',
      titulo: 'Diseñador UI/UX',
      departamento: 'Diseño',
      ubicacion: 'Guadalajara, JAL',
      modalidad: 'hibrido',
      tipoContrato: 'Tiempo Completo',
      salarioMin: '$30,000',
      salarioMax: '$45,000',
      estado: 'activa',
      postulantes: 18,
      fechaCreacion: '2025-11-18',
    },
    {
      id: '3',
      titulo: 'Product Manager',
      departamento: 'Producto',
      ubicacion: 'Monterrey, NL',
      modalidad: 'presencial',
      tipoContrato: 'Tiempo Completo',
      salarioMin: '$50,000',
      salarioMax: '$70,000',
      estado: 'pausada',
      postulantes: 12,
      fechaCreacion: '2025-11-15',
    },
    {
      id: '4',
      titulo: 'Backend Developer Node.js',
      departamento: 'Tecnología',
      ubicacion: 'Remoto',
      modalidad: 'remoto',
      tipoContrato: 'Tiempo Completo',
      salarioMin: '$35,000',
      salarioMax: '$55,000',
      estado: 'activa',
      postulantes: 31,
      fechaCreacion: '2025-11-25',
    },
    {
      id: '5',
      titulo: 'Marketing Digital Specialist',
      departamento: 'Marketing',
      ubicacion: 'Ciudad de México, CDMX',
      modalidad: 'hibrido',
      tipoContrato: 'Tiempo Completo',
      salarioMin: '$25,000',
      salarioMax: '$40,000',
      estado: 'cerrada',
      postulantes: 45,
      fechaCreacion: '2025-11-10',
    },
    {
      id: '6',
      titulo: 'DevOps Engineer',
      departamento: 'Tecnología',
      ubicacion: 'Remoto',
      modalidad: 'remoto',
      tipoContrato: 'Tiempo Completo',
      salarioMin: '$45,000',
      salarioMax: '$65,000',
      estado: 'activa',
      postulantes: 19,
      fechaCreacion: '2025-11-22',
    },
  ]);

  const modalidadConfig = {
    remoto: { label: 'Remoto', color: 'bg-green-100 text-green-700' },
    hibrido: { label: 'Híbrido', color: 'bg-blue-100 text-blue-700' },
    presencial: { label: 'Presencial', color: 'bg-purple-100 text-purple-700' },
  };

  const estadoConfig = {
    activa: { label: 'Activa', color: 'bg-green-100 text-green-700 border-green-200' },
    pausada: { label: 'Pausada', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    cerrada: { label: 'Cerrada', color: 'bg-red-100 text-red-700 border-red-200' },
  };

  // Filtrar vacantes
  const vacantesFiltradas = vacantes.filter((v) => {
    const matchesBusqueda =
      v.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      v.departamento.toLowerCase().includes(busqueda.toLowerCase());
    const matchesEstado = filtroEstado === 'todos' || v.estado === filtroEstado;
    return matchesBusqueda && matchesEstado;
  });

  // Estadísticas
  const stats = {
    total: vacantes.length,
    activas: vacantes.filter((v) => v.estado === 'activa').length,
    totalPostulantes: vacantes.reduce((acc, v) => acc + v.postulantes, 0),
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver
            </button>
          </div>
          <Link
            href="/dashboard/nueva-vacante"
            className="flex items-center gap-2 px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg font-medium transition-all transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Nueva Vacante
          </Link>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Gestión de Vacantes</h1>
          <p className="text-neutral-600 mt-2">
            Administra todas las ofertas de trabajo publicadas
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Total de Vacantes</p>
                <p className="text-3xl font-bold text-neutral-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Vacantes Activas</p>
                <p className="text-3xl font-bold text-green-600">{stats.activas}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">Total Postulantes</p>
                <p className="text-3xl font-bold text-purple-600">{stats.totalPostulantes}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filtros */}
        <Card>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Buscar por título o departamento..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="pl-11 pr-8 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none appearance-none bg-white"
              >
                <option value="todos">Todos los estados</option>
                <option value="activa">Activas</option>
                <option value="pausada">Pausadas</option>
                <option value="cerrada">Cerradas</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Lista de Vacantes */}
        <div className="space-y-4">
          {vacantesFiltradas.length === 0 ? (
            <Card>
              <p className="text-center text-neutral-600 py-8">
                No se encontraron vacantes que coincidan con tu búsqueda
              </p>
            </Card>
          ) : (
            vacantesFiltradas.map((vacante) => (
              <Card key={vacante.id} className="hover:shadow-lg transition-all duration-300">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Info Principal */}
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Users className="w-6 h-6 text-neutral-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-neutral-900">{vacante.titulo}</h3>
                        <p className="text-sm text-neutral-600">{vacante.departamento}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${estadoConfig[vacante.estado].color}`}
                      >
                        {estadoConfig[vacante.estado].label}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-neutral-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{vacante.ubicacion}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${modalidadConfig[vacante.modalidad].color}`}
                        >
                          {modalidadConfig[vacante.modalidad].label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        <span>
                          {vacante.salarioMin} - {vacante.salarioMax}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(vacante.fechaCreacion).toLocaleDateString('es-ES')}</span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <Users className="w-4 h-4 text-neutral-500" />
                      <span className="text-sm font-medium text-neutral-700">
                        {vacante.postulantes} postulantes
                      </span>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex md:flex-col gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors flex-1 md:flex-initial justify-center">
                      <Eye className="w-4 h-4" />
                      <span className="hidden sm:inline">Ver</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors flex-1 md:flex-initial justify-center">
                      <Edit className="w-4 h-4" />
                      <span className="hidden sm:inline">Editar</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-1 md:flex-initial justify-center">
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Eliminar</span>
                    </button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
