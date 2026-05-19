'use client';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { adminApi } from '@/lib/api';
import { Users, BarChart2, Target, Activity, TrendingUp, Shield } from 'lucide-react';
import { formatDate, COMPANY_COLORS } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface-2 border border-border rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="text-text-muted mb-1">{label}</p>
      {payload.map((p: any) => <p key={p.name} style={{ color: p.color }} className="font-semibold">{p.value}</p>)}
    </div>
  );
};

export default function AdminPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([adminApi.metrics(), adminApi.users(), adminApi.analyses()])
      .then(([m, u, a]) => { setMetrics(m.data); setUsers(u.data); setAnalyses(a.data); })
      .catch(e => setError(e.response?.data?.detail || 'Access denied'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardLayout title="Admin"><p className="text-text-muted text-sm">Loading admin data...</p></DashboardLayout>;
  if (error) return (
    <DashboardLayout title="Admin">
      <div className="card p-8 text-center"><Shield size={32} className="text-red-400 mx-auto mb-3" /><p className="text-red-400 font-medium">{error}</p><p className="text-text-dim text-sm mt-1">This page requires admin privileges. Login as admin@skillbridge.ai</p></div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout title="Admin Analytics" subtitle="Platform-wide metrics and system health overview">
      <div className="space-y-6 animate-fade-in">
        {/* System Status */}
        <div className="card p-4 flex items-center gap-4">
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /><span className="text-sm text-emerald-400 font-medium">All systems operational</span></div>
          <div className="flex-1" />
          <span className="badge bg-teal-400/10 text-teal-400 border border-teal-400/20">Admin Dashboard</span>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Users', value: metrics?.total_users || 0, icon: Users, color: 'text-teal-400', suffix: '' },
            { label: 'Total Analyses', value: metrics?.total_analyses || 0, icon: BarChart2, color: 'text-cyan-400', suffix: '' },
            { label: 'Avg Fit Score', value: metrics?.avg_fit_score?.toFixed(1) || 0, icon: Target, color: 'text-emerald-400', suffix: '%' },
            { label: 'Activity Events', value: metrics?.recent_activity?.length || 0, icon: Activity, color: 'text-amber-400', suffix: '' },
          ].map(m => (
            <div key={m.label} className="card p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className={`w-9 h-9 rounded-xl bg-surface flex items-center justify-center`}>
                  <m.icon size={16} className={m.color} />
                </div>
                <span className={`text-2xl font-bold tabular-nums ${m.color}`}>{m.value}{m.suffix}</span>
              </div>
              <p className="text-xs text-text-muted">{m.label}</p>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid md:grid-cols-2 gap-5">
          {/* Top Companies */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"><TrendingUp size={14} className="text-teal-400" />Top Target Companies</h3>
            {metrics?.top_companies?.length > 0 ? (
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={metrics.top_companies}>
                  <CartesianGrid stroke="#21262d" strokeDasharray="3 3" />
                  <XAxis dataKey="company" tick={{ fontSize: 10, fill: '#484f58' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#484f58' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Analyses" radius={[4, 4, 0, 0]}>
                    {metrics.top_companies.map((c: any, i: number) => <Cell key={i} fill={COMPANY_COLORS[c.company] || '#2dd4bf'} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : <p className="text-text-dim text-sm py-8 text-center">No data yet</p>}
          </div>

          {/* Common Missing Skills */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"><Activity size={14} className="text-red-400" />Most Common Skill Gaps</h3>
            {metrics?.common_missing_skills?.length > 0 ? (
              <div className="space-y-2.5">
                {metrics.common_missing_skills.slice(0, 7).map((s: any, i: number) => {
                  const max = metrics.common_missing_skills[0].count;
                  return (
                    <div key={s.skill} className="flex items-center gap-3">
                      <span className="text-xs text-text-muted w-28 truncate capitalize">{s.skill}</span>
                      <div className="flex-1 h-1.5 bg-surface rounded-full overflow-hidden">
                        <div className="h-full bg-red-400/60 rounded-full" style={{ width: `${(s.count / max) * 100}%` }} />
                      </div>
                      <span className="text-xs text-text-dim w-6 text-right">{s.count}</span>
                    </div>
                  );
                })}
              </div>
            ) : <p className="text-text-dim text-sm py-8 text-center">No data yet</p>}
          </div>
        </div>

        {/* Users Table */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold mb-4">All Users ({users.length})</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left border-b border-border text-xs text-text-dim">
                <th className="pb-2 font-medium">Name</th><th className="pb-2 font-medium">Email</th>
                <th className="pb-2 font-medium">Role</th><th className="pb-2 font-medium">Joined</th>
              </tr></thead>
              <tbody className="divide-y divide-border">
                {users.map(u => (
                  <tr key={u.id} className="text-text-muted hover:text-text transition-colors">
                    <td className="py-2.5 font-medium text-text">{u.name}</td>
                    <td className="py-2.5">{u.email}</td>
                    <td className="py-2.5"><span className={`badge border ${u.role === 'admin' ? 'bg-amber-400/10 text-amber-400 border-amber-400/20' : 'bg-surface text-text-muted border-border'}`}>{u.role}</span></td>
                    <td className="py-2.5 text-xs">{formatDate(u.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-2">
            {(metrics?.recent_activity || []).slice(0, 10).map((a: any, i: number) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                <span className="w-2 h-2 rounded-full bg-teal-400 flex-shrink-0" />
                <span className="text-xs text-text-muted">{a.action.replace(/_/g, ' ')}</span>
                <span className="text-xs text-text-dim ml-auto">{new Date(a.created_at).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
