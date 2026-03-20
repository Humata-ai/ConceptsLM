import { useMemo, memo } from 'react'
import { Text } from '@react-three/drei'
import { useQualityDomain } from '@/app/store'
import DomainVisualization from './DomainVisualization'
import ConceptVisualization3D from './visualizations/ConceptVisualization3D'
import type { QualityDomain } from './types'

// Custom comparison for domain items - only re-render if domain data actually changed
const domainItemAreEqual = (
  prevProps: { domain: QualityDomain; position: readonly [number, number, number]; scale: number },
  nextProps: { domain: QualityDomain; position: readonly [number, number, number]; scale: number }
) => {
  return (
    prevProps.domain.id === nextProps.domain.id &&
    prevProps.domain.name === nextProps.domain.name &&
    prevProps.position === nextProps.position &&
    prevProps.scale === nextProps.scale &&
    JSON.stringify(prevProps.domain.dimensions) === JSON.stringify(nextProps.domain.dimensions) &&
    JSON.stringify(prevProps.domain.labels) === JSON.stringify(nextProps.domain.labels)
  )
}

// Memoized individual domain component
const DomainItem = memo(({
  domain,
  position,
  scale
}: {
  domain: QualityDomain
  position: readonly [number, number, number]
  scale: number
}) => {
  const labelPosition = useMemo(() => [0, -12, 0] as const, [])

  return (
    <group position={position} scale={scale}>
      <DomainVisualization domain={domain} />
      <Text position={labelPosition} fontSize={2} color="black">
        {domain.name}
      </Text>
    </group>
  )
}, domainItemAreEqual)
DomainItem.displayName = 'DomainItem'

const SelectedDomainItem = memo(({
  domain,
  position,
  scale
}: {
  domain: QualityDomain
  position: readonly [number, number, number]
  scale: number
}) => {
  const labelPosition = useMemo(() => [0, -12, 0] as const, [])

  return (
    <group position={position} scale={scale}>
      <DomainVisualization domain={domain} />
      <Text position={labelPosition} fontSize={2} color="orange">
        {domain.name}
      </Text>
    </group>
  )
}, domainItemAreEqual)
SelectedDomainItem.displayName = 'SelectedDomainItem'

function AllDomainsVisualization() {
  const { state } = useQualityDomain()
  const domains = state.domains

  // Memoize positions for all domains
  const domainPositions = useMemo(() => {
    const radius = 15
    const total = domains.length
    const angleStep = (2 * Math.PI) / total

    return domains.map((_, index) => {
      const angle = index * angleStep
      const x = radius * Math.cos(angle)
      const z = radius * Math.sin(angle) - 15
      return [x, 0, z] as const
    })
  }, [domains.length])

  const emptyPosition = useMemo(() => [0, 0, 0] as const, [])

  // Handle empty state
  if (domains.length === 0) {
    return (
      <Text position={emptyPosition} fontSize={1.5} color="gray">
        No domains yet. Click &quot;+ Add Domain&quot; to create one.
      </Text>
    )
  }

  return (
    <group>
      {/* Render each domain at its position */}
      {domains.map((domain, index) => {
        // Skip 4D+ domains as they're handled by TableView
        if (domain.dimensions.length >= 4) {
          return null
        }

        const position = domainPositions[index]
        const isSelected = state.selectedDomainId === domain.id
        const scale = isSelected ? 0.55 : 0.5

        const Component = isSelected ? SelectedDomainItem : DomainItem

        return (
          <Component
            key={domain.id}
            domain={domain}
            position={position}
            scale={scale}
          />
        )
      })}

      {/* Render all concepts */}
      {state.concepts.map((concept) => (
        <ConceptVisualization3D
          key={concept.id}
          concept={concept}
          isSelected={state.selectedConceptId === concept.id}
        />
      ))}
    </group>
  )
}

// Memoize the entire component to prevent re-renders when camera moves
export default memo(AllDomainsVisualization)
