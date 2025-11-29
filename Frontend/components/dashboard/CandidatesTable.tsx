'use client';

import React, { useState } from 'react';
import { Search, Eye, ChevronLeft, ChevronRight } from 'lucide-react';

export interface Candidate {
  id: string;
  nombre: string;
  puesto: string;
  estado: 'nuevo' | 'en_proceso' | 'entrevista' | 'rechazado' | 'contratado';
  fecha: string;
  avatar?: string;
}

interface CandidatesTableProps {
  candidates: Candidate[];
}

export const CandidatesTable: React.FC<CandidatesTableProps> = ({ candidates }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState<string>('todos');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const estadoConfig = {
    nuevo: { label: 'Nuevo', color: 'bg-blue-100 text-blue-700' },
    en_proceso: { label: 'En proceso', color: 'bg-yellow-100 text-yellow-700' },
    entrevista: { label: 'Entrevista', color: 'bg-purple-100 text-purple-700' },
    rechazado: { label: 'Rechazado', color: 'bg-red-100 text-red-700' },
    contratado: { label: 'Contratado', color: 'bg-green-100 text-green-700' },
  };

  // Filtrar candidatos
  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      candidate.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.puesto.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstado = filterEstado === 'todos' || candidate.estado === filterEstado;
    return matchesSearch && matchesEstado;
  });

  // Paginación
  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCandidates = filteredCandidates.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-white rounded-xl border border-neutral-200">
      {/* Header */}
      <div className="p-6 border-b border-neutral-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-xl font-bold text-neutral-900">Candidatos Postulados</h2>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Buscar candidato..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none text-sm"
              />
            </div>

            {/* Filter */}
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none text-sm"
            >
              <option value="todos">Todos los estados</option>
              <option value="nuevo">Nuevos</option>
              <option value="en_proceso">En proceso</option>
              <option value="entrevista">Entrevista</option>
              <option value="rechazado">Rechazados</option>
              <option value="contratado">Contratados</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider">
                Candidato
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider">
                Puesto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-700 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {paginatedCandidates.map((candidate) => (
              <tr key={candidate.id} className="hover:bg-neutral-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-neutral-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-neutral-700">
                        {candidate.nombre.charAt(0)}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-neutral-900">{candidate.nombre}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                  {candidate.puesto}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${estadoConfig[candidate.estado].color}`}>
                    {estadoConfig[candidate.estado].label}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                  {new Date(candidate.fecha).toLocaleDateString('es-ES')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                    Ver perfil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-neutral-200 flex items-center justify-between">
        <p className="text-sm text-neutral-600">
          Mostrando {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredCandidates.length)} de {filteredCandidates.length} candidatos
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 border border-neutral-300 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-4 py-1.5 text-sm text-neutral-700">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 border border-neutral-300 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
