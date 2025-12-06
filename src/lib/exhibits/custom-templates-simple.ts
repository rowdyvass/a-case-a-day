/**
 * Simple Template-Based Custom Exhibits
 * 
 * This module defines simple, reliable custom exhibit templates.
 * The AI only needs to provide basic content - the templates handle
 * all the complex rendering and interactivity.
 */

// ============== TEMPLATE TYPES ==============

export type CustomTemplateType = 
  | 'decision_simulator'
  | 'scenario_builder' 
  | 'reveal_cards'
  | 'comparative_ranker'
  | 'what_if_calculator'

// ============== SIMPLE DATA STRUCTURES ==============

/**
 * Decision Simulator - Walk through a decision tree
 * AI provides: scenario context, decision points with options and outcomes
 */
export interface DecisionSimulatorTemplate {
  templateType: 'decision_simulator'
  title: string
  scenario: string  // "You are the CEO facing..."
  role: string      // "CEO of CrowdStrike"
  
  // Simple array of decisions - no complex nesting
  decisions: {
    question: string
    context?: string
    options: {
      label: string
      outcome: string
      impact: 'positive' | 'negative' | 'mixed'
    }[]
  }[]
  
  // Optional: what actually happened
  realOutcome?: string
}

/**
 * Scenario Builder - Select options to build a strategy
 * AI provides: prompt, categories, and options to choose from
 */
export interface ScenarioBuilderTemplate {
  templateType: 'scenario_builder'
  title: string
  prompt: string  // "Design a turnaround strategy..."
  
  // Simple categories with options
  categories: {
    name: string
    options: {
      label: string
      description: string
      tradeoff?: string  // "High cost, high impact"
    }[]
  }[]
  
  // Optional constraints
  maxSelections?: number
  
  // Feedback based on selections
  feedbackRules?: {
    ifSelected: string[]  // option labels
    message: string
    type: 'success' | 'warning' | 'insight'
  }[]
}

/**
 * Reveal Cards - Click cards to reveal perspectives/information
 * AI provides: cards with front (teaser) and back (reveal) content
 */
export interface RevealCardsTemplate {
  templateType: 'reveal_cards'
  title: string
  prompt: string  // "Explore different stakeholder perspectives..."
  
  cards: {
    frontLabel: string     // "The CEO"
    frontHint?: string     // "Key decision maker"
    backTitle: string      // "Brian Niccol's View"
    backContent: string    // The revealed content
    sentiment?: 'positive' | 'negative' | 'neutral'
  }[]
  
  // Optional discussion prompt after all revealed
  discussionPrompt?: string
}

/**
 * Comparative Ranker - Rank options and compare to expert ranking
 * AI provides: items to rank and the expert/actual ranking
 */
export interface ComparativeRankerTemplate {
  templateType: 'comparative_ranker'
  title: string
  prompt: string  // "Rank these strategic priorities..."
  
  items: {
    label: string
    description: string
    expertRank: number  // 1 = highest priority
    expertReasoning?: string
  }[]
  
  // Reveal expert ranking after user submits
  expertLabel?: string  // "McKinsey Analysis" or "What Niccol Did"
}

/**
 * What-If Calculator - Adjust variables to see outcomes
 * AI provides: variables with ranges and a simple formula/outcome description
 */
export interface WhatIfCalculatorTemplate {
  templateType: 'what_if_calculator'
  title: string
  scenario: string  // Context for the calculation
  
  variables: {
    label: string
    unit: string      // "$", "%", "stores"
    min: number
    max: number
    default: number
    step?: number
  }[]
  
  // Simple outcome descriptions based on total/combination
  outcomes: {
    condition: 'total_above' | 'total_below' | 'default'
    threshold?: number
    title: string
    description: string
    impact: 'positive' | 'negative' | 'neutral'
  }[]
}

// Union type for all templates
export type CustomExhibitTemplate = 
  | DecisionSimulatorTemplate
  | ScenarioBuilderTemplate
  | RevealCardsTemplate
  | ComparativeRankerTemplate
  | WhatIfCalculatorTemplate

// ============== VALIDATION ==============

export interface TemplateValidationResult {
  valid: boolean
  error?: string
}

