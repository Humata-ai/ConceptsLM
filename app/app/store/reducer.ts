import type { AppState, AppAction } from './types'

/**
 * App Store Reducer
 * 
 * Pure function that takes the current state and an action, and returns the next state.
 * Handles all state mutations for domains, concepts, instances, and selections.
 */
export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    // Domain actions
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

    // Selection actions
    case 'SELECT_DOMAIN':
      return {
        ...state,
        selectedDomainId: action.payload,
        selectedLabelId: null,
        selectedLabelDomainId: null,
        selectedConceptId: null,
        selectedInstanceId: null,
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
        selectedInstanceId: null,
      }

    case 'SELECT_CONCEPT':
      return {
        ...state,
        selectedDomainId: null,
        selectedLabelId: null,
        selectedLabelDomainId: null,
        selectedConceptId: action.payload,
        selectedInstanceId: null,
      }

    case 'SELECT_INSTANCE':
      const instance = action.payload
        ? state.instances.find(i => i.id === action.payload)
        : null
      return {
        ...state,
        selectedDomainId: null,
        selectedLabelId: null,
        selectedLabelDomainId: null,
        selectedConceptId: instance ? instance.conceptId : null,
        selectedInstanceId: action.payload,
      }

    case 'CLEAR_SELECTION':
      return {
        ...state,
        selectedDomainId: null,
        selectedLabelId: null,
        selectedLabelDomainId: null,
        selectedConceptId: null,
        selectedInstanceId: null,
      }

    // Label actions
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

    // Concept actions
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
        instances: state.instances.filter((instance) => instance.conceptId !== action.payload),
      }

    // Instance actions
    case 'ADD_INSTANCE':
      return {
        ...state,
        instances: [...state.instances, action.payload],
      }

    case 'UPDATE_INSTANCE':
      return {
        ...state,
        instances: state.instances.map((instance) =>
          instance.id === action.payload.id ? action.payload : instance
        ),
      }

    case 'DELETE_INSTANCE':
      return {
        ...state,
        instances: state.instances.filter((instance) => instance.id !== action.payload),
      }

    // State restoration
    case 'RESTORE_STATE':
      return {
        ...state,
        domains: action.payload.domains,
        concepts: action.payload.concepts,
        instances: action.payload.instances || [],
        selectedDomainId: null,
        selectedLabelId: null,
        selectedLabelDomainId: null,
        selectedConceptId: null,
        selectedInstanceId: null,
      }

    default:
      return state
  }
}
