import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { 
  ArrowLeftRight, 
  Search, 
  Calendar, 
  Inbox, 
  Award, 
  ShieldAlert, 
  Bell, 
  LogOut, 
  User, 
  Users,
  CheckCircle,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

export const Navbar = ({ currentTab, setCurrentTab }) => {
  const { user, logout, login } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showDemoMenu, setShowDemoMenu] = useState(false);

  const demoAccounts = [
    { label: 'Aarav (Python -> Design)', email: 'aarav@skillexchange.edu', pass: 'student123' },
    { label: 'Maya (UI/UX -> Python)', email: 'maya@skillexchange.edu', pass: 'student123' },
    { label: 'Liam (React -> Spanish)', email: 'liam@skillexchange.edu', pass: 'student123' },
    { label: 'Sofia (Spanish -> React)', email: 'sofia@skillexchange.edu', pass: 'student123' },
    { label: 'Elena (Algorithms -> Speaking)', email: 'elena@skillexchange.edu', pass: 'student123' },
    { label: 'System Admin', email: 'admin@skillexchange.edu', pass: 'admin123' },
  ];

  const handleQuickSwitch = async (acc) => {
    try {
      await login({ email: acc.email, password: acc.pass });
      setShowDemoMenu(false);
    } catch (err) {
      alert('Error switching account: ' + err.message);
    }
  };

  const navLinks = [
    { id: 'matches', label: 'Skill Matcher', icon: ArrowLeftRight, badge: null },
    { id: 'explore', label: 'Explore Skills', icon: Search, badge: null },
    { id: 'sessions', label: 'My Sessions', icon: Calendar, badge: null },
    { id: 'requests', label: 'Requests', icon: Inbox, badge: null },
    { id: 'progress', label: 'Learning Progress', icon: Award, badge: null },
  ];

  if (user?.role === 'admin') {
    navLinks.push({ id: 'admin', label: 'Admin Hub', icon: ShieldAlert, badge: 'Staff' });
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div 
            onClick={() => setCurrentTab('matches')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg text-slate-900 tracking-tight flex items-center gap-1.5">
                Skill<span className="text-emerald-600">Exchange</span>
                <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">P2P</span>
              </span>
              <p className="text-[11px] text-slate-500 hidden sm:block -mt-1">Peer Knowledge Sharing</p>
            </div>
          </div>

          {/* Navigation Items (when logged in) */}
          {user && (
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentTab(item.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive 
                        ? 'bg-emerald-50 text-emerald-700 font-semibold' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-semibold">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          )}

          {/* Right Action Area */}
          <div className="flex items-center gap-2.5">
            {/* Quick Demo Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowDemoMenu(!showDemoMenu)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-200 transition-colors"
                title="Quickly switch between pre-seeded test students"
              >
                <Users className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Demo Switcher</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showDemoMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 text-left">
                  <div className="px-3 py-1.5 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Test As Another Student
                  </div>
                  {demoAccounts.map(acc => (
                    <button
                      key={acc.email}
                      onClick={() => handleQuickSwitch(acc)}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-emerald-50 hover:text-emerald-800 transition-colors ${
                        user?.email === acc.email ? 'bg-emerald-50/70 font-bold text-emerald-700' : 'text-slate-700'
                      }`}
                    >
                      <span>{acc.label}</span>
                      {user?.email === acc.email && <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {user ? (
              <>
                {/* Notification Bell */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifs(!showNotifs)}
                    className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                    aria-label="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  {showNotifs && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50">
                      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-100">
                        <div className="font-semibold text-sm text-slate-800 flex items-center gap-2">
                          <span>Notifications</span>
                          {unreadCount > 0 && (
                            <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded-full font-bold">
                              {unreadCount} new
                            </span>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-sm text-slate-400">
                            No notifications yet
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <div
                              key={n._id}
                              onClick={() => {
                                markAsRead(n._id);
                                if (n.link) {
                                  setCurrentTab(n.link.replace('/', ''));
                                  setShowNotifs(false);
                                }
                              }}
                              className={`p-3.5 text-left cursor-pointer hover:bg-slate-50 transition-colors ${
                                !n.read ? 'bg-emerald-50/40' : ''
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="text-xs font-semibold text-slate-900">{n.title}</h4>
                                <span className="text-[10px] text-slate-400 whitespace-nowrap">
                                  {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 mt-0.5">{n.message}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Pill */}
                <button
                  onClick={() => setCurrentTab('profile')}
                  className={`flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                    currentTab === 'profile'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                      : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <img
                    src={user.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`}
                    alt={user.name}
                    className="w-6 h-6 rounded-full bg-slate-200"
                  />
                  <span className="hidden sm:inline font-semibold">{user.name.split(' ')[0]}</span>
                </button>

                {/* Logout */}
                <button
                  onClick={logout}
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentTab('login')}
                  className="px-3.5 py-1.5 text-sm font-semibold text-slate-700 hover:text-slate-900"
                >
                  Log In
                </button>
                <button
                  onClick={() => setCurrentTab('register')}
                  className="px-3.5 py-1.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm shadow-emerald-600/30 transition-colors"
                >
                  Sign Up
                </button>
              </div>
            )}

          </div>
        </div>

        {/* Mobile Subnavigation */}
        {user && (
          <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-100 overflow-x-auto text-xs">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex flex-col items-center gap-1 px-2.5 py-1 rounded-lg ${
                    isActive ? 'text-emerald-600 font-bold' : 'text-slate-500'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};
