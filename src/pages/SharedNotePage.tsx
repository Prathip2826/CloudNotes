import React, { useState, useEffect } from 'react';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { db } from '../lib/firebase';
import {
  Cloud,
  Globe,
  Calendar,
  Tag as TagIcon,
  Copy,
  Check,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import { Note, ActivePage } from '../types';
import { formatTimestampDate } from '../utils/date';

interface SharedNotePageProps {
  userId: string;
  noteId: string;
  onNavigate: (page: ActivePage) => void;
}

export const SharedNotePage: React.FC<SharedNotePageProps> = ({
  userId,
  noteId,
  onNavigate,
}) => {
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState<
    'not_found' | 'expired' | 'revoked' | 'network_error' | null
  >(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchSharedNote = async () => {
      if (!userId || !noteId) {
        setErrorStatus('not_found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const noteDocRef = doc(db, 'users', userId, 'notes', noteId);
        const snapshot = await getDoc(noteDocRef);

        if (!snapshot.exists()) {
          setErrorStatus('not_found');
          return;
        }

        const data = snapshot.data();

        // Check if sharing is enabled
        if (!data.shared) {
          setErrorStatus('revoked');
          return;
        }

        // Check if share link has expired
        if (data.shareExpiresAt) {
          const expiresAt = (data.shareExpiresAt as Timestamp).toDate();
          if (new Date() > expiresAt) {
            setErrorStatus('expired');
            return;
          }
        }

        setNote({
          id: snapshot.id,
          ...data,
        } as Note);
      } catch (err) {
        console.error('Error fetching shared note:', err);
        setErrorStatus('network_error');
      } finally {
        setLoading(false);
      }
    };

    fetchSharedNote();
  }, [userId, noteId]);

  const handleCopyContent = () => {
    if (!note) return;
    navigator.clipboard.writeText(`# ${note.title}\n\n${note.body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedDate = note?.updatedAt
    ? formatTimestampDate(note.updatedAt, 'MMMM d, yyyy')
    : 'Recently';

  return (
    <div id="shared-note-page" className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-20 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2 text-left"
          >
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
              <Cloud className="w-4 h-4" />
            </div>
            <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white">
              CloudNotes
            </span>
          </button>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <Globe className="w-3.5 h-3.5" /> Shared Public Note
            </span>

            <button
              type="button"
              onClick={() => onNavigate('signup')}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
            >
              Join CloudNotes
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {loading ? (
          <div className="text-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
            <p className="text-sm text-slate-500">Loading shared note...</p>
          </div>
        ) : errorStatus ? (
          <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-200 dark:border-amber-800">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {errorStatus === 'expired'
                ? 'Share Link Has Expired'
                : errorStatus === 'revoked'
                ? 'Note Is No Longer Shared'
                : errorStatus === 'not_found'
                ? 'Note Not Found'
                : 'Unable to Load Note'}
            </h2>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              {errorStatus === 'expired'
                ? 'The author specified an expiration time for this link which has now passed.'
                : errorStatus === 'revoked'
                ? 'The author has turned off public link sharing for this note.'
                : 'This note may have been deleted or the share URL is incomplete.'}
            </p>

            <div className="mt-6">
              <button
                type="button"
                onClick={() => onNavigate('landing')}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md transition-colors"
              >
                Go to CloudNotes Homepage
              </button>
            </div>
          </div>
        ) : note ? (
          <article className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl p-6 sm:p-10">
            {/* Note Meta Header */}
            <div className="border-b border-slate-100 dark:border-slate-800 pb-6 mb-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Last updated {formattedDate}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" /> Read-Only View
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleCopyContent}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Note</span>
                    </>
                  )}
                </button>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
                {note.title || 'Untitled Note'}
              </h1>

              {/* Tags */}
              {note.tags && note.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {note.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60"
                    >
                      <TagIcon className="w-3 h-3 text-indigo-500" />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Note Markdown Body */}
            <div className="markdown-body prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 leading-relaxed">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {note.body || '_This note has no body text._'}
              </ReactMarkdown>
            </div>

            {/* Bottom Promo Card */}
            <div className="mt-12 p-6 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-sm text-indigo-950 dark:text-indigo-200">
                  Like this note? Create your own on CloudNotes
                </h4>
                <p className="text-xs text-indigo-700/80 dark:text-indigo-400 mt-0.5">
                  Organize, search, and synchronize your thoughts in real time with end-to-end cloud storage.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('signup')}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors shrink-0 flex items-center gap-1.5"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </article>
        ) : null}
      </main>
    </div>
  );
};
