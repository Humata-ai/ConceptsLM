/**
 * Position Calculation Utilities
 * 
 * Shared utilities for calculating positions in 3D space
 */

/**
 * Calculate positions for items arranged in a circle
 * 
 * @param count - Number of items to arrange
 * @param radius - Radius of the circle
 * @param centerY - Y-coordinate for all items
 * @param centerZ - Z-offset to apply to all items
 * @returns Array of [x, y, z] positions
 */
export function calculateCircularLayout(
  count: number,
  radius: number,
  centerY: number = 0,
  centerZ: number = -15
): Array<readonly [number, number, number]> {
  if (count === 0) return []
  
  const angleStep = (2 * Math.PI) / count
  
  return Array.from({ length: count }, (_, index) => {
    const angle = index * angleStep
    const x = radius * Math.cos(angle)
    const z = radius * Math.sin(angle) + centerZ
    return [x, centerY, z] as const
  })
}

/**
 * Calculate positions as a Map keyed by ID
 * 
 * @param items - Items with id property
 * @param radius - Radius of the circle
 * @param centerY - Y-coordinate for all items
 * @param centerZ - Z-offset to apply to all items
 * @returns Map of id -> [x, y, z] position
 */
export function calculateCircularLayoutMap<T extends { id: string }>(
  items: T[],
  radius: number,
  centerY: number = 0,
  centerZ: number = -15
): Map<string, readonly [number, number, number]> {
  const positions = new Map<string, readonly [number, number, number]>()
  const angleStep = (2 * Math.PI) / items.length
  
  items.forEach((item, index) => {
    const angle = index * angleStep
    const x = radius * Math.cos(angle)
    const z = radius * Math.sin(angle) + centerZ
    positions.set(item.id, [x, centerY, z] as const)
  })
  
  return positions
}

/**
 * Normalize a value from a source range to a target range
 * 
 * @param value - The value to normalize
 * @param sourceRange - The original range [min, max]
 * @param targetRange - The target range [min, max]
 * @returns Normalized value in target range
 */
export function normalizeToRange(
  value: number,
  sourceRange: readonly [number, number],
  targetRange: readonly [number, number]
): number {
  const [sourceMin, sourceMax] = sourceRange
  const [targetMin, targetMax] = targetRange
  
  // Handle edge case where source range has no spread
  if (sourceMax === sourceMin) {
    return (targetMin + targetMax) / 2
  }
  
  const normalized = (value - sourceMin) / (sourceMax - sourceMin)
  return targetMin + normalized * (targetMax - targetMin)
}

/**
 * Normalize a dimension value to visualization space
 * 
 * Common pattern: normalize to range [-5, 5] which gives a size of 10
 * 
 * @param value - The dimension value
 * @param dimensionRange - The dimension's [min, max] range
 * @param visualizationSize - Size of the visualization space (default: 10)
 * @returns Position in visualization space
 */
export function normalizeDimensionValue(
  value: number,
  dimensionRange: readonly [number, number],
  visualizationSize: number = 10
): number {
  const halfSize = visualizationSize / 2
  return normalizeToRange(value, dimensionRange, [-halfSize, halfSize])
}
