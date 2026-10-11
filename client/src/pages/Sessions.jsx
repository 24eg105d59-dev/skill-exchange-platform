import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ReviewModal } from '../components/ReviewModal';
import { ReportModal } from '../components/ReportModal';
import { 
  Calendar, 
  Video, 
  CheckCircle, 
  Clock, 
  Star, 
  AlertTriangle, 
  ExternalLink, 
  Sparkles,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

export const Sessions = () => {
  const { user, refreshUser } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming', 'completed', 'all'
  const [reviewingSession, setReviewingSession] = useState(null);
  const [reportingSession, setReportingSession] = useState(null);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const data = await api.getSessions();
      setSessions(data);
    } catch (err) {
      console.error('Error fetching sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [user]);

  const handleComplete = async (sessionId) => {
    if (!window.confirm('Mark this session as completed? Both students will receive learning credit hours.')) return;
    try {
      await api.completeSession(sessionId);
      await fetchSessions();
      await refreshUser();
    } catch (err) {
      alert(err.message || 'Error completing session');
    }
  };

  const handleCancel = async (sessionId) => {
    if (!window.confirm('Are you sure you want to cancel this scheduled session?')) return;
    try {
      await api.cancelSession(sessionId);
      await fetchSessions();
    } catch (err) {
      alert(err.message || 'Error cancelling session');
    }
  };

  const filteredSessions = sessions.filter(s => {
    if (activeTab === 'upcoming') return s.status === 'scheduled';
    if (activeTab === 'completed') return s.status === 'completed';
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Calendar className="w-6 h-6 text-emerald-600" />
            Learning Sessions & Virtual Rooms
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Join your scheduled peer sessions via virtual room links, track completed hours, and exchange ratings.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'upcoming'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Scheduled ({sessions.filter(s => s.status === 'scheduled').length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'completed'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Completed ({sessions.filter(s => s.status === 'completed').length})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'all'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            All History ({sessions.length})
          </button>
        </div>
      </div>

      {/* Sessions List */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="inline-block w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-500">Loading your exchange sessions...</p>
        </div>
      ) : filteredSessions.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 max-w-md mx-auto space-y-3">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">No {activeTab} sessions</h3>
          <p className="text-xs text-slate-400">
            Accept pending requests or send exchange requests from the Skill Matcher to book a session.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSessions.map((session) => {
            const isMentor = session.mentor?._id === user?._id;
            const partner = isMentor ? session.learner : session.mentor;

            return (
              <div
                key={session._id}
                className={`bg-white rounded-2xl border p-5 sm:p-6 transition-all ${
                  session.status === 'scheduled'
                    ? 'border-emerald-200 shadow-sm hover:border-emerald-400'
                    : 'border-slate-200 opacity-95'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  
                  {/* Left: Session details */}
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                        session.status === 'scheduled'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : session.status === 'completed'
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {session.status}
                      </span>

                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(session.scheduledStartTime).toLocaleString([], {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        })}
                      </span>

                      <span className="text-xs text-slate-400">({session.durationMinutes || 60} mins)</span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <span>{session.skillName}</span>
                        {session.reciprocalSkill && (
                          <span className="text-xs text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                            Reciprocal: {session.reciprocalSkill}
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {isMentor ? `You are tutoring ` : `Learning from `}
                        <strong className="text-slate-800">{partner?.name || 'Peer'}</strong> ({partner?.email})
                      </p>
                    </div>

                    {/* Virtual Meeting Link */}
                    {session.status === 'scheduled' && session.meetingUrl && (
                      <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-900 px-3 py-1.5 rounded-xl text-xs">
                        <Video className="w-4 h-4 text-emerald-600" />
                        <span>Instant Virtual Room:</span>
                        <a
                          href={session.meetingUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold underline hover:text-emerald-700 flex items-center gap-1"
                        >
                          Join Peer Video Call
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-wrap items-center gap-2 lg:self-center">
                    {session.status === 'scheduled' && (
                      <>
                        <a
                          href={session.meetingUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Join Video Meeting</span>
                        </a>

                        <button
                          onClick={() => handleComplete(session._id)}
                          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors"
                          title="Mark session finished to record hours"
                        >
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Mark Completed</span>
                        </button>

                        <button
                          onClick={() => handleCancel(session._id)}
                          className="px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                        >
                          Cancel
                        </button>
                      </>
                    )}

                    {session.status === 'completed' && (
                      <div className="flex items-center gap-2">
                        {session.userHasReviewed ? (
                          <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                            <Star className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
                            Reviewed & Endorsed
                          </span>
                        ) : (
                          <button
                            onClick={() => setReviewingSession(session)}
                            className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
                          >
                            <Star className="w-3.5 h-3.5 fill-white" />
                            <span>Leave Rating & Feedback</span>
                          </button>
                        )}
                      </div>
                    )}

                    {/* Report flag */}
                    <button
                      onClick={() => setReportingSession(session)}
                      className="p-2 text-slate-300 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Report session issue"
                    >
                      <ShieldAlert className="w-4 h-4" />
                    </button>
                  </div>

                </div>

                {/* Reviews displayed if any */}
                {session.reviews?.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Feedback from Session:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {session.reviews.map((rev) => (
                        <div key={rev._id} className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs">
                          <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                            <span>{rev.reviewerName}</span>
                            <span className="flex items-center text-amber-500">
                              <Star className="w-3 h-3 fill-amber-400" /> {rev.rating}/5
                            </span>
                          </div>
                          <p className="text-slate-600 text-xs mt-1 italic">"{rev.comment}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

      {/* Review Modal */}
      {reviewingSession && (
        <ReviewModal
          session={reviewingSession}
          onClose={() => setReviewingSession(null)}
          onSuccess={() => {
            fetchSessions();
            refreshUser();
          }}
        />
      )}

      {/* Report Modal */}
      {reportingSession && (
        <ReportModal
          targetUser={reportingSession.mentor?._id === user?._id ? reportingSession.learner : reportingSession.mentor}
          sessionId={reportingSession._id}
          onClose={() => setReportingSession(null)}
          onSuccess={() => {}}
        />
      )}

    </div>
  );
};
