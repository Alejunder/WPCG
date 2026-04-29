import { TeamMembersSchema, TeamPageSchema } from '../schemas/team.schema'
import type { TeamMembers, TeamPage } from '../types'
import { getAllTeamMembersQuery, getTeamPageQuery } from './team.queries'
import type { Locale } from '@/config/i18n'
import { createServiceHelpers } from '@/lib/sanity/service-helpers'

const { validate, fetchFromSanity } = createServiceHelpers('team.service')

/**
 * Fetches all `teamMember` documents from Sanity, ordered by `order` ascending.
 *
 * Returns an empty array when no members have been created in the CMS yet.
 * Throws `ServiceError` on fetch failure or validation error.
 */
export async function getAllTeamMembers(locale: Locale): Promise<TeamMembers> {
  const raw = await fetchFromSanity<unknown>('getAllTeamMembers', getAllTeamMembersQuery, { locale })

  const data = raw ?? []
  return validate(TeamMembersSchema, data, 'getAllTeamMembers')
}

/**
 * Fetches the `teamPage` singleton from Sanity.
 *
 * Returns null when the singleton has not been created in the CMS yet.
 * Throws `ServiceError` on fetch failure or validation error.
 */
export async function getTeamPage(locale: Locale): Promise<TeamPage | null> {
  const raw = await fetchFromSanity<unknown>('getTeamPage', getTeamPageQuery, { locale })

  if (!raw) return null
  return validate(TeamPageSchema, raw, 'getTeamPage')
}
