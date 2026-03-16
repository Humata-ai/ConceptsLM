import { useMemo, memo } from 'react'
import { Text, Billboard, Line } from '@react-three/drei'
import { Vector3 } from 'three'
import type { Concept } from '../types'
import { useQualityDomain } from '../context/QualityDomainContext'
import type { ThreeEvent } from '@react-three/fiber'

interface ConceptVisualization3DProps {
  concept: Concept
  isSelected?: boolean
}

function ConceptVisualization3D({ concept, isSelected = false }: ConceptVisualization3DProps) {
  const { state, getConceptProperties, selectConcept } = useQualityDomain()
  const properties = getConceptProperties(concept.id)

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    selectConcept(concept.id)
  }

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
      if (domain.dimensions.length >= 4) return

      // Get domain position in world space
      const domainPos = domainPositions.get(domain.id)
      if (!domainPos) return

      // Scale by domain scale (0.5 or 0.55)
      const scale = state.selectedDomainId === domain.id ? 0.55 : 0.5

      let worldPosition: Vector3

      if (domain.dimensions.length === 1) {
        // 1D properties: positioned on X-axis at Y=0.3, Z=0
        // Size is 10, maps to -5 to +5 space
        const dim = domain.dimensions[0]
        const propDim = property.dimensions.find((d) => d.dimensionId === dim.id)
        const propRange = propDim?.range || dim.range
        const [dimMin, dimMax] = dim.range

        const minPos = -5 + ((propRange[0] - dimMin) / (dimMax - dimMin)) * 10
        const maxPos = -5 + ((propRange[1] - dimMin) / (dimMax - dimMin)) * 10
        const centerPos = (minPos + maxPos) / 2

        worldPosition = new Vector3(
          domainPos[0] + centerPos * scale,
          domainPos[1] + 0.3 * scale,
          domainPos[2]
        )
      } else if (domain.dimensions.length === 2) {
        // 2D properties: positioned on XZ plane at Y=0.1
        // Size is 10x10, maps to -5 to +5 space
        const dimX = domain.dimensions[0]
        const dimZ = domain.dimensions[1]

        const propDimX = property.dimensions.find((d) => d.dimensionId === dimX.id)
        const propDimZ = property.dimensions.find((d) => d.dimensionId === dimZ.id)

        const propRangeX = propDimX?.range || dimX.range
        const propRangeZ = propDimZ?.range || dimZ.range

        const [dimMinX, dimMaxX] = dimX.range
        const [dimMinZ, dimMaxZ] = dimZ.range

        const minX = -5 + ((propRangeX[0] - dimMinX) / (dimMaxX - dimMinX)) * 10
        const maxX = -5 + ((propRangeX[1] - dimMinX) / (dimMaxX - dimMinX)) * 10
        const minZ = -5 + ((propRangeZ[0] - dimMinZ) / (dimMaxZ - dimMinZ)) * 10
        const maxZ = -5 + ((propRangeZ[1] - dimMinZ) / (dimMaxZ - dimMinZ)) * 10

        const centerX = (minX + maxX) / 2
        const centerZ = (minZ + maxZ) / 2

        worldPosition = new Vector3(
          domainPos[0] + centerX * scale,
          domainPos[1] + 0.1 * scale,
          domainPos[2] + centerZ * scale
        )
      } else {
        // 3D properties: positioned in 3D space
        // Size is 8x8x8, maps to -4 to +4 space
        const ranges = domain.dimensions.map((dim) => {
          const propDim = property.dimensions.find((d) => d.dimensionId === dim.id)
          const propRange = propDim?.range || dim.range
          const [dimMin, dimMax] = dim.range

          const min = -4 + ((propRange[0] - dimMin) / (dimMax - dimMin)) * 8
          const max = -4 + ((propRange[1] - dimMin) / (dimMax - dimMin)) * 8

          return { center: (min + max) / 2 }
        })

        worldPosition = new Vector3(
          domainPos[0] + ranges[0].center * scale,
          domainPos[1] + ranges[1].center * scale,
          domainPos[2] + ranges[2].center * scale
        )
      }

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
      <Billboard
        position={conceptPosition}
        onClick={handleClick}
        onPointerOver={() => { if (document.body.style) document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { if (document.body.style) document.body.style.cursor = 'default' }}
      >
        {/* Background rectangle */}
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[concept.name.length * 1.2, 2.2]} />
          <meshBasicMaterial color={isSelected ? '#dbeafe' : '#f3e8ff'} opacity={0.95} transparent />
        </mesh>

        {/* Concept name */}
        <Text
          position={[0, 0, 0]}
          fontSize={1.8}
          color={isSelected ? '#3b82f6' : '#7c3aed'}
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
          color={isSelected ? '#60a5fa' : '#a78bfa'}
          lineWidth={isSelected ? 3 : 2}
          opacity={isSelected ? 0.6 : 0.4}
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
