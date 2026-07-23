import { type SchemaTypeDefinition } from 'sanity'
import { projectType } from './project'
import { homePageType } from './homePage'
import { serviceType } from './service'
import { servicesPageType } from './servicesPage'
import { aboutPageType } from './aboutPage'
import { teamMemberType } from './teamMember'
import { teamPageType } from './teamPage'
import { contactPageType } from './contactPage'
import { projectsPageType } from './projectsPage'
import { sketchType } from './sketch'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [projectType, homePageType, serviceType, servicesPageType, aboutPageType, teamMemberType, teamPageType, contactPageType, projectsPageType, sketchType],
}
