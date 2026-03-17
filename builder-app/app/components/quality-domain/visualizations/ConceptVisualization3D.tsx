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
  const { state, getConceptLabels, getConceptInstances, getInstancePoints, selectConcept, selectInstance } = useQualityDomain()
  const labels = getConceptLabels(concept.id)
  const instances = getConceptInstances(concept.id)

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

  // Calculate instance point positions for all instances
  const allInstancesData = useMemo(() => {
    return instances.map(instance => {
      const points = getInstancePoints(instance.id)
      const positions: Array<{ pointId: string; domainName: string; pointName: string; position: Vector3 }> = []

      // Helper to get point value
      const getPointValue = (
        pointDim: typeof points[0]['dimensions'][0] | undefined
      ): number | undefined => {
        if (!pointDim || !('value' in pointDim)) return undefined
        return pointDim.value
      }

      points.forEach((point) => {
        const domain = state.domains.find((d) => d.id === point.domainId)
        if (!domain) return

        // Skip 4D+ points (can't visualize in 3D)
        if (domain.dimensions.length >= 4) return

        // Get domain position in world space
        const domainPos = domainPositions.get(domain.id)
        if (!domainPos) return

        // Scale by domain scale
        const scale = 0.5

        let worldPosition: Vector3

        if (domain.dimensions.length === 1) {
          // 1D points: positioned on X-axis at Y=0.3, Z=0
          const dim = domain.dimensions[0]
          const pointDim = point.dimensions.find((d) => d.dimensionId === dim.id)
          const value = getPointValue(pointDim)
          if (value === undefined) return

          const [dimMin, dimMax] = dim.range
          const pos = -5 + ((value - dimMin) / (dimMax - dimMin)) * 10

          worldPosition = new Vector3(
            domainPos[0] + pos * scale,
            domainPos[1] + 0.3 * scale,
            domainPos[2]
          )
        } else if (domain.dimensions.length === 2) {
          // 2D points: positioned on XY plane (vertical)
          const dimX = domain.dimensions[0]
          const dimY = domain.dimensions[1]

          const pointDimX = point.dimensions.find((d) => d.dimensionId === dimX.id)
          const pointDimY = point.dimensions.find((d) => d.dimensionId === dimY.id)

          const valueX = getPointValue(pointDimX)
          const valueY = getPointValue(pointDimY)
          if (valueX === undefined || valueY === undefined) return

          const [dimMinX, dimMaxX] = dimX.range
          const [dimMinY, dimMaxY] = dimY.range

          const posX = -5 + ((valueX - dimMinX) / (dimMaxX - dimMinX)) * 10
          const posY = -5 + ((valueY - dimMinY) / (dimMaxY - dimMinY)) * 10

          worldPosition = new Vector3(
            domainPos[0] + posX * scale,
            domainPos[1] + posY * scale,
            domainPos[2]
          )
        } else {
          // 3D points: positioned in 3D space
          const values = domain.dimensions.map((dim) => {
            const pointDim = point.dimensions.find((d) => d.dimensionId === dim.id)
            const value = getPointValue(pointDim)
            if (value === undefined) return null

            const [dimMin, dimMax] = dim.range
            return -4 + ((value - dimMin) / (dimMax - dimMin)) * 8
          })

          if (values.some(v => v === null)) return

          worldPosition = new Vector3(
            domainPos[0] + values[0]! * scale,
            domainPos[1] + values[1]! * scale,
            domainPos[2] + values[2]! * scale
          )
        }

        positions.push({
          pointId: point.id,
          domainName: domain.name,
          pointName: point.name,
          position: worldPosition
        })
      })

      return {
        instance,
        positions,
        isSelected: state.selectedInstanceId === instance.id
      }
    }).filter(data => data.positions.length > 0)
  }, [instances, getInstancePoints, state.domains, state.selectedInstanceId, domainPositions])

  // Calculate label world positions and centroid
  const { labelPositions, conceptPosition } = useMemo(() => {
    const positions: Array<{ labelId: string; position: Vector3 }> = []

    // Helper to get range from label dimension (works for both region and point)
    const getLabelRange = (
      labelDim: typeof labels[0]['dimensions'][0] | undefined,
      dimRange: readonly [number, number]
    ): readonly [number, number] => {
      if (!labelDim) return dimRange
      if ('range' in labelDim) {
        return labelDim.range
      } else {
        // For points, use the value as both min and max
        return [labelDim.value, labelDim.value] as const
      }
    }

    labels.forEach((label) => {
      const domain = state.domains.find((d) => d.id === label.domainId)
      if (!domain) return

      // Skip 4D+ labels (can't visualize in 3D)
      if (domain.dimensions.length >= 4) return

      // Get domain position in world space
      const domainPos = domainPositions.get(domain.id)
      if (!domainPos) return

      // Scale by domain scale (0.5 or 0.55)
      const scale = state.selectedDomainId === domain.id ? 0.55 : 0.5

      let worldPosition: Vector3

      if (domain.dimensions.length === 1) {
        // 1D labels: positioned on X-axis at Y=0.3, Z=0
        // Size is 10, maps to -5 to +5 space
        const dim = domain.dimensions[0]
        const labelDim = label.dimensions.find((d) => d.dimensionId === dim.id)
        const labelRange = getLabelRange(labelDim, dim.range)
        const [dimMin, dimMax] = dim.range

        const minPos = -5 + ((labelRange[0] - dimMin) / (dimMax - dimMin)) * 10
        const maxPos = -5 + ((labelRange[1] - dimMin) / (dimMax - dimMin)) * 10
        const centerPos = (minPos + maxPos) / 2

        worldPosition = new Vector3(
          domainPos[0] + centerPos * scale,
          domainPos[1] + 0.3 * scale,
          domainPos[2]
        )
      } else if (domain.dimensions.length === 2) {
        // 2D labels: positioned on XY plane (vertical)
        // Size is 10x10, maps to -5 to +5 space
        const dimX = domain.dimensions[0]
        const dimY = domain.dimensions[1]

        const labelDimX = label.dimensions.find((d) => d.dimensionId === dimX.id)
        const labelDimY = label.dimensions.find((d) => d.dimensionId === dimY.id)

        const labelRangeX = getLabelRange(labelDimX, dimX.range)
        const labelRangeY = getLabelRange(labelDimY, dimY.range)

        const [dimMinX, dimMaxX] = dimX.range
        const [dimMinY, dimMaxY] = dimY.range

        const minX = -5 + ((labelRangeX[0] - dimMinX) / (dimMaxX - dimMinX)) * 10
        const maxX = -5 + ((labelRangeX[1] - dimMinX) / (dimMaxX - dimMinX)) * 10
        const minY = -5 + ((labelRangeY[0] - dimMinY) / (dimMaxY - dimMinY)) * 10
        const maxY = -5 + ((labelRangeY[1] - dimMinY) / (dimMaxY - dimMinY)) * 10

        const centerX = (minX + maxX) / 2
        const centerY = (minY + maxY) / 2

        worldPosition = new Vector3(
          domainPos[0] + centerX * scale,
          domainPos[1] + centerY * scale,
          domainPos[2]
        )
      } else {
        // 3D labels: positioned in 3D space
        // Size is 8x8x8, maps to -4 to +4 space
        const ranges = domain.dimensions.map((dim) => {
          const labelDim = label.dimensions.find((d) => d.dimensionId === dim.id)
          const labelRange = getLabelRange(labelDim, dim.range)
          const [dimMin, dimMax] = dim.range

          const min = -4 + ((labelRange[0] - dimMin) / (dimMax - dimMin)) * 8
          const max = -4 + ((labelRange[1] - dimMin) / (dimMax - dimMin)) * 8

          return { center: (min + max) / 2 }
        })

        worldPosition = new Vector3(
          domainPos[0] + ranges[0].center * scale,
          domainPos[1] + ranges[1].center * scale,
          domainPos[2] + ranges[2].center * scale
        )
      }

      positions.push({ labelId: label.id, position: worldPosition })
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
      // Default position if no labels (shouldn't happen with validation)
      centroid = new Vector3(0, 10, 0)
    }

    return {
      labelPositions: positions,
      conceptPosition: centroid,
    }
  }, [labels, state.domains, state.selectedDomainId, domainPositions])

  // If no valid labels to visualize, don't render
  if (labelPositions.length === 0) {
    return null
  }

  // Render both concept and instance visualization
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

      {/* Connection lines from concept to each label */}
      {labelPositions.map(({ labelId, position }) => (
        <Line
          key={labelId}
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

      {/* All instances visualization */}
      {allInstancesData.map(({ instance, positions, isSelected }, idx) => (
        <group key={instance.id}>
          {/* Instance name billboard */}
          <Billboard
            position={[0, 10 + idx * 2, 0]}
            onClick={(e: ThreeEvent<MouseEvent>) => {
              e.stopPropagation()
              selectInstance(instance.id)
            }}
            onPointerOver={() => { if (document.body.style) document.body.style.cursor = 'pointer' }}
            onPointerOut={() => { if (document.body.style) document.body.style.cursor = 'default' }}
          >
            {/* Background rectangle */}
            <mesh position={[0, 0, -0.01]}>
              <planeGeometry args={[instance.name.length * 1.2, 2.2]} />
              <meshBasicMaterial
                color={isSelected ? "#dbeafe" : "#eff6ff"}
                opacity={isSelected ? 0.95 : 0.85}
                transparent
              />
            </mesh>

            {/* Instance name */}
            <Text
              position={[0, 0, 0]}
              fontSize={1.8}
              color={isSelected ? "#3b82f6" : "#60a5fa"}
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.1}
              outlineColor="#000000"
              fillOpacity={1}
              fontWeight={isSelected ? "bold" : "normal"}
            >
              {instance.name}
            </Text>
          </Billboard>

          {/* Connection lines from instance to each point */}
          {positions.map(({ pointId, position }) => (
            <Line
              key={`instance-${instance.id}-${pointId}`}
              points={[
                [0, 10 + idx * 2, 0],
                [position.x, position.y, position.z],
              ]}
              color={isSelected ? '#3b82f6' : '#60a5fa'}
              lineWidth={isSelected ? 2 : 1.5}
              opacity={isSelected ? 0.5 : 0.3}
              transparent
            />
          ))}

          {/* Point markers */}
          {positions.map(({ pointId, domainName, pointName, position }) => (
            <group key={pointId}>
              {/* Point sphere */}
              <mesh position={position}>
                <sphereGeometry args={[0.3, 16, 16]} />
                <meshStandardMaterial
                  color="#3b82f6"
                  opacity={isSelected ? 1.0 : 0.7}
                  transparent={!isSelected}
                />
              </mesh>

              {/* Point label */}
              <Billboard position={[position.x, position.y + 1, position.z]}>
                <Text
                  fontSize={0.6}
                  color="#2563eb"
                  anchorX="center"
                  anchorY="middle"
                  outlineWidth={0.05}
                  outlineColor="#000000"
                  fillOpacity={isSelected ? 1.0 : 0.7}
                >
                  {pointName}
                </Text>
              </Billboard>
            </group>
          ))}

          {/* Connection lines between points */}
          {positions.map(({ pointId: pointId1, position: pos1 }, i) =>
            positions.slice(i + 1).map(({ pointId: pointId2, position: pos2 }) => (
              <Line
                key={`${pointId1}-${pointId2}`}
                points={[
                  [pos1.x, pos1.y, pos1.z],
                  [pos2.x, pos2.y, pos2.z],
                ]}
                color="#3b82f6"
                lineWidth={isSelected ? 2 : 1.5}
                opacity={isSelected ? 0.5 : 0.3}
                transparent
              />
            ))
          )}
        </group>
      ))}
    </group>
  )
}

// Custom comparison to prevent unnecessary re-renders
const areEqual = (prevProps: ConceptVisualization3DProps, nextProps: ConceptVisualization3DProps) => {
  return (
    prevProps.concept.id === nextProps.concept.id &&
    prevProps.concept.name === nextProps.concept.name &&
    JSON.stringify(prevProps.concept.labelRefs) === JSON.stringify(nextProps.concept.labelRefs)
  )
}

export default memo(ConceptVisualization3D, areEqual)
