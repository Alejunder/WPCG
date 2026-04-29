'use client'

import { useState, useCallback } from 'react'
import FadeIn from '@/features/shared/motion/FadeIn'
import TeamMemberCard from './TeamMemberCard'
import TeamMemberModal from './TeamMemberModal'
import type { TeamMembers, TeamMember } from '@/features/team/types'
import type { Locale } from '@/config/i18n'
import styles from './TeamGrid.module.css'

interface TeamGridProps {
  members: TeamMembers
  locale: Locale
}

export default function TeamGrid({ members, locale }: TeamGridProps) {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)

  const handleReadBio = useCallback((member: TeamMember) => {
    setSelectedMember(member)
  }, [])

  const handleClose = useCallback(() => {
    setSelectedMember(null)
  }, [])

  if (members.length === 0) return null

  return (
    <>
      <ul
        className={styles.grid}
        role="list"
        aria-label={locale === 'en' ? 'Team members' : 'Miembros del equipo'}
      >
        {members.map((member, index) => (
          <li key={member._id}>
            <FadeIn delay={Math.min(index * 0.08, 0.48)}>
              <TeamMemberCard
                member={member}
                locale={locale}
                onReadBio={handleReadBio}
              />
            </FadeIn>
          </li>
        ))}
      </ul>

      <TeamMemberModal
        member={selectedMember}
        locale={locale}
        onClose={handleClose}
      />
    </>
  )
}

