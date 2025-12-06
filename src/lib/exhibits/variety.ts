/**
 * Exhibit Variety System
 * 
 * Ensures variety in exhibit types both within a single case and across
 * multiple cases over time. Uses a combination of:
 * 1. Pre-generation guidance (informing AI about recent usage)
 * 2. Post-generation validation (checking variety constraints)
 * 
 * Philosophy: We prefer to GUIDE the AI towards variety rather than
 * reject/retry, but we enforce hard limits to prevent poor UX.
 */

import { prisma } from '@/lib/db'
import { EXHIBIT_TYPES, type ExhibitTypeDefinition } from './registry'

// ============== TYPES ==============

export interface ExhibitUsageStats {
  /** Exhibit types used in the last N days */
  recentTypes: Map<string, number>
  /** Total exhibits analyzed */
  totalExhibits: number
  /** Number of cases analyzed */
  casesAnalyzed: number
  /** Types that are overused (should be avoided) */
  overusedTypes: string[]
  /** Types that are underused (should be preferred) */
  underusedTypes: string[]
  /** Types never used recently (fresh choices) */
  freshTypes: string[]
  /** Yesterday's exhibit types in order */
  yesterdayExhibits: string[]
  /** Interactive types used in last 3 cases */
  recentInteractiveTypes: string[]
}

export interface VarietyAnalysis {
  /** Is the exhibit set valid? */
  isValid: boolean
  /** Hard errors that should block saving */
  errors: string[]
  /** Soft warnings for logging/feedback */
  warnings: string[]
  /** Suggestions for improvement */
  suggestions: string[]
  /** Variety score 0-100 */
  score: number
  /** Type distribution */
  typeDistribution: Map<string, number>
  /** Category distribution */
  categoryDistribution: Map<string, number>
}

export interface VarietyGuidance {
  /** Types to prefer (underused recently) */
  preferTypes: string[]
  /** Types to avoid (overused recently) */
  avoidTypes: string[]
  /** Fresh types (never used in recent cases) */
  freshTypes: string[]
  /** Types blocked for Exhibit 1 (used yesterday as Exhibit 1) */
  blockedForExhibit1: string[]
  /** Interactive types to avoid (used in last 3 cases) */
  blockedInteractiveTypes: string[]
  /** Human-readable guidance for the AI prompt */
  promptGuidance: string
  /** Stats for logging */
  stats: ExhibitUsageStats
}

// ============== CONSTANTS ==============

/** Number of days to analyze for cross-case variety (14 days) */
const RECENT_DAYS_WINDOW = 14

/** Maximum times a type can appear in recent days before being "overused" */
const OVERUSE_THRESHOLD = 4

/** Minimum unique categories required per case */
const MIN_CATEGORIES_PER_CASE = 2

/** Maximum same-type exhibits per case (HARD RULE: should be 1 for variety) */
const MAX_SAME_TYPE_PER_CASE = 1

/** Minimum unique exhibit types per case */
const MIN_UNIQUE_TYPES_PER_CASE = 3

/** Weight multipliers for variety scoring */
const SCORING_WEIGHTS = {
  uniqueTypes: 30,       // Having different types
  categorySpread: 30,    // Covering different categories
  freshChoices: 20,      // Using types not seen recently
  noOveruse: 20,         // Not repeating same type too much
}

/** Interactive exhibit types */
const INTERACTIVE_TYPES = [
  'custom_template',
  'decision_simulator',
  'scenario_builder',
  'reveal_cards',
  'comparative_ranker',
  'what_if_calculator',
  'scenario_calculator',
]

// ============== MAIN FUNCTIONS ==============

/**
 * Fetch recent exhibit usage across the last N days
 */
