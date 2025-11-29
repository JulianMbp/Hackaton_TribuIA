'use client';

import { FileUpload } from '@/components/common/FileUpload';
import { postulacionService } from '@/lib/api/services';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Briefcase, Check, CheckCircle, DollarSign, Filter, MapPin, Search, X } from 'lucide-react';
import React, { useState } from 'react';

export interface Vacante {
  id: string;
  titulo: string;
  empresa: string;
  modalidad: 'remoto' | 'hibrido' | 'presencial';
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
  const [vacantesPostuladas, setVacantesPostuladas] = useState<Set<string>>(new Set());
  const [modalAbierto, setModalAbierto] = useState(false);
  const [vacanteSeleccionada, setVacanteSeleccionada] = useState<Vacante | null>(null);
  const [subiendo, setSubiendo] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'exito' | 'error'; texto: string } | null>(null);

  const modalidadConfig = {
    remoto: { label: 'Remoto', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' },
    hibrido: { label: 'Híbrido', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' },
    presencial: { label: 'Presencial', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' },
  };

  const vacantesFiltradas = vacantes.filter((v) => {
    const matchesBusqueda =
      v.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      v.empresa.toLowerCase().includes(busqueda.toLowerCase()) ||
      v.categoria.toLowerCase().includes(busqueda.toLowerCase());
    const matchesModalidad = filtroModalidad === 'todos' || v.modalidad === filtroModalidad;
    return matchesBusqueda && matchesModalidad;
  });

  const handlePostular = (vacante: Vacante) => {
    setVacanteSeleccionada(vacante);
    setModalAbierto(true);
    setMensaje(null);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setVacanteSeleccionada(null);
    setMensaje(null);
    setSubiendo(false);
  };

  const handleSubirCV = async (file: File) => {
    if (!vacanteSeleccionada || !user) {
      setMensaje({
        tipo: 'error',
        texto: 'Error: No se pudo identificar la vacante o el usuario.',
      });
      return;
    }

    setSubiendo(true);
    setMensaje(null);

    try {
      const candidatoId = user.id || undefined;
      const response = await postulacionService.postularse(
        vacanteSeleccionada.id,
        file,
        candidatoId
      );

      if (response.success) {
        setMensaje({
          tipo: 'exito',
          texto: '¡Postulación exitosa! Tu CV ha sido procesado y pronto te notificaremos sobre el estado de tu postulación.',
        });
        setVacantesPostuladas((prev) => new Set(prev).add(vacanteSeleccionada.id));
        
        // Cerrar el modal después de 3 segundos
        setTimeout(() => {
          cerrarModal();
        }, 3000);
      } else {
        setMensaje({
          tipo: 'error',
          texto: response.message || 'Error al procesar tu postulación. Por favor, intenta nuevamente.',
        });
      }
    } catch (error) {
      setMensaje({
        tipo: 'error',
        texto: 'Error inesperado al subir tu CV. Por favor, intenta nuevamente.',
      });
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 h-full flex flex-col transition-colors duration-300">
      {/* Header */}
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
        <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-3 transition-colors duration-300">Propuestas de Trabajo</h2>

        {/* Filters */}
        <div className="space-y-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-neutral-500" />
            <input
              type="text"
              placeholder="Buscar por puesto, empresa, categoría..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 rounded-lg focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-500 focus:border-transparent outline-none text-sm transition-colors duration-300"
            />
          </div>

          {/* Modalidad Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-neutral-500" />
            <select
              value={filtroModalidad}
              onChange={(e) => setFiltroModalidad(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-lg focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-500 focus:border-transparent outline-none text-sm transition-colors duration-300"
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
            <p className="text-sm text-neutral-600 dark:text-neutral-400 transition-colors duration-300">No se encontraron vacantes</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {vacantesFiltradas.map((vacante) => (
              <div
                key={vacante.id}
                className="p-4 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800/50 rounded-lg hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-neutral-400 dark:hover:border-neutral-600"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-base text-neutral-900 dark:text-white transition-colors duration-300">{vacante.titulo}</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 transition-colors duration-300">{vacante.empresa}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium transition-colors duration-300 ${modalidadConfig[vacante.modalidad].color}`}
                  >
                    {modalidadConfig[vacante.modalidad].label}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-2 mb-3">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 flex items-center gap-1 transition-colors duration-300">
                    <MapPin className="w-3 h-3" />
                    {vacante.ubicacion}
                  </p>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 flex items-center gap-1 transition-colors duration-300">
                    <DollarSign className="w-3 h-3" />
                    {vacante.salario}
                  </p>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 flex items-center gap-1 transition-colors duration-300">
                    <Briefcase className="w-3 h-3" />
                    {vacante.categoria}
                  </p>
                </div>

                {/* Description */}
                <p className="text-xs text-neutral-700 dark:text-neutral-300 line-clamp-2 mb-3 transition-colors duration-300">
                  {vacante.descripcion}
                </p>

                {/* Action */}
                {vacantesPostuladas.has(vacante.id) ? (
                  <button
                    disabled
                    className="w-full px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 cursor-not-allowed"
                  >
                    <Check className="w-4 h-4" />
                    Aplicaste para este puesto
                  </button>
                ) : (
                  <button
                    onClick={() => handlePostular(vacante)}
                    className="w-full px-4 py-2 bg-neutral-900 dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-100 text-white dark:text-neutral-900 rounded-lg text-sm font-medium transition-colors duration-300"
                  >
                    Postularme
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Postulación */}
      {modalAbierto && vacanteSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-neutral-800 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto transition-colors duration-300">
            {/* Header del Modal */}
            <div className="p-6 border-b border-neutral-200 dark:border-neutral-700 flex items-center justify-between transition-colors duration-300">
              <div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white transition-colors duration-300">Postularme a</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 transition-colors duration-300">
                  {vacanteSeleccionada.titulo} - {vacanteSeleccionada.empresa}
                </p>
              </div>
              <button
                onClick={cerrarModal}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                disabled={subiendo}
              >
                <X className="w-5 h-5 text-neutral-600 dark:text-neutral-400 transition-colors duration-300" />
              </button>
            </div>

            {/* Contenido del Modal */}
            <div className="p-6">
              {mensaje && (
                <div
                  className={`mb-4 p-3 rounded-lg flex items-center gap-2 transition-colors duration-300 ${
                    mensaje.tipo === 'exito'
                      ? 'bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-800'
                      : 'bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-800'
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
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 transition-colors duration-300">
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
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 transition-colors duration-300">Subiendo y procesando tu CV...</p>
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
