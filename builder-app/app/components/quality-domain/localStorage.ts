import type { QualityDomainState, QualityDomain, Concept } from './types'

const STORAGE_KEY = 'quality-domain-state'

// Same logic as StateDebugPanel export
export function serializeState(state: QualityDomainState): string {
  const persistableState = JSON.stringify(state, (key, value) => {
    // Filter out selection state
    if (key === 'selectedDomainId' ||
        key === 'selectedPropertyId' ||
        key === 'selectedPropertyDomainId' ||
        key === 'selectedConceptId') {
      return undefined
    }

    // Handle Infinity values
    if (value === Infinity) return "Infinity"
    if (value === -Infinity) return "-Infinity"

    return value
  })

  return persistableState
}

// Same logic as StateDebugPanel import
export function deserializeState(jsonString: string): { domains: QualityDomain[], concepts: Concept[] } {
  const parsed = JSON.parse(jsonString)

  // Convert date strings back to Date objects and Infinity strings to Infinity
  const domains = parsed.domains.map((domain: any) => ({
    ...domain,
    createdAt: new Date(domain.createdAt),
    dimensions: domain.dimensions.map((dim: any) => ({
      ...dim,
      range: [
        dim.range[0] === "Infinity" ? Infinity : dim.range[0] === "-Infinity" ? -Infinity : dim.range[0],
        dim.range[1] === "Infinity" ? Infinity : dim.range[1] === "-Infinity" ? -Infinity : dim.range[1]
      ] as const
    })),
    properties: domain.properties.map((prop: any) => ({
      ...prop,
      createdAt: new Date(prop.createdAt),
      dimensions: prop.dimensions.map((d: any) => ({
        ...d,
        range: [
          d.range[0] === "Infinity" ? Infinity : d.range[0] === "-Infinity" ? -Infinity : d.range[0],
          d.range[1] === "Infinity" ? Infinity : d.range[1] === "-Infinity" ? -Infinity : d.range[1]
        ] as const
      }))
    }))
  }))

  const concepts = (parsed.concepts || []).map((concept: any) => ({
    ...concept,
    createdAt: new Date(concept.createdAt)
  }))

  return { domains, concepts }
}

export function saveToLocalStorage(state: QualityDomainState): void {
  try {
    const serialized = serializeState(state)
    localStorage.setItem(STORAGE_KEY, serialized)
  } catch (error) {
    console.error('Failed to save state to localStorage:', error)
  }
}

export function loadFromLocalStorage(): { domains: QualityDomain[], concepts: Concept[] } | null {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY)
    if (!serialized) return null

    return deserializeState(serialized)
  } catch (error) {
    console.error('Failed to load state from localStorage:', error)
    return null
  }
}

export function clearLocalStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear localStorage:', error)
  }
}
