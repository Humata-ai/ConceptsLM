export interface QualityDimension {
  id: string
  name: string
  range: readonly [number, number]
}

// ===== Region/Point Label Types (New Discriminated Union) =====

export interface RegionDimensionRange {
  dimensionId: string
  range: readonly [number, number]
}

export interface PointDimensionValue {
  dimensionId: string
  value: number
}

// Base interface for labels
export interface QualityDomainLabelBase {
  id: string
  name: string
  domainId: string
  createdAt: Date
}

export interface QualityDomainRegion extends QualityDomainLabelBase {
  type: 'region'
  dimensions: RegionDimensionRange[]
}

export interface QualityDomainPoint extends QualityDomainLabelBase {
  type: 'point'
  dimensions: PointDimensionValue[]
}

// Union type
export type QualityDomainLabel = QualityDomainRegion | QualityDomainPoint

// Type guards
export function isRegion(label: QualityDomainLabel): label is QualityDomainRegion {
  return label.type === 'region'
}

export function isPoint(label: QualityDomainLabel): label is QualityDomainPoint {
  return label.type === 'point'
}

// ===== Backward Compatibility Aliases =====

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
  labels: QualityDomainLabel[]
  properties?: Property[]
  createdAt: Date
}

export interface LabelReference {
  domainId: string
  labelId: string
}

export interface PropertyReference {
  domainId: string
  propertyId: string
}

export interface Concept {
  id: string
  name: string
  labelRefs: LabelReference[]
  propertyRefs?: PropertyReference[]
  createdAt: Date
}

export interface PointReference {
  domainId: string
  pointId: string
}

export interface ConceptInstance {
  id: string
  conceptId: string
  name: string
  pointRefs: PointReference[]
  createdAt: Date
}

export interface QualityDomainState {
  domains: QualityDomain[]
  selectedDomainId: string | null
  selectedLabelId: string | null
  selectedLabelDomainId: string | null
  selectedConceptId: string | null
  selectedInstanceId: string | null
  concepts: Concept[]
  instances: ConceptInstance[]
}

export type QualityDomainAction =
  | { type: 'ADD_DOMAIN'; payload: QualityDomain }
  | { type: 'UPDATE_DOMAIN'; payload: QualityDomain }
  | { type: 'DELETE_DOMAIN'; payload: string }
  | { type: 'SELECT_DOMAIN'; payload: string | null }
  | { type: 'SELECT_LABEL'; payload: { domainId: string; labelId: string } | null }
  | { type: 'SELECT_CONCEPT'; payload: string | null }
  | { type: 'SELECT_INSTANCE'; payload: string | null }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'ADD_LABEL'; payload: { domainId: string; label: QualityDomainLabel } }
  | { type: 'UPDATE_LABEL'; payload: { domainId: string; label: QualityDomainLabel } }
  | { type: 'DELETE_LABEL'; payload: { domainId: string; labelId: string } }
  | { type: 'ADD_CONCEPT'; payload: Concept }
  | { type: 'UPDATE_CONCEPT'; payload: Concept }
  | { type: 'DELETE_CONCEPT'; payload: string }
  | { type: 'ADD_INSTANCE'; payload: ConceptInstance }
  | { type: 'UPDATE_INSTANCE'; payload: ConceptInstance }
  | { type: 'DELETE_INSTANCE'; payload: string }
  | { type: 'RESTORE_STATE'; payload: { domains: QualityDomain[]; concepts: Concept[]; instances: ConceptInstance[] } }
