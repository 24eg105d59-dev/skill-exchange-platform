import React, { useState } from 'react';
import { api } from '../services/api';
import { X, Star, ThumbsUp } from 'lucide-react';

export const ReviewModal = ({ session, onClose, onSuccess }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [aspects, setAspects] = useState(['Clear Explanations', 'Super Patient']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const availableAspects = [
    'Clear Explanations',
    'Super Patient',
    'Punctual',
    'Practical Examples',
    'Well Prepared',
    'Great Problem Solver',
    'Friendly & Encouraging'
  ];

  const toggleAspect = (item) => {
    if (aspects.includes(item)) {
      setAspects(aspects.filter(a => a !== item));
    } else {
      setAspects([...aspects, item]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.submitReview({
        sessionId: session._id,
        rating,
        comment,
        aspects
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || 'Error submitting review.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Review Learning Session</h3>
            <p className="text-xs text-slate-500">{session.skillName}</p>
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

          {/* Star selector */}
          <div className="text-center py-2">
            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Overall Experience
            </span>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-7 h-7 ${
                      (hoverRating || rating) >= star
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs font-bold text-slate-700 mt-1">
              {rating === 5 && '🌟 Outstanding Peer Session'}
              {rating === 4 && '👍 Great Exchange'}
              {rating === 3 && '🙂 Good Session'}
              {rating === 2 && '😐 Needs Improvement'}
              {rating === 1 && '👎 Unsatisfactory'}
            </p>
          </div>

          {/* Peer endorsement aspects */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              What did your peer do best? (Endorsements)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {availableAspects.map((aspect) => {
                const selected = aspects.includes(aspect);
                return (
                  <button
                    type="button"
                    key={aspect}
                    onClick={() => toggleAspect(aspect)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                      selected
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-medium'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {aspect}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Written Feedback
            </label>
            <textarea
              rows={3}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you learn? How helpful was your partner?"
              className="w-full text-sm rounded-lg border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2.5 border"
            />
          </div>

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
              {loading ? 'Submitting...' : 'Submit Feedback & Rating'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
