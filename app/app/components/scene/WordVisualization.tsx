import { memo, useMemo } from 'react'
import { Text, Billboard } from '@react-three/drei'
import type { Word } from '../shared/types'
import { WORD_CLASS_LABELS } from '../shared/types'

/**
 * Props for the WordVisualization component.
 * 
 * Renders a selected word in the 3D viewer.
 * Currently displays the word name, class, and definition as a centered billboard.
 * As words gain spatial/domain associations, this can be extended.
 */
export interface WordVisualizationProps {
  word: Word | null
}

function WordVisualization({ word }: WordVisualizationProps) {
  const centerPosition = useMemo(() => [0, 0, 0] as const, [])
  const emptyPosition = useMemo(() => [0, 0, 0] as const, [])

  if (!word) {
    return (
      <Text position={emptyPosition} fontSize={1.5} color="gray">
        Select a word from the library to visualize it.
      </Text>
    )
  }

  return (
    <group>
      {/* Word name - large centered text */}
      <Billboard position={centerPosition}>
        {/* Background */}
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[Math.max(word.name.length * 2.5, 20), 12]} />
          <meshBasicMaterial color="#f8fafc" opacity={0.9} transparent />
        </mesh>

        {/* Border */}
        <mesh position={[0, 0, -0.02]}>
          <planeGeometry args={[Math.max(word.name.length * 2.5, 20) + 0.3, 12.3]} />
          <meshBasicMaterial color="#e2e8f0" opacity={0.8} transparent />
        </mesh>

        {/* Word name */}
        <Text
          position={[0, 3, 0]}
          fontSize={3}
          color="#1e293b"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          {word.name}
        </Text>

        {/* Word class badge */}
        <Text
          position={[0, 0.5, 0]}
          fontSize={1.2}
          color="#64748b"
          anchorX="center"
          anchorY="middle"
        >
          {WORD_CLASS_LABELS[word.wordClass]}
        </Text>

        {/* Definition */}
        {word.definition && (
          <Text
            position={[0, -2.5, 0]}
            fontSize={1}
            color="#475569"
            anchorX="center"
            anchorY="middle"
            maxWidth={18}
          >
            {word.definition}
          </Text>
        )}
      </Billboard>
    </group>
  )
}

export default memo(WordVisualization)
