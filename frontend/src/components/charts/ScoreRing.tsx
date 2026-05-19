'use client';
import { useEffect, useState } from 'react';
import { getScoreLabel } from '@/lib/utils';

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  animate?: boolean;
}

export default function ScoreRing({ score, size = 120, strokeWidth = 8, label, animate = true }: ScoreRingProps) {
  const [displayed, setDisplayed] = useState(animate ? 0 : score);
  const r = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (displayed / 100) * circumference;

  useEffect(() => {
    if (!animate) return;
    let raf: number;
    const start = performance.now();
    const duration = 1200;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(ease * score));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [score, animate]);

  const color = score >= 75 ? '#10b981' : score >= 55 ? '#f59e0b' : '#ef4444';

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1c2330" strokeWidth={strokeWidth} />
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={strokeWidth}
            strokeDasharray={circumference} strokeDashoffset={offset}
            strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.05s ease' }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-text">{displayed}</span>
          <span className="text-[10px] text-text-dim">/ 100</span>
        </div>
      </div>
      {label && <p className="text-xs text-text-muted text-center">{label}</p>}
      <span className="text-xs font-medium" style={{ color }}>{getScoreLabel(score)}</span>
    </div>
  );
}
