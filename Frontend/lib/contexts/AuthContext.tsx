'use client';

// ============================================
// AUTH CONTEXT - AUTHENTICATION STATE MANAGEMENT
// ============================================

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Empresa, AuthState, User } from '@/lib/types';
import { authService } from '@/lib/api/services';
import { getAuthData, clearAuthData } from '@/lib/services/authService';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  loginEmpresa: (email: string, password: string) => Promise<boolean>;
  loginCandidato: (email: string, password: string) => Promise<boolean>;
  register: (nombre: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    empresa: null,
    token: null,
    isAuthenticated: false,
    role: null,
  });
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = () => {
      const authData = getAuthData();

      if (authData && authData.token && authData.user) {
        setAuthState({
          user: authData.user as User,
          empresa: authData.user.role === 'empresa' ? (authData.user as any) : null, // Compatibilidad
          token: authData.token,
          isAuthenticated: true,
          role: authData.user.role || (authData.user as any).rol,
        });
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Función genérica - usar loginEmpresa o loginCandidato según corresponda
    return loginEmpresa(email, password);
  };

  const loginEmpresa = async (email: string, password: string): Promise<boolean> => {
    try {
      const { loginEmpresa: loginEmpresaService } = await import('@/lib/services/authService');
      const response = await loginEmpresaService({ email, password });

      if (response.success && response.data) {
        const { user, token } = response.data;

        const userData = {
          id: user.id,
          email: user.email,
          nombre: user.nombre,
          role: user.role,
        };

        localStorage.setItem('token', token);
        localStorage.setItem('auth_user', JSON.stringify(userData));

        setAuthState({
          user: userData as User,
          empresa: userData as any, // Compatibilidad
          token,
          isAuthenticated: true,
          role: user.role,
        });

        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const loginCandidato = async (email: string, password: string): Promise<boolean> => {
    try {
      const { loginCandidato: loginCandidatoService } = await import('@/lib/services/authService');
      const response = await loginCandidatoService({ email, password });

      if (response.success && response.data) {
        const { user, token } = response.data;

        const userData = {
          id: user.id,
          email: user.email,
          nombre: user.nombre,
          role: user.role,
        };

        localStorage.setItem('token', token);
        localStorage.setItem('auth_user', JSON.stringify(userData));

        setAuthState({
          user: userData as User,
          empresa: null,
          token,
          isAuthenticated: true,
          role: user.role,
        });

        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (nombre: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await authService.register({ nombre, email, password });

      if (response.success && response.data) {
        const { empresa, token } = response.data;

        const userData = {
          id: empresa.id,
          email: empresa.email,
          nombre: empresa.nombre,
          role: 'empresa' as const,
        };

        localStorage.setItem('token', token);
        localStorage.setItem('auth_user', JSON.stringify(userData));

        setAuthState({
          user: userData as User,
          empresa: empresa as any,
          token,
          isAuthenticated: true,
          role: 'empresa',
        });

        return true;
      }

      return false;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    }
  };

  const logout = () => {
    clearAuthData();
    authService.logout();
    setAuthState({
      user: null,
      empresa: null,
      token: null,
      isAuthenticated: false,
      role: null,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        loginEmpresa,
        loginCandidato,
        register,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
