import { Text } from '@react-three/drei'
import { useQualityDomain } from './context/QualityDomainContext'
import DomainVisualization from './DomainVisualization'
import ConnectionLine from './ConnectionLine'

export default function AllDomainsVisualization() {
  const { state } = useQualityDomain()
  const domains = state.domains

  const getPosition = (index: number, total: number): [number, number, number] => {
    const radius = 15
    const angleStep = (2 * Math.PI) / total
    const angle = index * angleStep
    const x = radius * Math.cos(angle)
    const z = radius * Math.sin(angle) - 15
    return [x, 0, z]
  }

  // Handle empty state
  if (domains.length === 0) {
    return (
      <Text position={[0, 0, 0]} fontSize={1.5} color="gray">
        No domains yet. Click &quot;+ Add Domain&quot; to create one.
      </Text>
    )
  }

  // Determine center label
  const centerLabel = state.selectedDomainId
    ? domains.find((d) => d.id === state.selectedDomainId)?.name || 'Quality Domains'
    : 'Quality Domains'

  return (
    <group>
      {/* Central label */}
      <Text position={[0, 0, 5]} fontSize={2} color="black">
        {centerLabel}
      </Text>

      {/* Render each domain at its position */}
      {domains.map((domain, index) => {
        const position = getPosition(index, domains.length)
        const isSelected = state.selectedDomainId === domain.id
        const scale = isSelected ? 1.1 : 1.0
        const lineColor = isSelected ? 'orange' : 'blue'
        const lineOpacity = isSelected ? 0.6 : 0.3

        // Skip 4D+ domains as they're handled by TableView
        if (domain.dimensions.length >= 4) {
          return null
        }

        return (
          <group key={domain.id} position={position} scale={scale * 0.5}>
            <DomainVisualization domain={domain} />

            {/* Connection line from center to this domain */}
            <ConnectionLine
              start={[0, 0, 5]}
              end={position}
              color={lineColor}
              opacity={lineOpacity}
            />

            {/* Domain name label */}
            <Text
              position={[0, -12, 0]}
              fontSize={2}
              color={isSelected ? 'orange' : 'black'}
            >
              {domain.name}
            </Text>
          </group>
        )
      })}
    </group>
  )
}
