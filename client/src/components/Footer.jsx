import React from 'react';
import { ArrowLeftRight, Heart, Sparkles, ShieldCheck } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <ArrowLeftRight className="w-4 h-4" />
              </div>
              <span className="font-bold text-base text-slate-900 tracking-tight">
                Skill<span className="text-emerald-600">Exchange</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              An open peer-to-peer collaborative learning environment designed for university students to trade valuable skills without monetary cost.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
              <span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-emerald-500" /> 100% Free Peer Learning</span>
              <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Verified Student Profiles</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Platform Features</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>Reciprocal 2-Way Matchmaker</li>
              <li>Integrated Calendar Scheduling</li>
              <li>Dual-Sided Peer Reviews</li>
              <li>Gamified Badges & Progress</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Community Principles</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>Patience & Pedagogical Respect</li>
              <li>Equal Knowledge Reciprocity</li>
              <li>Prompt Attendance & Punctuality</li>
              <li>Constructive Growth Feedback</li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-100 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 SkillExchange Platform. Built for Student Collaborative Learning.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Designed with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for academic peers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
