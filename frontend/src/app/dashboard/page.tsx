'use client';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import MetricCard from '@/components/cards/MetricCard';
import ScoreRing from '@/components/charts/ScoreRing';
import { SkillList } from '@/components/cards/SkillBadge';
import { DashboardSkeleton } from '@/components/ui/Skeleton';
import { dashboardApi, analysisApi } from '@/lib/api';
import { formatDate, formatScore, COMPANY_COLORS } from '@/lib/utils';
import { Target, Brain, Zap, FileText, Building2, TrendingUp, ArrowRight, BarChart2, Activity } from 'lucide-react';
import Link from 'next/link';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, Cell
} from 'recharts';
import type { DashboardSummary, AnalysisResult } from '@/types';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface-2 border border-border rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="text-text-muted mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }} className="font-semibold">{p.name}: {p.value?.toFixed(1)}%</p>
      ))}
    </div>
  );
};

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [charts, setCharts] = useState<any>(null);
  const [analyses, setAnalyses] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>({});

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(u);
    Promise.all([dashboardApi.summary(), dashboardApi.charts(), analysisApi.list()])
      .then(([s, c, a]) => {
        setSummary(s.data);
        setCharts(c.data);
        setAnalyses(a.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <DashboardLayout title="Dashboard">
      <DashboardSkeleton />
    </DashboardLayout>
  );

  const latest = analyses[0];

  return (
    <DashboardLayout title="Dashboard" subtitle={`Welcome back, ${user?.name?.split(' ')[0] || 'there'} — here's your career intelligence overview`}>
      <div className="space-y-6 animate-fade-in">

        {/* Hero Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Overall Score Card */}
          <div className="card p-6 flex items-center gap-6 col-span-1">
            {latest ? (
              <>
                <ScoreRing score={latest.final_fit_score || 0} size={100} />
                <div>
                  <p className="text-xs text-text-muted mb-1 uppercase tracking-widest">Overall Fit Score</p>
                  <p className="font-semibold text-sm">{latest.company_name || 'Last Analysis'}</p>
                  <p className="text-xs text-text-dim mt-0.5">{latest.role_title}</p>
                  <div className="mt-3">
                    <Link href={`/analyze`} className="text-xs text-accent-teal hover:underline flex items-center gap-1">
                      Run new analysis <ArrowRight size={10} />
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 text-center py-4">
                <p className="text-text-muted text-sm mb-3">No analyses yet</p>
                <Link href="/analyze" className="btn-primary text-xs px-4 py-2">Analyze resume</Link>
              </div>
            )}
          </div>

          {/* Metric Cards */}
          <div className="col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard label="ATS Score" value={latest?.ats_score} icon={FileText} iconColor="text-cyan-400" />
            <MetricCard label="Skill Match" value={latest?.skill_match_score} icon={Target} iconColor="text-teal-400" />
            <MetricCard label="Semantic Match" value={latest?.semantic_match_score} icon={Brain} iconColor="text-emerald-400" />
            <MetricCard label="Interview Ready" value={latest?.interview_readiness_score} icon={Zap} iconColor="text-amber-400" />
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid md:grid-cols-2 gap-5">
          {/* Score Trend */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold">Score Trend</h3>
                <p className="text-xs text-text-dim">Last {summary?.score_trend?.length || 0} analyses</p>
              </div>
              <TrendingUp size={15} className="text-text-dim" />
            </div>
            {summary?.score_trend && summary.score_trend.length > 0 ? (
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={summary.score_trend}>
                  <defs>
                    <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#21262d" strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#484f58' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#484f58' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="score" name="Fit Score" stroke="#2dd4bf" fill="url(#scoreGrad)" strokeWidth={2} dot={{ fill: '#2dd4bf', r: 3 }} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-40 flex items-center justify-center text-text-dim text-sm">No trend data yet</div>
            )}
          </div>

          {/* Radar Chart */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold">Skill Radar</h3>
                <p className="text-xs text-text-dim">Latest analysis breakdown</p>
              </div>
              <Activity size={15} className="text-text-dim" />
            </div>
            {charts?.radar && charts.radar.length > 0 ? (
              <ResponsiveContainer width="100%" height={160}>
                <RadarChart data={charts.radar}>
                  <PolarGrid stroke="#21262d" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: '#484f58' }} />
                  <Radar name="Score" dataKey="score" stroke="#2dd4bf" fill="#2dd4bf" fillOpacity={0.15} strokeWidth={1.5} />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-40 flex items-center justify-center text-text-dim text-sm">Run an analysis to see radar</div>
            )}
          </div>
        </div>

        {/* Company Bar + Missing Skills */}
        <div className="grid md:grid-cols-2 gap-5">
          {/* Company Scores */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold">Company Fit Scores</h3>
                <p className="text-xs text-text-dim">Average across all your analyses</p>
              </div>
              <Building2 size={15} className="text-text-dim" />
            </div>
            {charts?.company_bar && charts.company_bar.length > 0 ? (
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={charts.company_bar} layout="vertical" barSize={14}>
                  <CartesianGrid stroke="#21262d" strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: '#484f58' }} />
                  <YAxis type="category" dataKey="company" tick={{ fontSize: 10, fill: '#8b949e' }} width={65} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="score" name="Fit Score" radius={[0, 4, 4, 0]}>
                    {charts.company_bar.map((entry: any, i: number) => (
                      <Cell key={i} fill={COMPANY_COLORS[entry.company] || '#2dd4bf'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-40 flex items-center justify-center text-text-dim text-sm">No company data yet</div>
            )}
          </div>

          {/* Top Missing Skills */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold">Top Missing Skills</h3>
                <p className="text-xs text-text-dim">Most frequent across analyses</p>
              </div>
              <BarChart2 size={15} className="text-text-dim" />
            </div>
            {charts?.missing_skills && charts.missing_skills.length > 0 ? (
              <div className="space-y-2.5">
                {charts.missing_skills.slice(0, 6).map((item: any, i: number) => {
                  const max = charts.missing_skills[0].count;
                  return (
                    <div key={item.skill} className="flex items-center gap-3">
                      <span className="text-xs text-text-muted w-28 truncate capitalize">{item.skill}</span>
                      <div className="flex-1 h-1.5 bg-surface rounded-full overflow-hidden">
                        <div className="h-full bg-red-400/70 rounded-full" style={{ width: `${(item.count / max) * 100}%` }} />
                      </div>
                      <span className="text-xs text-text-dim w-4 text-right">{item.count}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-40 flex items-center justify-center text-text-dim text-sm">No skill gap data yet</div>
            )}
          </div>
        </div>

        {/* Recent Analyses */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold">Recent Analyses</h3>
              <p className="text-xs text-text-dim">Your last {analyses.slice(0, 5).length} career fit reports</p>
            </div>
            <Link href="/analyze" className="btn-ghost text-xs px-3 py-1.5">New analysis</Link>
          </div>
          {analyses.length > 0 ? (
            <div className="space-y-2">
              {analyses.slice(0, 5).map(a => (
                <div key={a.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-surface transition-colors group">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0"
                    style={{ background: (COMPANY_COLORS[a.company_name || ''] || '#2dd4bf') + '20', color: COMPANY_COLORS[a.company_name || ''] || '#2dd4bf' }}>
                    {a.company_name?.[0] || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{a.company_name || 'Unknown'} · {a.role_title || 'Role'}</p>
                    <p className="text-xs text-text-dim">{formatDate(a.created_at)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold" style={{ color: (a.final_fit_score || 0) >= 75 ? '#10b981' : (a.final_fit_score || 0) >= 55 ? '#f59e0b' : '#ef4444' }}>
                      {formatScore(a.final_fit_score)}
                    </p>
                    <p className="text-[10px] text-text-dim">fit score</p>
                  </div>
                  {latest?.missing_skills && (
                    <span className="text-xs text-text-dim hidden md:block w-24 text-right">
                      {a.missing_skills?.length || 0} gaps
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-text-muted text-sm mb-4">No analyses yet. Upload your resume to get started.</p>
              <Link href="/analyze" className="btn-primary px-5 py-2 text-sm">Analyze now <ArrowRight size={14} /></Link>
            </div>
          )}
        </div>

        {/* Skills from latest analysis */}
        {latest && (
          <div className="grid md:grid-cols-2 gap-5">
            <div className="card p-5">
              <h3 className="text-sm font-semibold mb-3">✅ Matched Skills</h3>
              <SkillList skills={latest.matched_skills || []} type="matched" />
            </div>
            <div className="card p-5">
              <h3 className="text-sm font-semibold mb-3">❌ Missing Skills</h3>
              <SkillList skills={latest.missing_skills || []} type="missing" />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
