'use client'

import Image from 'next/image'
import type { TeamMember } from '@/features/team/types'
import type { Locale } from '@/config/i18n'
import styles from './TeamMemberCard.module.css'

interface TeamMemberCardProps {
  member: TeamMember
  locale: Locale
  onReadBio: (member: TeamMember) => void
}

const READ_BIO_LABEL: Record<Locale, string> = {
  en: 'Read bio',
  es: 'Ver biografía',
}

export default function TeamMemberCard({ member, locale, onReadBio }: TeamMemberCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.avatarWrapper}>
        <Image
          src={member.image.url}
          alt={member.image.alt || member.name}
          fill
          sizes="(max-width: 640px) 180px, (max-width: 1024px) 180px, 200px"
          className={styles.avatar}
        />
      </div>

      <div className={styles.body}>
        <strong className={styles.name}>{member.name}</strong>
        <span className={styles.role}>{member.role}</span>

        <p className={styles.bio}>{member.bio}</p>

        <button
          type="button"
          className={styles.readBioBtn}
          onClick={() => onReadBio(member)}
          aria-label={`${READ_BIO_LABEL[locale]} — ${member.name}`}
        >
          {READ_BIO_LABEL[locale]}
        </button>
      </div>
    </article>
  )
}
