import type { AppState } from './types'
import type { QualityDomain, Concept, ConceptInstance, QualityDomainLabel, RegionDimensionRange, PointDimensionValue } from '../components/shared/types'
import defaultDataJson from '../components/shared/defaultData.json'

/**
 * JSON-compatible types for loading from file
 * 
 * These types match the structure of the JSON data file and are converted
 * to the proper runtime types during loading.
 */
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

interface JsonInstance {
  id: string
  conceptId: string
  name: string
  pointRefs: { domainId: string; pointId: string }[]
  createdAt: string
}

interface JsonState {
  domains: JsonDomain[]
  concepts: JsonConcept[]
  instances: JsonInstance[]
}

/**
 * Helper to convert JSON array to readonly tuple
 */
function toRangeTuple(arr: number[]): readonly [number, number] {
  if (arr.length !== 2) {
    throw new Error(`Range must have exactly 2 elements, got ${arr.length}`)
  }
  return [arr[0], arr[1]] as const
}

/**
 * Load and convert default data from JSON file
 */
const jsonData: JsonState = defaultDataJson as JsonState

/**
 * Initial application state
 * 
 * Loads default data from JSON and converts it to the proper runtime types.
 */
export const initialState: AppState = {
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
  selectedInstanceId: null,
  concepts: jsonData.concepts.map(concept => ({
    ...concept,
    labelRefs: concept.labelRefs,
    createdAt: new Date(concept.createdAt),
  })),
  instances: (jsonData.instances || []).map(instance => ({
    ...instance,
    pointRefs: instance.pointRefs,
    createdAt: new Date(instance.createdAt),
  })),
  words: [],
  hasRestoredState: false,
}
