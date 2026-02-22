import { redirect } from 'next/navigation';

import { setRequestLocale } from 'next-intl/server';

import { Header } from '@/components/layout/header';
import { AdminSidebar } from '@/features/admin/components/admin-sidebar';
import { getCurrentProfile } from '@/lib/auth';

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const profile = await getCurrentProfile();

  if (!profile || profile.role !== 'ADMIN') {
    redirect(`/${locale}`);
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:px-8">
        <AdminSidebar />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
