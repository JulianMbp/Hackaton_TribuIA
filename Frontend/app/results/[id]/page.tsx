'use client';

// ============================================
// RESULTS PAGE - INTERVIEW RESULTS & SCORING
// ============================================

import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Card } from '@/components/common/Card';
import { Loading } from '@/components/common/Loading';
import { resultadoService } from '@/lib/api/services';
import { Resultado } from '@/lib/types';
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer } from 'recharts';

export default function ResultsPage() {
  const params = useParams();
  const entrevistaId = params.id as string;
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [loading, setLoading] = useState(true);

  const loadResults = useCallback(async () => {
    const response = await resultadoService.getByEntrevista(entrevistaId);
    if (response.success && response.data) {
      setResultado(response.data);
    }
    setLoading(false);
  }, [entrevistaId]);

  useEffect(() => {
    loadResults();
  }, [loadResults]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Loading text="Generando resultados..." />
      </div>
    );
  }

  if (!resultado) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Card>
          <p className="text-neutral-800">No se encontraron resultados</p>
        </Card>
      </div>
    );
  }

  const recommendationConfig = {
    strongly_recommended: {
      label: 'Altamente Recomendado',
      color: 'bg-green-100 text-green-800',
      icon: '⭐⭐⭐',
    },
    recommended: {
      label: 'Recomendado',
      color: 'bg-blue-100 text-blue-800',
      icon: '⭐⭐',
    },
    maybe: {
      label: 'Considerar',
      color: 'bg-yellow-100 text-yellow-800',
      icon: '⭐',
    },
    not_recommended: {
      label: 'No Recomendado',
      color: 'bg-red-100 text-red-800',
      icon: '✗',
    },
  };

  const recommendation = recommendationConfig[resultado.recomendacion];

  const chartData = [
    {
      name: 'Técnica',
      value: resultado.puntuacionTecnica,
      fill: '#000000',
    },
    {
      name: 'Comportamental',
      value: resultado.puntuacionComportamental,
      fill: '#333333',
    },
    {
      name: 'Experiencia',
      value: resultado.puntuacionExperiencia,
      fill: '#666666',
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-neutral-900 mb-2">
            Resultados de la Entrevista
          </h1>
          <p className="text-neutral-800">
            {resultado.entrevista?.candidato?.nombre || 'Candidato'}
          </p>
        </div>

        <div className="space-y-6">
          {/* Overall score */}
          <Card>
            <div className="text-center py-8">
              <p className="text-sm text-neutral-800 mb-2">Puntuación Total</p>
              <p className="text-6xl font-bold text-neutral-900 mb-4">
                {resultado.puntuacionTotal}
                <span className="text-2xl text-neutral-800">/100</span>
              </p>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${recommendation.color}`}>
                <span className="text-lg">{recommendation.icon}</span>
                <span className="font-medium">{recommendation.label}</span>
              </div>
            </div>
          </Card>

          {/* Breakdown scores */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <div className="text-center">
                <p className="text-sm text-neutral-800 mb-2">Técnica</p>
                <p className="text-4xl font-bold text-neutral-900">
                  {resultado.puntuacionTecnica}
                </p>
                <div className="mt-4 bg-neutral-100 rounded-full h-2">
                  <div
                    className="bg-neutral-900 h-2 rounded-full transition-all"
                    style={{ width: `${resultado.puntuacionTecnica}%` }}
                  />
                </div>
              </div>
            </Card>

            <Card>
              <div className="text-center">
                <p className="text-sm text-neutral-800 mb-2">Comportamental</p>
                <p className="text-4xl font-bold text-neutral-900">
                  {resultado.puntuacionComportamental}
                </p>
                <div className="mt-4 bg-neutral-100 rounded-full h-2">
                  <div
                    className="bg-neutral-900 h-2 rounded-full transition-all"
                    style={{ width: `${resultado.puntuacionComportamental}%` }}
                  />
                </div>
              </div>
            </Card>

            <Card>
              <div className="text-center">
                <p className="text-sm text-neutral-800 mb-2">Experiencia</p>
                <p className="text-4xl font-bold text-neutral-900">
                  {resultado.puntuacionExperiencia}
                </p>
                <div className="mt-4 bg-neutral-100 rounded-full h-2">
                  <div
                    className="bg-neutral-900 h-2 rounded-full transition-all"
                    style={{ width: `${resultado.puntuacionExperiencia}%` }}
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Summary */}
          <Card>
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Resumen</h3>
            <p className="text-neutral-800 leading-relaxed">{resultado.resumen}</p>
          </Card>

          {/* Strengths and improvements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Fortalezas</h3>
              <ul className="space-y-2">
                {resultado.fortalezas.map((fortaleza, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-neutral-800">{fortaleza}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Áreas de Mejora</h3>
              <ul className="space-y-2">
                {resultado.areasMejora.map((area, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-neutral-800">{area}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
