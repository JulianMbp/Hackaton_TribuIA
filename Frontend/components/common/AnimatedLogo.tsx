'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface AnimatedLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  animate?: boolean;
  className?: string;
}

export const AnimatedLogo: React.FC<AnimatedLogoProps> = ({
  size = 'md',
  showText = true,
  animate = true,
  className = '',
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sizeConfig = {
    sm: {
      container: 'w-12 h-12',
      text: 'text-lg',
      subtitle: 'text-xs',
    },
    md: {
      container: 'w-16 h-16',
      text: 'text-2xl',
      subtitle: 'text-sm',
    },
    lg: {
      container: 'w-24 h-24',
      text: 'text-4xl',
      subtitle: 'text-base',
    },
    xl: {
      container: 'w-32 h-32',
      text: 'text-5xl',
      subtitle: 'text-lg',
    },
  };

  const config = sizeConfig[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Container */}
      <div
        className={`${config.container} relative ${
          animate && mounted ? 'animate-logo-pulse' : ''
        }`}
      >
        {/* Gradient Background Circle */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 rounded-full opacity-20 blur-xl animate-pulse"></div>

        {/* Brain Circuit Logo - SVG Version */}
        <svg
          className="w-full h-full relative z-10 drop-shadow-lg"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Left Brain - Gradient Purple/Pink */}
          <defs>
            <linearGradient id="leftBrain" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="50%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#db2777" />
            </linearGradient>
            <linearGradient id="rightBrain" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="50%" stopColor="#0891b2" />
              <stop offset="100%" stopColor="#0e7490" />
            </linearGradient>
          </defs>

          {/* Left Hemisphere - Artistic/Creative Side */}
          <path
            d="M50,100 Q30,70 40,40 Q50,20 70,25 Q85,28 90,35 L90,165 Q85,172 70,175 Q50,180 40,160 Q30,130 50,100 Z"
            fill="url(#leftBrain)"
            className={animate ? 'animate-pulse-subtle' : ''}
          />

          {/* Circuit patterns - Left */}
          <g stroke="currentColor" strokeWidth="2" className="text-white/80">
            <circle cx="50" cy="50" r="3" fill="currentColor" className={animate ? 'animate-ping-slow' : ''} />
            <line x1="50" y1="50" x2="60" y2="60" />
            <circle cx="60" cy="60" r="3" fill="currentColor" />
            <line x1="60" y1="60" x2="70" y2="50" />

            <circle cx="45" cy="80" r="3" fill="currentColor" className={animate ? 'animate-ping-slow' : ''} style={{ animationDelay: '0.5s' }} />
            <line x1="45" y1="80" x2="55" y2="90" />
            <circle cx="55" cy="90" r="3" fill="currentColor" />

            <circle cx="50" cy="120" r="3" fill="currentColor" className={animate ? 'animate-ping-slow' : ''} style={{ animationDelay: '1s' }} />
            <line x1="50" y1="120" x2="65" y2="130" />
            <circle cx="65" cy="130" r="3" fill="currentColor" />
          </g>

          {/* Right Hemisphere - Logic/Tech Side */}
          <path
            d="M150,100 Q170,70 160,40 Q150,20 130,25 Q115,28 110,35 L110,165 Q115,172 130,175 Q150,180 160,160 Q170,130 150,100 Z"
            fill="url(#rightBrain)"
            className={animate ? 'animate-pulse-subtle' : ''}
            style={{ animationDelay: '0.3s' }}
          />

          {/* Circuit patterns - Right */}
          <g stroke="currentColor" strokeWidth="2" className="text-white/80">
            <circle cx="150" cy="50" r="3" fill="currentColor" className={animate ? 'animate-ping-slow' : ''} style={{ animationDelay: '0.2s' }} />
            <line x1="150" y1="50" x2="140" y2="60" />
            <circle cx="140" cy="60" r="3" fill="currentColor" />
            <line x1="140" y1="60" x2="130" y2="50" />

            <circle cx="155" cy="80" r="3" fill="currentColor" className={animate ? 'animate-ping-slow' : ''} style={{ animationDelay: '0.7s' }} />
            <line x1="155" y1="80" x2="145" y2="90" />
            <circle cx="145" cy="90" r="3" fill="currentColor" />

            <circle cx="150" cy="120" r="3" fill="currentColor" className={animate ? 'animate-ping-slow' : ''} style={{ animationDelay: '1.2s' }} />
            <line x1="150" y1="120" x2="135" y2="130" />
            <circle cx="135" cy="130" r="3" fill="currentColor" />
          </g>

          {/* Center Connector - AI Arrow */}
          <g className="text-blue-600 dark:text-blue-400">
            <path
              d="M90,100 L110,100 M105,95 L110,100 L105,105"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={animate ? 'animate-pulse' : ''}
            />
            <path
              d="M90,110 L110,110 M105,105 L110,110 L105,115"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={animate ? 'animate-pulse' : ''}
              style={{ animationDelay: '0.5s' }}
            />
          </g>
        </svg>
      </div>

      {/* Text */}
      {showText && (
        <div className="flex flex-col">
          <h1
            className={`${config.text} font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 dark:from-purple-400 dark:via-pink-400 dark:to-cyan-400 bg-clip-text text-transparent transition-all duration-500`}
          >
            SELECTIFY
          </h1>
          <p className={`${config.subtitle} text-neutral-600 dark:text-neutral-400 font-medium transition-colors duration-300`}>
            AI-Driven Recruitment
          </p>
        </div>
      )}
    </div>
  );
};
