'use client';

// ============================================
// INTERVIEW PAGE - REAL-TIME CHAT INTERVIEW
// ============================================

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChatBox } from '@/components/interview/ChatBox';
import { Button } from '@/components/common/Button';
import { Loading } from '@/components/common/Loading';
import { useInterview } from '@/lib/hooks/useInterview';
import { useNotification } from '@/lib/contexts/NotificationContext';

export default function InterviewPage() {
  const params = useParams();
  const router = useRouter();
  const entrevistaId = params.id as string;
  const { showNotification } = useNotification();

  const {
    entrevista,
    messages,
    isTyping,
    isConnected,
    error,
    sendMessage,
    startInterview,
    completeInterview,
  } = useInterview(entrevistaId);

  const [hasStarted, setHasStarted] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  useEffect(() => {
    if (error) {
      showNotification('error', error);
    }
  }, [error, showNotification]);

  const handleStart = async () => {
    const success = await startInterview();
    if (success) {
      setHasStarted(true);
      showNotification('success', 'Entrevista iniciada');
    } else {
      showNotification('error', 'Error al iniciar la entrevista');
    }
  };

  const handleComplete = async () => {
    if (!confirm('¿Estás seguro de que quieres finalizar la entrevista?')) {
      return;
    }

    setIsCompleting(true);
    const success = await completeInterview();

    if (success) {
      showNotification('success', 'Entrevista finalizada. Generando resultados...');
      setTimeout(() => {
        router.push(`/results/${entrevistaId}`);
      }, 2000);
    } else {
      showNotification('error', 'Error al finalizar la entrevista');
      setIsCompleting(false);
    }
  };

  if (!entrevista) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Loading text="Cargando entrevista..." />
      </div>
    );
  }

  const isFinished = entrevista.status === 'completed';

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">Entrevista con IA</h1>
              <p className="text-sm text-neutral-800 mt-1">
                {isFinished ? 'Entrevista finalizada' : 'Responde con honestidad y claridad'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Connection status */}
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isConnected ? 'bg-green-500' : 'bg-red-500'
                  }`}
                />
                <span className="text-sm text-neutral-800">
                  {isConnected ? 'Conectado' : 'Desconectado'}
                </span>
              </div>

              {hasStarted && !isFinished && (
                <Button
                  variant="secondary"
                  onClick={handleComplete}
                  loading={isCompleting}
                >
                  Finalizar entrevista
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!hasStarted && !isFinished ? (
          <div className="bg-white rounded-lg border border-neutral-200 shadow-sm p-12 text-center">
            <svg
              className="w-20 h-20 text-neutral-200 mx-auto mb-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              Bienvenido a tu entrevista
            </h2>
            <p className="text-neutral-800 mb-8 max-w-2xl mx-auto">
              Nuestro agente de IA te hará una serie de preguntas adaptativas para conocer mejor
              tus habilidades y experiencia. Tómate tu tiempo para responder con claridad.
            </p>
            <Button onClick={handleStart}>Comenzar entrevista</Button>
          </div>
        ) : (
          <ChatBox
            messages={messages}
            isTyping={isTyping}
            onSendMessage={sendMessage}
            disabled={isFinished}
          />
        )}
      </div>
    </div>
  );
}
