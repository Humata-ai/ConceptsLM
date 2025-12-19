'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useEffect, useState } from 'react';
import ShapeSpace from './conceptual-spaces/shape-space';
import TasteSpace from './conceptual-spaces/taste-space';
import ColorSpace from './conceptual-spaces/color-space';
import { loadOBJ, scaleMeshData, calculateBoundingBox } from '../utils/objParser';
import { MeshData } from '../utils/appleShape';
import { DictionaryItem } from '../types/dictionary';

interface ConceptualSpaceDefinitionProps {
  word: string;
  width?: string;
  height?: string;
  className?: string;
}

export default function ConceptualSpaceDefinition({
  word,
  width = '100vw',
  height = '100vh',
  className,
}: ConceptualSpaceDefinitionProps) {
  const [dictionaryData, setDictionaryData] = useState<DictionaryItem | null>(null);
  const [meshData, setMeshData] = useState<MeshData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadWord() {
      setLoading(true);
      setError(null);
      setDictionaryData(null);
      setMeshData(null);

      try {
        // Dynamic import of dictionary file
        const module = await import(`../dictionary/${word}.json`);
        const data = module.default as DictionaryItem;

        // Validate dictionary structure
        if (!data.shape || !data.taste || !data.color) {
          throw new Error(`Invalid dictionary format for "${word}"`);
        }

        setDictionaryData(data);

        // Load the OBJ file
        // Model: "Apple Fruit 3D" by Pixel (https://sketchfab.com/stefan.lengyel1)
        // Licensed under CC Attribution: https://creativecommons.org/licenses/by/4.0/
        // Source: https://sketchfab.com/3d-models/apple-fruit-3d-3cb3ac28e00940cca19f4d0566d34be5
        const mesh = await loadOBJ(data.shape.modelPath);

        // Check the bounding box to determine scale
        const bbox = calculateBoundingBox(mesh);
        console.log(`Original ${word} size:`, bbox.size);

        // Scale to target size from dictionary
        const currentSize = Math.max(...bbox.size);
        const targetSize = data.shape.targetSize;
        const scale = targetSize / currentSize;

        const scaledMesh = scaleMeshData(mesh, scale);
        const scaledBbox = calculateBoundingBox(scaledMesh);
        console.log(`Scaled ${word} size (${data.shape.unit}):`, scaledBbox.size);

        setMeshData(scaledMesh);
        setLoading(false);
      } catch (err: any) {
        console.error(`Error loading ${word}:`, err);

        if (err.code === 'MODULE_NOT_FOUND' || err.message?.includes('Cannot find module')) {
          setError(`Word "${word}" not found in dictionary`);
        } else if (err.message?.includes('Invalid dictionary format')) {
          setError(err.message);
        } else {
          setError(`Failed to load "${word}": ${err.message || 'Unknown error'}`);
        }

        setLoading(false);
      }
    }

    loadWord();
  }, [word]);

  // Loading state
  if (loading) {
    return (
      <div
        className={className}
        style={{
          width,
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          color: '#666',
        }}
      >
        Loading {word} definition...
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        className={className}
        style={{
          width,
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          fontSize: '1.5rem',
          color: '#ff0000',
          gap: '1rem',
        }}
      >
        <div>{error}</div>
        <div style={{ fontSize: '1rem', color: '#666' }}>
          Make sure {word}.json exists in the dictionary folder
        </div>
      </div>
    );
  }

  // Loaded state - render visualization
  if (!dictionaryData || !meshData) {
    return null;
  }

  return (
    <div className={className} style={{ width, height }}>
      <Canvas
        camera={{
          position: [0, 12, 25],
          fov: 50,
        }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={['white']} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={0.8} />

        <OrbitControls
          makeDefault
          target={[0, 3, 0]}
          enableDamping={true}
          dampingFactor={0.05}
          minDistance={10}
          maxDistance={60}
        />

        {/* Shape Space - Left */}
        <group position={[-12, 0, 0]} scale={0.5}>
          <ShapeSpace meshData={meshData} unit={dictionaryData.shape.unit} />
        </group>

        {/* Taste Space - Center */}
        <TasteSpace tasteValues={dictionaryData.taste} position={[0, 3, 0]} radius={3} />

        {/* Color Space - Right (scaled up) */}
        <group position={[12, 3, 0]} scale={5}>
          <ColorSpace highlightColor={dictionaryData.color} />
        </group>
      </Canvas>
    </div>
  );
}
