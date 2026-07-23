import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { TeamMember } from '@/features/team/types'

// ---------------------------------------------------------------------------
// Mock next/image
// ---------------------------------------------------------------------------

vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
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
        React.forwardRef((props: any, ref: any) =>
          React.createElement(tag as string, { ...props, ref }),
        ),
    },
  ),
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

import TeamMemberModal from '../components/TeamMemberModal'

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const member: TeamMember = {
  _id: 'member-1',
  name: 'Ana García',
  role: 'Principal Architect',
  bio: 'Ana has over 15 years of experience in corporate architecture.',
  image: { url: 'https://cdn.sanity.io/images/test.jpg', alt: 'Ana García portrait' },
  order: 1,
  featured: false,
  linkedinUrl: 'https://linkedin.com/in/anagarcia',
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('TeamMemberModal', () => {
  beforeEach(() => {
    // Ensure portal target exists for every test
    document.body.innerHTML = ''
  })

  it('renders nothing when member is null', () => {
    const { container } = render(
      <TeamMemberModal member={null} locale="en" onClose={vi.fn()} />,
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders a dialog with member name as label when member is provided', () => {
    render(<TeamMemberModal member={member} locale="en" onClose={vi.fn()} />)
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-label', 'Ana García')
  })

  it('renders the member name, role, and bio', () => {
    render(<TeamMemberModal member={member} locale="en" onClose={vi.fn()} />)
    expect(screen.getByText('Ana García')).toBeInTheDocument()
    expect(screen.getByText('Principal Architect')).toBeInTheDocument()
    expect(screen.getByText(member.bio)).toBeInTheDocument()
  })

  it('renders LinkedIn link with correct security attributes', () => {
    render(<TeamMemberModal member={member} locale="en" onClose={vi.fn()} />)
    const link = screen.getByRole('link', { name: /linkedin/i })
    expect(link).toHaveAttribute('href', 'https://linkedin.com/in/anagarcia')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('does not render LinkedIn link when linkedinUrl is absent', () => {
    const memberNoLinkedIn = { ...member, linkedinUrl: undefined }
    render(<TeamMemberModal member={memberNoLinkedIn} locale="en" onClose={vi.fn()} />)
    expect(screen.queryByRole('link', { name: /linkedin/i })).toBeNull()
  })

  it('calls onClose when close button is clicked', async () => {
    const onClose = vi.fn()
    render(<TeamMemberModal member={member} locale="en" onClose={onClose} />)
    const closeBtn = screen.getByRole('button', { name: /close/i })
    await userEvent.click(closeBtn)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('renders Spanish close label when locale is es', () => {
    render(<TeamMemberModal member={member} locale="es" onClose={vi.fn()} />)
    expect(screen.getByRole('button', { name: /cerrar/i })).toBeInTheDocument()
  })

  it('calls onClose on ESC key press', async () => {
    const onClose = vi.fn()
    render(<TeamMemberModal member={member} locale="en" onClose={onClose} />)
    await userEvent.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
