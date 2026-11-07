import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Folder, Note, Transaction, StudyComment, NoteReview, Flashcard } from '../types';
import { INITIAL_USERS, INITIAL_FOLDERS, INITIAL_NOTES, INITIAL_TRANSACTIONS } from '../data/mockData';
import confetti from 'canvas-confetti';

interface AppContextType {
  currentUser: User;
  users: User[];
  folders: Folder[];
  notes: Note[];
  transactions: Transaction[];
  activeTab: 'notes' | 'marketplace' | 'collaborate' | 'wallet' | 'verification';
  setActiveTab: (tab: 'notes' | 'marketplace' | 'collaborate' | 'wallet' | 'verification') => void;
  selectedFolderId: string | null;
  setSelectedFolderId: (id: string | null) => void;
  selectedNoteId: string | null;
  setSelectedNoteId: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedSubject: string;
  setSelectedSubject: (s: string) => void;
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
  
  // Modals
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isNewFolderModalOpen: boolean;
  setIsNewFolderModalOpen: (open: boolean) => void;
  isWalletModalOpen: boolean;
  setIsWalletModalOpen: (open: boolean) => void;
  isVerificationModalOpen: boolean;
  setIsVerificationModalOpen: (open: boolean) => void;
  checkoutNote: Note | null;
  setCheckoutNote: (note: Note | null) => void;
  
