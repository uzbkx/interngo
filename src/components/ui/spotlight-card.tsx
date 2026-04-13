"use client";

import React, { useEffect, useRef, ReactNode } from 'react';
import { cn } from "@/lib/utils";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: 'blue' | 'purple' | 'green' | 'red' | 'orange';
}

const glowColorMap = {
  blue: { base: 220, spread: 200 },
  purple: { base: 280, spread: 300 },
  green: { base: 120, spread: 200 },
  red: { base: 0, spread: 200 },
  orange: { base: 30, spread: 200 },
};

const GlowCard: React.FC<GlowCardProps> = ({
  children,
  className = '',
  glowColor = 'blue',
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const syncPointer = (e: PointerEvent) => {
      if (cardRef.current) {
        cardRef.current.style.setProperty('--x', e.clientX.toFixed(2));
        cardRef.current.style.setProperty('--xp', (e.clientX / window.innerWidth).toFixed(2));
        cardRef.current.style.setProperty('--y', e.clientY.toFixed(2));
      }
    };
    document.addEventListener('pointermove', syncPointer);
    return () => document.removeEventListener('pointermove', syncPointer);
  }, []);

  const { base, spread } = glowColorMap[glowColor];

  return (
    <div
      ref={cardRef}
      data-glow
      style={{
        '--base': base,
        '--spread': spread,
        '--border': '2',
        '--backdrop': 'hsl(0 0% 60% / 0.06)',
        '--backup-border': 'var(--backdrop)',
        '--size': '200',
        '--outer': '1',
        '--border-size': 'calc(var(--border, 2) * 1px)',
        '--spotlight-size': 'calc(var(--size, 150) * 1px)',
        '--hue': 'calc(var(--base) + (var(--xp, 0) * var(--spread, 0)))',
        backgroundImage: `radial-gradient(
          var(--spotlight-size) var(--spotlight-size) at
          calc(var(--x, 0) * 1px) calc(var(--y, 0) * 1px),
          hsl(var(--hue, 210) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 70) * 1%) / var(--bg-spot-opacity, 0.1)), transparent
        )`,
        backgroundColor: 'var(--backdrop, transparent)',
        backgroundSize: 'calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)))',
        backgroundPosition: '50% 50%',
        backgroundAttachment: 'fixed',
        border: 'var(--border-size) solid var(--backup-border)',
        position: 'relative',
        touchAction: 'none',
      } as React.CSSProperties}
      className={cn(
        "rounded-2xl relative backdrop-blur-[5px] overflow-hidden",
        "hover:-translate-y-1 transition-transform duration-300",
        className
      )}
    >
      <div data-glow-inner />
      {children}
    </div>
  );
};

export { GlowCard };
