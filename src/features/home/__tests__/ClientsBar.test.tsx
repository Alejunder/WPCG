import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

// ---------------------------------------------------------------------------
// Mock next-intl/server — getTranslations returns a simple t() stub
// ---------------------------------------------------------------------------

vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn().mockResolvedValue((key: string) => key),
}))

// ---------------------------------------------------------------------------
// Mock next/image — renders a plain <img> in jsdom
// ---------------------------------------------------------------------------

vi.mock('next/image', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: ({ fill, sizes, ...props }: any) => <img {...props} />,
}))

// ---------------------------------------------------------------------------
// Mock framer-motion — avoid animation engine in jsdom
// ---------------------------------------------------------------------------

vi.mock('framer-motion', async (importOriginal) => {
  const actual = await importOriginal<typeof import('framer-motion')>()
  return {
    ...actual,
    motion: new Proxy({}, { get: (_t, tag) => (props: React.HTMLAttributes<HTMLElement>) => React.createElement(tag as string, props) }),
    useReducedMotion: () => false,
    useAnimation: () => ({ start: vi.fn(), set: vi.fn() }),
    useInView: () => true,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  }
})

import ClientsBar from '../components/ClientsBar'

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const clients = [
  { url: 'https://cdn.sanity.io/client-a.png', alt: 'Client A' },
  { url: 'https://cdn.sanity.io/client-b.png', alt: 'Client B' },
]

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('ClientsBar', () => {
  it('returns null when clients array is empty', async () => {
    const { container } = render(await ClientsBar({ clients: [] }))
    expect(container.firstChild).toBeNull()
  })

  it('renders a landmark region with an aria-label', async () => {
    render(await ClientsBar({ clients }))
    // SectionWrapper renders a <section> with the aria-label passed as prop
    const region = screen.getByRole('region')
    expect(region).toBeInTheDocument()
  })

  it('renders images for each client logo (quadrupled for marquee)', async () => {
    const { container } = render(await ClientsBar({ clients }))
    const images = container.querySelectorAll('img')
    // logos are quadrupled for the seamless marquee loop — at least 4× client count
    expect(images.length).toBeGreaterThanOrEqual(clients.length * 4)
  })

  it('hides the marquee track from assistive technology', async () => {
    const { container } = render(await ClientsBar({ clients }))
    // The mask div wrapping the animated track has aria-hidden="true"
    const hiddenContainer = container.querySelector('[aria-hidden="true"]')
    expect(hiddenContainer).not.toBeNull()
  })
})
