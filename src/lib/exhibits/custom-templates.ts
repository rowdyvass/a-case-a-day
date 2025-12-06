/**
 * Custom Exhibit Template System
 * 
 * This module defines the available custom exhibit templates that AI can use
 * to create unique, interactive exhibits for each case. Unlike the standard
 * exhibit library, these templates are highly configurable and case-specific.
 * 
 * GUARDRAILS:
 * - All templates have strict TypeScript types
 * - Content limits are enforced (max items, text lengths, nesting)
 * - Templates are validated via Zod before rendering
 * - Fallback rendering for validation failures
 */

// ============== SHARED TYPES ==============

export type CustomExhibitType = 
  | 'custom_decision_simulator'
  | 'custom_data_explorer'
  | 'custom_reveal_cards'
  | 'custom_scenario_builder'
  | 'custom_interactive_timeline'
  | 'custom_comparative_ranker'

export interface BaseCustomExhibit {
  type: CustomExhibitType
  title: string
  description?: string
  caseContext?: string // Brief context tying this to the case
}

// ============== DECISION SIMULATOR ==============
// Multi-path decision trees where users make choices and see consequences

export interface DecisionNode {
  id: string
  question: string
  context?: string // Background info for this decision point
  options: DecisionOption[]
}

export interface DecisionOption {
  id: string
  label: string
  description?: string
  outcome?: DecisionOutcome // Terminal node
  nextNodeId?: string // Non-terminal, leads to another decision
}

export interface DecisionOutcome {
  title: string
  description: string
  impact: 'positive' | 'negative' | 'mixed' | 'neutral'
  metrics?: OutcomeMetric[]
  realWorldNote?: string // What actually happened / expert insight
}

export interface OutcomeMetric {
  label: string
  value: string
  change?: 'up' | 'down' | 'neutral'
}

export interface DecisionSimulatorData extends BaseCustomExhibit {
  type: 'custom_decision_simulator'
  scenario: string // The overall scenario description
  role: string // e.g., "CEO of Acme Corp", "Board Member"
  startNodeId: string
  nodes: DecisionNode[]
  showRealOutcome?: boolean // Reveal what actually happened at the end
  realOutcome?: string
}

// ============== DATA EXPLORER ==============
// Interactive filtering and comparison of case-specific data

export interface DataExplorerColumn {
  key: string
  label: string
  type: 'text' | 'number' | 'currency' | 'percentage' | 'date' | 'badge'
  sortable?: boolean
  filterable?: boolean
  highlight?: 'high' | 'low' | 'none' // Highlight best/worst values
  format?: string // e.g., "$#,###" or "#.#%"
}

export interface DataExplorerFilter {
  key: string
  label: string
  type: 'select' | 'range' | 'toggle'
  options?: string[] // For select type
  range?: { min: number; max: number } // For range type
}

export interface DataExplorerRow {
  [key: string]: string | number | boolean
}

export interface DataExplorerData extends BaseCustomExhibit {
  type: 'custom_data_explorer'
  columns: DataExplorerColumn[]
  rows: DataExplorerRow[]
  filters?: DataExplorerFilter[]
  defaultSort?: { key: string; direction: 'asc' | 'desc' }
  compareMode?: boolean // Allow side-by-side comparison
  maxCompareItems?: number
  insights?: DataInsight[] // Key takeaways from the data
}

export interface DataInsight {
  text: string
  highlightRows?: string[] // Row IDs to highlight for this insight
}

// ============== REVEAL CARDS ==============
// Progressive disclosure - cards that reveal information on interaction

export interface RevealCard {
  id: string
  frontTitle: string
  frontSubtitle?: string
  frontIcon?: 'person' | 'company' | 'strategy' | 'risk' | 'opportunity' | 'question'
  backTitle: string
  backContent: string
  backQuote?: {
    text: string
    attribution: string
  }
  tags?: string[]
  sentiment?: 'positive' | 'negative' | 'neutral'
}

export interface RevealCardsData extends BaseCustomExhibit {
  type: 'custom_reveal_cards'
  prompt: string // Instruction for the user, e.g., "Explore stakeholder perspectives"
  cards: RevealCard[]
  layout?: 'grid' | 'carousel' | 'stack'
  revealAll?: boolean // Option to reveal all at once
  discussionPrompt?: string // Question to consider after viewing all cards
}

