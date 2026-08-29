import React, { useState } from 'react';
import { Tag as TagIcon, Plus, Hash, FolderOpen } from 'lucide-react';
import { useNotes } from '../context/NotesContext';
import { NoteCard } from '../components/NoteCard';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { ShareModal } from '../components/ShareModal';
import { Note, ActivePage } from '../types';

interface TagsPageProps {
  onNavigate: (page: ActivePage) => void;
  onOpenEditor: (noteId?: string) => void;
}

export const TagsPage: React.FC<TagsPageProps> = ({
  onNavigate,
  onOpenEditor,
}) => {
  const { notes, allTags, viewMode, deleteNote, createNote } = useNotes();

  const [activeTag, setActiveTag] = useState<string | null>(
    allTags.length > 0 ? allTags[0] : null
  );
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const [noteToShare, setNoteToShare] = useState<Note | null>(null);

  // Group tags with counts
  const tagCounts = allTags.map((tag) => {
    const count = notes.filter((n) => !n.archived && n.tags?.includes(tag)).length;
    return { tag, count };
  });

  const matchingNotes = activeTag
    ? notes.filter((n) => !n.archived && n.tags?.includes(activeTag))
    : [];

  const handleConfirmDelete = async () => {
    if (!noteToDelete) return;
    await deleteNote(noteToDelete.id);
    setNoteToDelete(null);
  };

  const handleCreateWithTag = async () => {
    try {
      const newId = await createNote(
        'Untitled Note',
        '',
        activeTag ? [activeTag] : []
      );
      onOpenEditor(newId);
    } catch {
      onOpenEditor();
    }
  };

  return (
    <div id="tags-page" className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <TagIcon className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Tags & Categories
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Organize notes using dynamic keyword tags
          </p>
        </div>

        {activeTag && (
          <button
            type="button"
            onClick={handleCreateWithTag}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-600/25 transition-all cursor-pointer w-fit"
          >
            <Plus className="w-4 h-4" />
            <span>Note with #{activeTag}</span>
          </button>
        )}
      </div>

      {allTags.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4 border border-indigo-200 dark:border-indigo-800">
            <Hash className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            No tags found
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            You haven't tagged any notes yet. Open a note in the editor and add tags to group your notes effortlessly.
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Tag List Sidebar */}
          <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-3 space-y-1 h-fit">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1 block">
              All Tags ({allTags.length})
            </span>
            {tagCounts.map(({ tag, count }) => (
              <button
                key={tag}
                type="button"
                onClick={() => setActiveTag(tag)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeTag === tag
                    ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 font-semibold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <TagIcon className="w-3.5 h-3.5 opacity-60" />
                  <span className="truncate">{tag}</span>
                </div>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full ${
                    activeTag === tag
                      ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            ))}
          </div>

          {/* Notes for selected tag */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Tagged with</span>
                <span className="px-2.5 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 text-xs">
                  #{activeTag}
                </span>
              </h2>
              <span className="text-xs text-slate-400">
                {matchingNotes.length} {matchingNotes.length === 1 ? 'note' : 'notes'}
              </span>
            </div>

            {matchingNotes.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                <FolderOpen className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs text-slate-500">No active notes with this tag.</p>
              </div>
            ) : (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 gap-4'
                    : 'space-y-3'
                }
              >
                {matchingNotes.map((note) => (
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
          </div>
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
