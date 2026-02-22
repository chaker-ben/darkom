import { describe, expect, it } from 'vitest';

import {
  generateBreadcrumbJsonLd,
  generateListingJsonLd,
  generateOrganizationJsonLd,
} from '../structured-data';

describe('generateListingJsonLd', () => {
  const baseListing = {
    id: 'test-1',
    title: 'Apartment in Tunis',
    description: 'A nice apartment',
    price: 250000,
    priceCurrency: 'TND',
    images: ['https://example.com/img1.jpg'],
    governorate: 'Tunis',
    city: 'Tunis',
    category: 'APARTMENT',
    type: 'SALE',
    surface: 120,
    rooms: 3,
    bathrooms: 2,
    url: 'https://darkom.com/fr/listings/test-1',
  };

  it('generates valid RealEstateListing schema', () => {
    const jsonLd = generateListingJsonLd(baseListing);

    expect(jsonLd['@context']).toBe('https://schema.org');
    expect(jsonLd['@type']).toBe('RealEstateListing');
    expect(jsonLd.name).toBe('Apartment in Tunis');
    expect(jsonLd.offers.price).toBe(250000);
    expect(jsonLd.offers.priceCurrency).toBe('TND');
  });

  it('includes address with country TN', () => {
    const jsonLd = generateListingJsonLd(baseListing);

    expect(jsonLd.address.addressLocality).toBe('Tunis');
    expect(jsonLd.address.addressRegion).toBe('Tunis');
    expect(jsonLd.address.addressCountry).toBe('TN');
  });

  it('formats price correctly for different currencies', () => {
    const jsonLd = generateListingJsonLd({ ...baseListing, price: 150000 });

    expect(jsonLd.offers.price).toBe(150000);
  });

  it('includes floor size when surface is provided', () => {
    const jsonLd = generateListingJsonLd(baseListing);

    expect(jsonLd.floorSize).toBeDefined();
    expect(jsonLd.floorSize?.value).toBe(120);
    expect(jsonLd.floorSize?.unitCode).toBe('MTK');
  });

  it('omits floor size when surface is null', () => {
    const jsonLd = generateListingJsonLd({ ...baseListing, surface: null });

    expect(jsonLd.floorSize).toBeUndefined();
  });

  it('omits numberOfRooms when rooms is null', () => {
    const jsonLd = generateListingJsonLd({ ...baseListing, rooms: null });

    expect(jsonLd.numberOfRooms).toBeUndefined();
  });

  it('omits numberOfBathroomsTotal when bathrooms is null', () => {
    const jsonLd = generateListingJsonLd({ ...baseListing, bathrooms: null });

    expect(jsonLd.numberOfBathroomsTotal).toBeUndefined();
  });

  it('handles null description gracefully', () => {
    const jsonLd = generateListingJsonLd({ ...baseListing, description: null });

    expect(jsonLd.description).toBeUndefined();
  });
});

describe('generateOrganizationJsonLd', () => {
  it('generates valid Organization schema', () => {
    const jsonLd = generateOrganizationJsonLd();

    expect(jsonLd['@context']).toBe('https://schema.org');
    expect(jsonLd['@type']).toBe('Organization');
    expect(jsonLd.name).toBe('DARKOM');
  });

  it('includes logo URL', () => {
    const jsonLd = generateOrganizationJsonLd();

    expect(jsonLd.logo).toContain('/logo.png');
  });

  it('includes address with country TN', () => {
    const jsonLd = generateOrganizationJsonLd();

    expect(jsonLd.address.addressCountry).toBe('TN');
  });
});

describe('generateBreadcrumbJsonLd', () => {
  it('generates valid BreadcrumbList schema', () => {
    const items = [
      { name: 'Home', url: 'https://darkom.com/fr' },
      { name: 'Buy', url: 'https://darkom.com/fr/buy' },
    ];

    const jsonLd = generateBreadcrumbJsonLd(items);

    expect(jsonLd['@context']).toBe('https://schema.org');
    expect(jsonLd['@type']).toBe('BreadcrumbList');
    expect(jsonLd.itemListElement).toHaveLength(2);
    expect(jsonLd.itemListElement[0]!.position).toBe(1);
    expect(jsonLd.itemListElement[1]!.position).toBe(2);
  });

  it('assigns correct names to breadcrumb items', () => {
    const items = [
      { name: 'DARKOM', url: 'https://darkom.com/fr' },
      { name: 'Listings', url: 'https://darkom.com/fr/listings' },
    ];

    const jsonLd = generateBreadcrumbJsonLd(items);

    expect(jsonLd.itemListElement[0]!.name).toBe('DARKOM');
    expect(jsonLd.itemListElement[1]!.name).toBe('Listings');
  });

  it('handles single item breadcrumb', () => {
    const items = [{ name: 'Home', url: 'https://darkom.com/fr' }];

    const jsonLd = generateBreadcrumbJsonLd(items);

    expect(jsonLd.itemListElement).toHaveLength(1);
    expect(jsonLd.itemListElement[0]!.position).toBe(1);
  });

  it('handles empty breadcrumb list', () => {
    const jsonLd = generateBreadcrumbJsonLd([]);

    expect(jsonLd.itemListElement).toHaveLength(0);
  });
});
