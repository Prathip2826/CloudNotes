import React from 'react';
import { Smartphone, Laptop, ShieldCheck, Database, RefreshCw, Share2, Lock, Cpu, Server } from 'lucide-react';

export const CloudArchitectureDiagram: React.FC = () => {
  return (
    <div className="w-full max-w-5xl mx-auto my-12 p-6 md:p-8 rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-2xl overflow-hidden relative">
      {/* Subtle background glow */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="text-center mb-10 relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <Cpu className="w-3.5 h-3.5" /> High-Availability Cloud Architecture
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-white">
          Real-Time Zero-Trust Cloud Architecture
        </h3>
        <p className="text-slate-400 text-xs md:text-sm max-w-xl mx-auto mt-2 leading-relaxed">
          End-to-end synchronized notes pipeline featuring subcollection data isolation, ABAC security rules, and real-time bidirectional websockets.
        </p>
      </div>

      {/* Architecture Blocks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
        {/* Tier 1: Client Devices */}
        <div className="flex flex-col justify-between p-5 rounded-2xl bg-slate-800/80 border border-slate-700/60 shadow-lg">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">Layer 1</span>
              <div className="flex gap-1 text-slate-400">
                <Laptop className="w-4 h-4" />
                <Smartphone className="w-4 h-4" />
              </div>
            </div>
            <h4 className="text-sm font-semibold text-white">Multi-Device Client</h4>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              React + TypeScript client-side reactive state with debounced mutations and local caching.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-700/40 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Optimistic UI updates</span>
            </div>
            <div>• Debounced auto-save (500ms)</div>
          </div>
        </div>

        {/* Tier 2: Identity & Auth */}
        <div className="flex flex-col justify-between p-5 rounded-2xl bg-slate-800/80 border border-slate-700/60 shadow-lg">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400">Layer 2</span>
              <ShieldCheck className="w-4 h-4 text-purple-400" />
            </div>
            <h4 className="text-sm font-semibold text-white">Firebase Auth</h4>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Google OAuth 2.0 & Email/Password authentication with JWT token rotation.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-700/40 text-[11px] text-slate-400 space-y-1">
            <div>• Persistent session state</div>
            <div>• Request UID cryptographic token</div>
          </div>
        </div>

        {/* Tier 3: Cloud Firestore & ABAC */}
        <div className="flex flex-col justify-between p-5 rounded-2xl bg-slate-800/80 border border-indigo-500/40 shadow-lg ring-1 ring-indigo-500/20">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">Layer 3</span>
              <Database className="w-4 h-4 text-indigo-400" />
            </div>
            <h4 className="text-sm font-semibold text-white">Cloud Firestore</h4>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Isolated user partitions at <code className="text-indigo-300 font-mono text-[10px]">users/{"{uid}"}/notes</code> with server timestamps.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-700/40 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 text-indigo-300">
              <RefreshCw className="w-3 h-3 animate-spin text-indigo-400" />
              <span>Real-time snapshot streams</span>
            </div>
            <div>• ABAC security rules</div>
          </div>
        </div>

        {/* Tier 4: Public Read Gateway */}
        <div className="flex flex-col justify-between p-5 rounded-2xl bg-slate-800/80 border border-slate-700/60 shadow-lg">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">Layer 4</span>
              <Share2 className="w-4 h-4 text-emerald-400" />
            </div>
            <h4 className="text-sm font-semibold text-white">Secure Link Proxy</h4>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Expiring read-only note distribution with cryptographic verification of time bounds.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-700/40 text-[11px] text-slate-400 space-y-1">
            <div>• Strict read-only access</div>
            <div>• Configurable time-to-live</div>
          </div>
        </div>
      </div>

      {/* Security Statement Footer */}
      <div className="mt-6 p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>Zero-Trust Isolation:</strong> User notes are completely isolated. No user can read or query another user's private data.
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-indigo-400 shrink-0">
          <span>rules_version = '2'</span>
          <span>•</span>
          <span>Firestore Enterprise</span>
        </div>
      </div>
    </div>
  );
};
