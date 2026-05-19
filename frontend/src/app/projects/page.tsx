'use client';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { analysisApi } from '@/lib/api';
import { FolderGit2, Loader2, Code2, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProjectSuggestion, AnalysisResult } from '@/types';

const DIFF_STYLES: Record<string, string> = {
  Beginner: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  Intermediate: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  Advanced: 'text-red-400 bg-red-400/10 border-red-400/20'
};

function ProjectCard({ p }: { p: ProjectSuggestion }) {
  return (
    <div className="card p-5 space-y-4 hover:border-teal-400/20 transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="w-10 h-10 rounded-xl bg-teal-400/10 flex items-center justify-center flex-shrink-0">
          <FolderGit2 size={18} className="text-teal-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-sm leading-tight">{p.title}</h3>
          </div>
          <span className={cn('badge border text-[10px]', DIFF_STYLES[p.difficulty] || 'bg-surface text-text-muted border-border')}>{p.difficulty}</span>
        </div>
      </div>

      <p className="text-xs text-text-muted leading-relaxed">{p.description}</p>

      {p.tech_stack && p.tech_stack.length > 0 && (
        <div>
          <p className="text-[10px] text-text-dim mb-1.5 flex items-center gap-1"><Code2 size={10} />Tech Stack</p>
          <div className="flex flex-wrap gap-1">
            {p.tech_stack.map(t => <span key={t} className="badge bg-surface text-text-muted border border-border text-[10px]">{t}</span>)}
          </div>
        </div>
      )}

      {p.resume_bullet && (
        <div className="p-3 rounded-lg bg-emerald-400/5 border border-emerald-400/10">
          <p className="text-[10px] text-emerald-400 mb-1 flex items-center gap-1"><Zap size={9} />Resume Bullet (after completing)</p>
          <p className="text-xs text-text-muted leading-relaxed italic">{p.resume_bullet}</p>
        </div>
      )}
    </div>
  );
}

export default function ProjectsPage() {
  const [analyses, setAnalyses] = useState<AnalysisResult[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [projects, setProjects] = useState<ProjectSuggestion[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    analysisApi.list().then(r => { setAnalyses(r.data); if (r.data[0]) setSelectedId(r.data[0].id); });
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    setLoading(true);
    analysisApi.getProjects(selectedId).then(r => setProjects(r.data)).finally(() => setLoading(false));
  }, [selectedId]);

  return (
    <DashboardLayout title="Project Recommendations" subtitle="Build these projects to close your skill gaps and impress recruiters">
      <div className="max-w-5xl space-y-5 animate-fade-in">
        {analyses.length > 0 && (
          <div className="card p-4">
            <p className="text-xs text-text-muted mb-2">Select Analysis</p>
            <div className="flex flex-wrap gap-2">
              {analyses.map(a => (
                <button key={a.id} onClick={() => setSelectedId(a.id)}
                  className={cn('px-3 py-1.5 rounded-lg text-xs font-medium border transition-all', selectedId === a.id ? 'border-teal-400/50 bg-teal-400/10 text-teal-400' : 'border-border text-text-muted hover:border-border-2')}>
                  {a.company_name || 'Analysis'} #{a.id}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading && <div className="flex items-center gap-2 text-text-muted text-sm py-8 justify-center"><Loader2 size={15} className="animate-spin" />Loading projects...</div>}

        {!loading && projects.length === 0 && (
          <div className="card p-12 text-center">
            <FolderGit2 size={32} className="text-text-dim mx-auto mb-3" />
            <p className="text-text-muted text-sm mb-1">No project suggestions yet.</p>
            <p className="text-text-dim text-xs mb-4">Run a resume analysis to generate tailored project ideas based on your skill gaps.</p>
            <a href="/analyze" className="btn-primary inline-flex text-sm px-4 py-2">Analyze Resume →</a>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {projects.map(p => <ProjectCard key={p.id} p={p} />)}
        </div>
      </div>
    </DashboardLayout>
  );
}
