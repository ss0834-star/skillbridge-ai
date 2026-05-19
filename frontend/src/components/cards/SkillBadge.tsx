import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';

interface SkillBadgeProps {
  skill: string;
  type: 'matched' | 'missing' | 'neutral';
}

export function SkillBadge({ skill, type }: SkillBadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all',
      type === 'matched' && 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
      type === 'missing' && 'bg-red-400/10 text-red-400 border-red-400/20',
      type === 'neutral' && 'bg-surface text-text-muted border-border',
    )}>
      {type === 'matched' && <Check size={10} />}
      {type === 'missing' && <X size={10} />}
      {skill}
    </span>
  );
}

export function SkillList({ skills, type, max = 20 }: { skills: string[]; type: 'matched' | 'missing' | 'neutral'; max?: number }) {
  const shown = skills.slice(0, max);
  const rest = skills.length - shown.length;
  return (
    <div className="flex flex-wrap gap-1.5">
      {shown.map(s => <SkillBadge key={s} skill={s} type={type} />)}
      {rest > 0 && <span className="badge bg-surface text-text-dim border border-border">+{rest} more</span>}
    </div>
  );
}
