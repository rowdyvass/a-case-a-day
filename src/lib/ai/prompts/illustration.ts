/**
 * Illustration Generation Prompt System
 * 
 * Creates prompts for generating Claude/Anthropic-style editorial illustrations
 * for case studies. The style features:
 * - Solid color backgrounds
 * - Black hand-drawn brush stroke outlines
 * - White geometric shape accents
 * - Single central metaphorical object
 * - No text, minimal detail, editorial feel
 */

export interface IllustrationPromptContext {
  title: string
  company: string
  industry: string
  summary: string
  keyChallenge?: string
  backgroundColor: string
  recentObjects?: string[]
}

// Common business clichés to explicitly avoid - these appear too frequently
// and make cases feel generic
export const AVOID_OBJECTS = [
  // Chess/games
  'chess pieces', 'chess board', 'chess knight', 'chess pawn',
  // Light/vision
  'lightbulb', 'light bulb', 'magnifying glass', 'telescope', 'binoculars',
  // Mechanical
  'gear', 'gears', 'cog', 'cogs', 'cogwheel',
  // Navigation
  'compass', 'ship', 'boat', 'anchor', 'rocket', 'spaceship',
  // Achievement
  'trophy', 'medal', 'crown', 'podium', 'mountain peak', 'summit',
  // Growth
  'ladder', 'staircase', 'stairs', 'tree growing', 'seedling', 'plant growing',
  // Connection
  'handshake', 'puzzle pieces', 'jigsaw', 'chain links',
  // Targeting
  'target', 'bullseye', 'arrow', 'arrows', 'dart',
  // Security
  'key', 'lock', 'padlock', 'shield',
  // Balance
  'scale', 'balance scale', 'seesaw',
  // Time
  'hourglass', 'clock', 'stopwatch',
] as const

// Suggested object categories with examples for inspiration
export const OBJECT_INSPIRATION = {
  transformation: ['butterfly', 'cocoon', 'prism', 'origami crane', 'melting ice'],
  tension: ['stretched rubber band', 'tightrope', 'pressure gauge', 'spring coiled'],
  decision: ['forking path', 'door', 'lever', 'dial', 'switch'],
  growth: ['bamboo', 'coral', 'crystal formation', 'ripples in water'],
  connection: ['bridge', 'rope knot', 'antenna', 'satellite dish', 'telegraph wire'],
  disruption: ['cracked vase', 'dominos falling', 'wave', 'earthquake crack'],
  innovation: ['kaleidoscope', 'mixing bowl', 'test tube', 'brewing kettle'],
  competition: ['flag', 'finish line', 'racing hurdle', 'starting blocks'],
  resources: ['well', 'reservoir', 'pipeline', 'faucet', 'bucket'],
  structure: ['scaffolding', 'foundation blocks', 'arch', 'column', 'frame'],
} as const

/**
 * Build the illustration generation prompt
 */
export function buildIllustrationPrompt(context: IllustrationPromptContext): string {
  const recentObjectsWarning = context.recentObjects?.length 
    ? `\n\nCRITICAL - AVOID THESE OBJECTS (used in recent cases, we need variety): ${context.recentObjects.join(', ')}`
    : ''

  return `Create a sophisticated editorial illustration in the style of The New Yorker magazine or The Economist.

═══════════════════════════════════════════════════════════════════
VISUAL STYLE: ERUDITE HAND-DRAWN EDITORIAL
═══════════════════════════════════════════════════════════════════

OVERALL AESTHETIC:
- Think: New Yorker covers, Economist illustrations, Harvard Business Review editorial art
- Sophisticated, intellectual, slightly whimsical but never cartoonish
- The kind of illustration that would accompany a serious business article
- Professional yet with warmth and humanity

BACKGROUND:
- Solid matte color: ${context.backgroundColor}
- This is a brand color - keep it clean and uninterrupted
- NO gradients, NO textures - just elegant solid color

ILLUSTRATION STYLE:
- Confident, fluid pen/ink line work - as if drawn by a skilled editorial illustrator
- Lines should feel deliberate and assured, not tentative
- Varying line weights: thicker for emphasis, thinner for detail
- Slightly imperfect in a charming, human way (not sloppy)
- Think: expressive brush pen or confident fountain pen strokes
- Black lines with occasional cream/off-white fills for contrast

COMPOSITION:
- ONE central conceptual object or scene
- Object fills 50-70% of frame
- Asymmetric, dynamic composition - not perfectly centered
- Negative space is intentional and elegant
- May include subtle secondary elements that support the metaphor

COLOR USAGE:
- Primary: Black line work
- Secondary: Cream/off-white shapes for contrast and depth
- Background: ${context.backgroundColor} (brand color)
- Optional: One small accent of the background color within the illustration

WHAT TO AVOID:
- Clip art or icon aesthetics
- Perfect geometric shapes
- Corporate/stock illustration feel
- Overly literal representations
- Busy or cluttered compositions
- Cartoon characters or cute mascots

═══════════════════════════════════════════════════════════════════
CASE CONTEXT
═══════════════════════════════════════════════════════════════════

Title: ${context.title}
Company: ${context.company}
Industry: ${context.industry}
Summary: ${context.summary}
${context.keyChallenge ? `Core Challenge: ${context.keyChallenge}` : ''}

═══════════════════════════════════════════════════════════════════
CONCEPTUAL DIRECTION
═══════════════════════════════════════════════════════════════════

Create a METAPHORICAL illustration - not a literal depiction of the business.
The best editorial illustrations make the viewer think.

AVOID these overused business metaphors:
${AVOID_OBJECTS.join(', ')}
${recentObjectsWarning}

THINK LIKE AN EDITORIAL ILLUSTRATOR:
- What's the emotional core of this case?
- What tension or transformation is at play?
- What unexpected object could embody this feeling?

Good conceptual directions:
- A hand holding something delicate (care, responsibility)
- Objects in tension or balance (competing forces)
- Things transforming or emerging (change, growth)
- Vessels, containers, architecture (structure, systems)
- Natural forms with business implications (organic growth)
- Tools and instruments (precision, craft)

═══════════════════════════════════════════════════════════════════
OUTPUT REQUIREMENTS
═══════════════════════════════════════════════════════════════════

Generate a single 16:9 editorial illustration that:
- Would feel at home in The New Yorker, The Economist, or HBR
- Rewards a moment of contemplation
- Feels hand-crafted by a skilled illustrator
- Is sophisticated enough for MBA-level business content
- Uses the brand color (${context.backgroundColor}) as the background`
}

