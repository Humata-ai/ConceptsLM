import type { AppState } from './types'
import type { QualityDomain, QualityDomainLabel, QualityDomainPoint, ConceptInstance } from '../components/quality-domain/types'
import { isPoint } from '../components/quality-domain/types'

/**
 * App Store Selectors
 * 
 * Pure functions for deriving data from the app state.
 * Selectors help encapsulate state access logic and can be memoized for performance.
 */

/**
 * Get the currently selected domain
 */
export function getSelectedDomain(state: AppState): QualityDomain | null {
  if (!state.selectedDomainId) return null
  return state.domains.find((d) => d.id === state.selectedDomainId) || null
}

/**
 * Get all labels for a given concept
 */
export function getConceptLabels(state: AppState, conceptId: string): QualityDomainLabel[] {
  const concept = state.concepts.find((c) => c.id === conceptId)
  if (!concept) return []

  const labels: QualityDomainLabel[] = []
  for (const ref of concept.labelRefs) {
    const domain = state.domains.find((d) => d.id === ref.domainId)
    if (domain) {
      const label = domain.labels.find((l) => l.id === ref.labelId)
      if (label) {
        labels.push(label)
      }
    }
  }
  return labels
}

/**
 * Get all points for a given instance
 */
export function getInstancePoints(state: AppState, instanceId: string): QualityDomainPoint[] {
  const instance = state.instances.find((i) => i.id === instanceId)
  if (!instance) return []

  return instance.pointRefs
    .map(ref => {
      const domain = state.domains.find((d) => d.id === ref.domainId)
      if (!domain) return null
      const label = domain.labels.find((l) => l.id === ref.pointId)
      return label && isPoint(label) ? label : null
    })
    .filter((p): p is QualityDomainPoint => p !== null)
}

/**
 * Get all instances for a given concept
 */
export function getConceptInstances(state: AppState, conceptId: string): ConceptInstance[] {
  return state.instances.filter((i) => i.conceptId === conceptId)
}

/**
 * Get a domain by ID
 */
export function getDomainById(state: AppState, domainId: string): QualityDomain | null {
  return state.domains.find((d) => d.id === domainId) || null
}

/**
 * Get a label by domain ID and label ID
 */
export function getLabelById(state: AppState, domainId: string, labelId: string): QualityDomainLabel | null {
  const domain = getDomainById(state, domainId)
  if (!domain) return null
  return domain.labels.find((l) => l.id === labelId) || null
}

/**
 * Get a concept by ID
 */
export function getConceptById(state: AppState, conceptId: string) {
  return state.concepts.find((c) => c.id === conceptId) || null
}

/**
 * Get an instance by ID
 */
export function getInstanceById(state: AppState, instanceId: string) {
  return state.instances.find((i) => i.id === instanceId) || null
}

/**
 * Get all domains
 */
export function getAllDomains(state: AppState): QualityDomain[] {
  return state.domains
}

/**
 * Get all concepts
 */
export function getAllConcepts(state: AppState) {
  return state.concepts
}

/**
 * Get all instances
 */
export function getAllInstances(state: AppState) {
  return state.instances
}
