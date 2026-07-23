import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import FadeIn from '@/features/shared/motion/FadeIn'
import AnimatedDivider from '@/features/shared/motion/AnimatedDivider'
import SectionWrapper from '@/features/shared/components/SectionWrapper'
import type { ClientLogo } from '../schemas/home.schema'
import styles from './ClientsBar.module.css'

interface ClientsBarProps {
  clients: ClientLogo[]
}

/**
 * Horizontally auto-scrolling logo strip.
 * Logos are duplicated so the CSS marquee loops seamlessly.
 * Grayscale by default; colour on hover.
 * Reduced-motion: CSS animation is gated behind
 * `@media (prefers-reduced-motion: no-preference)` in the stylesheet.
 */
export default async function ClientsBar({ clients }: ClientsBarProps) {
  if (clients.length === 0) return null

  const t = await getTranslations('HomePage')
  const label = t('clientsHeading')

  // Quadruple for seamless loop — ensures track always exceeds viewport width
  // regardless of client count. Animate to -25% (= 1 set of 4).
  const track = [...clients, ...clients, ...clients, ...clients]

  return (
    <SectionWrapper className={styles.section} spacing="none" aria-label={label}>
      <AnimatedDivider className={styles.topDivider} />
      <FadeIn>
        <div className={styles.eyebrowRow}>
          <span className={styles.eyebrow}>05</span>
          <span className={styles.label}>{label}</span>
          <AnimatedDivider className={styles.eyebrowLineDivider} />
        </div>
      </FadeIn>

      {/* Overflow mask */}
      <div className={styles.mask} aria-hidden="true">
        <div className={styles.track}>
          {track.map((client, i) => (
            <div key={i} className={styles.logoWrapper}>
              <Image
                src={client.url}
                alt={client.alt}
                fill
                sizes="220px"
                className={styles.logo}
              />
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
