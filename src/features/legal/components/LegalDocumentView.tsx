import type { LegalBlock, LegalDocument, LegalSection } from '../types'
import styles from './LegalDocumentView.module.css'

interface LegalDocumentViewProps {
  document: LegalDocument
}

function Block({ block, keyPrefix }: { block: LegalBlock; keyPrefix: string }) {
  if (block.type === 'paragraphs') {
    return (
      <>
        {block.texts.map((text, index) => (
          <p key={`${keyPrefix}-p-${index}`} className={styles.paragraph}>
            {text}
          </p>
        ))}
      </>
    )
  }

  if (block.type === 'list') {
    return (
      <ul className={styles.list}>
        {block.items.map((item, index) => (
          <li key={`${keyPrefix}-li-${index}`} className={styles.listItem}>
            {item}
          </li>
        ))}
      </ul>
    )
  }

  return (
    <article className={styles.treatment}>
      <h3 className={styles.treatmentTitle}>{block.title}</h3>
      <dl className={styles.fields}>
        {block.fields.map((field) => (
          <div key={field.label} className={styles.field}>
            <dt className={styles.fieldLabel}>{field.label}</dt>
            <dd className={styles.fieldValue}>{field.value}</dd>
          </div>
        ))}
      </dl>
    </article>
  )
}

function Section({ section }: { section: LegalSection }) {
  return (
    <section id={section.id} className={styles.section} aria-labelledby={`${section.id}-heading`}>
      <h2 id={`${section.id}-heading`} className={styles.sectionHeading}>
        <span className={styles.sectionNumber} aria-hidden="true">
          {section.number}.
        </span>{' '}
        {section.title}
      </h2>
      <div className={styles.sectionBody}>
        {section.blocks.map((block, index) => (
          <Block key={`${section.id}-${index}`} block={block} keyPrefix={`${section.id}-${index}`} />
        ))}
      </div>
    </section>
  )
}

export default function LegalDocumentView({ document }: LegalDocumentViewProps) {
  return (
    <div className={styles.document}>
      {document.sections.map((section) => (
        <Section key={section.id} section={section} />
      ))}
    </div>
  )
}
