import Breadcrumb from '@/features/shared/components/Breadcrumb'

interface ProjectBreadcrumbProps {
  locale: string
  homeLabel: string
  projectsLabel: string
  projectTitle: string
}

export default function ProjectBreadcrumb({
  locale,
  homeLabel,
  projectsLabel,
  projectTitle,
}: ProjectBreadcrumbProps) {
  return (
    <Breadcrumb
      items={[
        { label: homeLabel, href: `/${locale}` },
        { label: projectsLabel, href: `/${locale}/projects` },
        { label: projectTitle },
      ]}
    />
  )
}

