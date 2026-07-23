'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

// ---------------------------------------------------------------------------
// Context — tracks which service name is currently hovered in ProjectFacts
// so that RelatedProjects can dim cards that don't include it.
// ---------------------------------------------------------------------------

interface ServiceHoverContextValue {
  hoveredService: string | null
  setHoveredService: (service: string | null) => void
}

const ServiceHoverContext = createContext<ServiceHoverContextValue | null>(null)

export function ServiceHoverProvider({ children }: { children: ReactNode }) {
  const [hoveredService, setHoveredService] = useState<string | null>(null)

  return (
    <ServiceHoverContext.Provider value={{ hoveredService, setHoveredService }}>
      {children}
    </ServiceHoverContext.Provider>
  )
}

/** Safe hook — returns no-op values when used outside the provider. */
export function useServiceHover(): ServiceHoverContextValue {
  const ctx = useContext(ServiceHoverContext)
  if (!ctx) return { hoveredService: null, setHoveredService: () => {} }
  return ctx
}