export async function getRecentExhibitUsage(): Promise<ExhibitUsageStats> {
  // Calculate date threshold for 14 days ago
  const dateThreshold = new Date()
  dateThreshold.setDate(dateThreshold.getDate() - RECENT_DAYS_WINDOW)

  // Fetch recent published cases with their exhibits from the last 14 days
  const recentCases = await prisma.case.findMany({
    where: {
      status: 'published',
      publishedAt: {
        gte: dateThreshold,
      },
    },
    orderBy: {
      publishedAt: 'desc',
    },
    select: {
      id: true,
      publishedAt: true,
      exhibits: {
        select: {
          type: true,
          order: true,
        },
        orderBy: {
          order: 'asc',
        },
      },
    },
  })

  // Count exhibit type usage
  const recentTypes = new Map<string, number>()
  let totalExhibits = 0
  const yesterdayExhibits: string[] = []
  const recentInteractiveTypes: string[] = []

  // Get yesterday's date range
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  // Track interactive types from last 3 cases
  let interactiveCaseCount = 0

  for (const caseData of recentCases) {
    for (const exhibit of caseData.exhibits) {
      const count = recentTypes.get(exhibit.type) || 0
      recentTypes.set(exhibit.type, count + 1)
      totalExhibits++
    }

    // Check if this case is from yesterday
    if (caseData.publishedAt) {
      const caseDate = new Date(caseData.publishedAt)
      caseDate.setHours(0, 0, 0, 0)
      
      if (caseDate.getTime() === yesterday.getTime()) {
        // Store yesterday's exhibits in order
        for (const exhibit of caseData.exhibits) {
          yesterdayExhibits.push(exhibit.type)
        }
      }
    }

    // Track interactive types from last 3 cases
    if (interactiveCaseCount < 3) {
      for (const exhibit of caseData.exhibits) {
        // Check if this is a custom_template or interactive type
        if (exhibit.type === 'custom_template' || INTERACTIVE_TYPES.includes(exhibit.type)) {
          if (!recentInteractiveTypes.includes(exhibit.type)) {
            recentInteractiveTypes.push(exhibit.type)
          }
        }
      }
      interactiveCaseCount++
    }
  }

  // Categorize types
  const allTypeIds = EXHIBIT_TYPES.map(t => t.id)
  const overusedTypes: string[] = []
  const underusedTypes: string[] = []
  const freshTypes: string[] = []

  for (const typeId of allTypeIds) {
    const count = recentTypes.get(typeId) || 0
    
    if (count >= OVERUSE_THRESHOLD) {
      overusedTypes.push(typeId)
    } else if (count === 0) {
      freshTypes.push(typeId)
    } else if (count <= 2) {
      underusedTypes.push(typeId)
    }
  }

  return {
    recentTypes,
    totalExhibits,
    casesAnalyzed: recentCases.length,
    overusedTypes,
    underusedTypes,
    freshTypes,
    yesterdayExhibits,
    recentInteractiveTypes,
  }
}

/**
 * Generate variety guidance to include in the AI prompt
 */
