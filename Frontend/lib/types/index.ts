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
  descripcion: string;
  criteriosTecnicos: string[];
  empresaId: string;
  createdAt: string;
}

export interface Candidato {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
  cargoId: string;
  cargo?: Cargo;
  cvUrl?: string;
  cvTexto?: string;
  status: 'pending' | 'in_interview' | 'completed' | 'rejected';
  createdAt: string;
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

export interface AuthState {
  empresa: Empresa | null;
  token: string | null;
  isAuthenticated: boolean;
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
