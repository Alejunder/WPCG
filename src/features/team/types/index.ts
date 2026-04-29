import { z } from 'zod'
import { TeamMemberSchema, TeamMembersSchema, TeamImageSchema, TeamPageSchema, TeamPageImageSchema } from '../schemas/team.schema'

export type TeamImage = z.infer<typeof TeamImageSchema>
export type TeamMember = z.infer<typeof TeamMemberSchema>
export type TeamMembers = z.infer<typeof TeamMembersSchema>
export type TeamPageImage = z.infer<typeof TeamPageImageSchema>
export type TeamPage = z.infer<typeof TeamPageSchema>
