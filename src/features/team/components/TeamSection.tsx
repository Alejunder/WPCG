import TeamGrid from './TeamGrid'
import type { TeamMembers } from '@/features/team/types'
import type { Locale } from '@/config/i18n'
import SectionWrapper from '@/features/shared/components/SectionWrapper'
import LayoutContainer from '@/features/shared/components/LayoutContainer'
import styles from './TeamSection.module.css'

interface TeamSectionProps {
  members: TeamMembers
  locale: Locale
  heading: string
}

export default function TeamSection({ members, locale, heading }: TeamSectionProps) {
  return (
    <SectionWrapper className={styles.section} spacing="sm" aria-labelledby="team-heading">
      <LayoutContainer className={styles.inner}>
        <h2 id="team-heading" className={styles.heading}>
          {heading}
        </h2>
        <TeamGrid members={members} locale={locale} />
      </LayoutContainer>
    </SectionWrapper>
  )
}
