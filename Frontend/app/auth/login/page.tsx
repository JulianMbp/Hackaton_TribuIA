'use client';

// ============================================
// LOGIN PAGE - EMPRESA AUTHENTICATION
// ============================================

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useNotification } from '@/lib/contexts/NotificationContext';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showNotification } = useNotification();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await login(email, password);

      if (success) {
        showNotification('success', 'Inicio de sesión exitoso');
        router.push('/dashboard');
      } else {
        showNotification('error', 'Credenciales inválidas');
      }
    } catch (error) {
      showNotification('error', 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-neutral-900 mb-2">CrewAI</h1>
          <p className="text-neutral-800">Plataforma de entrevistas inteligentes</p>
        </div>

        <div className="bg-white rounded-lg border border-neutral-200 shadow-sm p-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Iniciar sesión</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              label="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="empresa@ejemplo.com"
              required
            />

            <Input
              type="password"
              label="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <Button type="submit" loading={loading} className="w-full">
              Iniciar sesión
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-800">
              ¿No tienes cuenta?{' '}
              <Link href="/auth/register" className="text-neutral-900 font-medium hover:underline">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/candidate/register"
            className="text-sm text-neutral-800 hover:text-neutral-900 hover:underline"
          >
            ¿Eres candidato? Haz clic aquí
          </Link>
        </div>
      </div>
    </div>
  );
}
