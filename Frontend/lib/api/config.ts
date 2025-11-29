// ============================================
// API CONFIGURATION
// ============================================

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  WS_URL: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000',
  N8N_WEBHOOK_URL: process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/candidate_intake',
  TIMEOUT: 30000, // 30 seconds
};

export const API_ENDPOINTS = {
  // Auth
  AUTH_LOGIN: '/api/auth/login',
  AUTH_LOGIN_EMPRESA: '/api/auth/login/empresa',
  AUTH_LOGIN_CANDIDATO: '/api/auth/login/candidato',
  AUTH_REGISTER: '/api/auth/register',
  AUTH_ME: '/api/auth/me',

  // Candidatos
  CANDIDATOS: '/api/candidatos',
  CANDIDATO_BY_ID: (id: string) => `/api/candidatos/${id}`,
  UPLOAD_CV: '/api/candidatos/upload-cv',

  // Entrevistas
  ENTREVISTAS: '/api/entrevistas',
  ENTREVISTA_BY_ID: (id: string) => `/api/entrevistas/${id}`,
  ENTREVISTAS_CON_PUNTAJES: '/api/entrevistas/con-puntajes',
  START_INTERVIEW: (id: string) => `/api/entrevistas/${id}/start`,
  COMPLETE_INTERVIEW: (id: string) => `/api/entrevistas/${id}/complete`,

  // Preguntas y Respuestas
  PREGUNTAS: (entrevistaId: string) => `/api/entrevistas/${entrevistaId}/preguntas`,
  SEND_ANSWER: (entrevistaId: string) => `/api/entrevistas/${entrevistaId}/responder`,

  // Resultados
  RESULTADOS: '/api/resultados',
  RESULTADO_BY_ENTREVISTA: (entrevistaId: string) => `/api/resultados/entrevista/${entrevistaId}`,

  // Cargos
  CARGOS: '/api/cargos',
  CARGO_BY_ID: (id: string) => `/api/cargos/${id}`,

  // Historial
  HISTORIAL: '/api/historial',
  HISTORIAL_BY_CANDIDATO: (candidatoId: string) => `/api/historial?candidato_id=${candidatoId}`,

  // Postulaciones
  POSTULACIONES: '/api/postulaciones',

  // WebSocket
  WS_INTERVIEW: (entrevistaId: string) => `/ws/interview/${entrevistaId}`,
};