export async function getVarietyGuidance(): Promise<VarietyGuidance> {
  const stats = await getRecentExhibitUsage()
  
  // Build prefer/avoid lists with type names for clarity
  const getTypeName = (id: string) => {
    const type = EXHIBIT_TYPES.find(t => t.id === id)
    return type ? `${id} (${type.name})` : id
  }

  const preferTypes = [...stats.underusedTypes, ...stats.freshTypes.slice(0, 5)]
  const avoidTypes = stats.overusedTypes
  const freshTypes = stats.freshTypes
  
  // Block yesterday's Exhibit 1 for today's Exhibit 1
  const blockedForExhibit1 = stats.yesterdayExhibits.length > 0 
    ? [stats.yesterdayExhibits[0]] 
    : []
  
  // Block interactive types used in last 3 cases
  const blockedInteractiveTypes = stats.recentInteractiveTypes

  // Generate human-readable guidance
  let promptGuidance = ''

  promptGuidance += `\n## VARIETY ENFORCEMENT (Critical)\n\n`
  promptGuidance += `These are HARD RULES that must be followed:\n\n`

  // Hard rules section
  promptGuidance += `### HARD RULES:\n\n`
  promptGuidance += `1. **No duplicate types**: Do NOT use the same exhibit type more than once in this case\n`
  
  if (blockedForExhibit1.length > 0) {
    promptGuidance += `2. **Exhibit 1 restriction**: Do NOT use "${getTypeName(blockedForExhibit1[0])}" as Exhibit 1 (it was Exhibit 1 yesterday)\n`
  }
  
  if (blockedInteractiveTypes.length > 0) {
    promptGuidance += `3. **Interactive variety**: Do NOT use these interactive template types (used in last 3 cases): ${blockedInteractiveTypes.join(', ')}\n`
  }
  
  if (avoidTypes.length > 0) {
    promptGuidance += `4. **Overused types**: These types have appeared 4+ times in the last 14 days. Do NOT use them:\n`
    promptGuidance += avoidTypes.map(t => `   - ${getTypeName(t)}`).join('\n')
    promptGuidance += `\n`
  }

  promptGuidance += `\n`

  // Soft goals section
  promptGuidance += `### SOFT GOALS:\n\n`
  promptGuidance += `- Mix "analytical" exhibits (charts, tables) with "human" exhibits (quotes, comparisons)\n`
  promptGuidance += `- Include at least one exhibit that surprises (unusual type for the industry)\n`
  promptGuidance += `- Rotate through text exhibit types (quote, callout, pro_con) over the week\n`

  if (stats.casesAnalyzed > 0) {
    promptGuidance += `\n### Recent Usage (Last ${stats.casesAnalyzed} cases, ${RECENT_DAYS_WINDOW} days):\n\n`

    if (preferTypes.length > 0) {
      promptGuidance += `**Fresh/Underused (prefer these):**\n`
      promptGuidance += preferTypes.slice(0, 8).map(t => `- ${getTypeName(t)}`).join('\n')
      promptGuidance += `\n\n`
    }

    // Show recent distribution
    const topUsed = Array.from(stats.recentTypes.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
    
    if (topUsed.length > 0) {
      promptGuidance += `**Most Used Recently (avoid if possible):**\n`
      promptGuidance += topUsed.map(([type, count]) => `- ${getTypeName(type)}: ${count} times`).join('\n')
      promptGuidance += '\n\n'
    }
  } else {
    promptGuidance += `\n### No Recent Cases\n\nThis is among the first cases being generated. Use a variety of exhibit types that best fit the content.\n\n`
  }

  // Within-case requirements (updated for 3-4 exhibits)
  promptGuidance += `### Within-Case Requirements:\n`
  promptGuidance += `- Use exactly 3-4 exhibits total (2-3 library + 1 interactive)\n`
  promptGuidance += `- Each exhibit must be a DIFFERENT type\n`
  promptGuidance += `- Cover at least ${MIN_CATEGORIES_PER_CASE} different categories (chart, table, text, interactive)\n`
  promptGuidance += `- Balance visual complexity (mix simple and complex exhibits)\n\n`

  return {
    preferTypes,
    avoidTypes,
    freshTypes,
    blockedForExhibit1,
    blockedInteractiveTypes,
    promptGuidance,
    stats,
  }
}

/**
 * Analyze a set of exhibits for variety
 */
export function analyzeExhibitVariety(
  exhibits: Array<{ type: string; title: string }>,
  recentUsage?: ExhibitUsageStats
): VarietyAnalysis {
  const errors: string[] = []
  const warnings: string[] = []
  const suggestions: string[] = []

  // Count types and categories
  const typeDistribution = new Map<string, number>()
  const categoryDistribution = new Map<string, number>()

  for (const exhibit of exhibits) {
    // Count type
    const typeCount = typeDistribution.get(exhibit.type) || 0
    typeDistribution.set(exhibit.type, typeCount + 1)

    // Get category
    const typeDef = EXHIBIT_TYPES.find(t => t.id === exhibit.type)
    if (typeDef) {
      const catCount = categoryDistribution.get(typeDef.category) || 0
      categoryDistribution.set(typeDef.category, catCount + 1)
    }
  }

  // Check variety constraints
  const uniqueTypes = typeDistribution.size
  const uniqueCategories = categoryDistribution.size

  // 1. HARD RULE: No duplicate types in a case
  for (const [type, count] of typeDistribution) {
    if (count > MAX_SAME_TYPE_PER_CASE) {
      errors.push(
        `Exhibit type "${type}" used ${count} times. Each exhibit must be a different type (max ${MAX_SAME_TYPE_PER_CASE} per type).`
      )
    }
  }

  // 2. Check minimum unique types (soft warning for 3-4 exhibit cases)
  if (uniqueTypes < MIN_UNIQUE_TYPES_PER_CASE && exhibits.length >= MIN_UNIQUE_TYPES_PER_CASE) {
    warnings.push(
      `Only ${uniqueTypes} unique exhibit types used. Recommend at least ${MIN_UNIQUE_TYPES_PER_CASE} different types.`
    )
  }

  // 3. Check category spread
  if (uniqueCategories < MIN_CATEGORIES_PER_CASE) {
    warnings.push(
      `Only ${uniqueCategories} categories covered. Recommend covering at least ${MIN_CATEGORIES_PER_CASE} categories (chart, table, text, interactive).`
    )
  }

  // 4. Check against recent usage (yesterday's Exhibit 1)
  if (recentUsage && recentUsage.yesterdayExhibits.length > 0) {
    const yesterdayExhibit1 = recentUsage.yesterdayExhibits[0]
    const todayExhibit1 = exhibits.length > 0 ? exhibits[0].type : null
    
    if (todayExhibit1 === yesterdayExhibit1) {
      errors.push(
        `Exhibit 1 uses "${todayExhibit1}" which was also Exhibit 1 yesterday. Use a different type for variety.`
      )
    }
  }

  // 5. Check against overused types
  if (recentUsage) {
    const usedOverusedTypes: string[] = []
    for (const type of typeDistribution.keys()) {
      if (recentUsage.overusedTypes.includes(type)) {
        usedOverusedTypes.push(type)
      }
    }

    if (usedOverusedTypes.length > 0) {
      warnings.push(
        `Using overused types: ${usedOverusedTypes.join(', ')}. These have appeared 4+ times in the last 14 days.`
      )
    }

    // Check if any fresh types were used (positive feedback)
    const usedFreshTypes: string[] = []
    for (const type of typeDistribution.keys()) {
      if (recentUsage.freshTypes.includes(type)) {
        usedFreshTypes.push(type)
      }
    }

    if (usedFreshTypes.length > 0) {
      suggestions.push(
        `Great variety! Used ${usedFreshTypes.length} fresh type(s): ${usedFreshTypes.join(', ')}`
      )
    }
  }

  // 6. Check exhibit count (should be 3-4)
  if (exhibits.length < 3) {
    warnings.push(`Only ${exhibits.length} exhibits. Consider adding 1-2 more for a complete case (target: 3-4 total).`)
  } else if (exhibits.length > 4) {
    errors.push(`${exhibits.length} exhibits is too many. Maximum is 4 exhibits (2-3 library + 1 interactive).`)
  }

  // 7. Generate suggestions for missing categories
  const allCategories = ['chart', 'table', 'text', 'interactive']
  const missingCategories = allCategories.filter(c => !categoryDistribution.has(c))
  
  if (missingCategories.length > 0 && missingCategories.length <= 2) {
    suggestions.push(
      `Consider adding a ${missingCategories.join(' or ')} exhibit for more variety.`
    )
  }

  // Calculate variety score
  const score = calculateVarietyScore(
    exhibits,
    typeDistribution,
    categoryDistribution,
    recentUsage
  )

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    suggestions,
    score,
    typeDistribution,
    categoryDistribution,
  }
}

