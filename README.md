# CloudNotes: Cloud-Based Smart Note-Taking Application

> **Internship Submission Portfolio Project**  
> An enterprise-grade, cloud-synchronized smart note-taking web application built with modern React, TypeScript, Tailwind CSS, and Cloud Firestore.

---

## 🌟 Project Overview

**CloudNotes** is a modern, high-performance cloud note-taking platform designed for developers, students, and professionals. It provides seamless cross-device synchronization, markdown formatting with real-time preview, intelligent tag-based taxonomy, and zero-trust expiring link sharing.

---

## LINK 🔗 

https://cloudnotes28.vercel.app/

---

## ✨ Key Features

### 1. ⚡ Real-Time Cloud Synchronization
- Powered by Google Cloud Firestore live websocket snapshot streams (`onSnapshot`).
- Sub-second updates across all active devices and browser tabs.
- Debounced auto-save engine (600ms) with intuitive status indicators (*Saving...*, *Saved*, *Synced*).

### 2. 🔐 Multi-Provider Authentication
- **Google OAuth 2.0:** One-click secure sign-in with automatic profile synchronization.
- **Email & Password Authentication:** Comprehensive registration, sign-in, and automated password reset workflows.
- **Session Persistence:** Secure credential storage across browser reloads.

### 3. 📝 Markdown-Powered Editor
- Split-screen live preview with side-by-side editing.
- Comprehensive formatting toolbar: Bold, Italic, Headings (H1-H3), Lists (Ordered, Bulleted, Checklists), Blockquotes, Code blocks, Links, Tables, and Horizontal dividers.
- Real-time word count and character count statistics.
- Single-click Markdown file export (`.md`).

### 4. 🏷️ Smart Search & Tag Taxonomy
- Instant search across note titles, body content, and keywords.
- Dynamic tag manager with badge indicators and tag-filtered workspaces.
- Multi-dimensional sorting: Recently Updated, Recently Created, Alphabetical (A-Z, Z-A), and Oldest.
- Grid View and List View layout toggles.

### 5. 🔗 Expiring Public Link Sharing
- Generate public, read-only URLs for any note.
- Configurable expiration periods: **1 Hour**, **24 Hours**, **7 Days**, or **Indefinite**.
- Revoke public access at any time with a single click.
- Enforced at both the client layer and Firestore ABAC security rule level.

### 6. 🗄️ Organization & Lifecycle Management
- **Favorites:** Star vital notes for instant access in a dedicated view.
- **Archive:** Safely stow finished notes without permanently deleting them.
- **Duplicate:** Clone notes to use as templates.
- **Backups:** One-click JSON data export of all workspace notes.

### 7. 🎨 Responsive SaaS UI / UX
- Light, Dark, and System theme synchronization.
- Collapsible sidebar for tablet/desktop ergonomics.
- Mobile-first drawer navigation.
- Accessible contrast ratios and micro-interactions.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | React 19, TypeScript |
| **Styling & Icons** | Tailwind CSS, Lucide React Icons |
| **Backend & Cloud Database** | Google Cloud Firestore (Document Store) |
| **Authentication** | Firebase Authentication (Google Auth + Email/Password) |
| **Markdown Engine** | `react-markdown`, `remark-gfm` |
| **Date Utilities** | `date-fns` |
| **Build Tooling** | Vite |

---

## 🏗️ Cloud Architecture & Security

```
[ Multi-Device Clients: Desktop / Tablet / Mobile ]
                     │
                     ▼
       [ Firebase Authentication Layer ]
    (Google OAuth 2.0 / Email & Password)
                     │
                     ▼
      [ Cloud Firestore Security Rules (ABAC) ]
 (users/{userId}/notes/{noteId} isolated partition)
                     │
        ┌────────────┴────────────┐
        ▼                         ▼
 [ Private Read/Write ]    [ Public Read-Only Gateway ]
 (isOwner verification)     (isShared && !isExpired)
```

### Security Rules Highlights (`firestore.rules`)
- **Subcollection Isolation:** User notes are strictly stored under `users/{userId}/notes/{noteId}`.
- **Ownership Verification:** Unauthenticated or foreign users cannot list, query, or mutate documents owned by another user.
- **Time-Bounded Public Access:** Read-only access to a shared note is granted if and only if `resource.data.shared == true` and `request.time < resource.data.shareExpiresAt`.

---

## 🚀 Setup & Local Development Instructions

### Prerequisites
- Node.js 18.x or higher
- npm or yarn package manager

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/cloudnotes.git
   cd cloudnotes
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start local development server:**
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:3000`.

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## 📋 Firebase Configuration

The application is pre-configured with the Google Cloud Firebase project `notetaking-app-18c39`. The configuration is initialized in `src/lib/firebase.ts`.

---

## 📄 License & Attribution

Designed and engineered for an **Internship Submission Portfolio Project**.  
All rights reserved © 2026 CloudNotes.
