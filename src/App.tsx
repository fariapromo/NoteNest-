/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { NoteList } from './components/NoteList';
import { NoteEditor } from './components/NoteEditor';
import { Marketplace } from './components/Marketplace';
import { CollaborationView } from './components/CollaborationView';
import { PurchaseModal } from './components/PurchaseModal';
import { WalletModal } from './components/WalletModal';
import { VerificationModal } from './components/VerificationModal';
import { AuthModal } from './components/AuthModal';
import { NewFolderModal } from './components/NewFolderModal';
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineIndicator } from './components/OfflineIndicator';

function AppContent() {
  const { activeTab, setIsWalletModalOpen, setIsVerificationModalOpen } = useApp();

  return (
    <div className="min-h-screen bg-neutral-100/60 text-neutral-900 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* PWA Install Banner */}
      <PWAInstallButton variant="banner" />

      {/* Main Top Header */}
      <Header />

      {/* Main View Area */}
      <main className="flex-1 flex overflow-hidden">
        {activeTab === 'notes' && (
          <div className="flex-1 flex w-full overflow-hidden">
            <Sidebar />
            <NoteList />
            <NoteEditor />
          </div>
        )}

        {activeTab === 'marketplace' && <Marketplace />}

        {activeTab === 'collaborate' && <CollaborationView />}

        {activeTab === 'wallet' && (
          <div className="flex-1 flex items-center justify-center p-8 bg-neutral-50">
            <div className="bg-white p-8 rounded-2xl border border-neutral-200 max-w-lg w-full text-center space-y-4 shadow-sm">
              <h2 className="text-xl font-bold text-neutral-900">P2P Educational Wallet</h2>
              <p className="text-xs text-neutral-600">
                Manage your student earnings, send peer payments, deposit funds, or withdraw to your bank account.
              </p>
              <button
                onClick={() => setIsWalletModalOpen(true)}
                className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs rounded-lg transition-colors"
              >
                Open Full Wallet &amp; Ledger
              </button>
            </div>
          </div>
        )}

        {activeTab === 'verification' && (
          <div className="flex-1 flex items-center justify-center p-8 bg-neutral-50">
            <div className="bg-white p-8 rounded-2xl border border-neutral-200 max-w-lg w-full text-center space-y-4 shadow-sm">
              <h2 className="text-xl font-bold text-neutral-900">Verified Educational Content Portal</h2>
              <p className="text-xs text-neutral-600">
                Get certified as an A+ Student, Course TA, or Academic Peer to earn more and build academic trust.
              </p>
              <button
                onClick={() => setIsVerificationModalOpen(true)}
                className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs rounded-lg transition-colors"
              >
                Apply for Verification Badge
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Global Modals */}
      <PurchaseModal />
      <WalletModal />
      <VerificationModal />
      <AuthModal />
      <NewFolderModal />

      {/* Offline Status Alert */}
      <OfflineIndicator />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
