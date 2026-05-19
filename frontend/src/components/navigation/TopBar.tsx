'use client';
import { Search, Bell, RefreshCw } from 'lucide-react';
import { useState } from 'react';

interface TopBarProps { title: string; subtitle?: string; }

export default function TopBar({ title, subtitle }: TopBarProps) {
  const [searching, setSearching] = useState(false);

  return (
    <header className="h-16 border-b border-border bg-surface/80 backdrop-blur-sm flex items-center px-6 gap-4 sticky top-0 z-20">
      <div className="flex-1">
        <h1 className="text-base font-semibold text-text">{title}</h1>
        {subtitle && <p className="text-xs text-text-muted">{subtitle}</p>}
      </div>

      <div className="hidden md:flex items-center gap-2 bg-surface-2 border border-border rounded-lg px-3 py-2 w-56 group focus-within:border-teal-400/50 transition-colors">
        <Search size={13} className="text-text-dim group-focus-within:text-teal-400 transition-colors" />
        <input className="bg-transparent text-xs text-text placeholder-text-dim outline-none flex-1" placeholder="Search analyses..." />
      </div>

      <button className="w-9 h-9 rounded-lg hover:bg-surface-2 flex items-center justify-center text-text-muted hover:text-text transition-colors border border-transparent hover:border-border">
        <Bell size={15} />
      </button>

      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/20">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-xs text-emerald-400 font-medium">Live</span>
      </div>
    </header>
  );
}
