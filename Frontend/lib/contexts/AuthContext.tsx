'use client';

// ============================================
// AUTH CONTEXT - AUTHENTICATION STATE MANAGEMENT
// ============================================

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Empresa, AuthState } from '@/lib/types';
import { authService } from '@/lib/api/services';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (nombre: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    empresa: null,
    token: null,
    isAuthenticated: false,
  });
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = () => {
      const token = localStorage.getItem('token');
      const empresaStr = localStorage.getItem('empresa');

      if (token && empresaStr) {
        try {
          const empresa = JSON.parse(empresaStr);
          setAuthState({
            empresa,
            token,
            isAuthenticated: true,
          });
        } catch (error) {
          console.error('Error parsing empresa from localStorage:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('empresa');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authService.login(email, password);

      if (response.success && response.data) {
        const { empresa, token } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('empresa', JSON.stringify(empresa));

        setAuthState({
          empresa,
          token,
          isAuthenticated: true,
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

        localStorage.setItem('token', token);
        localStorage.setItem('empresa', JSON.stringify(empresa));

        setAuthState({
          empresa,
          token,
          isAuthenticated: true,
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
    authService.logout();
    setAuthState({
      empresa: null,
      token: null,
      isAuthenticated: false,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
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
