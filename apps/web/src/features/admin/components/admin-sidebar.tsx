'use client';

import { BarChart3, FileText } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Link, usePathname } from '@/i18n/navigation';

const adminLinks = [
  { href: '/admin', labelKey: 'admin.stats', icon: BarChart3 },
  { href: '/admin/listings', labelKey: 'admin.listings', icon: FileText },
] as const;

export function AdminSidebar() {
  const t = useTranslations();
  const pathname = usePathname();

  return (
    <aside className="w-full shrink-0 lg:w-56">
      <nav className="flex gap-1 overflow-x-auto lg:flex-col">
        {adminLinks.map((link) => {
          const isActive =
            link.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
              }`}
            >
              <Icon size={16} />
              {t(link.labelKey)}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
