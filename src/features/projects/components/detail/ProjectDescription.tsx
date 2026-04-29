import { PortableText, type PortableTextComponents } from '@portabletext/react'
import type { PortableTextBlock } from '../../types'
import styles from './ProjectDescription.module.css'

interface ProjectDescriptionProps {
  blocks: PortableTextBlock[]
}

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className={styles.paragraph}>{children}</p>,
    h2: ({ children }) => <h2 className={styles.h2}>{children}</h2>,
    h3: ({ children }) => <h3 className={styles.h3}>{children}</h3>,
    blockquote: ({ children }) => <blockquote className={styles.blockquote}>{children}</blockquote>,
  },
  marks: {
    strong: ({ children }) => <strong className={styles.strong}>{children}</strong>,
    em: ({ children }) => <em className={styles.em}>{children}</em>,
  },
  list: {
    bullet: ({ children }) => <ul className={styles.list}>{children}</ul>,
    number: ({ children }) => <ol className={styles.list}>{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className={styles.listItem}>{children}</li>,
    number: ({ children }) => <li className={styles.listItem}>{children}</li>,
  },
}

export default function ProjectDescription({ blocks }: ProjectDescriptionProps) {
  if (!blocks || blocks.length === 0) return null

  return (
    <section className={styles.description} aria-label="Project description">
      <PortableText value={blocks} components={components} />
    </section>
  )
}
