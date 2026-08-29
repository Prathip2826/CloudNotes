import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Share2, Copy, Check, Clock, Globe, Lock, X, ShieldAlert, ExternalLink } from 'lucide-react';
import { Note } from '../types';
import { useNotes } from '../context/NotesContext';
import { useToast } from '../context/ToastContext';

interface ShareModalProps {
  isOpen: boolean;
  note: Note | null;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, note, onClose }) => {
  const { updateShareSettings } = useNotes();
  const { addToast } = useToast();

  const [copied, setCopied] = useState(false);
  const [expiryOption, setExpiryOption] = useState<'1h' | '1d' | '7d' | 'forever' | 'custom'>('7d');
  const [customDate, setCustomDate] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !note) return null;

  // Generate public link
  const shareUrl = `${window.location.origin}/#share/${note.userId || 'user'}/${note.id}`;

  const calculateExpiry = (): Date | null => {
    const now = new Date();
    if (expiryOption === '1h') return new Date(now.getTime() + 60 * 60 * 1000);
    if (expiryOption === '1d') return new Date(now.getTime() + 24 * 60 * 60 * 1000);
    if (expiryOption === '7d') return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    if (expiryOption === 'custom' && customDate) return new Date(customDate);
    return null; // Forever
  };

  const handleToggleSharing = async (enable: boolean) => {
    setLoading(true);
    try {
      if (enable) {
        const expiry = calculateExpiry();
        await updateShareSettings(note.id, true, expiry);
      } else {
        await updateShareSettings(note.id, false, null);
      }
    } catch (err: any) {
      addToast(err.message || 'Failed to update share settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveExpiry = async () => {
    setLoading(true);
    try {
      const expiry = calculateExpiry();
      await updateShareSettings(note.id, true, expiry);
    } catch (err: any) {
      addToast(err.message || 'Failed to update expiry', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      addToast('Share link copied to clipboard', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback
      addToast('Copied URL: ' + shareUrl, 'info');
    }
  };

  return (
    <AnimatePresence>
      <div id="share-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          id="share-modal-content"
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  Share Note
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs">
                  {note.title || 'Untitled Note'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close share dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-5 space-y-5">
            {/* Sharing Toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50">
              <div className="flex items-center gap-3">
                {note.shared ? (
                  <Globe className="w-5 h-5 text-emerald-500" />
                ) : (
                  <Lock className="w-5 h-5 text-slate-400" />
                )}
                <div>
                  <div className="text-sm font-medium text-slate-900 dark:text-white">
                    {note.shared ? 'Public Link Sharing Active' : 'Private (Only You)'}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {note.shared
                      ? 'Anyone with the secure link can view this note in read-only mode'
                      : 'Enable link sharing to allow others to view this note'}
                  </div>
                </div>
              </div>
              <button
                id="share-toggle-btn"
                type="button"
                disabled={loading}
                onClick={() => handleToggleSharing(!note.shared)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  note.shared ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    note.shared ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* If Sharing is Enabled */}
            {note.shared && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-4"
              >
                {/* Link Box */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    Shareable Link
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      id="shareable-link-input"
                      type="text"
                      readOnly
                      value={shareUrl}
                      className="w-full px-3.5 py-2.5 text-xs font-mono bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-hidden"
                    />
                    <button
                      id="copy-share-link-btn"
                      onClick={handleCopyLink}
                      className="flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors shrink-0"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 text-white" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Expiration Settings */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <Clock className="w-4 h-4 text-indigo-500" />
                    <span>Link Expiration</span>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {(['1h', '1d', '7d', 'forever'] as const).map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setExpiryOption(opt);
                        }}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                          expiryOption === opt
                            ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-600 dark:text-indigo-300'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                        }`}
                      >
                        {opt === '1h' ? '1 Hour' : opt === '1d' ? '1 Day' : opt === '7d' ? '7 Days' : 'Never'}
                      </button>
                    ))}
                  </div>

                  {expiryOption === 'custom' && (
                    <div className="mt-2">
                      <input
                        type="datetime-local"
                        value={customDate}
                        onChange={(e) => setCustomDate(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {note.shareExpiresAt
                        ? `Expires: ${new Date(
                            typeof note.shareExpiresAt.toDate === 'function'
                              ? note.shareExpiresAt.toDate()
                              : note.shareExpiresAt.seconds * 1000
                          ).toLocaleString()}`
                        : 'Currently does not expire'}
                    </span>
                    <button
                      type="button"
                      disabled={loading}
                      onClick={handleSaveExpiry}
                      className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      Update Expiry
                    </button>
                  </div>
                </div>

                {/* Read Only Notice */}
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 text-amber-800 dark:text-amber-300 text-xs leading-relaxed">
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                  <span>
                    Shared notes are strictly <strong>READ-ONLY</strong> for public viewers. Public visitors cannot edit, tag, or delete your content.
                  </span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              id="share-modal-done-btn"
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
