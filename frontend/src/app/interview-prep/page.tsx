'use client';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { analysisApi } from '@/lib/api';
import { MessageSquare, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { InterviewQuestion, AnalysisResult } from '@/types';

const DIFF_COLORS: Record<string, string> = { Easy: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20', Medium: 'text-amber-400 bg-amber-400/10 border-amber-400/20', Hard: 'text-red-400 bg-red-400/10 border-red-400/20' };
const CAT_COLORS: Record<string, string> = { Technical: 'text-cyan-400', Behavioral: 'text-teal-400', 'System Design': 'text-blue-400', 'Company-Specific': 'text-amber-400' };

function QuestionCard({ q }: { q: InterviewQuestion }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={cn('card p-4 cursor-pointer transition-all', open && 'border-teal-400/20')} onClick={() => setOpen(o => !o)}>
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className={cn('badge border', DIFF_COLORS[q.difficulty] || 'bg-surface text-text-muted border-border')}>{q.difficulty}</span>
            <span className={cn('text-xs font-medium', CAT_COLORS[q.category] || 'text-text-muted')}>{q.category}</span>
          </div>
          <p className="text-sm text-text leading-relaxed">{q.question}</p>
        </div>
        {open ? <ChevronUp size={15} className="text-text-dim flex-shrink-0 mt-0.5" /> : <ChevronDown size={15} className="text-text-dim flex-shrink-0 mt-0.5" />}
      </div>
      {open && q.answer_hint && (
        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-xs text-text-muted leading-relaxed"><span className="text-teal-400 font-medium">Hint: </span>{q.answer_hint}</p>
        </div>
      )}
    </div>
  );
}

export default function InterviewPrepPage() {
  const [analyses, setAnalyses] = useState<AnalysisResult[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    analysisApi.list().then(r => { setAnalyses(r.data); if (r.data[0]) setSelectedId(r.data[0].id); });
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    setLoading(true);
    analysisApi.getInterviewQuestions(selectedId).then(r => setQuestions(r.data)).finally(() => setLoading(false));
  }, [selectedId]);

  const categories = ['All', ...Array.from(new Set(questions.map(q => q.category)))];
  const filtered = filter === 'All' ? questions : questions.filter(q => q.category === filter);

  return (
    <DashboardLayout title="Interview Prep" subtitle="Company-specific questions generated from your resume analysis">
      <div className="max-w-4xl space-y-5 animate-fade-in">
        {/* Analysis Selector */}
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

        {/* Category Filter */}
        {questions.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {categories.map(c => (
              <button key={c} onClick={() => setFilter(c)}
                className={cn('px-3 py-1.5 rounded-lg text-xs font-medium border transition-all', filter === c ? 'border-teal-400/50 bg-teal-400/10 text-teal-400' : 'border-border text-text-muted hover:border-border-2')}>
                {c} {c === 'All' ? `(${questions.length})` : `(${questions.filter(q => q.category === c).length})`}
              </button>
            ))}
          </div>
        )}

        {loading && <div className="flex items-center gap-2 text-text-muted text-sm py-8 justify-center"><Loader2 size={15} className="animate-spin" />Loading questions...</div>}

        {!loading && filtered.length === 0 && (
          <div className="card p-12 text-center">
            <MessageSquare size={32} className="text-text-dim mx-auto mb-3" />
            <p className="text-text-muted text-sm mb-3">No questions yet.</p>
            <p className="text-text-dim text-xs">Run a resume analysis first to generate interview questions.</p>
            <a href="/analyze" className="btn-primary mt-4 inline-flex text-sm px-4 py-2">Analyze Resume →</a>
          </div>
        )}

        <div className="space-y-3">
          {filtered.map(q => <QuestionCard key={q.id} q={q} />)}
        </div>
      </div>
    </DashboardLayout>
  );
}
