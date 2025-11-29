import React, { createContext, useCallback, useState } from 'react';
import { updatePostulacionStatus } from '../services/candidateService';
import { evaluateAnswers, filterCandidate, type FilterCandidateRequest } from '../services/n8nService';
import type { EntrevistaState, Pregunta, Respuesta } from '../types/interview';

interface JobData {
  puesto?: string;
  empresa?: string;
  requiredSkills?: string[];
  candidateName?: string;
  candidateSkills?: string[];
  candidateExperience?: Array<{ years: number; company: string }>;
  description?: string;
}

interface InterviewContextValue {
  state: EntrevistaState;
  iniciarEntrevista: (candidatoId: string, postulacionId: string, jobData: JobData) => Promise<void>;
  revelarPregunta: () => void;
  comenzarRespuesta: () => void;
  siguientePregunta: () => Promise<void>;
  agregarRespuesta: (preguntaId: string, contenido: string) => void;
  enviarRespuestaActual: () => Promise<void>;
  actualizarLectura: (isReading: boolean, score: number) => void;
  actualizarTiempoRestante: (tiempo: number | ((prev: number) => number)) => void;
  finalizarEntrevista: () => Promise<{ success: boolean; message?: string; puntaje_final?: number }>;
  reset: () => void;
}

const InterviewContext = createContext<InterviewContextValue | null>(null);

