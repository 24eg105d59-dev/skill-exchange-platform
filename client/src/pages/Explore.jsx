import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { RequestModal } from '../components/RequestModal';
import { 
  Search, 
  Filter, 
  GraduationCap, 
  Star, 
  Clock, 
  ChevronRight, 
  Sparkles,
  BookOpen
} from 'lucide-react';

export const Explore = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [proficiency, setProficiency] = useState('All');
  const [selectedItem, setSelectedItem] = useState(null);

  const categories = ['All', 'Programming', 'Design', 'Data Science', 'Languages', 'Communication', 'Creative'];
  const proficiencies = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const data = await api.exploreSkills({ search, category, proficiency });
      setSkills(data);
    } catch (err) {
      console.error('Failed to explore skills:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchSkills, 200);
    return () => clearTimeout(timer);
  }, [search, category, proficiency]);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Search Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-emerald-600" />
            Skill Directory & Peer Mentors
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse skills offered by verified students across departments. Request a 1-on-1 peer exchange.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search any skill (e.g., Python, Figma, Spanish, Public Speaking, React)..."
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
        </div>

        {/* Filters */}
        <div className="space-y-3 pt-1">
          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Categories:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-colors ${
                  category === cat
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Proficiency Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Level:</span>
            {proficiencies.map((prof) => (
              <button
                key={prof}
                onClick={() => setProficiency(prof)}
                className={`px-3 py-1 rounded-full font-medium whitespace-nowrap transition-colors ${
                  proficiency === prof
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {prof}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>Found <strong>{skills.length}</strong> skills available from peer mentors</span>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="inline-block w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-500">Searching peer offerings...</p>
        </div>
      ) : skills.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 max-w-md mx-auto space-y-3">
          <p className="text-sm font-bold text-slate-700">No skills found matching your criteria</p>
          <p className="text-xs text-slate-400">Try adjusting your search terms or clearing category filters.</p>
          <button
            onClick={() => { setSearch(''); setCategory('All'); setProficiency('All'); }}
            className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((item, idx) => {
            const skill = item.skill;
            const mentor = item.mentor;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Skill Badge & Category */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        {skill.category}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 mt-1">
                        {skill.name}
                      </h3>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {skill.proficiency}
                    </span>
                  </div>

                  {/* Skill Description */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {skill.description || `Offers peer learning and hands-on guidance in ${skill.name}.`}
                  </p>

                  {/* Mentor Info */}
                  <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                    <img
                      src={mentor.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${mentor.name}`}
                      alt={mentor.name}
                      className="w-10 h-10 rounded-full border border-slate-200"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{mentor.name}</h4>
                      <p className="text-[11px] text-slate-500 truncate">{mentor.university}</p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                        <span className="flex items-center gap-0.5 text-amber-600 font-bold">
                          <Star className="w-3 h-3 fill-amber-400" />
                          {mentor.trustScore || '5.0'}
                        </span>
                        <span>•</span>
                        <span>{mentor.hoursTaught || 0} hrs taught</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action */}
                <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    {mentor.availability?.weekdays?.[0] || 'Evening Slots'}
                  </span>
                  <button
                    onClick={() => setSelectedItem(item)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors"
                  >
                    <span>Request to Learn</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {selectedItem && (
        <RequestModal
          partner={selectedItem.mentor}
          defaultRequestedSkill={selectedItem.skill.name}
          onClose={() => setSelectedItem(null)}
          onSuccess={() => {
            alert(`Learning request for ${selectedItem.skill.name} sent to ${selectedItem.mentor.name}!`);
          }}
        />
      )}

    </div>
  );
};
