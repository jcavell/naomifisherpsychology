import { persistentTracker } from "./trackerStore.ts";

const TRACKER_EXPIRY_HOURS = 24;

function getTrackerFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("t");
}

export function persistTrackerFromURL() {
  const trackerValue = getTrackerFromURL();

  if (trackerValue) {
    persistentTracker.set({
      value: trackerValue,
      timestamp: Date.now(),
    });
  }
}

export function removeTrackerFromStore() {
  persistentTracker.set({ value: "", timestamp: 0 });
}

export function getTrackerFromStore(): string {
  const trackerData = persistentTracker.get();

  // Check if tracker has expired
  const ageInHours = (Date.now() - trackerData.timestamp) / (1000 * 60 * 60);

  if (ageInHours > TRACKER_EXPIRY_HOURS || !trackerData.value) {
    removeTrackerFromStore();
    return "";
  }

  return trackerData.value;
}
