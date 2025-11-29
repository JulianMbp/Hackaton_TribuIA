'use client';

import { FileUpload } from '@/components/common/FileUpload';
import { postulacionService } from '@/lib/api/services';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Briefcase, CheckCircle, DollarSign, Filter, MapPin, Search, X } from 'lucide-react';
import React, { useState } from 'react';

export interface Vacante {
  id: string;
  titulo: string;
  empresa: string;
  modalidad: 'remoto' | 'hibrido' | 'presencial' | null;
  ubicacion: string;
  salario: string;
  categoria: string;
  descripcion: string;
}

interface PropuestasTrabajoProps {
  vacantes: Vacante[];
}

export const PropuestasTrabajo: React.FC<PropuestasTrabajoProps> = ({ vacantes }) => {
  const { user } = useAuth();
  const [busqueda, setBusqueda] = useState('');
  const [filtroModalidad, setFiltroModalidad] = useState<string>('todos');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [vacanteSeleccionada, setVacanteSeleccionada] = useState<Vacante | null>(null);
  const [subiendo, setSubiendo] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'exito' | 'error'; texto: string } | null>(null);

  const modalidadConfig: Record<string, { label: string; color: string }> = {
    remoto: { label: 'Remoto', color: 'bg-green-100 text-green-700' },
    hibrido: { label: 'Híbrido', color: 'bg-blue-100 text-blue-700' },
    presencial: { label: 'Presencial', color: 'bg-purple-100 text-purple-700' },
  };

  const getModalidadConfig = (modalidad: string | null) => {
    if (!modalidad) {
      return { label: 'No especificada', color: 'bg-gray-100 text-gray-700' };
    }
    return modalidadConfig[modalidad] || { label: 'No especificada', color: 'bg-gray-100 text-gray-700' };
  };

  const vacantesFiltradas = vacantes.filter((v) => {
    const matchesBusqueda =
      v.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      v.empresa.toLowerCase().includes(busqueda.toLowerCase()) ||
      v.categoria.toLowerCase().includes(busqueda.toLowerCase());
    const matchesModalidad = filtroModalidad === 'todos' || v.modalidad === filtroModalidad;
    return matchesBusqueda && matchesModalidad;
  });

  const abrirModal = (vacante: Vacante) => {
    setVacanteSeleccionada(vacante);
    setModalAbierto(true);
    setMensaje(null);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setVacanteSeleccionada(null);
    setMensaje(null);
  };

  const handleSubirCV = async (file: File) => {
    if (!vacanteSeleccionada) return;

    setSubiendo(true);
    setMensaje(null);

    try {
      const resultado = await postulacionService.postularse(
        vacanteSeleccionada.id,
        file,
        user?.id
      );

      if (resultado.success) {
        setMensaje({
          tipo: 'exito',
          texto: resultado.data?.warning 
            ? 'CV subido correctamente. Tu postulación está siendo procesada.'
            : '¡Postulación enviada correctamente!',
        });
        
        // Cerrar modal después de 2 segundos
        setTimeout(() => {
          cerrarModal();
          // Recargar la página para actualizar las postulaciones
          if (typeof window !== 'undefined') {
            window.location.reload();
          }
        }, 2000);
      } else {
        setMensaje({
          tipo: 'error',
          texto: resultado.error || 'Error al enviar la postulación',
        });
      }
    } catch (error: any) {
      setMensaje({
        tipo: 'error',
        texto: error.message || 'Error al enviar la postulación',
      });
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-neutral-200">
        <h2 className="text-lg font-bold text-neutral-900 mb-3">Propuestas de Trabajo</h2>

        {/* Filters */}
        <div className="space-y-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Buscar por puesto, empresa, categoría..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none text-sm"
            />
          </div>

          {/* Modalidad Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <select
              value={filtroModalidad}
              onChange={(e) => setFiltroModalidad(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none text-sm"
            >
              <option value="todos">Todas las modalidades</option>
              <option value="remoto">Remoto</option>
              <option value="hibrido">Híbrido</option>
              <option value="presencial">Presencial</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {vacantesFiltradas.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-neutral-600">No se encontraron vacantes</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {vacantesFiltradas.map((vacante) => (
              <div
                key={vacante.id}
                className="p-4 border border-neutral-200 rounded-lg hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-neutral-400"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-base text-neutral-900">{vacante.titulo}</h3>
                    <p className="text-sm text-neutral-600 mt-1">{vacante.empresa}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getModalidadConfig(vacante.modalidad).color}`}
                  >
                    {getModalidadConfig(vacante.modalidad).label}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-2 mb-3">
                  <p className="text-xs text-neutral-600 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {vacante.ubicacion}
                  </p>
                  <p className="text-xs text-neutral-600 flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    {vacante.salario}
                  </p>
                  <p className="text-xs text-neutral-600 flex items-center gap-1">
                    <Briefcase className="w-3 h-3" />
                    {vacante.categoria}
                  </p>
                </div>

                {/* Description */}
                <p className="text-xs text-neutral-700 line-clamp-2 mb-3">
                  {vacante.descripcion}
                </p>

                {/* Action */}
                <button
                  onClick={() => abrirModal(vacante)}
                  className="w-full px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Postularme
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Postulación */}
      {modalAbierto && vacanteSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Header del Modal */}
            <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-neutral-900">Postularme a</h3>
                <p className="text-sm text-neutral-600 mt-1">
                  {vacanteSeleccionada.titulo} - {vacanteSeleccionada.empresa}
                </p>
              </div>
              <button
                onClick={cerrarModal}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                disabled={subiendo}
              >
                <X className="w-5 h-5 text-neutral-600" />
              </button>
            </div>

            {/* Contenido del Modal */}
            <div className="p-6">
              {mensaje && (
                <div
                  className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
                    mensaje.tipo === 'exito'
                      ? 'bg-green-50 text-green-800 border border-green-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {mensaje.tipo === 'exito' ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <X className="w-5 h-5" />
                  )}
                  <p className="text-sm">{mensaje.texto}</p>
                </div>
              )}

              {!mensaje || mensaje.tipo === 'error' ? (
                <>
                  <p className="text-sm text-neutral-600 mb-4">
                    Sube tu CV en formato PDF para postularte a esta vacante. El sistema procesará
                    automáticamente tu información.
                  </p>

                  <FileUpload
                    onUpload={handleSubirCV}
                    acceptedTypes={['application/pdf']}
                    maxSize={10}
                    label="Subir CV (PDF)"
                  />

                  {subiendo && (
                    <div className="mt-4 text-center">
                      <p className="text-sm text-neutral-600">Subiendo y procesando tu CV...</p>
                    </div>
                  )}
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
