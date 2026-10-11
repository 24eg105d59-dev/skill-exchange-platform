import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowLeftRight, UserPlus, Sparkles } from 'lucide-react';

export const Register = ({ onSwitchToLogin, onSuccess }) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [university, setUniversity] = useState('');
  const [offeredSkillName, setOfferedSkillName] = useState('');
  const [desiredSkillName, setDesiredSkillName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const offeredSkills = offeredSkillName
        ? [{ name: offeredSkillName, category: 'General', proficiency: 'Intermediate', description: 'Can guide peer through fundamentals' }]
        : [];
      const desiredSkills = desiredSkillName
        ? [{ name: desiredSkillName, category: 'General', goal: 'Learn and collaborate' }]
        : [];

      await register({
        name,
        email,
        password,
        university,
        offeredSkills,
        desiredSkills
      });
      onSuccess?.();
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 p-6 sm:p-8 bg-white rounded-3xl border border-slate-200 shadow-xl space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white mx-auto shadow-md">
          <UserPlus className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">Create Student Account</h2>
        <p className="text-xs text-slate-500">Join the peer skill-sharing movement on campus</p>
      </div>

      {error && (
        <div className="p-3 text-xs bg-rose-50 text-rose-700 border border-rose-200 rounded-xl">
          {error}
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Jordan Lee"
            className="w-full text-sm rounded-xl border border-slate-300 p-2.5 focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Student University Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jordan@university.edu"
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

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">College or University</label>
          <input
            type="text"
            required
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
            placeholder="State University / College of Engineering"
            className="w-full text-sm rounded-xl border border-slate-300 p-2.5 focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>

        {/* Initial skills */}
        <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 space-y-3">
          <span className="text-[11px] font-bold text-emerald-900 block flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Quick Skill Setup (Can add more later)
          </span>
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">A skill you can teach</label>
            <input
              type="text"
              value={offeredSkillName}
              onChange={(e) => setOfferedSkillName(e.target.value)}
              placeholder="e.g. React.js, Python, French, Guitar"
              className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">A skill you want to learn</label>
            <input
              type="text"
              value={desiredSkillName}
              onChange={(e) => setDesiredSkillName(e.target.value)}
              placeholder="e.g. Figma, Machine Learning, Public Speaking"
              className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-600/30 transition-colors disabled:opacity-60"
        >
          <UserPlus className="w-4 h-4" />
          <span>{loading ? 'Creating Profile...' : 'Complete Sign Up'}</span>
        </button>
      </form>

      <div className="text-center text-xs text-slate-500 pt-2">
        Already have an account?{' '}
        <button
          onClick={onSwitchToLogin}
          className="font-bold text-emerald-600 hover:underline"
        >
          Sign In
        </button>
      </div>

    </div>
  );
};
