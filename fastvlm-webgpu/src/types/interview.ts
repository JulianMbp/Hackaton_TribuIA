export interface Pregunta {
  id?: string;
  tipo: string;
  contenido: string;
  generada_por?: string;
}

export interface Respuesta {
  pregunta_id: string;
  contenido: string;
  tipo?: string;
}

export interface EvaluacionRespuesta {
  pregunta_id: string;
  naturalidad: number;
  coherencia: number;
  ai_detected: boolean;
  ai_confidence: number;
}

export interface EntrevistaState {
  entrevistaId: string | null;
  candidatoId: string | null;
  postulacionId: string | null;
  preguntas: Pregunta[];
  preguntaActual: number;
  respuestas: Respuesta[];
  isReading: boolean;
  readingScore: number;
  isRecording: boolean;
  transcript: string;
  estado: 'inicializando' | 'leyendo' | 'revelada' | 'respondiendo' | 'enviando' | 'completada' | 'error';
  tiempoRestante: number; // Tiempo restante en segundos para responder (10 segundos)
  preguntaRevelada: boolean; // Si la pregunta actual ya fue revelada
}

