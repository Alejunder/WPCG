import FadeIn from '@/features/shared/motion/FadeIn'
import type { AboutPortableTextBlock } from '@/features/about/types'
import styles from './AboutContent.module.css'

interface AboutContentProps {
  content: AboutPortableTextBlock[] | null
}

/**
 * Renders the story / body content block.
 * PortableText is rendered as plain paragraphs to avoid pulling in a heavy
 * @portabletext/react dependency for a simple editorial block.
 * Replace with PortableText component when rich formatting is required.
 */
export default function AboutContent({ content }: AboutContentProps) {
  const blocks = content ?? []
  if (blocks.length === 0) return null

  return (
    <FadeIn yOffset={24}>
      <section className={styles.section} aria-labelledby="about-story-heading">
        <div className={styles.inner}>
          <div className={styles.prose}>
            {blocks.map((block) => {
              const b = block as Record<string, unknown>
              if (b._type !== 'block') return null
              const children = (b.children as Array<{ _key: string; text?: string }>) ?? []
              const text = children.map((c) => c.text ?? '').join('')
              if (!text.trim()) return <br key={b._key as string} />
              return (
                <p key={b._key as string} className={styles.paragraph}>
                  {text}
                </p>
              )
            })}
          </div>
        </div>
      </section>
    </FadeIn>
  )
}