/**
 * Calculate a variety score from 0-100
 */
function calculateVarietyScore(
  exhibits: Array<{ type: string }>,
  typeDistribution: Map<string, number>,
  categoryDistribution: Map<string, number>,
  recentUsage?: ExhibitUsageStats
): number {
  if (exhibits.length === 0) return 0

  let score = 0

  // Unique types score (0-30)
  // For 3-4 exhibits, full score if all are unique types
  const uniqueTypesRatio = typeDistribution.size / exhibits.length
  score += Math.min(uniqueTypesRatio, 1) * SCORING_WEIGHTS.uniqueTypes

  // Category spread score (0-30)
  // Full score if 3+ categories covered
  const categoryScore = Math.min(categoryDistribution.size / 3, 1)
  score += categoryScore * SCORING_WEIGHTS.categorySpread

  // Fresh choices score (0-20)
  if (recentUsage && recentUsage.freshTypes.length > 0) {
    let freshCount = 0
    for (const type of typeDistribution.keys()) {
      if (recentUsage.freshTypes.includes(type)) {
        freshCount++
      }
    }
    const freshRatio = freshCount / typeDistribution.size
    score += freshRatio * SCORING_WEIGHTS.freshChoices
  } else {
    // No recent data, give benefit of doubt
    score += SCORING_WEIGHTS.freshChoices * 0.5
  }

  // No overuse score (0-20)
  // Penalize for using overused types
  if (recentUsage && recentUsage.overusedTypes.length > 0) {
    let overusedCount = 0
    for (const type of typeDistribution.keys()) {
      if (recentUsage.overusedTypes.includes(type)) {
        overusedCount++
      }
    }
    const noOveruseRatio = 1 - (overusedCount / typeDistribution.size)
    score += noOveruseRatio * SCORING_WEIGHTS.noOveruse
  } else {
    score += SCORING_WEIGHTS.noOveruse
  }

  return Math.round(score)
}

