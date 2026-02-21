import { createRef } from 'react'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Input } from '../input'

describe('Input', () => {
  it('renders an input element', () => {
    render(<Input placeholder="Search..." />)
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
  })

  it('applies default variant', () => {
    render(<Input data-testid="input" />)
    const input = screen.getByTestId('input')
    expect(input.className).toContain('border')
    expect(input.className).toContain('bg-white')
  })

  it('applies search variant', () => {
    render(<Input variant="search" data-testid="input" />)
    const input = screen.getByTestId('input')
    expect(input.className).toContain('bg-neutral-50')
  })

  it('applies ghost variant', () => {
    render(<Input variant="ghost" data-testid="input" />)
    const input = screen.getByTestId('input')
    expect(input.className).toContain('border-transparent')
  })

  it('applies size sm', () => {
    render(<Input size="sm" data-testid="input" />)
    const input = screen.getByTestId('input')
    expect(input.className).toContain('h-8')
  })

  it('applies size lg', () => {
    render(<Input size="lg" data-testid="input" />)
    const input = screen.getByTestId('input')
    expect(input.className).toContain('h-12')
  })

  it('shows error state', () => {
    const { container } = render(<Input error="Required field" data-testid="input" />)
    const input = screen.getByTestId('input')
    expect(input.className).toContain('border-error-500')
    const errorText = container.querySelector('p')
    expect(errorText?.textContent).toBe('Required field')
  })

  it('renders startIcon', () => {
    render(<Input startIcon={<span data-testid="start-icon">S</span>} data-testid="input" />)
    expect(screen.getByTestId('start-icon')).toBeInTheDocument()
  })

  it('renders endIcon', () => {
    render(<Input endIcon={<span data-testid="end-icon">E</span>} data-testid="input" />)
    expect(screen.getByTestId('end-icon')).toBeInTheDocument()
  })

  it('uses RTL logical properties for icon padding', () => {
    render(<Input startIcon={<span>S</span>} data-testid="input" />)
    const input = screen.getByTestId('input')
    expect(input.className).toContain('ps-10')
  })

  it('handles user input', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<Input onChange={handleChange} placeholder="Type..." />)
    await user.type(screen.getByPlaceholderText('Type...'), 'hello')
    expect(handleChange).toHaveBeenCalled()
  })

  it('forwards ref', () => {
    const ref = createRef<HTMLInputElement>()
    render(<Input ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it('merges custom className', () => {
    render(<Input className="custom-input" data-testid="input" />)
    const input = screen.getByTestId('input')
    expect(input.className).toContain('custom-input')
  })
})
