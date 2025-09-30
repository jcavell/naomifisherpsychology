// trackerStore.ts
import { persistentAtom } from '@nanostores/persistent';

export const TRACKER_KEYS = ['t', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content'] as const;

// Derive the type from the array
export type TrackerKey = typeof TRACKER_KEYS[number];

export interface TrackerData {
  trackers: Partial<Record<TrackerKey, string>>;
  timestamp: number;
}

export const persistentTracker = persistentAtom<TrackerData | null>(
  'tracker',
  null,
  {
    encode: JSON.stringify,
    decode: JSON.parse
  }
);