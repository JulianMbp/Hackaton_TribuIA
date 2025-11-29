'use client';

import React, { useState, useEffect } from 'react';

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
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-cyan-500/20 rounded-full blur-xl"></div>

        {/* Brain Circuit Logo - More detailed */}
        <svg
          className="w-full h-full relative z-10 drop-shadow-2xl"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradients matching the image */}
            <linearGradient id="leftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="50%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
            <linearGradient id="rightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>

          {/* LEFT HEMISPHERE - Purple/Pink side */}
          <g>
            {/* Brain outline - left side with more organic curves */}
            <path
              d="M 100,30 Q 65,30 45,50 Q 30,65 30,90 Q 30,115 35,130 Q 40,150 50,165 Q 60,175 75,180 Q 85,183 95,183 L 95,30 Z"
              fill="none"
              stroke="url(#leftGrad)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={animate ? 'animate-pulse-subtle' : ''}
            />

            {/* Circuit patterns - more elaborate */}
            <g stroke="url(#leftGrad)" strokeWidth="2.5" fill="none" strokeLinecap="round">
              {/* Top circuits */}
              <circle cx="60" cy="45" r="3" fill="url(#leftGrad)" className={animate ? 'animate-ping-slow' : ''} />
              <path d="M 60,45 L 70,55 L 60,65" />
              <circle cx="70" cy="55" r="3" fill="url(#leftGrad)" />
              <circle cx="60" cy="65" r="3" fill="url(#leftGrad)" className={animate ? 'animate-ping-slow' : ''} style={{ animationDelay: '0.3s' }} />

              {/* Middle circuits */}
              <circle cx="45" cy="75" r="3" fill="url(#leftGrad)" className={animate ? 'animate-ping-slow' : ''} style={{ animationDelay: '0.6s' }} />
              <path d="M 45,75 L 55,85" />
              <circle cx="55" cy="85" r="3" fill="url(#leftGrad)" />
              <path d="M 55,85 L 65,85 L 75,95" />
              <circle cx="75" cy="95" r="3" fill="url(#leftGrad)" className={animate ? 'animate-ping-slow' : ''} style={{ animationDelay: '0.9s' }} />

              {/* Lower circuits */}
              <circle cx="50" cy="105" r="3" fill="url(#leftGrad)" className={animate ? 'animate-ping-slow' : ''} style={{ animationDelay: '1.2s' }} />
              <path d="M 50,105 L 60,115" />
              <circle cx="60" cy="115" r="3" fill="url(#leftGrad)" />
              <path d="M 60,115 L 70,125 L 60,135" />
              <circle cx="70" cy="125" r="3" fill="url(#leftGrad)" className={animate ? 'animate-ping-slow' : ''} style={{ animationDelay: '1.5s' }} />
              <circle cx="60" cy="135" r="3" fill="url(#leftGrad)" />

              {/* Bottom circuits */}
              <circle cx="55" cy="150" r="3" fill="url(#leftGrad)" className={animate ? 'animate-ping-slow' : ''} style={{ animationDelay: '1.8s' }} />
              <path d="M 55,150 L 65,160" />
              <circle cx="65" cy="160" r="3" fill="url(#leftGrad)" />
            </g>
          </g>

          {/* RIGHT HEMISPHERE - Cyan/Blue side */}
          <g>
            {/* Brain outline - right side */}
            <path
              d="M 100,30 Q 135,30 155,50 Q 170,65 170,90 Q 170,115 165,130 Q 160,150 150,165 Q 140,175 125,180 Q 115,183 105,183 L 105,30 Z"
              fill="none"
              stroke="url(#rightGrad)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={animate ? 'animate-pulse-subtle' : ''}
              style={{ animationDelay: '0.2s' }}
            />

            {/* Circuit patterns - right side */}
            <g stroke="url(#rightGrad)" strokeWidth="2.5" fill="none" strokeLinecap="round">
              {/* Top circuits */}
              <circle cx="140" cy="45" r="3" fill="url(#rightGrad)" className={animate ? 'animate-ping-slow' : ''} style={{ animationDelay: '0.2s' }} />
              <path d="M 140,45 L 130,55 L 140,65" />
              <circle cx="130" cy="55" r="3" fill="url(#rightGrad)" />
              <circle cx="140" cy="65" r="3" fill="url(#rightGrad)" className={animate ? 'animate-ping-slow' : ''} style={{ animationDelay: '0.5s' }} />

              {/* Middle circuits */}
              <circle cx="155" cy="75" r="3" fill="url(#rightGrad)" className={animate ? 'animate-ping-slow' : ''} style={{ animationDelay: '0.8s' }} />
              <path d="M 155,75 L 145,85" />
              <circle cx="145" cy="85" r="3" fill="url(#rightGrad)" />
              <path d="M 145,85 L 135,85 L 125,95" />
              <circle cx="125" cy="95" r="3" fill="url(#rightGrad)" className={animate ? 'animate-ping-slow' : ''} style={{ animationDelay: '1.1s' }} />

              {/* Lower circuits */}
              <circle cx="150" cy="105" r="3" fill="url(#rightGrad)" className={animate ? 'animate-ping-slow' : ''} style={{ animationDelay: '1.4s' }} />
              <path d="M 150,105 L 140,115" />
              <circle cx="140" cy="115" r="3" fill="url(#rightGrad)" />
              <path d="M 140,115 L 130,125 L 140,135" />
              <circle cx="130" cy="125" r="3" fill="url(#rightGrad)" className={animate ? 'animate-ping-slow' : ''} style={{ animationDelay: '1.7s' }} />
              <circle cx="140" cy="135" r="3" fill="url(#rightGrad)" />

              {/* Bottom circuits */}
              <circle cx="145" cy="150" r="3" fill="url(#rightGrad)" className={animate ? 'animate-ping-slow' : ''} style={{ animationDelay: '2s' }} />
              <path d="M 145,150 L 135,160" />
              <circle cx="135" cy="160" r="3" fill="url(#rightGrad)" />
            </g>
          </g>

          {/* CENTER ARROWS - Chevrons pointing right */}
          <g stroke="#3b82f6" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path
              d="M 90,85 L 100,95 L 90,105"
              className={animate ? 'animate-pulse' : ''}
            />
            <path
              d="M 100,85 L 110,95 L 100,105"
              className={animate ? 'animate-pulse' : ''}
              style={{ animationDelay: '0.3s' }}
            />
          </g>

          {/* Optional: Glowing dots at key points */}
          {animate && (
            <g>
              <circle cx="60" cy="45" r="2" fill="#f97316" className="animate-ping-slow" opacity="0.8" />
              <circle cx="140" cy="45" r="2" fill="#06b6d4" className="animate-ping-slow" opacity="0.8" style={{ animationDelay: '0.5s' }} />
              <circle cx="75" cy="95" r="2" fill="#ec4899" className="animate-ping-slow" opacity="0.8" style={{ animationDelay: '1s' }} />
              <circle cx="125" cy="95" r="2" fill="#3b82f6" className="animate-ping-slow" opacity="0.8" style={{ animationDelay: '1.5s' }} />
            </g>
          )}
        </svg>
      </div>

      {/* Text */}
      {showText && (
        <div className="flex flex-col">
          <h1
            className={`${config.text} font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 dark:from-purple-400 dark:via-pink-400 dark:to-cyan-400 bg-clip-text text-transparent transition-all duration-500`}
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
