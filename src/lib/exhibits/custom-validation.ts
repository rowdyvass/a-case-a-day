/**
 * Custom Exhibit Validation Schemas
 * 
 * Zod schemas for validating custom exhibit configurations before
 * saving to database or rendering. This ensures all custom exhibits
 * meet the required structure and stay within content limits.
 */

import { z } from 'zod'
import type { CustomExhibitData, CustomExhibitType } from './custom-templates'

// ============== CONTENT LIMITS ==============

const LIMITS = {
  maxTextLength: 500,
  maxTitleLength: 100,
  maxDescriptionLength: 300,
  maxItems: {
    decision_nodes: 10,
    data_rows: 50,
    reveal_cards: 8,
    builder_options: 15,
    timeline_events: 15,
    ranker_items: 8
  }
} as const

// ============== SHARED SCHEMAS ==============

const baseCustomExhibitSchema = z.object({
  type: z.string(),
  title: z.string().min(1).max(LIMITS.maxTitleLength),
  description: z.string().max(LIMITS.maxDescriptionLength).optional(),
  caseContext: z.string().max(LIMITS.maxTextLength).optional()
})

// ============== DECISION SIMULATOR SCHEMA ==============

const outcomeMetricSchema = z.object({
  label: z.string().max(50),
  value: z.string().max(50),
  change: z.enum(['up', 'down', 'neutral']).optional()
})

const decisionOutcomeSchema = z.object({
  title: z.string().max(LIMITS.maxTitleLength),
  description: z.string().max(LIMITS.maxTextLength),
  impact: z.enum(['positive', 'negative', 'mixed', 'neutral']),
  metrics: z.array(outcomeMetricSchema).max(5).optional(),
  realWorldNote: z.string().max(LIMITS.maxTextLength).optional()
})

const decisionOptionSchema = z.object({
  id: z.string().min(1),
  label: z.string().max(100),
  description: z.string().max(LIMITS.maxDescriptionLength).optional(),
  outcome: decisionOutcomeSchema.optional(),
  nextNodeId: z.string().optional()
}).refine(
  data => data.outcome || data.nextNodeId,
  { message: 'Each option must have either an outcome or nextNodeId' }
)

const decisionNodeSchema = z.object({
  id: z.string().min(1),
  question: z.string().max(LIMITS.maxTextLength),
  context: z.string().max(LIMITS.maxTextLength).optional(),
  options: z.array(decisionOptionSchema).min(2).max(4)
})

export const decisionSimulatorSchema = baseCustomExhibitSchema.extend({
  type: z.literal('custom_decision_simulator'),
  scenario: z.string().max(LIMITS.maxTextLength),
  role: z.string().max(100),
  startNodeId: z.string().min(1),
  nodes: z.array(decisionNodeSchema).min(1).max(LIMITS.maxItems.decision_nodes),
  showRealOutcome: z.boolean().optional(),
  realOutcome: z.string().max(LIMITS.maxTextLength).optional()
}).refine(
  data => data.nodes.some(n => n.id === data.startNodeId),
  { message: 'startNodeId must reference an existing node' }
)

// ============== DATA EXPLORER SCHEMA ==============

const dataExplorerColumnSchema = z.object({
  key: z.string().min(1),
  label: z.string().max(50),
  type: z.enum(['text', 'number', 'currency', 'percentage', 'date', 'badge']),
  sortable: z.boolean().optional(),
  filterable: z.boolean().optional(),
  highlight: z.enum(['high', 'low', 'none']).optional(),
  format: z.string().max(20).optional()
})

const dataExplorerFilterSchema = z.object({
  key: z.string().min(1),
  label: z.string().max(50),
  type: z.enum(['select', 'range', 'toggle']),
  options: z.array(z.string().max(50)).max(20).optional(),
  range: z.object({
    min: z.number(),
    max: z.number()
  }).optional()
})

const dataExplorerRowSchema = z.record(z.union([z.string(), z.number(), z.boolean()]))

const dataInsightSchema = z.object({
  text: z.string().max(LIMITS.maxTextLength),
  highlightRows: z.array(z.string()).max(10).optional()
})