/**
 * A Case A Day Brand Colors
 * Based on the editorial category colors from the design system
 */
export const BRAND_COLORS = {
  // Primary brand palette - muted, sophisticated editorial tones
  strategy: '#57534e',      // Warm stone
  finance: '#475569',       // Cool slate
  marketing: '#9f7aea',     // Muted purple
  operations: '#b45309',    // Warm amber
  leadership: '#047857',    // Muted emerald
  economics: '#4f46e5',     // Muted indigo
  
  // Accent
  amber: '#f59e0b',         // Brand accent
  
  // Neutral tones for variety
  slate: '#64748b',         // Slate gray
  stone: '#78716c',         // Warm stone
  zinc: '#71717a',          // Cool zinc
} as const

/**
 * Industry to brand color mapping
 * Maps industries to A Case A Day's editorial color palette
 */
export const INDUSTRY_COLORS: Record<string, string> = {
  // Technology & Digital -> Indigo (economics color - analytical)
  'technology': BRAND_COLORS.economics,
  'software': BRAND_COLORS.economics,
  'saas': BRAND_COLORS.economics,
  'ai': BRAND_COLORS.economics,
  'artificial intelligence': BRAND_COLORS.economics,
  
  // Finance & Business Services -> Slate (finance color)
  'finance': BRAND_COLORS.finance,
  'banking': BRAND_COLORS.finance,
  'financial services': BRAND_COLORS.finance,
  'insurance': BRAND_COLORS.finance,
  'consulting': BRAND_COLORS.strategy,
  
  // Healthcare & Life Sciences -> Emerald (leadership color - care)
  'healthcare': BRAND_COLORS.leadership,
  'pharmaceutical': BRAND_COLORS.leadership,
  'biotech': BRAND_COLORS.leadership,
  'medical': BRAND_COLORS.leadership,
  
  // Consumer & Retail -> Amber (operations color - movement)
  'retail': BRAND_COLORS.operations,
  'e-commerce': BRAND_COLORS.operations,
  'consumer goods': BRAND_COLORS.operations,
  'food & beverage': BRAND_COLORS.operations,
  'hospitality': BRAND_COLORS.operations,
  'restaurant': BRAND_COLORS.operations,
  
  // Industrial -> Stone (strategy color - foundation)
  'manufacturing': BRAND_COLORS.strategy,
  'automotive': BRAND_COLORS.strategy,
  'aerospace': BRAND_COLORS.finance,
  'industrial': BRAND_COLORS.strategy,
  
  // Energy & Resources -> Amber
  'energy': BRAND_COLORS.operations,
  'oil & gas': BRAND_COLORS.strategy,
  'utilities': BRAND_COLORS.strategy,
  'renewable energy': BRAND_COLORS.leadership,
  
  // Media & Entertainment -> Purple (marketing color)
  'media': BRAND_COLORS.marketing,
  'entertainment': BRAND_COLORS.marketing,
  'streaming': BRAND_COLORS.marketing,
  'gaming': BRAND_COLORS.marketing,
  
  // Transportation & Logistics -> Slate
  'transportation': BRAND_COLORS.finance,
  'logistics': BRAND_COLORS.operations,
  'airlines': BRAND_COLORS.finance,
  'shipping': BRAND_COLORS.finance,
  
  // Telecommunications -> Indigo
  'telecommunications': BRAND_COLORS.economics,
  'telecom': BRAND_COLORS.economics,
  
  // Real Estate -> Stone
  'real estate': BRAND_COLORS.strategy,
  'construction': BRAND_COLORS.strategy,
  
  // Default fallback -> Amber (brand accent)
  'default': BRAND_COLORS.amber,
}

/**
 * Get background color for an industry
 */
export function getIndustryColor(industry: string): string {
  const normalizedIndustry = industry.toLowerCase().trim()
  
  // Check for exact match
  if (INDUSTRY_COLORS[normalizedIndustry]) {
    return INDUSTRY_COLORS[normalizedIndustry]
  }
  
  // Check for partial match
  for (const [key, color] of Object.entries(INDUSTRY_COLORS)) {
    if (normalizedIndustry.includes(key) || key.includes(normalizedIndustry)) {
      return color
    }
  }
  
  return INDUSTRY_COLORS.default
}

/**
 * Extract object description from AI response for variety tracking
 * This is a placeholder - actual implementation depends on Gemini's response format
 */
export function extractObjectFromResponse(response: string): string {
  // The AI doesn't explicitly tell us what object it chose
  // We could potentially ask it in a follow-up or parse the prompt
  // For now, return a generic description
  return 'editorial illustration'
}

