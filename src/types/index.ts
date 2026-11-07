export type AcademicRole = 'Student' | 'Teaching Assistant' | 'Honors Scholar' | 'Peer Tutor';

export interface User {
  id: string;
  name: string;
  handle: string;
  email: string;
  avatarUrl: string;
  university: string;
  major: string;
  role: AcademicRole;
  isVerified: boolean;
  verificationBadge?: 'TA Approved' | 'A+ Certified' | 'Honor Society' | 'Department Peer';
  walletBalance: number;
  totalEarnings: number;
  rating: number;
  ratingsCount: number;
  notesSoldCount: number;
  notesBoughtCount: number;
}

export interface Folder {
  id: string;
  name: string;
  courseCode?: string;
  university?: string;
  color: string;
  icon?: string;
  parentId?: string | null;
  noteCount?: number;
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

export interface StudyComment {
  id: string;
  userId: string;
  userName: string;
  userHandle: string;
  userAvatar: string;
  text: string;
  timestamp: string;
  highlightedText?: string;
  likes: number;
  replies?: StudyComment[];
}

export interface NoteReview {
  id: string;
  userId: string;
  userName: string;
  userUniversity: string;
  rating: number;
  comment: string;
  date: string;
  verifiedBuyer: boolean;
}

export interface Note {
  id: string;
  title: string;
  folderId: string;
  authorId: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  authorUniversity: string;
  authorVerified: boolean;
  authorBadge?: string;
  courseCode: string; // e.g. CS 161, CHEM 301
  courseName: string; // e.g. Algorithms & Data Structures
  term: string; // e.g. Fall 2026, Spring 2026
  subject: string; // Computer Science, Biology, Economics, etc.
  tags: string[];
  content: string; // Markdown formatted with formulas & notes
  keyTakeaways: string[];
  flashcards: Flashcard[];
  revisionChecklist: { task: string; completed: boolean }[];
  
  // Marketplace & Selling fields
  isForSale: boolean;
  price: number; // 0 for free, or USD amount
  previewPercent: number; // e.g. 35% visible for free preview
  isVerifiedContent: boolean;
  verificationType?: 'TA Approved' | 'A+ Grade Verified' | 'Syllabus Aligned';
  salesCount: number;
  rating: number;
  reviewsCount: number;
  reviews: NoteReview[];
  coverImage?: string;
  
  // Collaboration
  isCollaborative: boolean;
  collaboratorIds: string[];
  comments: StudyComment[];
  
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  type: 'purchase' | 'sale' | 'tip_sent' | 'tip_received' | 'deposit' | 'withdrawal';
  amount: number;
  netAmount: number; // after fee if sale
  fee: number;
  noteId?: string;
  noteTitle?: string;
  senderHandle?: string;
  recipientHandle?: string;
  description: string;
  timestamp: string;
  status: 'completed' | 'processing' | 'refunded';
  referenceId: string;
}
