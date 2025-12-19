'use client';

import { useEffect, useState } from 'react';
import UnifiedVisualization from './components/UnifiedVisualization';
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
        const mesh = await loadOBJ('/models/apple.obj');

        // Check the bounding box to determine scale
        const bbox = calculateBoundingBox(mesh);
        console.log('Original apple size:', bbox.size);

        // Scale to approximately 7.5cm (assuming original is in different units)
        // If the model is roughly 1 unit across, scale to 7.5cm
        const currentSize = Math.max(...bbox.size);
        const targetSize = 7.5; // cm
        const scale = targetSize / currentSize;

        const scaledMesh = scaleMeshData(mesh, scale);
        const scaledBbox = calculateBoundingBox(scaledMesh);
        console.log('Scaled apple size (cm):', scaledBbox.size);

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
        Loading apple model...
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
        Error loading apple model
      </div>
    );
  }

  return (
    <UnifiedVisualization
      appleMesh={appleMesh}
      tasteValues={{
        sweet: 0.75,
        sour: 0.55,
        salty: 0.05,
        bitter: 0.08,
        umami: 0.06,
      }}
    />
  );
}
