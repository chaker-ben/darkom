import { describe, it, expect } from 'vitest';

import { locales, defaultLocale, rtlLocales, isRTL, getDirection, localeNames, localeFlags } from '../config';

describe('i18n config', () => {
  describe('locales', () => {
    it('should include fr, ar, and en', () => {
      expect(locales).toContain('fr');
      expect(locales).toContain('ar');
      expect(locales).toContain('en');
    });

    it('should have fr as default locale', () => {
      expect(defaultLocale).toBe('fr');
    });

    it('should have ar as RTL locale', () => {
      expect(rtlLocales).toContain('ar');
      expect(rtlLocales).not.toContain('fr');
      expect(rtlLocales).not.toContain('en');
    });
  });

  describe('isRTL', () => {
    it('should return true for Arabic', () => {
      expect(isRTL('ar')).toBe(true);
    });

    it('should return false for French', () => {
      expect(isRTL('fr')).toBe(false);
    });

    it('should return false for English', () => {
      expect(isRTL('en')).toBe(false);
    });
  });

  describe('getDirection', () => {
    it('should return rtl for Arabic', () => {
      expect(getDirection('ar')).toBe('rtl');
    });

    it('should return ltr for French', () => {
      expect(getDirection('fr')).toBe('ltr');
    });

    it('should return ltr for English', () => {
      expect(getDirection('en')).toBe('ltr');
    });
  });

  describe('localeNames', () => {
    it('should have display names for all locales', () => {
      expect(localeNames.fr).toBe('Français');
      expect(localeNames.ar).toBe('العربية');
      expect(localeNames.en).toBe('English');
    });
  });

  describe('localeFlags', () => {
    it('should have flag emojis for all locales', () => {
      expect(localeFlags.fr).toBeDefined();
      expect(localeFlags.ar).toBeDefined();
      expect(localeFlags.en).toBeDefined();
    });
  });
});
