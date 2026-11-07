import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  Send,
  PlusCircle,
  Building,
  CheckCircle,
  Clock,
  X,
  CreditCard,
  ShieldCheck
} from 'lucide-react';

export const WalletModal: React.FC = () => {
  const {
    currentUser,
    transactions,
    isWalletModalOpen,
    setIsWalletModalOpen,
    depositFunds,
    withdrawFunds,
    sendP2PPayment,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'balance' | 'send' | 'deposit' | 'withdraw'>('balance');
  const [depositAmount, setDepositAmount] = useState<number>(50);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(25);
  const [recipientHandle, setRecipientHandle] = useState('');
  const [transferAmount, setTransferAmount] = useState<number>(10);
  const [memo, setMemo] = useState('');
  const [actionMessage, setActionMessage] = useState<{ text: string; error?: boolean } | null>(null);

  if (!isWalletModalOpen) return null;

  const handleDeposit = () => {
    depositFunds(Number(depositAmount));
    setActionMessage({ text: `Successfully loaded $${depositAmount.toFixed(2)} to your NoteNest wallet!` });
    setTimeout(() => {
      setActionMessage(null);
      setActiveTab('balance');
    }, 1800);
  };

  const handleWithdraw = () => {
    const res = withdrawFunds(Number(withdrawAmount));
    if (res.success) {
      setActionMessage({ text: res.message });
      setTimeout(() => {
        setActionMessage(null);
        setActiveTab('balance');
      }, 1800);
    } else {
      setActionMessage({ text: res.message, error: true });
    }
  };

  const handleSendTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const res = sendP2PPayment(recipientHandle, Number(transferAmount), memo);
    if (res.success) {
      setActionMessage({ text: res.message });
      setRecipientHandle('');
      setMemo('');
      setTimeout(() => {
        setActionMessage(null);
        setActiveTab('balance');
      }, 1800);
    } else {
      setActionMessage({ text: res.message, error: true });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-neutral-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-bold">
              <Wallet className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900">Peer-to-Peer Educational Wallet</h2>
              <p className="text-xs text-neutral-500">Student balances, note earnings &amp; campus payouts</p>
            </div>
          </div>

          <button
            onClick={() => setIsWalletModalOpen(false)}
            className="text-neutral-400 hover:text-neutral-700 p-1.5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-neutral-200 px-6 bg-white text-xs font-medium">
          <button
            onClick={() => setActiveTab('balance')}
            className={`py-3 mr-6 border-b-2 transition-colors ${
              activeTab === 'balance'
                ? 'border-neutral-900 text-neutral-900 font-semibold'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Ledger &amp; Balance
          </button>
          <button
            onClick={() => setActiveTab('send')}
            className={`py-3 mr-6 border-b-2 transition-colors ${
              activeTab === 'send'
                ? 'border-neutral-900 text-neutral-900 font-semibold'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Send P2P Transfer
          </button>
          <button
            onClick={() => setActiveTab('deposit')}
            className={`py-3 mr-6 border-b-2 transition-colors ${
              activeTab === 'deposit'
                ? 'border-neutral-900 text-neutral-900 font-semibold'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Add Funds
          </button>
          <button
            onClick={() => setActiveTab('withdraw')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'withdraw'
                ? 'border-neutral-900 text-neutral-900 font-semibold'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Withdraw Payout
          </button>
        </div>

        {/* Action feedback */}
        {actionMessage && (
          <div className={`mx-6 mt-4 p-3 rounded-xl text-xs font-medium border ${
            actionMessage.error
              ? 'bg-rose-50 text-rose-800 border-rose-200'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
          }`}>
            {actionMessage.text}
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: BALANCE & LEDGER */}
          {activeTab === 'balance' && (
            <div className="space-y-6">
              {/* Wallet Card */}
              <div className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white p-6 rounded-2xl shadow-md space-y-4">
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Verified Student Account · {currentUser.university}</span>
                  </div>
                  <span className="font-mono text-amber-300">NestCredits (USD)</span>
                </div>

                <div>
                  <div className="text-xs text-neutral-300">Available Balance</div>
                  <div className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-white mt-0.5">
                    ${currentUser.walletBalance.toFixed(2)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-neutral-700/60 text-xs">
                  <div>
                    <div className="text-neutral-400 text-[11px]">Total Notes Sold:</div>
                    <div className="font-semibold text-neutral-200 font-mono">
                      {currentUser.notesSoldCount} sales (${currentUser.totalEarnings.toFixed(2)} earned)
                    </div>
                  </div>
                  <div>
                    <div className="text-neutral-400 text-[11px]">Study Notes Unlocked:</div>
                    <div className="font-semibold text-neutral-200 font-mono">
                      {currentUser.notesBoughtCount} notes purchased
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => setActiveTab('send')}
                    className="flex-1 py-2 bg-white hover:bg-neutral-100 text-neutral-900 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1"
                  >
                    <Send className="w-3.5 h-3.5 text-neutral-800" />
                    <span>Send Payment</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('deposit')}
                    className="flex-1 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1 border border-neutral-700"
                  >
                    <PlusCircle className="w-3.5 h-3.5 text-amber-300" />
                    <span>Add Funds</span>
                  </button>
                </div>
              </div>

              {/* Transactions Ledger */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                    Recent P2P Transactions Ledger
                  </h4>
                  <span className="text-[11px] text-neutral-400 font-mono">Instant campus settlement</span>
                </div>

                <div className="divide-y divide-neutral-100 border border-neutral-200 rounded-xl overflow-hidden bg-white">
                  {transactions.map((tx) => {
                    const isIncome = ['sale', 'tip_received', 'deposit'].includes(tx.type);

                    return (
                      <div key={tx.id} className="p-3.5 flex items-center justify-between text-xs hover:bg-neutral-50/60 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold shrink-0 ${
                            isIncome ? 'bg-emerald-50 text-emerald-700' : 'bg-neutral-100 text-neutral-700'
                          }`}>
                            {isIncome ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                          </div>

                          <div>
                            <div className="font-semibold text-neutral-900 leading-snug">
                              {tx.description}
                            </div>
                            <div className="text-[10px] text-neutral-400 font-mono">
                              Ref: {tx.referenceId} · {tx.timestamp}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className={`font-mono font-bold text-xs ${
                            isIncome ? 'text-emerald-700' : 'text-neutral-900'
                          }`}>
                            {isIncome ? '+' : '-'}${tx.amount.toFixed(2)}
                          </div>
                          {tx.fee > 0 && (
                            <div className="text-[10px] text-neutral-400 font-mono">
                              Fee: ${tx.fee.toFixed(2)}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SEND P2P PAYMENT */}
          {activeTab === 'send' && (
            <form onSubmit={handleSendTransfer} className="space-y-4 text-xs">
              <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200">
                <div className="text-neutral-600">
                  Transfer funds directly to another verified student for notes, collaboration, or study tutoring.
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-800 mb-1">
                  Recipient Student Handle
                </label>
                <input
                  type="text"
                  value={recipientHandle}
                  onChange={(e) => setRecipientHandle(e.target.value)}
                  placeholder="@elena_mit or @jordan_berkeley"
                  className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 font-mono focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-800 mb-1">
                  Amount to Send ($ USD)
                </label>
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(parseFloat(e.target.value))}
                  className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 font-mono focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-800 mb-1">
                  Transfer Note / Reason
                </label>
                <input
                  type="text"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  placeholder="e.g. Study guide collaboration for Finals"
                  className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex justify-between">
                <span>Available Balance:</span>
                <span className="font-mono font-bold text-neutral-900">${currentUser.walletBalance.toFixed(2)}</span>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4 text-amber-300" />
                <span>Confirm Peer Transfer</span>
              </button>
            </form>
          )}

          {/* TAB 3: ADD FUNDS */}
          {activeTab === 'deposit' && (
            <div className="space-y-4 text-xs">
              <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 text-neutral-600">
                Top up your student account balance instantly via linked campus card, Apple Pay, or credit card.
              </div>

              <div>
                <label className="block font-semibold text-neutral-800 mb-2">
                  Select Deposit Amount
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[25, 50, 100].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setDepositAmount(amt)}
                      className={`py-3 rounded-xl border font-mono font-bold text-sm transition-all ${
                        depositAmount === amt
                          ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                          : 'bg-white hover:bg-neutral-50 text-neutral-800 border-neutral-200'
                      }`}
                    >
                      ${amt}.00
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-800 mb-1">
                  Payment Method
                </label>
                <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-neutral-700" />
                  <div className="flex-1">
                    <div className="font-semibold text-neutral-900">Student Debit Card (Ending in 4021)</div>
                    <div className="text-[10px] text-neutral-500">Zero deposit fees · Instant credit</div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleDeposit}
                className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4 text-amber-300" />
                <span>Load ${depositAmount.toFixed(2)} to Wallet</span>
              </button>
            </div>
          )}

          {/* TAB 4: WITHDRAW */}
          {activeTab === 'withdraw' && (
            <div className="space-y-4 text-xs">
              <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 text-neutral-600">
                Withdraw earnings from your notes sales directly to your linked student bank account.
              </div>

              <div>
                <div className="flex justify-between font-semibold text-neutral-800 mb-1">
                  <span>Withdrawal Amount</span>
                  <span className="font-mono text-neutral-500">Max: ${currentUser.walletBalance.toFixed(2)}</span>
                </div>
                <input
                  type="number"
                  min="5"
                  max={currentUser.walletBalance}
                  step="1"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(parseFloat(e.target.value))}
                  className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 font-mono focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-800 mb-1">
                  Destination Bank
                </label>
                <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg flex items-center gap-3">
                  <Building className="w-5 h-5 text-neutral-700" />
                  <div className="flex-1">
                    <div className="font-semibold text-neutral-900">Chase Student Checking (...8920)</div>
                    <div className="text-[10px] text-neutral-500">ACH Direct Deposit · Arrives instantly</div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleWithdraw}
                disabled={currentUser.walletBalance < withdrawAmount || withdrawAmount <= 0}
                className={`w-full py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                  currentUser.walletBalance < withdrawAmount || withdrawAmount <= 0
                    ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                    : 'bg-neutral-900 hover:bg-neutral-800 text-white'
                }`}
              >
                <span>Payout ${withdrawAmount.toFixed(2)}</span>
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
