'use client'

import { createContext, useContext, useReducer, useMemo, useCallback, useEffect, type ReactNode } from 'react'
import type { QualityDomain, QualityDomainState, QualityDomainAction, QualityDomainLabel, Concept, RegionDimensionRange, PointDimensionValue } from '../types'
import defaultDataJson from '../defaultData.json'
import { saveToLocalStorage } from '../localStorage'

interface QualityDomainContextType {
  state: QualityDomainState
  dispatch: React.Dispatch<QualityDomainAction>
  addDomain: (domain: QualityDomain) => void
  updateDomain: (domain: QualityDomain) => void
  deleteDomain: (id: string) => void
  selectDomain: (id: string | null) => void
  selectLabel: (domainId: string, labelId: string) => void
  selectConcept: (conceptId: string | null) => void
  clearSelection: () => void
  getSelectedDomain: () => QualityDomain | null
  addLabel: (domainId: string, label: QualityDomainLabel) => void
  updateLabel: (domainId: string, label: QualityDomainLabel) => void
  deleteLabel: (domainId: string, labelId: string) => void
  addConcept: (concept: Concept) => void
  updateConcept: (concept: Concept) => void
  deleteConcept: (id: string) => void
  getConceptLabels: (conceptId: string) => QualityDomainLabel[]
}

const QualityDomainContext = createContext<QualityDomainContextType | undefined>(undefined)

// JSON-compatible types for loading from file
interface JsonDimension {
  id: string
  name: string
  range: number[]
  type?: string
}

interface JsonRegionDimensionRange {
  dimensionId: string
  range: number[]
}

interface JsonPointDimensionValue {
  dimensionId: string
  value: number
}

interface JsonLabel {
  type: 'region' | 'point'
  id: string
  name: string
  domainId: string
  dimensions: (JsonRegionDimensionRange | JsonPointDimensionValue)[]
  createdAt: string
}

interface JsonDomain {
  id: string
  name: string
  dimensions: JsonDimension[]
  labels: JsonLabel[]
  createdAt: string
}

interface JsonConcept {
  id: string
  name: string
  labelRefs: { domainId: string; labelId: string }[]
  createdAt: string
}

interface JsonState {
  domains: JsonDomain[]
  selectedDomainId: string | null
  concepts: JsonConcept[]
}

// Helper to convert JSON array to readonly tuple
function toRangeTuple(arr: number[]): readonly [number, number] {
  if (arr.length !== 2) {
    throw new Error(`Range must have exactly 2 elements, got ${arr.length}`)
  }
  return [arr[0], arr[1]] as const
}

// Load default data from JSON file
const jsonData: JsonState = defaultDataJson as JsonState

const initialState: QualityDomainState = {
  domains: jsonData.domains.map(domain => ({
    ...domain,
    dimensions: domain.dimensions.map(dim => ({
      ...dim,
      range: toRangeTuple(dim.range),
    })),
    labels: domain.labels.map(label => {
      if (label.type === 'region') {
        return {
          type: 'region' as const,
          id: label.id,
          name: label.name,
          domainId: label.domainId,
          dimensions: label.dimensions.map(d => {
            if ('range' in d) {
              return {
                dimensionId: d.dimensionId,
                range: toRangeTuple(d.range),
              }
            }
            return d as unknown as RegionDimensionRange
          }),
          createdAt: new Date(label.createdAt),
        }
      } else {
        return {
          type: 'point' as const,
          id: label.id,
          name: label.name,
          domainId: label.domainId,
          dimensions: label.dimensions as PointDimensionValue[],
          createdAt: new Date(label.createdAt),
        }
      }
    }),
    createdAt: new Date(domain.createdAt),
  })),
  selectedDomainId: null,
  selectedLabelId: null,
  selectedLabelDomainId: null,
  selectedConceptId: null,
  concepts: jsonData.concepts.map(concept => ({
    ...concept,
    labelRefs: concept.labelRefs,
    createdAt: new Date(concept.createdAt),
  })),
}

