"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Loading } from "@/components/common/Loading";
import { cargoService } from "@/lib/api/services";
import { useNotification } from "@/lib/contexts/NotificationContext";
import { Cargo } from "@/lib/types";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CargosPage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [suggestions, setSuggestions] = useState<Cargo[]>([]);
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const { showNotification } = useNotification();

  useEffect(() => {
    loadCargos();
  }, []);

  const loadCargos = async () => {
    setLoading(true);
    const response = await cargoService.getAll();
    if (response.success && response.data) setCargos(response.data);
    setLoading(false);
  };

  // Fake AI Generator
  const generateWithAI = async () => {
    if (!prompt.trim()) return;
    setGenerating(true);

    setTimeout(() => {
      const newSuggestion: Cargo = {
        id: crypto.randomUUID(),
        nombre: `Cargo basado en: ${prompt}`,
        descripcion: "Descripción generada automáticamente basada en el prompt.",
        criteriosTecnicos: [
          "Trabajo en equipo",
          "Comunicación",
          "Liderazgo",
          "Pensamiento crítico",
        ],
        empresaId: "pending-ia",
        createdAt: new Date().toISOString(),
      };

      setSuggestions((prev) => [...prev, newSuggestion]);
      setGenerating(false);
      setPrompt("");
    }, 1200);
  };

  const saveCargo = async (cargo: Cargo) => {
    const response = await cargoService.create(cargo);
    if (response.success) {
      showNotification("success", "Cargo guardado exitosamente");
      setSuggestions((prev) => prev.filter((s) => s.id !== cargo.id));
      loadCargos();
    } else {
      showNotification("error", "No se pudo guardar el cargo");
    }
  };

  const deleteSuggestion = (id: string) => {
    setSuggestions((prev) => prev.filter((s) => s.id !== id));
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Loading text="Cargando cargos..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 md:space-y-8 relative">
        {/* Efectos de fondo decorativos */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-100/20 dark:from-purple-900/10 to-blue-100/20 dark:to-blue-900/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-emerald-100/20 dark:from-emerald-900/10 to-cyan-100/20 dark:to-cyan-900/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 px-3 md:px-4 py-2 text-xs md:text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-900 dark:hover:bg-white hover:text-white dark:hover:text-neutral-900 rounded-lg transition-all duration-300 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline">Volver</span>
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-1 h-12 bg-gradient-to-b from-purple-500 via-blue-500 to-emerald-500 rounded-full"></div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white">Gestión de Cargos con IA</h1>
            <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 mt-2">
              Crea perfiles de cargo inteligentes usando inteligencia artificial
            </p>
          </div>
        </div>

        {/* PROMPT IA con efectos */}
        <Card className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm border-2 border-neutral-900 dark:border-white shadow-xl hover:shadow-2xl transition-all duration-300">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-lg md:text-xl font-semibold text-neutral-900 dark:text-white">Generar Cargo con IA</h2>
            </div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe el cargo que necesitas: Ej. 'Necesito un líder para un equipo de desarrolladores con experiencia en Node y manejo de proyectos'"
              rows={4}
              className="w-full border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-lg p-3 text-xs md:text-sm resize-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent outline-none transition-all duration-300 placeholder:text-neutral-500 dark:placeholder:text-neutral-400"
            />
            <Button onClick={generateWithAI} loading={generating} className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              Generar con IA
            </Button>
          </div>
        </Card>

        {/* SUGERENCIAS IA con animaciones */}
        {suggestions.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-4 text-neutral-900 dark:text-white">Sugerencias generadas</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {suggestions.map((s, index) => (
                <div key={s.id} style={{ animationDelay: `${index * 100}ms` }} className="animate-fade-in-up">
                  <Card className="p-4 md:p-6 space-y-3 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm border border-neutral-200 dark:border-neutral-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <h3 className="text-base md:text-lg font-semibold text-neutral-900 dark:text-white">{s.nombre}</h3>
                    <p className="text-xs md:text-sm text-neutral-700 dark:text-neutral-300">{s.descripcion}</p>

                    <ul className="text-xs md:text-sm list-disc ml-5 text-neutral-700 dark:text-neutral-300">
                      {s.criteriosTecnicos.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>

                    <div className="flex flex-col sm:flex-row gap-2 mt-4">
                      <Button className="flex-1 w-full text-sm" onClick={() => saveCargo(s)}>
                        Guardar
                      </Button>

                      <Button
                        variant="secondary"
                        className="flex-1 w-full text-sm"
                        onClick={() => {
                          showNotification('info', 'Función de edición próximamente');
                        }}
                      >
                        Editar
                      </Button>

                      <Button
                        variant="secondary"
                        className="flex-1 w-full bg-red-600 hover:bg-red-700 text-white text-sm"
                        onClick={() => deleteSuggestion(s.id)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CARGOS GUARDADOS con animaciones */}
        <div>
          <h2 className="text-lg md:text-xl font-bold mb-4 text-neutral-900 dark:text-white">Cargos Registrados</h2>
          {cargos.length === 0 ? (
            <Card className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm border border-neutral-200 dark:border-neutral-700">
              <p className="text-center text-neutral-600 dark:text-neutral-400 py-8 text-sm md:text-base">
                Aún no hay cargos registrados. Genera uno con IA para comenzar.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {cargos.map((cargo, index) => (
                <div key={cargo.id} style={{ animationDelay: `${index * 50}ms` }} className="animate-fade-in-up">
                  <Card className="p-4 md:p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm border border-neutral-200 dark:border-neutral-700">
                    <h3 className="text-base md:text-lg font-semibold mb-2 text-neutral-900 dark:text-white">{cargo.nombre}</h3>
                    <p className="text-xs md:text-sm text-neutral-700 dark:text-neutral-300 mb-3">{cargo.descripcion}</p>
                    <ul className="list-disc ml-5 text-xs md:text-sm space-y-1 text-neutral-700 dark:text-neutral-300">
                      {cargo.criteriosTecnicos.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </DashboardLayout>
  );
}
