import { describe, it, expect } from 'vitest';

import { getLocalizedField } from '../localized-field';

describe('getLocalizedField', () => {
  const listing = {
    title_fr: 'Appartement moderne',
    title_ar: 'شقة حديثة',
    title_en: 'Modern apartment',
    description_fr: 'Un bel appartement',
    description_ar: '',
    description_en: null,
  };

  it('should return the field for the requested locale', () => {
    expect(getLocalizedField(listing, 'title', 'fr')).toBe('Appartement moderne');
    expect(getLocalizedField(listing, 'title', 'ar')).toBe('شقة حديثة');
    expect(getLocalizedField(listing, 'title', 'en')).toBe('Modern apartment');
  });

  it('should fallback to French when requested locale is empty', () => {
    expect(getLocalizedField(listing, 'description', 'ar')).toBe('Un bel appartement');
  });

  it('should fallback to French when requested locale is null', () => {
    expect(getLocalizedField(listing, 'description', 'en')).toBe('Un bel appartement');
  });

  it('should return empty string when no field exists', () => {
    expect(getLocalizedField(listing, 'address', 'fr')).toBe('');
  });

  it('should handle objects with missing locales', () => {
    const partial = { title_fr: 'Titre' };
    expect(getLocalizedField(partial, 'title', 'ar')).toBe('Titre');
    expect(getLocalizedField(partial, 'title', 'en')).toBe('Titre');
  });
});
