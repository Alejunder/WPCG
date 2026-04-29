import TeamGrid from './TeamGrid'
import type { TeamMembers } from '@/features/team/types'
import type { Locale } from '@/config/i18n'
import styles from './TeamSection.module.css'

interface TeamSectionProps {
  members: TeamMembers
  locale: Locale
  heading: string
}

export default function TeamSection({ members, locale, heading }: TeamSectionProps) {
  return (
    <section className={styles.section} aria-labelledby="team-heading">
      <div className={styles.inner}>
        <h2 id="team-heading" className={styles.heading}>
          {heading}
        </h2>
        <TeamGrid members={members} locale={locale} />
      </div>
    </section>
  )
}
