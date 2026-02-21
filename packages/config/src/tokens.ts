export const colors = {
  primary: {
    50: '#EEF5FF',
    100: '#D9E8FF',
    200: '#B3D1FF',
    300: '#8DBAFF',
    400: '#5B9BD5',
    500: '#2E75B6',
    600: '#1E5C96',
    700: '#1B4F8A',
    800: '#153D6B',
    900: '#0F2D52',
    950: '#0A1F3A',
  },
  accent: {
    50: '#FFFBEB',
    100: '#FFF3C4',
    200: '#FCE588',
    300: '#FBBF24',
    400: '#F5A623',
    500: '#E8920E',
    600: '#CC7A00',
    700: '#A35F00',
    800: '#7A4700',
    900: '#523000',
  },
  success: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    500: '#16A34A',
    600: '#15803D',
    700: '#166534',
  },
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    500: '#D97706',
    600: '#B45309',
    700: '#92400E',
  },
  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    500: '#DC2626',
    600: '#B91C1C',
    700: '#991B1B',
  },
  neutral: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
    950: '#020617',
  },
} as const;

export const fonts = {
  sans: ['Sora', 'sans-serif'],
  arabic: ['Noto Naskh Arabic', 'serif'],
} as const;

export const radius = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  full: '9999px',
} as const;

export const shadows = {
  sm: '0 2px 12px rgba(27, 79, 138, 0.06)',
  md: '0 4px 24px rgba(27, 79, 138, 0.10)',
  lg: '0 12px 48px rgba(27, 79, 138, 0.16)',
} as const;

export type Colors = typeof colors;
export type Fonts = typeof fonts;
