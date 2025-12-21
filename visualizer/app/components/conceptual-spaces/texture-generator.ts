import * as THREE from 'three';
import { isPointInMesh } from '../../utils/pointInMesh';
import type { LoadedMesh } from './types';
import { TEXTURE_SIZE } from './constants';
import { voxelToWorldPosition, worldCoordToRGB } from './coordinate-utils';

const OPAQUE_ALPHA = 255;
const TRANSPARENT_ALPHA = 26;

function isVoxelInAnyMesh(
  voxelPos: [number, number, number],
  meshes: LoadedMesh[]
): boolean {
  return meshes.some((mesh) =>
    isPointInMesh(voxelPos, mesh.meshData, mesh.bbox)
  );
}

function calculateAlpha(
  worldPos: [number, number, number],
  meshes: LoadedMesh[]
): number {
  if (meshes.length === 0) {
    return OPAQUE_ALPHA;
  }

  const inAnyMesh = isVoxelInAnyMesh(worldPos, meshes);

  return inAnyMesh ? OPAQUE_ALPHA : TRANSPARENT_ALPHA;
}

function fillVoxelData(
  data: Uint8Array,
  x: number,
  y: number,
  z: number,
  size: number,
  meshes: LoadedMesh[]
): void {
  const index = (z * size * size + y * size + x) * 4;

  // Convert voxel indices to world coordinates (0-255 space)
  const worldPos = voxelToWorldPosition(x, y, z, size);

  // World coordinates ARE the RGB values (direct mapping!)
  const [r, g, b] = worldCoordToRGB(...worldPos);

  // Check if this world position is inside any mesh
  const alpha = calculateAlpha(worldPos, meshes);

  data[index] = r;
  data[index + 1] = g;
  data[index + 2] = b;
  data[index + 3] = alpha;
}

function generateTextureData(meshes: LoadedMesh[]): Uint8Array {
  const size = TEXTURE_SIZE;
  const data = new Uint8Array(size * size * size * 4);

  for (let z = 0; z < size; z++) {
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        fillVoxelData(data, x, y, z, size, meshes);
      }
    }
  }

  return data;
}

function createTexture3D(data: Uint8Array): THREE.Data3DTexture {
  const size = TEXTURE_SIZE;
  const texture = new THREE.Data3DTexture(data, size, size, size);

  texture.format = THREE.RGBAFormat;
  texture.type = THREE.UnsignedByteType;
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.wrapR = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;

  return texture;
}

export function generateColorSpaceTexture(meshes: LoadedMesh[]): THREE.Data3DTexture {
  const data = generateTextureData(meshes);
  return createTexture3D(data);
}
