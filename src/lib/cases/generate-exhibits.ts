import type { AIProvider, CaseContent, Exhibit } from './types'
import { validateCustomExhibit } from '@/lib/exhibits/custom-exhibit-schema'
import {
  getVarietyGuidance,
  analyzeExhibitVariety,
  getVarietySummary,
} from '@/lib/exhibits/variety'
import type { ExhibitPhaseResult } from './types'

const MAX_EXHIBIT_RETRIES = 2

/**
 * Check if an exhibit has valid data
 */
function hasValidData(exhibit: Exhibit): boolean {
  if (!exhibit.data) return false
  if (typeof exhibit.data === 'object' && Object.keys(exhibit.data).length === 0) return false
  if (typeof exhibit.data === 'string' && exhibit.data.trim() === '') return false
  return true
}

/**
 * Run the exhibit generation phase with retry logic for missing data
 */
export async function runExhibitGenerationPhase(
  provider: AIProvider,
  caseContent: CaseContent
): Promise<ExhibitPhaseResult> {
  // Get variety guidance from recent cases
  const varietyGuidance = await getVarietyGuidance()

  // Generate exhibits with variety awareness
  let rawExhibits = await provider.generateExhibits(caseContent, varietyGuidance)

  // Check for exhibits with missing data and retry if needed
  let retryCount = 0
  while (retryCount < MAX_EXHIBIT_RETRIES) {
    const exhibitsWithMissingData = rawExhibits.filter((e) => !hasValidData(e))
    
    if (exhibitsWithMissingData.length === 0) {
      break // All exhibits have data
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(
        `Retry ${retryCount + 1}: ${exhibitsWithMissingData.length} exhibits missing data:`,
        exhibitsWithMissingData.map((e) => e.title)
      )
    }

    // Regenerate all exhibits (the AI should produce complete data on retry)
    const regeneratedExhibits = await provider.generateExhibits(caseContent, varietyGuidance)
    
    // Merge: keep valid exhibits from original, replace missing-data exhibits with regenerated ones
    rawExhibits = rawExhibits.map((originalExhibit) => {
      if (hasValidData(originalExhibit)) {
        return originalExhibit // Keep the valid one
      }
      // Try to find a matching regenerated exhibit by title or type
      const replacement = regeneratedExhibits.find(
        (regen) =>
          hasValidData(regen) &&
          (regen.title === originalExhibit.title || regen.type === originalExhibit.type)
      )
      return replacement && hasValidData(replacement) ? replacement : originalExhibit
    })

    retryCount++
  }

  // Final validation: filter out any exhibits still missing data
  const exhibitsWithData = rawExhibits.filter((exhibit) => {
    if (!hasValidData(exhibit)) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Exhibit "${exhibit.title}" still missing data after ${MAX_EXHIBIT_RETRIES} retries, removing`)
      }
      return false
    }
    return true
  })

  // Validate and filter custom exhibits
  const exhibits = validateAndFilterExhibits(exhibitsWithData)

  // Analyze variety of generated exhibits
  const varietyAnalysis = analyzeExhibitVariety(
    exhibits.map((e) => ({ type: e.type, title: e.title })),
    varietyGuidance.stats
  )

  // Log variety summary in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`Exhibit variety: ${getVarietySummary(varietyAnalysis)}`)
    if (varietyAnalysis.warnings.length > 0) {
      console.log('Variety warnings:', varietyAnalysis.warnings)
    }
  }

  return {
    exhibits,
    varietyScore: varietyAnalysis.score,
    warnings: varietyAnalysis.warnings,
  }
}

/**
 * Validates all exhibits and filters out invalid custom exhibits.
 * Library exhibits pass through; custom exhibits are validated against guardrails.
 */
function validateAndFilterExhibits(exhibits: Exhibit[]): Exhibit[] {
  return exhibits.filter((exhibit) => {
    // Library exhibits pass through without validation
    if (exhibit.type !== 'custom_interactive') {
      return true
    }

    // Validate custom exhibits
    const validation = validateCustomExhibit(exhibit.data)

    if (!validation.valid) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          `Custom exhibit "${exhibit.title}" failed validation:`,
          validation.errors
        )
      }
      // Filter out invalid custom exhibits
      return false
    }

    if (validation.warnings.length > 0 && process.env.NODE_ENV === 'development') {
      console.log(
        `Custom exhibit "${exhibit.title}" warnings:`,
        validation.warnings
      )
    }

    return true
  })
}