export function validateTemplate(data: unknown): TemplateValidationResult {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Data must be an object' }
  }

  const template = data as Record<string, unknown>
  
  if (!template.templateType || typeof template.templateType !== 'string') {
    return { valid: false, error: 'Missing templateType' }
  }

  if (!template.title || typeof template.title !== 'string') {
    return { valid: false, error: 'Missing title' }
  }

  const validTypes: CustomTemplateType[] = [
    'decision_simulator',
    'scenario_builder',
    'reveal_cards', 
    'comparative_ranker',
    'what_if_calculator'
  ]

  if (!validTypes.includes(template.templateType as CustomTemplateType)) {
    return { valid: false, error: `Invalid templateType: ${template.templateType}` }
  }

  // Type-specific validation
  switch (template.templateType) {
    case 'decision_simulator':
      if (!Array.isArray(template.decisions) || template.decisions.length === 0) {
        return { valid: false, error: 'decision_simulator requires decisions array' }
      }
      break
    case 'scenario_builder':
      if (!Array.isArray(template.categories) || template.categories.length === 0) {
        return { valid: false, error: 'scenario_builder requires categories array' }
      }
      break
    case 'reveal_cards':
      if (!Array.isArray(template.cards) || template.cards.length === 0) {
        return { valid: false, error: 'reveal_cards requires cards array' }
      }
      break
    case 'comparative_ranker':
      if (!Array.isArray(template.items) || template.items.length === 0) {
        return { valid: false, error: 'comparative_ranker requires items array' }
      }
      break
    case 'what_if_calculator':
      if (!Array.isArray(template.variables) || template.variables.length === 0) {
        return { valid: false, error: 'what_if_calculator requires variables array' }
      }
      break
  }

  return { valid: true }
}

// ============== AI PROMPT HELPERS ==============

