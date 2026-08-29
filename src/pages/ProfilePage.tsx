import React from 'react';
import {
  User,
  Mail,
  ShieldCheck,
  Calendar,
  Key,
  FileText,
  Star,
  Tag,
  Share2,
  Settings,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotes } from '../context/NotesContext';
import { ActivePage } from '../types';
import { formatTimestampDate } from '../utils/date';

interface ProfilePageProps {
  onNavigate: (page: ActivePage) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate }) => {
  const { userProfile, user, logout } = useAuth();
  const { stats, allTags } = useNotes();

  const joinedDate = userProfile?.createdAt
    ? formatTimestampDate(userProfile.createdAt, 'MMMM d, yyyy')
    : 'Recent Member';

  const authProvider =
    user?.providerData?.[0]?.providerId === 'google.com'
      ? 'Google OAuth 2.0'
      : 'Email & Password';

  return (
    <div id="profile-page" className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-8">
      {/* Profile Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs relative overflow-hidden">
        {/* Background gradient banner */}
        <div className="h-28 -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 mb-6" />

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20">
          <div className="flex items-end gap-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white dark:bg-slate-900 p-1 shadow-xl shrink-0">
              <div className="w-full h-full rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-2xl overflow-hidden">
                {userProfile?.photoURL ? (
                  <img
                    src={userProfile.photoURL}
                    alt={userProfile.displayName || 'User'}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  (userProfile?.displayName || user?.email || 'U')[0].toUpperCase()
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  {userProfile?.displayName || 'CloudNotes User'}
                </h1>
                <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  <ShieldCheck className="w-3 h-3" /> Verified
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                <Mail className="w-3.5 h-3.5" />
                {user?.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2 sm:mt-0">
            <button
              id="profile-settings-btn"
              type="button"
              onClick={() => onNavigate('settings')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Settings</span>
            </button>
            <button
              id="profile-logout-btn"
              type="button"
              onClick={logout}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Breakdown Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
            <FileText className="w-4 h-4 text-indigo-500" />
            <span>Total Notes</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
            {stats.total}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
            <Star className="w-4 h-4 text-amber-500" />
            <span>Favorites</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
            {stats.favorites}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
            <Tag className="w-4 h-4 text-purple-500" />
            <span>Unique Tags</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
            {allTags.length}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
            <Share2 className="w-4 h-4 text-emerald-500" />
            <span>Shared Links</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
            {stats.shared}
          </div>
        </div>
      </div>

      {/* Account Details & Security Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Key className="w-4 h-4 text-indigo-500" />
          <span>Account & Authentication Credentials</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-slate-400 font-semibold uppercase text-[10px]">
              Authentication Provider
            </span>
            <div className="font-semibold text-slate-800 dark:text-slate-200 mt-1">
              {authProvider}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-slate-400 font-semibold uppercase text-[10px]">
              Member Since
            </span>
            <div className="font-semibold text-slate-800 dark:text-slate-200 mt-1">
              {joinedDate}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 sm:col-span-2">
            <span className="text-slate-400 font-semibold uppercase text-[10px]">
              Firebase User Identifier (UID)
            </span>
            <div className="font-mono text-[11px] text-slate-700 dark:text-slate-300 truncate mt-1">
              {user?.uid || 'Unknown'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
