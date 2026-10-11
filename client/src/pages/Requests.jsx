import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Inbox, 
  Send, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  ArrowLeftRight, 
  Sparkles,
  Clock,
  UserCheck
} from 'lucide-react';

export const Requests = ({ onNavigateSessions }) => {
  const { user } = useAuth();
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('incoming');
  const [processingId, setProcessingId] = useState(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await api.getRequests();
      setIncoming(data.incoming || []);
      setOutgoing(data.outgoing || []);
    } catch (err) {
      console.error('Error fetching requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [user]);

  const handleRespond = async (requestId, status) => {
    setProcessingId(requestId);
    try {
      const res = await api.respondRequest(requestId, status);
      await fetchRequests();
      if (status === 'accepted') {
        alert('🎉 Exchange request accepted! A session has been scheduled in your Sessions tab.');
      }
    } catch (err) {
      alert(err.message || 'Error responding to request');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Inbox className="w-6 h-6 text-emerald-600" />
            Learning & Swap Requests
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review exchange invitations from fellow students and follow up on pending proposals.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('incoming')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'incoming'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <span>Received</span>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {incoming.filter(r => r.status === 'pending').length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('outgoing')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'outgoing'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <span>Sent Proposals</span>
            <span className="bg-slate-200 text-slate-700 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {outgoing.length}
            </span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="inline-block w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-500">Loading requests...</p>
        </div>
      ) : activeTab === 'incoming' ? (
        /* Incoming requests */
        incoming.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 max-w-md mx-auto space-y-3">
            <Inbox className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700">No incoming exchange requests</h3>
            <p className="text-xs text-slate-400">
              When peers discover your offered skills, their learning proposals will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {incoming.map((req) => (
              <div
                key={req._id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 p-5 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={req.sender?.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${req.sender?.name}`}
                      alt={req.sender?.name}
                      className="w-11 h-11 rounded-full border border-slate-200"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{req.sender?.name}</h4>
                      <p className="text-xs text-slate-500">
                        Peer Trust Score: <strong>{req.sender?.trustScore || '5.0'} / 5.0</strong>
                      </p>
                    </div>
                  </div>

                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider self-start sm:self-auto ${
                    req.status === 'pending'
                      ? 'bg-amber-100 text-amber-800'
                      : req.status === 'accepted'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {req.status}
                  </span>
                </div>

                {/* Swap Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      They want to learn:
                    </span>
                    <strong className="text-emerald-700 text-sm">{req.requestedSkill}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      They offer in return:
                    </span>
                    <strong className="text-blue-700 text-sm">{req.offeredSkill}</strong>
                  </div>
                </div>

                <p className="text-xs text-slate-600 bg-white p-3 rounded-lg border border-slate-100 italic">
                  "{req.message}"
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 text-xs">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Proposed time: {new Date(req.proposedDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                  </span>

                  {req.status === 'pending' ? (
                    <div className="flex items-center gap-2">
                      <button
                        disabled={processingId === req._id}
                        onClick={() => handleRespond(req._id, 'declined')}
                        className="px-3.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      >
                        Decline
                      </button>
                      <button
                        disabled={processingId === req._id}
                        onClick={() => handleRespond(req._id, 'accepted')}
                        className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Accept & Schedule Session</span>
                      </button>
                    </div>
                  ) : req.status === 'accepted' ? (
                    <button
                      onClick={onNavigateSessions}
                      className="text-xs font-bold text-emerald-700 underline"
                    >
                      View Scheduled Session in Sessions Tab &rarr;
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Outgoing requests */
        outgoing.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 max-w-md mx-auto space-y-3">
            <Send className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700">No outgoing proposals</h3>
            <p className="text-xs text-slate-400">
              Go to the Skill Matcher to propose swaps with your peers!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {outgoing.map((req) => (
              <div
                key={req._id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Request to learn {req.requestedSkill} from {req.receiver?.name}
                    </h4>
                    <p className="text-xs text-slate-400">
                      Offered: {req.offeredSkill} • Sent {new Date(req.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider ${
                    req.status === 'pending'
                      ? 'bg-amber-100 text-amber-800'
                      : req.status === 'accepted'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {req.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )
      )}

    </div>
  );
};
