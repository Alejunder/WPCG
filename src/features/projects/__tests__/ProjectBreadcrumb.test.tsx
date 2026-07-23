import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// ---------------------------------------------------------------------------
// Mock Breadcrumb so ProjectBreadcrumb tests don't depend on router/VT
// ---------------------------------------------------------------------------

vi.mock('@/features/shared/components/Breadcrumb', () => ({
  default: ({ items }: { items: { label: string; href?: string }[] }) => (
    <nav aria-label="Breadcrumb">
      <ol>
        {items.map((item) => (
          <li key={item.label}>
            {item.href ? <a href={item.href}>{item.label}</a> : <span>{item.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  ),
}))

import ProjectBreadcrumb from '../components/detail/ProjectBreadcrumb'

// ---------------------------------------------------------------------------
// ProjectBreadcrumb tests
// ---------------------------------------------------------------------------

describe('ProjectBreadcrumb', () => {
  const defaultProps = {
    locale: 'en',
    homeLabel: 'Home',
    projectsLabel: 'Projects',
    projectTitle: 'Tower Office',
  }

  it('renders a Breadcrumb nav', () => {
    render(<ProjectBreadcrumb {...defaultProps} />)
    expect(screen.getByRole('navigation', { name: /breadcrumb/i })).toBeInTheDocument()
  })

  it('renders home link with locale-scoped href', () => {
    render(<ProjectBreadcrumb {...defaultProps} />)
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/en')
  })

  it('renders projects link with locale-scoped href', () => {
    render(<ProjectBreadcrumb {...defaultProps} />)
    expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '/en/projects')
  })

  it('renders project title as plain text (not a link)', () => {
    render(<ProjectBreadcrumb {...defaultProps} />)
    expect(screen.getByText('Tower Office')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Tower Office' })).toBeNull()
  })

  it('reflects locale in link hrefs', () => {
    render(<ProjectBreadcrumb {...defaultProps} locale="es" />)
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/es')
    expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '/es/projects')
  })
})
