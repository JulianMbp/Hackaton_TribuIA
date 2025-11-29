// ============================================
// AUTH SERVICE - AUTHENTICATION LOGIC (MOCK)
// ============================================
// Este servicio simula la autenticación mientras no esté conectado a Turso DB
// TODO: Reemplazar con llamadas reales a la base de datos

export interface LoginEmpresaData {
  email: string;
  password: string;
}

export interface LoginCandidatoData {
  email: string;
  documento: string;
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
      rol: 'empresa' | 'candidato';
    };
  };
}

/**
 * Mock login para empresa
 * TODO: Conectar con Turso Database
 */
export const loginEmpresa = async (data: LoginEmpresaData): Promise<AuthResponse> => {
  // Simulación de delay de red
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Mock: Siempre retorna éxito en modo demo
  return {
    success: true,
    message: 'Login exitoso',
    data: {
      token: 'mock-token-empresa-' + Date.now(),
      user: {
        id: 'empresa-123',
        email: data.email,
        nombre: 'Empresa Demo',
        rol: 'empresa',
      },
    },
  };
};

/**
 * Mock login para candidato
 * TODO: Conectar con Turso Database
 */
export const loginCandidato = async (data: LoginCandidatoData): Promise<AuthResponse> => {
  // Simulación de delay de red
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Mock: Siempre retorna éxito en modo demo
  return {
    success: true,
    message: 'Login exitoso',
    data: {
      token: 'mock-token-candidato-' + Date.now(),
      user: {
        id: 'candidato-' + data.documento,
        email: data.email,
        nombre: 'Candidato Demo',
        rol: 'candidato',
      },
    },
  };
};

/**
 * Almacenar datos de autenticación en localStorage
 */
export const storeAuthData = (token: string, user: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));
  }
};

/**
 * Obtener datos de autenticación de localStorage
 */
export const getAuthData = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
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
  return authData?.user?.rol || null;
};

// ============================================
// FUNCIONES PARA CONEXIÓN FUTURA CON TURSO DB
// ============================================

/**
 * TODO: Implementar cuando Turso DB esté configurado
 *
 * import { createClient } from '@libsql/client';
 *
 * const tursoClient = createClient({
 *   url: process.env.TURSO_DATABASE_URL!,
 *   authToken: process.env.TURSO_AUTH_TOKEN!,
 * });
 *
 * export const loginEmpresaDB = async (data: LoginEmpresaData) => {
 *   const result = await tursoClient.execute({
 *     sql: 'SELECT * FROM empresas WHERE email = ? AND password = ?',
 *     args: [data.email, hashPassword(data.password)],
 *   });
 *   // ... lógica de autenticación
 * };
 *
 * export const loginCandidatoDB = async (data: LoginCandidatoData) => {
 *   const result = await tursoClient.execute({
 *     sql: 'SELECT * FROM candidatos WHERE email = ? AND documento = ?',
 *     args: [data.email, data.documento],
 *   });
 *   // ... lógica de autenticación
 * };
 */
