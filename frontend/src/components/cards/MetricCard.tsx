'use client';
import { cn, getScoreColor } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: number | null | undefined;
  icon: LucideIcon;
  iconColor?: string;
  description?: string;
  suffix?: string;
  isScore?: boolean;
}

export default function MetricCard({ label, value, icon: Icon, iconColor = 'text-teal-400', description, suffix = '%', isScore = true }: MetricCardProps) {
  const numVal = value ?? 0;
  const scoreColor = isScore ? getScoreColor(numVal) : 'text-text';
  const barColor = numVal >= 75 ? 'bg-emerald-400' : numVal >= 55 ? 'bg-amber-400' : 'bg-red-400';

  return (
    <div className="card p-5 space-y-3 hover:scale-[1.01] transition-transform">
      <div className="flex items-center justify-between">
        <div className="w-9 h-9 rounded-xl bg-surface flex items-center justify-center">
          <Icon size={16} className={iconColor} />
        </div>
        <span className={cn('text-2xl font-bold tabular-nums', scoreColor)}>
          {value !== null && value !== undefined ? `${Math.round(numVal)}${suffix}` : '—'}
        </span>
      </div>
      <div>
        <p className="text-xs text-text-muted font-medium">{label}</p>
        {description && <p className="text-[11px] text-text-dim mt-0.5 leading-relaxed">{description}</p>}
      </div>
      {isScore && value !== null && value !== undefined && (
        <div className="h-1 bg-surface rounded-full overflow-hidden">
          <div className={cn('h-full rounded-full transition-all duration-1000', barColor)} style={{ width: `${numVal}%` }} />
        </div>
      )}
    </div>
  );
}
