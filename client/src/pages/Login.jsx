import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowLeftRight, LogIn, Sparkles, Users, Lock } from 'lucide-react';

export const Login = ({ onSwitchToRegister, onSuccess }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const demoAccounts = [
    { label: 'Aarav Patel', role: 'Offers Python, Wants UI/UX', email: 'aarav@skillexchange.edu', pass: 'student123' },
    { label: 'Maya Chen', role: 'Offers UI/UX, Wants Python', email: 'maya@skillexchange.edu', pass: 'student123' },
    { label: 'Liam Smith', role: 'Offers React, Wants Spanish', email: 'liam@skillexchange.edu', pass: 'student123' },
    { label: 'Sofia Rodriguez', role: 'Offers Spanish, Wants React', email: 'sofia@skillexchange.edu', pass: 'student123' },
    { label: 'System Admin', role: 'Platform Moderation Hub', email: 'admin@skillexchange.edu', pass: 'admin123' },
  ];

  const handleLogin = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login({ email, password });
      onSuccess?.();
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (acc) => {
    setEmail(acc.email);
    setPassword(acc.pass);
    setLoading(true);
    setError('');
    try {
      await login({ email: acc.email, password: acc.pass });
      onSuccess?.();
    } catch (err) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 p-6 sm:p-8 bg-white rounded-3xl border border-slate-200 shadow-xl space-y-6">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white mx-auto shadow-md">
          <ArrowLeftRight className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">Welcome Back to SkillExchange</h2>
        <p className="text-xs text-slate-500">Sign in to exchange knowledge with fellow university peers</p>
      </div>

      {error && (
        <div className="p-3 text-xs bg-rose-50 text-rose-700 border border-rose-200 rounded-xl">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Student University Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="aarav@skillexchange.edu"
            className="w-full text-sm rounded-xl border border-slate-300 p-2.5 focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full text-sm rounded-xl border border-slate-300 p-2.5 focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-600/30 transition-colors disabled:opacity-60"
        >
          <LogIn className="w-4 h-4" />
          <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
        </button>
      </form>

      {/* 1-Click Demo Accounts */}
      <div className="pt-4 border-t border-slate-100 space-y-2">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center">
          ⚡ 1-Click Demo Logins for Instant Testing:
        </span>
        <div className="space-y-1.5">
          {demoAccounts.map((acc, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => quickLogin(acc)}
              className="w-full flex items-center justify-between p-2.5 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 border border-slate-200 rounded-xl text-left transition-colors text-xs"
            >
              <div>
                <strong className="text-slate-800 block">{acc.label}</strong>
                <span className="text-[10px] text-slate-500">{acc.role}</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                Try &rarr;
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="text-center text-xs text-slate-500 pt-2">
        Don't have an account yet?{' '}
        <button
          onClick={onSwitchToRegister}
          className="font-bold text-emerald-600 hover:underline"
        >
          Create Student Account
        </button>
      </div>

    </div>
  );
};
