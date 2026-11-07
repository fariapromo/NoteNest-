import React from 'react';
import { useApp } from '../context/AppContext';
import { Note } from '../types';
import {
  Plus,
  BookOpen,
  ShieldCheck,
  Star,
  Lock,
  Tag,
  DollarSign,
  CheckCircle2,
  Calendar,
  Layers
} from 'lucide-react';

export const NoteList: React.FC = () => {
  const {
    notes,
    folders,
    selectedFolderId,
    selectedNoteId,
    setSelectedNoteId,
    searchQuery,
    selectedSubject,
    selectedTag,
    currentUser,
    userPurchasedNoteIds,
    createNote,
    setCheckoutNote,
  } = useApp();

  // Filter notes
  const filteredNotes = notes.filter(n => {
    // Folder filter
    if (selectedFolderId === 'my_created') {
      if (n.authorId !== currentUser.id) return false;
    } else if (selectedFolderId === 'purchased') {
      if (!userPurchasedNoteIds.includes(n.id) && n.folderId !== 'folder_purchased') return false;
    } else if (selectedFolderId === 'collaborations') {
      if (!n.isCollaborative && n.folderId !== 'folder_collaborations') return false;
    } else if (selectedFolderId) {
      if (n.folderId !== selectedFolderId) return false;
    }

    // Subject filter
    if (selectedSubject !== 'All' && n.subject !== selectedSubject) {
      return false;
    }

    // Tag filter
    if (selectedTag && !n.tags.includes(selectedTag)) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = n.title.toLowerCase().includes(q);
      const matchCourse = n.courseCode.toLowerCase().includes(q) || n.courseName.toLowerCase().includes(q);
      const matchContent = n.content.toLowerCase().includes(q);
      const matchTags = n.tags.some(t => t.toLowerCase().includes(q));
      if (!matchTitle && !matchCourse && !matchContent && !matchTags) return false;
    }

    return true;
  });

  // Current folder title
  const currentFolderName = selectedFolderId === 'my_created'
    ? 'My Created Notes'
    : selectedFolderId === 'purchased'
    ? 'Purchased Study Notes'
    : selectedFolderId === 'collaborations'
    ? 'Shared Study & Collaborations'
    : selectedFolderId
    ? folders.find(f => f.id === selectedFolderId)?.name || 'Course Folder'
    : 'All Study Notes';

  return (
    <div className="w-80 sm:w-96 border-r border-neutral-200 bg-neutral-50/40 flex flex-col h-[calc(100vh-4rem)] shrink-0 overflow-hidden">
      
      {/* Header with Title and Create Action */}
      <div className="p-4 border-b border-neutral-200 bg-white flex items-center justify-between shrink-0">
        <div className="min-w-0 pr-2">
          <h2 className="text-sm font-bold text-neutral-900 truncate">{currentFolderName}</h2>
          <div className="text-[11px] text-neutral-500 font-mono">
            {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'}
            {selectedTag && ` · #${selectedTag}`}
          </div>
        </div>

        <button
          onClick={() => createNote(selectedFolderId || undefined)}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-neutral-900 text-white hover:bg-neutral-800 rounded-lg transition-colors shrink-0 shadow-2xs"
          title="Create note in this folder"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New</span>
        </button>
      </div>

      {/* Note List Scrollable */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filteredNotes.length === 0 ? (
          <div className="text-center py-12 px-4 space-y-3">
            <BookOpen className="w-8 h-8 text-neutral-300 mx-auto" />
            <div className="text-xs font-semibold text-neutral-700">No notes in this view</div>
            <p className="text-[11px] text-neutral-400">
              {searchQuery ? 'Try another keyword or filter.' : 'Click "New" above to take notes.'}
            </p>
          </div>
        ) : (
          filteredNotes.map((note) => {
            const isSelected = selectedNoteId === note.id;
            const isOwned = note.authorId === currentUser.id;
            const isPurchased = userPurchasedNoteIds.includes(note.id);
            const isFree = note.price === 0;

            return (
              <div
                key={note.id}
                onClick={() => setSelectedNoteId(note.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2 ${
                  isSelected
                    ? 'bg-white border-neutral-900 shadow-sm ring-1 ring-neutral-900/10'
                    : 'bg-white hover:bg-neutral-50/80 border-neutral-200 hover:border-neutral-300'
                }`}
              >
                {/* Course Code & Date & Price */}
                <div className="flex items-center justify-between text-[11px] text-neutral-500 font-mono">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="font-semibold text-neutral-800">{note.courseCode}</span>
                    <span>·</span>
                    <span className="truncate">{note.subject}</span>
                  </div>

                  {note.isForSale && (
                    <span className="shrink-0 font-semibold text-emerald-700">
                      ${note.price.toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-xs sm:text-sm font-bold text-neutral-900 line-clamp-2 leading-snug">
                  {note.title}
                </h3>

                {/* Content snippet */}
                <p className="text-[11px] text-neutral-500 line-clamp-2 font-mono leading-relaxed">
                  {note.content.replace(/^#+ /, '').slice(0, 120)}
                </p>

                {/* Badges and Author bottom row */}
                <div className="flex items-center justify-between pt-1 text-[11px] text-neutral-500">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="truncate">{note.authorName}</span>
                    {note.isVerifiedContent && (
                      <span title="Verified Material">
                        <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {note.flashcards && note.flashcards.length > 0 && (
                      <span className="text-[10px] bg-neutral-100 text-neutral-600 px-1.5 py-0.2 rounded font-mono">
                        {note.flashcards.length} cards
                      </span>
                    )}
                    {isPurchased && (
                      <span className="text-[10px] text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded font-medium">
                        Purchased
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
