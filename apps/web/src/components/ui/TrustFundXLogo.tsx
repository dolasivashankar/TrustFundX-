'use client';

import React from 'react';

export function TrustFundXLogo({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="tfx-gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFE57F" />
          <stop offset="50%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#B8860B" />
        </linearGradient>
        <linearGradient id="tfx-inner-grad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#DAA520" />
          <stop offset="100%" stopColor="#FFF8DC" />
        </linearGradient>
        <filter id="tfx-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Outer Shield Geometry */}
      <path
        d="M24 4L7 11V22C7 32.5 14.3 41.8 24 44C33.7 41.8 41 32.5 41 22V11L24 4Z"
        fill="url(#tfx-gold-grad)"
        fillOpacity="0.15"
        stroke="url(#tfx-gold-grad)"
        strokeWidth="2.5"
        strokeLinejoin="round"
        filter="url(#tfx-glow)"
      />

      {/* Interlocking Golden X Node */}
      <path
        d="M17 16L24 24L31 16M31 32L24 24L17 32"
        stroke="url(#tfx-inner-grad)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Center Quantum Dot */}
      <circle cx="24" cy="24" r="3" fill="#FFD700" />
    </svg>
  );
}
