import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Note, Flashcard } from '../types';
import {
  Save,
  Trash2,
  Share2,
  DollarSign,
  ShieldCheck,
  CheckSquare,
  Sparkles,
  BookOpen,
  Code,
  Tag,
  Folder as FolderIcon,
  HelpCircle,
  Plus,
  MessageSquare,
  Send,
  Eye,
  FileText
} from 'lucide-react';

export const NoteEditor: React.FC = () => {
  const {
    notes,
    folders,
    selectedNoteId,
    updateNote,
    deleteNote,
    currentUser,
    userPurchasedNoteIds,
    addStudyComment,
    addNoteReview,
    toggleChecklistItem,
  } = useApp();

  const note = notes.find(n => n.id === selectedNoteId);

  // If no note selected, return empty placeholder
  if (!note) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-neutral-50/50 text-neutral-400">
        <BookOpen className="w-12 h-12 stroke-1 text-neutral-300 mb-3" />
        <p className="text-sm font-medium text-neutral-600">Select a note or create a new one to begin</p>
        <p className="text-xs text-neutral-400 mt-1">Organize in searchable folders, take rich notes, or list for sale.</p>
      </div>
    );
  }

  const isOwner = note.authorId === currentUser.id;
  const isPurchased = userPurchasedNoteIds.includes(note.id);
  const isReadOnly = !isOwner;

  const [activeSubTab, setActiveSubTab] = useState<'content' | 'flashcards' | 'checklist' | 'sell' | 'collaborate'>('content');
  const [commentInput, setCommentInput] = useState('');
  const [newFlashcardQ, setNewFlashcardQ] = useState('');
  const [newFlashcardA, setNewFlashcardA] = useState('');
  const [newChecklistTask, setNewChecklistTask] = useState('');
  const [newTakeaway, setNewTakeaway] = useState('');
  const [flippedCardId, setFlippedCardId] = useState<string | null>(null);

  // Note fields state for immediate editing
  const handleTitleChange = (val: string) => {
    updateNote({ ...note, title: val });
  };

  const handleContentChange = (val: string) => {
    updateNote({ ...note, content: val });
  };

  const handleFolderChange = (folderId: string) => {
    const f = folders.find(fld => fld.id === folderId);
    updateNote({
      ...note,
      folderId,
      courseCode: f?.courseCode || note.courseCode,
      courseName: f?.name || note.courseName,
    });
  };

  const handleAddFlashcard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFlashcardQ.trim() || !newFlashcardA.trim()) return;

    const newCard: Flashcard = {
      id: `fc_${Date.now()}`,
      question: newFlashcardQ.trim(),
      answer: newFlashcardA.trim(),
    };

    updateNote({
      ...note,
      flashcards: [...(note.flashcards || []), newCard],
    });
    setNewFlashcardQ('');
    setNewFlashcardA('');
  };

  const handleRemoveFlashcard = (id: string) => {
    updateNote({
      ...note,
      flashcards: note.flashcards.filter(f => f.id !== id),
    });
  };

  const handleAddChecklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChecklistTask.trim()) return;

    updateNote({
      ...note,
      revisionChecklist: [...(note.revisionChecklist || []), { task: newChecklistTask.trim(), completed: false }],
    });
    setNewChecklistTask('');
  };

  const handleAddTakeaway = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTakeaway.trim()) return;

    updateNote({
      ...note,
      keyTakeaways: [...(note.keyTakeaways || []), newTakeaway.trim()],
    });
    setNewTakeaway('');
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    addStudyComment(note.id, commentInput.trim());
    setCommentInput('');
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] bg-white overflow-hidden">
      
      {/* Editor Sub-Header Toolbar */}
      <div className="px-6 py-3 border-b border-neutral-200 bg-neutral-50/50 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          {/* Folder Selector */}
          <div className="flex items-center gap-1.5 text-xs text-neutral-600">
            <FolderIcon className="w-3.5 h-3.5 text-neutral-400" />
            <select
              disabled={isReadOnly}
              value={note.folderId}
              onChange={(e) => handleFolderChange(e.target.value)}
              className="bg-transparent font-medium text-neutral-800 focus:outline-none cursor-pointer"
            >
              {folders.map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>

          <span className="text-neutral-300">|</span>

          {/* Course Code input */}
          <input
            type="text"
            disabled={isReadOnly}
            value={note.courseCode}
            onChange={(e) => updateNote({ ...note, courseCode: e.target.value })}
            placeholder="Course Code (e.g. CS 161)"
            className="text-xs font-mono font-medium text-neutral-700 bg-transparent border-b border-dashed border-neutral-300 focus:border-neutral-900 focus:outline-none w-24"
          />

          {note.isVerifiedContent && (
            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{note.verificationType || 'Verified'}</span>
            </span>
          )}
        </div>

        {/* View mode switches */}
        <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-lg text-xs">
          <button
            onClick={() => setActiveSubTab('content')}
            className={`px-3 py-1 font-medium rounded-md transition-colors ${
              activeSubTab === 'content' ? 'bg-white text-neutral-900 shadow-2xs font-semibold' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Notes &amp; Formulas
          </button>
          <button
            onClick={() => setActiveSubTab('flashcards')}
            className={`px-3 py-1 font-medium rounded-md transition-colors ${
              activeSubTab === 'flashcards' ? 'bg-white text-neutral-900 shadow-2xs font-semibold' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Flashcards ({note.flashcards?.length || 0})
          </button>
          <button
            onClick={() => setActiveSubTab('checklist')}
            className={`px-3 py-1 font-medium rounded-md transition-colors ${
              activeSubTab === 'checklist' ? 'bg-white text-neutral-900 shadow-2xs font-semibold' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Checklist
          </button>
          <button
            onClick={() => setActiveSubTab('collaborate')}
            className={`px-3 py-1 font-medium rounded-md transition-colors ${
              activeSubTab === 'collaborate' ? 'bg-white text-neutral-900 shadow-2xs font-semibold' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Study Discussion ({note.comments?.length || 0})
          </button>
          {isOwner && (
            <button
              onClick={() => setActiveSubTab('sell')}
              className={`px-3 py-1 font-medium rounded-md transition-colors ${
                activeSubTab === 'sell'
                  ? 'bg-amber-100 text-amber-900 shadow-2xs font-semibold'
                  : 'text-amber-800 hover:text-amber-950'
              }`}
            >
              {note.isForSale ? `Selling ($${note.price.toFixed(2)})` : 'Monetize Note'}
            </button>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {isOwner && (
            <button
              onClick={() => {
                if (confirm('Delete this note permanently?')) {
                  deleteNote(note.id);
                }
              }}
              className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-neutral-100 rounded-lg transition-colors"
              title="Delete note"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Note Canvas */}
      <div className="flex-1 overflow-y-auto p-6 max-w-4xl w-full mx-auto space-y-6">
        
        {/* Sub-tab 1: Notes & Content */}
        {activeSubTab === 'content' && (
          <div className="space-y-6">
            {/* Note Title Input */}
            <div>
              <input
                type="text"
                disabled={isReadOnly}
                value={note.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter Note Title (e.g. Graph Algorithms Master Summary)..."
                className="w-full text-2xl sm:text-3xl font-extrabold text-neutral-900 placeholder:text-neutral-300 focus:outline-none border-b border-transparent focus:border-neutral-300 pb-2 transition-colors"
              />
            </div>

            {/* Author Credit for purchased notes */}
            {isReadOnly && (
              <div className="flex items-center gap-2 p-2.5 bg-neutral-50 rounded-lg border border-neutral-200 text-xs text-neutral-600">
                <img src={note.authorAvatar} alt="" className="w-5 h-5 rounded-full" referrerPolicy="no-referrer" />
                <span>
                  Author: <strong>{note.authorName}</strong> ({note.authorHandle}) · {note.authorUniversity}
                </span>
                {note.isVerifiedContent && (
                  <span className="text-emerald-700 font-medium ml-auto">
                    ✓ Verified Educational Content
                  </span>
                )}
              </div>
            )}

            {/* Key Takeaways Section */}
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-amber-900">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Key Exam &amp; Study Takeaways</span>
                </div>
              </div>

              <ul className="space-y-1.5 text-xs text-neutral-800">
                {note.keyTakeaways?.map((t, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold shrink-0 mt-0.5">•</span>
                    <span className="flex-1">{t}</span>
                    {isOwner && (
                      <button
                        onClick={() => {
                          updateNote({
                            ...note,
                            keyTakeaways: note.keyTakeaways.filter((_, i) => i !== idx),
                          });
                        }}
                        className="text-neutral-400 hover:text-rose-600"
                      >
                        ×
                      </button>
                    )}
                  </li>
                ))}
              </ul>

              {isOwner && (
                <form onSubmit={handleAddTakeaway} className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={newTakeaway}
                    onChange={(e) => setNewTakeaway(e.target.value)}
                    placeholder="Add high-yield exam bullet point..."
                    className="flex-1 px-3 py-1.5 text-xs bg-white border border-amber-200 rounded-lg text-neutral-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium rounded-lg transition-colors"
                  >
                    Add
                  </button>
                </form>
              )}
            </div>

            {/* Markdown / Note Text Area */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span>Supports Markdown, LaTeX formulas ($$ \\Delta G = \\Delta H - T\\Delta S $$), and code blocks</span>
                <span className="font-mono">{note.content.length} characters</span>
              </div>

              {isOwner ? (
                <textarea
                  value={note.content}
                  onChange={(e) => handleContentChange(e.target.value)}
                  placeholder="Write your study notes, derivations, code and explanations..."
                  rows={20}
                  className="w-full p-4 text-xs sm:text-sm font-mono leading-relaxed bg-neutral-50/60 hover:bg-neutral-50 focus:bg-white border border-neutral-200 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-400 transition-all"
                />
              ) : (
                <div className="p-5 bg-neutral-50 border border-neutral-200 rounded-xl font-mono text-xs sm:text-sm leading-relaxed text-neutral-900 whitespace-pre-wrap">
                  {note.content}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sub-tab 2: Flashcards Study Mode */}
        {activeSubTab === 'flashcards' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-neutral-900">Study Flashcard Deck</h3>
                <p className="text-xs text-neutral-500">Click any card to flip between Question and Answer</p>
              </div>
            </div>

            {/* Flashcard list / grid */}
            {note.flashcards && note.flashcards.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {note.flashcards.map((card) => {
                  const isFlipped = flippedCardId === card.id;

                  return (
                    <div
                      key={card.id}
                      onClick={() => setFlippedCardId(isFlipped ? null : card.id)}
                      className={`min-h-[160px] p-5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between shadow-xs select-none ${
                        isFlipped
                          ? 'bg-neutral-900 text-white border-neutral-900'
                          : 'bg-white hover:bg-neutral-50 text-neutral-900 border-neutral-200'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                          <span>{isFlipped ? 'Answer' : 'Question'}</span>
                          <span>Click to flip</span>
                        </div>
                        <div className={`text-xs sm:text-sm font-medium leading-relaxed ${isFlipped ? 'text-neutral-100 font-mono' : 'text-neutral-900'}`}>
                          {isFlipped ? card.answer : card.question}
                        </div>
                      </div>

                      {isOwner && (
                        <div className="flex justify-end pt-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFlashcard(card.id);
                            }}
                            className="text-[11px] text-neutral-400 hover:text-rose-500"
                          >
                            Delete Card
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 border border-dashed border-neutral-300 rounded-xl text-center text-xs text-neutral-500">
                No flashcards created for this note yet.
              </div>
            )}

            {/* Add flashcard form */}
            {isOwner && (
              <form onSubmit={handleAddFlashcard} className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 space-y-3 text-xs">
                <h4 className="font-semibold text-neutral-900">Add New Flashcard</h4>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={newFlashcardQ}
                    onChange={(e) => setNewFlashcardQ(e.target.value)}
                    placeholder="Question or Term (e.g. Why does Bellman-Ford require V-1 passes?)"
                    className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                  <textarea
                    value={newFlashcardA}
                    onChange={(e) => setNewFlashcardA(e.target.value)}
                    placeholder="Answer or Explanation..."
                    rows={2}
                    className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-medium rounded-lg transition-colors"
                >
                  Save Flashcard
                </button>
              </form>
            )}
          </div>
        )}

        {/* Sub-tab 3: Revision Checklist */}
        {activeSubTab === 'checklist' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-neutral-900">Exam Revision Checklist</h3>
              <p className="text-xs text-neutral-500">Track mastered proofs, problem sets, and topics</p>
            </div>

            <div className="space-y-2">
              {note.revisionChecklist?.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => toggleChecklistItem(note.id, idx)}
                  className="flex items-center gap-3 p-3 bg-neutral-50 hover:bg-neutral-100 rounded-xl border border-neutral-200 cursor-pointer transition-colors text-xs"
                >
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => {}}
                    className="rounded border-neutral-300 text-neutral-900 w-4 h-4"
                  />
                  <span className={`flex-1 ${item.completed ? 'line-through text-neutral-400' : 'text-neutral-800 font-medium'}`}>
                    {item.task}
                  </span>
                </div>
              ))}
            </div>

            {isOwner && (
              <form onSubmit={handleAddChecklist} className="flex gap-2 text-xs">
                <input
                  type="text"
                  value={newChecklistTask}
                  onChange={(e) => setNewChecklistTask(e.target.value)}
                  placeholder="Add exam study milestone (e.g. Solve 2025 Midterm Question 4)..."
                  className="flex-1 px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-neutral-900 text-white font-medium rounded-lg hover:bg-neutral-800 transition-colors"
                >
                  Add Milestone
                </button>
              </form>
            )}
          </div>
        )}

        {/* Sub-tab 4: Monetize & Sell Note */}
        {activeSubTab === 'sell' && isOwner && (
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <div>
                <h3 className="text-base font-bold text-neutral-900">Marketplace Monetization</h3>
                <p className="text-xs text-neutral-500">Allow university peers to purchase your study notes</p>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={note.isForSale}
                  onChange={(e) => updateNote({ ...note, isForSale: e.target.checked })}
                  className="rounded border-neutral-300 text-neutral-900 w-4 h-4"
                />
                <span className="text-xs font-semibold text-neutral-800">
                  {note.isForSale ? 'Listed for Sale' : 'Private / Unlisted'}
                </span>
              </label>
            </div>

            {note.isForSale && (
              <div className="space-y-5 text-xs">
                {/* Price */}
                <div>
                  <div className="flex items-center justify-between font-semibold text-neutral-800 mb-1">
                    <span>Listing Price (USD)</span>
                    <span className="font-mono text-emerald-700 text-sm font-bold">${note.price.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="0.5"
                    value={note.price}
                    onChange={(e) => updateNote({ ...note, price: parseFloat(e.target.value) })}
                    className="w-full accent-neutral-900 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-400 pt-1">
                    <span>Free ($0.00)</span>
                    <span>$5.00</span>
                    <span>$10.00</span>
                    <span>$20.00</span>
                  </div>
                </div>

                {/* Free Preview threshold */}
                <div>
                  <div className="flex items-center justify-between font-semibold text-neutral-800 mb-1">
                    <span>Free Preview Readability</span>
                    <span className="font-mono">{note.previewPercent}% free sample</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="70"
                    step="5"
                    value={note.previewPercent}
                    onChange={(e) => updateNote({ ...note, previewPercent: parseInt(e.target.value) })}
                    className="w-full accent-neutral-900 cursor-pointer"
                  />
                </div>

                {/* Verification badge */}
                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">
                    Verification Badge Claim
                  </label>
                  <select
                    value={note.verificationType || 'A+ Grade Verified'}
                    onChange={(e) => updateNote({ ...note, verificationType: e.target.value as any, isVerifiedContent: true })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900"
                  >
                    <option value="A+ Grade Verified">A+ Grade Verified (Scored 90%+ in course)</option>
                    <option value="TA Approved">TA Approved (Official Teaching Assistant)</option>
                    <option value="Syllabus Aligned">Syllabus Aligned (Verified against current syllabus)</option>
                  </select>
                </div>

                {/* Earnings card */}
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1.5 text-emerald-950">
                  <div className="font-semibold text-xs">P2P Payout Calculator</div>
                  <div className="flex justify-between text-xs">
                    <span>Gross Price:</span>
                    <span className="font-mono">${note.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-emerald-800">
                    <span>Platform &amp; Student Grant Pool (5%):</span>
                    <span className="font-mono">-${(note.price * 0.05).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-xs pt-1 border-t border-emerald-300">
                    <span>You Receive per Sale:</span>
                    <span className="font-mono text-emerald-700">${(note.price * 0.95).toFixed(2)}</span>
                  </div>
                </div>

                <div className="text-neutral-500 text-[11px]">
                  Total Sales: <strong className="text-neutral-800 font-mono">{note.salesCount}</strong> students have purchased this note.
                </div>
              </div>
            )}
          </div>
        )}

        {/* Sub-tab 5: Study Group Discussions & Comments */}
        {activeSubTab === 'collaborate' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-neutral-900">Academic Study Discussion</h3>
              <p className="text-xs text-neutral-500">Ask questions, clarify proof steps, or leave peer feedback</p>
            </div>

            {/* Comments list */}
            <div className="space-y-3">
              {note.comments && note.comments.length > 0 ? (
                note.comments.map((comment) => (
                  <div key={comment.id} className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={comment.userAvatar}
                          alt={comment.userName}
                          className="w-5 h-5 rounded-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span className="font-semibold text-neutral-900">{comment.userName}</span>
                        <span className="text-neutral-400 font-normal">{comment.userHandle}</span>
                      </div>
                      <span className="text-[11px] text-neutral-400">{comment.timestamp}</span>
                    </div>

                    {comment.highlightedText && (
                      <div className="p-2 bg-amber-50/80 border-l-2 border-amber-400 text-amber-900 font-mono text-[11px] rounded-r">
                        &quot;{comment.highlightedText}&quot;
                      </div>
                    )}

                    <p className="text-neutral-700 leading-relaxed">{comment.text}</p>

                    {comment.replies && comment.replies.length > 0 && (
                      <div className="pl-4 pt-2 border-l border-neutral-200 space-y-2">
                        {comment.replies.map(rep => (
                          <div key={rep.id} className="space-y-1">
                            <div className="flex items-center gap-1.5 font-medium text-neutral-900">
                              <span>{rep.userName}</span>
                              <span className="text-neutral-400 font-normal">{rep.timestamp}</span>
                            </div>
                            <p className="text-neutral-600">{rep.text}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-6 border border-dashed border-neutral-300 rounded-xl text-center text-xs text-neutral-500">
                  No discussion comments yet. Be the first to start a study discussion on this note!
                </div>
              )}
            </div>

            {/* Comment form */}
            <form onSubmit={handlePostComment} className="flex gap-2">
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Ask a question or comment on this lecture section..."
                className="flex-1 px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post</span>
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
