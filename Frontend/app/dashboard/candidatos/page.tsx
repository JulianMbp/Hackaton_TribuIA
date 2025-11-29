"use client";
import { Loading } from "@/components/common/Loading";
import { candidatoService, cargoService, HistorialAplicacion, historialService } from "@/lib/api/services";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useNotification } from "@/lib/contexts/NotificationContext";
import { Candidato, Cargo } from "@/lib/types";
import { ArrowLeft, CheckCircle, Clock, LogOut, TrendingUp, Users, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

interface Postulacion {
  id: string;
  cargo: string;
  estado: "Activa" | "Pendiente" | "Cerrada";
  candidatos: EnrichedCandidate[];
}

type CandidateStatus = "aprobado" | "rechazado" | "pendiente";

interface EnrichedCandidate {
  id: string;
  nombre: string;
  profesion: string;
  experiencia: string;
  estado: CandidateStatus;
  fechaPostulacion: string;
}

interface CandidatoSugerido extends EnrichedCandidate {
  match: number;
}

export default function CandidatosDashboard() {
  const router = useRouter();
  const { showNotification } = useNotification();
  const { logout, empresa, user } = useAuth();

  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [historial, setHistorial] = useState<HistorialAplicacion[]>([]);
  const [loading, setLoading] = useState(true);

  // Postulaciones derivadas de cargos + historial de aplicaciones:
  // - Usamos historial_aplicaciones para vincular candidatos a cargos
  // - Si no hay historial, igual mostramos las vacantes con 0 candidatos.
  const postulaciones: Postulacion[] = useMemo(() => {
    if (!cargos.length) return [];

    const map: Record<string, { cargo: Cargo; candidatos: EnrichedCandidate[] }> = {};

    // Inicializar todas las vacantes con 0 candidatos
    cargos.forEach((cargo) => {
      map[cargo.id] = { cargo, candidatos: [] };
    });

    // Crear un mapa de candidatos por ID para acceso rápido
    const candidatosMap = new Map<string, Candidato>();
    candidatos.forEach((c) => {
      candidatosMap.set(c.id, c);
    });

    // Asignar candidatos a sus cargos usando historial_aplicaciones
    historial.forEach((h) => {
      const cargoId = h.cargo_id;
      if (!cargoId || !map[cargoId]) return;

      const candidato = candidatosMap.get(h.candidato_id);
      if (!candidato) return;

      const experiencia =
        typeof candidato.experiencia_anios === 'number'
          ? `${candidato.experiencia_anios} años`
          : 'Sin dato';

      const profesion = candidato.skills || 'Perfil general';

      const fechaPostulacion = h.fecha
        ? new Date(h.fecha).toISOString().slice(0, 10)
        : candidato.created_at
        ? new Date(candidato.created_at).toISOString().slice(0, 10)
        : '';

      // Mapear estado del historial al estado del candidato
      let estado: CandidateStatus = 'pendiente';
      const estadoLower = (h.estado || '').toLowerCase();
      if (estadoLower.includes('aprobado') || estadoLower.includes('approved') || estadoLower.includes('aceptado')) {
        estado = 'aprobado';
      } else if (estadoLower.includes('rechazado') || estadoLower.includes('rejected') || estadoLower.includes('rechaz')) {
        estado = 'rechazado';
      } else {
        estado = 'pendiente';
      }

      map[cargoId].candidatos.push({
        id: candidato.id,
        nombre: candidato.nombre,
        profesion,
        experiencia,
        estado,
        fechaPostulacion,
      });
    });

    // Transformar a estructura de Postulacion
    const result: Postulacion[] = Object.values(map).map(({ cargo, candidatos }) => {
      const estadoCargo = (cargo.estado || '').toLowerCase();
      const estado: Postulacion['estado'] =
        estadoCargo === 'activo'
          ? 'Activa'
          : estadoCargo === 'pausado'
          ? 'Pendiente'
          : 'Cerrada';

      return {
        id: cargo.id,
        cargo: cargo.nombre,
        estado,
        candidatos,
      };
    });

    // Ordenamos por fecha de creación descendente
    return result.sort((a, b) => {
      const ca = cargos.find((c) => c.id === a.id)?.created_at || '';
      const cb = cargos.find((c) => c.id === b.id)?.created_at || '';
      return cb.localeCompare(ca);
    });
  }, [cargos, candidatos, historial]);

  // Candidatos sugeridos simples: top por años de experiencia
  const sugeridos: CandidatoSugerido[] = useMemo(() => {
    if (!candidatos.length) return [];

    const enriched = candidatos.map<CandidatoSugerido>((c) => {
      const experiencia =
        typeof c.experiencia_anios === 'number'
          ? `${c.experiencia_anios} años`
          : 'Sin dato';

      const profesion = c.skills || 'Perfil general';

      // Match simple basado en años de experiencia (normalizado máximo 10)
      const exp = typeof c.experiencia_anios === 'number' ? c.experiencia_anios : 0;
      const match = Math.min(100, Math.max(50, Math.round((exp / 10) * 100)));

      const fechaPostulacion = c.created_at
        ? new Date(c.created_at).toISOString().slice(0, 10)
        : '';

      return {
        id: c.id,
        nombre: c.nombre,
        profesion,
        experiencia,
        estado: 'pendiente',
        fechaPostulacion,
        match,
      };
    });

    // Ordenamos por match descendente y nos quedamos con los primeros 5
    return enriched.sort((a, b) => b.match - a.match).slice(0, 5);
  }, [candidatos]);

  const [selectedCandidate, setSelectedCandidate] = useState<CandidatoSugerido | null>(null);
  const [selectedPostulacion, setSelectedPostulacion] = useState<Postulacion | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [cargosRes, candidatosRes, historialRes] = await Promise.all([
          cargoService.getAll(),
          candidatoService.getAll(),
          historialService.getAll(),
        ]);

        if (cargosRes.success && cargosRes.data) {
          setCargos(cargosRes.data);
        }

        if (candidatosRes.success && candidatosRes.data) {
          setCandidatos(candidatosRes.data);
        }

        if (historialRes.success && historialRes.data) {
          setHistorial(historialRes.data);
        }
      } catch (error) {
        console.error(error);
        showNotification('error', 'No se pudieron cargar candidatos y vacantes');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [showNotification]);

  useEffect(() => {
    if (!selectedCandidate && sugeridos.length > 0) {
      setSelectedCandidate(sugeridos[0]);
    }
  }, [sugeridos, selectedCandidate]);

  const calcularEstadisticas = (candidatos: EnrichedCandidate[]) => {
    const total = candidatos.length;
    const aprobados = candidatos.filter(c => c.estado === "aprobado").length;
    const rechazados = candidatos.filter(c => c.estado === "rechazado").length;
    const pendientes = candidatos.filter(c => c.estado === "pendiente").length;
    const tasaAprobacion = total > 0 ? Math.round((aprobados / total) * 100) : 0;

    return { total, aprobados, rechazados, pendientes, tasaAprobacion };
  };

  const getEstadoBadgeClass = (estado: string) => {
    const classes = {
      aprobado: "bg-emerald-50 text-emerald-700 border-emerald-200",
      rechazado: "bg-red-50 text-red-700 border-red-200",
      pendiente: "bg-amber-50 text-amber-700 border-amber-200"
    };
    return classes[estado as keyof typeof classes] || "";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-50 p-6">
        <Loading text="Cargando candidatos y postulaciones..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-50 p-6 relative overflow-hidden">
      {/* Efectos de fondo decorativos */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-100/30 to-blue-100/30 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-emerald-100/30 to-cyan-100/30 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header con efecto glassmorphism */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-neutral-200/50 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-900 hover:text-white rounded-lg transition-all duration-300 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Volver
            </button>
            <div className="flex items-center gap-4">
              {(empresa || user) && (
                <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    {(empresa?.nombre || user?.nombre || 'E').charAt(0).toUpperCase()}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-neutral-900">
                      {empresa?.nombre || user?.nombre || 'Empresa'}
                    </p>
                    <p className="text-xs text-neutral-600">
                      {empresa?.email || user?.email || ''}
                    </p>
                  </div>
                </div>
              )}
              <button
                onClick={() => {
                  logout();
                  router.push('/');
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-all duration-300 group border border-red-200 hover:border-red-300"
              >
                <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                Cerrar sesión
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-1 h-12 bg-gradient-to-b from-purple-500 via-blue-500 to-emerald-500 rounded-full"></div>
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Dashboard de Candidatos</h1>
              <p className="text-neutral-600 mt-1">Gestiona postulaciones y revisa candidatos sugeridos</p>
            </div>
          </div>
        </div>

        {/* Grid Principal - POSTULACIONES COMO PROTAGONISTA */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LISTA DE POSTULACIONES - PROTAGONISTA (60% del espacio) */}
          <div className="lg:col-span-2 bg-white/90 backdrop-blur-sm border-2 border-neutral-900 rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 space-y-6 relative overflow-hidden group">
            {/* Efecto de brillo sutil */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 bg-gradient-to-r from-neutral-900 to-neutral-700 bg-clip-text">
                    Postulaciones creadas
                  </h2>
                  <p className="text-neutral-600 mt-1">Gestiona tus vacantes publicadas y candidatos</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg animate-pulse-subtle">
                ⭐ Principal
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
              {postulaciones.map((p, index) => {
                const stats = calcularEstadisticas(p.candidatos);
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPostulacion(p)}
                    style={{ animationDelay: `${index * 100}ms` }}
                    className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-500 hover:shadow-2xl animate-fade-in-up relative overflow-hidden ${
                      selectedPostulacion?.id === p.id
                        ? "bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white border-neutral-900 shadow-2xl scale-[1.02] ring-4 ring-neutral-900/10"
                        : "bg-white/80 backdrop-blur-sm hover:bg-white border-neutral-200 hover:border-neutral-400 hover:-translate-y-1"
                    }`}
                  >
                    {/* Efecto de brillo en hover */}
                    <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ${
                      selectedPostulacion?.id === p.id ? "opacity-20" : "opacity-0 group-hover:opacity-100"
                    }`}></div>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <p className="font-bold text-lg mb-2">{p.cargo}</p>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          selectedPostulacion?.id === p.id
                            ? "bg-white/20 text-white"
                            : p.estado === "Activa" ? "bg-emerald-100 text-emerald-700" :
                              p.estado === "Pendiente" ? "bg-amber-100 text-amber-700" :
                              "bg-neutral-100 text-neutral-700"
                        }`}>
                          {p.estado}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${selectedPostulacion?.id === p.id ? "text-neutral-300" : "text-neutral-600"}`}>
                          Total candidatos
                        </span>
                        <span className={`font-bold text-xl ${selectedPostulacion?.id === p.id ? "text-white" : "text-neutral-900"}`}>
                          {stats.total}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-neutral-200">
                        <div className="text-center">
                          <p className={`text-xs ${selectedPostulacion?.id === p.id ? "text-neutral-300" : "text-neutral-600"}`}>Aprobados</p>
                          <p className={`font-bold text-lg ${selectedPostulacion?.id === p.id ? "text-emerald-300" : "text-emerald-600"}`}>
                            {stats.aprobados}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className={`text-xs ${selectedPostulacion?.id === p.id ? "text-neutral-300" : "text-neutral-600"}`}>Pendientes</p>
                          <p className={`font-bold text-lg ${selectedPostulacion?.id === p.id ? "text-amber-300" : "text-amber-600"}`}>
                            {stats.pendientes}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className={`text-xs ${selectedPostulacion?.id === p.id ? "text-neutral-300" : "text-neutral-600"}`}>Rechazados</p>
                          <p className={`font-bold text-lg ${selectedPostulacion?.id === p.id ? "text-red-300" : "text-red-600"}`}>
                            {stats.rechazados}
                          </p>
                        </div>
                      </div>

                      <div className={`pt-3 border-t ${selectedPostulacion?.id === p.id ? "border-white/20" : "border-neutral-200"}`}>
                        <div className="flex items-center justify-between">
                          <span className={`text-xs ${selectedPostulacion?.id === p.id ? "text-neutral-300" : "text-neutral-600"}`}>
                            Tasa de aprobación
                          </span>
                          <span className={`font-bold ${selectedPostulacion?.id === p.id ? "text-white" : "text-purple-600"}`}>
                            {stats.tasaAprobacion}%
                          </span>
                        </div>
                        <div className={`mt-2 h-2 rounded-full overflow-hidden ${selectedPostulacion?.id === p.id ? "bg-white/20" : "bg-neutral-100"}`}>
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500"
                            style={{ width: `${stats.tasaAprobacion}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* COLUMNA DERECHA - SUGERENCIAS Y PERFIL (40% del espacio) */}
          <div className="lg:col-span-1 space-y-6">
            {/* SUGERENCIAS DE CANDIDATOS */}
            <div className="bg-white/90 backdrop-blur-sm border border-neutral-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 space-y-3">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-neutral-900">Candidatos sugeridos</h2>
              </div>
              <div className="space-y-2">
                {sugeridos.map((c, index) => (
                  <div
                    key={c.id}
                    style={{ animationDelay: `${index * 150}ms` }}
                    className="p-4 border border-neutral-200 rounded-xl hover:bg-gradient-to-br hover:from-emerald-50 hover:to-cyan-50 cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-emerald-300 hover:-translate-y-0.5 group animate-fade-in-up"
                    onClick={() => setSelectedCandidate(c)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-neutral-900">{c.nombre}</p>
                        <p className="text-sm text-neutral-600">{c.profesion}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-emerald-600">{c.match}%</p>
                        <p className="text-xs text-neutral-500">Match</p>
                      </div>
                    </div>
                    <div className="mt-3 h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-300"
                        style={{ width: `${c.match}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* VISTA RÁPIDA DEL CANDIDATO */}
            <div className="bg-white/90 backdrop-blur-sm border border-neutral-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-neutral-900">Perfil recomendado</h2>
              </div>
              {selectedCandidate ? (
                <div className="space-y-4 animate-fade-in">
                  <div className="bg-gradient-to-br from-purple-100 via-blue-100 to-emerald-100 w-24 h-24 rounded-full mx-auto flex items-center justify-center shadow-lg ring-4 ring-white">
                    <span className="text-3xl font-bold bg-gradient-to-br from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      {selectedCandidate.nombre.charAt(0)}
                    </span>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-lg text-neutral-900">{selectedCandidate.nombre}</p>
                    <p className="text-sm text-neutral-600">{selectedCandidate.profesion}</p>
                  </div>
                  <div className="space-y-3 pt-4 border-t border-neutral-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-600">Experiencia:</span>
                      <span className="font-medium text-neutral-900">{selectedCandidate.experiencia}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-600">Match:</span>
                      <span className="font-bold text-emerald-600">{selectedCandidate.match}%</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-neutral-500 text-sm text-center py-8">Selecciona un candidato para ver detalles</p>
              )}
            </div>
          </div>
        </div>

        {/* SECCIÓN DE ESTADÍSTICAS Y CANDIDATOS DE POSTULACIÓN SELECCIONADA */}
        {selectedPostulacion && (
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900">{selectedPostulacion.cargo}</h2>
                <p className="text-neutral-600">Detalle de candidatos y estadísticas</p>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                selectedPostulacion.estado === "Activa" ? "bg-emerald-100 text-emerald-700" :
                selectedPostulacion.estado === "Pendiente" ? "bg-amber-100 text-amber-700" :
                "bg-neutral-100 text-neutral-700"
              }`}>
                {selectedPostulacion.estado}
              </span>
            </div>

            {/* Tarjetas de Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {(() => {
                const stats = calcularEstadisticas(selectedPostulacion.candidatos);
                return (
                  <>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-blue-700 font-medium">Total</p>
                          <p className="text-3xl font-bold text-blue-900 mt-1">{stats.total}</p>
                        </div>
                        <Users className="w-8 h-8 text-blue-600" />
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-emerald-700 font-medium">Aprobados</p>
                          <p className="text-3xl font-bold text-emerald-900 mt-1">{stats.aprobados}</p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-emerald-600" />
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border border-red-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-red-700 font-medium">Rechazados</p>
                          <p className="text-3xl font-bold text-red-900 mt-1">{stats.rechazados}</p>
                        </div>
                        <XCircle className="w-8 h-8 text-red-600" />
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border border-amber-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-amber-700 font-medium">Pendientes</p>
                          <p className="text-3xl font-bold text-amber-900 mt-1">{stats.pendientes}</p>
                        </div>
                        <Clock className="w-8 h-8 text-amber-600" />
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Tasa de aprobación */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                  <div>
                    <p className="text-sm text-purple-700 font-medium">Tasa de Aprobación</p>
                    <p className="text-3xl font-bold text-purple-900 mt-1">
                      {calcularEstadisticas(selectedPostulacion.candidatos).tasaAprobacion}%
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-purple-600">
                    {calcularEstadisticas(selectedPostulacion.candidatos).aprobados} de {calcularEstadisticas(selectedPostulacion.candidatos).total} candidatos
                  </p>
                </div>
              </div>
            </div>

            {/* Lista de Candidatos */}
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Candidatos Postulados</h3>
              <div className="space-y-3">
                {selectedPostulacion.candidatos.map((candidato) => (
                  <div
                    key={candidato.id}
                    className="flex items-center justify-between p-4 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-all duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-gradient-to-br from-neutral-100 to-neutral-200 w-12 h-12 rounded-full flex items-center justify-center">
                        <span className="text-lg font-bold text-neutral-600">
                          {candidato.nombre.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-neutral-900">{candidato.nombre}</p>
                        <p className="text-sm text-neutral-600">{candidato.profesion} • {candidato.experiencia}</p>
                        <p className="text-xs text-neutral-500 mt-1">Postulado: {candidato.fechaPostulacion}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium border ${getEstadoBadgeClass(candidato.estado)}`}>
                      {candidato.estado.charAt(0).toUpperCase() + candidato.estado.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulseSuttle {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.95;
            transform: scale(1.02);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.4s ease-out;
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
          opacity: 0;
        }

        .animate-pulse-subtle {
          animation: pulseSuttle 3s ease-in-out infinite;
        }

        .shadow-3xl {
          box-shadow: 0 35px 60px -15px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </div>
  );
}