'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LayoutDashboard, FileSearch, Building2, MessageSquare, FolderGit2, Shield, LogOut, ChevronRight, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/analyze', icon: FileSearch, label: 'Analyze Resume' },
  { href: '/company-fit', icon: Building2, label: 'Company Fit' },
  { href: '/interview-prep', icon: MessageSquare, label: 'Interview Prep' },
  { href: '/projects', icon: FolderGit2, label: 'Projects' },
  { href: '/admin', icon: Shield, label: 'Admin', adminOnly: true },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ name?: string; email?: string; role?: string }>({});

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('user') || '{}');
      setUser(u);
    } catch {}
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <aside className="w-64 h-screen sticky top-0 flex flex-col bg-surface border-r border-border flex-shrink-0">
      <div className="h-16 flex items-center px-5 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center flex-shrink-0">
            <span className="text-background font-bold text-sm">S</span>
          </div>
          <div>
            <p className="font-semibold text-sm leading-none">SkillBridge</p>
            <p className="text-[10px] text-accent-teal leading-none mt-0.5">AI Career Intelligence</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {NAV.map(item => {
          if (item.adminOnly && user?.role !== 'admin') return null;
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group',
                active ? 'bg-teal-400/10 text-teal-400 border border-teal-400/20' : 'text-text-muted hover:text-text hover:bg-surface-2'
              )}>
              <item.icon size={16} className={active ? 'text-teal-400' : 'text-text-dim group-hover:text-text-muted'} />
              <span className="flex-1">{item.label}</span>
              {active && <ChevronRight size={12} className="text-teal-400" />}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-2">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-2 border border-border">
          <Zap size={12} className="text-amber-400" />
          <span className="text-xs text-text-dim">Mock AI Mode</span>
          <span className="ml-auto text-[10px] badge bg-amber-400/10 text-amber-400 border border-amber-400/20">Active</span>
        </div>
      </div>

      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-surface-2 transition-colors group cursor-pointer" onClick={logout}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400/30 to-cyan-400/30 flex items-center justify-center flex-shrink-0">
            <span className="text-teal-400 font-semibold text-xs">{user?.name?.[0] || 'U'}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-text truncate">{user?.name || 'User'}</p>
            <p className="text-[10px] text-text-dim truncate">{user?.email || ''}</p>
          </div>
          <LogOut size={13} className="text-text-dim group-hover:text-red-400 transition-colors flex-shrink-0" />
        </div>
      </div>
    </aside>
  );
}
