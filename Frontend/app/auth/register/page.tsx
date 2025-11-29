'use client';

// ============================================
// REGISTER PAGE - EMPRESA REGISTRATION
// ============================================

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useNotification } from '@/lib/contexts/NotificationContext';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import Link from 'next/link';

export default function RegisterPage() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { showNotification } = useNotification();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showNotification('error', 'Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      showNotification('error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const success = await register(nombre, email, password);

      if (success) {
        showNotification('success', 'Registro exitoso');
        router.push('/dashboard');
      } else {
        showNotification('error', 'Error al registrar la empresa');
      }
    } catch (error) {
      showNotification('error', 'Error al registrar');
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
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Registrar empresa</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              label="Nombre de la empresa"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Mi Empresa S.A."
              required
            />

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

            <Input
              type="password"
              label="Confirmar contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <Button type="submit" loading={loading} className="w-full">
              Registrarse
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-800">
              ¿Ya tienes cuenta?{' '}
              <Link href="/auth/login" className="text-neutral-900 font-medium hover:underline">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
