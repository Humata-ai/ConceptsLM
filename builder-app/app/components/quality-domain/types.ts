export interface QualityDimension {
  id: string
  name: string
  range: readonly [number, number]
}

export interface PropertyDimensionRange {
  dimensionId: string
  range: readonly [number, number]
}

export interface Property {
  id: string
  name: string
  domainId: string
  dimensions: PropertyDimensionRange[]
  createdAt: Date
}

export interface QualityDomain {
  id: string
  name: string
  dimensions: QualityDimension[]
  properties: Property[]
  createdAt: Date
}

export interface PropertyReference {
  domainId: string
  propertyId: string
}

export interface Concept {
  id: string
  name: string
  propertyRefs: PropertyReference[]
  createdAt: Date
}

export interface QualityDomainState {
  domains: QualityDomain[]
  selectedDomainId: string | null
  selectedPropertyId: string | null
  selectedPropertyDomainId: string | null
  selectedConceptId: string | null
  concepts: Concept[]
}

export type QualityDomainAction =
  | { type: 'ADD_DOMAIN'; payload: QualityDomain }
  | { type: 'UPDATE_DOMAIN'; payload: QualityDomain }
  | { type: 'DELETE_DOMAIN'; payload: string }
  | { type: 'SELECT_DOMAIN'; payload: string | null }
  | { type: 'SELECT_PROPERTY'; payload: { domainId: string; propertyId: string } | null }
  | { type: 'SELECT_CONCEPT'; payload: string | null }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'ADD_PROPERTY'; payload: { domainId: string; property: Property } }
  | { type: 'UPDATE_PROPERTY'; payload: { domainId: string; property: Property } }
  | { type: 'DELETE_PROPERTY'; payload: { domainId: string; propertyId: string } }
  | { type: 'ADD_CONCEPT'; payload: Concept }
  | { type: 'UPDATE_CONCEPT'; payload: Concept }
  | { type: 'DELETE_CONCEPT'; payload: string }