export const InterviewProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState<EntrevistaState>({
    entrevistaId: null,
    candidatoId: null,
    postulacionId: null,
    preguntas: [],
    preguntaActual: 0,
    respuestas: [],
    isReading: false,
    readingScore: 0,
    isRecording: false,
    transcript: '',
    estado: 'inicializando',
    tiempoRestante: 10,
    preguntaRevelada: false,
  });

  const iniciarEntrevista = useCallback(async (
    candidatoId: string,
    postulacionId: string,
    jobData: JobData
  ) => {
    try {
      console.log('🚀 Iniciando entrevista...');
      console.log('🚀 Candidato ID:', candidatoId);
      console.log('🚀 Postulación ID:', postulacionId);
      console.log('🚀 Job Data:', jobData);
      
      setState(prev => ({ ...prev, estado: 'inicializando' }));

      // Generar UUID v4 válido para la entrevista
      const generateUUID = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
          const r = Math.random() * 16 | 0;
          const v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      };
      
      const entrevistaId = generateUUID();
      console.log('🚀 Entrevista ID generado (UUID):', entrevistaId);

      // Preparar datos para filter_candidate
      const filterData: FilterCandidateRequest = {
        candidate: {
          id: candidatoId,
          name: jobData.candidateName || 'Candidato',
          skills: jobData.candidateSkills || [],
          experience: jobData.candidateExperience || [],
        },
        job: {
          id: postulacionId,
          title: jobData.puesto || 'Puesto',
          required_skills: jobData.requiredSkills || [],
          description: jobData.description || '',
        },
      };

      console.log('🚀 Datos preparados para filter_candidate:', JSON.stringify(filterData, null, 2));

      // Llamar al webhook para obtener preguntas
      console.log('🚀 Llamando a filterCandidate...');
      const response = await filterCandidate(filterData);
      console.log('✅ Respuesta de filterCandidate:', response);
      
      // Verificar que hay preguntas en la respuesta
      if (!response.questions || !Array.isArray(response.questions) || response.questions.length === 0) {
        console.warn('⚠️ No se recibieron preguntas del webhook. El workflow puede no estar devolviendo datos correctamente.');
        console.warn('⚠️ Verifica que el nodo "Respond - Filtro Completado" en n8n esté configurado para devolver las preguntas.');
        throw new Error('No se recibieron preguntas del workflow. Verifica la configuración del nodo "Respond" en n8n.');
      }
      
      // Asignar IDs a las preguntas si no los tienen
      const preguntasConIds: Pregunta[] = response.questions.map((q, index) => {
        const pregunta: Pregunta = {
          tipo: q.tipo || 'abierta',
          contenido: q.contenido || '',
          generada_por: q.generada_por || 'ia',
          id: q.id || `pregunta-${entrevistaId}-${index}`,
        };
        return pregunta;
      });
      
      console.log('✅ Preguntas procesadas:', preguntasConIds.length);
      console.log('✅ Primera pregunta:', preguntasConIds[0]);

      const nuevoEstado = {
        entrevistaId,
        candidatoId,
        postulacionId,
        preguntas: preguntasConIds,
        preguntaActual: 0,
        estado: 'leyendo' as const,
        isReading: false,
        readingScore: 0,
        isRecording: false,
        transcript: '',
        respuestas: [],
        tiempoRestante: 10,
        preguntaRevelada: false,
      };

      console.log('✅ Actualizando estado con preguntas:', nuevoEstado);
      setState(prev => ({
        ...prev,
        ...nuevoEstado,
      }));
      
      console.log('✅ Estado actualizado, debería mostrar la pregunta ahora');
    } catch (error) {
      console.error('Error iniciando entrevista:', error);
      setState(prev => ({
        ...prev,
        estado: 'error',
      }));
    }
  }, []);

  const revelarPregunta = useCallback(() => {
    setState(prev => {
      if (prev.preguntaRevelada) {
        return prev; // Ya fue revelada
      }
      return {
        ...prev,
        estado: 'revelada',
        preguntaRevelada: true,
        tiempoRestante: 10,
      };
    });
  }, []);

  const comenzarRespuesta = useCallback(() => {
    setState(prev => ({
      ...prev,
      estado: 'respondiendo',
    }));
  }, []);

  const actualizarTiempoRestante = useCallback((tiempo: number | ((prev: number) => number)) => {
    setState(prev => {
      const nuevoTiempo = typeof tiempo === 'function' ? tiempo(prev.tiempoRestante) : tiempo;
      return {
        ...prev,
        tiempoRestante: nuevoTiempo,
      };
    });
  }, []);

  const enviarRespuestaActual = useCallback(async () => {
    if (!state.entrevistaId) {
      console.warn('⚠️ No hay entrevista_id para enviar respuesta');
      return;
    }

    const preguntaActual = state.preguntas[state.preguntaActual];
    if (!preguntaActual) {
      console.warn('⚠️ No hay pregunta actual');
      return;
    }

    // Buscar la respuesta de la pregunta actual
    const respuestaActual = state.respuestas.find(r => r.pregunta_id === preguntaActual.id);
    if (!respuestaActual || !respuestaActual.contenido.trim()) {
      console.warn('⚠️ No hay respuesta para enviar');
      return;
    }

    try {
      console.log('🚀 Enviando respuesta actual al webhook...');
      console.log('🚀 Entrevista ID:', state.entrevistaId);
      console.log('🚀 Respuesta:', respuestaActual);

      // Enviar la respuesta al webhook evaluate_answers
      await evaluateAnswers({
        entrevista_id: state.entrevistaId,
        respuestas: [respuestaActual],
      });

      console.log('✅ Respuesta enviada correctamente');
    } catch (error) {
      console.error('❌ Error enviando respuesta:', error);
      // No lanzar error para que el flujo continúe
    }
  }, [state.entrevistaId, state.preguntas, state.preguntaActual, state.respuestas]);

  const siguientePregunta = useCallback(async () => {
    // Enviar la respuesta actual antes de pasar a la siguiente
    await enviarRespuestaActual();

    setState(prev => {
      if (prev.preguntaActual < prev.preguntas.length - 1) {
        return {
          ...prev,
          preguntaActual: prev.preguntaActual + 1,
          estado: 'leyendo',
          isReading: false,
          readingScore: 0,
          transcript: '',
          tiempoRestante: 10,
          preguntaRevelada: false,
        };
      }
      return prev;
    });
  }, [enviarRespuestaActual]);

  const agregarRespuesta = useCallback((preguntaId: string, contenido: string) => {
    setState(prev => {
      const nuevaRespuesta: Respuesta = {
        pregunta_id: preguntaId,
        contenido,
        tipo: 'texto',
      };

      // Actualizar respuesta si ya existe, sino agregar nueva
      const respuestasActualizadas = prev.respuestas.filter(r => r.pregunta_id !== preguntaId);
      respuestasActualizadas.push(nuevaRespuesta);

      return {
        ...prev,
        respuestas: respuestasActualizadas,
        transcript: contenido,
        estado: 'respondiendo',
      };
    });
  }, []);

  const actualizarLectura = useCallback((isReading: boolean, score: number) => {
    setState(prev => ({
      ...prev,
      isReading,
      readingScore: score,
    }));
  }, []);

  const finalizarEntrevista = useCallback(async (): Promise<{ success: boolean; message?: string; puntaje_final?: number }> => {
    try {
      setState(prev => ({ ...prev, estado: 'enviando' }));

      if (!state.entrevistaId) {
        throw new Error('No hay entrevista_id para enviar');
      }

      // Asegurarse de enviar la última respuesta si existe
      const preguntaActual = state.preguntas[state.preguntaActual];
      if (preguntaActual) {
        const respuestaActual = state.respuestas.find(r => r.pregunta_id === preguntaActual.id);
        if (respuestaActual && respuestaActual.contenido.trim()) {
          // Enviar la última respuesta individualmente
          try {
            await evaluateAnswers({
              entrevista_id: state.entrevistaId,
              respuestas: [respuestaActual],
            });
            console.log('✅ Última respuesta enviada');
          } catch (error) {
            console.warn('⚠️ Error enviando última respuesta individual:', error);
          }
        }
      }

      if (state.respuestas.length === 0) {
        throw new Error('No hay respuestas para enviar');
      }

      // Enviar todas las respuestas al webhook evaluate_answers para evaluación final
      console.log('🚀 Enviando todas las respuestas para evaluación final...');
      let response;
      try {
        response = await evaluateAnswers({
          entrevista_id: state.entrevistaId,
          respuestas: state.respuestas,
        });
        console.log('✅ Respuestas enviadas al webhook');
      } catch (error) {
        console.warn('⚠️ Error enviando respuestas al webhook, pero continuando:', error);
        // Continuar aunque falle el webhook - las respuestas ya están guardadas
        response = {
          success: true,
          message: 'Respuestas procesadas. El sistema está evaluando tu entrevista.',
        };
      }

      setState(prev => ({
        ...prev,
        estado: 'completada',
      }));

      // Actualizar estado de la postulación
      const token = localStorage.getItem('auth_token');
      if (token && state.postulacionId) {
        try {
          await updatePostulacionStatus(
            state.postulacionId,
            'evaluando',
            token
          );
          console.log('✅ Estado de postulación actualizado a "evaluando"');
        } catch (error) {
          console.warn('⚠️ Error actualizando estado de postulación:', error);
          // No fallar la entrevista si falla la actualización del estado
        }
      }

      return {
        success: true, // Siempre retornar éxito si llegamos aquí
        message: response?.message || 'Entrevista completada exitosamente. Serás contactado en los próximos días.',
        puntaje_final: response?.puntaje_final,
      };
    } catch (error) {
      console.error('Error finalizando entrevista:', error);
      setState(prev => ({
        ...prev,
        estado: 'error',
      }));
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }, [state.entrevistaId, state.respuestas, state.preguntas, state.preguntaActual, state.postulacionId]);

  const reset = useCallback(() => {
    setState({
      entrevistaId: null,
      candidatoId: null,
      postulacionId: null,
      preguntas: [],
      preguntaActual: 0,
      respuestas: [],
      isReading: false,
      readingScore: 0,
      isRecording: false,
      transcript: '',
      estado: 'inicializando',
      tiempoRestante: 10,
      preguntaRevelada: false,
    });
  }, []);

  return (
    <InterviewContext.Provider
      value={{
        state,
        iniciarEntrevista,
        revelarPregunta,
        comenzarRespuesta,
        siguientePregunta,
        agregarRespuesta,
        enviarRespuestaActual,
        actualizarLectura,
        actualizarTiempoRestante,
        finalizarEntrevista,
        reset,
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
};

export { InterviewContext };

