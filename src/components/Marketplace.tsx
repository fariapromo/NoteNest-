import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Note } from '../types';
import {
  Search,
  ShieldCheck,
  Star,
  BookOpen,
  DollarSign,
  TrendingUp,
  Tag,
  CheckCircle2,
  Lock,
  Eye,
  Sparkles,
  ArrowRight,
  Filter,
  GraduationCap
} from 'lucide-react';

export const Marketplace: React.FC = () => {
  const {
    notes,
    currentUser,
    userPurchasedNoteIds,
    setCheckoutNote,
    setSelectedNoteId,
    setActiveTab,
    createNote,
  } = useApp();

  const [marketSearch, setMarketSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedUniversity, setSelectedUniversity] = useState<string>('All');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'under5' | 'under10'>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'sales' | 'newest' | 'price_asc'>('rating');
  const [previewNote, setPreviewNote] = useState<Note | null>(null);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);

  // Available universities
  const universities = useMemo(() => {
    const list = Array.from(new Set(notes.map(n => n.authorUniversity).filter(Boolean)));
    return ['All', ...list];
  }, [notes]);

  const subjects = ['All', 'Computer Science', 'Biology', 'Economics', 'Chemistry', 'Mathematics'];

  // Notes available in marketplace (notes flagged for sale or with price or public)
  const marketplaceNotes = useMemo(() => {
    return notes.filter(n => {
      // Must be flagged for sale or have public pricing
      if (!n.isForSale && n.price === 0 && n.authorId === currentUser.id) return false;

      // Text search
      if (marketSearch.trim()) {
        const query = marketSearch.toLowerCase();
        const matchesTitle = n.title.toLowerCase().includes(query);
        const matchesCourse = n.courseCode.toLowerCase().includes(query) || n.courseName.toLowerCase().includes(query);
        const matchesAuthor = n.authorName.toLowerCase().includes(query) || n.authorHandle.toLowerCase().includes(query);
        const matchesTags = n.tags.some(t => t.toLowerCase().includes(query));
        const matchesUni = n.authorUniversity.toLowerCase().includes(query);
        if (!matchesTitle && !matchesCourse && !matchesAuthor && !matchesTags && !matchesUni) {
          return false;
        }
      }

      // Subject filter
      if (selectedSubject !== 'All' && n.subject !== selectedSubject) {
        return false;
      }

      // University filter
      if (selectedUniversity !== 'All' && n.authorUniversity !== selectedUniversity) {
        return false;
      }

      // Verified only
      if (verifiedOnly && !n.isVerifiedContent) {
        return false;
      }

      // Price filter
      if (priceFilter === 'free' && n.price > 0) return false;
      if (priceFilter === 'under5' && (n.price === 0 || n.price > 5)) return false;
      if (priceFilter === 'under10' && (n.price === 0 || n.price > 10)) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'sales') return b.salesCount - a.salesCount;
      if (sortBy === 'price_asc') return a.price - b.price;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [notes, marketSearch, selectedSubject, selectedUniversity, verifiedOnly, priceFilter, sortBy, currentUser.id]);

  const handleOpenNote = (note: Note) => {
    const isOwned = note.authorId === currentUser.id;
    const isPurchased = userPurchasedNoteIds.includes(note.id);
    const isFree = note.price === 0;

    if (isOwned || isPurchased || isFree) {
      setSelectedNoteId(note.id);
      setActiveTab('notes');
    } else {
      setPreviewNote(note);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-neutral-50/70 pb-16">
      {/* Marketplace Hero Banner */}
      <div className="relative bg-neutral-900 text-white overflow-hidden border-b border-neutral-800">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <img
            src="/src/assets/images/campus_library_hall_1794077808777.jpg"
            alt="Academic Library Study Hall"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs font-medium text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Peer-to-Peer Academic Knowledge Exchange</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white text-balance">
              Verified Course Notes & Study Guides from Top Scholars
            </h1>
            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-2xl">
              Buy top-scoring lecture notes, midterm cheat-sheets, and formula derivations. Or list your own notes to earn NestCredits with verified student badges.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsSellModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold text-xs sm:text-sm rounded-lg transition-colors shadow-sm"
              >
                <DollarSign className="w-4 h-4" />
                <span>List Your Notes for Sale</span>
              </button>
              <div className="text-xs text-neutral-400 flex items-center gap-2">
                <span>Earn 95% on every purchase</span>
                <span>·</span>
                <span>Instant P2P Payouts</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Search & Filter Strip */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-neutral-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={marketSearch}
                onChange={(e) => setMarketSearch(e.target.value)}
                placeholder="Search by course (e.g. CS 161, BIOL 701), topic, university, or author..."
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-neutral-50 hover:bg-neutral-100/60 focus:bg-white border border-neutral-200 rounded-lg text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-400 transition-all"
              />
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <select
                value={selectedUniversity}
                onChange={(e) => setSelectedUniversity(e.target.value)}
                className="px-3 py-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-900"
              >
                {universities.map(u => (
                  <option key={u} value={u}>{u === 'All' ? 'All Universities' : u}</option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-900"
              >
                <option value="rating">Highest Rated</option>
                <option value="sales">Most Popular</option>
                <option value="newest">Newest Listed</option>
                <option value="price_asc">Price: Low to High</option>
              </select>
            </div>
          </div>

          {/* Sub-Filters: Subjects & Verified Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-neutral-100 text-xs">
            {/* Subject Tabs */}
            <div className="flex flex-wrap items-center gap-1.5">
              {subjects.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubject(sub)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedSubject === sub
                      ? 'bg-neutral-900 text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>

            {/* Price & Verified filter controls */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg">
                <button
                  onClick={() => setPriceFilter('all')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                    priceFilter === 'all' ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-600'
                  }`}
                >
                  All Prices
                </button>
                <button
                  onClick={() => setPriceFilter('free')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                    priceFilter === 'free' ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-600'
                  }`}
                >
                  Free
                </button>
                <button
                  onClick={() => setPriceFilter('under5')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                    priceFilter === 'under5' ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-600'
                  }`}
                >
                  &lt; $5
                </button>
                <button
                  onClick={() => setPriceFilter('under10')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                    priceFilter === 'under10' ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-600'
                  }`}
                >
                  &lt; $10
                </button>
              </div>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 w-4 h-4"
                />
                <span className="flex items-center gap-1 font-medium text-neutral-700">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verified Only</span>
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Note Grid */}
        {marketplaceNotes.length === 0 ? (
          <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center max-w-md mx-auto space-y-3">
            <BookOpen className="w-10 h-10 text-neutral-300 mx-auto" />
            <h3 className="text-base font-semibold text-neutral-800">No matching study notes found</h3>
            <p className="text-xs text-neutral-500">
              Try adjusting your search criteria or subject filters, or list your own notes for this course.
            </p>
            <button
              onClick={() => {
                setMarketSearch('');
                setSelectedSubject('All');
                setSelectedUniversity('All');
                setVerifiedOnly(false);
                setPriceFilter('all');
              }}
              className="text-xs text-neutral-900 font-semibold underline underline-offset-4"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {marketplaceNotes.map((note) => {
              const isOwned = note.authorId === currentUser.id;
              const isPurchased = userPurchasedNoteIds.includes(note.id);
              const isFree = note.price === 0;

              return (
                <div
                  key={note.id}
                  className="bg-white rounded-xl border border-neutral-200 hover:border-neutral-300 hover:shadow-md transition-all flex flex-col overflow-hidden group"
                >
                  {/* Card Cover Art / Course Banner */}
                  <div className="h-32 bg-neutral-100 relative overflow-hidden">
                    {note.coverImage ? (
                      <img
                        src={note.coverImage}
                        alt={note.title}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full bg-linear-to-br from-neutral-800 to-neutral-900 flex items-center justify-center p-4">
                        <div className="text-center">
                          <span className="text-xs font-mono uppercase tracking-widest text-amber-300">
                            {note.courseCode}
                          </span>
                          <div className="text-sm font-bold text-white truncate max-w-xs">{note.subject}</div>
                        </div>
                      </div>
                    )}

                    {/* Price Tag Overlay */}
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs text-neutral-900 px-2.5 py-1 rounded-md text-xs font-bold shadow-xs">
                      {isFree ? (
                        <span className="text-emerald-700">Free</span>
                      ) : (
                        <span className="font-mono tabular-nums">${note.price.toFixed(2)}</span>
                      )}
                    </div>

                    {/* Course Code badge */}
                    <div className="absolute bottom-3 left-3 bg-neutral-900/80 backdrop-blur-xs text-white px-2 py-0.5 rounded text-[11px] font-mono">
                      {note.courseCode}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      {/* Unboxed Metadata Line */}
                      <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 truncate">
                        <span className="truncate">{note.authorUniversity}</span>
                        <span>·</span>
                        <span>{note.term}</span>
                        {note.isVerifiedContent && (
                          <>
                            <span>·</span>
                            <span className="text-emerald-700 font-medium flex items-center gap-0.5">
                              <ShieldCheck className="w-3 h-3" />
                              <span>{note.verificationType || 'Verified'}</span>
                            </span>
                          </>
                        )}
                      </div>

                      {/* Title */}
                      <h3
                        onClick={() => handleOpenNote(note)}
                        className="text-sm font-bold text-neutral-900 group-hover:text-amber-800 transition-colors line-clamp-2 cursor-pointer"
                      >
                        {note.title}
                      </h3>

                      {/* Key highlights snippet */}
                      {note.keyTakeaways && note.keyTakeaways.length > 0 && (
                        <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                          {note.keyTakeaways[0]}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3 pt-2 border-t border-neutral-100">
                      {/* Author & Rating row */}
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 min-w-0">
                          <img
                            src={note.authorAvatar}
                            alt={note.authorName}
                            className="w-5 h-5 rounded-full object-cover shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <span className="truncate text-neutral-700 font-medium">{note.authorName}</span>
                        </div>

                        <div className="flex items-center gap-1 shrink-0 text-amber-600 font-medium">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="font-mono tabular-nums">{note.rating.toFixed(2)}</span>
                          <span className="text-neutral-400 font-normal">({note.reviewsCount})</span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 pt-1">
                        {isOwned ? (
                          <button
                            onClick={() => {
                              setSelectedNoteId(note.id);
                              setActiveTab('notes');
                            }}
                            className="w-full py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Your Note · Open</span>
                          </button>
                        ) : isPurchased ? (
                          <button
                            onClick={() => {
                              setSelectedNoteId(note.id);
                              setActiveTab('notes');
                            }}
                            className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Unlocked · Read Note</span>
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => setPreviewNote(note)}
                              className="flex-1 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5 text-neutral-500" />
                              <span>Preview</span>
                            </button>

                            <button
                              onClick={() => setCheckoutNote(note)}
                              className="flex-1 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1 shadow-2xs"
                            >
                              {isFree ? (
                                <span>Get Free</span>
                              ) : (
                                <>
                                  <Lock className="w-3.5 h-3.5 text-amber-300" />
                                  <span>Buy ${note.price.toFixed(2)}</span>
                                </>
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Note Preview Modal */}
      {previewNote && (
        <NotePreviewModal
          note={previewNote}
          onClose={() => setPreviewNote(null)}
          onBuy={(n) => {
            setPreviewNote(null);
            setCheckoutNote(n);
          }}
        />
      )}

      {/* List For Sale Modal */}
      {isSellModalOpen && (
        <ListNoteForSaleModal
          onClose={() => setIsSellModalOpen(false)}
        />
      )}
    </div>
  );
};

// ==========================================
// PREVIEW MODAL
// ==========================================
interface PreviewModalProps {
  note: Note;
  onClose: () => void;
  onBuy: (note: Note) => void;
}

const NotePreviewModal: React.FC<PreviewModalProps> = ({ note, onClose, onBuy }) => {
  const { currentUser, userPurchasedNoteIds, setSelectedNoteId, setActiveTab } = useApp();
  const isPurchased = userPurchasedNoteIds.includes(note.id);
  const isOwned = note.authorId === currentUser.id;

  // Split content according to previewPercent
  const lines = note.content.split('\n');
  const previewLinesCount = Math.max(8, Math.floor(lines.length * (note.previewPercent / 100)));
  const previewText = lines.slice(0, previewLinesCount).join('\n');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-neutral-200 overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/70">
          <div>
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <span className="font-mono font-semibold text-neutral-800">{note.courseCode}</span>
              <span>·</span>
              <span>{note.authorUniversity}</span>
              <span>·</span>
              <span>{note.term}</span>
              {note.isVerifiedContent && (
                <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{note.verificationType}</span>
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold text-neutral-900 mt-1">{note.title}</h2>
          </div>

          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-700 p-1.5 rounded-lg text-lg">
            ✕
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Author Strip */}
          <div className="flex items-center justify-between p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/80">
            <div className="flex items-center gap-3">
              <img
                src={note.authorAvatar}
                alt={note.authorName}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-neutral-200"
                referrerPolicy="no-referrer"
              />
              <div>
                <div className="flex items-center gap-1.5 font-semibold text-xs text-neutral-900">
                  <span>{note.authorName}</span>
                  <span className="text-neutral-400 font-normal">{note.authorHandle}</span>
                </div>
                <div className="text-[11px] text-neutral-500">
                  {note.authorUniversity} · Rating ★ {note.rating.toFixed(2)} ({note.reviewsCount} reviews)
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs text-neutral-500">Price</div>
              <div className="text-lg font-mono font-bold text-neutral-900">
                {note.price === 0 ? 'Free' : `$${note.price.toFixed(2)}`}
              </div>
            </div>
          </div>

          {/* Key Takeaways preview */}
          {note.keyTakeaways && note.keyTakeaways.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                Exam & Topic Highlights Included
              </h4>
              <ul className="space-y-1.5 text-xs text-neutral-700">
                {note.keyTakeaways.map((k, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold shrink-0">✓</span>
                    <span>{k}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Sample Markdown Reader */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-neutral-500">
              <span className="font-semibold text-neutral-800">
                Sample Note Preview ({note.previewPercent}% Unlocked)
              </span>
              <span>Scroll down to unlock full study deck</span>
            </div>

            <div className="p-5 bg-neutral-900 text-neutral-100 rounded-xl font-mono text-xs leading-relaxed space-y-3 max-h-72 overflow-y-auto whitespace-pre-wrap">
              {previewText}
            </div>

            {/* Blurred paywall teaser */}
            <div className="relative rounded-xl border border-dashed border-amber-300 bg-amber-50/50 p-6 text-center space-y-2">
              <Lock className="w-6 h-6 text-amber-600 mx-auto" />
              <div className="text-sm font-bold text-neutral-900">
                Remaining Sections &amp; Flashcard Decks are Locked
              </div>
              <p className="text-xs text-neutral-600 max-w-md mx-auto">
                Includes full proofs, formula derivations, code implementations, interactive flashcards, and student peer discussion comments.
              </p>
            </div>
          </div>

          {/* Peer Reviews */}
          {note.reviews && note.reviews.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-neutral-100">
              <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                Student Reviews ({note.reviews.length})
              </h4>
              <div className="space-y-2">
                {note.reviews.map((rev) => (
                  <div key={rev.id} className="p-3 bg-neutral-50 rounded-lg text-xs space-y-1 border border-neutral-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-medium text-neutral-900">
                        <span>{rev.userName}</span>
                        <span className="text-[10px] text-neutral-400">· {rev.userUniversity}</span>
                        {rev.verifiedBuyer && (
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-medium">
                            Verified Student Buyer
                          </span>
                        )}
                      </div>
                      <div className="flex items-center text-amber-500 font-mono text-[11px]">
                        {'★'.repeat(rev.rating)}
                      </div>
                    </div>
                    <p className="text-neutral-600 leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer CTA */}
        <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between">
          <div className="text-xs text-neutral-600">
            <span>Instant peer-to-peer delivery via NoteNest Wallet</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-200 rounded-lg transition-colors"
            >
              Close
            </button>
            {isOwned || isPurchased ? (
              <button
                onClick={() => {
                  onClose();
                  setSelectedNoteId(note.id);
                  setActiveTab('notes');
                }}
                className="px-5 py-2 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Open Full Note
              </button>
            ) : (
              <button
                onClick={() => onBuy(note)}
                className="px-5 py-2 text-xs font-semibold bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Lock className="w-3.5 h-3.5 text-amber-300" />
                <span>{note.price === 0 ? 'Unlock Free Note' : `Buy Now for $${note.price.toFixed(2)}`}</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

// ==========================================
// LIST NOTE FOR SALE MODAL
// ==========================================
const ListNoteForSaleModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { notes, currentUser, updateNote, setSelectedNoteId, setActiveTab } = useApp();
  const myNotes = notes.filter(n => n.authorId === currentUser.id);

  const [selectedNoteIdToSell, setSelectedNoteIdToSell] = useState<string>(myNotes[0]?.id || '');
  const [price, setPrice] = useState<number>(5.00);
  const [previewPercent, setPreviewPercent] = useState<number>(40);
  const [verificationType, setVerificationType] = useState<'A+ Grade Verified' | 'TA Approved' | 'Syllabus Aligned'>('A+ Grade Verified');

  const selectedNote = notes.find(n => n.id === selectedNoteIdToSell);

  const handlePublishListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNote) return;

    updateNote({
      ...selectedNote,
      isForSale: true,
      price: Number(price),
      previewPercent: Number(previewPercent),
      isVerifiedContent: true,
      verificationType: verificationType,
    });

    onClose();
    setSelectedNoteId(selectedNote.id);
    setActiveTab('marketplace');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-bold">
              <DollarSign className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900">List Note on Marketplace</h3>
              <p className="text-xs text-neutral-500">Sell your study notes to peers &amp; earn directly</p>
            </div>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-700 p-1">
            ✕
          </button>
        </div>

        {myNotes.length === 0 ? (
          <div className="text-center py-6 space-y-2">
            <p className="text-xs text-neutral-600">You don’t have any created notes yet.</p>
            <p className="text-xs text-neutral-400">Create a note first in the workspace, then list it here.</p>
          </div>
        ) : (
          <form onSubmit={handlePublishListing} className="space-y-4 text-xs">
            {/* Pick note */}
            <div>
              <label className="block font-semibold text-neutral-800 mb-1">
                Select Note to Sell
              </label>
              <select
                value={selectedNoteIdToSell}
                onChange={(e) => setSelectedNoteIdToSell(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
              >
                {myNotes.map(n => (
                  <option key={n.id} value={n.id}>
                    {n.courseCode}: {n.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Set Price */}
            <div>
              <div className="flex items-center justify-between font-semibold text-neutral-800 mb-1">
                <span>Set Price (USD)</span>
                <span className="font-mono text-emerald-700 font-bold">${price.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                step="0.5"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value))}
                className="w-full accent-neutral-900 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-neutral-400 pt-1">
                <span>Free ($0.00)</span>
                <span>$5.00</span>
                <span>$10.00</span>
                <span>$25.00</span>
              </div>
            </div>

            {/* Preview percentage */}
            <div>
              <div className="flex items-center justify-between font-semibold text-neutral-800 mb-1">
                <span>Free Sample Preview Threshold</span>
                <span className="font-mono text-neutral-900">{previewPercent}% visible free</span>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                step="5"
                value={previewPercent}
                onChange={(e) => setPreviewPercent(parseInt(e.target.value))}
                className="w-full accent-neutral-900 cursor-pointer"
              />
              <p className="text-[11px] text-neutral-500 pt-1">
                Prospective buyers can read the first {previewPercent}% of the note before being prompted to buy.
              </p>
            </div>

            {/* Academic Verification Badge */}
            <div>
              <label className="block font-semibold text-neutral-800 mb-1">
                Academic Credential Badge
              </label>
              <select
                value={verificationType}
                onChange={(e) => setVerificationType(e.target.value as any)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
              >
                <option value="A+ Grade Verified">A+ Grade Certified (Official Transcript proof)</option>
                <option value="TA Approved">TA Approved (Teaching Assistant Endorsed)</option>
                <option value="Syllabus Aligned">Syllabus Aligned (Matches current term syllabus)</option>
              </select>
            </div>

            {/* Payout breakdown */}
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1 text-neutral-600">
              <div className="flex justify-between">
                <span>Sale Price:</span>
                <span className="font-mono font-medium">${price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Campus Community Grant Fund (5%):</span>
                <span className="font-mono">-${(price * 0.05).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-neutral-900 pt-1 border-t border-neutral-200">
                <span>Your Net P2P Payout:</span>
                <span className="font-mono text-emerald-700">${(price * 0.95).toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Publish to NoteNest Marketplace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
