import React from 'react';
import { useApp } from '../context/AppContext';
import { BookOpen, ShieldCheck, Wallet, UserCircle, Plus } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentUser,
    activeTab,
    setActiveTab,
    setIsAuthModalOpen,
    setIsWalletModalOpen,
    setIsVerificationModalOpen,
    createNote,
  } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Brand wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('notes')}
            className="flex items-center gap-2 text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-bold text-base shadow-sm">
              <BookOpen className="w-4 h-4 text-amber-300" />
            </div>
            <span className="text-xl font-bold tracking-tight text-neutral-900 whitespace-nowrap">
              NoteNest
            </span>
          </button>
        </div>

        {/* Zone 2: 4-5 Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-600">
          <button
            onClick={() => setActiveTab('notes')}
            className={`transition-colors whitespace-nowrap ${
              activeTab === 'notes'
                ? 'text-neutral-950 font-semibold border-b-2 border-neutral-950 -mb-[2px] pb-5 pt-5'
                : 'hover:text-neutral-900 pb-5 pt-5'
            }`}
          >
            My Notes
          </button>

          <button
            onClick={() => setActiveTab('marketplace')}
            className={`transition-colors whitespace-nowrap ${
              activeTab === 'marketplace'
                ? 'text-neutral-950 font-semibold border-b-2 border-neutral-950 -mb-[2px] pb-5 pt-5'
                : 'hover:text-neutral-900 pb-5 pt-5'
            }`}
          >
            Marketplace
          </button>

          <button
            onClick={() => setActiveTab('collaborate')}
            className={`transition-colors whitespace-nowrap ${
              activeTab === 'collaborate'
                ? 'text-neutral-950 font-semibold border-b-2 border-neutral-950 -mb-[2px] pb-5 pt-5'
                : 'hover:text-neutral-900 pb-5 pt-5'
            }`}
          >
            Study Groups
          </button>

          <button
            onClick={() => setActiveTab('wallet')}
            className={`transition-colors whitespace-nowrap ${
              activeTab === 'wallet'
                ? 'text-neutral-950 font-semibold border-b-2 border-neutral-950 -mb-[2px] pb-5 pt-5'
                : 'hover:text-neutral-900 pb-5 pt-5'
            }`}
          >
            P2P Wallet
          </button>

          <button
            onClick={() => setActiveTab('verification')}
            className={`transition-colors whitespace-nowrap ${
              activeTab === 'verification'
                ? 'text-neutral-950 font-semibold border-b-2 border-neutral-950 -mb-[2px] pb-5 pt-5'
                : 'hover:text-neutral-900 pb-5 pt-5'
            }`}
          >
            Verification
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action Area */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Quick Create Note */}
          <button
            onClick={() => createNote()}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors whitespace-nowrap"
            title="Create new note"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Note</span>
          </button>

          {/* Wallet Balance Action */}
          <button
            onClick={() => setIsWalletModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-800 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 rounded-lg transition-colors whitespace-nowrap"
            title="View P2P Wallet & Transactions"
          >
            <Wallet className="w-3.5 h-3.5 text-amber-700" />
            <span className="font-mono tabular-nums text-amber-900">${currentUser.walletBalance.toFixed(2)}</span>
          </button>

          {/* User Profile / Auth Button */}
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center gap-2 pl-2 pr-3 py-1 text-xs font-medium text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors border border-neutral-200"
            title="Switch Profile or Sign Out"
          >
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-6 h-6 rounded-full object-cover ring-1 ring-neutral-300"
            />
            <span className="hidden sm:inline-block max-w-[110px] truncate">{currentUser.name}</span>
            {currentUser.isVerified && (
              <span title="Verified Academic Creator">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
