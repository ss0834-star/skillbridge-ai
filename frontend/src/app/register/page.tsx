'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import { Eye, EyeOff, ArrowRight, Loader2, Check } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true); setError('');
    try {
      const { data } = await authApi.register(form);
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed');
    } finally { setLoading(false); }
  };

  const perks = ['Resume ATS analysis', 'Company fit prediction', 'Skill gap roadmap', 'Interview question generator'];

  return (
    <div className="min-h-screen grid-bg flex items-center justify-center p-4">
      <div className="w-full max-w-lg animate-slide-up">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center">
              <span className="text-background font-bold">S</span>
            </div>
            <span className="font-semibold">SkillBridge<span className="text-accent-teal"> AI</span></span>
          </Link>
          <h1 className="text-2xl font-bold mb-2">Create your account</h1>
          <p className="text-text-muted text-sm">Start analyzing your career fit in seconds</p>
        </div>

        <div className="card p-8 space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">{error}</div>
          )}

          <div className="grid grid-cols-2 gap-2">
            {perks.map(p => (
              <div key={p} className="flex items-center gap-2 text-xs text-text-muted">
                <Check size={12} className="text-teal-400 flex-shrink-0" /> {p}
              </div>
            ))}
          </div>

          <div className="h-px bg-border" />

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs text-text-muted mb-1.5">Full Name</label>
              <input className="input" placeholder="Alex Chen" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div>
              <label className="block text-xs text-text-muted mb-1.5">Email</label>
              <input className="input" type="email" placeholder="you@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
            </div>
            <div>
              <label className="block text-xs text-text-muted mb-1.5">Password</label>
              <div className="relative">
                <input className="input pr-10" type={showPwd ? 'text' : 'password'} placeholder="Min. 6 characters" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
                <button type="button" onClick={() => setShowPwd(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dim hover:text-text-muted">
                  {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 disabled:opacity-50">
              {loading ? <Loader2 size={15} className="animate-spin" /> : null}
              Create account <ArrowRight size={15} />
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-text-muted mt-6">
          Already have an account? <Link href="/login" className="text-accent-teal hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
