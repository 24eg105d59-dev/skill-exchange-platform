import React, { useState } from 'react';
import { api } from '../services/api';
import { X, Send, Calendar, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const RequestModal = ({ partner, defaultRequestedSkill, defaultOfferedSkill, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [requestedSkill, setRequestedSkill] = useState(defaultRequestedSkill || '');
  const [offeredSkill, setOfferedSkill] = useState(defaultOfferedSkill || '');
  const [proposedDate, setProposedDate] = useState(
    new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 16)
  );
  const [message, setMessage] = useState(
    `Hi ${partner.name}! I would love to connect and exchange knowledge regarding ${defaultRequestedSkill || 'your skills'}.`
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!requestedSkill) {
      setError('Please specify which skill you want to learn.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.sendRequest({
        receiverId: partner._id,
        requestedSkill,
        offeredSkill,
        proposedDate: new Date(proposedDate).toISOString(),
        message
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to send exchange request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <img
              src={partner.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${partner.name}`}
              alt={partner.name}
              className="w-10 h-10 rounded-full border border-slate-200"
            />
            <div>
              <h3 className="text-base font-bold text-slate-900">Exchange with {partner.name}</h3>
              <p className="text-xs text-slate-500">{partner.university}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs bg-rose-50 text-rose-700 border border-rose-200 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Skill you want to learn from {partner.name} *
            </label>
            <select
              value={requestedSkill}
              onChange={(e) => setRequestedSkill(e.target.value)}
              className="w-full text-sm rounded-lg border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 bg-white p-2.5 border"
            >
              <option value="">Select a skill offered by {partner.name}...</option>
              {(partner.offeredSkills || []).map((s, idx) => {
                const name = typeof s === 'string' ? s : s.name;
                return <option key={idx} value={name}>{name} ({s.proficiency || 'Proficient'})</option>;
              })}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Skill you offer to teach in return (Reciprocal swap)
            </label>
            <select
              value={offeredSkill}
              onChange={(e) => setOfferedSkill(e.target.value)}
              className="w-full text-sm rounded-lg border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 bg-white p-2.5 border"
            >
              <option value="Open to any mutual topic">Open to discuss mutually</option>
              {(user?.offeredSkills || []).map((s, idx) => {
                const name = typeof s === 'string' ? s : s.name;
                return <option key={idx} value={name}>{name} (My Skill)</option>;
              })}
            </select>
            <p className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1 font-medium">
              <Sparkles className="w-3 h-3" /> Two-way reciprocal exchanges build trust and keep the platform free!
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" /> Proposed Date & Time
            </label>
            <input
              type="datetime-local"
              value={proposedDate}
              onChange={(e) => setProposedDate(e.target.value)}
              className="w-full text-sm rounded-lg border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 bg-white p-2.5 border"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Personalized Note
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Explain your goals or what you'd like to work on together..."
              className="w-full text-sm rounded-lg border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 bg-white p-2.5 border"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm shadow-emerald-600/30 transition-colors disabled:opacity-60"
            >
              {loading ? (
                'Sending...'
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Exchange Request</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
