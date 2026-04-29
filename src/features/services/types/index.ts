import type { z } from 'zod'
import type {
  ServiceSchema,
  ServiceCardSchema,
  ServicesPageSchema,
  ProcessStepSchema,
  ServiceImageSchema,
} from '../schemas/service.schema'

/** Full service document. Derived from ServiceSchema — single source of truth. */
export type Service = z.infer<typeof ServiceSchema>

/** Subset used in service grid cards. Derived from ServiceCardSchema. */
export type ServiceCard = z.infer<typeof ServiceCardSchema>

/** Full services page singleton data. Derived from ServicesPageSchema. */
export type ServicesPageData = z.infer<typeof ServicesPageSchema>

/** Process step shape. Derived from ProcessStepSchema. */
export type ProcessStep = z.infer<typeof ProcessStepSchema>

/** Image shape — re-exported for component use. */
export type ServiceImage = z.infer<typeof ServiceImageSchema>

/**
 * Single PortableText block — extracted from Service for convenience.
 */
export type ServicePortableTextBlock = NonNullable<Service['longDescription']>[number]
