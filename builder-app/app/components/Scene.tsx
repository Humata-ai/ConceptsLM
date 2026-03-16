'use client'

import { useEffect, useMemo, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import AllDomainsVisualization from './quality-domain/AllDomainsVisualization'
import { useQualityDomain } from './quality-domain/context/QualityDomainContext'
import { Vector3 } from 'three'

function CameraControls() {
  const { state, getConceptProperties } = useQualityDomain()
  const controlsRef = useRef<any>(null)
  const animatingRef = useRef(false)
  const startTargetRef = useRef(new Vector3(0, 0, 0))
  const endTargetRef = useRef(new Vector3(0, 0, 0))
  const startTimeRef = useRef(0)

  // Calculate position of selected item
  const targetPosition = useMemo(() => {
    // Calculate domain positions (same as AllDomainsVisualization)
    const radius = 15
    const total = state.domains.length
    const angleStep = (2 * Math.PI) / total

    const domainPositions = new Map<string, readonly [number, number, number]>()
    state.domains.forEach((domain, index) => {
      const angle = index * angleStep
      const x = radius * Math.cos(angle)
      const z = radius * Math.sin(angle) - 15
      domainPositions.set(domain.id, [x, 0, z] as const)
    })

    // If domain is selected
    if (state.selectedDomainId) {
      const pos = domainPositions.get(state.selectedDomainId)
      if (pos) return new Vector3(pos[0], pos[1], pos[2])
    }

    // If property is selected
    if (state.selectedPropertyId && state.selectedPropertyDomainId) {
      const domain = state.domains.find(d => d.id === state.selectedPropertyDomainId)
      const property = domain?.properties.find(p => p.id === state.selectedPropertyId)
      const domainPos = domainPositions.get(state.selectedPropertyDomainId)

      if (domain && property && domainPos) {
        const scale = 0.5

        if (domain.dimensions.length === 1) {
          // 1D property
          const dim = domain.dimensions[0]
          const propDim = property.dimensions.find(d => d.dimensionId === dim.id)
          const propRange = propDim?.range || dim.range
          const [dimMin, dimMax] = dim.range
          const minPos = -5 + ((propRange[0] - dimMin) / (dimMax - dimMin)) * 10
          const maxPos = -5 + ((propRange[1] - dimMin) / (dimMax - dimMin)) * 10
          const centerPos = (minPos + maxPos) / 2

          return new Vector3(
            domainPos[0] + centerPos * scale,
            domainPos[1] + 0.3 * scale,
            domainPos[2]
          )
        } else if (domain.dimensions.length === 2) {
          // 2D property
          const dimX = domain.dimensions[0]
          const dimY = domain.dimensions[1]
          const propDimX = property.dimensions.find(d => d.dimensionId === dimX.id)
          const propDimY = property.dimensions.find(d => d.dimensionId === dimY.id)
          const propRangeX = propDimX?.range || dimX.range
          const propRangeY = propDimY?.range || dimY.range
          const [dimMinX, dimMaxX] = dimX.range
          const [dimMinY, dimMaxY] = dimY.range

          const minX = -5 + ((propRangeX[0] - dimMinX) / (dimMaxX - dimMinX)) * 10
          const maxX = -5 + ((propRangeX[1] - dimMinX) / (dimMaxX - dimMinX)) * 10
          const minY = -5 + ((propRangeY[0] - dimMinY) / (dimMaxY - dimMinY)) * 10
          const maxY = -5 + ((propRangeY[1] - dimMinY) / (dimMaxY - dimMinY)) * 10

          const centerX = (minX + maxX) / 2
          const centerY = (minY + maxY) / 2

          return new Vector3(
            domainPos[0] + centerX * scale,
            domainPos[1] + centerY * scale,
            domainPos[2]
          )
        } else if (domain.dimensions.length === 3) {
          // 3D property
          const ranges = domain.dimensions.map(dim => {
            const propDim = property.dimensions.find(d => d.dimensionId === dim.id)
            const propRange = propDim?.range || dim.range
            const [dimMin, dimMax] = dim.range
            const min = -4 + ((propRange[0] - dimMin) / (dimMax - dimMin)) * 8
            const max = -4 + ((propRange[1] - dimMin) / (dimMax - dimMin)) * 8
            return { center: (min + max) / 2 }
          })

          return new Vector3(
            domainPos[0] + ranges[0].center * scale,
            domainPos[1] + ranges[1].center * scale,
            domainPos[2] + ranges[2].center * scale
          )
        }
      }
    }

    // If concept is selected
    if (state.selectedConceptId) {
      const concept = state.concepts.find(c => c.id === state.selectedConceptId)
      if (concept) {
        const properties = getConceptProperties(concept.id)
        const positions: Vector3[] = []

        properties.forEach(property => {
          const domain = state.domains.find(d => d.id === property.domainId)
          if (!domain || domain.dimensions.length >= 4) return

          const domainPos = domainPositions.get(domain.id)
          if (!domainPos) return

          const scale = 0.5

          if (domain.dimensions.length === 1) {
            const dim = domain.dimensions[0]
            const propDim = property.dimensions.find(d => d.dimensionId === dim.id)
            const propRange = propDim?.range || dim.range
            const [dimMin, dimMax] = dim.range
            const minPos = -5 + ((propRange[0] - dimMin) / (dimMax - dimMin)) * 10
            const maxPos = -5 + ((propRange[1] - dimMin) / (dimMax - dimMin)) * 10
            const centerPos = (minPos + maxPos) / 2

            positions.push(new Vector3(
              domainPos[0] + centerPos * scale,
              domainPos[1] + 0.3 * scale,
              domainPos[2]
            ))
          } else if (domain.dimensions.length === 2) {
            const dimX = domain.dimensions[0]
            const dimY = domain.dimensions[1]
            const propDimX = property.dimensions.find(d => d.dimensionId === dimX.id)
            const propDimY = property.dimensions.find(d => d.dimensionId === dimY.id)
            const propRangeX = propDimX?.range || dimX.range
            const propRangeY = propDimY?.range || dimY.range
            const [dimMinX, dimMaxX] = dimX.range
            const [dimMinY, dimMaxY] = dimY.range

            const minX = -5 + ((propRangeX[0] - dimMinX) / (dimMaxX - dimMinX)) * 10
            const maxX = -5 + ((propRangeX[1] - dimMinX) / (dimMaxX - dimMinX)) * 10
            const minY = -5 + ((propRangeY[0] - dimMinY) / (dimMaxY - dimMinY)) * 10
            const maxY = -5 + ((propRangeY[1] - dimMinY) / (dimMaxY - dimMinY)) * 10

            const centerX = (minX + maxX) / 2
            const centerY = (minY + maxY) / 2

            positions.push(new Vector3(
              domainPos[0] + centerX * scale,
              domainPos[1] + centerY * scale,
              domainPos[2]
            ))
          } else if (domain.dimensions.length === 3) {
            const ranges = domain.dimensions.map(dim => {
              const propDim = property.dimensions.find(d => d.dimensionId === dim.id)
              const propRange = propDim?.range || dim.range
              const [dimMin, dimMax] = dim.range
              const min = -4 + ((propRange[0] - dimMin) / (dimMax - dimMin)) * 8
              const max = -4 + ((propRange[1] - dimMin) / (dimMax - dimMin)) * 8
              return { center: (min + max) / 2 }
            })

            positions.push(new Vector3(
              domainPos[0] + ranges[0].center * scale,
              domainPos[1] + ranges[1].center * scale,
              domainPos[2] + ranges[2].center * scale
            ))
          }
        })

        // Calculate centroid of concept
        if (positions.length > 0) {
          const centroid = new Vector3(0, 0, 0)
          positions.forEach(pos => centroid.add(pos))
          centroid.divideScalar(positions.length)
          centroid.y += 8 // Concept label is 8 units above centroid
          return centroid
        }
      }
    }

    // Default position
    return new Vector3(0, 0, 0)
  }, [state.selectedDomainId, state.selectedPropertyId, state.selectedPropertyDomainId, state.selectedConceptId, state.domains, state.concepts, getConceptProperties])

  // Update controls target when selection changes with smooth animation
  useEffect(() => {
    if (!controlsRef.current) return

    // Start animation
    startTargetRef.current.copy(controlsRef.current.target)
    endTargetRef.current.copy(targetPosition)
    startTimeRef.current = performance.now()
    animatingRef.current = true

    const animate = () => {
      if (!animatingRef.current || !controlsRef.current) return

      const elapsed = performance.now() - startTimeRef.current
      const duration = 300 // 300ms animation
      const progress = Math.min(elapsed / duration, 1)

      // Ease-out cubic for smooth deceleration
      const easeProgress = 1 - Math.pow(1 - progress, 3)

      // Interpolate between start and end positions
      controlsRef.current.target.lerpVectors(
        startTargetRef.current,
        endTargetRef.current,
        easeProgress
      )
      controlsRef.current.update()

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        animatingRef.current = false
      }
    }

    requestAnimationFrame(animate)

    return () => {
      animatingRef.current = false
    }
  }, [targetPosition])

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping={false}
      enableZoom
      zoomToCursor
      enablePan
      makeDefault
    />
  )
}

export default function Scene() {
  return (
    <div className="w-full h-screen">
      <Canvas
        camera={{ position: [0, 0, 60], fov: 50, near: 0.1, far: 1000 }}
        style={{ background: 'white' }}
        frameloop="always"
        gl={{ logarithmicDepthBuffer: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={0.8} />
        <AllDomainsVisualization />
        <CameraControls />
      </Canvas>
    </div>
  )
}
