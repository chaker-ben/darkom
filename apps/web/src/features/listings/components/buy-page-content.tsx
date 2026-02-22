'use client';

import { Suspense } from 'react';

import { ListingsGridWithSearch } from './listings-grid-with-search';

export function BuyPageContent() {
  return (
    <Suspense>
      <ListingsGridWithSearch fixedType="SALE" />
    </Suspense>
  );
}
