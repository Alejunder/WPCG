import FadeIn from '@/features/shared/motion/FadeIn'
import type { AboutValue } from '@/features/about/types'
import styles from './AboutValues.module.css'

interface AboutValuesProps {
  values: AboutValue[] | null
  heading?: string
}

export default function AboutValues({ values, heading }: AboutValuesProps) {
  const items = values ?? []

  if (items.length === 0) return null

  return (
    <FadeIn yOffset={20}>
      <section className={styles.section} aria-labelledby="about-values-heading">
        <div className={styles.inner}>
          {heading && (
            <h2 id="about-values-heading" className={styles.sectionHeading}>
              {heading}
            </h2>
          )}

          <ol className={styles.list} aria-label="Our values">
            {items.map((value, index) => {
              const num = String(index + 1).padStart(2, '0')
              return (
                <li key={value.title} className={styles.item}>
                  <span className={styles.number} aria-hidden="true">
                    {num}
                  </span>
                  <div className={styles.body}>
                    <h3 className={styles.title}>{value.title}</h3>
                    {value.description && (
                      <p className={styles.description}>{value.description}</p>
                    )}
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </section>
    </FadeIn>
  )
}
