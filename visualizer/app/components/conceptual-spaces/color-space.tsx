import * as THREE from 'three';
import { useMemo } from 'react';

interface ColorSpaceProps {
  position?: [number, number, number];
  highlightColor?: { r: number; g: number; b: number };
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
          data[index + 3] = 255;
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
  }, []);

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
      side: THREE.FrontSide,
    });
  }, [texture]);

  // Calculate highlight sphere position if color is provided
  const highlightPosition = useMemo(() => {
    if (!highlightColor) return null;
    // Map [0,1] RGB values to cube coordinates
    // Cube goes from [0,0,0] to [1,1,1], centered at [0.5, 0.5, 0.5]
    return [
      highlightColor.r,
      highlightColor.g,
      highlightColor.b,
    ] as [number, number, number];
  }, [highlightColor]);

  return (
    <group position={position}>
      {/* RGB Cube */}
      <mesh position={[0.5, 0.5, 0.5]} material={material}>
        <boxGeometry args={[1, 1, 1, 16, 16, 16]} />
      </mesh>

      {/* Highlight sphere at the item's color */}
      {highlightPosition && (
        <mesh position={[highlightPosition[0] + 0.5, highlightPosition[1] + 0.5, highlightPosition[2] + 0.5]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial
            color={new THREE.Color(highlightColor!.r, highlightColor!.g, highlightColor!.b)}
            emissive={new THREE.Color(highlightColor!.r, highlightColor!.g, highlightColor!.b)}
            emissiveIntensity={0.5}
          />
        </mesh>
      )}
    </group>
  );
}
