import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { Sketch } from '@/features/sketches/types'

// ---------------------------------------------------------------------------
// Mock next/image
// ---------------------------------------------------------------------------

vi.mock('next/image', () => ({
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
}))

// ---------------------------------------------------------------------------
// Mock next/link (only used when a sketch has a projectSlug)
// ---------------------------------------------------------------------------

vi.mock('next/link', () => ({
  default: ({ children, href, ...rest }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}))

// ---------------------------------------------------------------------------
// Mock framer-motion — bypass animation engine in jsdom and let children render
// ---------------------------------------------------------------------------

vi.mock('framer-motion', () => ({
  motion: new Proxy(
    {},
    {
      get: (_t, tag) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        React.forwardRef(function MotionStub(props: any, ref: any) {
          return React.createElement(tag as string, { ...props, ref })
        }),
    },
  ),
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

import SketchModal from '../components/SketchModal'

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const sketch: Sketch = {
  id: 'sketch-1',
  image: { url: 'https://cdn.sanity.io/images/sketch.jpg', alt: 'Lobby concept sketch' },
  title: 'Lobby Concept',
  projectSlug: null,
  showOnHomepage: false,
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('SketchModal', () => {
  beforeEach(() => {
    // Ensure portal target exists for every test
    document.body.innerHTML = ''
  })

  it('renders the dialog into a portal on document.body', () => {
    render(<SketchModal sketches={[sketch]} initialIndex={0} locale="en" onClose={vi.fn()} />)
    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
    // Portaled straight into <body>, not nested inside the render container
    expect(dialog.closest('body')).toBe(document.body)
  })

  it('uses the sketch title as the dialog label and renders its content', () => {
    render(<SketchModal sketches={[sketch]} initialIndex={0} locale="en" onClose={vi.fn()} />)
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-label', 'Lobby Concept')
    expect(screen.getByText('Lobby Concept')).toBeInTheDocument()
    expect(screen.getByText('Lobby concept sketch')).toBeInTheDocument()
  })

  it('locks the body scroll while open', () => {
    render(<SketchModal sketches={[sketch]} initialIndex={0} locale="en" onClose={vi.fn()} />)
    expect(document.body.style.overflow).toBe('hidden')
    expect(document.body.style.overscrollBehavior).toBe('none')
  })

  it('calls onClose when the close button is clicked', async () => {
    const onClose = vi.fn()
    render(<SketchModal sketches={[sketch]} initialIndex={0} locale="en" onClose={onClose} />)
    await userEvent.click(screen.getByRole('button', { name: /close/i }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose on ESC key press', async () => {
    const onClose = vi.fn()
    render(<SketchModal sketches={[sketch]} initialIndex={0} locale="en" onClose={onClose} />)
    await userEvent.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when the backdrop is clicked', () => {
    const onClose = vi.fn()
    render(<SketchModal sketches={[sketch]} initialIndex={0} locale="en" onClose={onClose} />)
    const backdrop = screen.getByRole('dialog').parentElement as HTMLElement
    fireEvent.click(backdrop)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('renders the Spanish close label when locale is es', () => {
    render(<SketchModal sketches={[sketch]} initialIndex={0} locale="es" onClose={vi.fn()} />)
    expect(screen.getByRole('button', { name: /cerrar/i })).toBeInTheDocument()
  })
})
