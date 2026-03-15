import { useMemo, memo } from 'react'
import { Text, Billboard, Line } from '@react-three/drei'
import { Vector3 } from 'three'
import type { Concept } from '../types'
import { useQualityDomain } from '../context/QualityDomainContext'

interface ConceptVisualization3DProps {
  concept: Concept
}

function ConceptVisualization3D({ concept }: ConceptVisualization3DProps) {
  const { state, getConceptProperties } = useQualityDomain()
  const properties = getConceptProperties(concept.id)

  // Calculate domain positions (same as AllDomainsVisualization)
  const domainPositions = useMemo(() => {
    const radius = 15
    const total = state.domains.length
    const angleStep = (2 * Math.PI) / total

    const positions = new Map<string, readonly [number, number, number]>()
    state.domains.forEach((domain, index) => {
      const angle = index * angleStep
      const x = radius * Math.cos(angle)
      const z = radius * Math.sin(angle) - 15
      positions.set(domain.id, [x, 0, z] as const)
    })
    return positions
  }, [state.domains])

  // Calculate property world positions and centroid
  const { propertyPositions, conceptPosition } = useMemo(() => {
    const positions: Array<{ propertyId: string; position: Vector3 }> = []

    properties.forEach((property) => {
      const domain = state.domains.find((d) => d.id === property.domainId)
      if (!domain) return

      // Skip 4D+ properties (can't visualize in 3D)
      if (domain.dimensions.length < 3) return

      // Get domain position in world space
      const domainPos = domainPositions.get(domain.id)
      if (!domainPos) return

      // Calculate property center within domain (normalized to -4 to +4 space, scaled by 0.5)
      const ranges = domain.dimensions.slice(0, 3).map((dim) => {
        const propDim = property.dimensions.find((d) => d.dimensionId === dim.id)
        const propRange = propDim?.range || dim.range
        const [dimMin, dimMax] = dim.range

        // Normalize to -4 to +4 space (sizeX/Y/Z = 8)
        const min = -4 + ((propRange[0] - dimMin) / (dimMax - dimMin)) * 8
        const max = -4 + ((propRange[1] - dimMin) / (dimMax - dimMin)) * 8

        return { center: (min + max) / 2 }
      })

      // Property local position within domain
      const localX = ranges[0].center
      const localY = ranges[1].center
      const localZ = ranges[2].center

      // Scale by domain scale (0.5 or 0.55)
      const scale = state.selectedDomainId === domain.id ? 0.55 : 0.5

      // Transform to world coordinates
      const worldPosition = new Vector3(
        domainPos[0] + localX * scale,
        domainPos[1] + localY * scale,
        domainPos[2] + localZ * scale
      )

      positions.push({ propertyId: property.id, position: worldPosition })
    })

    // Calculate centroid
    let centroid = new Vector3(0, 0, 0)
    if (positions.length > 0) {
      positions.forEach(({ position }) => {
        centroid.add(position)
      })
      centroid.divideScalar(positions.length)
      // Place concept label 8 units above centroid
      centroid.y += 8
    } else {
      // Default position if no properties (shouldn't happen with validation)
      centroid = new Vector3(0, 10, 0)
    }

    return {
      propertyPositions: positions,
      conceptPosition: centroid,
    }
  }, [properties, state.domains, state.selectedDomainId, domainPositions])

  // If no valid properties to visualize, don't render
  if (propertyPositions.length === 0) {
    return null
  }

  return (
    <group>
      {/* Concept label billboard */}
      <Billboard position={conceptPosition}>
        {/* Background rectangle */}
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[concept.name.length * 1.2, 2.2]} />
          <meshBasicMaterial color="#f3e8ff" opacity={0.95} transparent />
        </mesh>

        {/* Concept name */}
        <Text
          position={[0, 0, 0]}
          fontSize={1.8}
          color="#7c3aed"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.1}
          outlineColor="#000000"
          fillOpacity={1}
          fontWeight="bold"
        >
          {concept.name}
        </Text>
      </Billboard>

      {/* Connection lines from concept to each property */}
      {propertyPositions.map(({ propertyId, position }) => (
        <Line
          key={propertyId}
          points={[
            [conceptPosition.x, conceptPosition.y, conceptPosition.z],
            [position.x, position.y, position.z],
          ]}
          color="#a78bfa"
          lineWidth={2}
          opacity={0.4}
          transparent
        />
      ))}
    </group>
  )
}

// Custom comparison to prevent unnecessary re-renders
const areEqual = (prevProps: ConceptVisualization3DProps, nextProps: ConceptVisualization3DProps) => {
  return (
    prevProps.concept.id === nextProps.concept.id &&
    prevProps.concept.name === nextProps.concept.name &&
    JSON.stringify(prevProps.concept.propertyRefs) === JSON.stringify(nextProps.concept.propertyRefs)
  )
}

export default memo(ConceptVisualization3D, areEqual)
