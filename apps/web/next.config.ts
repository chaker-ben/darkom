import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig = {
  transpilePackages: ['@darkom/config', '@darkom/db', '@darkom/i18n', '@darkom/utils', '@darkom/ui'],
  images: {
    remotePatterns: [
      {
        protocol: 'https' as const,
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https' as const,
        hostname: 'img.clerk.com',
      },
    ],
  },
};

export default withNextIntl(nextConfig);
