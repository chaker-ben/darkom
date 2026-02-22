import { createRef } from 'react'

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from '../dialog'

// Mock createPortal to render children inline (jsdom has no real portal support)
vi.mock('react-dom', async () => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const actual = await vi.importActual<typeof import('react-dom')>('react-dom')
  return {
    ...actual,
    createPortal: (children: React.ReactNode) => children,
  }
})

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function TestDialog({
  open = true,
  onOpenChange = vi.fn(),
}: {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay onClose={() => onOpenChange(false)} />
      <DialogContent size="md" onClose={() => onOpenChange(false)}>
        <DialogHeader>
          <DialogTitle>Test Title</DialogTitle>
          <DialogClose onClose={() => onOpenChange(false)} />
        </DialogHeader>
        <DialogBody>
          <p>Dialog content</p>
        </DialogBody>
        <DialogFooter>
          <button type="button">Cancel</button>
          <button type="button">Confirm</button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

afterEach(cleanup)

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Dialog', () => {
  it('renders when open is true', () => {
    render(<TestDialog open={true} />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Dialog content')).toBeInTheDocument()
  })

  it('does not render when open is false', () => {
    render(<TestDialog open={false} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('has correct ARIA attributes', () => {
    render(<TestDialog />)
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
  })

  it('locks body scroll when open', () => {
    const { unmount } = render(<TestDialog open={true} />)
    expect(document.body.style.overflow).toBe('hidden')
    unmount()
  })

  it('restores body scroll on unmount', () => {
    document.body.style.overflow = 'auto'
    const { unmount } = render(<TestDialog open={true} />)
    expect(document.body.style.overflow).toBe('hidden')
    unmount()
    expect(document.body.style.overflow).toBe('auto')
  })
})

describe('DialogOverlay', () => {
  it('calls onClose when clicked', () => {
    const onOpenChange = vi.fn()
    render(<TestDialog onOpenChange={onOpenChange} />)
    const overlay = document.querySelector('[aria-hidden="true"]')
    expect(overlay).toBeInTheDocument()
    if (overlay) fireEvent.click(overlay)
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('has aria-hidden attribute', () => {
    render(<TestDialog />)
    const overlay = document.querySelector('[aria-hidden="true"]')
    expect(overlay).toBeInTheDocument()
  })
})

describe('DialogContent', () => {
  it('calls onClose when Escape is pressed', () => {
    const onOpenChange = vi.fn()
    render(<TestDialog onOpenChange={onOpenChange} />)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('stops propagation on content click', () => {
    const onOpenChange = vi.fn()
    render(<TestDialog onOpenChange={onOpenChange} />)
    const title = screen.getByText('Test Title')
    fireEvent.click(title)
    // onOpenChange should NOT be called from content click
    expect(onOpenChange).not.toHaveBeenCalled()
  })

  it('applies default size variant (md)', () => {
    render(
      <Dialog open={true} onOpenChange={vi.fn()}>
        <DialogContent data-testid="content" onClose={vi.fn()}>
          <p>Content</p>
        </DialogContent>
      </Dialog>,
    )
    const content = screen.getByTestId('content')
    expect(content.className).toContain('max-w-lg')
  })

  it('applies sm size variant', () => {
    render(
      <Dialog open={true} onOpenChange={vi.fn()}>
        <DialogContent size="sm" data-testid="content" onClose={vi.fn()}>
          <p>Content</p>
        </DialogContent>
      </Dialog>,
    )
    const content = screen.getByTestId('content')
    expect(content.className).toContain('max-w-sm')
  })

  it('applies lg size variant', () => {
    render(
      <Dialog open={true} onOpenChange={vi.fn()}>
        <DialogContent size="lg" data-testid="content" onClose={vi.fn()}>
          <p>Content</p>
        </DialogContent>
      </Dialog>,
    )
    const content = screen.getByTestId('content')
    expect(content.className).toContain('max-w-2xl')
  })

  it('applies xl size variant', () => {
    render(
      <Dialog open={true} onOpenChange={vi.fn()}>
        <DialogContent size="xl" data-testid="content" onClose={vi.fn()}>
          <p>Content</p>
        </DialogContent>
      </Dialog>,
    )
    const content = screen.getByTestId('content')
    expect(content.className).toContain('max-w-4xl')
  })

  it('applies full size variant', () => {
    render(
      <Dialog open={true} onOpenChange={vi.fn()}>
        <DialogContent size="full" data-testid="content" onClose={vi.fn()}>
          <p>Content</p>
        </DialogContent>
      </Dialog>,
    )
    const content = screen.getByTestId('content')
    expect(content.className).toContain('h-screen')
    expect(content.className).toContain('w-screen')
  })

  it('forwards ref', () => {
    const ref = createRef<HTMLDivElement>()
    render(
      <Dialog open={true} onOpenChange={vi.fn()}>
        <DialogContent ref={ref} onClose={vi.fn()}>
          <p>Content</p>
        </DialogContent>
      </Dialog>,
    )
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('merges custom className', () => {
    render(
      <Dialog open={true} onOpenChange={vi.fn()}>
        <DialogContent className="custom-dialog" data-testid="content" onClose={vi.fn()}>
          <p>Content</p>
        </DialogContent>
      </Dialog>,
    )
    const content = screen.getByTestId('content')
    expect(content.className).toContain('custom-dialog')
  })
})

describe('DialogClose', () => {
  it('renders with aria-label Close', () => {
    render(<TestDialog />)
    const closeBtn = screen.getByLabelText('Close')
    expect(closeBtn).toBeInTheDocument()
  })

  it('calls onClose when clicked', () => {
    const onOpenChange = vi.fn()
    render(<TestDialog onOpenChange={onOpenChange} />)
    const closeBtn = screen.getByLabelText('Close')
    fireEvent.click(closeBtn)
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('renders an SVG icon', () => {
    render(<TestDialog />)
    const closeBtn = screen.getByLabelText('Close')
    const svg = closeBtn.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('forwards ref', () => {
    const ref = createRef<HTMLButtonElement>()
    render(<DialogClose ref={ref} onClose={vi.fn()} />)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })
})

describe('DialogHeader', () => {
  it('renders children', () => {
    render(<TestDialog />)
    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })

  it('forwards ref', () => {
    const ref = createRef<HTMLDivElement>()
    render(<DialogHeader ref={ref}>Header</DialogHeader>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})

describe('DialogTitle', () => {
  it('renders as h2', () => {
    render(<TestDialog />)
    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading).toHaveTextContent('Test Title')
  })

  it('forwards ref', () => {
    const ref = createRef<HTMLHeadingElement>()
    render(<DialogTitle ref={ref}>Title</DialogTitle>)
    expect(ref.current).toBeInstanceOf(HTMLHeadingElement)
  })
})

describe('DialogBody', () => {
  it('renders children', () => {
    render(<TestDialog />)
    expect(screen.getByText('Dialog content')).toBeInTheDocument()
  })

  it('forwards ref', () => {
    const ref = createRef<HTMLDivElement>()
    render(<DialogBody ref={ref}>Body</DialogBody>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})

describe('DialogFooter', () => {
  it('renders action buttons', () => {
    render(<TestDialog />)
    expect(screen.getByText('Cancel')).toBeInTheDocument()
    expect(screen.getByText('Confirm')).toBeInTheDocument()
  })

  it('forwards ref', () => {
    const ref = createRef<HTMLDivElement>()
    render(<DialogFooter ref={ref}>Footer</DialogFooter>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})
