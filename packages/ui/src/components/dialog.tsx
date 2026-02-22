'use client';

import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import type { HTMLAttributes, MouseEvent, ReactNode } from 'react';

import { cva } from 'class-variance-authority';
import { createPortal } from 'react-dom';

import { cn } from '../lib/utils';

import type { VariantProps } from 'class-variance-authority';


// ---------------------------------------------------------------------------
// Dialog Root — manages open/close state and portal rendering
// ---------------------------------------------------------------------------

export type DialogProps = {
  /** Whether the dialog is open */
  open: boolean;
  /** Callback fired when the open state should change */
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
};

export function Dialog({ open, children }: DialogProps) {
  const [mounted, setMounted] = useState(false);

  // Ensure we only render the portal on the client (SSR-safe)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when the dialog is open
  useEffect(() => {
    if (open) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [open]);

  if (!open || !mounted) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      {children}
    </div>,
    document.body,
  );
}

// ---------------------------------------------------------------------------
// DialogOverlay — backdrop; click to close
// ---------------------------------------------------------------------------

export type DialogOverlayProps = HTMLAttributes<HTMLDivElement> & {
  /** Called when the overlay is clicked */
  onClose?: () => void;
};

export const DialogOverlay = forwardRef<HTMLDivElement, DialogOverlayProps>(
  ({ className, onClose, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-200',
        className,
      )}
      onClick={onClose}
      aria-hidden="true"
      {...props}
    />
  ),
);
DialogOverlay.displayName = 'DialogOverlay';

// ---------------------------------------------------------------------------
// DialogContent — main modal container with size variants
// ---------------------------------------------------------------------------

export const contentVariants = cva(
  [
    'relative z-50 flex max-h-[85vh] flex-col overflow-auto rounded-2xl bg-white shadow-xl',
    'transition-all duration-200',
    'mx-4',
  ].join(' '),
  {
    variants: {
      size: {
        sm: 'w-full max-w-sm',
        md: 'w-full max-w-lg',
        lg: 'w-full max-w-2xl',
        xl: 'w-full max-w-4xl',
        full: 'h-screen w-screen max-w-none rounded-none mx-0',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export type DialogContentProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof contentVariants> & {
    /** Called when the user requests closing (Escape key) */
    onClose?: () => void;
  };

const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, size, onClose, children, ...props }, ref) => {
    const contentRef = useRef<HTMLDivElement | null>(null);

    // Focus trap + Escape to close
    useEffect(() => {
      const el = contentRef.current;
      if (!el) return;

      // Focus the first focusable element inside the dialog
      const firstFocusable = el.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
      firstFocusable?.focus();

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose?.();
          return;
        }

        // Focus trap: cycle focus within the dialog
        if (e.key === 'Tab') {
          const focusables = el.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
          if (focusables.length === 0) return;

          const first = focusables[0];
          const last = focusables[focusables.length - 1];

          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last?.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first?.focus();
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    // Prevent overlay click-through
    const handleClick = useCallback((e: MouseEvent) => {
      e.stopPropagation();
    }, []);

    return (
      <div
        ref={(node) => {
          contentRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) (ref as React.RefObject<HTMLDivElement | null>).current = node;
        }}
        className={cn(contentVariants({ size, className }))}
        onClick={handleClick}
        {...props}
      >
        {children}
      </div>
    );
  },
);
DialogContent.displayName = 'DialogContent';

// ---------------------------------------------------------------------------
// DialogHeader
// ---------------------------------------------------------------------------

export type DialogHeaderProps = HTMLAttributes<HTMLDivElement>;

export const DialogHeader = forwardRef<HTMLDivElement, DialogHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-center justify-between border-b border-neutral-100 px-6 py-4',
        className,
      )}
      {...props}
    />
  ),
);
DialogHeader.displayName = 'DialogHeader';

// ---------------------------------------------------------------------------
// DialogTitle
// ---------------------------------------------------------------------------

export type DialogTitleProps = HTMLAttributes<HTMLHeadingElement>;

export const DialogTitle = forwardRef<HTMLHeadingElement, DialogTitleProps>(
  ({ className, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn('text-lg font-semibold text-neutral-900', className)}
      {...props}
    />
  ),
);
DialogTitle.displayName = 'DialogTitle';

// ---------------------------------------------------------------------------
// DialogClose — close button with an inline X icon (no external icon dep)
// ---------------------------------------------------------------------------

export type DialogCloseProps = HTMLAttributes<HTMLButtonElement> & {
  /** Called when the close button is clicked */
  onClose?: () => void;
};

/**
 * Inline X (close) icon to avoid requiring lucide-react as a dependency
 * in the shared UI package.
 */
function CloseIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export const DialogClose = forwardRef<HTMLButtonElement, DialogCloseProps>(
  ({ className, onClose, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      onClick={onClose}
      className={cn(
        'rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
        className,
      )}
      aria-label="Close"
      {...props}
    >
      <CloseIcon size={20} />
    </button>
  ),
);
DialogClose.displayName = 'DialogClose';

// ---------------------------------------------------------------------------
// DialogBody — optional convenience wrapper for dialog body content
// ---------------------------------------------------------------------------

export type DialogBodyProps = HTMLAttributes<HTMLDivElement>;

export const DialogBody = forwardRef<HTMLDivElement, DialogBodyProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex-1 overflow-auto px-6 py-4', className)}
      {...props}
    />
  ),
);
DialogBody.displayName = 'DialogBody';

// ---------------------------------------------------------------------------
// DialogFooter — optional convenience wrapper for dialog footer/actions
// ---------------------------------------------------------------------------

export type DialogFooterProps = HTMLAttributes<HTMLDivElement>;

export const DialogFooter = forwardRef<HTMLDivElement, DialogFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-center justify-end gap-3 border-t border-neutral-100 px-6 py-4',
        className,
      )}
      {...props}
    />
  ),
);
DialogFooter.displayName = 'DialogFooter';
