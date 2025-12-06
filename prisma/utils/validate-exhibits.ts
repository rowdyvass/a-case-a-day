/**
 * Exhibit Variety Validation for Seed Scripts
 * 
 * Provides the same variety analysis used in the API generation flow,
 * so manually seeded cases follow the same quality standards.
 * 
 * This mirrors the logic in src/lib/exhibits/variety.ts but is designed
 * to work in the seed script context (outside of Next.js).
 */

import { PrismaClient } from '../../src/generated/prisma'

// ============== CONSTANTS ==============
// These match src/lib/exhibits/variety.ts

/** Number of recent cases to analyze for cross-case variety */
const RECENT_CASES_WINDOW = 5

/** Maximum times a type can appear in recent cases before being "overused" */
const OVERUSE_THRESHOLD = 3

/** Minimum unique categories required per case */
const MIN_CATEGORIES_PER_CASE = 3

/** Maximum same-type exhibits per case */
const MAX_SAME_TYPE_PER_CASE = 2

/** Minimum unique exhibit types per case */
const MIN_UNIQUE_TYPES_PER_CASE = 4

/** Weight multipliers for variety scoring */
const SCORING_WEIGHTS = {
  uniqueTypes: 30,       // Having different types
  categorySpread: 30,    // Covering different categories
  freshChoices: 20,      // Using types not seen recently
  noOveruse: 20,         // Not repeating same type too much
}

// ============== TYPE MAPPINGS ==============

/** Exhibit type to category mapping (matches registry.ts) */
const TYPE_CATEGORIES: Record<string, string> = {
  // Charts (19 types)
  chart: 'chart',
  area_chart: 'chart',
  stacked_bar: 'chart',
  waterfall: 'chart',
  funnel: 'chart',
  treemap: 'chart',
  heatmap: 'chart',
  radar: 'chart',
  positioning: 'chart',
  bubble: 'chart',
  combo: 'chart',
  slope: 'chart',
  lollipop: 'chart',
  donut: 'chart',
  histogram: 'chart',
  candlestick: 'chart',
  dumbbell: 'chart',
  gauge: 'chart',
  bullet: 'chart',
  
  // Tables (4 types)
  table: 'table',
  enhanced_table: 'table',
  data_table: 'table',
  comparison_grid: 'table',
  
  // Flow & Process (4 types)
  timeline: 'flow',
  sankey: 'flow',
  process_flow: 'flow',
  drilldown: 'flow',
  
  // Text & Narrative (6 types)
  quote: 'text',
  quote_comparison: 'text',
  callout: 'text',
  stat_highlight: 'text',
  source_excerpt: 'text',
  pro_con: 'text',
  
  // Interactive (4+ types)
  metric_card: 'interactive',
  metric_grid: 'interactive',
  scenario_calculator: 'interactive',
  diagram: 'interactive',
  custom_template: 'interactive',
  custom_interactive: 'interactive',
}

// ============== TYPES ==============

export interface ExhibitInput {
  type: string
  title: string
}

export interface VarietyAnalysis {
  /** Variety score 0-100 */
  score: number
  /** Is the exhibit set valid (no hard errors)? */
  isValid: boolean
  /** Hard errors that indicate problems */
  errors: string[]
  /** Soft warnings for improvement */
  warnings: string[]
  /** Positive feedback and suggestions */
  suggestions: string[]
  /** Type distribution */
  typeDistribution: Map<string, number>
  /** Category distribution */
  categoryDistribution: Map<string, number>
}

export interface RecentUsageStats {
  /** Exhibit types used in recent cases with counts */
  recentTypes: Map<string, number>
  /** Types that are overused (should be avoided) */
  overusedTypes: string[]
  /** Types that are underused (used only once) */
  underusedTypes: string[]
  /** Types never used recently (fresh choices) */
  freshTypes: string[]
  /** Number of cases analyzed */
  casesAnalyzed: number
  /** Total exhibits analyzed */
  totalExhibits: number
}

// ============== MAIN FUNCTIONS ==============

/**
 * Get recent exhibit usage from the database
 * Same logic as getRecentExhibitUsage() in variety.ts
 */
export async function getRecentExhibitUsage(prisma: PrismaClient): Promise<RecentUsageStats> {
  // Fetch recent published cases with their exhibits
  const recentCases = await prisma.case.findMany({
    where: { status: 'published' },
    orderBy: { publishedAt: 'desc' },
    take: RECENT_CASES_WINDOW,
    select: {
      id: true,
      exhibits: { select: { type: true } }
    }
  })

  // Count exhibit type usage
  const recentTypes = new Map<string, number>()
  let totalExhibits = 0

  for (const caseData of recentCases) {
    for (const exhibit of caseData.exhibits) {
      const count = recentTypes.get(exhibit.type) || 0
      recentTypes.set(exhibit.type, count + 1)
      totalExhibits++
    }
  }

  // Categorize types
  const allTypeIds = Object.keys(TYPE_CATEGORIES)
  const overusedTypes: string[] = []
  const underusedTypes: string[] = []
  const freshTypes: string[] = []

  for (const typeId of allTypeIds) {
    const count = recentTypes.get(typeId) || 0
    
    if (count >= OVERUSE_THRESHOLD) {
      overusedTypes.push(typeId)
    } else if (count === 0) {
      freshTypes.push(typeId)
    } else if (count === 1) {
      underusedTypes.push(typeId)
    }
  }

  return {
    recentTypes,
    overusedTypes,
    underusedTypes,
    freshTypes,
    casesAnalyzed: recentCases.length,
    totalExhibits,
  }
}

/**
 * Analyze exhibits for variety
 * Same logic as analyzeExhibitVariety() in variety.ts
 */
