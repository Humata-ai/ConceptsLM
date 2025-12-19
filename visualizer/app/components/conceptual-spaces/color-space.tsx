import * as THREE from 'three';
import { useMemo } from 'react';

interface ColorSpaceProps {
  position?: [number, number, number];
  highlightColor?: {
    colorRegion?: {
      min: { r: number; g: number; b: number };
      max: { r: number; g: number; b: number };
    };
  };
}

export default function ColorSpace({
  position = [0, 0, 0],
  highlightColor,
}: ColorSpaceProps) {
  const texture = useMemo(() => {
    const size = 64;
    const data = new Uint8Array(size * size * size * 4);

    for (let z = 0; z < size; z++) {
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const index = (z * size * size + y * size + x) * 4;
          data[index] = (x / (size - 1)) * 255;
          data[index + 1] = (y / (size - 1)) * 255;
          data[index + 2] = (z / (size - 1)) * 255;

          // Alpha channel - calculate based on color region bounds
          if (highlightColor?.colorRegion) {
            // Normalize voxel position to 0-1 range
            const voxelR = x / (size - 1);
            const voxelG = y / (size - 1);
            const voxelB = z / (size - 1);

            // Check if voxel is within the min/max bounds
            const inRegion = (
              voxelR >= highlightColor.colorRegion.min.r &&
              voxelR <= highlightColor.colorRegion.max.r &&
              voxelG >= highlightColor.colorRegion.min.g &&
              voxelG <= highlightColor.colorRegion.max.g &&
              voxelB >= highlightColor.colorRegion.min.b &&
              voxelB <= highlightColor.colorRegion.max.b
            );

            // Set alpha: 255 (opaque) inside region, 26 (0.1 opacity) outside
            data[index + 3] = inRegion ? 255 : 26;
          } else {
            // Backward compatibility: fully opaque if no region defined
            data[index + 3] = 255;
          }
        }
      }
    }

    const texture3D = new THREE.Data3DTexture(data, size, size, size);
    texture3D.format = THREE.RGBAFormat;
    texture3D.type = THREE.UnsignedByteType;
    texture3D.minFilter = THREE.LinearFilter;
    texture3D.magFilter = THREE.LinearFilter;
    texture3D.needsUpdate = true;

    return texture3D;
  }, [highlightColor]);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        colorTexture: { value: texture },
      },
      vertexShader: `
        varying vec3 vPosition;

        void main() {
          vPosition = position + 0.5;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform highp sampler3D colorTexture;
        varying vec3 vPosition;

        void main() {
          gl_FragColor = texture(colorTexture, vPosition);
        }
      `,
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false,
    });
  }, [texture]);


  // Calculate colorRegion box geometry if region is defined
  const regionBox = useMemo(() => {
    if (!highlightColor?.colorRegion) return null;

    const { min, max } = highlightColor.colorRegion;

    // Calculate dimensions and center position in 0-1 space
    const width = max.r - min.r;
    const height = max.g - min.g;
    const depth = max.b - min.b;

    // Center in 0-1 color space (same as full cube coordinates)
    const centerX = (min.r + max.r) / 2;
    const centerY = (min.g + max.g) / 2;
    const centerZ = (min.b + max.b) / 2;

    return {
      position: [centerX, centerY, centerZ] as [number, number, number],
      scale: [width, height, depth] as [number, number, number],
      min,
      max,
    };
  }, [highlightColor]);

  // Create material for the colorRegion box
  const regionMaterial = useMemo(() => {
    if (!regionBox) return null;

    return new THREE.ShaderMaterial({
      uniforms: {
        colorTexture: { value: texture },
        regionMin: { value: new THREE.Vector3(regionBox.min.r, regionBox.min.g, regionBox.min.b) },
        regionMax: { value: new THREE.Vector3(regionBox.max.r, regionBox.max.g, regionBox.max.b) },
      },
      vertexShader: `
        varying vec3 vPosition;

        void main() {
          vPosition = position + 0.5;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform highp sampler3D colorTexture;
        uniform vec3 regionMin;
        uniform vec3 regionMax;
        varying vec3 vPosition;

        void main() {
          // Map position to region coordinates
          vec3 regionCoord = regionMin + vPosition * (regionMax - regionMin);
          gl_FragColor = texture(colorTexture, regionCoord);
        }
      `,
      side: THREE.DoubleSide,
      transparent: false,
    });
  }, [texture, regionBox]);

  return (
    <group position={position}>
      {/* Full RGB Cube (mostly transparent) */}
      <mesh position={[0.5, 0.5, 0.5]} material={material}>
        <boxGeometry args={[1, 1, 1, 16, 16, 16]} />
      </mesh>

      {/* ColorRegion box (opaque, shows gradient) */}
      {regionBox && regionMaterial && (
        <mesh position={regionBox.position} scale={regionBox.scale} material={regionMaterial}>
          <boxGeometry args={[1, 1, 1, 16, 16, 16]} />
        </mesh>
      )}
    </group>
  );
}
