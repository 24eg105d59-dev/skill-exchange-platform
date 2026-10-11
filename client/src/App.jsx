import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Matches } from './pages/Matches';
import { Explore } from './pages/Explore';
import { Sessions } from './pages/Sessions';
import { Requests } from './pages/Requests';
import { Profile } from './pages/Profile';
import { Progress } from './pages/Progress';
import { AdminDashboard } from './pages/AdminDashboard';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { 
  ArrowLeftRight, 
  Sparkles, 
  BookOpen, 
  Calendar, 
  Star, 
  ShieldCheck, 
  Users, 
  LogIn 
} from 'lucide-react';

const MainContent = () => {
  const { user, loading, login } = useAuth();
  const [currentTab, setCurrentTab] = useState('matches');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-semibold text-slate-600">Initializing Skill Exchange...</p>
        </div>
      </div>
    );
  }

  // Not logged in views
  if (!user) {
    if (currentTab === 'register') {
      return (
        <div className="min-h-screen flex flex-col justify-between">
          <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />
          <div className="flex-1 flex items-center justify-center p-4">
            <Register
              onSwitchToLogin={() => setCurrentTab('login')}
              onSuccess={() => setCurrentTab('matches')}
            />
          </div>
          <Footer />
        </div>
      );
    }

    if (currentTab === 'login') {
      return (
        <div className="min-h-screen flex flex-col justify-between">
          <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />
          <div className="flex-1 flex items-center justify-center p-4">
            <Login
              onSwitchToRegister={() => setCurrentTab('register')}
              onSuccess={() => setCurrentTab('matches')}
            />
          </div>
          <Footer />
        </div>
      );
    }

    // Default Landing Page for guests
    return (
      <div className="min-h-screen flex flex-col justify-between">
        <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
          
          {/* Hero */}
          <div className="text-center max-w-3xl mx-auto space-y-6 pt-8">
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-1.5 rounded-full text-xs font-bold shadow-sm">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Peer-to-Peer Student Learning Ecosystem</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              Trade Your Skills. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600">
                Learn Without Limits.
              </span>
            </h1>

            <p className="text-base text-slate-600 leading-relaxed">
              Have valuable skills in coding, design, languages, or public speaking? 
              Connect with university students who have complementary talents. 
              Teach what you love, learn what you need, completely free of charge.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                onClick={() => setCurrentTab('register')}
                className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-emerald-600/30 transition-transform hover:-translate-y-0.5"
              >
                Join Free as Student
              </button>
              <button
                onClick={async () => {
                  await login({ email: 'aarav@skillexchange.edu', password: 'student123' });
                  setCurrentTab('matches');
                }}
                className="flex items-center gap-2 px-6 py-3.5 bg-slate-900 hover:bg-black text-white font-bold text-sm rounded-2xl shadow-lg transition-transform hover:-translate-y-0.5"
              >
                <LogIn className="w-4 h-4 text-emerald-400" />
                <span>Explore Live Demo (As Aarav)</span>
              </button>
            </div>
          </div>

          {/* Key Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <ArrowLeftRight className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">2-Way Reciprocal Matching</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Our algorithm discovers "Golden Swaps": if you offer Python and desire Figma, we match you with peers offering Figma who desire Python.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">1-Click Video Session Booking</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Accept exchange requests and instantly generate virtual rooms. Track scheduled time slots with synchronized calendar reminders.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                <Star className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Peer Trust & Progress Badges</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Build your peer credibility with verified ratings, endorsements for patience and clarity, and collect gamified achievement badges.
              </p>
            </div>
          </div>

        </main>

        <Footer />
      </div>
    );
  }

  // Logged-in application layout
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {currentTab === 'matches' && <Matches onNavigateProfile={() => setCurrentTab('profile')} />}
        {currentTab === 'explore' && <Explore />}
        {currentTab === 'sessions' && <Sessions />}
        {currentTab === 'requests' && <Requests onNavigateSessions={() => setCurrentTab('sessions')} />}
        {currentTab === 'progress' && <Progress />}
        {currentTab === 'profile' && <Profile />}
        {currentTab === 'admin' && user?.role === 'admin' && <AdminDashboard />}
      </main>

      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <MainContent />
      </NotificationProvider>
    </AuthProvider>
  );
}
