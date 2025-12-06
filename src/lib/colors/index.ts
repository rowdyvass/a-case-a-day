import chroma from 'chroma-js'

/**
 * Color Palette System for Exhibits
 * 
 * Generates harmonious color palettes from a brand color using color theory.
 * Inspired by The Economist, NY Times, and Bloomberg visual design.
 */

export interface ColorPalette {
  // Brand colors
  primary: string
  primaryLight: string
  primaryDark: string
  
  // Complementary/secondary colors
  secondary: string
  secondaryLight: string
  
  // Accent for highlights
  accent: string
  accentLight: string
  
  // Chart scale colors (derived from brand)
  scale: string[]
  
  // Semantic colors (always consistent for data meaning)
  positive: string
  positiveLight: string
  negative: string
  negativeLight: string
  neutral: string
  neutralLight: string
  
  // Neutrals for text and backgrounds
  text: string
  textMuted: string
  textSubtle: string
  background: string
  backgroundAlt: string
  border: string
  borderSubtle: string
  
  // Chart-specific
  gridLine: string
  axisLine: string
  tooltipBg: string
  annotationBg: string
}

// Default brand color if none provided
const DEFAULT_BRAND_COLOR = '#1a1a2e'

// Semantic colors - these stay consistent regardless of brand
const SEMANTIC_COLORS = {
  positive: '#059669',      // Emerald-600
  positiveLight: '#d1fae5', // Emerald-100
  negative: '#dc2626',      // Red-600
  negativeLight: '#fee2e2', // Red-100
  neutral: '#d97706',       // Amber-600
  neutralLight: '#fef3c7',  // Amber-100
}

/**
 * Generate a complete color palette from a brand color
 */
export function generatePalette(brandColor: string = DEFAULT_BRAND_COLOR): ColorPalette {
  // Validate and normalize the brand color
  let baseColor: chroma.Color
  try {
    baseColor = chroma(brandColor)
  } catch {
    baseColor = chroma(DEFAULT_BRAND_COLOR)
  }
  
  // Ensure sufficient saturation for a good palette
  const [h, s, l] = baseColor.hsl()
  const saturatedBase = s < 0.2 
    ? chroma.hsl(h || 220, 0.5, Math.min(l, 0.4))
    : baseColor
  
  // Generate complementary color (opposite on color wheel)
  const complementaryHue = ((saturatedBase.get('hsl.h') || 0) + 180) % 360
  const secondary = chroma.hsl(complementaryHue, 0.45, 0.45)
  
  // Generate accent (split-complementary, 150° from base)
  const accentHue = ((saturatedBase.get('hsl.h') || 0) + 150) % 360
  const accent = chroma.hsl(accentHue, 0.55, 0.50)
  
  // Generate scale colors for charts (analogous + complementary mix)
  const scale = generateChartScale(saturatedBase)
  
  return {
    // Brand colors
    primary: saturatedBase.hex(),
    primaryLight: saturatedBase.luminance(0.85).hex(),
    primaryDark: saturatedBase.darken(1).hex(),
    
    // Secondary
    secondary: secondary.hex(),
    secondaryLight: secondary.luminance(0.85).hex(),
    
    // Accent
    accent: accent.hex(),
    accentLight: accent.luminance(0.85).hex(),
    
    // Chart scale
    scale,
    
    // Semantic (consistent)
    ...SEMANTIC_COLORS,
    
    // Neutrals
    text: '#0f172a',          // Slate-900
    textMuted: '#475569',     // Slate-600
    textSubtle: '#94a3b8',    // Slate-400
    background: '#ffffff',
    backgroundAlt: '#f8fafc', // Slate-50
    border: '#e2e8f0',        // Slate-200
    borderSubtle: '#f1f5f9',  // Slate-100
    
    // Chart-specific
    gridLine: '#e2e8f0',
    axisLine: '#cbd5e1',
    tooltipBg: '#ffffff',
    annotationBg: 'rgba(255, 255, 255, 0.95)',
  }
}

/**
 * Generate a series of chart colors that work together
 */
function generateChartScale(baseColor: chroma.Color): string[] {
  const baseHue = baseColor.get('hsl.h') || 220
  const baseSat = baseColor.get('hsl.s') || 0.5
  
  // Create 8 harmonious colors using golden angle distribution
  const goldenAngle = 137.5
  const colors: string[] = []
  
  for (let i = 0; i < 8; i++) {
    const hue = (baseHue + i * goldenAngle) % 360
    const saturation = Math.max(0.35, Math.min(0.65, baseSat + (i % 2 === 0 ? 0.05 : -0.05)))
    const lightness = 0.45 + (i % 3) * 0.05
    colors.push(chroma.hsl(hue, saturation, lightness).hex())
  }
  
  // Put the brand color first
  colors[0] = baseColor.hex()
  
  return colors
}

