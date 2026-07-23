import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { TeamMember } from '@/features/team/types'

// ---------------------------------------------------------------------------
// Mock next/image — renders a plain <img> in jsdom
// ---------------------------------------------------------------------------

vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
}))

import TeamMemberCard from '../components/TeamMemberCard'

// ---------------------------------------------------------------------------
// Fixture
// ---------------------------------------------------------------------------

const member: TeamMember = {
  _id: 'member-1',
  name: 'Ana García',
  role: 'Principal Architect',
  bio: 'Ana has over 15 years of experience in corporate architecture.',
  image: { url: 'https://cdn.sanity.io/images/test.jpg', alt: 'Ana García portrait' },
  order: 1,
  featured: false,
}

// ---------------------------------------------------------------------------
// TeamMemberCard
// ---------------------------------------------------------------------------

describe('TeamMemberCard', () => {
  it('renders member name and role', () => {
    render(<TeamMemberCard member={member} locale="en" onReadBio={vi.fn()} />)

    expect(screen.getByText('Ana García')).toBeInTheDocument()
    expect(screen.getByText('Principal Architect')).toBeInTheDocument()
  })

  it('renders the member image with correct alt text', () => {
    render(<TeamMemberCard member={member} locale="en" onReadBio={vi.fn()} />)

    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('alt', 'Ana García portrait')
  })

  it('falls back to member name as alt when image.alt is empty', () => {
    const memberWithoutAlt: TeamMember = {
      ...member,
      image: { url: 'https://cdn.sanity.io/images/test.jpg', alt: '' },
    }

    render(<TeamMemberCard member={memberWithoutAlt} locale="en" onReadBio={vi.fn()} />)

    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('alt', 'Ana García')
  })

  it('renders a "Read bio" button with the correct aria-label', () => {
    render(<TeamMemberCard member={member} locale="en" onReadBio={vi.fn()} />)

    const button = screen.getByRole('button', { name: /read bio — ana garcía/i })
    expect(button).toBeInTheDocument()
  })

  it('renders the button label in Spanish for locale "es"', () => {
    render(<TeamMemberCard member={member} locale="es" onReadBio={vi.fn()} />)

    const button = screen.getByRole('button', { name: /ver biografía — ana garcía/i })
    expect(button).toBeInTheDocument()
  })

  it('calls onReadBio with the member when the button is clicked', async () => {
    const onReadBio = vi.fn()
    render(<TeamMemberCard member={member} locale="en" onReadBio={onReadBio} />)

    await userEvent.click(screen.getByRole('button', { name: /read bio/i }))

    expect(onReadBio).toHaveBeenCalledOnce()
    expect(onReadBio).toHaveBeenCalledWith(member)
  })
})