// ============== SCENARIO BUILDER ==============
// Drag-and-drop or selection-based strategy construction

export interface BuilderOption {
  id: string
  label: string
  description: string
  category: string
  cost?: string // e.g., "$5M" or "High"
  timeframe?: string // e.g., "6 months" or "Immediate"
  risk?: 'low' | 'medium' | 'high'
  impact?: 'low' | 'medium' | 'high'
  dependencies?: string[] // IDs of options that must be selected first
  conflicts?: string[] // IDs of options that cannot be combined
}

export interface BuilderConstraint {
  type: 'budget' | 'time' | 'resources' | 'custom'
  label: string
  maxValue: number
  unit: string
}

export interface ScenarioBuilderData extends BaseCustomExhibit {
  type: 'custom_scenario_builder'
  prompt: string // e.g., "Build a turnaround strategy for the company"
  options: BuilderOption[]
  categories: string[]
  constraints?: BuilderConstraint[]
  minSelections?: number
  maxSelections?: number
  feedback?: ScenarioFeedback[] // Conditional feedback based on selections
}

export interface ScenarioFeedback {
  condition: FeedbackCondition
  message: string
  type: 'success' | 'warning' | 'info' | 'error'
}

export interface FeedbackCondition {
  type: 'includes' | 'excludes' | 'count_gte' | 'count_lte' | 'all_of' | 'none_of'
  optionIds: string[]
  value?: number // For count conditions
}

// ============== INTERACTIVE TIMELINE ==============
// Explorable timeline with decision points and context

export interface TimelineEvent {
  id: string
  date: string
  title: string
  description: string
  type: 'milestone' | 'decision' | 'crisis' | 'success' | 'failure' | 'neutral'
  details?: TimelineEventDetail[]
  decision?: TimelineDecision // If this is a decision point
  media?: {
    type: 'quote' | 'stat' | 'image'
    content: string
    attribution?: string
  }
}

export interface TimelineEventDetail {
  label: string
  value: string
}

export interface TimelineDecision {
  question: string
  options: string[]
  actualChoice: string
  reasoning?: string
}

export interface InteractiveTimelineData extends BaseCustomExhibit {
  type: 'custom_interactive_timeline'
  events: TimelineEvent[]
  layout?: 'horizontal' | 'vertical'
  highlightDecisions?: boolean
  showAlternatives?: boolean // Show "what if" for decision points
  startExpanded?: boolean
}

// ============== COMPARATIVE RANKER ==============
// Rank/prioritize items with feedback on reasoning

export interface RankableItem {
  id: string
  title: string
  description: string
  pros?: string[]
  cons?: string[]
  metrics?: { label: string; value: string }[]
  expertRank?: number // The "correct" or expert ranking
  expertReasoning?: string
}

export interface ComparativeRankerData extends BaseCustomExhibit {
  type: 'custom_comparative_ranker'
  prompt: string // e.g., "Rank these strategic options from best to worst"
  items: RankableItem[]
  showExpertRanking?: boolean // Reveal expert ranking after user submits
  showReasoning?: boolean // Show reasoning for each position
  criteria?: string[] // What criteria to consider when ranking
  allowTies?: boolean
}

// ============== TEMPLATE METADATA ==============

export interface CustomTemplateDefinition {
  type: CustomExhibitType
  name: string
  description: string
  bestFor: string[]
  complexity: 'medium' | 'high'
  interactivity: 'click' | 'full'
  maxItems: number // Content limit
  example: string
}

