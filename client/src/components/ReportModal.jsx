import React, { useState } from 'react';
import { api } from '../services/api';
import { X, ShieldAlert, AlertTriangle } from 'lucide-react';

export const ReportModal = ({ targetUser, sessionId, onClose, onSuccess }) => {
  const [reason, setReason] = useState('Inappropriate behavior or harassment');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const reasons = [
    'Inappropriate behavior or harassment',
    'No-show / Repeated cancellation without notice',
    'Spam, advertising, or unsolicited commercial requests',
    'False information / Skill misrepresentation',
    'Academic dishonesty / Cheating solicitation'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.fileReport({
        targetUserId: targetUser?._id,
        sessionId: sessionId || '',
        reason,
        details
      });
      alert('Report submitted. Platform administrators will review this issue.');
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || 'Error submitting report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        
        <div className="flex items-center justify-between px-6 py-4 bg-rose-50 border-b border-rose-100">
          <div className="flex items-center gap-2 text-rose-800">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <h3 className="text-base font-bold">Report Student / Session</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs bg-rose-50 text-rose-700 border border-rose-200 rounded-lg">
              {error}
            </div>
          )}

          <p className="text-xs text-slate-600">
            Reporting helps maintain a safe, welcoming, and high-quality peer learning community.
            Reports are kept strictly confidential.
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Reason for Report *
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full text-sm rounded-lg border-slate-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 p-2.5 border"
            >
              {reasons.map((r, idx) => (
                <option key={idx} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Additional Details (Optional)
            </label>
            <textarea
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Please provide any relevant context..."
              className="w-full text-sm rounded-lg border-slate-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 p-2.5 border"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition-colors disabled:opacity-60"
            >
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
