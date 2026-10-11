import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  Plus, 
  Trash2, 
  Save, 
  Sparkles, 
  Star, 
  BookOpen, 
  Clock, 
  Calendar,
  CheckCircle2
} from 'lucide-react';

export const Profile = () => {
  const { user, refreshUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [name, setName] = useState('');
  const [university, setUniversity] = useState('');
  const [bio, setBio] = useState('');
  const [offeredSkills, setOfferedSkills] = useState([]);
  const [desiredSkills, setDesiredSkills] = useState([]);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // New skill input states
  const [newOffer, setNewOffer] = useState({ name: '', category: 'Programming', proficiency: 'Intermediate', description: '' });
  const [newDesired, setNewDesired] = useState({ name: '', category: 'Design', goal: '' });

  const categories = ['Programming', 'Design', 'Data Science', 'Languages', 'Communication', 'Writing', 'Music', 'Academics'];
  const proficiencies = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setUniversity(user.university || '');
      setBio(user.bio || '');
      setOfferedSkills(user.offeredSkills || []);
      setDesiredSkills(user.desiredSkills || []);
      
      // Fetch reviews
      api.getUserReviews(user._id).then(setReviews).catch(() => {});
    }
  }, [user]);

  const handleAddOffered = () => {
    if (!newOffer.name.trim()) return;
    setOfferedSkills([...offeredSkills, { ...newOffer }]);
    setNewOffer({ name: '', category: 'Programming', proficiency: 'Intermediate', description: '' });
  };

  const handleRemoveOffered = (index) => {
    setOfferedSkills(offeredSkills.filter((_, idx) => idx !== index));
  };

  const handleAddDesired = () => {
    if (!newDesired.name.trim()) return;
    setDesiredSkills([...desiredSkills, { ...newDesired }]);
    setNewDesired({ name: '', category: 'Design', goal: '' });
  };

  const handleRemoveDesired = (index) => {
    setDesiredSkills(desiredSkills.filter((_, idx) => idx !== index));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      await api.updateProfile({
        name,
        university,
        bio,
        offeredSkills,
        desiredSkills
      });
      await refreshUser();
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      alert(err.message || 'Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      
      {/* Header Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <img
          src={user?.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.name}`}
          alt={user?.name}
          className="w-24 h-24 rounded-2xl bg-slate-100 border-2 border-emerald-500 shadow-md"
        />
        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900">{user?.name}</h1>
            <span className="inline-block text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full uppercase tracking-wider self-center sm:self-auto">
              Verified Student
            </span>
          </div>
          <p className="text-xs text-slate-500">{user?.university || 'University Member'} • {user?.email}</p>
          
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-slate-600">
            <div className="flex items-center gap-1 font-bold text-amber-600">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>{user?.trustScore || '5.0'} Peer Trust Rating</span>
              <span className="text-slate-400 font-normal">({user?.totalReviews || 0} reviews)</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{user?.hoursTaught || 0} hrs taught</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
              <span>{user?.hoursLearned || 0} hrs learned</span>
            </div>
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-2 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Profile updated! The matching algorithm has recalibrated with your updated skills.
        </div>
      )}

      {/* Main Profile Form */}
      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Basic Info */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-600" /> Basic Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-sm rounded-xl border border-slate-300 p-2.5 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">University / Department</label>
              <input
                type="text"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className="w-full text-sm rounded-xl border border-slate-300 p-2.5 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Student Bio & Academic Focus</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell other students what you study, your academic interests, and how you like to collaborate..."
              className="w-full text-sm rounded-xl border border-slate-300 p-2.5 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Skills I Offer (Can Teach) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Skills You Can Teach (Offerings)
              </h2>
              <p className="text-xs text-slate-400">Other students will request peer sessions with you based on these skills.</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
              {offeredSkills.length} Offered
            </span>
          </div>

          {/* List */}
          <div className="space-y-2">
            {offeredSkills.map((skill, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-slate-900 text-sm">{skill.name}</strong>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      {skill.proficiency}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">{skill.category}</span>
                  </div>
                  {skill.description && <p className="text-slate-500 mt-1">{skill.description}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveOffered(idx)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Add skill form */}
          <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-3">
            <span className="text-xs font-bold text-emerald-900 block">Add an Offered Skill:</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Skill name (e.g., Python, Figma)..."
                value={newOffer.name}
                onChange={(e) => setNewOffer({ ...newOffer, name: e.target.value })}
                className="text-xs rounded-lg border border-slate-300 p-2"
              />
              <select
                value={newOffer.category}
                onChange={(e) => setNewOffer({ ...newOffer, category: e.target.value })}
                className="text-xs rounded-lg border border-slate-300 p-2 bg-white"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select
                value={newOffer.proficiency}
                onChange={(e) => setNewOffer({ ...newOffer, proficiency: e.target.value })}
                className="text-xs rounded-lg border border-slate-300 p-2 bg-white"
              >
                {proficiencies.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <input
              type="text"
              placeholder="Brief description of what you can guide someone through..."
              value={newOffer.description}
              onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })}
              className="w-full text-xs rounded-lg border border-slate-300 p-2"
            />
            <button
              type="button"
              onClick={handleAddOffered}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add to Offered Skills</span>
            </button>
          </div>
        </div>

        {/* Skills I Want to Learn (Desired) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                Skills You Want to Learn (Desired)
              </h2>
              <p className="text-xs text-slate-400">Used by the matching engine to pair you with students offering these skills.</p>
            </div>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
              {desiredSkills.length} Desired
            </span>
          </div>

          <div className="space-y-2">
            {desiredSkills.map((skill, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-slate-900 text-sm">{skill.name}</strong>
                    <span className="text-[10px] text-slate-400 font-medium">{skill.category}</span>
                  </div>
                  {skill.goal && <p className="text-slate-500 mt-1">Goal: {skill.goal}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveDesired(idx)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-3">
            <span className="text-xs font-bold text-blue-900 block">Add a Desired Skill:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Skill you want to learn (e.g., UI/UX, Spanish)..."
                value={newDesired.name}
                onChange={(e) => setNewDesired({ ...newDesired, name: e.target.value })}
                className="text-xs rounded-lg border border-slate-300 p-2"
              />
              <select
                value={newDesired.category}
                onChange={(e) => setNewDesired({ ...newDesired, category: e.target.value })}
                className="text-xs rounded-lg border border-slate-300 p-2 bg-white"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <input
              type="text"
              placeholder="Your learning objective or goal..."
              value={newDesired.goal}
              onChange={(e) => setNewDesired({ ...newDesired, goal: e.target.value })}
              className="w-full text-xs rounded-lg border border-slate-300 p-2"
            />
            <button
              type="button"
              onClick={handleAddDesired}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add to Desired Skills</span>
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-2xl shadow-md shadow-emerald-600/30 transition-colors disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Changes...' : 'Save & Recalibrate Matches'}</span>
          </button>
        </div>
      </form>

      {/* Peer Reviews Received Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          Peer Reviews & Endorsements Received ({reviews.length})
        </h2>

        {reviews.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">
            You have not received any peer reviews yet. Complete sessions to build your trust score!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {reviews.map((r) => (
              <div key={r._id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <strong className="text-slate-900">{r.reviewerName}</strong>
                  <div className="flex items-center text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span className="ml-1">{r.rating}/5</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 italic">"{r.comment}"</p>
                {r.aspects && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {r.aspects.map((asp, idx) => (
                      <span key={idx} className="text-[10px] bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                        {asp}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
