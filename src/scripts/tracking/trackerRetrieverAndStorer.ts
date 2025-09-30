import {
  persistentTracker,
  TRACKER_KEYS,
  type TrackerData,
  type TrackerKey,
} from "./trackerStore.ts";

const TRACKER_EXPIRY_HOURS = 24;

function getTrackerFromURL(urlParams: URLSearchParams, key: TrackerKey) {
  return urlParams.get(key);
}

export function persistTrackersFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const trackersFound: Record<TrackerKey, string> = {} as Record<TrackerKey, string>;
  let hasTrackers = false;

  TRACKER_KEYS.forEach((k: TrackerKey) => {
    const trackerValue = getTrackerFromURL(urlParams, k);
    if (trackerValue) {
      trackersFound[k] = trackerValue;
      hasTrackers = true;
    }
  });

  if (hasTrackers) {
    persistentTracker.set({
      trackers: trackersFound,
      timestamp: Date.now(),
    });
  }
}

export function removeTrackerFromStore() {
  persistentTracker.set(null);
}

export function getTrackerDataFromStore(): TrackerData | null {
  const trackerData = persistentTracker.get();

  if (!trackerData) return null;

  // Check if tracker has expired
  const ageInHours = (Date.now() - trackerData.timestamp) / (1000 * 60 * 60);

  if (ageInHours > TRACKER_EXPIRY_HOURS) {
    removeTrackerFromStore();
    return null;
  }

  return trackerData;
}
