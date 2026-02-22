import { forwardRef } from 'react';
import type { SelectHTMLAttributes } from 'react';

import { cva } from 'class-variance-authority';

import { cn } from '../lib/utils';

import type { VariantProps } from 'class-variance-authority';

export const selectVariants = cva(
  'w-full appearance-none rounded-[var(--radius-input)] text-neutral-900 outline-none transition-colors focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 bg-[url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22/%3E%3C/svg%3E")] bg-[length:16px] bg-[position:right_12px_center] bg-no-repeat pe-10',
  {
    variants: {
      variant: {
        default: 'border border-neutral-200 bg-white hover:border-neutral-300',
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

export type SelectOption = {
  value: string;
  label: string;
};

export type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> &
  VariantProps<typeof selectVariants> & {
    options: SelectOption[];
    placeholder?: string;
    error?: string;
  };

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, variant, size, options, placeholder, error, ...props }, ref) => {
    return (
      <div>
        <select
          className={cn(
            selectVariants({ variant, size }),
            error && 'border-error-500 focus:ring-error-500',
            !props.value && placeholder && 'text-neutral-400',
            className,
          )}
          ref={ref}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-1 text-xs text-error-500">{error}</p>
        )}
      </div>
    );
  },
);

Select.displayName = 'Select';
