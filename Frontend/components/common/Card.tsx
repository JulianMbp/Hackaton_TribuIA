// ============================================
// CARD COMPONENT - REUSABLE CARD CONTAINER
// ============================================

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = false,
}) => {
  return (
    <div
      className={`card-base p-6 ${hoverable ? 'smooth-hover hover:shadow-md cursor-pointer' : ''
        } ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
