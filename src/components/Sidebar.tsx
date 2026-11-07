import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Folder as FolderIcon,
  Plus,
  BookMarked,
  ShoppingBag,
  Users,
  Search,
  Hash,
  ChevronRight,
  GraduationCap,
  Sparkles,
  Layers,
  Trash2
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    folders,
    notes,
    selectedFolderId,
    setSelectedFolderId,
    searchQuery,
    setSearchQuery,
    selectedSubject,
    setSelectedSubject,
    selectedTag,
    setSelectedTag,
    setIsNewFolderModalOpen,
    currentUser,
    userPurchasedNoteIds,
    deleteFolder,
  } = useApp();

  const [folderSearch, setFolderSearch] = useState('');

  // Calculate note counts per folder
  const getFolderCount = (folderId: string) => {
    return notes.filter(n => n.folderId === folderId).length;
  };

  const purchasedCount = notes.filter(n => userPurchasedNoteIds.includes(n.id) || n.folderId === 'folder_purchased').length;
  const collabCount = notes.filter(n => n.isCollaborative || n.folderId === 'folder_collaborations').length;
  const myCreatedCount = notes.filter(n => n.authorId === currentUser.id).length;

  const filteredFolders = folders.filter(f => 
    f.name.toLowerCase().includes(folderSearch.toLowerCase()) ||
    (f.courseCode && f.courseCode.toLowerCase().includes(folderSearch.toLowerCase()))
  );

  const subjects = ['All', 'Computer Science', 'Biology', 'Economics', 'Chemistry', 'Mathematics'];

  // Collect unique tags
  const allTags = Array.from(new Set(notes.flatMap(n => n.tags)));

  return (
    <aside className="w-64 sm:w-72 border-r border-neutral-200 bg-white flex flex-col h-[calc(100vh-4rem)] shrink-0 overflow-y-auto">
      {/* Search Input for Notes */}
      <div className="p-3.5 border-b border-neutral-200">
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes, formulas, codes..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-50 hover:bg-neutral-100/70 focus:bg-white border border-neutral-200 rounded-lg text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-400 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 text-xs text-neutral-400 hover:text-neutral-600"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Main Views Navigation */}
      <div className="p-3 border-b border-neutral-100 space-y-0.5">
        <button
          onClick={() => {
            setSelectedFolderId(null);
            setSelectedTag(null);
          }}
          className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
            selectedFolderId === null && selectedTag === null
              ? 'bg-neutral-100 text-neutral-900 font-semibold'
              : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Layers className="w-4 h-4 text-neutral-500" />
            <span>All Study Notes</span>
          </div>
          <span className="font-mono tabular-nums text-neutral-400 text-[11px]">{notes.length}</span>
        </button>

        <button
          onClick={() => {
            setSelectedFolderId('my_created');
            setSelectedTag(null);
          }}
          className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
            selectedFolderId === 'my_created'
              ? 'bg-neutral-100 text-neutral-900 font-semibold'
              : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <BookMarked className="w-4 h-4 text-neutral-500" />
            <span>My Created Notes</span>
          </div>
          <span className="font-mono tabular-nums text-neutral-400 text-[11px]">{myCreatedCount}</span>
        </button>

        <button
          onClick={() => {
            setSelectedFolderId('purchased');
            setSelectedTag(null);
          }}
          className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
            selectedFolderId === 'purchased'
              ? 'bg-indigo-50 text-indigo-900 font-semibold'
              : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-4 h-4 text-indigo-600" />
            <span>Purchased Notes</span>
          </div>
          <span className="font-mono tabular-nums text-indigo-600 text-[11px]">{purchasedCount}</span>
        </button>

        <button
          onClick={() => {
            setSelectedFolderId('collaborations');
            setSelectedTag(null);
          }}
          className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
            selectedFolderId === 'collaborations'
              ? 'bg-cyan-50 text-cyan-900 font-semibold'
              : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Users className="w-4 h-4 text-cyan-600" />
            <span>Shared & Collaboration</span>
          </div>
          <span className="font-mono tabular-nums text-cyan-600 text-[11px]">{collabCount}</span>
        </button>
      </div>

      {/* Folders Section */}
      <div className="flex-1 p-3 overflow-y-auto">
        <div className="flex items-center justify-between px-1 mb-2">
          <span className="text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
            Course Folders
          </span>
          <button
            onClick={() => setIsNewFolderModalOpen(true)}
            className="p-1 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded transition-colors"
            title="Create new course folder"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Course Folders List */}
        <div className="space-y-0.5">
          {filteredFolders.map((folder) => {
            const count = getFolderCount(folder.id);
            const isSelected = selectedFolderId === folder.id;

            return (
              <div
                key={folder.id}
                className={`group flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-neutral-100 text-neutral-900 font-semibold'
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                }`}
                onClick={() => {
                  setSelectedFolderId(folder.id);
                  setSelectedTag(null);
                }}
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-1">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: folder.color || '#3B82F6' }}
                  />
                  <div className="truncate">
                    <div className="truncate text-neutral-800">{folder.name}</div>
                    {folder.courseCode && (
                      <div className="text-[10px] text-neutral-400 font-mono">
                        {folder.courseCode} · {folder.university || 'Course'}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="font-mono tabular-nums text-neutral-400 text-[11px]">{count}</span>
                  {!['folder_purchased', 'folder_collaborations'].includes(folder.id) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete folder "${folder.name}"? Notes inside will remain in general list.`)) {
                          deleteFolder(folder.id);
                        }
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-neutral-400 hover:text-rose-600 transition-opacity"
                      title="Delete folder"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Academic Subjects */}
        <div className="mt-5 pt-4 border-t border-neutral-100">
          <div className="px-1 mb-2 text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
            Subject Domain
          </div>
          <div className="flex flex-wrap gap-1 px-1">
            {subjects.map((subj) => (
              <button
                key={subj}
                onClick={() => setSelectedSubject(subj)}
                className={`px-2.5 py-1 text-[11px] rounded-md transition-colors ${
                  selectedSubject === subj
                    ? 'bg-neutral-900 text-white font-medium'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {subj}
              </button>
            ))}
          </div>
        </div>

        {/* Popular Tags */}
        {allTags.length > 0 && (
          <div className="mt-5 pt-4 border-t border-neutral-100">
            <div className="px-1 mb-2 text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
              Study Tags
            </div>
            <div className="flex flex-wrap gap-1 px-1">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={`flex items-center gap-1 px-2 py-0.5 text-[11px] rounded transition-colors ${
                    selectedTag === tag
                      ? 'bg-amber-100 text-amber-900 font-medium'
                      : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                >
                  <Hash className="w-2.5 h-2.5 opacity-60" />
                  <span>{tag}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* User Campus Badge Footer */}
      <div className="p-3 border-t border-neutral-200 bg-neutral-50/60 text-xs">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-neutral-600 shrink-0" />
          <div className="truncate">
            <div className="font-semibold text-neutral-800 truncate">{currentUser.university}</div>
            <div className="text-[11px] text-neutral-500 truncate">{currentUser.major}</div>
          </div>
        </div>
      </div>
    </aside>
  );
};
