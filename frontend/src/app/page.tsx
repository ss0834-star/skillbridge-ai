'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowRight, Zap, Target, Brain, Shield, TrendingUp, ChevronRight, Star, Activity, BarChart2 } from 'lucide-react';

const COMPANIES = [
  { name: 'Tesla', color: '#E82127', role: 'Robotics Engineer', score: 78 },
  { name: 'NVIDIA', color: '#76B900', role: 'AI Engineer', score: 82 },
  { name: 'Google', color: '#4285F4', role: 'Software Engineer', score: 65 },
  { name: 'OpenAI', color: '#10A37F', role: 'Applied AI Eng', score: 71 },
  { name: 'Meta', color: '#0866FF', role: 'GenAI Engineer', score: 68 },
  { name: 'Apple', color: '#888888', role: 'ML Systems Eng', score: 74 },
  { name: 'Amazon', color: '#FF9900', role: 'ML Engineer', score: 60 },
  { name: 'Microsoft', color: '#00BCF2', role: 'AI Platform Eng', score: 76 },
];

const STATS = [
  { label: 'ATS Score', value: '87%', color: '#10b981' },
  { label: 'Skill Match', value: '73%', color: '#2dd4bf' },
  { label: 'Semantic Match', value: '81%', color: '#22d3ee' },
  { label: 'Project Relevance', value: '69%', color: '#f59e0b' },
];

const FEATURES = [
  { icon: Target, title: 'ATS Intelligence', desc: 'Deep resume parsing against ATS systems with keyword coverage analysis and formatting score.', color: 'text-teal-400' },
  { icon: Brain, title: 'Semantic Matching', desc: 'NLP-powered semantic alignment between your resume and job requirements beyond keyword matching.', color: 'text-cyan-400' },
  { icon: BarChart2, title: 'Company Fit Predictor', desc: 'Compare your profile against 8+ top tech companies with role-specific scoring.', color: 'text-emerald-400' },
  { icon: Zap, title: 'Skill Gap Analysis', desc: 'Identify exactly what\'s missing and get AI-curated project suggestions to close gaps fast.', color: 'text-amber-400' },
  { icon: TrendingUp, title: 'Resume Rewriter', desc: 'Transform weak bullet points into quantified, impactful achievements that recruiters remember.', color: 'text-blue-400' },
  { icon: Shield, title: 'Interview Readiness', desc: 'Company-specific technical and behavioral questions generated from your resume analysis.', color: 'text-violet-400' },
];

