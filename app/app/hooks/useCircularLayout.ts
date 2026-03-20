import { useMemo } from 'react'
import { calculateCircularLayout, calculateCircularLayoutMap } from '@/app/utils/positionCalculations'

/**
 * Hook for calculating circular layout positions
 * 
 * @param count - Number of items to arrange
 * @param radius - Radius of the circle
 * @param centerY - Y-coordinate for all items
 * @param centerZ - Z-offset to apply to all items
 * @returns Memoized array of positions
 */
export function useCircularLayout(
  count: number,
  radius: number = 15,
  centerY: number = 0,
  centerZ: number = -15
): Array<readonly [number, number, number]> {
  return useMemo(
    () => calculateCircularLayout(count, radius, centerY, centerZ),
    [count, radius, centerY, centerZ]
  )
}

/**
 * Hook for calculating circular layout positions as a Map
 * 
 * @param items - Items with id property
 * @param radius - Radius of the circle
 * @param centerY - Y-coordinate for all items
 * @param centerZ - Z-offset to apply to all items
 * @returns Memoized Map of id -> position
 */
export function useCircularLayoutMap<T extends { id: string }>(
  items: T[],
  radius: number = 15,
  centerY: number = 0,
  centerZ: number = -15
): Map<string, readonly [number, number, number]> {
  return useMemo(
    () => calculateCircularLayoutMap(items, radius, centerY, centerZ),
    [items, radius, centerY, centerZ]
  )
}
