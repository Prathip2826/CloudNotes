import React from 'react';
import {
  Cloud,
  Shield,
  Zap,
  Search,
  Share2,
  Smartphone,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Lock,
  RefreshCw,
  FolderLock,
  Tag,
  Star,
  Github,
  Mail,
  FileText,
} from 'lucide-react';
import { CloudArchitectureDiagram } from '../components/CloudArchitectureDiagram';
import { ActivePage } from '../types';

interface LandingPageProps {
  onNavigate: (page: ActivePage) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const features = [
    {
      icon: RefreshCw,
      title: 'Real-Time Cloud Sync',
      description: 'Changes synchronize seamlessly across all your devices with Firestore live websocket snapshot listeners.',
      badge: 'Live Sync',
    },
    {
      icon: Shield,
      title: 'Secure Authentication',
      description: 'Multi-provider login supporting Google OAuth 2.0 and enterprise-grade Email/Password authentication.',
      badge: 'Zero-Trust',
    },
    {
      icon: FileText,
      title: 'Markdown-Powered Editor',
      description: 'Rich formatting support including headings, checklists, code blocks, tables, and instant live preview mode.',
      badge: 'Markdown',
    },
    {
      icon: Search,
      title: 'Smart Instant Search',
      description: 'Lightning-fast debounced filtering across titles, note bodies, and custom tag taxonomy with instant results.',
      badge: 'Debounced',
    },
    {
      icon: Share2,
      title: 'Time-Expiring Share Links',
      description: 'Generate secure, read-only public links with configurable time-to-live expiration (1 hour, 1 day, 7 days).',
      badge: 'Expiring URLs',
    },
    {
      icon: Smartphone,
      title: 'Responsive Cross-Platform',
      description: 'Designed mobile-first with adaptive cards, touch gestures, and collapsible desktop productivity drawers.',
      badge: 'Universal',
    },
  ];

  return (
    <div id="landing-page" className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/25">
              <Cloud className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              CloudNotes
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-400">
            <a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Features
            </a>
            <a href="#architecture" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Architecture
            </a>
            <a href="#security" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Security
            </a>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="landing-signin-btn"
              type="button"
              onClick={() => onNavigate('login')}
              className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Sign In
            </button>
            <button
              id="landing-getstarted-btn"
              type="button"
              onClick={() => onNavigate('signup')}
              className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/25 transition-all"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" /> Internship Portfolio Production Project
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight">
            Your Notes. Anywhere.{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 bg-clip-text text-transparent">
              Securely in the Cloud.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Create, organize, search and share your notes with powerful real-time cloud synchronization powered by Cloud Firestore.
          </p>

          {/* Action Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              id="hero-getstarted-btn"
              type="button"
              onClick={() => onNavigate('signup')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 text-base group cursor-pointer"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              id="hero-signin-btn"
              type="button"
              onClick={() => onNavigate('login')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-sm transition-all text-base cursor-pointer"
            >
              Sign In
            </button>
          </div>

          {/* Live Preview Card Showcase */}
          <div className="mt-16 relative max-w-4xl mx-auto">
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xl p-4 sm:p-6 text-left">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="ml-2 text-xs font-mono text-slate-400">cloudnotes.app/dashboard</span>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                  <CheckCircle className="w-3 h-3" /> Real-Time Connected
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">#Internship</span>
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1">
                    System Architecture Planning
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    Deployed Firestore security rules version 2 with user data subcollection isolation...
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">#Ideas</span>
                    <Share2 className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1">
                    Markdown Formatting Engine
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    Integrated debounced auto-save triggers with live preview syntax styling...
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">#Security</span>
                    <Lock className="w-3.5 h-3.5 text-purple-500" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1">
                    Expiring Tokenized Sharing
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    Read-only public link verification guarding expired and revoked document queries...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cloud Architecture Section */}
      <section id="architecture" className="py-16 bg-slate-100/70 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CloudArchitectureDiagram />
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2">
              Everything you need for serious note taking
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
              Designed from the ground up for speed, security, and developer craftsmanship.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Security & Isolation Section */}
      <section id="security" className="py-16 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4">
                <FolderLock className="w-4 h-4" /> ABAC Zero-Trust Rules
              </div>
              <h2 className="text-3xl font-extrabold leading-tight">
                Enterprise-Grade Privacy with Subcollection Isolation
              </h2>
              <p className="text-slate-300 text-sm mt-4 leading-relaxed">
                Every user's notes reside in a partitioned Firestore path: <code className="text-indigo-300 bg-slate-800 px-2 py-0.5 rounded">users/&#123;uid&#125;/notes</code>. 
                Database access rules mathematically block User A from querying or mutating User B's documents.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-xs text-slate-200">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Public links allow strictly READ-ONLY unauthenticated access.</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-200">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Expired links are rejected instantly at the server security layer.</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-200">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>No backend API keys or service account secrets exposed on the client.</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto shadow-2xl">
              <div className="text-slate-500">// firestore.rules (Version 2)</div>
              <div className="text-indigo-400">rules_version = '2';</div>
              <div className="text-indigo-400">service cloud.firestore &#123;</div>
              <div className="pl-4 text-slate-400">match /users/&#123;userId&#125;/notes/&#123;noteId&#125; &#123;</div>
              <div className="pl-8 text-emerald-400">allow get: if isOwner(userId) || isSharedAndActive(resource.data);</div>
              <div className="pl-8 text-emerald-400">allow list: if isOwner(userId);</div>
              <div className="pl-8 text-emerald-400">allow write: if isOwner(userId);</div>
              <div className="pl-4 text-slate-400">&#125;</div>
              <div className="text-indigo-400">&#125;</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-white dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="col-span-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
                  <Cloud className="w-4 h-4" />
                </div>
                <span className="font-bold text-base text-slate-900 dark:text-white">
                  CloudNotes
                </span>
              </div>
              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                Cloud-based smart note-taking platform with real-time Firestore sync, rich markdown editing, tags, and secure link sharing.
              </p>
              <div className="mt-4 text-xs text-slate-400">
                © {new Date().getFullYear()} CloudNotes. Built for Internship Submission.
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
                Features
              </h4>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <li><a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400">Real-Time Sync</a></li>
                <li><a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400">Markdown Editor</a></li>
                <li><a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400">Tag Taxonomy</a></li>
                <li><a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400">Secure Sharing</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
                About
              </h4>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <li><a href="#architecture" className="hover:text-indigo-600 dark:hover:text-indigo-400">Architecture</a></li>
                <li><a href="#security" className="hover:text-indigo-600 dark:hover:text-indigo-400">Security Rules</a></li>
                <li><button onClick={() => onNavigate('dashboard')} className="hover:text-indigo-600 dark:hover:text-indigo-400 text-left">Product Demo</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
                Connect
              </h4>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-1.5">
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub Ready</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  <span>prathipraja777@gmail.com</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
