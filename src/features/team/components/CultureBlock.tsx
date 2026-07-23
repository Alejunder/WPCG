import { PortableText, type PortableTextComponents } from '@portabletext/react'
import type { PortableTextBlock } from '@/features/projects/types'
import SectionWrapper from '@/features/shared/components/SectionWrapper'
import styles from './CultureBlock.module.css'

interface CultureBlockProps {
  blocks: PortableTextBlock[]
}

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className={styles.paragraph}>{children}</p>,
    h2: ({ children }) => <h2 className={styles.heading}>{children}</h2>,
    blockquote: ({ children }) => <blockquote className={styles.blockquote}>{children}</blockquote>,
  },
  marks: {
    strong: ({ children }) => <strong className={styles.strong}>{children}</strong>,
    em: ({ children }) => <em className={styles.em}>{children}</em>,
  },
  list: {
    bullet: ({ children }) => <ul className={styles.list}>{children}</ul>,
  },
  listItem: {
    bullet: ({ children }) => <li className={styles.listItem}>{children}</li>,
  },
}

export default function CultureBlock({ blocks }: CultureBlockProps) {
  if (!blocks || blocks.length === 0) return null

  return (
    <SectionWrapper className={styles.section} spacing="sm" aria-label="Our culture">
      <div className={styles.inner}>
        <PortableText value={blocks} components={components} />
      </div>
    </SectionWrapper>
  )
}
