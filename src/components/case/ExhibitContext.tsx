'use client'

import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { generatePalette, getBrandColorForCompany, type ColorPalette } from '@/lib/colors'

/**
 * Exhibit Theme Context
 * 
 * Provides brand-derived color palette to all exhibit components.
 * Inspired by publication-quality design from The Economist and NY Times.
 */

interface ExhibitTheme {
  palette: ColorPalette
  brandColor: string | null
  companyName: string
}

const ExhibitContext = createContext<ExhibitTheme | null>(null)

interface ExhibitProviderProps {
  children: ReactNode
  brandColor?: string | null
  companyName?: string
}

export function ExhibitProvider({ 
  children, 
  brandColor, 
  companyName = '' 
}: ExhibitProviderProps) {
  const theme = useMemo(() => {
    // Try to use provided brand color, fallback to company lookup
    const effectiveBrandColor = brandColor || getBrandColorForCompany(companyName) || null
    
    return {
      palette: generatePalette(effectiveBrandColor || undefined),
      brandColor: effectiveBrandColor,
      companyName,
    }
  }, [brandColor, companyName])

  return (
    <ExhibitContext.Provider value={theme}>
      {children}
    </ExhibitContext.Provider>
  )
}

/**
 * Hook to access the exhibit theme
 */
export function useExhibitTheme(): ExhibitTheme {
  const context = useContext(ExhibitContext)
  
  if (!context) {
    // Return default theme if used outside provider
    return {
      palette: generatePalette(),
      brandColor: null,
      companyName: '',
    }
  }
  
  return context
}

/**
 * Hook to get just the color palette
 */
export function useExhibitPalette(): ColorPalette {
  return useExhibitTheme().palette
}


