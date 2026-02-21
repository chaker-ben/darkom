import type { Decimal } from '@prisma/client/runtime/library';
import type { ListingCategory, ListingStatus, ListingType } from '@darkom/db';

/** Minimal listing data for card display */
export type ListingCardData = {
  id: string;
  type: ListingType;
  category: ListingCategory;
  titleFr: string;
  titleAr: string | null;
  titleEn: string | null;
  price: Decimal;
  priceCurrency: string;
  surface: Decimal | null;
  rooms: number | null;
  bathrooms: number | null;
  governorate: string;
  city: string;
  images: string[];
  status: ListingStatus;
  featured: boolean;
  createdAt: Date;
};

/** Full listing data for detail page */
export type ListingDTO = ListingCardData & {
  descriptionFr: string | null;
  descriptionAr: string | null;
  descriptionEn: string | null;
  address: string | null;
  floor: number | null;
  viewsCount: number;
  userId: string;
  user: {
    id: string;
    fullName: string | null;
    avatarUrl: string | null;
    phone: string | null;
  };
};

/** Query filters for listings list */
export type ListingFilters = {
  type?: ListingType;
  category?: ListingCategory;
  governorate?: string;
  minPrice?: number;
  maxPrice?: number;
  rooms?: number;
  page?: number;
  limit?: number;
};
