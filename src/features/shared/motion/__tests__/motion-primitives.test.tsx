/**
 * Unit tests for shared motion primitives.
 *
 * framer-motion is mocked to keep tests deterministic in jsdom:
 * - `useReducedMotion` is exposed as a spy so each test can control the return value.
 * - `useScroll` / `useTransform` return inert values (no DOM scroll needed).
 * - `motion.*` render plain HTML elements so @testing-library queries work.
 */

import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'

// ---------------------------------------------------------------------------
// Hoist the spy so `vi.mock` factory can reference it safely.
// ---------------------------------------------------------------------------

const mockUseReducedMotion = vi.hoisted(() => vi.fn<[], boolean | null>(() => false))

// ---------------------------------------------------------------------------
// Framer Motion mock — must come before any component imports
// ---------------------------------------------------------------------------

vi.mock('framer-motion', () => {
  const motionEl =
    (tag: string) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ({ children, className, style, role, 'aria-label': ariaLabel, ...rest }: any) =>
      React.createElement(tag, { className, style, role, 'aria-label': ariaLabel }, children)

  return {
    motion: {
      div: motionEl('div'),
      img: motionEl('img'),
      ul: motionEl('ul'),
      li: motionEl('li'),
      ol: motionEl('ol'),
      section: motionEl('section'),
    },
    useReducedMotion: mockUseReducedMotion,
    useScroll: vi.fn(() => ({ scrollYProgress: { get: () => 0, onChange: vi.fn() } })),
    useTransform: vi.fn(() => ({ get: () => 0 })),
    useAnimation: vi.fn(() => ({ start: vi.fn(), set: vi.fn() })),
    useInView: vi.fn(() => false),
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  }
})

// ---------------------------------------------------------------------------
// next/image mock
// ---------------------------------------------------------------------------

vi.mock('next/image', () => ({
  default: ({ src, alt, ...rest }: React.ImgHTMLAttributes<HTMLImageElement>) =>
    React.createElement('img', { src, alt, ...rest }),
}))

// ---------------------------------------------------------------------------
// Component imports — after mocks
// ---------------------------------------------------------------------------

import LiftHover from '../LiftHover'
import MotionImage from '../MotionImage'
import ParallaxLayer from '../ParallaxLayer'
import SlowZoom from '../SlowZoom'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

beforeEach(() => {
  mockUseReducedMotion.mockReturnValue(false)
})

// ===========================================================================
// LiftHover
// ===========================================================================

describe('LiftHover', () => {
  it('renders children in normal motion mode', () => {
    mockUseReducedMotion.mockReturnValue(false)
    render(
      <LiftHover>
        <span>lift-content</span>
      </LiftHover>,
    )
    expect(screen.getByText('lift-content')).toBeInTheDocument()
  })

  it('renders children when reduced motion is active', () => {
    mockUseReducedMotion.mockReturnValue(true)
    render(
      <LiftHover>
        <span>lift-reduced</span>
      </LiftHover>,
    )
    expect(screen.getByText('lift-reduced')).toBeInTheDocument()
  })

  it('passes className to the wrapper', () => {
    const { container } = render(
      <LiftHover className="my-class">
        <span>c</span>
      </LiftHover>,
    )
    expect(container.firstElementChild).toHaveClass('my-class')
  })
})

// ===========================================================================
// MotionImage — skipAnimation prop
// ===========================================================================

describe('MotionImage', () => {
  it('renders the image', () => {
    render(
      <MotionImage
        src="https://cdn.sanity.io/img/test.jpg"
        alt="Test image"
        fill
        sizes="100vw"
      />,
    )
    expect(screen.getByRole('img')).toHaveAttribute('alt', 'Test image')
  })

  it('renders the image when skipAnimation is true', () => {
    render(
      <MotionImage
        src="https://cdn.sanity.io/img/test.jpg"
        alt="Skip animation"
        fill
        sizes="100vw"
        skipAnimation
      />,
    )
    expect(screen.getByRole('img')).toHaveAttribute('alt', 'Skip animation')
  })

  it('renders the image in reduced motion mode', () => {
    mockUseReducedMotion.mockReturnValue(true)
    render(
      <MotionImage
        src="https://cdn.sanity.io/img/test.jpg"
        alt="Reduced motion image"
        fill
        sizes="100vw"
      />,
    )
    expect(screen.getByRole('img')).toHaveAttribute('alt', 'Reduced motion image')
  })
})

// ===========================================================================
// ParallaxLayer
// ===========================================================================

describe('ParallaxLayer', () => {
  it('renders children in normal motion mode', () => {
    mockUseReducedMotion.mockReturnValue(false)
    render(
      <ParallaxLayer>
        <span>parallax-content</span>
      </ParallaxLayer>,
    )
    expect(screen.getByText('parallax-content')).toBeInTheDocument()
  })

  it('renders children when reduced motion is active', () => {
    mockUseReducedMotion.mockReturnValue(true)
    render(
      <ParallaxLayer>
        <span>parallax-reduced</span>
      </ParallaxLayer>,
    )
    expect(screen.getByText('parallax-reduced')).toBeInTheDocument()
  })

  it('passes className to the wrapper', () => {
    const { container } = render(
      <ParallaxLayer className="parallax-class">
        <span>c</span>
      </ParallaxLayer>,
    )
    expect(container.firstElementChild).toHaveClass('parallax-class')
  })
})

// ===========================================================================
// SlowZoom
// ===========================================================================

describe('SlowZoom', () => {
  it('renders children in normal motion mode', () => {
    mockUseReducedMotion.mockReturnValue(false)
    render(
      <SlowZoom>
        <span>zoom-content</span>
      </SlowZoom>,
    )
    expect(screen.getByText('zoom-content')).toBeInTheDocument()
  })

  it('renders children when reduced motion is active', () => {
    mockUseReducedMotion.mockReturnValue(true)
    render(
      <SlowZoom>
        <span>zoom-reduced</span>
      </SlowZoom>,
    )
    expect(screen.getByText('zoom-reduced')).toBeInTheDocument()
  })

  it('passes className to the wrapper', () => {
    const { container } = render(
      <SlowZoom className="zoom-class">
        <span>c</span>
      </SlowZoom>,
    )
    expect(container.firstElementChild).toHaveClass('zoom-class')
  })
})
