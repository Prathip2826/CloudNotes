import React, { useState } from 'react';
import { Star, Search, Plus, LayoutGrid, List, FolderOpen, X } from 'lucide-react';
import { useNotes } from '../context/NotesContext';
import { NoteCard } from '../components/NoteCard';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { ShareModal } from '../components/ShareModal';
import { Note, ActivePage } from '../types';

interface FavoritesPageProps {
  onNavigate: (page: ActivePage) => void;
  onOpenEditor: (noteId?: string) => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({
  onNavigate,
  onOpenEditor,
}) => {
  const { notes, viewMode, setViewMode, deleteNote, createNote } = useNotes();

  const [search, setSearch] = useState('');
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const [noteToShare, setNoteToShare] = useState<Note | null>(null);

  const favoriteNotes = notes
    .filter((n) => !n.archived && n.favorite)
    .filter(
      (n) =>
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.body.toLowerCase().includes(search.toLowerCase()) ||
        n.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
    );

  const handleConfirmDelete = async () => {
    if (!noteToDelete) return;
    await deleteNote(noteToDelete.id);
    setNoteToDelete(null);
  };

  const handleCreateNew = async () => {
    try {
      const newId = await createNote();
      onOpenEditor(newId);
    } catch {
      onOpenEditor();
    }
  };

  return (
    <div id="favorites-page" className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <Star className="w-5 h-5 fill-amber-500" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Favorite Notes
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Quickly access the notes you've marked as important
          </p>
        </div>

        <button
          id="favorites-new-note-btn"
          type="button"
          onClick={handleCreateNew}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-600/25 transition-all cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>New Note</span>
        </button>
      </div>

      {/* Search & Layout Control */}
      <div className="flex items-center justify-between gap-3 p-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            id="favorites-search-input"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search favorite notes..."
            className="w-full pl-10 pr-10 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/60 border border-transparent rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* View Toggle */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl shrink-0">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg transition-all ${
              viewMode === 'grid'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-400 hover:text-slate-600'
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-lg transition-all ${
              viewMode === 'list'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-400 hover:text-slate-600'
            }`}
            title="List View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid or List */}
      {favoriteNotes.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center mx-auto mb-4 border border-amber-200 dark:border-amber-800">
            <Star className="w-7 h-7 fill-amber-500/20" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {search ? 'No matching favorite notes' : 'No favorites yet'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            {search
              ? 'Try a different search keyword.'
              : 'Click the star icon on any note card or editor to pin it here.'}
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="px-4 py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Browse All Notes →
            </button>
          </div>
        </div>
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
              : 'space-y-3'
          }
        >
          {favoriteNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              viewMode={viewMode}
              onSelect={(id) => onOpenEditor(id)}
              onShare={(n) => setNoteToShare(n)}
              onDelete={(n) => setNoteToDelete(n)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <ConfirmDialog
        isOpen={Boolean(noteToDelete)}
        title="Delete this note?"
        message="Are you sure you want to delete this note? This action cannot be undone."
        confirmLabel="Delete Note"
        isDestructive={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setNoteToDelete(null)}
      />

      <ShareModal
        isOpen={Boolean(noteToShare)}
        note={noteToShare}
        onClose={() => setNoteToShare(null)}
      />
    </div>
  );
};
