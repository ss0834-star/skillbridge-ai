'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import { Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const { data } = await authApi.login({ email, password });
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid credentials');
    } finally { setLoading(false); }
  };

  const handleDemo = async () => {
    setDemoLoading(true); setError('');
    try {
      const { data } = await authApi.demoLogin();
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Demo login failed');
    } finally { setDemoLoading(false); }
  };

  return (
    <div className="min-h-screen grid-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center">
              <span className="text-background font-bold">S</span>
            </div>
            <span className="font-semibold text-text">SkillBridge<span className="text-accent-teal"> AI</span></span>
          </Link>
          <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
          <p className="text-text-muted text-sm">Sign in to your career intelligence platform</p>
        </div>

        <div className="card p-8 space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">{error}</div>
          )}

          <button onClick={handleDemo} disabled={demoLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-teal-400/10 border border-teal-400/30 text-teal-400 rounded-lg text-sm font-medium hover:bg-teal-400/20 transition-all disabled:opacity-50">
            {demoLoading ? <Loader2 size={15} className="animate-spin" /> : null}
            ⚡ Demo Login — no setup required
          </button>

          <div className="flex items-center gap-3 text-text-dim text-xs">
            <div className="flex-1 h-px bg-border"/>
            <span>or sign in with email</span>
            <div className="flex-1 h-px bg-border"/>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs text-text-muted mb-1.5">Email</label>
              <input className="input" type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="block text-xs text-text-muted mb-1.5">Password</label>
              <div className="relative">
                <input className="input pr-10" type={showPwd ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="button" onClick={() => setShowPwd(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dim hover:text-text-muted">
                  {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 disabled:opacity-50">
              {loading ? <Loader2 size={15} className="animate-spin" /> : null}
              Sign in <ArrowRight size={15} />
            </button>
          </form>

          <div className="text-center text-sm text-text-muted pt-2 border-t border-border">
            <p>Demo accounts:</p>
            <div className="mt-2 space-y-1 text-xs text-text-dim">
              <p>demo@skillbridge.ai / demo123</p>
              <p>priya@skillbridge.ai / demo123</p>
              <p>admin@skillbridge.ai / admin123</p>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-text-muted mt-6">
          Don't have an account? <Link href="/register" className="text-accent-teal hover:underline">Create one free</Link>
        </p>
      </div>
    </div>
  );
}
