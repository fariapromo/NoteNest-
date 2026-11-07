import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Folder as FolderIcon, X, Plus } from 'lucide-react';

export const NewFolderModal: React.FC = () => {
  const { isNewFolderModalOpen, setIsNewFolderModalOpen, createFolder, currentUser } = useApp();

  const [name, setName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [university, setUniversity] = useState(currentUser.university);
  const [color, setColor] = useState('#3B82F6');

  if (!isNewFolderModalOpen) return null;

  const colorOptions = [
    '#3B82F6', // Blue
    '#10B981', // Emerald
    '#F59E0B', // Amber
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#06B6D4', // Cyan
    '#EF4444', // Red
    '#64748B', // Slate
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    createFolder({
      name: name.trim(),
      courseCode: courseCode.trim() || undefined,
      university: university.trim() || undefined,
      color,
    });

    setName('');
    setCourseCode('');
    setIsNewFolderModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-neutral-200 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-bold">
              <FolderIcon className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900">New Course Folder</h3>
              <p className="text-xs text-neutral-500">Categorize your notes by syllabus</p>
            </div>
          </div>
          <button onClick={() => setIsNewFolderModalOpen(false)} className="text-neutral-400 hover:text-neutral-700 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-neutral-800 mb-1">
              Folder / Course Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. CS 229: Machine Learning"
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
              required
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-semibold text-neutral-800 mb-1">
                Course Code
              </label>
              <input
                type="text"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                placeholder="CS 229"
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 font-mono focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-neutral-800 mb-1">
                University
              </label>
              <input
                type="text"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 truncate"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-neutral-800 mb-1.5">
              Folder Color Tag
            </label>
            <div className="flex items-center gap-2">
              {colorOptions.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-6 h-6 rounded-full transition-transform ${
                    color === c ? 'scale-120 ring-2 ring-neutral-900 ring-offset-2' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Folder</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
