import { arSA, enUS, frFR } from '@clerk/localizations';
import { describe, expect, it } from 'vitest';

import { getClerkLocalization } from '../clerk-locales';

describe('getClerkLocalization', () => {
  it('returns frFR for French locale', () => {
    expect(getClerkLocalization('fr')).toBe(frFR);
  });

  it('returns arSA for Arabic locale', () => {
    expect(getClerkLocalization('ar')).toBe(arSA);
  });

  it('returns enUS for English locale', () => {
    expect(getClerkLocalization('en')).toBe(enUS);
  });
});
