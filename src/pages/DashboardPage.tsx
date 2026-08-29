import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  LayoutGrid,
  List,
  SlidersHorizontal,
  FolderOpen,
  Star,
  Archive,
  Share2,
  FileText,
  X,
  Sparkles,
  Tag as TagIcon,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotes } from '../context/NotesContext';
import { NoteCard } from '../components/NoteCard';
import { StatCard } from '../components/StatCard';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { ShareModal } from '../components/ShareModal';
import { Note, SortOption, FilterCategory, ActivePage } from '../types';

interface DashboardPageProps {
  onNavigate: (page: ActivePage) => void;
  onOpenEditor: (noteId?: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  onOpenEditor,
}) => {
  const { userProfile, user } = useAuth();
  const {
    filteredNotes,
    loading,
    stats,
    searchQuery,
    setSearchQuery,
    selectedTag,
    setSelectedTag,
    filterCategory,
    setFilterCategory,
    sortOption,
    setSortOption,
    viewMode,
    setViewMode,
    deleteNote,
    allTags,
    createNote,
  } = useNotes();

  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const [noteToShare, setNoteToShare] = useState<Note | null>(null);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Dynamic greeting based on time of day
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const userName = userProfile?.displayName || user?.email?.split('@')[0] || 'there';

  const handleCreateNew = async () => {
    try {
      const newId = await createNote();
      onOpenEditor(newId);
    } catch {
      onOpenEditor();
    }
  };

  const handleConfirmDelete = async () => {
    if (!noteToDelete) return;
    await deleteNote(noteToDelete.id);
    setNoteToDelete(null);
  };

  const sortLabels: Record<SortOption, string> = {
    updatedDesc: 'Recently Updated',
    updatedAsc: 'Oldest Updated',
    createdDesc: 'Recently Created',
    createdAsc: 'Oldest Created',
    titleAsc: 'Title (A-Z)',
    titleDesc: 'Title (Z-A)',
  };

  return (
    <div id="dashboard-page" className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {greeting}, {userName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Capture your ideas, organize thoughts, and sync in real time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="dashboard-new-note-top-btn"
            type="button"
            onClick={handleCreateNew}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-600/25 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Note</span>
          </button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Total Notes"
          value={stats.total}
          icon={FileText}
          color="indigo"
          isActive={filterCategory === 'all' && !selectedTag}
          onClick={() => {
            setFilterCategory('all');
            setSelectedTag(null);
          }}
        />
        <StatCard
          title="Favorites"
          value={stats.favorites}
          icon={Star}
          color="amber"
          isActive={filterCategory === 'favorites'}
          onClick={() => {
            setFilterCategory('favorites');
            setSelectedTag(null);
          }}
        />
        <StatCard
          title="Archived"
          value={stats.archived}
          icon={Archive}
          color="slate"
          isActive={filterCategory === 'archived'}
          onClick={() => {
            setFilterCategory('archived');
            setSelectedTag(null);
          }}
        />
        <StatCard
          title="Shared Links"
          value={stats.shared}
          icon={Share2}
          color="emerald"
          isActive={filterCategory === 'shared'}
          onClick={() => {
            setFilterCategory('shared');
            setSelectedTag(null);
          }}
        />
      </div>

      {/* Controls & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            id="dashboard-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your notes by title, content, or tags..."
            className="w-full pl-10 pr-10 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/60 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:outline-hidden transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Pills, Sort & View Mode */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 shrink-0">
          {/* Category Tabs */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs">
            {(['all', 'favorites', 'archived', 'shared'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-all ${
                  filterCategory === cat
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              id="sort-dropdown-btn"
              type="button"
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors shrink-0"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{sortLabels[sortOption]}</span>
            </button>

            {showSortDropdown && (
              <div
                className="absolute right-0 top-10 z-30 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1 text-xs"
                onClick={() => setShowSortDropdown(false)}
              >
                {(Object.keys(sortLabels) as SortOption[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSortOption(key)}
                    className={`w-full text-left px-3.5 py-2 transition-colors ${
                      sortOption === key
                        ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {sortLabels[key]}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* View Toggle */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Grid View"
              aria-label="Grid View"
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
              aria-label="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Active Tags Filter Bar */}
      {allTags.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 text-xs">
          <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] shrink-0 mr-1">
            Filter by tag:
          </span>
          <button
            type="button"
            onClick={() => setSelectedTag(null)}
            className={`px-2.5 py-1 rounded-lg transition-all shrink-0 ${
              selectedTag === null
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            All Tags
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all shrink-0 ${
                selectedTag === tag
                  ? 'bg-indigo-600 text-white font-medium shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <TagIcon className="w-3 h-3 opacity-60" />
              <span>{tag}</span>
            </button>
          ))}
        </div>
      )}

      {/* Notes Content Section */}
      <div>
        {loading ? (
          // Skeleton Loaders
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
                : 'space-y-3'
            }
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 animate-pulse space-y-3"
              >
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4" />
                <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded-md w-full" />
                <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded-md w-5/6" />
                <div className="pt-4 flex justify-between">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-1/4" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredNotes.length === 0 ? (
          // Empty State
          <div className="text-center py-16 px-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4 border border-indigo-200/50 dark:border-indigo-800/50">
              <FolderOpen className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {searchQuery
                ? 'No matching notes found'
                : filterCategory === 'favorites'
                ? 'No favorite notes yet'
                : filterCategory === 'archived'
                ? 'Your archive is empty'
                : filterCategory === 'shared'
                ? 'No notes shared publicly'
                : selectedTag
                ? `No notes tagged with "${selectedTag}"`
                : 'No notes yet'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              {searchQuery
                ? `Try refining your search terms or clearing the filter.`
                : filterCategory === 'favorites'
                ? 'Star important notes to access them quickly here.'
                : filterCategory === 'archived'
                ? 'Notes you archive will appear in this workspace.'
                : 'Create your first note to get started with real-time cloud synchronization.'}
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              {searchQuery || selectedTag || filterCategory !== 'all' ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedTag(null);
                    setFilterCategory('all');
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors"
                >
                  Reset Filters
                </button>
              ) : null}
              <button
                type="button"
                onClick={handleCreateNew}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/25 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Create Note</span>
              </button>
            </div>
          </div>
        ) : (
          // Notes Grid or List
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
                : 'space-y-3'
            }
          >
            {filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                viewMode={viewMode}
                onSelect={(id) => onOpenEditor(id)}
                onShare={(target) => setNoteToShare(target)}
                onDelete={(target) => setNoteToDelete(target)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={Boolean(noteToDelete)}
        title="Delete this note?"
        message="Are you sure you want to delete this note? This action cannot be undone and will permanently remove it from your cloud storage."
        confirmLabel="Delete Note"
        isDestructive={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setNoteToDelete(null)}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={Boolean(noteToShare)}
        note={noteToShare}
        onClose={() => setNoteToShare(null)}
      />
    </div>
  );
};
