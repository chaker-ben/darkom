/// <reference types="@testing-library/jest-dom/vitest" />
import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'filters.title': 'Filtres',
      'filters.allGovernorates': 'Tous les gouvernorats',
      'filters.governorate': 'Gouvernorat',
      'filters.priceRange': 'Fourchette de prix',
      'filters.minPrice': 'Prix min',
      'filters.maxPrice': 'Prix max',
      'filters.minRooms': 'Chambres min',
      'filters.rooms': 'Chambres',
      'filters.apply': 'Appliquer',
      'filters.reset': 'Réinitialiser',
      'common.cancel': 'Annuler',
    };
    return translations[key] ?? key;
  },
  useLocale: () => 'fr',
}));

vi.mock('@/features/listings/constants/governorates', () => ({
  GOVERNORATES: [
    { value: 'tunis', labelFr: 'Tunis', labelAr: 'تونس', labelEn: 'Tunis' },
    { value: 'sfax', labelFr: 'Sfax', labelAr: 'صفاقس', labelEn: 'Sfax' },
  ],
}));

import { FilterDrawer } from '../filter-drawer';

describe('FilterDrawer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders desktop sidebar with filter labels', () => {
    const onChange = vi.fn();
    render(<FilterDrawer values={{}} onChange={onChange} />);

    // "Filtres" appears twice (mobile button + desktop heading), use getAllByText
    expect(screen.getAllByText('Filtres').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Gouvernorat').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Fourchette de prix').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Chambres min').length).toBeGreaterThanOrEqual(1);
  });

  it('renders mobile toggle button', () => {
    const onChange = vi.fn();
    render(<FilterDrawer values={{}} onChange={onChange} />);

    // Mobile button contains "Filtres" text
    const buttons = screen.getAllByRole('button');
    const mobileFilterButton = buttons.find((b) => b.textContent?.includes('Filtres'));
    expect(mobileFilterButton).toBeTruthy();
  });

  it('renders apply and reset buttons in desktop sidebar', () => {
    const onChange = vi.fn();
    render(<FilterDrawer values={{}} onChange={onChange} />);

    expect(screen.getAllByText('Appliquer').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Réinitialiser').length).toBeGreaterThanOrEqual(1);
  });

  it('calls onChange with empty values when reset is clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <FilterDrawer
        values={{ governorate: 'tunis', minPrice: 100000 }}
        onChange={onChange}
      />,
    );

    // Click the first reset button (desktop sidebar)
    const resetButtons = screen.getAllByText('Réinitialiser');
    expect(resetButtons.length).toBeGreaterThan(0);
    await user.click(resetButtons[0]!);

    expect(onChange).toHaveBeenCalledWith({});
  });

  it('renders governorate options in select', () => {
    const onChange = vi.fn();
    render(<FilterDrawer values={{}} onChange={onChange} />);

    const options = screen.getAllByRole('option');
    const optionTexts = options.map((o) => o.textContent);
    expect(optionTexts).toContain('Tous les gouvernorats');
    expect(optionTexts).toContain('Tunis');
    expect(optionTexts).toContain('Sfax');
  });

  it('renders price inputs', () => {
    const onChange = vi.fn();
    render(<FilterDrawer values={{}} onChange={onChange} />);

    expect(screen.getAllByPlaceholderText('Prix min').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByPlaceholderText('Prix max').length).toBeGreaterThanOrEqual(1);
  });
});
