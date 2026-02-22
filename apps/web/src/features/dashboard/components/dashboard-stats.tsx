'use client';

import { BarChart3, CheckCircle, Clock, Eye } from 'lucide-react';
import { useTranslations } from 'next-intl';

type DashboardStatsProps = {
  total: number;
  active: number;
  totalViews: number;
  pending: number;
};

export function DashboardStats({ total, active, totalViews, pending }: DashboardStatsProps) {
  const t = useTranslations('dashboard.stats');

  const stats = [
    { label: t('total'), value: total, icon: BarChart3, color: 'text-primary-600 bg-primary-50' },
    { label: t('active'), value: active, icon: CheckCircle, color: 'text-green-600 bg-green-50' },
    { label: t('views'), value: totalViews, icon: Eye, color: 'text-blue-600 bg-blue-50' },
    { label: t('pending'), value: pending, icon: Clock, color: 'text-amber-600 bg-amber-50' },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl border border-neutral-100 bg-white p-4 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className={`rounded-lg p-2 ${stat.color}`}>
              <stat.icon size={18} />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">{stat.value}</p>
              <p className="text-xs text-neutral-500">{stat.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
