import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Award, 
  Clock, 
  BookOpen, 
  CheckCircle2, 
  Circle, 
  Star, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck 
} from 'lucide-react';

export const Progress = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      setLoading(true);
      try {
        const data = await api.getProgress();
        setProgress(data);
      } catch (err) {
        console.error('Error fetching progress:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [user]);

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="inline-block w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-slate-500">Calculating your learning metrics & milestones...</p>
      </div>
    );
  }

  const hoursTaught = progress?.hoursTaught || 0;
  const hoursLearned = progress?.hoursLearned || 0;
  const totalHours = hoursTaught + hoursLearned || 1;
  const taughtPercent = Math.round((hoursTaught / totalHours) * 100);
  const learnedPercent = 100 - taughtPercent;

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto pb-12">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-3">
        <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-semibold">
          <Award className="w-3.5 h-3.5" />
          <span>Peer Growth & Reciprocity Tracking</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Your Peer Exchange Milestones
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
          SkillExchange rewards reciprocal participation. By balancing what you give (teaching) with what you receive (learning), you foster an equitable academic ecosystem.
        </p>
      </div>

      {/* Reciprocity Gauge & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Hours Taught Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <TrendingUp className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Hours Taught</span>
            <div className="text-2xl font-black text-slate-900">{hoursTaught} hrs</div>
            <span className="text-[11px] text-emerald-600 font-semibold">{progress?.taughtSessionsCount || 0} peer sessions delivered</span>
          </div>
        </div>

        {/* Hours Learned Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
            <BookOpen className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Hours Learned</span>
            <div className="text-2xl font-black text-slate-900">{hoursLearned} hrs</div>
            <span className="text-[11px] text-blue-600 font-semibold">{progress?.learnedSessionsCount || 0} peer sessions completed</span>
          </div>
        </div>

        {/* Trust Score Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Star className="w-7 h-7 fill-amber-400" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Peer Trust Rating</span>
            <div className="text-2xl font-black text-slate-900">{progress?.trustScore || '5.0'} / 5.0</div>
            <span className="text-[11px] text-amber-600 font-semibold">{progress?.totalReviews || 0} peer endorsements</span>
          </div>
        </div>

      </div>

      {/* Reciprocity Ratio Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900">Exchange Reciprocity Balance (Give vs. Take)</h3>
            <p className="text-xs text-slate-400">Aim for a 50/50 balance between sharing your knowledge and acquiring new skills.</p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl self-start sm:self-auto">
            {Math.abs(hoursTaught - hoursLearned) <= 1 ? '🎯 Balanced Contributor' : '🌱 Growing Exchange'}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 pt-2">
          <div className="h-4 bg-slate-100 rounded-full overflow-hidden flex">
            <div
              style={{ width: `${taughtPercent}%` }}
              className="bg-emerald-500 h-full transition-all duration-500"
              title={`Teaching: ${hoursTaught} hrs`}
            ></div>
            <div
              style={{ width: `${learnedPercent}%` }}
              className="bg-blue-500 h-full transition-all duration-500"
              title={`Learning: ${hoursLearned} hrs`}
            ></div>
          </div>

          <div className="flex justify-between text-xs font-bold">
            <span className="text-emerald-700 flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              {taughtPercent}% Teaching ({hoursTaught} hrs)
            </span>
            <span className="text-blue-700 flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              {learnedPercent}% Learning ({hoursLearned} hrs)
            </span>
          </div>
        </div>
      </div>

      {/* Badges Collection */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          Earned Gamification Badges ({progress?.badges?.length || 0})
        </h3>
        <p className="text-xs text-slate-400">
          Earn badges automatically by tutoring peers, maintaining top ratings, and completing reciprocal exchanges.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-2">
          {(progress?.badges || []).map((badge, idx) => (
            <div
              key={idx}
              className="p-4 bg-gradient-to-b from-amber-50/70 to-orange-50/30 rounded-2xl border border-amber-200/80 text-center space-y-2 hover:scale-105 transition-transform"
            >
              <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-amber-200 flex items-center justify-center text-amber-500 mx-auto">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="text-xs font-bold text-slate-900">{badge}</h4>
              <span className="text-[10px] font-semibold text-amber-700 bg-amber-100/60 px-2 py-0.5 rounded-full inline-block">
                Unlocked
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Milestones Checklist */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          Student Learning Roadmap & Milestones
        </h3>

        <div className="space-y-3 pt-2">
          {(progress?.milestones || []).map((m) => (
            <div
              key={m.id}
              className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs transition-colors ${
                m.completed
                  ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                  : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}
            >
              <div className="flex items-center gap-3">
                {m.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-300 flex-shrink-0" />
                )}
                <span className={`font-semibold ${m.completed ? 'text-slate-900' : 'text-slate-500'}`}>
                  {m.title}
                </span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                m.completed ? 'bg-emerald-200/80 text-emerald-900' : 'bg-slate-200 text-slate-600'
              }`}>
                {m.completed ? 'Completed' : 'In Progress'}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
