export type LegalBlock =
  | { type: 'paragraphs'; texts: string[] }
  | { type: 'list'; items: string[] }
  | {
      type: 'treatment'
      title: string
      fields: Array<{ label: string; value: string }>
    }

export interface LegalSection {
  id: string
  number: string
  title: string
  blocks: LegalBlock[]
}

export interface LegalDocument {
  title: string
  sections: LegalSection[]
}
