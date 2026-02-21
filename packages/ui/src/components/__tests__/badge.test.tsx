import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Badge } from '../badge'

describe('Badge', () => {
  it('renders with children', () => {
    render(<Badge>New</Badge>)
    expect(screen.getByText('New')).toBeInTheDocument()
  })

  it('applies default variant', () => {
    render(<Badge>Default</Badge>)
    const badge = screen.getByText('Default')
    expect(badge.className).toContain('bg-primary-100')
  })

  it('applies overlay variant', () => {
    render(<Badge variant="overlay">Overlay</Badge>)
    const badge = screen.getByText('Overlay')
    expect(badge.className).toContain('bg-black/60')
  })

  it('applies verified variant', () => {
    render(<Badge variant="verified">Verified</Badge>)
    const badge = screen.getByText('Verified')
    expect(badge.className).toContain('bg-success-50')
  })

  it('applies featured variant', () => {
    render(<Badge variant="featured">Featured</Badge>)
    const badge = screen.getByText('Featured')
    expect(badge.className).toContain('bg-accent-100')
  })

  it('applies category variant', () => {
    render(<Badge variant="category">Category</Badge>)
    const badge = screen.getByText('Category')
    expect(badge.className).toContain('border')
  })

  it('applies sm size', () => {
    render(<Badge size="sm">Small</Badge>)
    const badge = screen.getByText('Small')
    expect(badge.className).toContain('text-xs')
  })

  it('applies md size', () => {
    render(<Badge size="md">Medium</Badge>)
    const badge = screen.getByText('Medium')
    expect(badge.className).toContain('text-sm')
  })

  it('merges custom className', () => {
    render(<Badge className="custom-badge">Custom</Badge>)
    const badge = screen.getByText('Custom')
    expect(badge.className).toContain('custom-badge')
  })
})