export function analyzeExhibitVariety(
  exhibits: ExhibitInput[],
  recentUsage?: RecentUsageStats
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
    const category = TYPE_CATEGORIES[exhibit.type] || 'other'
    const catCount = categoryDistribution.get(category) || 0
    categoryDistribution.set(category, catCount + 1)
  }

  // Check variety constraints
  const uniqueTypes = typeDistribution.size
  const uniqueCategories = categoryDistribution.size

  // 1. Check minimum unique types
  if (uniqueTypes < MIN_UNIQUE_TYPES_PER_CASE && exhibits.length >= MIN_UNIQUE_TYPES_PER_CASE) {
    warnings.push(
      `Only ${uniqueTypes} unique exhibit types used. Recommend at least ${MIN_UNIQUE_TYPES_PER_CASE} different types.`
    )
  }

  // 2. Check category spread
  if (uniqueCategories < MIN_CATEGORIES_PER_CASE) {
    warnings.push(
      `Only ${uniqueCategories} categories covered. Recommend at least ${MIN_CATEGORIES_PER_CASE} categories (chart, table, text, flow, interactive).`
    )
  }

  // 3. Check for type over-repetition
  for (const [type, count] of typeDistribution) {
    if (count > MAX_SAME_TYPE_PER_CASE) {
      errors.push(
        `Exhibit type "${type}" used ${count} times. Maximum allowed is ${MAX_SAME_TYPE_PER_CASE}.`
      )
    }
  }

  // 4. Check against recent usage (soft warning)
  if (recentUsage) {
    const usedOverusedTypes: string[] = []
    for (const type of typeDistribution.keys()) {
      if (recentUsage.overusedTypes.includes(type)) {
        usedOverusedTypes.push(type)
      }
    }

    if (usedOverusedTypes.length >= 2) {
      warnings.push(
        `Multiple overused types selected: ${usedOverusedTypes.join(', ')}. Consider using fresher types for variety.`
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

    // Suggest fresh types if none were used
    if (usedFreshTypes.length === 0 && recentUsage.freshTypes.length > 0) {
      suggestions.push(
        `Consider using fresh types for more variety: ${recentUsage.freshTypes.slice(0, 5).join(', ')}`
      )
    }
  }

  // 5. Generate suggestions for missing categories
  const allCategories = ['chart', 'table', 'text', 'flow', 'interactive']
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
    score,
    isValid: errors.length === 0,
    errors,
    warnings,
    suggestions,
    typeDistribution,
    categoryDistribution,
  }
}

/**
 * Calculate a variety score from 0-100
 */
function calculateVarietyScore(
  exhibits: ExhibitInput[],
  typeDistribution: Map<string, number>,
  categoryDistribution: Map<string, number>,
  recentUsage?: RecentUsageStats
): number {
  if (exhibits.length === 0) return 0

  let score = 0

  // Unique types score (0-30)
  // Full score if unique types >= exhibits.length - 1
  const uniqueTypesRatio = typeDistribution.size / Math.max(exhibits.length - 1, 1)
  score += Math.min(uniqueTypesRatio, 1) * SCORING_WEIGHTS.uniqueTypes

  // Category spread score (0-30)
  // Full score if 4+ categories covered
  const categoryScore = Math.min(categoryDistribution.size / 4, 1)
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
 * Log variety analysis in a readable format
 */
export function logVarietyAnalysis(caseTitle: string, analysis: VarietyAnalysis): void {
  console.log(`\n📊 Variety Analysis for "${caseTitle}"`)
  console.log(`   Score: ${analysis.score}/100`)
  console.log(`   Types: ${[...analysis.typeDistribution.keys()].join(', ')}`)
  console.log(`   Categories: ${[...analysis.categoryDistribution.keys()].join(', ')}`)
  
  if (analysis.errors.length > 0) {
    console.log(`   ❌ Errors:`)
    analysis.errors.forEach(e => console.log(`      - ${e}`))
  }
  
  if (analysis.warnings.length > 0) {
    console.log(`   ⚠️  Warnings:`)
    analysis.warnings.forEach(w => console.log(`      - ${w}`))
  }
  
  if (analysis.suggestions.length > 0) {
    console.log(`   💡 Suggestions:`)
    analysis.suggestions.forEach(s => console.log(`      - ${s}`))
  }
}

/**
 * Log recent usage stats in a readable format
 */
export function logRecentUsage(stats: RecentUsageStats): void {
  console.log(`\n📈 Recent Exhibit Usage (Last ${stats.casesAnalyzed} published cases)`)
  console.log(`   Total exhibits analyzed: ${stats.totalExhibits}`)
  
  if (stats.overusedTypes.length > 0) {
    console.log(`   🔴 Overused types (${OVERUSE_THRESHOLD}+ uses): ${stats.overusedTypes.join(', ')}`)
  } else {
    console.log(`   🟢 No overused types`)
  }
  
  if (stats.freshTypes.length > 0) {
    console.log(`   ✨ Fresh types available: ${stats.freshTypes.slice(0, 10).join(', ')}${stats.freshTypes.length > 10 ? ` (+${stats.freshTypes.length - 10} more)` : ''}`)
  }
  
  // Show most used types
  const sortedTypes = [...stats.recentTypes.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
  
  if (sortedTypes.length > 0) {
    console.log(`   📊 Most used: ${sortedTypes.map(([t, c]) => `${t}(${c})`).join(', ')}`)
  }
}

/**
 * Get a brief summary string for logging
 */
export function getVarietySummary(analysis: VarietyAnalysis): string {
  return `Score: ${analysis.score}/100 | Types: ${analysis.typeDistribution.size} unique | Categories: ${[...analysis.categoryDistribution.keys()].join(', ')}`
}


