import type { HTMLAttributes } from 'react';

import { cn } from '../lib/utils';


export type FilterTabItem = {
  value: string;
  label: string;
};

export type FilterTabsProps = Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> & {
  items: FilterTabItem[];
  value: string;
  onValueChange: (value: string) => void;
};

export function FilterTabs({
  items,
  value,
  onValueChange,
  className,
  ...props
}: FilterTabsProps) {
  return (
    <div
      className={cn('flex gap-3 overflow-x-auto pb-2', className)}
      role="tablist"
      {...props}
    >
      {items.map((item) => {
        const isActive = item.value === value;
        return (
          <button
            key={item.value}
            role="tab"
            aria-selected={isActive}
            className={cn(
              'whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary-700 text-white'
                : 'border border-neutral-200 bg-white text-neutral-500 hover:border-primary-300 hover:text-primary-700',
            )}
            onClick={() => {
              if (!isActive) {
                onValueChange(item.value);
              }
            }}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