export const CUSTOM_TEMPLATE_PROMPT = `
## Custom Interactive Exhibits

In addition to standard exhibits, you can create 1-2 CUSTOM INTERACTIVE exhibits using these templates.
Each template type has a specific structure - provide the content and the template handles the interactivity.

### Available Templates

#### 1. decision_simulator
Walk users through a decision scenario with branching outcomes.
Best for: Crisis decisions, strategic pivots, leadership choices

\`\`\`json
{
  "type": "custom_template",
  "templateType": "decision_simulator",
  "title": "The CEO's Critical Decision",
  "scenario": "It's 6 AM and you've just learned about the global outage...",
  "role": "CEO of CrowdStrike",
  "decisions": [
    {
      "question": "How do you respond in the first hour?",
      "context": "8.5 million devices are down worldwide",
      "options": [
        { "label": "Issue immediate public apology", "outcome": "Shows accountability but may increase legal exposure", "impact": "mixed" },
        { "label": "Focus on technical fix first", "outcome": "Prioritizes resolution but appears tone-deaf", "impact": "negative" },
        { "label": "Brief key customers directly", "outcome": "Builds trust with major accounts", "impact": "positive" }
      ]
    }
  ],
  "realOutcome": "CrowdStrike's CEO waited several hours before apologizing, drawing criticism..."
}
\`\`\`

#### 2. scenario_builder
Let users build a strategy by selecting from categorized options.
Best for: Turnaround plans, market entry strategies, resource allocation

\`\`\`json
{
  "type": "custom_template",
  "templateType": "scenario_builder",
  "title": "Design the Turnaround Strategy",
  "prompt": "You're Brian Niccol. Select initiatives across categories to build your 100-day plan.",
  "categories": [
    {
      "name": "Customer Experience",
      "options": [
        { "label": "Restore 'third place' seating", "description": "Add comfortable seating back to stores", "tradeoff": "Reduces throughput" },
        { "label": "Simplify the menu", "description": "Cut to 50 core drinks", "tradeoff": "May lose customization fans" }
      ]
    },
    {
      "name": "Operations",
      "options": [
        { "label": "Slow mobile orders", "description": "Cap mobile orders at 30% of capacity", "tradeoff": "Convenience trade-off" }
      ]
    }
  ],
  "maxSelections": 5,
  "feedbackRules": [
    { "ifSelected": ["Restore 'third place' seating", "Slow mobile orders"], "message": "Good combination - prioritizes experience over efficiency", "type": "success" }
  ]
}
\`\`\`

#### 3. reveal_cards
Clickable cards that reveal hidden information or perspectives.
Best for: Stakeholder analysis, hidden factors, multiple viewpoints

\`\`\`json
{
  "type": "custom_template",
  "templateType": "reveal_cards",
  "title": "Stakeholder Perspectives",
  "prompt": "Click each card to reveal how different stakeholders view the crisis.",
  "cards": [
    {
      "frontLabel": "Delta CEO",
      "frontHint": "Major customer",
      "backTitle": "Ed Bastian's Response",
      "backContent": "Publicly blamed CrowdStrike, announced lawsuit, demanded $500M in damages...",
      "sentiment": "negative"
    },
    {
      "frontLabel": "CrowdStrike Investors",
      "frontHint": "Stock dropped 11%",
      "backTitle": "Wall Street's View",
      "backContent": "Despite the crisis, most analysts maintained buy ratings citing...",
      "sentiment": "neutral"
    }
  ],
  "discussionPrompt": "Which stakeholder has the strongest case? Why?"
}
\`\`\`

#### 4. comparative_ranker
Users rank items, then compare to expert/actual ranking.
Best for: Priority setting, evaluating options, strategic assessment

\`\`\`json
{
  "type": "custom_template", 
  "templateType": "comparative_ranker",
  "title": "Rank Niccol's Priorities",
  "prompt": "Rank these initiatives from most to least important for Starbucks' turnaround.",
  "items": [
    { "label": "Menu simplification", "description": "Reduce from 170,000 combinations", "expertRank": 2, "expertReasoning": "Quick win that improves operations" },
    { "label": "Mobile order limits", "description": "Cap app orders per store", "expertRank": 1, "expertReasoning": "Core to restoring experience" },
    { "label": "Store redesign", "description": "Bring back 'third place' atmosphere", "expertRank": 3, "expertReasoning": "Important but slower to implement" }
  ],
  "expertLabel": "What Niccol Actually Prioritized"
}
\`\`\`

#### 5. what_if_calculator
Adjust variables with sliders to explore scenarios.
Best for: Financial sensitivity, pricing decisions, capacity planning

\`\`\`json
{
  "type": "custom_template",
  "templateType": "what_if_calculator",
  "title": "Break-Even Analysis",
  "scenario": "Explore how pricing and volume changes affect profitability.",
  "variables": [
    { "label": "Price per drink", "unit": "$", "min": 4, "max": 8, "default": 5.50, "step": 0.25 },
    { "label": "Daily customers", "unit": "", "min": 100, "max": 500, "default": 300, "step": 10 }
  ],
  "outcomes": [
    { "condition": "total_above", "threshold": 2000, "title": "Profitable", "description": "Store exceeds break-even point", "impact": "positive" },
    { "condition": "total_below", "threshold": 1500, "title": "At Risk", "description": "Below sustainable margin", "impact": "negative" },
    { "condition": "default", "title": "Marginal", "description": "Near break-even", "impact": "neutral" }
  ]
}
\`\`\`

### Guidelines
- Choose templates that ADD INSIGHT to the case (don't just repeat information)
- Focus on the most important decision points or trade-offs
- Keep content concise - these are interactive, not walls of text
- Use the case's actual data and outcomes where possible
`

// ============== TEMPLATE INFO FOR REGISTRY ==============

export const CUSTOM_TEMPLATE_REGISTRY = {
  decision_simulator: {
    name: 'Decision Simulator',
    description: 'Walk through a decision scenario with branching outcomes',
    bestFor: ['Crisis decisions', 'Strategic pivots', 'Leadership choices'],
    complexity: 'medium'
  },
  scenario_builder: {
    name: 'Scenario Builder', 
    description: 'Build a strategy by selecting from categorized options',
    bestFor: ['Turnaround plans', 'Market entry', 'Resource allocation'],
    complexity: 'medium'
  },
  reveal_cards: {
    name: 'Reveal Cards',
    description: 'Clickable cards revealing hidden information or perspectives',
    bestFor: ['Stakeholder analysis', 'Hidden factors', 'Multiple viewpoints'],
    complexity: 'simple'
  },
  comparative_ranker: {
    name: 'Comparative Ranker',
    description: 'Rank items and compare to expert/actual ranking',
    bestFor: ['Priority setting', 'Option evaluation', 'Strategic assessment'],
    complexity: 'simple'
  },
  what_if_calculator: {
    name: 'What-If Calculator',
    description: 'Adjust variables with sliders to explore scenarios',
    bestFor: ['Financial sensitivity', 'Pricing decisions', 'Capacity planning'],
    complexity: 'medium'
  }
} as const


