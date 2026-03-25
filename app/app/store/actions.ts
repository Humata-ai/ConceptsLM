import type { AppAction } from './types'
import type { QualityDomain, QualityDomainLabel, Concept, ConceptInstance, Word } from '../components/shared/types'

/**
 * Action Creators
 * 
 * Helper functions for creating actions with proper typing.
 * These make dispatching actions more convenient and type-safe.
 */

// Domain action creators
export const addDomain = (domain: QualityDomain): AppAction => ({
  type: 'ADD_DOMAIN',
  payload: domain,
})

export const updateDomain = (domain: QualityDomain): AppAction => ({
  type: 'UPDATE_DOMAIN',
  payload: domain,
})

export const deleteDomain = (id: string): AppAction => ({
  type: 'DELETE_DOMAIN',
  payload: id,
})

// Selection action creators
export const selectDomain = (id: string | null): AppAction => ({
  type: 'SELECT_DOMAIN',
  payload: id,
})

export const selectLabel = (domainId: string, labelId: string): AppAction => ({
  type: 'SELECT_LABEL',
  payload: { domainId, labelId },
})

export const deselectLabel = (): AppAction => ({
  type: 'SELECT_LABEL',
  payload: null,
})

export const selectConcept = (conceptId: string | null): AppAction => ({
  type: 'SELECT_CONCEPT',
  payload: conceptId,
})

export const selectInstance = (instanceId: string | null): AppAction => ({
  type: 'SELECT_INSTANCE',
  payload: instanceId,
})

export const clearSelection = (): AppAction => ({
  type: 'CLEAR_SELECTION',
})

// Label action creators
export const addLabel = (domainId: string, label: QualityDomainLabel): AppAction => ({
  type: 'ADD_LABEL',
  payload: { domainId, label },
})

export const updateLabel = (domainId: string, label: QualityDomainLabel): AppAction => ({
  type: 'UPDATE_LABEL',
  payload: { domainId, label },
})

export const deleteLabel = (domainId: string, labelId: string): AppAction => ({
  type: 'DELETE_LABEL',
  payload: { domainId, labelId },
})

// Concept action creators
export const addConcept = (concept: Concept): AppAction => ({
  type: 'ADD_CONCEPT',
  payload: concept,
})

export const updateConcept = (concept: Concept): AppAction => ({
  type: 'UPDATE_CONCEPT',
  payload: concept,
})

export const deleteConcept = (id: string): AppAction => ({
  type: 'DELETE_CONCEPT',
  payload: id,
})

// Instance action creators
export const addInstance = (instance: ConceptInstance): AppAction => ({
  type: 'ADD_INSTANCE',
  payload: instance,
})

export const updateInstance = (instance: ConceptInstance): AppAction => ({
  type: 'UPDATE_INSTANCE',
  payload: instance,
})

export const deleteInstance = (id: string): AppAction => ({
  type: 'DELETE_INSTANCE',
  payload: id,
})

// Word action creators
export const addWord = (word: Word): AppAction => ({
  type: 'ADD_WORD',
  payload: word,
})

export const updateWord = (word: Word): AppAction => ({
  type: 'UPDATE_WORD',
  payload: word,
})

export const deleteWord = (id: string): AppAction => ({
  type: 'DELETE_WORD',
  payload: id,
})

// State restoration action creator
export const restoreState = (
  domains: QualityDomain[],
  concepts: Concept[],
  instances: ConceptInstance[],
  words: Word[] = []
): AppAction => ({
  type: 'RESTORE_STATE',
  payload: { domains, concepts, instances, words },
})
