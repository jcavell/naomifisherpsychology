import { persistentAtom } from "@nanostores/persistent";

export type StoredCoupon = {
  code: string;
  source: "auto" | "url" | "user" | "legacy" | "removed";
  timestamp?: number;
};

function decode(value: string): StoredCoupon | null {
  if (!value) return null;

  try {
    const parsed = JSON.parse(value);

    if (parsed && typeof parsed.source === "string") {
      return parsed;
    }
  } catch {
    // Old format: plain coupon string
    return {
      code: value,
      source: "legacy"
    };
  }

  return null;
}

function encode(value: StoredCoupon | null) {
  if (!value) return "";
  return JSON.stringify(value);
}

export const persistentCoupon = persistentAtom<StoredCoupon | null>(
  "cocd",
  null,
  { encode, decode }
);