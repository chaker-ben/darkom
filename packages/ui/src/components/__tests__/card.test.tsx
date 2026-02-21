import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Card, CardBody, CardImage, CardMeta, CardTitle } from '../card'

describe('Card', () => {
  it('renders as a div with card styles', () => {
    const { container } = render(<Card>Content</Card>)
    const card = container.firstElementChild
    expect(card).toBeInTheDocument()
    expect(card?.className).toContain('rounded-[var(--radius-card)]')
    expect(card?.className).toContain('bg-white')
  })

  it('applies interactive hover styles', () => {
    const { container } = render(<Card interactive>Content</Card>)
    const card = container.firstElementChild
    expect(card?.className).toContain('hover:-translate-y-1')
  })

  it('does not apply interactive styles by default', () => {
    const { container } = render(<Card>Content</Card>)
    const card = container.firstElementChild
    expect(card?.className).not.toContain('hover:-translate-y-1')
  })

  it('merges custom className', () => {
    const { container } = render(<Card className="custom-card">Content</Card>)
    const card = container.firstElementChild
    expect(card?.className).toContain('custom-card')
  })
})

describe('CardImage', () => {
  it('renders with overflow hidden and relative', () => {
    const { container } = render(<CardImage>img</CardImage>)
    const el = container.firstElementChild
    expect(el?.className).toContain('overflow-hidden')
    expect(el?.className).toContain('relative')
  })
})

describe('CardBody', () => {
  it('renders with padding', () => {
    const { container } = render(<CardBody>body</CardBody>)
    const el = container.firstElementChild
    expect(el?.className).toContain('p-4')
  })
})

describe('CardTitle', () => {
  it('renders as h3 with correct styles', () => {
    render(<CardTitle>Title</CardTitle>)
    const el = screen.getByText('Title')
    expect(el.tagName).toBe('H3')
    expect(el.className).toContain('font-semibold')
  })
})

describe('CardMeta', () => {
  it('renders with muted text', () => {
    render(<CardMeta>Meta info</CardMeta>)
    const el = screen.getByText('Meta info')
    expect(el.className).toContain('text-neutral-500')
    expect(el.className).toContain('text-sm')
  })
})
