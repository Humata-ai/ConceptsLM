/**
 * Visualization Constants
 * 
 * Centralized configuration for all visualization components
 */

/**
 * Layout configuration for domain positioning
 */
export const DOMAIN_LAYOUT = {
  /** Radius of the circular layout for domains */
  RADIUS: 15,
  /** Y-coordinate for domain positions */
  CENTER_Y: 0,
  /** Z-offset for domain positions */
  CENTER_Z: -15,
} as const

/**
 * Visualization sizes for different dimensionalities
 */
export const VISUALIZATION_SIZE = {
  /** Size for 1D visualizations (line length) */
  SIZE_1D: 10,
  /** Size for 2D visualizations (plane dimensions) */
  SIZE_2D: 10,
  /** Size for 3D visualizations (cube dimensions) */
  SIZE_3D: 10,
} as const

/**
 * Grid configuration for visualizations
 */
export const GRID = {
  /** Number of divisions for 1D grid */
  DIVISIONS_1D: 10,
  /** Number of divisions for 2D grid */
  DIVISIONS_2D: 10,
  /** Number of divisions for 3D grid */
  DIVISIONS_3D: 4,
} as const

/**
 * Scale factors for domains in different contexts
 */
export const DOMAIN_SCALE = {
  /** Scale for domain visualization in all-domains view */
  ALL_DOMAINS_VIEW: 0.55,
  /** Scale for domain visualization in single concept view */
  CONCEPT_VIEW: 0.5,
  /** Scale for label visualization */
  LABEL_VIEW: 1.0,
} as const

/**
 * Visual styling constants
 */
export const VISUAL_STYLE = {
  /** Text size for labels */
  TEXT_SIZE: 0.5,
  /** Text size for small labels */
  TEXT_SIZE_SMALL: 0.3,
  /** Opacity for region fills */
  REGION_OPACITY: 0.3,
  /** Opacity for selected regions */
  REGION_OPACITY_SELECTED: 0.5,
} as const

/**
 * Colors used in visualizations
 */
export const COLORS = {
  /** Default domain color */
  DOMAIN: '#60a5fa',
  /** Selected domain color */
  DOMAIN_SELECTED: '#2563eb',
  /** Region color */
  REGION: '#4ade80',
  /** Point color */
  POINT: '#f59e0b',
  /** Concept color */
  CONCEPT: '#a78bfa',
  /** Grid color */
  GRID: '#cbd5e1',
} as const
