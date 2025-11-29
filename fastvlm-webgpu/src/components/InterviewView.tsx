import { useCallback, useEffect, useRef, useState } from "react";
import { PROMPTS, TIMING } from "../constants";
import { useInterview } from "../context/useInterviewContext";
import { useVLMContext } from "../context/useVLMContext";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import GlassContainer from "./GlassContainer";
import InterviewQuestion from "./InterviewQuestion";
import WebcamCapture from "./WebcamCapture";

interface InterviewViewProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

function useReadingDetectionLoop(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  isRunning: boolean,
  onReadingUpdate: (isReading: boolean, score: number) => void,
) {
  const { isLoaded, runInference } = useVLMContext();
  const abortControllerRef = useRef<AbortController | null>(null);
  const onReadingUpdateRef = useRef(onReadingUpdate);

  useEffect(() => {
    onReadingUpdateRef.current = onReadingUpdate;
  }, [onReadingUpdate]);

  useEffect(() => {
    abortControllerRef.current?.abort();
    if (!isRunning || !isLoaded) return;

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;
    const video = videoRef.current;
    
    const detectionLoop = async () => {
      while (!signal.aborted) {
        if (video && video.readyState >= 2 && !video.paused && video.videoWidth > 0) {
          try {
            const result = await runInference(video, PROMPTS.readingDetection);
            
            if (result && !signal.aborted) {
              // Intentar parsear la respuesta JSON
              try {
                // Limpiar markdown code blocks si existen
                const cleanedResult = result.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
                
                // Intentar extraer JSON
                const jsonMatch = cleanedResult.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                  const readingData = JSON.parse(jsonMatch[0]);
                  const isReading = readingData.is_reading || false;
                  const confidence = readingData.confidence || 0;
                  
                  onReadingUpdateRef.current(isReading, confidence);
                } else {
                  // Si no es JSON, intentar inferir del texto
                  const lowerResult = result.toLowerCase();
                  const isReading = lowerResult.includes('reading') || lowerResult.includes('leyendo');
                  const confidence = isReading ? 70 : 30;
                  onReadingUpdateRef.current(isReading, confidence);
                }
              } catch {
                // Si falla el parseo, usar heurística simple
                const lowerResult = result.toLowerCase();
                const isReading = lowerResult.includes('reading') || lowerResult.includes('leyendo') || lowerResult.includes('read');
                const confidence = isReading ? 60 : 40;
                onReadingUpdateRef.current(isReading, confidence);
              }
            }
          } catch (error) {
            if (!signal.aborted) {
              console.error("Error detecting reading:", error);
            }
          }
        }
        if (signal.aborted) break;
        // Detectar lectura con menos frecuencia que el captioning normal
        await new Promise((resolve) => setTimeout(resolve, TIMING.FRAME_CAPTURE_DELAY * 3));
      }
    };

    setTimeout(detectionLoop, 0);

    return () => {
      abortControllerRef.current?.abort();
    };
  }, [isRunning, isLoaded, runInference, videoRef]);
}

