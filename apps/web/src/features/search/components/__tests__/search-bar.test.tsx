/// <reference types="@testing-library/jest-dom/vitest" />
import React from 'react';

import { render, screen, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      placeholder: 'Ville, quartier, gouvernorat...',
      button: 'Rechercher',
    };
    return translations[key] ?? key;
  },
}));

import { SearchBar } from '../search-bar';

describe('SearchBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with placeholder text', () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);

    expect(screen.getByPlaceholderText('Ville, quartier, gouvernorat...')).toBeInTheDocument();
  });

  it('renders with default value', () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} defaultValue="Tunis" />);

    expect(screen.getByDisplayValue('Tunis')).toBeInTheDocument();
  });

  it('calls onSearch on form submit in hero variant', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} variant="hero" />);

    const input = screen.getByPlaceholderText('Ville, quartier, gouvernorat...');
    await user.clear(input);
    await user.type(input, 'Sousse');

    const button = screen.getByRole('button', { name: 'Rechercher' });
    await user.click(button);

    expect(onSearch).toHaveBeenCalledWith('Sousse');
  });

  it('debounces search in inline variant', async () => {
    vi.useFakeTimers();
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} variant="inline" />);

    const input = screen.getByPlaceholderText('Ville, quartier, gouvernorat...');

    // Use fireEvent.change for React synthetic events with fake timers
    fireEvent.change(input, { target: { value: 'Sfax' } });

    // Should not have called yet (debounce)
    expect(onSearch).not.toHaveBeenCalled();

    // Advance timers past debounce
    await act(() => {
      vi.advanceTimersByTime(350);
    });

    expect(onSearch).toHaveBeenCalledWith('Sfax');
    vi.useRealTimers();
  });

  it('renders search button in hero variant', () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} variant="hero" />);

    expect(screen.getByRole('button', { name: 'Rechercher' })).toBeInTheDocument();
  });

  it('does not render search button in inline variant', () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} variant="inline" />);

    expect(screen.queryByRole('button', { name: 'Rechercher' })).not.toBeInTheDocument();
  });
});