export default function LandingPage() {
  const [animScore, setAnimScore] = useState(0);
  const [activeCompany, setActiveCompany] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        i += 2;
        setAnimScore(Math.min(i, 76));
        if (i >= 76) clearInterval(interval);
      }, 20);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setActiveCompany(p => (p + 1) % COMPANIES.length), 2500);
    return () => clearInterval(interval);
  }, []);

  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (animScore / 100) * circumference;

  return (
    <div className="min-h-screen bg-background text-text overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center">
              <span className="text-background font-bold text-sm">S</span>
            </div>
            <span className="font-semibold text-text tracking-tight">SkillBridge<span className="text-accent-teal"> AI</span></span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-text-muted">
            <a href="#features" className="hover:text-text transition-colors">Features</a>
            <a href="#companies" className="hover:text-text transition-colors">Companies</a>
            <a href="#how" className="hover:text-text transition-colors">How it works</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="btn-ghost text-sm px-4 py-2">Sign in</Link>
            <Link href="/register" className="btn-primary text-sm px-4 py-2">Get started <ArrowRight size={14} /></Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen grid-bg flex items-center pt-16">
        <div className="max-w-7xl mx-auto px-6 py-24 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 animate-slide-up">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-400/10 border border-teal-400/20 text-teal-400 text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                Real-time career intelligence — no fluff, just data
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
                Know exactly where<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-400 to-emerald-400">
                  you stand.
                </span>
              </h1>
              <p className="text-text-muted text-lg leading-relaxed max-w-xl">
                Upload your resume. Pick a company. Get a precision career-fit report with ATS score, skill gaps, semantic match, and a roadmap to your target role — in under 30 seconds.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/register" className="btn-primary px-6 py-3 text-sm">
                  Analyze my resume free <ArrowRight size={15} />
                </Link>
                <Link href="/login" className="btn-ghost px-6 py-3 text-sm">
                  Demo login →
                </Link>
              </div>
              <div className="flex items-center gap-6 pt-2">
                {['No credit card', 'Works offline', 'Open source'].map(t => (
                  <div key={t} className="flex items-center gap-1.5 text-xs text-text-dim">
                    <span className="text-teal-400">✓</span> {t}
                  </div>
                ))}
              </div>
            </div>

            {/* Dashboard Preview */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-teal-400/5 to-cyan-400/5 rounded-2xl blur-xl" />
              <div className="relative card p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-text-muted uppercase tracking-widest mb-1">Career Fit Report</p>
                    <p className="text-sm font-medium">NVIDIA · AI Research Engineer</p>
                  </div>
                  <div className="badge bg-teal-400/10 text-teal-400 border border-teal-400/20">Live Analysis</div>
                </div>

                {/* Score Ring */}
                <div className="flex items-center gap-6">
                  <div className="relative w-32 h-32 flex-shrink-0">
                    <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="54" fill="none" stroke="#1c2330" strokeWidth="8"/>
                      <circle cx="60" cy="60" r="54" fill="none" stroke="url(#scoreGrad)" strokeWidth="8"
                        strokeDasharray={circumference} strokeDashoffset={offset} className="score-ring"/>
                      <defs>
                        <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#2dd4bf"/>
                          <stop offset="100%" stopColor="#10b981"/>
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-text">{animScore}</span>
                      <span className="text-xs text-text-dim">/ 100</span>
                    </div>
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    {STATS.map(s => (
                      <div key={s.label} className="bg-surface rounded-lg p-3">
                        <p className="text-xs text-text-dim mb-1">{s.label}</p>
                        <p className="text-lg font-bold" style={{ color: s.color }}>{s.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skill Pills */}
                <div>
                  <p className="text-xs text-text-dim mb-2">Matched Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {['PyTorch', 'CUDA', 'Python', 'TensorRT', 'Linux'].map(s => (
                      <span key={s} className="badge bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">{s}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-text-dim mb-2">Missing Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {['Triton', 'Distributed Training', 'ONNX'].map(s => (
                      <span key={s} className="badge bg-red-400/10 text-red-400 border border-red-400/20">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Cards */}
      <section id="companies" className="py-20 border-t border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Target any company. Instantly.</h2>
            <p className="text-text-muted">Role-specific intelligence for the world's top tech employers.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {COMPANIES.map((c, i) => (
              <div key={c.name}
                className={`card p-5 cursor-pointer transition-all duration-300 ${activeCompany === i ? 'border-opacity-50' : ''}`}
                style={activeCompany === i ? { borderColor: c.color + '50', boxShadow: `0 0 20px ${c.color}20` } : {}}
                onMouseEnter={() => setActiveCompany(i)}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 font-bold text-base"
                  style={{ background: c.color + '20', color: c.color }}>
                  {c.name[0]}
                </div>
                <p className="font-semibold text-sm">{c.name}</p>
                <p className="text-xs text-text-muted mt-0.5">{c.role}</p>
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-surface rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${c.score}%`, background: c.color }}/>
                  </div>
                  <span className="text-xs font-medium" style={{ color: c.color }}>{c.score}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 border-t border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3">Everything you need to land the role</h2>
            <p className="text-text-muted max-w-xl mx-auto">A complete career intelligence stack. Not another resume template builder.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(f => (
              <div key={f.title} className="card p-6 space-y-3">
                <div className={`w-10 h-10 rounded-xl bg-surface flex items-center justify-center ${f.color}`}>
                  <f.icon size={20} />
                </div>
                <h3 className="font-semibold text-base">{f.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20 border-t border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3">Three steps to career clarity</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Upload Resume', desc: 'Drop your PDF, DOCX, or paste text. We extract and parse everything automatically.', color: 'text-teal-400' },
              { step: '02', title: 'Select Target', desc: 'Pick a company template or paste a real job description. Mix and match for precision.', color: 'text-cyan-400' },
              { step: '03', title: 'Get Intelligence', desc: 'Receive a full career-fit dashboard with scores, gaps, rewrites, projects, and interview prep.', color: 'text-emerald-400' },
            ].map(s => (
              <div key={s.step} className="relative">
                <div className={`text-7xl font-black opacity-10 ${s.color} mb-4 leading-none`}>{s.step}</div>
                <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-border">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="card p-12 space-y-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-400/5 to-cyan-400/5" />
            <div className="relative">
              <h2 className="text-4xl font-bold mb-4">Ready to see your real score?</h2>
              <p className="text-text-muted mb-8">Join thousands of engineers using SkillBridge AI to close the gap between where they are and where they want to be.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register" className="btn-primary px-8 py-3.5 text-base">
                  Start analyzing free <ArrowRight size={16} />
                </Link>
                <Link href="/login" className="btn-ghost px-8 py-3.5 text-base">
                  Demo login (no signup)
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center">
              <span className="text-background font-bold text-xs">S</span>
            </div>
            <span className="text-sm font-medium">SkillBridge AI</span>
          </div>
          <p className="text-xs text-text-dim">Built for hackathons. Runs in Docker. Open source.</p>
          <div className="flex gap-4 text-xs text-text-dim">
            <Link href="/login" className="hover:text-text transition-colors">Login</Link>
            <Link href="/register" className="hover:text-text transition-colors">Register</Link>
            <a href="http://localhost:8000/docs" target="_blank" className="hover:text-text transition-colors">API Docs</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
