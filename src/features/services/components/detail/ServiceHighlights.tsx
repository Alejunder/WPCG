import styles from './ServiceHighlights.module.css'

interface ServiceHighlightsProps {
  highlights: string[]
  heading: string
}

export default function ServiceHighlights({ highlights, heading }: ServiceHighlightsProps) {
  if (highlights.length === 0) return null

  return (
    <section className={styles.section} aria-label={heading}>
      <h2 className={styles.heading}>{heading}</h2>
      <ul className={styles.list}>
        {highlights.map((item) => (
          <li key={item} className={styles.item}>
            <span className={styles.bullet} aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </section>
  )
}