export const CUSTOM_EXHIBIT_TEMPLATES: CustomTemplateDefinition[] = [
  {
    type: 'custom_decision_simulator',
    name: 'Decision Simulator',
    description: 'Multi-path decision tree where users make choices as a stakeholder and see consequences',
    bestFor: [
      'Strategic decision analysis',
      'Leadership dilemmas',
      'Crisis management scenarios',
      'Ethical decision-making'
    ],
    complexity: 'high',
    interactivity: 'full',
    maxItems: 10, // Max decision nodes
    example: 'Put yourself in the CEO\'s shoes during the acquisition decision. What would you do?'
  },
  {
    type: 'custom_data_explorer',
    name: 'Data Explorer',
    description: 'Interactive table with filtering, sorting, and comparison of case-specific data',
    bestFor: [
      'Financial analysis across periods',
      'Competitive comparison',
      'Market segment analysis',
      'Performance benchmarking'
    ],
    complexity: 'medium',
    interactivity: 'full',
    maxItems: 50, // Max rows
    example: 'Compare financial metrics across the three acquisition targets to identify the best fit'
  },
  {
    type: 'custom_reveal_cards',
    name: 'Reveal Cards',
    description: 'Progressive disclosure cards that reveal information on interaction',
    bestFor: [
      'Stakeholder perspectives',
      'Hidden information reveals',
      'Multiple viewpoints on a decision',
      'Risk factor exploration'
    ],
    complexity: 'medium',
    interactivity: 'click',
    maxItems: 8, // Max cards
    example: 'Explore what each board member thought about the merger before the vote'
  },
  {
    type: 'custom_scenario_builder',
    name: 'Scenario Builder',
    description: 'Build a strategy by selecting options with constraints and feedback',
    bestFor: [
      'Strategy formulation',
      'Resource allocation decisions',
      'Turnaround planning',
      'Product portfolio optimization'
    ],
    complexity: 'high',
    interactivity: 'full',
    maxItems: 15, // Max options
    example: 'Design a turnaround strategy for the company with a $50M budget'
  },
  {
    type: 'custom_interactive_timeline',
    name: 'Interactive Timeline',
    description: 'Explorable timeline with expandable events and decision points',
    bestFor: [
      'Crisis evolution',
      'Company history with pivotal moments',
      'M&A process walkthrough',
      'Market entry journey'
    ],
    complexity: 'medium',
    interactivity: 'click',
    maxItems: 15, // Max events
    example: 'Navigate through the 72-hour crisis that defined the company\'s future'
  },
  {
    type: 'custom_comparative_ranker',
    name: 'Comparative Ranker',
    description: 'Rank options and compare against expert reasoning',
    bestFor: [
      'Strategic option evaluation',
      'Priority setting exercises',
      'Investment decision ranking',
      'Risk assessment ordering'
    ],
    complexity: 'medium',
    interactivity: 'full',
    maxItems: 8, // Max items to rank
    example: 'Rank the market entry strategies from most to least promising'
  }
]

// Helper to get template definition
export function getCustomTemplate(type: CustomExhibitType): CustomTemplateDefinition | undefined {
  return CUSTOM_EXHIBIT_TEMPLATES.find(t => t.type === type)
}

// Helper to check if a type is a custom exhibit
export function isCustomExhibitType(type: string): type is CustomExhibitType {
  return type.startsWith('custom_') && CUSTOM_EXHIBIT_TEMPLATES.some(t => t.type === type)
}

// Union type for all custom exhibit data
export type CustomExhibitData = 
  | DecisionSimulatorData
  | DataExplorerData
  | RevealCardsData
  | ScenarioBuilderData
  | InteractiveTimelineData
  | ComparativeRankerData

// Generate AI prompt section for custom exhibit selection
export function generateCustomExhibitGuide(): string {
  let guide = `## Custom Interactive Exhibits

In addition to the standard exhibit library, you should create 1-2 CUSTOM interactive exhibits that are uniquely tailored to this case. These create memorable, engaging learning experiences.

### Available Custom Templates

`

  for (const template of CUSTOM_EXHIBIT_TEMPLATES) {
    guide += `**${template.type}** - ${template.name}
- ${template.description}
- Best for: ${template.bestFor.join(', ')}
- Max items: ${template.maxItems}
- Example: "${template.example}"

`
  }

  guide += `### Guidelines for Custom Exhibits

1. **Be case-specific**: Custom exhibits should feel uniquely designed for this case, not generic
2. **Create engagement**: These should be the most memorable parts of the case
3. **Support learning**: Each custom exhibit should reinforce a key learning objective
4. **Stay within limits**: Respect the maxItems for each template type
5. **Provide context**: Include caseContext to tie the exhibit to the narrative

### When to Use Each Template

- **Decision Simulator**: When the case has a pivotal decision with multiple viable paths
- **Data Explorer**: When there's rich data students should analyze themselves
- **Reveal Cards**: When multiple stakeholder perspectives matter
- **Scenario Builder**: When students should construct their own strategy
- **Interactive Timeline**: When chronology and decision points are crucial
- **Comparative Ranker**: When evaluating and prioritizing options is key

`

  return guide
}


