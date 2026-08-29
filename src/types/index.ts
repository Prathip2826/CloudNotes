import { Timestamp } from 'firebase/firestore';

export interface Note {
  id: string;
  userId?: string;
  title: string;
  body: string;
  tags: string[];
  favorite: boolean;
  archived: boolean;
  shared: boolean;
  shareExpiresAt: Timestamp | null;
  createdAt: Timestamp | { seconds: number; nanoseconds: number } | null;
  updatedAt: Timestamp | { seconds: number; nanoseconds: number } | null;
}

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  createdAt: Timestamp | { seconds: number; nanoseconds: number } | null;
}

export type SortOption =
  | 'updatedDesc'
  | 'updatedAsc'
  | 'createdDesc'
  | 'createdAsc'
  | 'titleAsc'
  | 'titleDesc';

export type FilterCategory = 'all' | 'favorites' | 'archived' | 'shared';

export type ViewMode = 'grid' | 'list';

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
  duration?: number;
}

export type ActivePage =
  | 'landing'
  | 'login'
  | 'signup'
  | 'forgot-password'
  | 'dashboard'
  | 'editor'
  | 'favorites'
  | 'archived'
  | 'tags'
  | 'settings'
  | 'profile'
  | 'shared';

export interface ShareOptions {
  enabled: boolean;
  expiresInOption: '1h' | '1d' | '7d' | 'forever' | 'custom';
  customDate?: string;
}
