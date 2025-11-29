'use client';

// ============================================
// LOGIN CANDIDATO PAGE - CANDIDATE AUTHENTICATION
// ============================================

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserCircle2, Mail, FileText, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import Link from 'next/link';

export default function LoginCandidatoPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [documento, setDocumento] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Formulario candidato enviado');
    setLoading(true);

    // Simulación de login sin validación
    // TODO: Conectar con Turso Database cuando esté listo
    setTimeout(() => {
      console.log('Redirigiendo a /panel-candidato');
      setLoading(false);
      router.push('/panel-candidato');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Volver</span>
        </Link>

        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-neutral-900 rounded-2xl mb-4">
            <UserCircle2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2">
            Bienvenido, Candidato
          </h1>
          <p className="text-neutral-600">
            Ingresa tus datos para acceder a tus entrevistas
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-900 mb-2">
                Correo electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="candidato@ejemplo.com"
                  className="block w-full pl-10 pr-3 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* Documento Input */}
            <div>
              <label htmlFor="documento" className="block text-sm font-medium text-neutral-900 mb-2">
                Documento / Identificación
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FileText className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  id="documento"
                  type="text"
                  value={documento}
                  onChange={(e) => setDocumento(e.target.value)}
                  placeholder="12345678"
                  className="block w-full pl-10 pr-3 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
              <p className="mt-2 text-xs text-neutral-500">
                Ingresa tu número de documento sin puntos ni guiones
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-400 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] mt-6 text-sm md:text-base"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Ingresando...
                </span>
              ) : (
                'Acceder a Mis Entrevistas'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-neutral-500">o</span>
            </div>
          </div>

          {/* Help Link */}
          <div className="text-center">
            <p className="text-sm text-neutral-600">
              ¿No tienes acceso?{' '}
              <Link href="#" className="text-neutral-900 font-semibold hover:underline">
                Contacta con la empresa
              </Link>
            </p>
          </div>
        </div>

        {/* Info Message */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800 text-center">
            <strong>Modo Demo:</strong> Este login aún no está conectado a la base de datos.
            Puedes ingresar con cualquier email y documento.
          </p>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-neutral-500">
            Al ingresar, aceptas nuestros{' '}
            <a href="#" className="underline hover:text-neutral-900">
              Términos y Condiciones
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
