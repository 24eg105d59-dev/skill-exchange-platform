import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { RequestModal } from '../components/RequestModal';
import { 
  ArrowLeftRight, 
  Sparkles, 
  Star, 
  Clock, 
  BookOpen, 
  CheckCircle2, 
  Filter, 
  UserPlus, 
  AlertCircle,
  CalendarCheck
} from 'lucide-react';

export const Matches = ({ onNavigateProfile }) => {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'reciprocal', 'one-way'
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [requestSkillPrefill, setRequestSkillPrefill] = useState({ requested: '', offered: '' });
  const [alertSuccess, setAlertSuccess] = useState(false);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const data = await api.getReciprocalMatches();
      setMatches(data);
    } catch (err) {
      console.error('Failed to fetch matches:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [user]);

  const filteredMatches = matches.filter(m => {
    if (filter === 'reciprocal') return m.isReciprocal;
    if (filter === 'one-way') return !m.isReciprocal;
    return true;
  });

  const reciprocalCount = matches.filter(m => m.isReciprocal).length;

  const handleOpenRequest = (match) => {
    setSelectedPartner(match.partner);
    const requested = match.theyTeachYou?.[0]?.name || (typeof match.theyTeachYou?.[0] === 'string' ? match.theyTeachYou?.[0] : '');
    const offered = match.youTeachThem?.[0]?.name || (typeof match.youTeachThem?.[0] === 'string' ? match.youTeachThem?.[0] : '');
    setRequestSkillPrefill({ requested, offered });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Smart Reciprocal Matchmaking</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Exchange Knowledge. Learn for Free.
          </h1>
          <p className="text-emerald-100 text-sm leading-relaxed">
            Our match engine cross-analyzes the skills you offer with what your university peers desire. 
            Connect with students who have complementary skills for mutually beneficial 1-on-1 sessions.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-medium text-emerald-100">
            <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg">
              <ArrowLeftRight className="w-4 h-4 text-emerald-300" />
              <span><strong>{reciprocalCount}</strong> Perfect Two-Way Swaps Found</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg">
              <CalendarCheck className="w-4 h-4 text-teal-300" />
              <span>Zero Tuition • Peer Driven</span>
            </div>
          </div>
        </div>
      </div>

      {alertSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center justify-between text-sm">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            Learning request sent successfully! You can track it in the Requests tab.
          </span>
          <button onClick={() => setAlertSuccess(false)} className="text-xs font-semibold text-emerald-700 underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Filter and Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Filter Matches:</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              All Matches ({matches.length})
            </button>
            <button
              onClick={() => setFilter('reciprocal')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filter === 'reciprocal'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
              }`}
            >
              <ArrowLeftRight className="w-3 h-3" />
              <span>2-Way Reciprocal Swaps ({reciprocalCount})</span>
            </button>
            <button
              onClick={() => setFilter('one-way')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filter === 'one-way'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              1-Way Mentors ({matches.length - reciprocalCount})
            </button>
          </div>
        </div>

        <button
          onClick={onNavigateProfile}
          className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 self-start sm:self-auto"
        >
          <span>Update skills & schedule to discover more peers</span>
          <ArrowLeftRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Matches Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="inline-block w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-500">Finding your perfect peer learning matches...</p>
        </div>
      ) : filteredMatches.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-sm max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No Matching Peers Found For Current Filter</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Try adjusting your filter or adding more offered and desired skills to your profile so the algorithm can discover compatible exchange partners!
          </p>
          <button
            onClick={onNavigateProfile}
            className="px-5 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-md hover:bg-emerald-700 transition-colors"
          >
            Edit Profile Skills
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMatches.map((item, idx) => {
            const partner = item.partner;
            return (
              <div
                key={partner._id || idx}
                className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between overflow-hidden group"
              >
                {/* Header Card */}
                <div className="p-5 pb-3 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={partner.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${partner.name}`}
                        alt={partner.name}
                        className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 group-hover:scale-105 transition-transform"
                      />
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">
                          {partner.name}
                        </h3>
                        <p className="text-[11px] text-slate-500">{partner.university}</p>
                      </div>
                    </div>

                    {/* Match Score Badge */}
                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-lg text-xs font-extrabold">
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        {item.matchScore}% Match
                      </span>
                    </div>
                  </div>

                  {/* Reciprocal Tag */}
                  {item.isReciprocal ? (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-bold rounded-lg">
                      <ArrowLeftRight className="w-3.5 h-3.5 text-amber-600" />
                      <span>Golden Swap: Perfect 2-Way Reciprocal Match</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-200 text-slate-600 text-[11px] font-medium rounded-lg">
                      <span>One-Way Mentorship Match</span>
                    </div>
                  )}

                  {/* Bio */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {partner.bio || 'Eager to exchange knowledge and collaborate with fellow students.'}
                  </p>
                </div>

                {/* Skill Match Breakdown Box */}
                <div className="px-5 py-3 bg-slate-50/70 border-t border-b border-slate-100 space-y-2.5 text-xs">
                  
                  {/* They Teach You */}
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      They Can Teach You:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {item.theyTeachYou.map((skill, sIdx) => {
                        const name = typeof skill === 'string' ? skill : skill.name;
                        const level = skill.proficiency || 'Proficient';
                        return (
                          <span
                            key={sIdx}
                            className="bg-emerald-100/80 text-emerald-800 font-semibold px-2 py-0.5 rounded-md text-[11px] border border-emerald-200 flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            {name} <span className="text-[9px] opacity-75 font-normal">({level})</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* You Teach Them */}
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      You Can Teach Them:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {item.youTeachThem.length > 0 ? (
                        item.youTeachThem.map((skill, sIdx) => {
                          const name = typeof skill === 'string' ? skill : skill.name;
                          return (
                            <span
                              key={sIdx}
                              className="bg-blue-100/80 text-blue-800 font-semibold px-2 py-0.5 rounded-md text-[11px] border border-blue-200 flex items-center gap-1"
                            >
                              <BookOpen className="w-3 h-3 text-blue-600" />
                              {name}
                            </span>
                          );
                        })
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">
                          Explore mutual interests during request
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Trust Score & Experience */}
                  <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500 border-t border-slate-200/60">
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <strong>{partner.trustScore || '5.0'}</strong> ({partner.totalReviews || 0} reviews)
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {partner.hoursTaught || 0} hrs taught
                    </span>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-4 bg-white flex items-center justify-between gap-2">
                  <div className="text-[11px] text-slate-500 truncate max-w-[140px]">
                    {partner.availability?.weekdays?.[0] || 'Flexible Schedule'}
                  </div>

                  <button
                    onClick={() => handleOpenRequest(item)}
                    className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm shadow-emerald-600/30 transition-colors"
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5" />
                    <span>{item.isReciprocal ? 'Propose Swap' : 'Request Session'}</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Propose Exchange Modal */}
      {selectedPartner && (
        <RequestModal
          partner={selectedPartner}
          defaultRequestedSkill={requestSkillPrefill.requested}
          defaultOfferedSkill={requestSkillPrefill.offered}
          onClose={() => setSelectedPartner(null)}
          onSuccess={() => {
            setAlertSuccess(true);
            fetchMatches();
          }}
        />
      )}

    </div>
  );
};
