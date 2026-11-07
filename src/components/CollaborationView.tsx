import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  Share2,
  MessageSquare,
  BookOpen,
  DollarSign,
  Sparkles,
  Link as LinkIcon,
  Check,
  Send,
  Star,
  ShieldCheck,
  Copy
} from 'lucide-react';

export const CollaborationView: React.FC = () => {
  const {
    notes,
    currentUser,
    setSelectedNoteId,
    setActiveTab,
    sendP2PPayment,
    addStudyComment,
  } = useApp();

  const [activeNoteId, setActiveNoteId] = useState<string>(notes[0]?.id || '');
  const [copiedLink, setCopiedLink] = useState(false);
  const [peerHandleToTip, setPeerHandleToTip] = useState('');
  const [tipAmount, setTipAmount] = useState<number>(3.00);
  const [tipMemo, setTipMemo] = useState('Thanks for explaining the problem set!');
  const [tipStatus, setTipStatus] = useState<string | null>(null);

  const activeNote = notes.find(n => n.id === activeNoteId);
  const collaborativeNotes = notes.filter(n => n.isCollaborative || n.comments.length > 0);

  const handleCopyShareLink = () => {
    if (!activeNote) return;
    navigator.clipboard.writeText(`https://notenest.edu/study/${activeNote.courseCode.toLowerCase()}/${activeNote.id}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSendTip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!peerHandleToTip) return;

    const res = sendP2PPayment(peerHandleToTip, Number(tipAmount), tipMemo);
    setTipStatus(res.message);
    setTimeout(() => setTipStatus(null), 4000);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-neutral-50/70 p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">
              <Users className="w-4 h-4 text-cyan-600" />
              <span>Academic Collaboration &amp; Peer Groups</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900">
              Study Groups &amp; Peer Exchange
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">
              Collaborate on lecture notes, annotate complex proofs together, and send direct P2P study tips.
            </p>
          </div>

          <button
            onClick={handleCopyShareLink}
            className="flex items-center gap-2 px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg transition-colors shadow-2xs self-start sm:self-auto"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-amber-300" />}
            <span>{copiedLink ? 'Invite Link Copied!' : 'Share Study Room Link'}</span>
          </button>
        </div>

        {/* 2-Column Split: Shared Notes & Discussion on Left, Peer P2P Tipping on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left 2 Cols: Collaborative Notes & Active Discussion */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Note Selector Tabs */}
            <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                Select Active Collaboration Note
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {collaborativeNotes.map(n => (
                  <div
                    key={n.id}
                    onClick={() => setActiveNoteId(n.id)}
                    className={`p-3 rounded-lg border text-xs cursor-pointer transition-colors ${
                      activeNoteId === n.id
                        ? 'bg-neutral-900 text-white border-neutral-900'
                        : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-800 border-neutral-200'
                    }`}
                  >
                    <div className="font-mono text-[10px] opacity-75">{n.courseCode} · {n.authorUniversity}</div>
                    <div className="font-semibold truncate mt-0.5">{n.title}</div>
                    <div className="flex items-center gap-2 mt-2 text-[10px] opacity-80">
                      <span>{n.comments.length} comments</span>
                      <span>·</span>
                      <span>By {n.authorName}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Note Discussion & Margin Comments Thread */}
            {activeNote && (
              <div className="bg-white rounded-xl border border-neutral-200 p-5 space-y-5 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <div className="min-w-0 pr-2">
                    <div className="text-[11px] font-mono text-neutral-500">{activeNote.courseCode} Master Thread</div>
                    <h2 className="text-base font-bold text-neutral-900 truncate">{activeNote.title}</h2>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedNoteId(activeNote.id);
                      setActiveTab('notes');
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg transition-colors shrink-0"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Open in Editor</span>
                  </button>
                </div>

                {/* Collaborative comments stream */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {activeNote.comments && activeNote.comments.length > 0 ? (
                    activeNote.comments.map((comm) => (
                      <div key={comm.id} className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img
                              src={comm.userAvatar}
                              alt={comm.userName}
                              className="w-5 h-5 rounded-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <span className="font-semibold text-neutral-900">{comm.userName}</span>
                            <span className="text-neutral-400 font-mono text-[11px]">{comm.userHandle}</span>
                          </div>
                          <span className="text-[11px] text-neutral-400">{comm.timestamp}</span>
                        </div>

                        {comm.highlightedText && (
                          <div className="p-2 bg-amber-50 text-amber-900 text-[11px] font-mono border-l-2 border-amber-400 rounded-r">
                            &quot;{comm.highlightedText}&quot;
                          </div>
                        )}

                        <p className="text-neutral-700 leading-relaxed">{comm.text}</p>

                        <div className="flex items-center justify-between pt-1 text-[11px] text-neutral-500">
                          <button
                            onClick={() => {
                              setPeerHandleToTip(comm.userHandle);
                              setTipMemo(`Tip for helpful comment on ${activeNote.courseCode}`);
                            }}
                            className="text-amber-700 hover:text-amber-900 font-medium flex items-center gap-1"
                          >
                            <DollarSign className="w-3 h-3" />
                            <span>Tip Peer for this clarification</span>
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-xs text-neutral-500 border border-dashed border-neutral-200 rounded-xl">
                      No peer annotations on this note yet.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Col: Instant Peer-to-Peer Tipping / Academic Grant Box */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">Send P2P Study Tip</h3>
                  <p className="text-[11px] text-neutral-500">Reward classmates for exam help &amp; notes</p>
                </div>
              </div>

              <form onSubmit={handleSendTip} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Student Handle
                  </label>
                  <input
                    type="text"
                    value={peerHandleToTip}
                    onChange={(e) => setPeerHandleToTip(e.target.value)}
                    placeholder="@elena_mit, @marcus_stanford..."
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono"
                    required
                  />
                  <div className="flex gap-1.5 pt-1.5">
                    {['@elena_mit', '@marcus_stanford', '@jordan_berkeley'].map(h => (
                      <button
                        type="button"
                        key={h}
                        onClick={() => setPeerHandleToTip(h)}
                        className="text-[10px] bg-neutral-100 hover:bg-neutral-200 text-neutral-600 px-2 py-0.5 rounded font-mono"
                      >
                        {h}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Tip Amount (USD)
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[1.00, 3.00, 5.00, 10.00].map(amt => (
                      <button
                        type="button"
                        key={amt}
                        onClick={() => setTipAmount(amt)}
                        className={`py-1.5 rounded-lg font-mono font-semibold transition-colors ${
                          tipAmount === amt
                            ? 'bg-neutral-900 text-white'
                            : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                        }`}
                      >
                        ${amt.toFixed(2)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Study Memo / Appreciation Note
                  </label>
                  <textarea
                    value={tipMemo}
                    onChange={(e) => setTipMemo(e.target.value)}
                    rows={2}
                    placeholder="Thanks for the exam review session!"
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>

                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-[11px] text-neutral-600 flex justify-between">
                  <span>Your Current Balance:</span>
                  <span className="font-mono font-bold text-neutral-900">${currentUser.walletBalance.toFixed(2)}</span>
                </div>

                {tipStatus && (
                  <div className="p-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-medium">
                    {tipStatus}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <DollarSign className="w-3.5 h-3.5 text-amber-300" />
                  <span>Transfer Tip Instantly</span>
                </button>
              </form>
            </div>

            {/* Academic Honor Code Notice */}
            <div className="bg-white rounded-xl border border-neutral-200 p-4 space-y-2 text-xs text-neutral-600">
              <div className="font-semibold text-neutral-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Academic Honor Code Policy</span>
              </div>
              <p className="text-[11px] text-neutral-500 leading-relaxed">
                NoteNest promotes original student synthesis, conceptual study guides, and peer tutoring. Uploading direct test question answers or copyrighted university exams without permission is strictly prohibited.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