export const dataExplorerSchema = baseCustomExhibitSchema.extend({
  type: z.literal('custom_data_explorer'),
  columns: z.array(dataExplorerColumnSchema).min(2).max(10),
  rows: z.array(dataExplorerRowSchema).min(1).max(LIMITS.maxItems.data_rows),
  filters: z.array(dataExplorerFilterSchema).max(5).optional(),
  defaultSort: z.object({
    key: z.string(),
    direction: z.enum(['asc', 'desc'])
  }).optional(),
  compareMode: z.boolean().optional(),
  maxCompareItems: z.number().min(2).max(4).optional(),
  insights: z.array(dataInsightSchema).max(5).optional()
})

// ============== REVEAL CARDS SCHEMA ==============

const revealCardQuoteSchema = z.object({
  text: z.string().max(LIMITS.maxTextLength),
  attribution: z.string().max(100)
})

const revealCardSchema = z.object({
  id: z.string().min(1),
  frontTitle: z.string().max(100),
  frontSubtitle: z.string().max(100).optional(),
  frontIcon: z.enum(['person', 'company', 'strategy', 'risk', 'opportunity', 'question']).optional(),
  backTitle: z.string().max(100),
  backContent: z.string().max(LIMITS.maxTextLength),
  backQuote: revealCardQuoteSchema.optional(),
  tags: z.array(z.string().max(30)).max(5).optional(),
  sentiment: z.enum(['positive', 'negative', 'neutral']).optional()
})

export const revealCardsSchema = baseCustomExhibitSchema.extend({
  type: z.literal('custom_reveal_cards'),
  prompt: z.string().max(LIMITS.maxDescriptionLength),
  cards: z.array(revealCardSchema).min(2).max(LIMITS.maxItems.reveal_cards),
  layout: z.enum(['grid', 'carousel', 'stack']).optional(),
  revealAll: z.boolean().optional(),
  discussionPrompt: z.string().max(LIMITS.maxTextLength).optional()
})

// ============== SCENARIO BUILDER SCHEMA ==============

const builderOptionSchema = z.object({
  id: z.string().min(1),
  label: z.string().max(100),
  description: z.string().max(LIMITS.maxDescriptionLength),
  category: z.string().max(50),
  cost: z.string().max(30).optional(),
  timeframe: z.string().max(30).optional(),
  risk: z.enum(['low', 'medium', 'high']).optional(),
  impact: z.enum(['low', 'medium', 'high']).optional(),
  dependencies: z.array(z.string()).max(5).optional(),
  conflicts: z.array(z.string()).max(5).optional()
})

const builderConstraintSchema = z.object({
  type: z.enum(['budget', 'time', 'resources', 'custom']),
  label: z.string().max(50),
  maxValue: z.number().positive(),
  unit: z.string().max(20)
})

const feedbackConditionSchema = z.object({
  type: z.enum(['includes', 'excludes', 'count_gte', 'count_lte', 'all_of', 'none_of']),
  optionIds: z.array(z.string()).min(1).max(10),
  value: z.number().optional()
})

const scenarioFeedbackSchema = z.object({
  condition: feedbackConditionSchema,
  message: z.string().max(LIMITS.maxTextLength),
  type: z.enum(['success', 'warning', 'info', 'error'])
})

export const scenarioBuilderSchema = baseCustomExhibitSchema.extend({
  type: z.literal('custom_scenario_builder'),
  prompt: z.string().max(LIMITS.maxTextLength),
  options: z.array(builderOptionSchema).min(3).max(LIMITS.maxItems.builder_options),
  categories: z.array(z.string().max(50)).min(1).max(6),
  constraints: z.array(builderConstraintSchema).max(3).optional(),
  minSelections: z.number().min(1).max(10).optional(),
  maxSelections: z.number().min(1).max(10).optional(),
  feedback: z.array(scenarioFeedbackSchema).max(10).optional()
})

// ============== INTERACTIVE TIMELINE SCHEMA ==============

const timelineEventDetailSchema = z.object({
  label: z.string().max(50),
  value: z.string().max(100)
})

const timelineDecisionSchema = z.object({
  question: z.string().max(LIMITS.maxDescriptionLength),
  options: z.array(z.string().max(100)).min(2).max(4),
  actualChoice: z.string().max(100),
  reasoning: z.string().max(LIMITS.maxTextLength).optional()
})

