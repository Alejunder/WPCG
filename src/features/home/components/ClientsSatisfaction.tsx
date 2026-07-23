import FadeIn from '@/features/shared/motion/FadeIn'
import AnimatedDivider from '@/features/shared/motion/AnimatedDivider'
import SectionWrapper from '@/features/shared/components/SectionWrapper'
import LayoutContainer from '@/features/shared/components/LayoutContainer'
import type { ClientSatisfactionData } from '../types'
import styles from './ClientsSatisfaction.module.css'

interface ClientsSatisfactionProps {
  data: ClientSatisfactionData | null | undefined
}

export default function ClientsSatisfaction({ data }: ClientsSatisfactionProps) {
  if (!data?.heading) return null

  const stats = data.stats ?? []

  return (
    <SectionWrapper className={styles.section} spacing="sm">
      <AnimatedDivider className={styles.topDivider} />
      <LayoutContainer className={styles.inner}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.heading}>{data.heading}</h2>
        </div>

        {stats.length > 0 && (
          <div className={styles.statsGrid}>
            {stats.map((stat, i) => (
              <FadeIn key={i} delay={0.1 + i * 0.12}>
                <div className={styles.stat}>
                  <span className={styles.statValue}>{stat.value}</span>
                  <p className={styles.statLabel}>{stat.label}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        )}
      </LayoutContainer>
    </SectionWrapper>
  )
}

