/// <reference types="@testing-library/jest-dom/vitest" />
import React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => {
    const t = (key: string) => key;
    t.has = () => true;
    return t;
  },
  useLocale: () => 'fr',
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
}));

// Mock react-hook-form
const mockRegister = vi.fn(() => ({ name: 'test', ref: vi.fn() }));
const mockTrigger = vi.fn(() => Promise.resolve(true));
const mockHandleSubmit = vi.fn((fn: (data: unknown) => void) => (e: React.FormEvent) => {
  e.preventDefault();
  fn({});
});
const mockWatch = vi.fn((field?: string) => {
  if (field === 'governorates') return [];
  if (field) return '';
  return {
    businessNameFr: '',
    businessNameAr: '',
    category: '',
    phone: '',
    bioFr: '',
    bioAr: '',
    governorates: [],
  };
});

vi.mock('react-hook-form', () => ({
  useForm: () => ({
    register: mockRegister,
    handleSubmit: mockHandleSubmit,
    watch: mockWatch,
    setValue: vi.fn(),
    formState: { errors: {} },
    trigger: mockTrigger,
  }),
}));

// Mock @hookform/resolvers/zod
vi.mock('@hookform/resolvers/zod', () => ({
  zodResolver: () => vi.fn(),
}));

// Mock the register pro hook
vi.mock('../../hooks/use-register-pro', () => ({
  useRegisterPro: () => ({
    mutate: vi.fn(),
    isPending: false,
    error: null,
  }),
}));

// Mock @darkom/ui
vi.mock('@darkom/ui', () => ({
  Button: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props}>{children}</button>
  ),
  Input: React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { error?: string }>(
    ({ error, ...props }, ref) => (
      <div>
        <input ref={ref} {...props} />
        {error && <span>{error}</span>}
      </div>
    ),
  ),
  Select: React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement> & { options: Array<{ value: string; label: string }>; error?: string }>(
    ({ options, error, ...props }, ref) => (
      <div>
        <select ref={ref} {...props}>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {error && <span>{error}</span>}
      </div>
    ),
  ),
  Textarea: React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: string }>(
    ({ error, ...props }, ref) => (
      <div>
        <textarea ref={ref} {...props} />
        {error && <span>{error}</span>}
      </div>
    ),
  ),
}));

import { ProRegistrationForm } from '../pro-registration-form';

describe('ProRegistrationForm', () => {
  it('renders step 1 with business name input', () => {
    render(<ProRegistrationForm />);
    expect(screen.getByText('businessName')).toBeInTheDocument();
  });

  it('renders step indicator with 3 steps', () => {
    render(<ProRegistrationForm />);
    expect(screen.getByText('step1')).toBeInTheDocument();
    expect(screen.getByText('step2')).toBeInTheDocument();
    expect(screen.getByText('step3')).toBeInTheDocument();
  });

  it('renders category select on step 1', () => {
    render(<ProRegistrationForm />);
    expect(screen.getByText('category')).toBeInTheDocument();
  });

  it('renders phone input on step 1', () => {
    render(<ProRegistrationForm />);
    expect(screen.getByText('phone')).toBeInTheDocument();
  });

  it('renders next button on step 1', () => {
    render(<ProRegistrationForm />);
    expect(screen.getByText('next')).toBeInTheDocument();
  });

  it('does not render previous button on step 1', () => {
    render(<ProRegistrationForm />);
    expect(screen.queryByText('previous')).not.toBeInTheDocument();
  });
});
