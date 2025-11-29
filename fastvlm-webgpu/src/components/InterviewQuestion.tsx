import { useInterview } from '../context/useInterviewContext';
import GlassContainer from './GlassContainer';

export default function InterviewQuestion() {
  const { state } = useInterview();

  // Solo mostrar la pregunta cuando esté revelada o en respuesta
  if (state.preguntas.length === 0 || 
      state.estado === 'inicializando' || 
      state.estado === 'leyendo') {
    return null;
  }

  const preguntaActual = state.preguntas[state.preguntaActual];
  const totalPreguntas = state.preguntas.length;
  const numeroPregunta = state.preguntaActual + 1;

  return (
    <GlassContainer className="rounded-2xl shadow-2xl max-w-2xl">
      <div className="p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold opacity-90">
            Pregunta {numeroPregunta} de {totalPreguntas}
          </h3>
          {state.isReading && (
            <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/20 rounded-full border border-yellow-500/30">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
              <span className="text-xs opacity-90">Leyendo</span>
            </div>
          )}
        </div>
        <div className="text-base leading-relaxed opacity-95">
          {preguntaActual?.contenido || 'Cargando pregunta...'}
        </div>
        {state.readingScore > 0 && (
          <div className="mt-4 text-xs opacity-70">
            Puntaje de lectura: {Math.round(state.readingScore)}%
          </div>
        )}
      </div>
    </GlassContainer>
  );
}