export default function InterviewView({ videoRef }: InterviewViewProps) {
  const { state, agregarRespuesta, actualizarLectura, revelarPregunta, comenzarRespuesta, actualizarTiempoRestante, siguientePregunta, finalizarEntrevista } = useInterview();
  const [isLoopRunning, setIsLoopRunning] = useState<boolean>(true);
  const [transcript, setTranscript] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const contadorRef = useRef<NodeJS.Timeout | null>(null);

  // Detección de lectura
  const handleReadingUpdate = useCallback((isReading: boolean, score: number) => {
    actualizarLectura(isReading, score);
  }, [actualizarLectura]);

  useReadingDetectionLoop(videoRef, isLoopRunning && state.estado === 'leyendo', handleReadingUpdate);

  // Captura de voz
  const handleTranscript = useCallback((text: string) => {
    setTranscript(text);
  }, []);

  const handleFinalTranscript = useCallback((text: string) => {
    if (text.trim() && state.preguntas[state.preguntaActual]) {
      const preguntaActual = state.preguntas[state.preguntaActual];
      agregarRespuesta(preguntaActual.id!, text.trim());
    }
  }, [state.preguntas, state.preguntaActual, agregarRespuesta]);

  const { isListening, error: speechError, startListening, stopListening, getFullTranscript, clearTranscript } = useSpeechRecognition({
    onTranscript: handleTranscript,
    onFinalTranscript: handleFinalTranscript,
    language: 'es-ES',
    continuous: true,
  });

  // Contador de 30 segundos cuando se revela la pregunta
  useEffect(() => {
    if (state.estado === 'revelada' && state.tiempoRestante > 0) {
      if (contadorRef.current) {
        clearInterval(contadorRef.current);
      }
      contadorRef.current = setInterval(() => {
        actualizarTiempoRestante((prev: number) => {
          const nuevoTiempo = prev - 1;
          if (nuevoTiempo <= 0) {
            if (contadorRef.current) {
              clearInterval(contadorRef.current);
              contadorRef.current = null;
            }
            // Cambiar a estado de respuesta cuando el contador llega a 0
            setTimeout(() => comenzarRespuesta(), 100);
            return 0;
          }
          return nuevoTiempo;
        });
      }, 1000);
    } else if (state.estado !== 'revelada' && contadorRef.current) {
      clearInterval(contadorRef.current);
      contadorRef.current = null;
    }

    return () => {
      if (contadorRef.current) {
        clearInterval(contadorRef.current);
        contadorRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.estado, actualizarTiempoRestante, comenzarRespuesta]);

  // Iniciar captura de voz cuando cambia a estado de respuesta
  useEffect(() => {
    if (state.estado === 'respondiendo' && !isListening) {
      startListening();
    } else if (state.estado !== 'respondiendo' && isListening) {
      stopListening();
    }
  }, [state.estado, isListening, startListening, stopListening]);

  const handleToggleLoop = useCallback(() => {
    setIsLoopRunning((prev) => !prev);
    if (error) setError(null);
  }, [error]);

  const handleRevelarPregunta = useCallback(() => {
    revelarPregunta();
  }, [revelarPregunta]);

  const handleTerminarRespuesta = useCallback(async () => {
    try {
      // Detener la grabación
      stopListening();
      
      // Obtener todo el texto capturado
      const textoCompleto = getFullTranscript() || transcript;
      console.log('📝 Texto completo capturado:', textoCompleto);
      
      if (textoCompleto.trim() && state.preguntas[state.preguntaActual]) {
        const preguntaActual = state.preguntas[state.preguntaActual];
        // Guardar la respuesta con todo el texto
        agregarRespuesta(preguntaActual.id!, textoCompleto.trim());
        console.log('✅ Respuesta guardada:', textoCompleto.trim());
      }
      
      // Limpiar el transcript
      clearTranscript();
      setTranscript("");
    } catch (error) {
      console.error('Error al terminar respuesta:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
    }
  }, [stopListening, getFullTranscript, transcript, state.preguntas, state.preguntaActual, agregarRespuesta, clearTranscript]);

  const handleSiguientePregunta = useCallback(async () => {
    try {
      // Asegurarse de que la respuesta esté guardada antes de pasar a la siguiente
      await handleTerminarRespuesta();
      
      // Enviar la respuesta antes de pasar a la siguiente pregunta
      await siguientePregunta();
      
      if (contadorRef.current) {
        clearInterval(contadorRef.current);
        contadorRef.current = null;
      }
    } catch (error) {
      console.error('Error al pasar a siguiente pregunta:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
    }
  }, [handleTerminarRespuesta, siguientePregunta]);

  const handleFinalizar = useCallback(async () => {
    try {
      stopListening();
      
      // Mostrar mensaje de procesando
      const mensajeProcesando = 'Enviando tu entrevista...';
      console.log(mensajeProcesando);
      
      await finalizarEntrevista();
      
      // Mostrar alerta de éxito
      alert('✅ ¡Entrevista completada exitosamente!\n\nTu entrevista ha sido enviada y está siendo evaluada. Serás contactado en los próximos días con los resultados.');
      
      // Esperar un momento para que el usuario vea el mensaje
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Redirigir al dashboard
      window.location.href = 'http://localhost:3000/panel-candidato';
    } catch (err) {
      console.error('Error al finalizar:', err);
      // Aún así intentar redirigir después de mostrar el error
      const continuar = confirm('Hubo un error al enviar la entrevista, pero tus respuestas fueron guardadas. ¿Deseas continuar al dashboard?');
      if (continuar) {
        window.location.href = 'http://localhost:3000/panel-candidato';
      } else {
        setError(err instanceof Error ? err.message : 'Error al finalizar entrevista');
      }
    }
  }, [finalizarEntrevista, stopListening]);

  const esUltimaPregunta = state.preguntaActual === state.preguntas.length - 1;

  return (
    <div className="absolute inset-0 text-white">
      <div className="relative w-full h-full">
        <WebcamCapture isRunning={isLoopRunning} onToggleRunning={handleToggleLoop} error={error || speechError} />

        {/* Pregunta de entrevista - Top Center */}
        {state.estado !== 'inicializando' && state.preguntas.length > 0 && (
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10">
            <InterviewQuestion />
          </div>
        )}

        {/* Controles de entrevista - Bottom Center */}
        {state.estado !== 'inicializando' && state.preguntas.length > 0 && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
            <GlassContainer className="rounded-2xl shadow-2xl">
              <div className="p-4 flex flex-col items-center gap-4">
                {state.estado === 'leyendo' && (
                  <button
                    onClick={handleRevelarPregunta}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
                  >
                    Revelar Pregunta
                  </button>
                )}

                {state.estado === 'revelada' && (
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`text-2xl font-bold ${state.tiempoRestante <= 10 ? 'text-red-500 animate-pulse' : 'text-yellow-400'}`}>
                        {state.tiempoRestante}s
                      </div>
                      <span className="text-sm opacity-80">Tiempo para responder</span>
                    </div>
                    {state.tiempoRestante === 0 && (
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-sm">Puedes responder ahora...</span>
                      </div>
                    )}
                  </div>
                )}
                
                {state.estado === 'respondiendo' && (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                      <span className="text-sm">Grabando respuesta...</span>
                    </div>
                    {transcript && (
                      <div className="max-w-md text-sm opacity-80 text-center bg-black/30 p-3 rounded-lg max-h-32 overflow-y-auto">
                        {transcript}
                      </div>
                    )}
                    <div className="flex gap-3">
                      <button
                        onClick={handleTerminarRespuesta}
                        className="px-6 py-3 bg-orange-600 hover:bg-orange-700 rounded-lg font-semibold transition-colors"
                      >
                        Terminar Respuesta
                      </button>
                      <button
                        onClick={handleSiguientePregunta}
                        disabled={esUltimaPregunta || !transcript.trim()}
                        className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
                      >
                        {esUltimaPregunta ? 'Finalizar' : 'Siguiente Pregunta'}
                      </button>
                    </div>
                  </>
                )}

                {esUltimaPregunta && state.respuestas.length === state.preguntas.length && (
                  <button
                    onClick={handleFinalizar}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors"
                  >
                    Enviar Entrevista
                  </button>
                )}
              </div>
            </GlassContainer>
          </div>
        )}
      </div>
    </div>
  );
}

