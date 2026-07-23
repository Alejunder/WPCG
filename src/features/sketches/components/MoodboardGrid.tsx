import StaggerContainer, { StaggerItem } from '@/features/shared/motion/StaggerContainer'
import SketchCard from './SketchCard'
import type { Sketch } from '../types'
import type { Locale } from '@/config/i18n'
import styles from './MoodboardGrid.module.css'

interface Props {
  sketches: Sketch[]
  locale: Locale
  /**
   * Delay between each card entering the viewport (seconds).
   * @default 0.08
   */
  staggerDelay?: number
}

/**
 * Asymmetric sketch wall — a scatter of paper sheets on a studio table.
 *
 * Uses CSS Grid with `align-items: start` so rows have natural, varying
 * heights (masonry feel). Featured sketches span two columns and use a
 * landscape aspect ratio; standard sketches are portrait.
 *
 * Entry animations are driven by `StaggerContainer` + `StaggerItem`; each
 * card's rotation and hover state is owned by `SketchCard`.
 */
export default function MoodboardGrid({ sketches, locale, staggerDelay = 0.08 }: Props) {
  if (sketches.length === 0) return null

  return (
    <StaggerContainer className={styles.grid} staggerDelay={staggerDelay} delayChildren={0.12}>
      {sketches.map((sketch, index) => (
        <StaggerItem
          key={sketch.id}
          className={styles.item}
        >
          <SketchCard sketch={sketch} index={index} locale={locale} />
        </StaggerItem>
      ))}
    </StaggerContainer>
  )
}
