// ============================================
// CHAT MESSAGE COMPONENT - INDIVIDUAL MESSAGE BUBBLE
// ============================================

import React from 'react';
import { Message } from '@/lib/types';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isAgent = message.role === 'agent';

  return (
    <div className={`flex ${isAgent ? 'justify-start' : 'justify-end'} mb-4`}>
      <div
        className={`
          max-w-[80%] sm:max-w-[70%] px-4 py-3 rounded-lg
          ${isAgent
            ? 'bg-white border border-neutral-200 text-neutral-900'
            : 'bg-neutral-900 text-white'
          }
        `}
      >
        {isAgent && (
          <p className="text-xs font-medium text-neutral-800 mb-1">Agente IA</p>
        )}
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        <p className={`text-xs mt-2 ${isAgent ? 'text-neutral-800' : 'text-neutral-200'}`}>
          {new Date(message.timestamp).toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </div>
  );
};
