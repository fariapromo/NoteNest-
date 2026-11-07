import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Lock,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Wallet,
  ArrowRight,
  BookOpen,
  DollarSign,
  X
} from 'lucide-react';

export const PurchaseModal: React.FC = () => {
  const {
    checkoutNote,
    setCheckoutNote,
    currentUser,
    buyNote,
    depositFunds,
    setSelectedNoteId,
    setActiveTab,
  } = useApp();

  const [isProcessing, setIsProcessing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [txRef, setTxRef] = useState('');

  if (!checkoutNote) return null;

  const price = checkoutNote.price;
  const isFree = price === 0;
  const hasSufficientBalance = isFree || currentUser.walletBalance >= price;
  const balanceAfter = currentUser.walletBalance - price;

  const handleConfirmPurchase = async () => {
    setIsProcessing(true);
    setErrorMessage('');

    // Small delay to simulate blockchain / banking settlement
    await new Promise(r => setTimeout(r, 600));

    const result = buyNote(checkoutNote.id);
    setIsProcessing(false);

    if (result.success) {
      setPurchaseSuccess(true);
      setTxRef(`NN-TX-${Math.floor(100000 + Math.random() * 900000)}`);
    } else {
      setErrorMessage(result.message);
    }
  };

  const handleClose = () => {
    setCheckoutNote(null);
    setPurchaseSuccess(false);
    setErrorMessage('');
  };

  const handleOpenUnlockedNote = () => {
    const id = checkoutNote.id;
    handleClose();
    setSelectedNoteId(id);
    setActiveTab('notes');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-bold">
              <Lock className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900">
                {purchaseSuccess ? 'Purchase Confirmed' : 'Secure Note Checkout'}
              </h3>
              <p className="text-xs text-neutral-500">
                Peer-to-Peer Educational Transfer
              </p>
            </div>
          </div>
          <button onClick={handleClose} className="text-neutral-400 hover:text-neutral-700 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {purchaseSuccess ? (
          /* SUCCESS STATE */
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            
            <div className="space-y-1">
              <h4 className="text-lg font-bold text-neutral-900">Note Unlocked Successfully!</h4>
              <p className="text-xs text-neutral-600">
                Funds transferred securely to <span className="font-semibold text-neutral-900">{checkoutNote.authorHandle}</span>.
              </p>
            </div>

            <div className="bg-neutral-50 rounded-xl p-3.5 border border-neutral-200 text-xs text-neutral-600 space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span>Transaction Ref:</span>
                <span className="font-semibold text-neutral-800">{txRef}</span>
              </div>
              <div className="flex justify-between">
                <span>Amount Paid:</span>
                <span className="font-semibold text-emerald-700">${price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Access Status:</span>
                <span className="text-emerald-700 font-semibold">Lifetime Unlocked</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={handleOpenUnlockedNote}
                className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <BookOpen className="w-4 h-4 text-amber-300" />
                <span>Open &amp; Study Note Now</span>
              </button>
              <button
                onClick={handleClose}
                className="w-full py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-medium rounded-lg transition-colors"
              >
                Back to Marketplace
              </button>
            </div>
          </div>
        ) : (
          /* CHECKOUT FORM */
          <div className="space-y-4 text-xs">
            {/* Note Summary Card */}
            <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
              <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 font-mono">
                <span>{checkoutNote.courseCode}</span>
                <span>·</span>
                <span>{checkoutNote.authorUniversity}</span>
              </div>
              <h4 className="text-sm font-bold text-neutral-900 leading-snug">
                {checkoutNote.title}
              </h4>
              <div className="flex items-center justify-between text-neutral-600 pt-1">
                <div className="flex items-center gap-1.5">
                  <img
                    src={checkoutNote.authorAvatar}
                    alt={checkoutNote.authorName}
                    className="w-4 h-4 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span>Seller: {checkoutNote.authorName} ({checkoutNote.authorHandle})</span>
                </div>
                {checkoutNote.isVerifiedContent && (
                  <span className="text-emerald-700 font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{checkoutNote.verificationType || 'Verified'}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Payment & Balance breakdown */}
            <div className="bg-white border border-neutral-200 rounded-xl p-3.5 space-y-2">
              <div className="flex justify-between text-neutral-600">
                <span>Note Price:</span>
                <span className="font-mono font-bold text-neutral-900 text-sm">
                  {isFree ? 'Free ($0.00)' : `$${price.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-neutral-500 text-[11px]">
                <span>P2P Campus Grant Pool (5%):</span>
                <span>Included ($0.00 extra)</span>
              </div>
              <div className="flex justify-between text-neutral-600 pt-2 border-t border-neutral-100">
                <span className="flex items-center gap-1">
                  <Wallet className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Your NoteNest Balance:</span>
                </span>
                <span className="font-mono font-semibold text-neutral-900">
                  ${currentUser.walletBalance.toFixed(2)}
                </span>
              </div>

              {!hasSufficientBalance ? (
                <div className="pt-2 border-t border-rose-100 space-y-2">
                  <div className="flex items-center gap-1.5 text-rose-700 font-medium">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Insufficient funds. You need ${(price - currentUser.walletBalance).toFixed(2)} more.</span>
                  </div>
                  <button
                    onClick={() => depositFunds(25.00)}
                    className="w-full py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>Instant Reload: Add $25.00 to Wallet</span>
                  </button>
                </div>
              ) : (
                <div className="flex justify-between text-neutral-500 text-[11px] pt-1">
                  <span>Balance after purchase:</span>
                  <span className="font-mono">${balanceAfter.toFixed(2)}</span>
                </div>
              )}
            </div>

            {/* Error banner if any */}
            {errorMessage && (
              <div className="p-2.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs">
                {errorMessage}
              </div>
            )}

            {/* Academic Guarantee & Safety Seal */}
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-neutral-500 text-[11px] space-y-1">
              <div className="font-semibold text-neutral-800 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>48-Hour Peer Satisfaction Guarantee</span>
              </div>
              <p>
                Funds are held in escrow. If notes do not match the course syllabus or contain inaccurate formulas, request an instant one-click peer refund within 48 hours.
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleClose}
                className="flex-1 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>

              <button
                disabled={!hasSufficientBalance || isProcessing}
                onClick={handleConfirmPurchase}
                className={`flex-1 py-2.5 rounded-lg font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-sm ${
                  !hasSufficientBalance || isProcessing
                    ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                    : 'bg-neutral-900 hover:bg-neutral-800 text-white'
                }`}
              >
                {isProcessing ? (
                  <span>Securing Transaction...</span>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 text-amber-300" />
                    <span>Confirm &amp; Unlock</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
