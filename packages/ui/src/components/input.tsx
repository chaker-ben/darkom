import { forwardRef } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';

import { cva } from 'class-variance-authority';

import { cn } from '../lib/utils';

import type { VariantProps } from 'class-variance-authority';


export const inputVariants = cva(
  'w-full rounded-[var(--radius-input)] text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border border-neutral-200 bg-white hover:border-neutral-300',
        search: 'border border-neutral-200 bg-neutral-50 hover:border-neutral-300',
        ghost: 'border border-transparent bg-transparent hover:bg-neutral-50',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-5 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
);

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> &
  VariantProps<typeof inputVariants> & {
    startIcon?: ReactNode;
    endIcon?: ReactNode;
    error?: string;
  };

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, startIcon, endIcon, error, ...props }, ref) => {
    return (
      <div className="relative">
        {startIcon && (
          <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3 text-neutral-400">
            {startIcon}
          </span>
        )}
        <input
          className={cn(
            inputVariants({ variant, size }),
            startIcon && 'ps-10',
            endIcon && 'pe-10',
            error && 'border-error-500 focus:ring-error-500',
            className,
          )}
          ref={ref}
          {...props}
        />
        {endIcon && (
          <span className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3 text-neutral-400">
            {endIcon}
          </span>
        )}
        {error && (
          <p className="mt-1 text-xs text-error-500">{error}</p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
