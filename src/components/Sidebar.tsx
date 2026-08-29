import React from 'react';
import {
  FileText,
  Star,
  Archive,
  Share2,
  Tag as TagIcon,
  Settings,
  User as UserIcon,
  LogOut,
  Plus,
  Cloud,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Laptop,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotes } from '../context/NotesContext';
import { useTheme } from '../context/ThemeContext';
import { ActivePage } from '../types';

interface SidebarProps {
  currentPage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  collapsed: boolean;
  setCollapsed: (c: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (o: boolean) => void;
  onNewNote: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
  onNewNote,
}) => {
  const { userProfile, user, logout } = useAuth();
  const { stats, allTags, selectedTag, setSelectedTag, setFilterCategory } = useNotes();
  const { theme, setTheme } = useTheme();

  const navItems = [
    {
      id: 'dashboard' as ActivePage,
      label: 'All Notes',
      icon: FileText,
      count: stats.total,
      filter: 'all' as const,
    },
    {
      id: 'favorites' as ActivePage,
      label: 'Favorites',
      icon: Star,
      count: stats.favorites,
      filter: 'favorites' as const,
    },
    {
      id: 'archived' as ActivePage,
      label: 'Archived',
      icon: Archive,
      count: stats.archived,
      filter: 'archived' as const,
    },
    {
      id: 'dashboard' as ActivePage,
      pageKey: 'shared_filter',
      label: 'Shared Links',
      icon: Share2,
      count: stats.shared,
      filter: 'shared' as const,
    },
    {
      id: 'tags' as ActivePage,
      label: 'Tags',
      icon: TagIcon,
      count: allTags.length,
    },
    {
      id: 'settings' as ActivePage,
      label: 'Settings',
      icon: Settings,
    },
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.filter) {
      setFilterCategory(item.filter);
      setSelectedTag(null);
    }
    onNavigate(item.id);
    setMobileOpen(false);
  };

  const handleTagClick = (tag: string) => {
    setSelectedTag(selectedTag === tag ? null : tag);
    setFilterCategory('all');
    onNavigate('dashboard');
    setMobileOpen(false);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 select-none">
      {/* Brand Header */}
      <div className="flex items-center justify-between p-4 h-16 border-b border-slate-100 dark:border-slate-800">
        <button
          type="button"
          onClick={() => {
            onNavigate('dashboard');
            setMobileOpen(false);
          }}
          className="flex items-center gap-2.5 focus:outline-hidden text-left"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0">
            <Cloud className="w-5 h-5" />
          </div>
          {!collapsed && (
            <div>
              <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                CloudNotes
                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                  Cloud
                </span>
              </span>
            </div>
          )}
        </button>

        {/* Collapse button on desktop */}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* New Note Button */}
      <div className="p-3">
        <button
          id="sidebar-new-note-btn"
          type="button"
          onClick={() => {
            onNewNote();
            setMobileOpen(false);
          }}
          className={`w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-md shadow-indigo-600/20 transition-all text-sm group ${
            collapsed ? 'px-0' : ''
          }`}
          title="Create New Note"
        >
          <Plus className="w-4 h-4 shrink-0 group-hover:rotate-90 transition-transform duration-200" />
          {!collapsed && <span>New Note</span>}
        </button>
      </div>

      {/* Main Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              currentPage === item.id &&
              (!item.pageKey || item.pageKey === 'shared_filter');

            return (
              <button
                key={item.label}
                id={`sidebar-nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                type="button"
                onClick={() => handleNavClick(item)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                } ${collapsed ? 'justify-center px-2' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className="w-4 h-4 shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </div>
                {!collapsed && item.count !== undefined && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-indigo-100 dark:bg-indigo-900/80 text-indigo-700 dark:text-indigo-300 font-semibold'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tags Section (Expanded only) */}
        {!collapsed && allTags.length > 0 && (
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <span>Tags</span>
              <button
                onClick={() => onNavigate('tags')}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 lowercase text-[11px] font-normal"
              >
                view all
              </button>
            </div>
            <div className="space-y-0.5 max-h-48 overflow-y-auto">
              {allTags.slice(0, 8).map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagClick(tag)}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-colors ${
                    selectedTag === tag
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-medium'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <TagIcon className="w-3 h-3 text-slate-400" />
                    <span className="truncate">{tag}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Theme Picker Strip */}
      {!collapsed && (
        <div className="p-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`flex-1 flex items-center justify-center gap-1 py-1 rounded-lg transition-colors ${
                theme === 'light'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Light</span>
            </button>
            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`flex-1 flex items-center justify-center gap-1 py-1 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'bg-slate-900 text-white shadow-xs font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Dark</span>
            </button>
            <button
              type="button"
              onClick={() => setTheme('system')}
              className={`flex-1 flex items-center justify-center gap-1 py-1 rounded-lg transition-colors ${
                theme === 'system'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>Sys</span>
            </button>
          </div>
        </div>
      )}

      {/* Bottom User Area */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between gap-2">
          <button
            id="sidebar-user-profile-btn"
            type="button"
            onClick={() => {
              onNavigate('profile');
              setMobileOpen(false);
            }}
            className={`flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors min-w-0 flex-1 ${
              collapsed ? 'justify-center p-1' : ''
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden shadow-xs">
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

            {!collapsed && (
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {userProfile?.displayName || 'My Account'}
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {user?.email || 'authenticated'}
                </div>
              </div>
            )}
          </button>

          {!collapsed && (
            <button
              id="sidebar-logout-btn"
              type="button"
              onClick={logout}
              className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors shrink-0"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop / Tablet Sidebar */}
      <aside
        id="app-sidebar-desktop"
        className={`hidden md:block shrink-0 transition-all duration-300 h-screen sticky top-0 z-30 ${
          collapsed ? 'w-18' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          id="app-sidebar-mobile-backdrop"
          className="md:hidden fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs"
          onClick={() => setMobileOpen(false)}
        >
          <div
            id="app-sidebar-mobile-drawer"
            className="w-72 h-full bg-white dark:bg-slate-900 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