/**
 * Get a contrasting text color for a given background
 */
export function getContrastColor(backgroundColor: string): string {
  try {
    const bg = chroma(backgroundColor)
    return bg.luminance() > 0.5 ? '#0f172a' : '#ffffff'
  } catch {
    return '#0f172a'
  }
}

/**
 * Interpolate between two colors to create a gradient scale
 */
export function interpolateColors(
  startColor: string,
  endColor: string,
  steps: number
): string[] {
  try {
    return chroma.scale([startColor, endColor]).mode('lab').colors(steps)
  } catch {
    return Array(steps).fill(startColor)
  }
}

/**
 * Adjust the lightness of a color (for hover states, etc.)
 * @param amount - positive to lighten, negative to darken
 */
export function adjustLightness(color: string, amount: number): string {
  try {
    const c = chroma(color)
    return amount > 0 ? c.brighten(amount).hex() : c.darken(-amount).hex()
  } catch {
    return color
  }
}

/**
 * Create a sequential color scale for heatmaps and gradients
 */
export function createSequentialScale(
  palette: ColorPalette,
  steps: number = 9
): string[] {
  return chroma
    .scale([palette.primaryLight, palette.primary, palette.primaryDark])
    .mode('lab')
    .colors(steps)
}

/**
 * Create a diverging color scale (for data with a meaningful midpoint)
 */
export function createDivergingScale(
  palette: ColorPalette,
  steps: number = 9
): string[] {
  return chroma
    .scale([palette.negative, '#f8fafc', palette.positive])
    .mode('lab')
    .colors(steps)
}

/**
 * Get a color with adjusted opacity
 */
export function withOpacity(color: string, opacity: number): string {
  try {
    return chroma(color).alpha(opacity).css()
  } catch {
    return color
  }
}

/**
 * Check if a color is light or dark
 */
export function isLightColor(color: string): boolean {
  try {
    return chroma(color).luminance() > 0.5
  } catch {
    return true
  }
}

/**
 * Mix two colors together
 */
export function mixColors(color1: string, color2: string, ratio: number = 0.5): string {
  try {
    return chroma.mix(color1, color2, ratio, 'lab').hex()
  } catch {
    return color1
  }
}

/**
 * Default palette for cases without a brand color
 */
export const defaultPalette = generatePalette(DEFAULT_BRAND_COLOR)

/**
 * Common brand colors for well-known companies
 * Used as fallback when AI extraction isn't available
 */
export const KNOWN_BRAND_COLORS: Record<string, string> = {
  // Tech
  'apple': '#000000',
  'google': '#4285F4',
  'microsoft': '#00A4EF',
  'amazon': '#FF9900',
  'meta': '#0866FF',
  'facebook': '#1877F2',
  'netflix': '#E50914',
  'spotify': '#1DB954',
  'uber': '#000000',
  'airbnb': '#FF5A5F',
  'slack': '#4A154B',
  'salesforce': '#00A1E0',
  'adobe': '#FF0000',
  'ibm': '#0530AD',
  'oracle': '#F80000',
  'intel': '#0071C5',
  'nvidia': '#76B900',
  'tesla': '#CC0000',
  
  // Finance
  'jpmorgan': '#003B70',
  'goldman sachs': '#7399C6',
  'morgan stanley': '#002B49',
  'visa': '#1A1F71',
  'mastercard': '#EB001B',
  'paypal': '#003087',
  'stripe': '#635BFF',
  
  // Retail
  'walmart': '#0071CE',
  'target': '#CC0000',
  'costco': '#E31837',
  'nike': '#111111',
  'adidas': '#000000',
  'starbucks': '#00704A',
  'mcdonalds': '#FFC72C',
  
  // Automotive
  'ford': '#003478',
  'gm': '#0170CE',
  'toyota': '#EB0A1E',
  'volkswagen': '#001E50',
  'bmw': '#0066B1',
  'mercedes': '#333333',
  
  // Healthcare
  'pfizer': '#0093D0',
  'johnson & johnson': '#D51900',
  'unitedhealth': '#002677',
  
  // Media
  'disney': '#113CCF',
  'warner bros': '#004B87',
  'nbc': '#F37021',
  'cnn': '#CC0000',
}

/**
 * Try to get a brand color for a company name
 */
export function getBrandColorForCompany(companyName: string): string | null {
  const normalized = companyName.toLowerCase().trim()
  
  // Direct match
  if (KNOWN_BRAND_COLORS[normalized]) {
    return KNOWN_BRAND_COLORS[normalized]
  }
  
  // Partial match
  for (const [company, color] of Object.entries(KNOWN_BRAND_COLORS)) {
    if (normalized.includes(company) || company.includes(normalized)) {
      return color
    }
  }
  
  return null
}


