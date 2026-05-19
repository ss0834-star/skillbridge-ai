'use client';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { companyApi } from '@/lib/api';
import { COMPANY_COLORS } from '@/lib/utils';
import { ExternalLink, ChevronRight, Briefcase, Code2, FlaskConical, Target } from 'lucide-react';
import type { CompanyTemplate } from '@/types';

export default function CompanyFitPage() {
  const [companies, setCompanies] = useState<CompanyTemplate[]>([]);
  const [selected, setSelected] = useState<CompanyTemplate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    companyApi.list().then(r => { setCompanies(r.data); setSelected(r.data[0]); }).finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardLayout title="Company Fit Explorer"><div className="text-text-muted text-sm">Loading companies...</div></DashboardLayout>;

  return (
    <DashboardLayout title="Company Fit Explorer" subtitle="Deep-dive into role expectations for top tech companies">
      <div className="flex gap-5 animate-fade-in">
        {/* Company List */}
        <div className="w-56 flex-shrink-0 space-y-1.5">
          {companies.map(c => {
            const color = COMPANY_COLORS[c.company_name] || '#2dd4bf';
            const isActive = selected?.company_name === c.company_name;
            return (
              <button key={c.company_name} onClick={() => setSelected(c)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${isActive ? 'bg-surface-2 border border-teal-400/20' : 'hover:bg-surface-2'}`}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0" style={{ background: color + '20', color }}>
                  {c.company_name[0]}
                </div>
                <div className="min-w-0">
                  <p className={`text-sm font-medium truncate ${isActive ? 'text-text' : 'text-text-muted'}`}>{c.company_name}</p>
                  <p className="text-[10px] text-text-dim truncate">{c.industry}</p>
                </div>
                {isActive && <ChevronRight size={12} className="text-teal-400 flex-shrink-0 ml-auto" />}
              </button>
            );
          })}
        </div>

        {/* Company Detail */}
        {selected && (
          <div className="flex-1 space-y-5">
            {/* Header */}
            <div className="card p-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-2xl flex-shrink-0"
                  style={{ background: (COMPANY_COLORS[selected.company_name] || '#2dd4bf') + '20', color: COMPANY_COLORS[selected.company_name] || '#2dd4bf' }}>
                  {selected.company_name[0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-bold">{selected.company_name}</h2>
                    <span className="badge bg-surface text-text-muted border border-border">{selected.industry}</span>
                  </div>
                  <p className="text-sm text-text-muted">{selected.role_family}</p>
                </div>
              </div>
            </div>

            {/* Skills Grid */}
            <div className="grid md:grid-cols-2 gap-5">
              <div className="card p-5">
                <h3 className="text-sm font-semibold flex items-center gap-2 mb-3"><Target size={14} className="text-teal-400" />Required Skills</h3>
                <div className="flex flex-wrap gap-1.5">
                  {selected.required_skills.map(s => (
                    <span key={s} className="badge bg-teal-400/10 text-teal-400 border border-teal-400/20">{s}</span>
                  ))}
                </div>
              </div>
              <div className="card p-5">
                <h3 className="text-sm font-semibold flex items-center gap-2 mb-3"><Code2 size={14} className="text-cyan-400" />Preferred Skills</h3>
                <div className="flex flex-wrap gap-1.5">
                  {selected.preferred_skills.map(s => (
                    <span key={s} className="badge bg-cyan-400/10 text-cyan-400 border border-cyan-400/20">{s}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div className="card p-5">
                <h3 className="text-sm font-semibold flex items-center gap-2 mb-3"><FlaskConical size={14} className="text-emerald-400" />Project Expectations</h3>
                <ul className="space-y-2">
                  {selected.project_expectations.map(p => (
                    <li key={p} className="flex items-start gap-2 text-sm text-text-muted">
                      <span className="text-emerald-400 mt-0.5">→</span>{p}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="card p-5">
                <h3 className="text-sm font-semibold flex items-center gap-2 mb-3"><Briefcase size={14} className="text-amber-400" />Interview Focus Areas</h3>
                <ul className="space-y-2">
                  {selected.interview_focus.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-text-muted">
                      <span className="text-amber-400 mt-0.5">•</span>{f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="card p-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Analyze your fit for {selected.company_name}</p>
                <p className="text-xs text-text-muted mt-0.5">Upload your resume and get a personalized score report</p>
              </div>
              <a href="/analyze" className="btn-primary text-sm px-4 py-2">Analyze now <ChevronRight size={14} /></a>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