function qualityDomainReducer(
  state: QualityDomainState,
  action: QualityDomainAction
): QualityDomainState {
  switch (action.type) {
    case 'ADD_DOMAIN':
      return {
        ...state,
        domains: [...state.domains, action.payload],
      }
    case 'UPDATE_DOMAIN':
      return {
        ...state,
        domains: state.domains.map((domain) =>
          domain.id === action.payload.id ? action.payload : domain
        ),
      }
    case 'DELETE_DOMAIN':
      return {
        ...state,
        domains: state.domains.filter((domain) => domain.id !== action.payload),
        selectedDomainId:
          state.selectedDomainId === action.payload ? null : state.selectedDomainId,
      }
    case 'SELECT_DOMAIN':
      return {
        ...state,
        selectedDomainId: action.payload,
        selectedLabelId: null,
        selectedLabelDomainId: null,
        selectedConceptId: null,
      }
    case 'SELECT_LABEL':
      if (!action.payload) {
        return {
          ...state,
          selectedLabelId: null,
          selectedLabelDomainId: null,
        }
      }
      return {
        ...state,
        selectedDomainId: null,
        selectedLabelId: action.payload.labelId,
        selectedLabelDomainId: action.payload.domainId,
        selectedConceptId: null,
      }
    case 'SELECT_CONCEPT':
      return {
        ...state,
        selectedDomainId: null,
        selectedLabelId: null,
        selectedLabelDomainId: null,
        selectedConceptId: action.payload,
      }
    case 'CLEAR_SELECTION':
      return {
        ...state,
        selectedDomainId: null,
        selectedLabelId: null,
        selectedLabelDomainId: null,
        selectedConceptId: null,
      }
    case 'ADD_LABEL':
      return {
        ...state,
        domains: state.domains.map((domain) =>
          domain.id === action.payload.domainId
            ? { ...domain, labels: [...domain.labels, action.payload.label] }
            : domain
        ),
      }
    case 'UPDATE_LABEL':
      return {
        ...state,
        domains: state.domains.map((domain) =>
          domain.id === action.payload.domainId
            ? {
                ...domain,
                labels: domain.labels.map((label) =>
                  label.id === action.payload.label.id ? action.payload.label : label
                ),
              }
            : domain
        ),
      }
    case 'DELETE_LABEL':
      return {
        ...state,
        domains: state.domains.map((domain) =>
          domain.id === action.payload.domainId
            ? {
                ...domain,
                labels: domain.labels.filter(
                  (label) => label.id !== action.payload.labelId
                ),
              }
            : domain
        ),
      }
    case 'ADD_CONCEPT':
      return {
        ...state,
        concepts: [...state.concepts, action.payload],
      }
    case 'UPDATE_CONCEPT':
      return {
        ...state,
        concepts: state.concepts.map((concept) =>
          concept.id === action.payload.id ? action.payload : concept
        ),
      }
    case 'DELETE_CONCEPT':
      return {
        ...state,
        concepts: state.concepts.filter((concept) => concept.id !== action.payload),
      }
    case 'RESTORE_STATE':
      return {
        ...state,
        domains: action.payload.domains,
        concepts: action.payload.concepts,
        selectedDomainId: null,
        selectedLabelId: null,
        selectedLabelDomainId: null,
        selectedConceptId: null,
      }
    default:
      return state
  }
}

export function QualityDomainProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(qualityDomainReducer, initialState)

  // Auto-save to localStorage on every state change
  useEffect(() => {
    saveToLocalStorage(state)
  }, [state])

  // Memoize helper functions to prevent recreation on every render
  const addDomain = useCallback((domain: QualityDomain) => {
    dispatch({ type: 'ADD_DOMAIN', payload: domain })
  }, [])

  const updateDomain = useCallback((domain: QualityDomain) => {
    dispatch({ type: 'UPDATE_DOMAIN', payload: domain })
  }, [])

  const deleteDomain = useCallback((id: string) => {
    dispatch({ type: 'DELETE_DOMAIN', payload: id })
  }, [])

  const selectDomain = useCallback((id: string | null) => {
    dispatch({ type: 'SELECT_DOMAIN', payload: id })
  }, [])

  const selectLabel = useCallback((domainId: string, labelId: string) => {
    dispatch({ type: 'SELECT_LABEL', payload: { domainId, labelId } })
  }, [])

  const selectConcept = useCallback((conceptId: string | null) => {
    dispatch({ type: 'SELECT_CONCEPT', payload: conceptId })
  }, [])

  const clearSelection = useCallback(() => {
    dispatch({ type: 'CLEAR_SELECTION' })
  }, [])

  const getSelectedDomain = useCallback(() => {
    if (!state.selectedDomainId) return null
    return state.domains.find((d) => d.id === state.selectedDomainId) || null
  }, [state.selectedDomainId, state.domains])

  const addLabel = useCallback((domainId: string, label: QualityDomainLabel) => {
    dispatch({ type: 'ADD_LABEL', payload: { domainId, label } })
  }, [])

  const updateLabel = useCallback((domainId: string, label: QualityDomainLabel) => {
    dispatch({ type: 'UPDATE_LABEL', payload: { domainId, label } })
  }, [])

  const deleteLabel = useCallback((domainId: string, labelId: string) => {
    dispatch({ type: 'DELETE_LABEL', payload: { domainId, labelId } })
  }, [])

  const addConcept = useCallback((concept: Concept) => {
    dispatch({ type: 'ADD_CONCEPT', payload: concept })
  }, [])

  const updateConcept = useCallback((concept: Concept) => {
    dispatch({ type: 'UPDATE_CONCEPT', payload: concept })
  }, [])

  const deleteConcept = useCallback((id: string) => {
    dispatch({ type: 'DELETE_CONCEPT', payload: id })
  }, [])

  const getConceptLabels = useCallback((conceptId: string): QualityDomainLabel[] => {
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
  }, [state.concepts, state.domains])

  // Memoize context value to only recreate when state changes
  const value: QualityDomainContextType = useMemo(() => ({
    state,
    dispatch,
    addDomain,
    updateDomain,
    deleteDomain,
    selectDomain,
    selectLabel,
    selectConcept,
    clearSelection,
    getSelectedDomain,
    addLabel,
    updateLabel,
    deleteLabel,
    addConcept,
    updateConcept,
    deleteConcept,
    getConceptLabels,
  }), [state, addDomain, updateDomain, deleteDomain, selectDomain, selectLabel, selectConcept, clearSelection, getSelectedDomain, addLabel, updateLabel, deleteLabel, addConcept, updateConcept, deleteConcept, getConceptLabels])

  return (
    <QualityDomainContext.Provider value={value}>
      {children}
    </QualityDomainContext.Provider>
  )
}

export function useQualityDomain() {
  const context = useContext(QualityDomainContext)
  if (context === undefined) {
    throw new Error('useQualityDomain must be used within a QualityDomainProvider')
  }
  return context
}
