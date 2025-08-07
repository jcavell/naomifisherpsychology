import { persistentAtom } from '@nanostores/persistent';

export const persistentCoupon = persistentAtom<string>(
  'cocd',
  '',  // empty string as default instead of null
  {
    encode: String,
    decode: String
  }
);