/**
 * Validate exhibits and optionally redistribute for better variety
 * Returns the original exhibits if valid, or suggestions for improvement
 */
export function validateAndSuggestVariety(
  exhibits: Array<{ type: string; title: string; data: unknown }>,
  recentUsage?: ExhibitUsageStats
): {
  isValid: boolean
  analysis: VarietyAnalysis
  redistributionSuggestions?: Array<{
    index: number
    currentType: string
    suggestedType: string
    reason: string
  }>
} {
  const analysis = analyzeExhibitVariety(exhibits, recentUsage)

  if (analysis.isValid && analysis.score >= 60) {
    return { isValid: true, analysis }
  }

  // Generate redistribution suggestions
  const suggestions: Array<{
    index: number
    currentType: string
    suggestedType: string
    reason: string
  }> = []

  // Find duplicate types that could be changed
  const duplicates = Array.from(analysis.typeDistribution.entries())
    .filter(([, count]) => count > MAX_SAME_TYPE_PER_CASE)

  for (const [duplicateType] of duplicates) {
    // Find indexes of this type
    const indexes = exhibits
      .map((e, i) => (e.type === duplicateType ? i : -1))
      .filter(i => i >= 0)

    // Suggest alternatives for all but the first
    for (let i = 1; i < indexes.length; i++) {
      const idx = indexes[i]
      const typeDef = EXHIBIT_TYPES.find(t => t.id === duplicateType)
      const category = typeDef?.category || 'chart'

      // Find alternative in same category
      const alternatives = EXHIBIT_TYPES.filter(
        t => t.category === category && 
             !analysis.typeDistribution.has(t.id) &&
             (recentUsage ? !recentUsage.overusedTypes.includes(t.id) : true)
      )

      if (alternatives.length > 0) {
        suggestions.push({
          index: idx,
          currentType: duplicateType,
          suggestedType: alternatives[0].id,
          reason: `Replace duplicate ${duplicateType} with ${alternatives[0].name} for variety`,
        })
      }
    }
  }

  return {
    isValid: analysis.isValid,
    analysis,
    redistributionSuggestions: suggestions.length > 0 ? suggestions : undefined,
  }
}

/**
 * Get a summary of variety for logging
 */
export function getVarietySummary(analysis: VarietyAnalysis): string {
  const lines = [
    `Variety Score: ${analysis.score}/100`,
    `Types: ${analysis.typeDistribution.size} unique`,
    `Categories: ${Array.from(analysis.categoryDistribution.keys()).join(', ')}`,
  ]

  if (analysis.errors.length > 0) {
    lines.push(`Errors: ${analysis.errors.join('; ')}`)
  }

  if (analysis.warnings.length > 0) {
    lines.push(`Warnings: ${analysis.warnings.join('; ')}`)
  }

  return lines.join(' | ')
}
