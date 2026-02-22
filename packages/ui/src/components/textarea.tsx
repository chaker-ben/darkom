import { forwardRef } from 'react';
import type { TextareaHTMLAttributes } from 'react';

import { cva } from 'class-variance-authority';

import { cn } from '../lib/utils';

import type { VariantProps } from 'class-variance-authority';

export const textareaVariants = cva(
  'w-full rounded-[var(--radius-input)] text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 resize-y',
  {
    variants: {
      variant: {
        default: 'border border-neutral-200 bg-white hover:border-neutral-300',
        ghost: 'border border-transparent bg-transparent hover:bg-neutral-50',
      },
      size: {
        sm: 'px-3 py-2 text-xs',
        md: 'px-4 py-3 text-sm',
        lg: 'px-5 py-4 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
);

export type TextareaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> &
  VariantProps<typeof textareaVariants> & {
    error?: string;
  };

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, size, error, rows = 4, ...props }, ref) => {
    return (
      <div>
        <textarea
          className={cn(
            textareaVariants({ variant, size }),
            error && 'border-error-500 focus:ring-error-500',
            className,
          )}
          ref={ref}
          rows={rows}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-error-500">{error}</p>
        )}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';
