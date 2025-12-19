'use client';

import { useEffect, useState } from 'react';
import Viewer from './viewer';
import appleData from './dictionary/apple.json';
import { loadOBJ, scaleMeshData, calculateBoundingBox } from './utils/objParser';
import { MeshData } from './utils/appleShape';

export default function Home() {
  const [appleMesh, setAppleMesh] = useState<MeshData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadApple() {
      try {
        // Load the OBJ file
        // Model: "Apple Fruit 3D" by Pixel (https://sketchfab.com/stefan.lengyel1)
        // Licensed under CC Attribution: https://creativecommons.org/licenses/by/4.0/
        // Source: https://sketchfab.com/3d-models/apple-fruit-3d-3cb3ac28e00940cca19f4d0566d34be5
        const mesh = await loadOBJ(appleData.shape.modelPath);

        // Check the bounding box to determine scale
        const bbox = calculateBoundingBox(mesh);
        console.log('Original apple size:', bbox.size);

        // Scale to target size from dictionary
        const currentSize = Math.max(...bbox.size);
        const targetSize = appleData.shape.targetSize;
        const scale = targetSize / currentSize;

        const scaledMesh = scaleMeshData(mesh, scale);
        const scaledBbox = calculateBoundingBox(scaledMesh);
        console.log(`Scaled apple size (${appleData.shape.unit}):`, scaledBbox.size);

        setAppleMesh(scaledMesh);
        setLoading(false);
      } catch (error) {
        console.error('Error loading apple model:', error);
        setLoading(false);
      }
    }

    loadApple();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          color: '#666',
        }}
      >
        Loading {appleData.name} model...
      </div>
    );
  }

  if (!appleMesh) {
    return (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          color: '#ff0000',
        }}
      >
        Error loading {appleData.name} model
      </div>
    );
  }

  return <Viewer dictionaryData={appleData} meshData={appleMesh} />;
}
