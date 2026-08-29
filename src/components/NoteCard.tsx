import React, { useState, useRef, useEffect } from 'react';
import {
  Star,
  MoreVertical,
  Edit2,
  Copy,
  Archive,
  ArchiveRestore,
  Share2,
  Trash2,
  Tag as TagIcon,
  Globe,
  Clock,
} from 'lucide-react';
import { Note, ViewMode } from '../types';
import { useNotes } from '../context/NotesContext';
import { formatTimestampRelative } from '../utils/date';

interface NoteCardProps {
  note: Note;
  viewMode: ViewMode;
  onSelect: (noteId: string) => void;
  onShare: (note: Note) => void;
  onDelete: (note: Note) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  viewMode,
  onSelect,
  onShare,
  onDelete,
}) => {
  const { toggleFavorite, toggleArchive, duplicateNote } = useNotes();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  // Clean Markdown preview excerpt
  const getExcerpt = (text: string) => {
    if (!text) return 'Empty note';
    const clean = text
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/[*_~`>#-]/g, '')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .trim();
    return clean || 'No text content';
  };

  const getFormattedTime = () => {
    return formatTimestampRelative(note.updatedAt);
  };

  if (viewMode === 'list') {
    return (
      <div
        id={`note-card-${note.id}`}
        onClick={() => onSelect(note.id)}
        className="group relative flex items-center justify-between gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400/80 dark:hover:border-indigo-500/50 shadow-xs hover:shadow-md transition-all cursor-pointer"
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(note.id);
            }}
            className={`p-1.5 rounded-lg transition-colors shrink-0 ${
              note.favorite
                ? 'text-amber-500 hover:text-amber-600'
                : 'text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400'
            }`}
            aria-label={note.favorite ? 'Unfavorite' : 'Favorite'}
          >
            <Star className={`w-4 h-4 ${note.favorite ? 'fill-amber-500' : ''}`} />
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                {note.title || 'Untitled Note'}
              </h3>
              {note.shared && (
                <span
                  title="Sharing enabled"
                  className="inline-flex items-center text-[10px] px-1.5 py-0.5 rounded-sm bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800"
                >
                  <Globe className="w-2.5 h-2.5 mr-0.5" /> Shared
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5 max-w-xl">
              {getExcerpt(note.body)}
            </p>
          </div>
        </div>

        {/* Tags & Time */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="hidden md:flex items-center gap-1.5">
            {note.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              >
                <TagIcon className="w-2.5 h-2.5 text-slate-400" />
                {tag}
              </span>
            ))}
            {note.tags.length > 3 && (
              <span className="text-[10px] text-slate-400 font-medium">
                +{note.tags.length - 3}
              </span>
            )}
          </div>

          <span className="text-xs text-slate-400 flex items-center gap-1 shrink-0">
            <Clock className="w-3 h-3" />
            {getFormattedTime()}
          </span>

          {/* More Menu */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Note options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <div
                className="absolute right-0 top-8 z-30 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1 text-xs"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onSelect(note.id);
                  }}
                  className="w-full flex items-center gap-2 px-3.5 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit Note
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    duplicateNote(note.id);
                  }}
                  className="w-full flex items-center gap-2 px-3.5 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" /> Duplicate
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onShare(note);
                  }}
                  className="w-full flex items-center gap-2 px-3.5 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" /> Share Link
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    toggleArchive(note.id);
                  }}
                  className="w-full flex items-center gap-2 px-3.5 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {note.archived ? (
                    <>
                      <ArchiveRestore className="w-3.5 h-3.5" /> Unarchive
                    </>
                  ) : (
                    <>
                      <Archive className="w-3.5 h-3.5" /> Archive Note
                    </>
                  )}
                </button>
                <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(note);
                  }}
                  className="w-full flex items-center gap-2 px-3.5 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete Note
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Grid Card View
  return (
    <div
      id={`note-card-${note.id}`}
      onClick={() => onSelect(note.id)}
      className="group relative flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400/80 dark:hover:border-indigo-500/50 shadow-xs hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 cursor-pointer min-h-[190px]"
    >
      <div>
        {/* Top Bar: Title & Favorite/Menu */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 leading-snug line-clamp-2">
            {note.title || 'Untitled Note'}
          </h3>

          <div className="flex items-center gap-1 shrink-0 -mr-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(note.id);
              }}
              className={`p-1.5 rounded-lg transition-colors ${
                note.favorite
                  ? 'text-amber-500 hover:text-amber-600'
                  : 'text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400'
              }`}
              aria-label={note.favorite ? 'Unfavorite' : 'Favorite'}
            >
              <Star className={`w-4 h-4 ${note.favorite ? 'fill-amber-500' : ''}`} />
            </button>

            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(!menuOpen);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="More options"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {menuOpen && (
                <div
                  className="absolute right-0 top-8 z-30 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1 text-xs"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onSelect(note.id);
                    }}
                    className="w-full flex items-center gap-2 px-3.5 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit Note
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      duplicateNote(note.id);
                    }}
                    className="w-full flex items-center gap-2 px-3.5 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" /> Duplicate
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onShare(note);
                    }}
                    className="w-full flex items-center gap-2 px-3.5 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" /> Share Link
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      toggleArchive(note.id);
                    }}
                    className="w-full flex items-center gap-2 px-3.5 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    {note.archived ? (
                      <>
                        <ArchiveRestore className="w-3.5 h-3.5" /> Unarchive
                      </>
                    ) : (
                      <>
                        <Archive className="w-3.5 h-3.5" /> Archive Note
                      </>
                    )}
                  </button>
                  <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onDelete(note);
                    }}
                    className="w-full flex items-center gap-2 px-3.5 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete Note
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Excerpt */}
        <p className="mt-2.5 text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
          {getExcerpt(note.body)}
        </p>
      </div>

      {/* Footer: Tags & Time */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-col gap-2">
        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            {note.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              >
                <TagIcon className="w-2.5 h-2.5 text-slate-400" />
                {tag}
              </span>
            ))}
            {note.tags.length > 3 && (
              <span className="text-[10px] text-slate-400 font-medium">
                +{note.tags.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {getFormattedTime()}
          </span>

          {note.shared && (
            <span
              title="Sharing enabled"
              className="inline-flex items-center text-[10px] px-1.5 py-0.5 rounded-sm bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800"
            >
              <Globe className="w-2.5 h-2.5 mr-0.5" /> Shared
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
