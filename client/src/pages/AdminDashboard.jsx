import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldAlert, 
  Users, 
  Calendar, 
  Clock, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle, 
  Ban, 
  RotateCcw,
  BarChart3
} from 'lucide-react';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [userList, setUserList] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'reports'

  const fetchData = async () => {
    setLoading(true);
    try {
      const [s, u, r] = await Promise.all([
        api.getAdminStats(),
        api.getAdminUsers(),
        api.getAdminReports()
      ]);
      setStats(s);
      setUserList(u);
      setReports(r);
    } catch (err) {
      console.error('Admin fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleSuspend = async (userId) => {
    try {
      await api.toggleUserStatus(userId);
      await fetchData();
    } catch (err) {
      alert(err.message || 'Error updating user status');
    }
  };

  const handleResolveReport = async (reportId) => {
    try {
      await api.resolveAdminReport(reportId);
      await fetchData();
    } catch (err) {
      alert(err.message || 'Error resolving report');
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="inline-block w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-slate-500">Loading administrator control room...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto pb-12">
      
      {/* Header */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-2">
        <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-semibold">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Administrative & Safety Governance</span>
        </div>
        <h1 className="text-2xl font-black">Platform Administration Hub</h1>
        <p className="text-slate-400 text-xs sm:text-sm">
          Monitor platform health, verify university participants, enforce safety rules, and manage reported issues.
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Students</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{stats?.totalUsers || 0}</div>
          <span className="text-[11px] text-emerald-600 font-semibold">{stats?.activeUsers || 0} active</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Completed Sessions</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{stats?.completedSessions || 0}</div>
          <span className="text-[11px] text-blue-600 font-semibold">out of {stats?.totalSessions || 0} booked</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Hours Exchanged</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{stats?.totalHoursExchanged || 0} hrs</div>
          <span className="text-[11px] text-indigo-600 font-semibold">100% peer learning</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Flagged Reports</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{stats?.pendingReports || 0}</div>
          <span className="text-[11px] text-rose-600 font-semibold">pending review</span>
        </div>
      </div>

      {/* Most Popular Skills */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-emerald-600" />
          Top In-Demand Skills on Campus
        </h3>
        <div className="flex flex-wrap gap-2 pt-1">
          {(stats?.popularSkills || []).map((s, idx) => (
            <span
              key={idx}
              className="bg-slate-100 text-slate-700 font-semibold text-xs px-3 py-1.5 rounded-xl border border-slate-200 flex items-center gap-2"
            >
              <span>{s.name}</span>
              <span className="bg-emerald-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {s.count}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl max-w-xs text-xs font-bold">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex-1 py-2 rounded-xl transition-colors ${
            activeTab === 'users' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
          }`}
        >
          Student Directory ({userList.length})
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`flex-1 py-2 rounded-xl transition-colors ${
            activeTab === 'reports' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
          }`}
        >
          Safety Reports ({reports.length})
        </button>
      </div>

      {/* Tab 1: User management */}
      {activeTab === 'users' ? (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">University</th>
                  <th className="px-6 py-4">Trust Score</th>
                  <th className="px-6 py-4">Hours Exchanged</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {userList.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${u.name}`}
                          alt={u.name}
                          className="w-8 h-8 rounded-full border border-slate-200"
                        />
                        <div>
                          <strong className="text-slate-900">{u.name}</strong>
                          <span className="block text-[11px] text-slate-400">{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{u.university}</td>
                    <td className="px-6 py-4 font-bold text-amber-600">
                      ★ {u.trustScore || '5.0'} ({u.totalReviews || 0})
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      Taught: {u.hoursTaught || 0}h | Learned: {u.hoursLearned || 0}h
                    </td>
                    <td className="px-6 py-4">
                      {u.isSuspended ? (
                        <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full font-bold text-[10px]">
                          Suspended
                        </span>
                      ) : (
                        <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold text-[10px]">
                          Active Member
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => handleToggleSuspend(u._id)}
                          className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                            u.isSuspended
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                          }`}
                        >
                          {u.isSuspended ? 'Re-activate' : 'Suspend Account'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Tab 2: Reports */
        <div className="space-y-4">
          {reports.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 max-w-md mx-auto space-y-2">
              <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
              <h4 className="font-bold text-slate-800 text-sm">No Pending Reports</h4>
              <p className="text-xs text-slate-400">All community safety reports have been resolved.</p>
            </div>
          ) : (
            reports.map((r) => (
              <div
                key={r._id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                      {r.reason}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      r.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {r.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 font-semibold mt-1">
                    Reported by: <span className="font-normal">{r.reporterName}</span>
                  </p>
                  {r.details && <p className="text-xs text-slate-500 italic">"{r.details}"</p>}
                </div>

                {r.status === 'pending' && (
                  <button
                    onClick={() => handleResolveReport(r._id)}
                    className="flex items-center gap-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors self-start sm:self-auto"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Mark Resolved</span>
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
};
