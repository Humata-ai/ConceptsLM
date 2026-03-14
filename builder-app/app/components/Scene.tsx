'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Box } from '@react-three/drei'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'

function RotatingBox() {
  const meshRef = useRef<Mesh>(null)

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5
      meshRef.current.rotation.y += delta * 0.3
    }
  })

  return (
    <Box ref={meshRef} args={[2, 2, 2]}>
      <meshStandardMaterial color="hotpink" />
    </Box>
  )
}

export default function Scene() {
  return (
    <div className="w-full h-screen">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <RotatingBox />
        <OrbitControls />
      </Canvas>
    </div>
  )
}
