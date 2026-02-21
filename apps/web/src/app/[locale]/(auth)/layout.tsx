import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-primary-700">
          DARKOM
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          دارك — Ta maison
        </p>
      </div>
      {children}
    </div>
  );
}
