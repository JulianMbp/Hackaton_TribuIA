// ============================================
// LOADING COMPONENT - SPINNER AND SKELETON
// ============================================

import React from 'react';

interface LoadingProps {
  variant?: 'spinner' | 'skeleton';
  text?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  variant = 'spinner',
  text,
}) => {
  if (variant === 'skeleton') {
    return (
      <div className="space-y-4">
        <div className="h-12 bg-neutral-100 rounded-lg animate-pulse" />
        <div className="h-12 bg-neutral-100 rounded-lg animate-pulse" />
        <div className="h-12 bg-neutral-100 rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-12 h-12 border-4 border-neutral-200 border-t-neutral-900 rounded-full animate-spin" />
      {text && <p className="mt-4 text-neutral-800">{text}</p>}
    </div>
  );
};
