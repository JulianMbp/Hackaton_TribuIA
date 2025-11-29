// ============================================
// TYPES AND INTERFACES FOR CREWAI PLATFORM
// ============================================

export interface Empresa {
  id: string;
  nombre: string;
  email: string;
  logo?: string;
  createdAt: string;
}

export interface Cargo {
  id: string;
  nombre: string;
  // Texto descriptivo del puesto (puede venir null desde la BD)
  descripcion: string | null;
  // Array usado en el frontend (por ejemplo para sugerencias de IA)
  criteriosTecnicos?: string[];
  // Campos reales que vienen desde la BD (snake_case)
  empresa_id?: string | null;
  salario_min?: number | null;
  salario_max?: number | null;
  modalidad?: string | null;
  skills_requeridos?: string | null;
  nivel_experiencia?: string | null;
  estado?: string | null;
  created_at?: string;
}

export interface Candidato {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
  // Campos alineados con la tabla `candidatos`
  pais?: string | null;
  ciudad?: string | null;
  experiencia_anios?: number | null;
  educacion?: string | null;
  skills?: string | null;
  cargo_aplicado?: string | null;
  portafolio_url?: string | null;
  github_url?: string | null;
  descripcion?: string | null;
  created_at?: string;
}

export interface Entrevista {
  id: string;
  candidatoId: string;
  candidato?: Candidato;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
}

export interface Pregunta {
  id: string;
  entrevistaId: string;
  texto: string;
  tipo: 'tecnica' | 'comportamental' | 'experiencia' | 'general';
  orden: number;
  createdAt: string;
}

export interface Respuesta {
  id: string;
  preguntaId: string;
  entrevistaId: string;
  texto: string;
  puntuacion?: number;
  evaluacion?: string;
  createdAt: string;
}

export interface Resultado {
  id: string;
  entrevistaId: string;
  entrevista?: Entrevista;
  puntuacionTotal: number;
  puntuacionTecnica: number;
  puntuacionComportamental: number;
  puntuacionExperiencia: number;
  recomendacion: 'strongly_recommended' | 'recommended' | 'maybe' | 'not_recommended';
  resumen: string;
  fortalezas: string[];
  areasMejora: string[];
  createdAt: string;
}

export interface Message {
  id: string;
  role: 'agent' | 'candidate';
  content: string;
  timestamp: string;
  preguntaId?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface User {
  id: string;
  email: string;
  nombre: string;
  role: 'empresa' | 'candidato';
}

export interface AuthState {
  user: User | null;
  empresa: Empresa | null; // Mantener para compatibilidad hacia atrás
  token: string | null;
  isAuthenticated: boolean;
  role?: 'empresa' | 'candidato' | null;
}

export interface InterviewState {
  entrevista: Entrevista | null;
  messages: Message[];
  isTyping: boolean;
  currentQuestion: Pregunta | null;
}

export interface NotificationState {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}
