'use client';

import { Suspense } from 'react';

import { ListingsGridWithSearch } from './listings-grid-with-search';

export function RentPageContent() {
  return (
    <Suspense>
      <ListingsGridWithSearch fixedType="RENT" />
    </Suspense>
  );
}
