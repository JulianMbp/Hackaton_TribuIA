import { useCallback, useEffect, useRef, useState } from 'react';

interface SpeechRecognitionOptions {
  onTranscript: (text: string) => void;
  onFinalTranscript: (text: string) => void;
  language?: string;
  continuous?: boolean;
}

export function useSpeechRecognition(options: SpeechRecognitionOptions) {
  const { onTranscript, onFinalTranscript, language = 'es-ES', continuous = true } = options;
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const transcriptRef = useRef<string>('');
  const fullTranscriptRef = useRef<string>(''); // Acumula todo el texto

  useEffect(() => {
    // Verificar si el navegador soporta Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError('Speech Recognition no está disponible en este navegador');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = continuous;
    recognition.interimResults = true;
    recognition.lang = language;
    // Mejorar la captura de caracteres especiales y tildes
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
      transcriptRef.current = '';
      fullTranscriptRef.current = ''; // Reiniciar el texto completo
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
          // Acumular el texto final en el transcript completo
          fullTranscriptRef.current += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      // Mostrar texto completo acumulado + texto intermedio actual
      const currentFullText = fullTranscriptRef.current + interimTranscript;
      transcriptRef.current = currentFullText;
      onTranscript(currentFullText);

      if (finalTranscript) {
        // Solo llamar onFinalTranscript cuando hay texto final, pero mantener todo acumulado
        onFinalTranscript(fullTranscriptRef.current.trim());
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      setError(`Error de reconocimiento: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onTranscript, onFinalTranscript, language, continuous]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  // Función para obtener el texto completo acumulado
  const getFullTranscript = useCallback(() => {
    return fullTranscriptRef.current.trim() || transcriptRef.current.trim();
  }, []);

  // Función para limpiar el transcript
  const clearTranscript = useCallback(() => {
    transcriptRef.current = '';
    fullTranscriptRef.current = '';
  }, []);

  return {
    isListening,
    error,
    startListening,
    stopListening,
    getFullTranscript,
    clearTranscript,
  };
}

// Definir tipos para SpeechRecognition
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives?: number;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => void) | null;
  onend: ((this: SpeechRecognition, ev: Event) => void) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

// Extender el tipo Window para incluir SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: {
      new (): SpeechRecognition;
    };
    webkitSpeechRecognition: {
      new (): SpeechRecognition;
    };
  }
}

