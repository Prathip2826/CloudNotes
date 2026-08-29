import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  ArrowLeft,
  Star,
  Archive,
  ArchiveRestore,
  Share2,
  Trash2,
  Copy,
  Check,
  RefreshCw,
  Clock,
  FileDown,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { useNotes } from '../context/NotesContext';
import { useToast } from '../context/ToastContext';
import { MarkdownToolbar } from '../components/MarkdownToolbar';
import { TagSelector } from '../components/TagSelector';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { ShareModal } from '../components/ShareModal';
import { Note, ActivePage } from '../types';

interface NoteEditorPageProps {
  noteId?: string;
  onNavigate: (page: ActivePage) => void;
}

export const NoteEditorPage: React.FC<NoteEditorPageProps> = ({
  noteId,
  onNavigate,
}) => {
  const {
    notes,
    getNoteById,
    updateNote,
    deleteNote,
    duplicateNote,
    toggleFavorite,
    toggleArchive,
    createNote,
  } = useNotes();
  const { addToast } = useToast();

  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);
  const [editorMode, setEditorMode] = useState<'edit' | 'preview' | 'split'>('split');
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialLoadRef = useRef(true);

  // Initialize or fetch active note
  useEffect(() => {
    let current: Note | undefined;

    if (noteId) {
      current = getNoteById(noteId);
    }

    if (current) {
      setActiveNote(current);
      setTitle(current.title || '');
      setBody(current.body || '');
      setTags(current.tags || []);
      isInitialLoadRef.current = true;
    } else if (noteId) {
      // If noteId was passed but not found in cache yet
      const found = notes.find((n) => n.id === noteId);
      if (found) {
        setActiveNote(found);
        setTitle(found.title || '');
        setBody(found.body || '');
        setTags(found.tags || []);
        isInitialLoadRef.current = true;
      }
    }
  }, [noteId, notes, getNoteById]);

  // Debounced auto-save function
  const performSave = useCallback(
    async (noteToSaveId: string, newTitle: string, newBody: string, newTags: string[]) => {
      setIsSaving(true);
      try {
        await updateNote(noteToSaveId, {
          title: newTitle,
          body: newBody,
          tags: newTags,
        });
        setLastSavedTime(new Date());
      } catch (err) {
        console.error('Auto-save error:', err);
      } finally {
        setIsSaving(false);
      }
    },
    [updateNote]
  );

  // Trigger debounced save on state change
  useEffect(() => {
    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false;
      return;
    }

    if (!activeNote?.id) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    setIsSaving(true);
    saveTimeoutRef.current = setTimeout(() => {
      performSave(activeNote.id, title, body, tags);
    }, 600);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [title, body, tags, activeNote?.id, performSave]);

  const handleDelete = async () => {
    if (!activeNote) return;
    await deleteNote(activeNote.id);
    setShowDeleteConfirm(false);
    onNavigate('dashboard');
  };

  const handleDuplicate = async () => {
    if (!activeNote) return;
    const newId = await duplicateNote(activeNote.id);
    if (newId) {
      onNavigate('dashboard');
    }
  };

  // Export note as markdown file
  const handleExportMarkdown = () => {
    const filename = `${(title || 'untitled-note').toLowerCase().replace(/[^a-z0-9]/g, '-')}.md`;
    const content = `# ${title || 'Untitled Note'}\n\nTags: ${tags.join(', ')}\n\n---\n\n${body}`;
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    addToast('Note exported as Markdown file', 'success');
  };

  // Word & Character count calculations
  const wordCount = body.trim() ? body.trim().split(/\s+/).length : 0;
  const charCount = body.length;

  return (
    <div
      id="note-editor-page"
      className={`min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col ${
        isFullscreen ? 'fixed inset-0 z-50 overflow-y-auto' : ''
      }`}
    >
      {/* Editor Top Bar */}
      <header className="sticky top-0 z-20 flex items-center justify-between gap-2 px-4 py-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-3 min-w-0">
          <button
            id="editor-back-btn"
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="p-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Return to Dashboard"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Sync & Auto-save status */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 truncate">
            {isSaving ? (
              <span className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-medium">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Saving...
              </span>
            ) : lastSavedTime ? (
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <Check className="w-3.5 h-3.5" /> Saved
              </span>
            ) : (
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Synced to Cloud
              </span>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          {activeNote && (
            <>
              {/* Star Favorite */}
              <button
                id="editor-favorite-btn"
                type="button"
                onClick={() => toggleFavorite(activeNote.id)}
                className={`p-2 rounded-xl transition-colors ${
                  activeNote.favorite
                    ? 'text-amber-500 hover:text-amber-600 bg-amber-50 dark:bg-amber-950/50'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title={activeNote.favorite ? 'Unstar Note' : 'Star Note'}
                aria-label="Favorite"
              >
                <Star className={`w-4 h-4 ${activeNote.favorite ? 'fill-amber-500' : ''}`} />
              </button>

              {/* Share Note */}
              <button
                id="editor-share-btn"
                type="button"
                onClick={() => setShowShareModal(true)}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Share Note Link"
                aria-label="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>

              {/* Archive / Unarchive */}
              <button
                id="editor-archive-btn"
                type="button"
                onClick={() => toggleArchive(activeNote.id)}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title={activeNote.archived ? 'Unarchive' : 'Archive'}
                aria-label="Archive"
              >
                {activeNote.archived ? (
                  <ArchiveRestore className="w-4 h-4" />
                ) : (
                  <Archive className="w-4 h-4" />
                )}
              </button>

              {/* Duplicate */}
              <button
                id="editor-duplicate-btn"
                type="button"
                onClick={handleDuplicate}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors hidden sm:inline-flex"
                title="Duplicate Note"
                aria-label="Duplicate"
              >
                <Copy className="w-4 h-4" />
              </button>

              {/* Export Markdown */}
              <button
                id="editor-export-btn"
                type="button"
                onClick={handleExportMarkdown}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors hidden sm:inline-flex"
                title="Export Markdown (.md)"
                aria-label="Export"
              >
                <FileDown className="w-4 h-4" />
              </button>

              {/* Fullscreen Mode */}
              <button
                type="button"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors hidden md:inline-flex"
                title="Toggle Fullscreen"
                aria-label="Fullscreen"
              >
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </button>

              {/* Delete Note */}
              <button
                id="editor-delete-btn"
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 rounded-xl text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors ml-1"
                title="Delete Note"
                aria-label="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </header>

      {/* Main Workspace Area */}
      <main className="flex-1 flex flex-col max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden">
          {/* Note Metadata Area: Title & Tags */}
          <div className="p-6 pb-4 space-y-4 border-b border-slate-100 dark:border-slate-800">
            <input
              id="note-title-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note Title..."
              className="w-full text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white bg-transparent border-0 focus:outline-hidden placeholder-slate-300 dark:placeholder-slate-700"
            />

            {/* Tag Selector */}
            <div className="flex items-center gap-2">
              <TagSelector tags={tags} onChange={(newTags) => setTags(newTags)} />
            </div>
          </div>

          {/* Markdown Toolbar */}
          <MarkdownToolbar
            textareaRef={textareaRef}
            bodyValue={body}
            onBodyChange={(newBody) => setBody(newBody)}
            editorMode={editorMode}
            setEditorMode={(mode) => setEditorMode(mode)}
          />

          {/* Editor Core Content Container */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800 min-h-[420px]">
            {/* Raw Markdown Editor Pane */}
            {(editorMode === 'edit' || editorMode === 'split') && (
              <div
                className={`p-6 flex flex-col ${
                  editorMode === 'edit' ? 'md:col-span-2' : ''
                }`}
              >
                <textarea
                  id="note-body-textarea"
                  ref={textareaRef}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Start typing your note here in Markdown... Use # for headings, - for lists, or `code` for code blocks."
                  className="w-full h-full min-h-[350px] bg-transparent border-0 focus:outline-hidden resize-none font-mono text-sm leading-relaxed text-slate-800 dark:text-slate-200 placeholder-slate-400"
                />
              </div>
            )}

            {/* Rendered Markdown Preview Pane */}
            {(editorMode === 'preview' || editorMode === 'split') && (
              <div
                id="note-markdown-preview-pane"
                className={`p-6 overflow-y-auto ${
                  editorMode === 'preview' ? 'md:col-span-2' : ''
                }`}
              >
                {body.trim() ? (
                  <div className="markdown-body prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {body}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-slate-400 italic">
                    Live markdown preview will appear here as you type...
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Statistics */}
          <div className="flex items-center justify-between px-6 py-3 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400">
            <div className="flex items-center gap-4">
              <span>{wordCount} words</span>
              <span>•</span>
              <span>{charCount} characters</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Real-Time Cloud Sync Active</span>
            </div>
          </div>
        </div>
      </main>

      {/* Share Modal */}
      {activeNote && (
        <ShareModal
          isOpen={showShareModal}
          note={{ ...activeNote, title, body, tags }}
          onClose={() => setShowShareModal(false)}
        />
      )}

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete this note?"
        message="Are you sure you want to delete this note? This action cannot be undone and will permanently remove it from your cloud storage."
        confirmLabel="Delete Note"
        isDestructive={true}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
};
