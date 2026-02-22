type ListingJsonLdInput = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  priceCurrency: string;
  images: string[];
  governorate: string;
  city: string;
  category: string;
  type: string;
  surface: number | null;
  rooms: number | null;
  bathrooms: number | null;
  url: string;
};

export function generateListingJsonLd(listing: ListingJsonLdInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: listing.title,
    description: listing.description ?? undefined,
    url: listing.url,
    image: listing.images,
    offers: {
      '@type': 'Offer',
      price: listing.price,
      priceCurrency: listing.priceCurrency,
      availability: 'https://schema.org/InStock',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: listing.city,
      addressRegion: listing.governorate,
      addressCountry: 'TN',
    },
    ...(listing.surface && {
      floorSize: {
        '@type': 'QuantitativeValue',
        value: listing.surface,
        unitCode: 'MTK',
      },
    }),
    ...(listing.rooms && {
      numberOfRooms: listing.rooms,
    }),
    ...(listing.bathrooms && {
      numberOfBathroomsTotal: listing.bathrooms,
    }),
  };
}

export function generateOrganizationJsonLd() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://darkom.com';

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'DARKOM',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: 'SuperApp Immobilier & Services en Tunisie',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'TN',
    },
    sameAs: [],
  };
}

type BreadcrumbItem = {
  name: string;
  url: string;
};

export function generateBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
