import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const mockPush = vi.fn();
const mockBack = vi.fn();
const mockMutate = vi.fn();

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'fr',
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
  }),
}));

// Mock @darkom/ui
vi.mock('@darkom/ui', () => ({
  Button: ({
    children,
    disabled,
    variant: _variant,
    ...props
  }: {
    children: React.ReactNode;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    variant?: string;
    onClick?: () => void;
  }) => (
    <button disabled={disabled} {...props}>
      {children}
    </button>
  ),
  Input: ({
    error,
    ...props
  }: {
    error?: string;
    type?: string;
    step?: string;
    dir?: string;
    name?: string;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
  }) => (
    <div>
      <input data-testid={`input-${props.name ?? ''}`} {...props} />
      {error && <span className="error">{error}</span>}
    </div>
  ),
  Select: ({
    error,
    options: _options,
    placeholder: _placeholder,
    ...props
  }: {
    error?: string;
    options?: Array<{ value: string; label: string }>;
    placeholder?: string;
    name?: string;
    onChange?: React.ChangeEventHandler<HTMLSelectElement>;
    onBlur?: React.FocusEventHandler<HTMLSelectElement>;
  }) => (
    <div>
      <select data-testid={`select-${props.name ?? ''}`} {...props} />
      {error && <span className="error">{error}</span>}
    </div>
  ),
  Textarea: ({
    error,
    ...props
  }: {
    error?: string;
    name?: string;
    onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
    onBlur?: React.FocusEventHandler<HTMLTextAreaElement>;
  }) => (
    <div>
      <textarea data-testid={`textarea-${props.name ?? ''}`} {...props} />
      {error && <span className="error">{error}</span>}
    </div>
  ),
}));

// Mock image uploader
vi.mock('../image-uploader', () => ({
  ImageUploader: ({
    images,
  }: {
    images: string[];
    uploading: boolean;
    error: string | null;
    onUpload: (files: File[]) => void;
    onRemove: (index: number) => void;
  }) => <div data-testid="image-uploader">{images.length} images</div>,
}));

// Mock use-image-upload
vi.mock('../../hooks/use-image-upload', () => ({
  useImageUpload: (initialImages: string[] = []) => ({
    images: initialImages,
    uploading: false,
    error: null,
    uploadFiles: vi.fn(),
    removeImage: vi.fn(),
    setImages: vi.fn(),
  }),
}));

// Mock use-update-listing
vi.mock('../../hooks/use-update-listing', () => ({
  useUpdateListing: () => ({
    mutate: mockMutate,
    isPending: false,
    error: null,
  }),
}));

// Mock lucide-react
vi.mock('lucide-react', () => ({
  AlertTriangle: ({ size: _size, ...props }: { size?: number; className?: string }) => (
    <span data-testid="alert-icon" {...props} />
  ),
  Loader2: ({ size: _size, ...props }: { size?: number; className?: string }) => (
    <span data-testid="loader-icon" {...props} />
  ),
}));

// Mock governorates
vi.mock('../../constants/governorates', () => ({
  GOVERNORATES: [
    { value: 'tunis', labelFr: 'Tunis', labelAr: 'tunis-ar', labelEn: 'Tunis' },
  ],
}));

import { EditListingForm } from '../edit-listing-form';

const defaultListing = {
  id: 'listing-123',
  type: 'SALE' as const,
  category: 'APARTMENT' as const,
  titleFr: 'Appartement lumineux',
  titleAr: undefined,
  titleEn: undefined,
  descriptionFr: 'Belle vue',
  descriptionAr: undefined,
  descriptionEn: undefined,
  price: 150000,
  surface: 120,
  rooms: 3,
  bathrooms: 2,
  governorate: 'tunis',
  city: 'La Marsa',
  address: undefined,
  images: ['https://example.com/img1.jpg', 'https://example.com/img2.jpg'],
};

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('EditListingForm', () => {
  it('renders with pre-filled data', () => {
    render(<EditListingForm listing={defaultListing} />);

    // The form should render with the listing data
    expect(screen.getByTestId('input-titleFr')).toHaveValue('Appartement lumineux');
    expect(screen.getByTestId('input-city')).toHaveValue('La Marsa');
    expect(screen.getByTestId('input-price')).toHaveValue(150000);
    expect(screen.getByTestId('input-surface')).toHaveValue(120);
    expect(screen.getByTestId('input-rooms')).toHaveValue(3);
    expect(screen.getByTestId('input-bathrooms')).toHaveValue(2);
  });

  it('displays pending notice banner', () => {
    render(<EditListingForm listing={defaultListing} />);

    expect(screen.getByText('editPendingNotice')).toBeInTheDocument();
    expect(screen.getByTestId('alert-icon')).toBeInTheDocument();
  });

  it('renders images from listing data', () => {
    render(<EditListingForm listing={defaultListing} />);

    expect(screen.getByTestId('image-uploader')).toHaveTextContent('2 images');
  });

  it('calls mutate with form data on submit', async () => {
    render(<EditListingForm listing={defaultListing} />);

    const submitButton = screen.getByText('editSubmit');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalled();
    });

    const callArgs = mockMutate.mock.calls[0] as [Record<string, unknown>, Record<string, unknown>];
    expect(callArgs[0]).toMatchObject({
      titleFr: 'Appartement lumineux',
      city: 'La Marsa',
      images: ['https://example.com/img1.jpg', 'https://example.com/img2.jpg'],
    });
  });

  it('redirects to dashboard on successful update', async () => {
    mockMutate.mockImplementation(
      (_data: Record<string, unknown>, options: { onSuccess: () => void }) => {
        options.onSuccess();
      },
    );

    render(<EditListingForm listing={defaultListing} />);

    const submitButton = screen.getByText('editSubmit');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/fr/dashboard');
    });
  });

  it('navigates back when cancel is clicked', () => {
    render(<EditListingForm listing={defaultListing} />);

    const cancelButton = screen.getByText('cancel');
    fireEvent.click(cancelButton);

    expect(mockBack).toHaveBeenCalled();
  });

  it('renders submit and cancel buttons', () => {
    render(<EditListingForm listing={defaultListing} />);

    expect(screen.getByText('editSubmit')).toBeInTheDocument();
    expect(screen.getByText('cancel')).toBeInTheDocument();
  });

  it('disables submit button when images array is empty', () => {
    const listingWithNoImages = { ...defaultListing, images: [] as string[] };
    render(<EditListingForm listing={listingWithNoImages} />);

    const submitButton = screen.getByText('editSubmit');
    expect(submitButton).toBeDisabled();
  });
});
