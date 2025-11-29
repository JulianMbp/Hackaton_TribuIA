'use client';

// ============================================
// HOOK: useInterview - MANAGE INTERVIEW STATE WITH WEBSOCKET
// ============================================

import { useState, useEffect, useCallback, useRef } from 'react';
import { InterviewWebSocket } from '@/lib/api/websocket';
import { Message, Entrevista } from '@/lib/types';
import { entrevistaService } from '@/lib/api/services';

export const useInterview = (entrevistaId: string) => {
  const [entrevista, setEntrevista] = useState<Entrevista | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<InterviewWebSocket | null>(null);

  const loadEntrevista = useCallback(async () => {
    const response = await entrevistaService.getById(entrevistaId);
    if (response.success && response.data) {
      setEntrevista(response.data);
    }
  }, [entrevistaId]);

  // Initialize WebSocket connection
  useEffect(() => {
    if (!entrevistaId) return;

    const ws = new InterviewWebSocket(entrevistaId);
    wsRef.current = ws;

    ws.onMessage((message) => {
      setMessages((prev) => [...prev, message]);
      setIsTyping(false);
    });

    ws.onError((error) => {
      console.error('WebSocket error:', error);
      setError('Error de conexión con el servidor');
      setIsConnected(false);
    });

    ws.onClose(() => {
      setIsConnected(false);
    });

    ws.connect();
    setIsConnected(true);

    // Load interview data
    loadEntrevista();

    return () => {
      ws.disconnect();
    };
  }, [entrevistaId, loadEntrevista]);

  const sendMessage = useCallback(
    (content: string, preguntaId?: string) => {
      if (!wsRef.current || !wsRef.current.isConnected()) {
        setError('No hay conexión con el servidor');
        return;
      }

      // Add user message immediately
      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: 'candidate',
        content,
        timestamp: new Date().toISOString(),
        preguntaId,
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsTyping(true);

      // Send through WebSocket
      wsRef.current.sendMessage(content, preguntaId);
    },
    []
  );

  const startInterview = async () => {
    const response = await entrevistaService.start(entrevistaId);
    if (response.success && response.data) {
      setEntrevista(response.data);
      return true;
    }
    return false;
  };

  const completeInterview = async () => {
    const response = await entrevistaService.complete(entrevistaId);
    if (response.success && response.data) {
      setEntrevista(response.data);
      if (wsRef.current) {
        wsRef.current.disconnect();
      }
      return true;
    }
    return false;
  };

  return {
    entrevista,
    messages,
    isTyping,
    isConnected,
    error,
    sendMessage,
    startInterview,
    completeInterview,
  };
};
