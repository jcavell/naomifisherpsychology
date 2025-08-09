import { persistentAtom } from '@nanostores/persistent';

interface TrackerData {
  value: string;
  timestamp: number;
}

export const persistentTracker = persistentAtom<TrackerData>(
  't',
  { value: '', timestamp: 0 },
  {
    encode: JSON.stringify,
    decode: JSON.parse
  }
);