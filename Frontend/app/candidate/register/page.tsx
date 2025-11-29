'use client';

// ============================================
// CANDIDATE REGISTER PAGE - CV UPLOAD & INFO
// ============================================

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useNotification } from '@/lib/contexts/NotificationContext';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { FileUpload } from '@/components/common/FileUpload';
import { candidatoService, cargoService, entrevistaService } from '@/lib/api/services';
import { Cargo } from '@/lib/types';

export default function CandidateRegisterPage() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [cargoId, setCargoId] = useState('');
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();
  const router = useRouter();

  useEffect(() => {
    loadCargos();
  }, []);

  const loadCargos = async () => {
    const response = await cargoService.getAll();
    if (response.success && response.data) {
      setCargos(response.data);
    }
  };

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!uploadedFile) {
      showNotification('error', 'Por favor sube tu CV');
      return;
    }

    setLoading(true);

    try {
      // Create candidate
      const candidateResponse = await candidatoService.create({
        nombre,
        email,
        telefono,
        cargoId,
      });

      if (!candidateResponse.success || !candidateResponse.data) {
        showNotification('error', 'Error al registrar candidato');
        setLoading(false);
        return;
      }

      const candidato = candidateResponse.data;

      // Upload CV
      const cvResponse = await candidatoService.uploadCV(candidato.id, uploadedFile);

      if (!cvResponse.success) {
        showNotification('error', 'Error al subir CV');
        setLoading(false);
        return;
      }

      // Create interview
      const interviewResponse = await entrevistaService.create(candidato.id);

      if (!interviewResponse.success || !interviewResponse.data) {
        showNotification('error', 'Error al crear entrevista');
        setLoading(false);
        return;
      }

      showNotification('success', 'Registro exitoso. Redirigiendo a la entrevista...');

      setTimeout(() => {
        router.push(`/interview/${interviewResponse.data!.id}`);
      }, 1500);
    } catch (error) {
      showNotification('error', 'Error en el registro');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-neutral-900 mb-2">CrewAI</h1>
          <p className="text-neutral-800">Registro de candidato</p>
        </div>

        <div className="bg-white rounded-lg border border-neutral-200 shadow-sm p-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">
            Completa tu información
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="text"
              label="Nombre completo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Juan Pérez"
              required
            />

            <Input
              type="email"
              label="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="juan@ejemplo.com"
              required
            />

            <Input
              type="tel"
              label="Teléfono (opcional)"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="+34 600 000 000"
            />

            <div>
              <label className="block text-sm font-medium text-neutral-800 mb-2">
                Cargo al que aplicas
              </label>
              <select
                value={cargoId}
                onChange={(e) => setCargoId(e.target.value)}
                className="input-base"
                required
              >
                <option value="">Selecciona un cargo</option>
                {cargos.map((cargo) => (
                  <option key={cargo.id} value={cargo.id}>
                    {cargo.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-800 mb-2">
                Sube tu CV
              </label>
              <FileUpload
                onUpload={handleFileUpload}
                acceptedTypes={['application/pdf', 'image/jpeg', 'image/png', 'text/plain']}
                maxSize={10}
                label="Subir CV (PDF, JPG, PNG o TXT)"
              />
            </div>

            <Button type="submit" loading={loading} className="w-full">
              Registrarme y comenzar entrevista
            </Button>
          </form>
        </div>

        <div className="mt-6 text-center">
          <a
            href="/auth/login"
            className="text-sm text-neutral-800 hover:text-neutral-900 hover:underline"
          >
            ¿Eres empresa? Inicia sesión aquí
          </a>
        </div>
      </div>
    </div>
  );
}
