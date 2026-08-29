import { Timestamp } from 'firebase/firestore';
import { format, formatDistanceToNow } from 'date-fns';

export function parseTimestampToDate(timestamp: any): Date | null {
  if (!timestamp) return null;
  if (timestamp instanceof Date) return timestamp;
  if (typeof timestamp.toDate === 'function') {
    return timestamp.toDate();
  }
  if (typeof timestamp.seconds === 'number') {
    return new Date(timestamp.seconds * 1000);
  }
  if (typeof timestamp === 'string' || typeof timestamp === 'number') {
    const d = new Date(timestamp);
    if (!isNaN(d.getTime())) return d;
  }
  return null;
}

export function formatTimestampRelative(timestamp: any): string {
  const date = parseTimestampToDate(timestamp);
  if (!date) return 'Recently';
  try {
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return 'Recently';
  }
}

export function formatTimestampDate(timestamp: any, dateFormat = 'MMMM d, yyyy'): string {
  const date = parseTimestampToDate(timestamp);
  if (!date) return 'Recently';
  try {
    return format(date, dateFormat);
  } catch {
    return 'Recently';
  }
}
