import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

// Polyfill window.matchMedia for jsdom
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

// Mock @darkom/ui Dialog components to avoid react-dom resolution from packages path
vi.mock('@darkom/ui', () => ({
  cn: (...args: unknown[]) => args.filter(Boolean).join(' '),
  Dialog: ({
    open,
    children,
  }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
  }) => (open ? <div role="dialog" aria-modal="true">{children}</div> : null),
  DialogOverlay: ({
    className: _className,
    onClose: _onClose,
    ...props
  }: {
    className?: string;
    onClose?: () => void;
    [key: string]: unknown;
  }) => <div aria-hidden="true" {...(props as React.HTMLAttributes<HTMLDivElement>)} />,
  DialogContent: ({
    children,
    size: _size,
    onClose: _onClose,
    className: _className,
    ...props
  }: {
    children: React.ReactNode;
    size?: string;
    onClose?: () => void;
    className?: string;
    [key: string]: unknown;
  }) => <div {...(props as React.HTMLAttributes<HTMLDivElement>)}>{children}</div>,
  DialogClose: ({
    onClose,
    className: _className,
    ...props
  }: {
    onClose?: () => void;
    className?: string;
    [key: string]: unknown;
  }) => (
    <button
      type="button"
      onClick={onClose}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      X
    </button>
  ),
}));

// Mock next/image to render a simple <img> tag
vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    fill: _fill,
    sizes: _sizes,
    priority: _priority,
    ...props
  }: {
    src: string;
    alt: string;
    fill?: boolean;
    sizes?: string;
    priority?: boolean;
    [key: string]: unknown;
  }) => <img src={src} alt={alt} data-testid="lightbox-image" {...props} />,
}));

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string, values?: Record<string, string>) => {
    if (key === 'counter' && values) return `${values.current} / ${values.total}`;
    return key;
  },
  useLocale: () => 'fr',
}));

// Mock framer-motion to render plain divs
vi.mock('framer-motion', () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  motion: {
    div: ({
      children,
      custom: _custom,
      variants: _variants,
      initial: _initial,
      animate: _animate,
      exit: _exit,
      transition: _transition,
      ...rest
    }: {
      children: React.ReactNode;
      custom?: unknown;
      variants?: unknown;
      initial?: unknown;
      animate?: unknown;
      exit?: unknown;
      transition?: unknown;
      [key: string]: unknown;
    }) => {
      return <div {...(rest as React.HTMLAttributes<HTMLDivElement>)}>{children}</div>;
    },
  },
}));

import { ImageLightbox } from '../image-lightbox';

const images = [
  'https://example.com/img1.jpg',
  'https://example.com/img2.jpg',
  'https://example.com/img3.jpg',
];

afterEach(cleanup);

describe('ImageLightbox', () => {
  it('renders current image when open', () => {
    render(
      <ImageLightbox
        images={images}
        title="Test Listing"
        open={true}
        onOpenChange={vi.fn()}
        initialIndex={0}
      />,
    );

    const imgs = screen.getAllByTestId('lightbox-image');
    expect(imgs[0]).toHaveAttribute('src', images[0]);
  });

  it('shows navigation buttons when at middle index', () => {
    render(
      <ImageLightbox
        images={images}
        title="Test Listing"
        open={true}
        onOpenChange={vi.fn()}
        initialIndex={1}
      />,
    );

    expect(screen.getByLabelText('previous')).toBeInTheDocument();
    expect(screen.getByLabelText('next')).toBeInTheDocument();
  });

  it('hides previous button on first image', () => {
    render(
      <ImageLightbox
        images={images}
        title="Test Listing"
        open={true}
        onOpenChange={vi.fn()}
        initialIndex={0}
      />,
    );

    expect(screen.queryByLabelText('previous')).not.toBeInTheDocument();
    expect(screen.getByLabelText('next')).toBeInTheDocument();
  });

  it('hides next button on last image', () => {
    render(
      <ImageLightbox
        images={images}
        title="Test Listing"
        open={true}
        onOpenChange={vi.fn()}
        initialIndex={2}
      />,
    );

    expect(screen.getByLabelText('previous')).toBeInTheDocument();
    expect(screen.queryByLabelText('next')).not.toBeInTheDocument();
  });

  it('navigates to next image on button click', () => {
    render(
      <ImageLightbox
        images={images}
        title="Test Listing"
        open={true}
        onOpenChange={vi.fn()}
        initialIndex={0}
      />,
    );

    const nextBtn = screen.getByLabelText('next');
    fireEvent.click(nextBtn);

    const imgs = screen.getAllByTestId('lightbox-image');
    expect(imgs[0]).toHaveAttribute('src', images[1]);
  });

  it('navigates to previous image on button click', () => {
    render(
      <ImageLightbox
        images={images}
        title="Test Listing"
        open={true}
        onOpenChange={vi.fn()}
        initialIndex={2}
      />,
    );

    const prevBtn = screen.getByLabelText('previous');
    fireEvent.click(prevBtn);

    const imgs = screen.getAllByTestId('lightbox-image');
    expect(imgs[0]).toHaveAttribute('src', images[1]);
  });

  it('shows image counter with localized numbers', () => {
    render(
      <ImageLightbox
        images={images}
        title="Test Listing"
        open={true}
        onOpenChange={vi.fn()}
        initialIndex={0}
      />,
    );

    expect(screen.getByText('1 / 3')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <ImageLightbox
        images={images}
        title="Test Listing"
        open={false}
        onOpenChange={vi.fn()}
      />,
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders thumbnail strip for multiple images', () => {
    render(
      <ImageLightbox
        images={images}
        title="Test Listing"
        open={true}
        onOpenChange={vi.fn()}
        initialIndex={0}
      />,
    );

    // 1 main image + 3 thumbnails = 4 total images
    const allImages = screen.getAllByTestId('lightbox-image');
    expect(allImages).toHaveLength(4);
  });

  it('switches to clicked thumbnail', () => {
    render(
      <ImageLightbox
        images={images}
        title="Test Listing"
        open={true}
        onOpenChange={vi.fn()}
        initialIndex={0}
      />,
    );

    // Click the third thumbnail
    const thumbBtn = screen.getByLabelText('Test Listing 3');
    fireEvent.click(thumbBtn);

    // Main image should now show the third image
    const imgs = screen.getAllByTestId('lightbox-image');
    expect(imgs[0]).toHaveAttribute('src', images[2]);
  });

  it('does not render thumbnails for a single image', () => {
    render(
      <ImageLightbox
        images={['https://example.com/only.jpg']}
        title="Single Image"
        open={true}
        onOpenChange={vi.fn()}
        initialIndex={0}
      />,
    );

    // Only 1 image total (the main image, no thumbnails)
    const allImages = screen.getAllByTestId('lightbox-image');
    expect(allImages).toHaveLength(1);
  });

  it('navigates with keyboard ArrowRight/ArrowLeft', () => {
    render(
      <ImageLightbox
        images={images}
        title="Test Listing"
        open={true}
        onOpenChange={vi.fn()}
        initialIndex={0}
      />,
    );

    // ArrowRight should go next in LTR
    fireEvent.keyDown(window, { key: 'ArrowRight' });

    const imgs = screen.getAllByTestId('lightbox-image');
    expect(imgs[0]).toHaveAttribute('src', images[1]);
  });
});
