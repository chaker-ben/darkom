import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { FilterTabs } from '../filter-tabs'

const items = [
  { value: 'all', label: 'All' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
  { value: 'land', label: 'Land' },
]

describe('FilterTabs', () => {
  it('renders all items as tabs', () => {
    render(<FilterTabs items={items} value="all" onValueChange={vi.fn()} />)
    expect(screen.getByRole('tab', { name: 'All' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Apartment' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'House' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Land' })).toBeInTheDocument()
  })

  it('marks the active tab', () => {
    render(<FilterTabs items={items} value="apartment" onValueChange={vi.fn()} />)
    const activeTab = screen.getByRole('tab', { name: 'Apartment' })
    expect(activeTab.className).toContain('bg-primary-700')
    expect(activeTab.className).toContain('text-white')
  })

  it('marks inactive tabs differently', () => {
    render(<FilterTabs items={items} value="all" onValueChange={vi.fn()} />)
    const inactiveTab = screen.getByRole('tab', { name: 'Apartment' })
    expect(inactiveTab.className).toContain('bg-white')
    expect(inactiveTab.className).not.toContain('text-white')
  })

  it('calls onValueChange when a tab is clicked', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<FilterTabs items={items} value="all" onValueChange={handleChange} />)
    await user.click(screen.getByRole('tab', { name: 'House' }))
    expect(handleChange).toHaveBeenCalledWith('house')
  })

  it('does not call onValueChange when clicking the active tab', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<FilterTabs items={items} value="all" onValueChange={handleChange} />)
    await user.click(screen.getByRole('tab', { name: 'All' }))
    expect(handleChange).not.toHaveBeenCalled()
  })

  it('merges custom className on the container', () => {
    const { container } = render(
      <FilterTabs items={items} value="all" onValueChange={vi.fn()} className="custom-tabs" />,
    )
    const el = container.firstElementChild
    expect(el?.className).toContain('custom-tabs')
  })
})
