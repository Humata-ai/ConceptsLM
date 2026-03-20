import type { QualityDomain, Concept, ConceptInstance, QualityDomainLabel, Property, PropertyReference, LabelReference } from './types'
import type { AppState } from '@/app/store'

const STORAGE_KEY = 'quality-domain-state'
const STATE_VERSION = 3 // Version 3 adds instances

// Migration: Convert old Property to QualityDomainLabel (Region)
function migratePropertyToLabel(oldProperty: Property): QualityDomainLabel {
  return {
    type: 'region',
    id: oldProperty.id,
    name: oldProperty.name,
    domainId: oldProperty.domainId,
    dimensions: oldProperty.dimensions,
    createdAt: oldProperty.createdAt
  }
}

// Migration: Convert old PropertyReference to LabelReference
function migratePropertyRefToLabelRef(oldRef: PropertyReference): LabelReference {
  return {
    domainId: oldRef.domainId,
    labelId: oldRef.propertyId
  }
}

// Same logic as StateDebugPanel export
export function serializeState(state: AppState): string {
  const stateWithVersion = {
    ...state,
    version: STATE_VERSION
  }

  const persistableState = JSON.stringify(stateWithVersion, (key, value) => {
    // Filter out selection state
    if (key === 'selectedDomainId' ||
        key === 'selectedLabelId' ||
        key === 'selectedLabelDomainId' ||
        key === 'selectedConceptId' ||
        key === 'selectedInstanceId') {
      return undefined
    }

    // Handle Infinity values
    if (value === Infinity) return "Infinity"
    if (value === -Infinity) return "-Infinity"

    return value
  })

  return persistableState
}

// Same logic as StateDebugPanel import (with migration support)
export function deserializeState(jsonString: string): { domains: QualityDomain[], concepts: Concept[], instances: ConceptInstance[] } {
  const parsed = JSON.parse(jsonString)
  const version = parsed.version || 1 // Default to version 1 if not specified

  // Convert date strings back to Date objects and Infinity strings to Infinity
  const domains = parsed.domains.map((domain: any) => {
    const baseDomain = {
      ...domain,
      createdAt: new Date(domain.createdAt),
      dimensions: domain.dimensions.map((dim: any) => ({
        ...dim,
        range: [
          dim.range[0] === "Infinity" ? Infinity : dim.range[0] === "-Infinity" ? -Infinity : dim.range[0],
          dim.range[1] === "Infinity" ? Infinity : dim.range[1] === "-Infinity" ? -Infinity : dim.range[1]
        ] as const
      }))
    }

    // Handle old format (version 1) with properties field
    if (version === 1 || domain.properties) {
      const oldProperties = (domain.properties || []).map((prop: any) => ({
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

      // Migrate old properties to labels
      return {
        ...baseDomain,
        labels: oldProperties.map(migratePropertyToLabel)
      }
    }

    // Handle new format (version 2) with labels field
    const labels = (domain.labels || []).map((label: any) => ({
      ...label,
      createdAt: new Date(label.createdAt),
      dimensions: label.dimensions.map((d: any) => {
        // Handle region dimensions (with range)
        if ('range' in d) {
          return {
            ...d,
            range: [
              d.range[0] === "Infinity" ? Infinity : d.range[0] === "-Infinity" ? -Infinity : d.range[0],
              d.range[1] === "Infinity" ? Infinity : d.range[1] === "-Infinity" ? -Infinity : d.range[1]
            ] as const
          }
        }
        // Handle point dimensions (with value)
        return d
      })
    }))

    return {
      ...baseDomain,
      labels
    }
  })

  const concepts = (parsed.concepts || []).map((concept: any) => {
    const baseConcept = {
      ...concept,
      createdAt: new Date(concept.createdAt)
    }

    // Handle old format with propertyRefs
    if (version === 1 || concept.propertyRefs) {
      return {
        ...baseConcept,
        labelRefs: (concept.propertyRefs || []).map(migratePropertyRefToLabelRef)
      }
    }

    // New format already has labelRefs
    return baseConcept
  })

  // Handle instances (version 3+)
  const instances = (parsed.instances || []).map((instance: any) => ({
    ...instance,
    createdAt: new Date(instance.createdAt)
  }))

  return { domains, concepts, instances }
}

export function saveToLocalStorage(state: AppState): void {
  try {
    const serialized = serializeState(state)
    localStorage.setItem(STORAGE_KEY, serialized)
  } catch (error) {
    console.error('Failed to save state to localStorage:', error)
  }
}

export function loadFromLocalStorage(): { domains: QualityDomain[], concepts: Concept[], instances: ConceptInstance[] } | null {
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
