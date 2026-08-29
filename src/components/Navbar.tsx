import React from 'react';
import { Menu, Plus, Cloud, Sun, Moon, Laptop, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ActivePage } from '../types';

interface NavbarProps {
  onMenuToggle: () => void;
  onNavigate: (page: ActivePage) => void;
  onNewNote: () => void;
  currentPage: ActivePage;
}

export const Navbar: React.FC<NavbarProps> = ({
  onMenuToggle,
  onNavigate,
  onNewNote,
}) => {
  const { userProfile, user } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <header className="md:hidden sticky top-0 z-20 flex items-center justify-between h-14 px-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800">
      <div className="flex items-center gap-3">
        <button
          id="mobile-menu-toggle-btn"
          type="button"
          onClick={onMenuToggle}
          className="p-1.5 -ml-1 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2 text-left"
        >
          <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
            <Cloud className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white">
            CloudNotes
          </span>
        </button>
      </div>

      <div className="flex items-center gap-1.5">
        {/* Quick New Note */}
        <button
          id="mobile-nav-new-note-btn"
          type="button"
          onClick={onNewNote}
          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Note</span>
        </button>

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* User avatar */}
        <button
          type="button"
          onClick={() => onNavigate('profile')}
          className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden shadow-xs ml-1"
        >
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
        </button>
      </div>
    </header>
  );
};
