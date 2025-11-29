// ============================================
// API SERVICES - BUSINESS LOGIC LAYER
// ============================================

import {
  ApiResponse,
  Candidato,
  Cargo,
  Empresa,
  Entrevista,
  Pregunta,
  Respuesta,
  Resultado,
} from '@/lib/types';
import { apiClient } from './client';
import { API_ENDPOINTS } from './config';

// ============================================
// AUTH SERVICES
// ============================================

export const authService = {
  login: async (email: string, password: string): Promise<ApiResponse<{ empresa: Empresa; token: string }>> => {
    return apiClient.post(API_ENDPOINTS.AUTH_LOGIN, { email, password });
  },

  register: async (data: {
    nombre: string;
    email: string;
    password: string;
  }): Promise<ApiResponse<{ empresa: Empresa; token: string }>> => {
    return apiClient.post(API_ENDPOINTS.AUTH_REGISTER, data);
  },

  getMe: async (): Promise<ApiResponse<Empresa>> => {
    return apiClient.get(API_ENDPOINTS.AUTH_ME);
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('empresa');
    }
  },
};

// ============================================
// CANDIDATO SERVICES
// ============================================

export const candidatoService = {
  getAll: async (): Promise<ApiResponse<Candidato[]>> => {
    return apiClient.get(API_ENDPOINTS.CANDIDATOS);
  },

  getById: async (id: string): Promise<ApiResponse<Candidato>> => {
    return apiClient.get(API_ENDPOINTS.CANDIDATO_BY_ID(id));
  },

  create: async (data: {
    nombre: string;
    email: string;
    telefono?: string;
    cargoId: string;
  }): Promise<ApiResponse<Candidato>> => {
    // Adaptamos al esquema real de la tabla `candidatos`
    const payload: any = {
      nombre: data.nombre,
      email: data.email,
      password: 'temporal', // TODO: ajustar si se gestiona login de candidatos
      telefono: data.telefono,
      cargo_aplicado: data.cargoId,
    };
    return apiClient.post(API_ENDPOINTS.CANDIDATOS, payload);
  },

  uploadCV: async (candidatoId: string, file: File): Promise<ApiResponse<{ cvUrl: string; cvTexto: string }>> => {
    return apiClient.uploadFile(`${API_ENDPOINTS.UPLOAD_CV}?candidatoId=${candidatoId}`, file);
  },
};

// ============================================
// ENTREVISTA SERVICES
// ============================================

export const entrevistaService = {
  getAll: async (): Promise<ApiResponse<Entrevista[]>> => {
    return apiClient.get(API_ENDPOINTS.ENTREVISTAS);
  },

  getById: async (id: string): Promise<ApiResponse<Entrevista>> => {
    return apiClient.get(API_ENDPOINTS.ENTREVISTA_BY_ID(id));
  },

  create: async (candidatoId: string): Promise<ApiResponse<Entrevista>> => {
    return apiClient.post(API_ENDPOINTS.ENTREVISTAS, { candidatoId });
  },

  start: async (id: string): Promise<ApiResponse<Entrevista>> => {
    return apiClient.post(API_ENDPOINTS.START_INTERVIEW(id));
  },

  complete: async (id: string): Promise<ApiResponse<Entrevista>> => {
    return apiClient.post(API_ENDPOINTS.COMPLETE_INTERVIEW(id));
  },

  getPreguntas: async (entrevistaId: string): Promise<ApiResponse<Pregunta[]>> => {
    return apiClient.get(API_ENDPOINTS.PREGUNTAS(entrevistaId));
  },

  sendAnswer: async (
    entrevistaId: string,
    preguntaId: string,
    respuesta: string
  ): Promise<ApiResponse<Respuesta>> => {
    return apiClient.post(API_ENDPOINTS.SEND_ANSWER(entrevistaId), {
      preguntaId,
      respuesta,
    });
  },
};

// ============================================
// RESULTADO SERVICES
// ============================================

export const resultadoService = {
  getByEntrevista: async (entrevistaId: string): Promise<ApiResponse<Resultado>> => {
    return apiClient.get(API_ENDPOINTS.RESULTADO_BY_ENTREVISTA(entrevistaId));
  },

  getAll: async (): Promise<ApiResponse<Resultado[]>> => {
    return apiClient.get(API_ENDPOINTS.RESULTADOS);
  },
};

// ============================================
// CARGO SERVICES
// ============================================

export const cargoService = {
  getAll: async (): Promise<ApiResponse<Cargo[]>> => {
    // La API devuelve los campos tal como están en la BD (snake_case).
    // Aquí simplemente tipamos la respuesta como Cargo[], que ya contempla esos campos.
    return apiClient.get(API_ENDPOINTS.CARGOS);
  },

  getById: async (id: string): Promise<ApiResponse<Cargo>> => {
    return apiClient.get(API_ENDPOINTS.CARGO_BY_ID(id));
  },

  create: async (data: {
    nombre: string;
    descripcion: string;
    criteriosTecnicos: string[];
  }): Promise<ApiResponse<Cargo>> => {
    // El backend espera `skills_requeridos` como texto plano.
    const payload = {
      nombre: data.nombre,
      descripcion: data.descripcion,
      skills_requeridos: data.criteriosTecnicos.join(', '),
    };
    return apiClient.post(API_ENDPOINTS.CARGOS, payload);
  },

  update: async (
    id: string,
    data: {
      nombre?: string;
      descripcion?: string;
      criteriosTecnicos?: string[];
    }
  ): Promise<ApiResponse<Cargo>> => {
    const payload: any = {};

    if (data.nombre !== undefined) payload.nombre = data.nombre;
    if (data.descripcion !== undefined) payload.descripcion = data.descripcion;
    if (data.criteriosTecnicos !== undefined) {
      payload.skills_requeridos = data.criteriosTecnicos.join(', ');
    }

    return apiClient.put(API_ENDPOINTS.CARGO_BY_ID(id), payload);
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete(API_ENDPOINTS.CARGO_BY_ID(id));
  },
};
