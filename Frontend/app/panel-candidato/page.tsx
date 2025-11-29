'use client';

import { MisPostulaciones, Postulacion } from '@/components/candidato/MisPostulaciones';
import { PerfilCandidato, PerfilData } from '@/components/candidato/PerfilCandidato';
import { PropuestasTrabajo, Vacante } from '@/components/candidato/PropuestasTrabajo';
import { AnimatedLogo } from '@/components/common/AnimatedLogo';
import { Loading } from '@/components/common/Loading';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { candidatoService, cargoService, HistorialAplicacion, historialService } from '@/lib/api/services';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Candidato } from '@/lib/types';
import { ArrowLeft, Bell, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PanelCandidatoPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [postulaciones, setPostulaciones] = useState<Postulacion[]>([]);
  const [vacantes, setVacantes] = useState<Vacante[]>([]);
  const [perfil, setPerfil] = useState<PerfilData | null>(null);

  // Función para mapear historial a postulaciones
  const mapHistorialToPostulaciones = (historial: HistorialAplicacion[]): Postulacion[] => {
    return historial.map((item) => {
      // Mapear estados del backend a los estados del frontend
      let estado: 'pendiente' | 'entrevista' | 'rechazado' | 'aceptado' = 'pendiente';
      const estadoLower = (item.estado || '').toLowerCase();
      
      if (estadoLower.includes('entrevista') || estadoLower.includes('interview')) {
        estado = 'entrevista';
      } else if (estadoLower.includes('rechazado') || estadoLower.includes('rejected') || estadoLower.includes('rechaz')) {
        estado = 'rechazado';
      } else if (estadoLower.includes('aceptado') || estadoLower.includes('approved') || estadoLower.includes('acept')) {
        estado = 'aceptado';
      } else {
        estado = 'pendiente';
      }

      return {
        id: item.id,
        puesto: item.cargo_nombre || 'Sin título',
        empresa: item.empresa_nombre || 'Sin empresa',
        estado,
        fecha: item.fecha || new Date().toISOString(),
      };
    });
  };

  // Función para mapear cargos a vacantes
  const mapCargosToVacantes = (cargos: any[]): Vacante[] => {
    return cargos
      .filter((cargo) => cargo.estado === 'activo' || !cargo.estado) // Solo cargos activos
      .map((cargo) => {
        // Formatear salario
        let salario = 'No especificado';
        if (cargo.salario_min && cargo.salario_max) {
          salario = `$${cargo.salario_min}k-$${cargo.salario_max}k`;
        } else if (cargo.salario_min) {
          salario = `Desde $${cargo.salario_min}k`;
        } else if (cargo.salario_max) {
          salario = `Hasta $${cargo.salario_max}k`;
        }

        // Formatear ubicación (usar ciudad de la empresa si está disponible)
        let ubicacion = 'No especificada';
        if (cargo.empresa_ciudad) {
          ubicacion = cargo.empresa_ciudad;
          if (cargo.empresa_pais) {
            ubicacion += `, ${cargo.empresa_pais}`;
          }
        } else if (cargo.empresa_pais) {
          ubicacion = cargo.empresa_pais;
        }

        // Normalizar modalidad
        let modalidad: 'remoto' | 'hibrido' | 'presencial' = 'presencial';
        const modalidadLower = (cargo.modalidad || '').toLowerCase();
        if (modalidadLower.includes('remoto') || modalidadLower.includes('remote')) {
          modalidad = 'remoto';
        } else if (modalidadLower.includes('hibrido') || modalidadLower.includes('hybrid')) {
          modalidad = 'hibrido';
        }

        return {
          id: cargo.id,
          titulo: cargo.nombre,
          empresa: cargo.empresa_nombre || 'Empresa',
          modalidad,
          ubicacion,
          salario,
          categoria: cargo.nivel_experiencia || 'General',
          descripcion: cargo.descripcion || 'Sin descripción disponible',
        };
      });
  };

  // Función para mapear candidato a perfil
  const mapCandidatoToPerfil = (candidato: Candidato): PerfilData => {
    // Calcular completitud del perfil
    let completitud = 0;
    if (candidato.nombre) completitud += 10;
    if (candidato.email) completitud += 10;
    if (candidato.telefono) completitud += 10;
    if (candidato.pais || candidato.ciudad) completitud += 10;
    if (candidato.experiencia_anios !== null && candidato.experiencia_anios !== undefined) completitud += 15;
    if (candidato.educacion) completitud += 15;
    if (candidato.skills) completitud += 15;
    if (candidato.descripcion) completitud += 15;

    // Parsear skills
    const skills = candidato.skills
      ? candidato.skills.split(',').map((s) => s.trim()).filter((s) => s.length > 0)
      : [];

    // Formatear experiencia
    const experiencia = candidato.experiencia_anios
      ? `${candidato.experiencia_anios} ${candidato.experiencia_anios === 1 ? 'año' : 'años'} de experiencia`
      : 'Sin experiencia especificada';

    return {
      nombre: candidato.nombre || 'Sin nombre',
      rol: candidato.descripcion || 'Candidato',
      experiencia,
      skills: skills.length > 0 ? skills : ['Sin habilidades especificadas'],
      completitud: Math.min(completitud, 100),
    };
  };

  // Cargar datos del backend
  useEffect(() => {
    const cargarDatos = async () => {
      if (!user || !user.id) {
        setError('No se pudo identificar al usuario. Por favor, inicia sesión nuevamente.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Cargar postulaciones (historial)
        try {
          console.log('📋 Cargando historial para candidato:', user.id);
          const historialResponse = await historialService.getByCandidato(user.id);
          console.log('📋 Respuesta del historial:', historialResponse);
          
          if (historialResponse.success && historialResponse.data) {
            console.log('📋 Datos del historial recibidos:', historialResponse.data);
            console.log('📋 Cantidad de registros:', historialResponse.data.length);
            const postulacionesMapeadas = mapHistorialToPostulaciones(historialResponse.data);
            console.log('📋 Postulaciones mapeadas:', postulacionesMapeadas);
            setPostulaciones(postulacionesMapeadas);
          } else {
            console.warn('⚠️ No se recibieron datos del historial o la respuesta no fue exitosa');
            setPostulaciones([]);
          }
        } catch (err) {
          console.error('❌ Error al cargar postulaciones:', err);
          // Continuar aunque falle, mostrar array vacío
          setPostulaciones([]);
        }

        // Cargar vacantes (cargos)
        try {
          const cargosResponse = await cargoService.getAll();
          if (cargosResponse.success && cargosResponse.data) {
            const vacantesMapeadas = mapCargosToVacantes(cargosResponse.data);
            setVacantes(vacantesMapeadas);
          }
        } catch (err) {
          console.error('Error al cargar vacantes:', err);
          // Continuar aunque falle, mostrar array vacío
          setVacantes([]);
        }

        // Cargar perfil (candidato)
        try {
          const candidatoResponse = await candidatoService.getById(user.id);
          if (candidatoResponse.success && candidatoResponse.data) {
            const perfilMapeado = mapCandidatoToPerfil(candidatoResponse.data);
            setPerfil(perfilMapeado);
          }
        } catch (err) {
          console.error('Error al cargar perfil:', err);
          // Usar perfil por defecto si falla
          setPerfil({
            nombre: user.nombre || 'Usuario',
            rol: 'Candidato',
            experiencia: 'Sin experiencia especificada',
            skills: [],
            completitud: 0,
          });
        }
      } catch (err: any) {
        console.error('Error general al cargar datos:', err);
        setError('Error al cargar los datos. Por favor, intenta recargar la página.');
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [user]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      localStorage.removeItem('token');
    }
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors duration-500">
      {/* Header */}
      <header className="bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-20 shadow-sm dark:shadow-neutral-900/50 transition-all duration-500">
        <div className="px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Animated Logo */}
            <AnimatedLogo size="sm" showText={false} animate={true} />
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-white transition-colors duration-500">Panel de Candidato</h1>
              <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400 hidden sm:block transition-colors duration-500">
                Encuentra tu próxima oportunidad
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Back Button */}
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
              <span className="hidden md:inline text-sm text-neutral-700 dark:text-neutral-300">Volver</span>
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Notifications */}
            <button
              onClick={() => router.push('/panel-candidato/notificaciones')}
              className="relative p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-all duration-300 group"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-700 dark:text-neutral-300 group-hover:scale-110 transition-transform duration-300" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 dark:bg-red-400 rounded-full animate-pulse"></span>
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-all duration-300"
            >
              <LogOut className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
              <span className="hidden md:inline text-sm text-neutral-700 dark:text-neutral-300">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content - 3 Column Layout */}
      <main className="p-4 md:p-8 bg-neutral-50 dark:bg-neutral-950 transition-colors duration-500">
        {loading ? (
          <div className="flex items-center justify-center min-h-[600px]">
            <Loading />
          </div>
        ) : error ? (
          <div className="max-w-[1600px] mx-auto">
            <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-800 dark:text-red-300 text-center transition-colors duration-300">
                {error}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Recargar página
              </button>
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
              {perfil ? (
                <PerfilCandidato perfil={perfil} />
              ) : (
                <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 h-full flex items-center justify-center">
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    No se pudo cargar el perfil
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