  // Operations
  createNote: (folderId?: string) => string;
  updateNote: (updated: Note) => void;
  deleteNote: (id: string) => void;
  createFolder: (folder: Omit<Folder, 'id'>) => void;
  deleteFolder: (id: string) => void;
  buyNote: (noteId: string) => { success: boolean; message: string };
  sendP2PPayment: (recipientHandle: string, amount: number, memo: string) => { success: boolean; message: string };
  depositFunds: (amount: number) => void;
  withdrawFunds: (amount: number) => { success: boolean; message: string };
  addStudyComment: (noteId: string, text: string, highlightedText?: string) => void;
  addNoteReview: (noteId: string, rating: number, comment: string) => void;
  switchUser: (userId: string) => void;
  loginOrCreateUser: (userData: { name: string; email: string; university: string; major: string; handle: string }) => void;
  userPurchasedNoteIds: string[];
  applyForVerificationTier: (tier: 'TA Approved' | 'A+ Certified' | 'Honor Society') => void;
  toggleChecklistItem: (noteId: string, taskIndex: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_NOTES = 'notenest_notes_v1';
const STORAGE_KEY_FOLDERS = 'notenest_folders_v1';
const STORAGE_KEY_USERS = 'notenest_users_v1';
const STORAGE_KEY_CURRENT_USER = 'notenest_current_user_v1';
const STORAGE_KEY_TRANSACTIONS = 'notenest_txs_v1';
const STORAGE_KEY_PURCHASED = 'notenest_purchased_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_USERS);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed;
    }
    return INITIAL_USERS[0];
  });

  const [folders, setFolders] = useState<Folder[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_FOLDERS);
    return saved ? JSON.parse(saved) : INITIAL_FOLDERS;
  });

  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_NOTES);
    return saved ? JSON.parse(saved) : INITIAL_NOTES;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_TRANSACTIONS);
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [userPurchasedNoteIds, setUserPurchasedNoteIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PURCHASED);
    return saved ? JSON.parse(saved) : ['note_chemiosmosis'];
  });

  const [activeTab, setActiveTab] = useState<'notes' | 'marketplace' | 'collaborate' | 'wallet' | 'verification'>('notes');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [checkoutNote, setCheckoutNote] = useState<Note | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_FOLDERS, JSON.stringify(folders));
  }, [folders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PURCHASED, JSON.stringify(userPurchasedNoteIds));
  }, [userPurchasedNoteIds]);

  const switchUser = (userId: string) => {
    const found = users.find(u => u.id === userId);
    if (found) {
      setCurrentUser(found);
    }
  };

  const loginOrCreateUser = (userData: { name: string; email: string; university: string; major: string; handle: string }) => {
    const cleanHandle = userData.handle.startsWith('@') ? userData.handle : `@${userData.handle}`;
    const existing = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase() || u.handle.toLowerCase() === cleanHandle.toLowerCase());
    
    if (existing) {
      setCurrentUser(existing);
      return;
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      name: userData.name,
      handle: cleanHandle,
      email: userData.email,
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256`,
      university: userData.university,
      major: userData.major,
      role: 'Student',
      isVerified: userData.email.endsWith('.edu'),
      verificationBadge: userData.email.endsWith('.edu') ? 'A+ Certified' : undefined,
      walletBalance: 25.00, // Welcome credit
      totalEarnings: 0,
      rating: 5.0,
      ratingsCount: 0,
      notesSoldCount: 0,
      notesBoughtCount: 0,
    };

    setUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
  };

  const createNote = (folderId?: string): string => {
    const targetFolder = folderId || selectedFolderId || folders[0]?.id || 'folder_cs161';
    const folderObj = folders.find(f => f.id === targetFolder);
    
    const newNote: Note = {
      id: `note_${Date.now()}`,
      title: 'Untitled Note',
      folderId: targetFolder,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorHandle: currentUser.handle,
      authorAvatar: currentUser.avatarUrl,
      authorUniversity: currentUser.university,
      authorVerified: currentUser.isVerified,
      authorBadge: currentUser.verificationBadge,
      courseCode: folderObj?.courseCode || 'GEN 101',
      courseName: folderObj?.name || 'General Studies',
      term: 'Fall 2026',
      subject: 'Computer Science',
      tags: ['Study Guide', 'Lecture Notes'],
      content: `# New Study Notes\n\nWrite your concepts, proofs, equations, and code blocks here.\n\n## Key Concepts\n- Point 1\n- Point 2`,
      keyTakeaways: [
        'Main concept summary point here'
      ],
      flashcards: [
        {
          id: `fc_${Date.now()}_1`,
          question: 'What is the primary theorem covered in this lecture?',
          answer: 'State key formulation and conditions for application.'
        }
      ],
      revisionChecklist: [
        { task: 'Review core lecture derivations', completed: false },
        { task: 'Complete practice problem set', completed: false }
      ],
      isForSale: false,
      price: 0,
      previewPercent: 100,
      isVerifiedContent: currentUser.isVerified,
      verificationType: currentUser.verificationBadge ? (currentUser.verificationBadge as any) : undefined,
      salesCount: 0,
      rating: 5.0,
      reviewsCount: 0,
      reviews: [],
      isCollaborative: false,
      collaboratorIds: [],
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setNotes(prev => [newNote, ...prev]);
    setSelectedNoteId(newNote.id);
    setActiveTab('notes');
    return newNote.id;
  };

  const updateNote = (updated: Note) => {
    setNotes(prev => prev.map(n => n.id === updated.id ? { ...updated, updatedAt: new Date().toISOString() } : n));
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    if (selectedNoteId === id) {
      setSelectedNoteId(null);
    }
  };

  const createFolder = (folderData: Omit<Folder, 'id'>) => {
    const newFolder: Folder = {
      ...folderData,
      id: `folder_${Date.now()}`,
    };
    setFolders(prev => [...prev, newFolder]);
    setSelectedFolderId(newFolder.id);
  };

  const deleteFolder = (id: string) => {
    setFolders(prev => prev.filter(f => f.id !== id));
    if (selectedFolderId === id) {
      setSelectedFolderId(null);
    }
  };

  const buyNote = (noteId: string): { success: boolean; message: string } => {
    const note = notes.find(n => n.id === noteId);
    if (!note) return { success: false, message: 'Note not found' };

    if (note.authorId === currentUser.id) {
      return { success: false, message: 'You are the author of this note.' };
    }

    if (userPurchasedNoteIds.includes(noteId)) {
      return { success: false, message: 'You have already purchased this note.' };
    }

    if (note.price > 0 && currentUser.walletBalance < note.price) {
      return { success: false, message: `Insufficient balance ($${currentUser.walletBalance.toFixed(2)} available, $${note.price.toFixed(2)} needed). Please add funds to your wallet.` };
    }

    // Execute P2P payment
    const fee = note.price > 0 ? Number((note.price * 0.05).toFixed(2)) : 0; // 5% campus study pool fee
    const netSeller = note.price > 0 ? Number((note.price - fee).toFixed(2)) : 0;

    // Deduct buyer
    setCurrentUser(prev => ({
      ...prev,
      walletBalance: Number((prev.walletBalance - note.price).toFixed(2)),
      notesBoughtCount: prev.notesBoughtCount + 1,
    }));

    // Credit seller in users table
    setUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        return {
          ...u,
          walletBalance: Number((u.walletBalance - note.price).toFixed(2)),
          notesBoughtCount: u.notesBoughtCount + 1,
        };
      }
      if (u.id === note.authorId) {
        return {
          ...u,
          walletBalance: Number((u.walletBalance + netSeller).toFixed(2)),
          totalEarnings: Number((u.totalEarnings + netSeller).toFixed(2)),
          notesSoldCount: u.notesSoldCount + 1,
        };
      }
      return u;
    }));

    // Add note to purchased folder / unlocked list
    setUserPurchasedNoteIds(prev => [...prev, noteId]);

    // Update note sales count
    setNotes(prev => prev.map(n => n.id === noteId ? { ...n, salesCount: n.salesCount + 1 } : n));

    // Ledger record
    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      type: 'purchase',
      amount: note.price,
      netAmount: note.price,
      fee: fee,
      noteId: note.id,
      noteTitle: note.title,
      senderHandle: currentUser.handle,
      recipientHandle: note.authorHandle,
      description: `P2P Purchase: ${note.title} (${note.courseCode})`,
      timestamp: 'Just now',
      status: 'completed',
      referenceId: `NN-TX-${Math.floor(1000 + Math.random() * 9000)}-NOTE`,
    };

    setTransactions(prev => [newTx, ...prev]);

    // Confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }

    return { success: true, message: `Successfully purchased "${note.title}"! Full access unlocked.` };
  };

  const sendP2PPayment = (recipientHandle: string, amount: number, memo: string): { success: boolean; message: string } => {
    const cleanHandle = recipientHandle.startsWith('@') ? recipientHandle : `@${recipientHandle}`;
    if (cleanHandle.toLowerCase() === currentUser.handle.toLowerCase()) {
      return { success: false, message: 'You cannot send a payment to yourself.' };
    }

    if (amount <= 0) {
      return { success: false, message: 'Amount must be greater than $0.' };
    }

    if (currentUser.walletBalance < amount) {
      return { success: false, message: `Insufficient balance ($${currentUser.walletBalance.toFixed(2)}).` };
    }

    // Fee: 0 for direct peer tips
    const fee = 0;
    const net = amount;

    // Deduct sender
    setCurrentUser(prev => ({
      ...prev,
      walletBalance: Number((prev.walletBalance - amount).toFixed(2)),
    }));

    // Credit recipient if exists
    setUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        return {
          ...u,
          walletBalance: Number((u.walletBalance - amount).toFixed(2)),
        };
      }
      if (u.handle.toLowerCase() === cleanHandle.toLowerCase()) {
        return {
          ...u,
          walletBalance: Number((u.walletBalance + net).toFixed(2)),
          totalEarnings: Number((u.totalEarnings + net).toFixed(2)),
        };
      }
      return u;
    }));

    const tx: Transaction = {
      id: `tx_${Date.now()}`,
      type: 'tip_sent',
      amount: amount,
      netAmount: net,
      fee: fee,
      senderHandle: currentUser.handle,
      recipientHandle: cleanHandle,
      description: memo || `Direct P2P tip to ${cleanHandle}`,
      timestamp: 'Just now',
      status: 'completed',
      referenceId: `NN-P2P-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    setTransactions(prev => [tx, ...prev]);

    return { success: true, message: `Sent $${amount.toFixed(2)} to ${cleanHandle}!` };
  };

  const depositFunds = (amount: number) => {
    setCurrentUser(prev => ({
      ...prev,
      walletBalance: Number((prev.walletBalance + amount).toFixed(2)),
    }));

    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, walletBalance: Number((u.walletBalance + amount).toFixed(2)) } : u));

    const tx: Transaction = {
      id: `tx_${Date.now()}`,
      type: 'deposit',
      amount: amount,
      netAmount: amount,
      fee: 0,
      description: 'Campus wallet instant reload via Student Debit/Apple Pay',
      timestamp: 'Just now',
      status: 'completed',
      referenceId: `NN-DEP-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    setTransactions(prev => [tx, ...prev]);
  };

  const withdrawFunds = (amount: number): { success: boolean; message: string } => {
    if (amount <= 0) return { success: false, message: 'Invalid withdrawal amount.' };
    if (currentUser.walletBalance < amount) return { success: false, message: 'Withdrawal exceeds current balance.' };

    setCurrentUser(prev => ({
      ...prev,
      walletBalance: Number((prev.walletBalance - amount).toFixed(2)),
    }));

    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, walletBalance: Number((u.walletBalance - amount).toFixed(2)) } : u));

    const tx: Transaction = {
      id: `tx_${Date.now()}`,
      type: 'withdrawal',
      amount: amount,
      netAmount: amount,
      fee: 0,
      description: `Payout transfer to student checking account (ACH instant)`,
      timestamp: 'Just now',
      status: 'completed',
      referenceId: `NN-WDL-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    setTransactions(prev => [tx, ...prev]);
    return { success: true, message: `$${amount.toFixed(2)} payout initiated to your bank account!` };
  };

  const addStudyComment = (noteId: string, text: string, highlightedText?: string) => {
    const newComment: StudyComment = {
      id: `comm_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userHandle: currentUser.handle,
      userAvatar: currentUser.avatarUrl,
      text,
      timestamp: 'Just now',
      highlightedText,
      likes: 0,
      replies: []
    };

    setNotes(prev => prev.map(n => {
      if (n.id === noteId) {
        return {
          ...n,
          comments: [newComment, ...(n.comments || [])]
        };
      }
      return n;
    }));
  };

  const addNoteReview = (noteId: string, rating: number, comment: string) => {
    const newReview: NoteReview = {
      id: `rev_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userUniversity: currentUser.university,
      rating,
      comment,
      date: 'Just now',
      verifiedBuyer: true
    };

    setNotes(prev => prev.map(n => {
      if (n.id === noteId) {
        const updatedReviews = [newReview, ...n.reviews];
        const avg = updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;
        return {
          ...n,
          reviews: updatedReviews,
          reviewsCount: updatedReviews.length,
          rating: Number(avg.toFixed(2))
        };
      }
      return n;
    }));
  };

  const applyForVerificationTier = (tier: 'TA Approved' | 'A+ Certified' | 'Honor Society') => {
    setCurrentUser(prev => ({
      ...prev,
      isVerified: true,
      verificationBadge: tier
    }));

    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, isVerified: true, verificationBadge: tier } : u));
  };

  const toggleChecklistItem = (noteId: string, taskIndex: number) => {
    setNotes(prev => prev.map(n => {
      if (n.id === noteId) {
        const nextChecklist = [...n.revisionChecklist];
        if (nextChecklist[taskIndex]) {
          nextChecklist[taskIndex] = {
            ...nextChecklist[taskIndex],
            completed: !nextChecklist[taskIndex].completed
          };
        }
        return { ...n, revisionChecklist: nextChecklist };
      }
      return n;
    }));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        folders,
        notes,
        transactions,
        activeTab,
        setActiveTab,
        selectedFolderId,
        setSelectedFolderId,
        selectedNoteId,
        setSelectedNoteId,
        searchQuery,
        setSearchQuery,
        selectedSubject,
        setSelectedSubject,
        selectedTag,
        setSelectedTag,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isNewFolderModalOpen,
        setIsNewFolderModalOpen,
        isWalletModalOpen,
        setIsWalletModalOpen,
        isVerificationModalOpen,
        setIsVerificationModalOpen,
        checkoutNote,
        setCheckoutNote,
        createNote,
        updateNote,
        deleteNote,
        createFolder,
        deleteFolder,
        buyNote,
        sendP2PPayment,
        depositFunds,
        withdrawFunds,
        addStudyComment,
        addNoteReview,
        switchUser,
        loginOrCreateUser,
        userPurchasedNoteIds,
        applyForVerificationTier,
        toggleChecklistItem,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
