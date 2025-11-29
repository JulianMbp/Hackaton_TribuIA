'use client';

import { MisPostulaciones, Postulacion } from '@/components/candidato/MisPostulaciones';
import { PerfilCandidato, PerfilData } from '@/components/candidato/PerfilCandidato';
import { PropuestasTrabajo, Vacante } from '@/components/candidato/PropuestasTrabajo';
import { Loading } from '@/components/common/Loading';
import { candidatoService, cargoService, historialService } from '@/lib/api/services';
import { useAuth } from '@/lib/contexts/AuthContext';
import { ArrowLeft, Bell, LogOut, UserCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PanelCandidatoPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [postulaciones, setPostulaciones] = useState<Postulacion[]>([]);
  const [vacantes, setVacantes] = useState<Vacante[]>([]);
  const [perfil, setPerfil] = useState<PerfilData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user.role !== 'candidato') {
      router.push('/');
      return;
    }

    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      // Cargar datos en paralelo
      const [perfilRes, postulacionesRes, vacantesRes] = await Promise.all([
        candidatoService.getById(user.id),
        historialService.getByCandidato(user.id),
        cargoService.getAll(),
      ]);

      // Procesar perfil
      if (perfilRes.success && perfilRes.data) {
        const candidato = perfilRes.data;
        const skills = candidato.skills
          ? candidato.skills.split(',').map((s: string) => s.trim()).filter(Boolean)
          : [];
        
        // Calcular completitud del perfil
        let completitud = 0;
        if (candidato.nombre) completitud += 15;
        if (candidato.email) completitud += 10;
        if (candidato.telefono) completitud += 10;
        if (candidato.experiencia_anios !== null && candidato.experiencia_anios !== undefined) completitud += 15;
        if (candidato.educacion) completitud += 10;
        if (skills.length > 0) completitud += 15;
        if (candidato.descripcion) completitud += 10;
        if (candidato.portafolio_url || candidato.github_url) completitud += 15;

        setPerfil({
          nombre: candidato.nombre,
          rol: candidato.cargo_aplicado || 'Candidato',
          experiencia: candidato.experiencia_anios
            ? `${candidato.experiencia_anios} ${candidato.experiencia_anios === 1 ? 'año' : 'años'} de experiencia`
            : 'Sin experiencia especificada',
          skills: skills.length > 0 ? skills : ['Sin habilidades especificadas'],
          completitud: Math.min(completitud, 100),
        });
      }

      // Procesar postulaciones
      if (postulacionesRes.success && postulacionesRes.data) {
        const postulacionesData = postulacionesRes.data.map((hist: any) => {
          // Mapear estados de la BD a los estados del componente
          let estado: 'pendiente' | 'entrevista' | 'rechazado' | 'aceptado' = 'pendiente';
          if (hist.estado === 'aplicado') estado = 'pendiente';
          else if (hist.estado === 'revisado') estado = 'entrevista';
          else if (hist.estado === 'rechazado') estado = 'rechazado';
          else if (hist.estado === 'contratado') estado = 'aceptado';

          return {
            id: hist.id,
            puesto: hist.cargo_nombre || 'Sin nombre',
            empresa: hist.empresa_nombre || 'Sin empresa',
            estado,
            fecha: hist.fecha || new Date().toISOString(),
          };
        });
        setPostulaciones(postulacionesData);
      }

      // Procesar vacantes
      if (vacantesRes.success && vacantesRes.data) {
        const vacantesData = vacantesRes.data
          .filter((cargo: any) => cargo.estado === 'activo')
          .map((cargo: any) => {
            // Formatear salario
            let salario = 'No especificado';
            if (cargo.salario_min && cargo.salario_max) {
              salario = `$${cargo.salario_min.toLocaleString()}-$${cargo.salario_max.toLocaleString()}`;
            } else if (cargo.salario_min) {
              salario = `Desde $${cargo.salario_min.toLocaleString()}`;
            } else if (cargo.salario_max) {
              salario = `Hasta $${cargo.salario_max.toLocaleString()}`;
            }

            // Obtener categoría de skills o nivel de experiencia
            const categoria = cargo.nivel_experiencia || 'General';

            // Formatear ubicación
            let ubicacion = 'No especificada';
            if (cargo.empresa_ciudad && cargo.empresa_pais) {
              ubicacion = `${cargo.empresa_ciudad}, ${cargo.empresa_pais}`;
            } else if (cargo.empresa_ciudad) {
              ubicacion = cargo.empresa_ciudad;
            } else if (cargo.empresa_pais) {
              ubicacion = cargo.empresa_pais;
            }

            // Normalizar modalidad - convertir a minúsculas y validar
            let modalidad: 'remoto' | 'hibrido' | 'presencial' | null = null;
            if (cargo.modalidad) {
              const modalidadLower = cargo.modalidad.toLowerCase();
              if (modalidadLower === 'remoto' || modalidadLower === 'híbrido' || modalidadLower === 'hibrido') {
                modalidad = modalidadLower === 'híbrido' ? 'hibrido' : modalidadLower as 'remoto' | 'hibrido';
              } else if (modalidadLower === 'presencial') {
                modalidad = 'presencial';
              }
            }

            return {
              id: cargo.id,
              titulo: cargo.nombre,
              empresa: cargo.empresa_nombre || 'Empresa',
              modalidad,
              ubicacion,
              salario,
              categoria,
              descripcion: cargo.descripcion || 'Sin descripción disponible',
            };
          });
        setVacantes(vacantesData);
      }
    } catch (err: any) {
      console.error('Error cargando datos:', err);
      setError('Error al cargar los datos. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      localStorage.removeItem('token');
    }
    logout();
    router.push('/');
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
        {loading ? (
          <div className="flex items-center justify-center min-h-[600px]">
            <Loading />
          </div>
        ) : error ? (
          <div className="max-w-[1600px] mx-auto">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800 text-center">{error}</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-[1600px] mx-auto">
            {/* Left Column - Postulaciones (25% on desktop) */}
            <div className="lg:col-span-1 h-[600px] lg:h-[800px]">
              <MisPostulaciones postulaciones={postulaciones} />
            </div>

            {/* Center Column - Propuestas (50% on desktop) */}
            <div className="lg:col-span-2 h-[600px] lg:h-[800px]">
              <PropuestasTrabajo vacantes={vacantes} />
            </div>

            {/* Right Column - Perfil (25% on desktop) */}
            <div className="lg:col-span-1 h-[600px] lg:h-[800px]">
              {perfil ? <PerfilCandidato perfil={perfil} /> : (
                <div className="bg-white rounded-xl border border-neutral-200 h-full flex items-center justify-center">
                  <p className="text-sm text-neutral-600">No se pudo cargar el perfil</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
