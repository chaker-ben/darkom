import type { ReactNode } from 'react';

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('@/i18n/navigation', () => ({
  Link: ({ children, href, ...props }: { children: ReactNode; href: string } & Record<string, unknown>) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

vi.mock('@darkom/ui', () => ({
  Button: ({
    children,
    onClick,
    disabled,
    className,
    ...props
  }: {
    children: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
  } & Record<string, unknown>) => (
    <button onClick={onClick} disabled={disabled} className={className} {...props}>
      {children}
    </button>
  ),
  Dialog: ({ open, children }: { open: boolean; children: ReactNode }) =>
    open ? <div data-testid="dialog">{children}</div> : null,
  DialogOverlay: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="overlay" onClick={onClose} />
  ),
  DialogContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  DialogHeader: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  DialogTitle: ({ children }: { children: ReactNode }) => <h2>{children}</h2>,
  DialogClose: ({ onClose }: { onClose: () => void }) => (
    <button onClick={onClose} aria-label="Close">
      X
    </button>
  ),
  DialogBody: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  DialogFooter: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

const mockMutate = vi.fn();
vi.mock('../../hooks/use-delete-listing', () => ({
  useDeleteListing: () => ({
    mutate: mockMutate,
    isPending: false,
  }),
}));

import { ListingActions } from '../listing-actions';

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('ListingActions', () => {
  it('renders edit link with correct href', () => {
    render(<ListingActions listingId="listing-1" />);
    const editLink = screen.getByText('edit').closest('a');
    expect(editLink?.getAttribute('href')).toBe('/listings/listing-1/edit');
  });

  it('opens delete confirmation dialog', () => {
    render(<ListingActions listingId="listing-1" />);
    expect(screen.queryByTestId('dialog')).toBeNull();
    const deleteButton = screen.getByText('delete');
    fireEvent.click(deleteButton);
    expect(screen.getByTestId('dialog')).toBeDefined();
    expect(screen.getByText('confirmDelete')).toBeDefined();
  });

  it('calls delete mutation when confirmed', () => {
    render(<ListingActions listingId="listing-1" />);
    fireEvent.click(screen.getByText('delete'));
    const dialogDeleteButtons = screen.getAllByText('delete');
    const confirmButton = dialogDeleteButtons.at(-1);
    expect(confirmButton).toBeDefined();
    if (confirmButton) {
      fireEvent.click(confirmButton);
    }
    expect(mockMutate).toHaveBeenCalledWith('listing-1', expect.any(Object));
  });

  it('closes dialog when cancel is clicked', () => {
    render(<ListingActions listingId="listing-1" />);
    fireEvent.click(screen.getByText('delete'));
    expect(screen.getByTestId('dialog')).toBeDefined();
    fireEvent.click(screen.getByText('cancel'));
    expect(screen.queryByTestId('dialog')).toBeNull();
  });

  it('closes dialog when close button is clicked', () => {
    render(<ListingActions listingId="listing-1" />);
    fireEvent.click(screen.getByText('delete'));
    expect(screen.getByTestId('dialog')).toBeDefined();
    fireEvent.click(screen.getByLabelText('Close'));
    expect(screen.queryByTestId('dialog')).toBeNull();
  });
});
