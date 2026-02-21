import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Skeleton } from '../skeleton'

describe('Skeleton', () => {
  it('renders a div with animate-pulse', () => {
    const { container } = render(<Skeleton />)
    const el = container.firstElementChild
    expect(el).toBeInTheDocument()
    expect(el?.className).toContain('animate-pulse')
  })

  it('applies default bg classes', () => {
    const { container } = render(<Skeleton />)
    const el = container.firstElementChild
    expect(el?.className).toContain('bg-neutral-200')
  })

  it('merges custom className', () => {
    const { container } = render(<Skeleton className="h-48 w-full" />)
    const el = container.firstElementChild
    expect(el?.className).toContain('h-48')
    expect(el?.className).toContain('w-full')
    expect(el?.className).toContain('animate-pulse')
  })

  it('applies rounded by default', () => {
    const { container } = render(<Skeleton />)
    const el = container.firstElementChild
    expect(el?.className).toContain('rounded')
  })
})
