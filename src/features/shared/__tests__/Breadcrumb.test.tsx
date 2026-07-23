import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

// ---------------------------------------------------------------------------
// Mock next/link — renders a plain <a> in tests (avoids router deps)
// ---------------------------------------------------------------------------

vi.mock('next/link', () => ({
  default: ({ href, children, ...rest }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) =>
    <a href={href} {...rest}>{children}</a>,
}))

import Breadcrumb from '../components/Breadcrumb'

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Breadcrumb', () => {
  const items = [
    { label: 'Home', href: '/en' },
    { label: 'Projects', href: '/en/projects' },
    { label: 'Current Project' },
  ]

  it('renders a nav landmark with aria-label="Breadcrumb"', () => {
    render(<Breadcrumb items={items} />)
    expect(screen.getByRole('navigation', { name: /breadcrumb/i })).toBeInTheDocument()
  })

  it('renders intermediate items as links', () => {
    render(<Breadcrumb items={items} />)
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/en')
    expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '/en/projects')
  })

  it('renders the last item as text with aria-current="page"', () => {
    render(<Breadcrumb items={items} />)
    const current = screen.getByText('Current Project')
    expect(current).toHaveAttribute('aria-current', 'page')
    expect(screen.queryByRole('link', { name: 'Current Project' })).toBeNull()
  })

  it('does not render a link for an item without href', () => {
    const noHrefItems = [{ label: 'Only Item' }]
    render(<Breadcrumb items={noHrefItems} />)
    expect(screen.queryByRole('link')).toBeNull()
  })

  it('renders a single item correctly without separator', () => {
    const { container } = render(<Breadcrumb items={[{ label: 'Home', href: '/en' }]} />)
    // Separator is only added for non-first items
    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(0)
  })
})
