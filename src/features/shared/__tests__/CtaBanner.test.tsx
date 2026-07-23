import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

// ---------------------------------------------------------------------------
// Mock next/link — renders a plain <a> in tests
// ---------------------------------------------------------------------------

vi.mock('next/link', () => ({
  default: ({ href, children, ...rest }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) =>
    <a href={href} {...rest}>{children}</a>,
}))

// ---------------------------------------------------------------------------
// Mock framer-motion
// ---------------------------------------------------------------------------

vi.mock('framer-motion', () => ({
  motion: new Proxy(
    {},
    {
      get: (_t, tag) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        React.forwardRef((props: any, ref: any) =>
          React.createElement(tag as string, { ...props, ref }),
        ),
    },
  ),
  useReducedMotion: () => false,
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

import CtaBanner from '../components/CtaBanner'

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('CtaBanner', () => {
  const baseProps = {
    headline: 'Start your project',
    buttonLabel: 'Contact us',
    href: '/en/contact',
  }

  it('renders the headline text', () => {
    render(<CtaBanner {...baseProps} />)
    expect(screen.getByText('Start your project')).toBeInTheDocument()
  })

  it('renders the button link with correct href', () => {
    render(<CtaBanner {...baseProps} />)
    const link = screen.getByRole('link', { name: 'Contact us' })
    expect(link).toHaveAttribute('href', '/en/contact')
  })

  it('renders the optional sub text when provided', () => {
    render(<CtaBanner {...baseProps} sub="We will get back to you soon" />)
    expect(screen.getByText('We will get back to you soon')).toBeInTheDocument()
  })

  it('does not render sub text when omitted', () => {
    render(<CtaBanner {...baseProps} />)
    // No additional paragraph beyond the headline
    const paragraphs = screen.queryAllByText(/we will get back/i)
    expect(paragraphs).toHaveLength(0)
  })

  it('renders a section with aria-label "Call to action"', () => {
    render(<CtaBanner {...baseProps} />)
    expect(screen.getByRole('region', { name: /call to action/i })).toBeInTheDocument()
  })

  describe('compact variant', () => {
    it('renders the compact layout with headline and button', () => {
      render(<CtaBanner {...baseProps} variant="compact" />)
      expect(screen.getByText('Start your project')).toBeInTheDocument()
      // compact link includes a trailing arrow char; match by partial name
      expect(screen.getByRole('link', { name: /contact us/i })).toHaveAttribute('href', '/en/contact')
    })

    it('renders sub text in compact variant when provided', () => {
      render(<CtaBanner {...baseProps} variant="compact" sub="Quick inquiry" />)
      expect(screen.getByText('Quick inquiry')).toBeInTheDocument()
    })
  })
})
