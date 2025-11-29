// ============================================
// WEBSOCKET CLIENT FOR REAL-TIME INTERVIEW
// ============================================

import { API_CONFIG, API_ENDPOINTS } from './config';
import { Message } from '@/lib/types';

type MessageCallback = (message: Message) => void;
type ErrorCallback = (error: Event) => void;
type CloseCallback = () => void;

export class InterviewWebSocket {
  private ws: WebSocket | null = null;
  private entrevistaId: string;
  private messageCallbacks: MessageCallback[] = [];
  private errorCallbacks: ErrorCallback[] = [];
  private closeCallbacks: CloseCallback[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 2000;

  constructor(entrevistaId: string) {
    this.entrevistaId = entrevistaId;
  }

  connect(): void {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    const wsUrl = `${API_CONFIG.WS_URL}${API_ENDPOINTS.WS_INTERVIEW(this.entrevistaId)}?token=${token}`;

    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // Convert backend message to frontend Message type
        const message: Message = {
          id: data.id || crypto.randomUUID(),
          role: data.role || 'agent',
          content: data.content || data.message || '',
          timestamp: data.timestamp || new Date().toISOString(),
          preguntaId: data.preguntaId,
        };

        this.messageCallbacks.forEach((callback) => callback(message));
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.errorCallbacks.forEach((callback) => callback(error));
    };

    this.ws.onclose = () => {
      console.log('WebSocket closed');
      this.closeCallbacks.forEach((callback) => callback());
      this.attemptReconnect();
    };
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);

      setTimeout(() => {
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  sendMessage(content: string, preguntaId?: string): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message = {
        role: 'candidate',
        content,
        preguntaId,
        timestamp: new Date().toISOString(),
      };
      this.ws.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not open');
    }
  }

  onMessage(callback: MessageCallback): void {
    this.messageCallbacks.push(callback);
  }

  onError(callback: ErrorCallback): void {
    this.errorCallbacks.push(callback);
  }

  onClose(callback: CloseCallback): void {
    this.closeCallbacks.push(callback);
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.messageCallbacks = [];
    this.errorCallbacks = [];
    this.closeCallbacks = [];
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}
