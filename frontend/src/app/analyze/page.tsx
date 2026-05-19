'use client';
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import DashboardLayout from '@/components/layout/DashboardLayout';
import MetricCard from '@/components/cards/MetricCard';
import ScoreRing from '@/components/charts/ScoreRing';
import { SkillList } from '@/components/cards/SkillBadge';
import { resumeApi, analysisApi } from '@/lib/api';
import { Target, Brain, FileText, Zap, Upload, ChevronDown, Loader2, ArrowRight, CheckCircle, XCircle, Lightbulb, Building2 } from 'lucide-react';
import type { AnalysisResult } from '@/types';

const COMPANIES = ['Tesla', 'NVIDIA', 'Google', 'Microsoft', 'Amazon', 'Apple', 'Meta', 'OpenAI'];

export default function AnalyzePage() {
  const [resumeText, setResumeText] = useState('');
  const [jobText, setJobText] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [uploadedResume, setUploadedResume] = useState<{ id: number; filename: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'scores' | 'bullets' | 'recs'>('scores');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!acceptedFiles.length) return;
    setUploading(true); setError('');
    try {
      const { data } = await resumeApi.upload(acceptedFiles[0]);
      setUploadedResume(data);
      setResumeText(data.extracted_text || '');
    } catch (e: any) {
      setError('Upload failed: ' + (e.response?.data?.detail || e.message));
    } finally { setUploading(false); }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'application/pdf': ['.pdf'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'], 'text/plain': ['.txt'] },
    maxFiles: 1
  });

  const handleAnalyze = async () => {
    if (!resumeText.trim() && !uploadedResume) { setError('Please provide a resume (upload file or paste text)'); return; }
    setAnalyzing(true); setError(''); setResult(null);
    try {
      const payload: any = { company_name: company || undefined, role_title: role || undefined };
      if (uploadedResume) { payload.resume_id = uploadedResume.id; } else { payload.resume_text = resumeText; }
      if (jobText.trim()) { payload.job_description_text = jobText; }
      const { data } = await analysisApi.run(payload);
      setResult(data);
      setActiveTab('scores');
    } catch (e: any) {
      setError(e.response?.data?.detail || 'Analysis failed');
    } finally { setAnalyzing(false); }
  };

  return (
    <DashboardLayout title="Resume Analysis" subtitle="Upload your resume, select a target, and get your career-fit intelligence report">
      <div className="max-w-6xl space-y-6 animate-fade-in">

        {/* Input Section */}
        <div className="grid md:grid-cols-2 gap-5">
          {/* Resume Input */}
          <div className="card p-5 space-y-4">
            <h3 className="text-sm font-semibold flex items-center gap-2"><FileText size={15} className="text-teal-400" /> Resume</h3>
            <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${isDragActive ? 'border-teal-400 bg-teal-400/5' : 'border-border-2 hover:border-teal-400/50'}`}>
              <input {...getInputProps()} />
              {uploading ? (
                <div className="flex flex-col items-center gap-2"><Loader2 size={24} className="text-teal-400 animate-spin" /><p className="text-sm text-text-muted">Parsing resume...</p></div>
              ) : uploadedResume ? (
                <div className="flex flex-col items-center gap-2"><CheckCircle size={24} className="text-emerald-400" /><p className="text-sm font-medium text-emerald-400">{uploadedResume.filename}</p><p className="text-xs text-text-dim">Click to replace</p></div>
              ) : (
                <div className="flex flex-col items-center gap-2"><Upload size={24} className="text-text-dim" /><p className="text-sm text-text-muted">{isDragActive ? 'Drop it here' : 'Drop resume or click to browse'}</p><p className="text-xs text-text-dim">PDF, DOCX, or TXT</p></div>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-text-dim"><div className="flex-1 h-px bg-border" />or paste text<div className="flex-1 h-px bg-border" /></div>
            <textarea className="input h-36 resize-none text-xs font-mono" placeholder="Paste resume text here..." value={resumeText} onChange={e => setResumeText(e.target.value)} />
          </div>

          {/* Job Description */}
          <div className="card p-5 space-y-4">
            <h3 className="text-sm font-semibold flex items-center gap-2"><Building2 size={15} className="text-cyan-400" /> Target Role</h3>

            <div>
              <label className="text-xs text-text-muted mb-1.5 block">Company Template</label>
              <div className="grid grid-cols-4 gap-1.5">
                {COMPANIES.map(c => (
                  <button key={c} onClick={() => setCompany(c === company ? '' : c)}
                    className={`px-2 py-1.5 rounded-lg text-xs font-medium border transition-all ${company === c ? 'border-teal-400/50 bg-teal-400/10 text-teal-400' : 'border-border text-text-muted hover:border-border-2 hover:text-text'}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-text-muted mb-1.5 block">Role Title (optional)</label>
              <input className="input text-sm" placeholder="e.g. Senior ML Engineer" value={role} onChange={e => setRole(e.target.value)} />
            </div>

            <div>
              <label className="text-xs text-text-muted mb-1.5 block">Job Description (optional — paste real JD for better accuracy)</label>
              <textarea className="input h-36 resize-none text-xs" placeholder="Paste job description here for semantic matching..." value={jobText} onChange={e => setJobText(e.target.value)} />
            </div>
          </div>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm flex items-center gap-2"><XCircle size={15} />{error}</div>}

        <button onClick={handleAnalyze} disabled={analyzing} className="btn-primary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed">
          {analyzing ? <><Loader2 size={15} className="animate-spin" />Analyzing your resume...</> : <>Analyze Now <ArrowRight size={15} /></>}
        </button>

        {/* Results */}
        {result && (
          <div className="space-y-5 animate-slide-up">
            {/* Summary Header */}
            <div className="card p-6">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                <ScoreRing score={result.final_fit_score || 0} size={120} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="badge bg-teal-400/10 text-teal-400 border border-teal-400/20">Analysis Complete</span>
                    {company && <span className="badge bg-surface text-text-muted border border-border">{company}</span>}
                  </div>
                  <h2 className="text-xl font-bold mb-2">Career Fit Report</h2>
                  <p className="text-sm text-text-muted leading-relaxed">{result.summary}</p>
                </div>
              </div>
            </div>

            {/* Score Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard label="ATS Score" value={result.ats_score} icon={FileText} iconColor="text-cyan-400" />
              <MetricCard label="Skill Match" value={result.skill_match_score} icon={Target} iconColor="text-teal-400" />
              <MetricCard label="Semantic Match" value={result.semantic_match_score} icon={Brain} iconColor="text-emerald-400" />
              <MetricCard label="Interview Ready" value={result.interview_readiness_score} icon={Zap} iconColor="text-amber-400" />
            </div>

            {/* Skills */}
            <div className="grid md:grid-cols-2 gap-5">
              <div className="card p-5"><h3 className="text-sm font-semibold mb-3">✅ Matched Skills ({result.matched_skills?.length || 0})</h3><SkillList skills={result.matched_skills || []} type="matched" /></div>
              <div className="card p-5"><h3 className="text-sm font-semibold mb-3">❌ Missing Skills ({result.missing_skills?.length || 0})</h3><SkillList skills={result.missing_skills || []} type="missing" /></div>
            </div>

            {/* Tabs */}
            <div className="card overflow-hidden">
              <div className="flex border-b border-border">
                {[['scores', 'Score Breakdown'], ['bullets', 'Improved Bullets'], ['recs', 'Recommendations']].map(([key, label]) => (
                  <button key={key} onClick={() => setActiveTab(key as any)}
                    className={`px-5 py-3 text-sm font-medium transition-colors ${activeTab === key ? 'text-teal-400 border-b-2 border-teal-400' : 'text-text-muted hover:text-text'}`}>
                    {label}
                  </button>
                ))}
              </div>

              <div className="p-5">
                {activeTab === 'scores' && (
                  <div className="space-y-3">
                    {[
                      { label: 'Project Relevance', val: result.project_relevance_score, weight: '20%' },
                      { label: 'Experience Depth', val: result.experience_depth_score, weight: '15%' },
                      { label: 'ATS Format Quality', val: result.ats_score, weight: '10%' },
                    ].map(s => (
                      <div key={s.label} className="flex items-center gap-4">
                        <span className="text-sm text-text-muted w-40">{s.label}</span>
                        <div className="flex-1 h-2 bg-surface rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${(s.val || 0) >= 75 ? 'bg-emerald-400' : (s.val || 0) >= 55 ? 'bg-amber-400' : 'bg-red-400'}`} style={{ width: `${s.val || 0}%` }} />
                        </div>
                        <span className="text-sm font-medium w-12 text-right">{Math.round(s.val || 0)}%</span>
                        <span className="text-xs text-text-dim w-10">×{s.weight}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'bullets' && (
                  <div className="space-y-4">
                    {result.improved_bullets?.map((b, i) => (
                      <div key={i} className="border border-border rounded-xl overflow-hidden">
                        <div className="p-4 bg-red-500/5 border-b border-border">
                          <div className="flex items-start gap-2"><XCircle size={14} className="text-red-400 mt-0.5 flex-shrink-0" /><p className="text-xs text-text-muted">{b.original}</p></div>
                        </div>
                        <div className="p-4 bg-emerald-500/5">
                          <div className="flex items-start gap-2"><CheckCircle size={14} className="text-emerald-400 mt-0.5 flex-shrink-0" /><p className="text-xs text-text leading-relaxed">{b.improved}</p></div>
                        </div>
                        <div className="px-4 py-2 bg-surface border-t border-border">
                          <p className="text-[11px] text-text-dim flex items-center gap-1"><Lightbulb size={10} className="text-amber-400" />{b.why}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'recs' && (
                  <div className="space-y-3">
                    {result.recommendations?.map((r, i) => (
                      <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-surface border border-border">
                        <span className={`badge mt-0.5 flex-shrink-0 ${r.priority === 'high' ? 'bg-red-400/10 text-red-400 border-red-400/20' : 'bg-amber-400/10 text-amber-400 border-amber-400/20'}`}>{r.priority}</span>
                        <div>
                          <p className="text-sm font-medium">{r.title}</p>
                          <p className="text-xs text-text-muted mt-0.5">{r.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* CTA Links */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { href: '/interview-prep', label: 'Interview Prep', icon: '🎯' },
                { href: '/projects', label: 'Project Ideas', icon: '🚀' },
                { href: '/company-fit', label: 'Compare Companies', icon: '🏢' },
              ].map(link => (
                <a key={link.href} href={link.href} className="card p-4 text-center hover:border-teal-400/30 transition-colors cursor-pointer">
                  <p className="text-2xl mb-1">{link.icon}</p>
                  <p className="text-sm font-medium">{link.label}</p>
                  <p className="text-xs text-text-dim mt-0.5">Based on your analysis</p>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
