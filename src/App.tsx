import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotesProvider, useNotes } from './context/NotesContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { ToastContainer } from './components/ToastContainer';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { DashboardPage } from './pages/DashboardPage';
import { NoteEditorPage } from './pages/NoteEditorPage';
import { SharedNotePage } from './pages/SharedNotePage';
import { FavoritesPage } from './pages/FavoritesPage';
import { ArchivedPage } from './pages/ArchivedPage';
import { TagsPage } from './pages/TagsPage';
import { SettingsPage } from './pages/SettingsPage';
import { ProfilePage } from './pages/ProfilePage';
import { ActivePage } from './types';
import { Loader2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { createNote } = useNotes();

  const [currentPage, setCurrentPage] = useState<ActivePage>('landing');
  const [activeEditorNoteId, setActiveEditorNoteId] = useState<string | undefined>(undefined);
  const [sharedNoteParams, setSharedNoteParams] = useState<{ userId: string; noteId: string } | null>(null);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Parse URL on initial load for public share links: ?shareUserId=...&shareNoteId=...
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shareUserId = params.get('shareUserId');
    const shareNoteId = params.get('shareNoteId');

    if (shareUserId && shareNoteId) {
      setSharedNoteParams({ userId: shareUserId, noteId: shareNoteId });
      setCurrentPage('shared');
    }
  }, []);

  // Update page state based on auth status
  useEffect(() => {
    if (authLoading) return;

    if (sharedNoteParams) {
      // Stay on shared note view
      return;
    }

    if (user) {
      if (currentPage === 'landing' || currentPage === 'login' || currentPage === 'signup' || currentPage === 'forgot-password') {
        setCurrentPage('dashboard');
      }
    } else {
      if (currentPage !== 'landing' && currentPage !== 'login' && currentPage !== 'signup' && currentPage !== 'forgot-password') {
        setCurrentPage('landing');
      }
    }
  }, [user, authLoading, sharedNoteParams]);

  const handleNavigate = (page: ActivePage) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleOpenEditor = (noteId?: string) => {
    setActiveEditorNoteId(noteId);
    setCurrentPage('editor');
    window.scrollTo(0, 0);
  };

  const handleCreateNewNote = async () => {
    try {
      const newId = await createNote();
      handleOpenEditor(newId);
    } catch {
      handleOpenEditor();
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center text-slate-500">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
        <p className="text-sm font-medium">Initializing CloudNotes workspace...</p>
      </div>
    );
  }

  // Handle public shared note page
  if (currentPage === 'shared' && sharedNoteParams) {
    return (
      <SharedNotePage
        userId={sharedNoteParams.userId}
        noteId={sharedNoteParams.noteId}
        onNavigate={handleNavigate}
      />
    );
  }

  // Unauthenticated standalone pages
  if (!user) {
    switch (currentPage) {
      case 'login':
        return <LoginPage onNavigate={handleNavigate} />;
      case 'signup':
        return <SignUpPage onNavigate={handleNavigate} />;
      case 'forgot-password':
        return <ForgotPasswordPage onNavigate={handleNavigate} />;
      case 'landing':
      default:
        return <LandingPage onNavigate={handleNavigate} />;
    }
  }

  // Full-screen Note Editor
  if (currentPage === 'editor') {
    return (
      <NoteEditorPage
        noteId={activeEditorNoteId}
        onNavigate={handleNavigate}
      />
    );
  }

  // Authenticated App Shell with Responsive Sidebar & Topbar
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      {/* Sidebar navigation */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileDrawerOpen}
        setMobileOpen={setMobileDrawerOpen}
        onNewNote={handleCreateNewNote}
      />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          onMenuToggle={() => setMobileDrawerOpen(!mobileDrawerOpen)}
          onNavigate={handleNavigate}
          onNewNote={handleCreateNewNote}
          currentPage={currentPage}
        />

        <main className="flex-1 overflow-y-auto">
          {currentPage === 'dashboard' && (
            <DashboardPage
              onNavigate={handleNavigate}
              onOpenEditor={handleOpenEditor}
            />
          )}

          {currentPage === 'favorites' && (
            <FavoritesPage
              onNavigate={handleNavigate}
              onOpenEditor={handleOpenEditor}
            />
          )}

          {currentPage === 'archived' && (
            <ArchivedPage
              onNavigate={handleNavigate}
              onOpenEditor={handleOpenEditor}
            />
          )}

          {currentPage === 'tags' && (
            <TagsPage
              onNavigate={handleNavigate}
              onOpenEditor={handleOpenEditor}
            />
          )}

          {currentPage === 'settings' && (
            <SettingsPage onNavigate={handleNavigate} />
          )}

          {currentPage === 'profile' && (
            <ProfilePage onNavigate={handleNavigate} />
          )}
        </main>
      </div>
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <NotesProvider>
            <AppContent />
            <ToastContainer />
          </NotesProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
