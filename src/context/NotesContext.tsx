import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { Note, SortOption, FilterCategory, ViewMode } from '../types';

interface NotesContextType {
  notes: Note[];
  loading: boolean;
  activeNoteId: string | null;
  activeNote: Note | null;
  searchQuery: string;
  selectedTag: string | null;
  filterCategory: FilterCategory;
  sortOption: SortOption;
  viewMode: ViewMode;
  allTags: string[];
  stats: {
    total: number;
    favorites: number;
    archived: number;
    shared: number;
  };
  setActiveNoteId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setSelectedTag: (tag: string | null) => void;
  setFilterCategory: (category: FilterCategory) => void;
  setSortOption: (option: SortOption) => void;
  setViewMode: (mode: ViewMode) => void;
  createNote: (titleOrData?: string | Partial<Note>, body?: string, tags?: string[]) => Promise<string>;
  getNoteById: (noteId: string) => Note | undefined;
  updateNote: (noteId: string, updates: Partial<Note>, notify?: boolean) => Promise<void>;
  deleteNote: (noteId: string) => Promise<void>;
  duplicateNote: (noteId: string) => Promise<string>;
  toggleFavorite: (noteId: string) => Promise<void>;
  toggleArchive: (noteId: string) => Promise<void>;
  updateShareSettings: (noteId: string, shared: boolean, shareExpiresAt: Date | null) => Promise<void>;
  getSharedNote: (userId: string, noteId: string) => Promise<{ note: Note | null; status: 'valid' | 'expired' | 'disabled' | 'not_found' }>;
  filteredNotes: Note[];
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('all');
  const [sortOption, setSortOption] = useState<SortOption>('updatedDesc');
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const saved = localStorage.getItem('cloudnotes_viewmode');
    return (saved as ViewMode) || 'grid';
  });

  // Real-time Firestore sync on user's notes subcollection
  useEffect(() => {
    if (!user) {
      setNotes([]);
      setLoading(false);
      setActiveNoteId(null);
      return;
    }

    setLoading(true);
    const notesCollectionRef = collection(db, 'users', user.uid, 'notes');
    const q = query(notesCollectionRef);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedNotes: Note[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          fetchedNotes.push({
            id: docSnap.id,
            userId: user.uid,
            title: data.title || '',
            body: data.body || '',
            tags: Array.isArray(data.tags) ? data.tags : [],
            favorite: Boolean(data.favorite),
            archived: Boolean(data.archived),
            shared: Boolean(data.shared),
            shareExpiresAt: data.shareExpiresAt || null,
            createdAt: data.createdAt || null,
            updatedAt: data.updatedAt || null,
          });
        });
        setNotes(fetchedNotes);
        setLoading(false);
      },
      (error) => {
        setLoading(false);
        try {
          handleFirestoreError(error, OperationType.LIST, `users/${user.uid}/notes`);
        } catch (err: any) {
          console.warn('Real-time listener warning:', err.message);
        }
      }
    );

    return () => unsubscribe();
  }, [user]);

  const setViewModeWithStorage = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem('cloudnotes_viewmode', mode);
  };

  // Active note helper
  const activeNote = useMemo(() => {
    if (!activeNoteId) return null;
    return notes.find((n) => n.id === activeNoteId) || null;
  }, [notes, activeNoteId]);

  // All extracted tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    notes.forEach((note) => {
      note.tags.forEach((tag) => {
        if (tag.trim()) tagSet.add(tag.trim());
      });
    });
    return Array.from(tagSet).sort();
  }, [notes]);

  // Calculated stats
  const stats = useMemo(() => {
    let favorites = 0;
    let archived = 0;
    let shared = 0;
    let total = 0;

    notes.forEach((n) => {
      if (!n.archived) {
        total++;
        if (n.favorite) favorites++;
      } else {
        archived++;
      }
      if (n.shared) shared++;
    });

    return { total, favorites, archived, shared };
  }, [notes]);

  // Filtered and sorted notes
  const filteredNotes = useMemo(() => {
    return notes
      .filter((note) => {
        // Category filtering
        if (filterCategory === 'all' && note.archived) return false;
        if (filterCategory === 'favorites' && (!note.favorite || note.archived)) return false;
        if (filterCategory === 'archived' && !note.archived) return false;
        if (filterCategory === 'shared' && !note.shared) return false;

        // Tag filter
        if (selectedTag && !note.tags.includes(selectedTag)) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const queryLower = searchQuery.toLowerCase().trim();
          const titleMatch = note.title.toLowerCase().includes(queryLower);
          const bodyMatch = note.body.toLowerCase().includes(queryLower);
          const tagsMatch = note.tags.some((t) => t.toLowerCase().includes(queryLower));
          if (!titleMatch && !bodyMatch && !tagsMatch) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const getTime = (t: any) => {
          if (!t) return 0;
          if (typeof t.toMillis === 'function') return t.toMillis();
          if (t.seconds) return t.seconds * 1000;
          return new Date(t).getTime() || 0;
        };

        if (sortOption === 'updatedDesc') {
          return getTime(b.updatedAt) - getTime(a.updatedAt);
        }
        if (sortOption === 'updatedAsc') {
          return getTime(a.updatedAt) - getTime(b.updatedAt);
        }
        if (sortOption === 'createdDesc') {
          return getTime(b.createdAt) - getTime(a.createdAt);
        }
        if (sortOption === 'createdAsc') {
          return getTime(a.createdAt) - getTime(b.createdAt);
        }
        if (sortOption === 'titleAsc') {
          return (a.title || 'Untitled').localeCompare(b.title || 'Untitled');
        }
        if (sortOption === 'titleDesc') {
          return (b.title || 'Untitled').localeCompare(a.title || 'Untitled');
        }
        return 0;
      });
  }, [notes, filterCategory, selectedTag, searchQuery, sortOption]);

  // CRUD Operations
  const getNoteById = (noteId: string): Note | undefined => {
    return notes.find((n) => n.id === noteId);
  };

  const createNote = async (
    titleOrData?: string | Partial<Note>,
    body?: string,
    tags?: string[]
  ): Promise<string> => {
    if (!user) throw new Error('User must be authenticated to create a note');

    let title = 'Untitled Note';
    let noteBody = '';
    let noteTags: string[] = [];
    let favorite = false;

    if (typeof titleOrData === 'string') {
      title = titleOrData || 'Untitled Note';
      noteBody = body || '';
      noteTags = tags || [];
    } else if (titleOrData && typeof titleOrData === 'object') {
      title = titleOrData.title || 'Untitled Note';
      noteBody = titleOrData.body || '';
      noteTags = titleOrData.tags || [];
      favorite = Boolean(titleOrData.favorite);
    }

    const newNoteData = {
      title,
      body: noteBody,
      tags: noteTags,
      favorite,
      archived: false,
      shared: false,
      shareExpiresAt: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const notesColRef = collection(db, 'users', user.uid, 'notes');
    try {
      const docRef = await addDoc(notesColRef, newNoteData);
      setActiveNoteId(docRef.id);
      addToast('Note created', 'success');
      return docRef.id;
    } catch (err: any) {
      handleFirestoreError(err, OperationType.CREATE, `users/${user.uid}/notes`);
    }
  };

  const updateNote = async (noteId: string, updates: Partial<Note>, notify = false) => {
    if (!user) throw new Error('User must be authenticated to update a note');

    const noteDocRef = doc(db, 'users', user.uid, 'notes', noteId);
    const cleanUpdates: Record<string, any> = {
      ...updates,
      updatedAt: serverTimestamp(),
    };
    // Don't overwrite id or createdAt or userId
    delete cleanUpdates.id;
    delete cleanUpdates.userId;
    delete cleanUpdates.createdAt;

    try {
      await updateDoc(noteDocRef, cleanUpdates);
      if (notify) {
        addToast('Note updated', 'success');
      }
    } catch (err: any) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}/notes/${noteId}`);
    }
  };

  const deleteNote = async (noteId: string) => {
    if (!user) throw new Error('User must be authenticated to delete a note');

    const noteDocRef = doc(db, 'users', user.uid, 'notes', noteId);
    try {
      await deleteDoc(noteDocRef);
      if (activeNoteId === noteId) {
        setActiveNoteId(null);
      }
      addToast('Note deleted', 'info');
    } catch (err: any) {
      handleFirestoreError(err, OperationType.DELETE, `users/${user.uid}/notes/${noteId}`);
    }
  };

  const duplicateNote = async (noteId: string): Promise<string> => {
    const target = notes.find((n) => n.id === noteId);
    if (!target || !user) throw new Error('Note not found');

    const duplicateData = {
      title: `${target.title || 'Untitled'} (Copy)`,
      body: target.body,
      tags: [...target.tags],
      favorite: target.favorite,
      archived: false,
      shared: false,
      shareExpiresAt: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const notesColRef = collection(db, 'users', user.uid, 'notes');
    try {
      const docRef = await addDoc(notesColRef, duplicateData);
      addToast('Note duplicated', 'success');
      return docRef.id;
    } catch (err: any) {
      handleFirestoreError(err, OperationType.CREATE, `users/${user.uid}/notes`);
    }
  };

  const toggleFavorite = async (noteId: string) => {
    const note = notes.find((n) => n.id === noteId);
    if (!note || !user) return;
    const newStatus = !note.favorite;
    await updateNote(noteId, { favorite: newStatus });
    addToast(newStatus ? 'Added to favorites' : 'Removed from favorites', 'info');
  };

  const toggleArchive = async (noteId: string) => {
    const note = notes.find((n) => n.id === noteId);
    if (!note || !user) return;
    const newStatus = !note.archived;
    await updateNote(noteId, { archived: newStatus });
    addToast(newStatus ? 'Note archived' : 'Note restored to active', 'info');
  };

  const updateShareSettings = async (
    noteId: string,
    shared: boolean,
    shareExpiresAt: Date | null
  ) => {
    if (!user) return;
    const expiresTimestamp = shareExpiresAt ? Timestamp.fromDate(shareExpiresAt) : null;
    await updateNote(noteId, {
      shared,
      shareExpiresAt: expiresTimestamp as any,
    });
    addToast(shared ? 'Share settings updated' : 'Sharing disabled', 'success');
  };

  // Secure Public Shared Note Reader
  const getSharedNote = async (
    userId: string,
    noteId: string
  ): Promise<{ note: Note | null; status: 'valid' | 'expired' | 'disabled' | 'not_found' }> => {
    try {
      const noteDocRef = doc(db, 'users', userId, 'notes', noteId);
      const snap = await getDoc(noteDocRef);

      if (!snap.exists()) {
        return { note: null, status: 'not_found' };
      }

      const data = snap.data();
      if (!data.shared) {
        return { note: null, status: 'disabled' };
      }

      if (data.shareExpiresAt) {
        const expiryDate =
          typeof data.shareExpiresAt.toDate === 'function'
            ? data.shareExpiresAt.toDate()
            : new Date(data.shareExpiresAt.seconds * 1000);
        if (new Date() > expiryDate) {
          return { note: null, status: 'expired' };
        }
      }

      const note: Note = {
        id: snap.id,
        userId: userId,
        title: data.title || '',
        body: data.body || '',
        tags: Array.isArray(data.tags) ? data.tags : [],
        favorite: Boolean(data.favorite),
        archived: Boolean(data.archived),
        shared: Boolean(data.shared),
        shareExpiresAt: data.shareExpiresAt || null,
        createdAt: data.createdAt || null,
        updatedAt: data.updatedAt || null,
      };

      return { note, status: 'valid' };
    } catch (err: any) {
      console.error('Error fetching shared note:', err);
      return { note: null, status: 'not_found' };
    }
  };

  return (
    <NotesContext.Provider
      value={{
        notes,
        loading,
        activeNoteId,
        activeNote,
        searchQuery,
        selectedTag,
        filterCategory,
        sortOption,
        viewMode,
        allTags,
        stats,
        setActiveNoteId,
        setSearchQuery,
        setSelectedTag,
        setFilterCategory,
        setSortOption,
        setViewMode: setViewModeWithStorage,
        createNote,
        getNoteById,
        updateNote,
        deleteNote,
        duplicateNote,
        toggleFavorite,
        toggleArchive,
        updateShareSettings,
        getSharedNote,
        filteredNotes,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};
