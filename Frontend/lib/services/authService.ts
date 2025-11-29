// ============================================
// AUTH SERVICE - AUTHENTICATION LOGIC
// ============================================
// Servicio de autenticación conectado al backend

import { API_CONFIG, API_ENDPOINTS } from '@/lib/api/config';

export interface LoginEmpresaData {
  email: string;
  password: string;
}

export interface LoginCandidatoData {
  email: string;
  password: string; // Nota: Si en el frontend se usa 'documento', se puede cambiar
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    user: {
      id: string;
      email: string;
      nombre: string;
      role: 'empresa' | 'candidato';
    };
  };
  error?: string;
}

/**
 * Login para empresa - Conectado al backend
 */
export const loginEmpresa = async (data: LoginEmpresaData): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.AUTH_LOGIN_EMPRESA}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || 'Error al iniciar sesión',
        error: result.error || result.message,
      };
    }

    // Estandarizar el formato de respuesta
    return {
      success: true,
      message: result.message || 'Login exitoso',
      data: {
        token: result.data.token,
        user: {
          id: result.data.user.id,
          email: result.data.user.email,
          nombre: result.data.user.nombre,
          role: result.data.user.role,
        },
      },
    };
  } catch (error: any) {
    console.error('Error en loginEmpresa:', error);
    return {
      success: false,
      message: 'Error de conexión',
      error: error.message || 'No se pudo conectar con el servidor',
    };
  }
};

/**
 * Login para candidato - Conectado al backend
 */
export const loginCandidato = async (data: LoginCandidatoData): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.AUTH_LOGIN_CANDIDATO}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || 'Error al iniciar sesión',
        error: result.error || result.message,
      };
    }

    // Estandarizar el formato de respuesta
    return {
      success: true,
      message: result.message || 'Login exitoso',
      data: {
        token: result.data.token,
        user: {
          id: result.data.user.id,
          email: result.data.user.email,
          nombre: result.data.user.nombre,
          role: result.data.user.role,
        },
      },
    };
  } catch (error: any) {
    console.error('Error en loginCandidato:', error);
    return {
      success: false,
      message: 'Error de conexión',
      error: error.message || 'No se pudo conectar con el servidor',
    };
  }
};

/**
 * Almacenar datos de autenticación en localStorage
 * Usa 'token' para compatibilidad con apiClient
 */
export const storeAuthData = (token: string, user: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
    localStorage.setItem('auth_token', token); // Duplicado para compatibilidad
    localStorage.setItem('auth_user', JSON.stringify(user));
  }
};

/**
 * Obtener datos de autenticación de localStorage
 */
export const getAuthData = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('auth_user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        return { token, user };
      } catch (error) {
        console.error('Error parsing auth data:', error);
        return null;
      }
    }
  }
  return null;
};

/**
 * Limpiar datos de autenticación
 */
export const clearAuthData = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }
};

/**
 * Verificar si el usuario está autenticado
 */
export const isAuthenticated = (): boolean => {
  const authData = getAuthData();
  return authData !== null;
};

/**
 * Obtener el rol del usuario autenticado
 */
export const getUserRole = (): 'empresa' | 'candidato' | null => {
  const authData = getAuthData();
  // Compatibilidad con 'rol' y 'role'
  return authData?.user?.role || authData?.user?.rol || null;
};
