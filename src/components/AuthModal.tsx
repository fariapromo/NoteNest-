import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  UserCircle,
  ShieldCheck,
  Check,
  X,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Plus
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    currentUser,
    users,
    switchUser,
    loginOrCreateUser,
    isAuthModalOpen,
    setIsAuthModalOpen,
  } = useApp();

  const [mode, setMode] = useState<'switch' | 'new'>('switch');
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [email, setEmail] = useState('');
  const [university, setUniversity] = useState('Harvard University');
  const [major, setMajor] = useState('Data Science & Applied Math');

  if (!isAuthModalOpen) return null;

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !handle || !email) return;

    loginOrCreateUser({
      name,
      handle,
      email,
      university,
      major,
    });
    setIsAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-200 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-bold">
              <UserCircle className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900">Student Account &amp; Profiles</h3>
              <p className="text-xs text-neutral-500">Sign in or switch student profiles</p>
            </div>
          </div>
          <button onClick={() => setIsAuthModalOpen(false)} className="text-neutral-400 hover:text-neutral-700 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex bg-neutral-100 p-1 rounded-lg text-xs font-medium">
          <button
            onClick={() => setMode('switch')}
            className={`flex-1 py-1.5 rounded-md transition-colors ${
              mode === 'switch' ? 'bg-white text-neutral-900 shadow-2xs font-semibold' : 'text-neutral-600'
            }`}
          >
            Switch Student Account
          </button>
          <button
            onClick={() => setMode('new')}
            className={`flex-1 py-1.5 rounded-md transition-colors ${
              mode === 'new' ? 'bg-white text-neutral-900 shadow-2xs font-semibold' : 'text-neutral-600'
            }`}
          >
            Register / Sign In
          </button>
        </div>

        {mode === 'switch' ? (
          <div className="space-y-3">
            <div className="text-xs text-neutral-500">
              Select an active student scholar profile to test peer buying, selling, and collaboration:
            </div>

            <div className="space-y-2">
              {users.map((u) => {
                const isActive = u.id === currentUser.id;

                return (
                  <div
                    key={u.id}
                    onClick={() => {
                      switchUser(u.id);
                      setIsAuthModalOpen(false);
                    }}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isActive
                        ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                        : 'bg-white hover:bg-neutral-50 text-neutral-900 border-neutral-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatarUrl}
                        alt={u.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-neutral-300"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-xs">
                          <span>{u.name}</span>
                          <span className={isActive ? 'text-neutral-400' : 'text-neutral-500'}>
                            {u.handle}
                          </span>
                          {u.isVerified && (
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          )}
                        </div>
                        <div className={`text-[11px] truncate max-w-[200px] ${isActive ? 'text-neutral-300' : 'text-neutral-500'}`}>
                          {u.university} · {u.major}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-[10px] opacity-75">Balance</div>
                      <div className="font-mono font-bold text-xs">
                        ${u.walletBalance.toFixed(2)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <form onSubmit={handleCreateAccount} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-neutral-800 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Maya Chen"
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-800 mb-1">
                Student Handle
              </label>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="@maya_data"
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 font-mono focus:outline-none focus:ring-1 focus:ring-neutral-900"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-800 mb-1">
                University Email (.edu)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="mchen@harvard.edu"
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 font-mono focus:outline-none focus:ring-1 focus:ring-neutral-900"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-neutral-800 mb-1">
                  University
                </label>
                <input
                  type="text"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-neutral-800 mb-1">
                  Major
                </label>
                <input
                  type="text"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900"
                />
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center gap-2 text-amber-900 text-[11px]">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Includes $25.00 complimentary student starter credit in your P2P wallet!</span>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Create Account &amp; Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
