'use client';

import React, { useState, useEffect, useContext } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/lib/contexts/ThemeContext';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);

  // Evitar errores de hidratación
  useEffect(() => {
    setMounted(true);
  }, []);

  // No intentar usar el hook hasta que esté montado
  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-lg bg-neutral-100 dark:bg-neutral-800 opacity-50" />
    );
  }

  return <ThemeToggleClient />;
}

function ThemeToggleClient() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all duration-300 group"
      aria-label="Toggle theme"
    >
      {/* Sol (modo claro) */}
      <Sun
        className={`w-5 h-5 text-yellow-500 absolute inset-0 m-auto transition-all duration-300 ${
          theme === 'light'
            ? 'opacity-100 rotate-0 scale-100'
            : 'opacity-0 rotate-90 scale-0'
        }`}
      />

      {/* Luna (modo oscuro) */}
      <Moon
        className={`w-5 h-5 text-blue-400 absolute inset-0 m-auto transition-all duration-300 ${
          theme === 'dark'
            ? 'opacity-100 rotate-0 scale-100'
            : 'opacity-0 -rotate-90 scale-0'
        }`}
      />

      {/* Placeholder para mantener tamaño */}
      <div className="w-5 h-5 opacity-0">
        <Sun className="w-5 h-5" />
      </div>
    </button>
  );
}