const timelineMediaSchema = z.object({
  type: z.enum(['quote', 'stat', 'image']),
  content: z.string().max(LIMITS.maxTextLength),
  attribution: z.string().max(100).optional()
})

const timelineEventSchema = z.object({
  id: z.string().min(1),
  date: z.string().max(50),
  title: z.string().max(LIMITS.maxTitleLength),
  description: z.string().max(LIMITS.maxTextLength),
  type: z.enum(['milestone', 'decision', 'crisis', 'success', 'failure', 'neutral']),
  details: z.array(timelineEventDetailSchema).max(5).optional(),
  decision: timelineDecisionSchema.optional(),
  media: timelineMediaSchema.optional()
})

export const interactiveTimelineSchema = baseCustomExhibitSchema.extend({
  type: z.literal('custom_interactive_timeline'),
  events: z.array(timelineEventSchema).min(3).max(LIMITS.maxItems.timeline_events),
  layout: z.enum(['horizontal', 'vertical']).optional(),
  highlightDecisions: z.boolean().optional(),
  showAlternatives: z.boolean().optional(),
  startExpanded: z.boolean().optional()
})

// ============== COMPARATIVE RANKER SCHEMA ==============

const rankableItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().max(LIMITS.maxTitleLength),
  description: z.string().max(LIMITS.maxDescriptionLength),
  pros: z.array(z.string().max(100)).max(5).optional(),
  cons: z.array(z.string().max(100)).max(5).optional(),
  metrics: z.array(z.object({
    label: z.string().max(50),
    value: z.string().max(50)
  })).max(5).optional(),
  expertRank: z.number().min(1).max(10).optional(),
  expertReasoning: z.string().max(LIMITS.maxTextLength).optional()
})

export const comparativeRankerSchema = baseCustomExhibitSchema.extend({
  type: z.literal('custom_comparative_ranker'),
  prompt: z.string().max(LIMITS.maxTextLength),
  items: z.array(rankableItemSchema).min(2).max(LIMITS.maxItems.ranker_items),
  showExpertRanking: z.boolean().optional(),
  showReasoning: z.boolean().optional(),
  criteria: z.array(z.string().max(100)).max(5).optional(),
  allowTies: z.boolean().optional()
})

// ============== UNIFIED VALIDATION ==============

const customExhibitSchemaMap = {
  custom_decision_simulator: decisionSimulatorSchema,
  custom_data_explorer: dataExplorerSchema,
  custom_reveal_cards: revealCardsSchema,
  custom_scenario_builder: scenarioBuilderSchema,
  custom_interactive_timeline: interactiveTimelineSchema,
  custom_comparative_ranker: comparativeRankerSchema
} as const

export interface ValidationResult {
  success: boolean
  data?: CustomExhibitData
  errors?: z.ZodError['errors']
  errorMessage?: string
}

/**
 * Validate a custom exhibit configuration
 */
export function validateCustomExhibit(data: unknown): ValidationResult {
  // First, check if it has a valid type
  const typeCheck = z.object({ type: z.string() }).safeParse(data)
  
  if (!typeCheck.success) {
    return {
      success: false,
      errorMessage: 'Missing or invalid type field'
    }
  }

  const type = typeCheck.data.type as CustomExhibitType
  const schema = customExhibitSchemaMap[type]

  if (!schema) {
    return {
      success: false,
      errorMessage: `Unknown custom exhibit type: ${type}`
    }
  }

  const result = schema.safeParse(data)

  if (result.success) {
    return {
      success: true,
      data: result.data as CustomExhibitData
    }
  }

  // Safely extract error information
  const errors = result.error?.errors ?? []
  const errorMessage = errors.length > 0
    ? errors.map(e => `${e.path?.join('.') ?? 'unknown'}: ${e.message}`).join('; ')
    : 'Validation failed'

  return {
    success: false,
    errors,
    errorMessage
  }
}

/**
 * Get the schema for a specific custom exhibit type
 */
export function getSchemaForType(type: CustomExhibitType) {
  return customExhibitSchemaMap[type]
}

/**
 * Check if a type is a valid custom exhibit type
 */
export function isValidCustomType(type: string): type is CustomExhibitType {
  return type in customExhibitSchemaMap
}

