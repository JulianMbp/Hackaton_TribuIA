// ============================================
// TYPING INDICATOR - AGENT IS TYPING ANIMATION
// ============================================

import React from 'react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start mb-4">
      <div className="bg-white border border-neutral-200 px-4 py-3 rounded-lg">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-neutral-800 rounded-full typing-dot" />
          <div className="w-2 h-2 bg-neutral-800 rounded-full typing-dot" />
          <div className="w-2 h-2 bg-neutral-800 rounded-full typing-dot" />
        </div>
      </div>
    </div>
  );
};
