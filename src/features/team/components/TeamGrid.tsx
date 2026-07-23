'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { staggerItem } from '@/features/shared/motion/StaggerContainer'
import TeamMemberCard from './TeamMemberCard'
import TeamMemberModal from './TeamMemberModal'
import type { TeamMembers, TeamMember } from '@/features/team/types'
import type { Locale } from '@/config/i18n'
import styles from './TeamGrid.module.css'

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
}

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
      <motion.ul
        className={styles.grid}
        role="list"
        aria-label={locale === 'en' ? 'Team members' : 'Miembros del equipo'}
        variants={listVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
      >
        {members.map((member) => (
          <motion.li key={member._id} variants={staggerItem}>
            <TeamMemberCard
              member={member}
              locale={locale}
              onReadBio={handleReadBio}
            />
          </motion.li>
        ))}
      </motion.ul>

      <TeamMemberModal
        member={selectedMember}
        locale={locale}
        onClose={handleClose}
      />
    </>
  )
}

