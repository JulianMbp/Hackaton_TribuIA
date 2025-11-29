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
import { API_CONFIG, API_ENDPOINTS } from './config';

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

// ============================================
// HISTORIAL SERVICES
// ============================================

export interface HistorialAplicacion {
  id: string;
  candidato_id: string;
  cargo_id: string;
  estado: string;
  fecha: string;
  cargo_nombre?: string;
  cargo_descripcion?: string;
  cargo_modalidad?: string;
  salario_min?: number;
  salario_max?: number;
  empresa_nombre?: string;
  empresa_logo?: string;
}

export const historialService = {
  getAll: async (): Promise<ApiResponse<HistorialAplicacion[]>> => {
    return apiClient.get(API_ENDPOINTS.HISTORIAL);
  },

  getByCandidato: async (candidatoId: string): Promise<ApiResponse<HistorialAplicacion[]>> => {
    return apiClient.get(API_ENDPOINTS.HISTORIAL_BY_CANDIDATO(candidatoId));
  },

  create: async (data: {
    candidato_id: string;
    cargo_id: string;
    estado?: string;
  }): Promise<ApiResponse<HistorialAplicacion>> => {
    return apiClient.post(API_ENDPOINTS.HISTORIAL, data);
  },
};

// ============================================
// POSTULACIONES SERVICES
// ============================================

export interface PostulacionResponse {
  success: boolean;
  message: string;
  cv_url: string;
  n8n_response?: any;
  warning?: string;
}

export const postulacionService = {
  postularse: async (
    cargoId: string,
    cvFile: File,
    candidatoId?: string
  ): Promise<ApiResponse<PostulacionResponse>> => {
    try {
      // Paso 1: Subir el CV al backend para obtener la URL
      const uploadFormData = new FormData();
      uploadFormData.append('cv', cvFile);
      uploadFormData.append('cargo_id', cargoId);
      if (candidatoId) {
        uploadFormData.append('candidato_id', candidatoId);
      }

      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      console.log('📤 Subiendo CV al backend...');
      const uploadResponse = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.POSTULACIONES}`, {
        method: 'POST',
        headers,
        body: uploadFormData,
      });

      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok) {
        return {
          success: false,
          error: uploadData.error || 'Error al subir el CV',
        };
      }

      // Obtener la URL del CV desde la respuesta
      const cvUrl = uploadData.cv_url;
      if (!cvUrl) {
        return {
          success: false,
          error: 'No se pudo obtener la URL del CV',
        };
      }

      // Obtener cargo_id de la respuesta del backend (por si acaso)
      // pero usar el que se pasó como parámetro como prioridad
      const finalCargoId = uploadData.cargo_id || cargoId;
      
      if (!finalCargoId) {
        console.error('❌ Error: cargoId es null o undefined');
        console.error('📊 Datos recibidos del backend:', uploadData);
        return {
          success: false,
          error: 'El ID de la vacante es requerido',
        };
      }

      console.log('✅ CV subido, URL:', cvUrl);
      console.log('📋 Cargo ID a enviar a n8n:', finalCargoId);

      // Paso 2: Enviar los datos directamente a n8n
      const n8nPayload = {
        cv_url: cvUrl,
        cargo_id: String(finalCargoId), // Asegurar que sea string
        candidato_id: candidatoId ? String(candidatoId) : null,
        estado: 'aplicado',
      };

      console.log('📤 Enviando postulación a n8n:', {
        ...n8nPayload,
        cargo_id_type: typeof n8nPayload.cargo_id,
        cargo_id_value: n8nPayload.cargo_id,
      });

      const n8nResponse = await fetch(API_CONFIG.N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(n8nPayload),
      });

      let n8nData;
      try {
        n8nData = await n8nResponse.json();
      } catch {
        // Si n8n no devuelve JSON, usar texto
        const text = await n8nResponse.text();
        n8nData = { message: text };
      }

      if (!n8nResponse.ok && n8nResponse.status !== 200 && n8nResponse.status !== 202) {
        console.error('❌ Error en n8n:', n8nData);
        // Aunque falle n8n, el CV ya está subido
        return {
          success: true,
          data: {
            success: true,
            message: 'CV subido correctamente, pero hubo un error al procesar la postulación en n8n',
            cv_url: cvUrl,
            warning: 'El workflow de n8n no pudo procesar la solicitud',
            n8n_response: n8nData,
          },
        };
      }

      console.log('✅ Postulación enviada a n8n exitosamente');

      return {
        success: true,
        data: {
          success: true,
          message: 'Postulación enviada correctamente',
          cv_url: cvUrl,
          n8n_response: n8nData,
        },
      };
    } catch (error: any) {
      console.error('❌ Error en postulación:', error);
      return {
        success: false,
        error: error.message || 'Error al postularse',
      };
    }
  },
};
