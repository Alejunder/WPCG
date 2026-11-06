'use client'

import { useState, useMemo, useCallback } from 'react'
import type { ProjectCard, ProjectCategory } from '../types'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type FilterCategory = 'all' | ProjectCategory

interface FilterState {
  activeCategory: FilterCategory
  visibleCount: number
  total: number
}

interface FilterData {
  /** Every project matching the active filter (uncapped). */
  filteredProjects: ProjectCard[]
  /** Slice of filteredProjects capped by the load-more pagination. */
  visibleProjects: ProjectCard[]
}

interface FilterActions {
  setCategory: (category: FilterCategory) => void
  loadMore: () => void
}

export interface UseProjectFilterResult {
  state: FilterState
  data: FilterData
  actions: FilterActions
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const INITIAL_VISIBLE = 9
const LOAD_MORE_STEP = 6

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useProjectFilter(projects: ProjectCard[]): UseProjectFilterResult {
  const [activeCategory, setActiveCategoryState] = useState<FilterCategory>('all')
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_VISIBLE)

  const filteredProjects = useMemo<ProjectCard[]>(
    () =>
      activeCategory === 'all'
        ? projects
        : projects.filter((p) => p.category === activeCategory),
    [projects, activeCategory],
  )

  const visibleProjects = useMemo<ProjectCard[]>(
    () => filteredProjects.slice(0, visibleCount),
    [filteredProjects, visibleCount],
  )

  const setCategory = useCallback((category: FilterCategory): void => {
    setActiveCategoryState(category)
    setVisibleCount(INITIAL_VISIBLE)
  }, [])

  const loadMore = useCallback((): void => {
    setVisibleCount((prev) => prev + LOAD_MORE_STEP)
  }, [])

  return {
    state: {
      activeCategory,
      visibleCount,
      total: filteredProjects.length,
    },
    data: {
      filteredProjects,
      visibleProjects,
    },
    actions: {
      setCategory,
      loadMore,
    },
  }
}
