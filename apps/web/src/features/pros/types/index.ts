import type { ProPlan } from '@darkom/db';

/** Minimal pro data for card display */
export type ProCardData = {
  id: string;
  businessNameFr: string;
  businessNameAr: string | null;
  category: string;
  phone: string;
  whatsapp: string | null;
  governorates: string[];
  plan: ProPlan;
  rating: number;
  reviewsCount: number;
  verified: boolean;
  logoUrl: string | null;
  user: {
    id: string;
    fullName: string | null;
    avatarUrl: string | null;
  };
};

/** Full pro data for detail page */
export type ProDTO = ProCardData & {
  bioFr: string | null;
  bioAr: string | null;
  coverUrl: string | null;
  createdAt: Date;
  reviews: ReviewData[];
};

/** Review data for display */
export type ReviewData = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  author: {
    id: string;
    fullName: string | null;
    avatarUrl: string | null;
  };
};

/** Query filters for pros list */
export type ProFilters = {
  category?: string;
  governorate?: string;
  search?: string;
  page?: number;
  limit?: number;
};
