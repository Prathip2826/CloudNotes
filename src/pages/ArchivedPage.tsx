import React, { useState } from 'react';
import { Archive, Search, LayoutGrid, List, X, ArchiveRestore } from 'lucide-react';
import { useNotes } from '../context/NotesContext';
import { NoteCard } from '../components/NoteCard';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { ShareModal } from '../components/ShareModal';
import { Note, ActivePage } from '../types';

interface ArchivedPageProps {
  onNavigate: (page: ActivePage) => void;
  onOpenEditor: (noteId?: string) => void;
}

export const ArchivedPage: React.FC<ArchivedPageProps> = ({
  onNavigate,
  onOpenEditor,
}) => {
  const { notes, viewMode, setViewMode, deleteNote } = useNotes();

  const [search, setSearch] = useState('');
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const [noteToShare, setNoteToShare] = useState<Note | null>(null);

  const archivedNotes = notes
    .filter((n) => n.archived)
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

  return (
    <div id="archived-page" className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-slate-500/10 text-slate-500">
              <Archive className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Archived Notes
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Notes you've archived to keep your main workspace clean
          </p>
        </div>
      </div>

      {/* Search & Layout Control */}
      <div className="flex items-center justify-between gap-3 p-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            id="archived-search-input"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search archived notes..."
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
      {archivedNotes.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-4 border border-slate-200 dark:border-slate-700">
            <ArchiveRestore className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {search ? 'No matching archived notes' : 'No archived notes'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            {search
              ? 'Try a different search keyword.'
              : 'Archive completed notes or projects to safely store them away from your dashboard.'}
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="px-4 py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Browse Active Notes →
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
          {archivedNotes.map((note) => (
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
        title="Permanently delete this archived note?"
        message="This action cannot be undone and will permanently remove this note."
        confirmLabel="Delete Permanently"
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
