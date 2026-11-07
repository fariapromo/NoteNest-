import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Award,
  CheckCircle,
  FileCheck,
  GraduationCap,
  Sparkles,
  X,
  UploadCloud
} from 'lucide-react';

export const VerificationModal: React.FC = () => {
  const {
    currentUser,
    isVerificationModalOpen,
    setIsVerificationModalOpen,
    applyForVerificationTier,
  } = useApp();

  const [selectedTier, setSelectedTier] = useState<'A+ Certified' | 'TA Approved' | 'Honor Society'>('A+ Certified');
  const [universityEmail, setUniversityEmail] = useState(currentUser.email);
  const [courseCode, setCourseCode] = useState('CS 161');
  const [grade, setGrade] = useState('A+ (4.0)');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isVerificationModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyForVerificationTier(selectedTier);
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-neutral-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-200" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900">Verified Educational Content Program</h2>
              <p className="text-xs text-neutral-500">Quality certification for notes, study guides &amp; sellers</p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsVerificationModalOpen(false);
              setIsSubmitted(false);
            }}
            className="text-neutral-400 hover:text-neutral-700 p-1.5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs text-neutral-700">
          {isSubmitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-neutral-900">Verification Badge Awarded!</h3>
                <p className="text-xs text-neutral-600 max-w-sm mx-auto">
                  Your profile now bears the <strong>{selectedTier}</strong> badge. Your published notes will feature the official green verification seal on the marketplace.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsVerificationModalOpen(false);
                  setIsSubmitted(false);
                }}
                className="px-6 py-2.5 bg-neutral-900 text-white font-semibold rounded-lg hover:bg-neutral-800 transition-colors"
              >
                Back to Workspace
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Educational Trust Statement */}
              <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1.5">
                <div className="font-semibold text-neutral-900 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-700" />
                  <span>Why Verification Matters</span>
                </div>
                <p className="text-[11px] text-neutral-600 leading-relaxed">
                  Verified content sells 4.8x faster on NoteNest. Verification protects students from inaccurate notes and confirms that the seller achieved top marks or served as an official course TA.
                </p>
              </div>

              {/* Tier Selection */}
              <div>
                <label className="block font-semibold text-neutral-800 mb-2">
                  Select Verification Tier
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div
                    onClick={() => setSelectedTier('A+ Certified')}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedTier === 'A+ Certified'
                        ? 'bg-emerald-50/60 border-emerald-600 text-emerald-950 ring-1 ring-emerald-600'
                        : 'bg-white hover:bg-neutral-50 border-neutral-200 text-neutral-800'
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-emerald-700" />
                      <span>A+ Certified</span>
                    </div>
                    <div className="text-[10px] text-neutral-500 mt-1">
                      Scored 90%+ in the course. Requires transcript or portal screenshot.
                    </div>
                  </div>

                  <div
                    onClick={() => setSelectedTier('TA Approved')}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedTier === 'TA Approved'
                        ? 'bg-emerald-50/60 border-emerald-600 text-emerald-950 ring-1 ring-emerald-600'
                        : 'bg-white hover:bg-neutral-50 border-neutral-200 text-neutral-800'
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                      <span>TA Approved</span>
                    </div>
                    <div className="text-[10px] text-neutral-500 mt-1">
                      Official course Teaching Assistant or grader endorsement.
                    </div>
                  </div>

                  <div
                    onClick={() => setSelectedTier('Honor Society')}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedTier === 'Honor Society'
                        ? 'bg-emerald-50/60 border-emerald-600 text-emerald-950 ring-1 ring-emerald-600'
                        : 'bg-white hover:bg-neutral-50 border-neutral-200 text-neutral-800'
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Honor Society</span>
                    </div>
                    <div className="text-[10px] text-neutral-500 mt-1">
                      Department Dean’s List or academic honor society membership.
                    </div>
                  </div>
                </div>
              </div>

              {/* Form fields */}
              <div className="space-y-3">
                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">
                    University .edu Email
                  </label>
                  <input
                    type="email"
                    value={universityEmail}
                    onChange={(e) => setUniversityEmail(e.target.value)}
                    placeholder="student@stanford.edu or student@mit.edu"
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-neutral-800 mb-1">
                      Course Code
                    </label>
                    <input
                      type="text"
                      value={courseCode}
                      onChange={(e) => setCourseCode(e.target.value)}
                      placeholder="e.g. CS 161"
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 font-mono focus:outline-none focus:ring-1 focus:ring-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-neutral-800 mb-1">
                      Grade Achieved
                    </label>
                    <input
                      type="text"
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      placeholder="e.g. A+ or 98%"
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 font-mono focus:outline-none focus:ring-1 focus:ring-neutral-900"
                    />
                  </div>
                </div>

                {/* Upload proof container */}
                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">
                    Upload Transcript or Course Proof (PDF / Screenshot)
                  </label>
                  <div className="p-4 border-2 border-dashed border-neutral-200 rounded-xl text-center space-y-1 bg-neutral-50 hover:bg-neutral-100/50 cursor-pointer transition-colors">
                    <UploadCloud className="w-6 h-6 text-neutral-400 mx-auto" />
                    <div className="text-xs font-semibold text-neutral-800">
                      stanford_transcript_unofficial.pdf (Attached)
                    </div>
                    <div className="text-[10px] text-neutral-400">
                      Sensitive student ID numbers are automatically redacted.
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Submit &amp; Claim Verified Badge</span>
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
