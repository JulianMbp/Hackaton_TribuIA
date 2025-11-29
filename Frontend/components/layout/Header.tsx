'use client';

// ============================================
// HEADER COMPONENT - TOP NAVIGATION
// ============================================

import React from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/common/ThemeToggle';

export const Header: React.FC = () => {
  const { empresa, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <header className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700 sticky top-0 z-40 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">CrewAI</h1>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <ThemeToggle />

            {isAuthenticated && empresa && (
              <>
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">{empresa.nombre}</p>
                  <p className="text-xs text-neutral-800 dark:text-neutral-300">{empresa.email}</p>
                </div>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-neutral-800 dark:text-neutral-200 hover:text-neutral-900 dark:hover:text-white smooth-hover"
                >
                  Cerrar sesión
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
