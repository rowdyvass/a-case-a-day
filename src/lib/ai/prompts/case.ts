import type { GenerationContext, ResearchData, ProtagonistProfile } from '../providers/types'
import type { EnrichedResearch } from '../providers/web-research'

export const CASE_SYSTEM_PROMPT = `You are an expert business case study author who has written for Harvard Business School, INSEAD, IMD, UVA Darden, Stanford GSB, and the Case Centre. Your cases are distinctive because they:

1. CENTER ON A PROTAGONIST - Every case follows a specific person facing a real dilemma, not just "the company"
2. OPEN WITH TENSION - Start in the moment of decision, not with company history
3. FEEL HUMAN - Include named stakeholders with distinct voices, perspectives, and quotes
4. STAY PRACTICAL - Focus on actionable decisions with real constraints, not theoretical frameworks
5. READ LIKE A STORY - Use narrative techniques: scenes, dialogue, internal conflict, stakes

TONE: "Freakonomics meets Harvard Business Review"
- Smart but not stuffy
- Use concrete, surprising details (the temperature, the exact time, the specific number)
- One moment of wit or unexpected framing per case
- Avoid: jargon without payoff, throat-clearing context, "In today's fast-paced business environment" style openings
- The reader should want to text a friend about the central dilemma

KEY PRINCIPLES:
- The protagonist is FICTIONAL - a composite character who represents the type of person facing this decision
- Real executives CAN be quoted with attribution when you have their actual quotes
- Use format: "Quote text," said [Name], [Title]. (Source, Date) for real quotes
- Fictional quotes for the protagonist's inner circle do NOT need attribution`

export function getCaseGenerationPrompt(
  context: GenerationContext,
  researchData: ResearchData,
  enrichedResearch?: EnrichedResearch
): string {
  const conceptsList = context.targetConcepts?.length 
    ? `\n\nTarget MBA concepts to incorporate naturally (don't name them explicitly): ${context.targetConcepts.join(', ')}`
    : ''
  
  const objectivesList = context.learningObjectives
    ? `\n\nLearning objectives (achieve these through the narrative, don't state them): ${context.learningObjectives}`
    : ''
  
  const guidanceText = context.additionalGuidance
    ? `\n\nAdditional guidance: ${context.additionalGuidance}`
    : ''

  // Include protagonist information if available
  const protagonistSection = context.protagonist 
    ? `\n\nPROTAGONIST PROFILE (use this fictional character as the case's central figure):
${JSON.stringify(context.protagonist, null, 2)}`
    : `\n\nNOTE: Create a compelling fictional protagonist appropriate for this situation. They should:
- Have a realistic name and title for someone who would face this decision
- Be senior enough to have authority but face real constraints
- Have clear professional and personal stakes in the outcome`

  // Format real quotes if available
  const realQuotesSection = enrichedResearch?.realQuotes?.length 
    ? `\n\nREAL QUOTES TO INCORPORATE (use these exact quotes with attribution):
${enrichedResearch.realQuotes.map((q, i) => `
${i + 1}. "${q.text}"
   - Speaker: ${q.speaker}, ${q.role}
   - Source: ${q.source}${q.date ? `, ${q.date}` : ''}
   - Context: ${q.context || 'General statement'}`).join('\n')}`
    : ''

  // Format financial data if available
  const financialsSection = enrichedResearch?.financials?.length
    ? `\n\nVERIFIED FINANCIAL DATA (use these specific numbers):
${enrichedResearch.financials.map(f => `- ${f.metric}: ${f.value}${f.period ? ` (${f.period})` : ''} [Source: ${f.source}]`).join('\n')}`
    : ''

  // Format competitor insights if available
  const competitorSection = enrichedResearch?.competitorMoves?.length
    ? `\n\nCOMPETITOR INTELLIGENCE:
${enrichedResearch.competitorMoves.map(c => `- ${c.name}: ${c.reaction || c.competitiveMove}${c.date ? ` (${c.date})` : ''}`).join('\n')}`
    : ''

  // Format analyst perspectives if available
  const analystSection = enrichedResearch?.analystPerspectives?.length
    ? `\n\nANALYST PERSPECTIVES:
${enrichedResearch.analystPerspectives.map(a => `- ${a.analyst}${a.firm ? ` (${a.firm})` : ''}: "${a.comment}"${a.rating ? ` [Rating: ${a.rating}]` : ''}`).join('\n')}`
    : ''

  // Format historical precedents if available
  const precedentsSection = enrichedResearch?.historicalPrecedents?.length
    ? `\n\nHISTORICAL PRECEDENTS (reference these to add depth):
${enrichedResearch.historicalPrecedents.map(p => `- ${p.company} (${p.year}): ${p.situation} → ${p.outcome}`).join('\n')}`
    : ''

  // Format outcome if available
  const outcomeSection = enrichedResearch?.outcome
    ? `\n\nWHAT ACTUALLY HAPPENED (you can hint at this or save for discussion):
${enrichedResearch.outcome.description}
Timeline: ${enrichedResearch.outcome.timeframe}
Key results: ${enrichedResearch.outcome.keyResults.join('; ')}`
    : ''

  return `Create a protagonist-centered MBA case study based on the following source article and research.

SOURCE ARTICLE:
${context.sourceArticle}

COMPANY RESEARCH:
${JSON.stringify(researchData, null, 2)}
${protagonistSection}${realQuotesSection}${financialsSection}${competitorSection}${analystSection}${precedentsSection}${outcomeSection}${conceptsList}${objectivesList}${guidanceText}

---

NARRATIVE STRUCTURE: Select ONE archetype based on the source material. Match the structure to the story's natural shape.

## EXISTENTIAL CRISIS
THE_BURNING_PLATFORM (Denial vs. Reality)
- Company faces existential threat it has been ignoring
- Open with the moment denial becomes impossible
- Build tension between those who see reality and those who don't

THE_TURNAROUND (Insolvency vs. Triage)
- Business is failing and must be saved or shut down
- Open with the protagonist inheriting the mess
- Force choices about what to save and what to sacrifice

THE_IMPLOSION (Fraud vs. Truth)
- Scandal, fraud, or fundamental deception is exposed
- Open with the discovery or whistleblower moment
- Escalate the personal cost of truth-telling

## STRATEGIC METAMORPHOSIS
THE_PIVOT (Failure vs. Reinvention)
- Original strategy isn't working, must change course
- Open with the protagonist facing evidence of failure
- Build the case for radical change vs. staying the course

CANNIBALIZATION (Preservation vs. Disruption)
- Must disrupt own successful business to survive
- Open with the innovator's dilemma crystallizing
- Tension between protecting the cash cow and building the future

THE_STRATEGIC_BET (Certainty vs. Risk)
- Major investment, acquisition, or launch decision
- Open with the protagonist seeing opportunity others miss
- Build the contrarian case against conventional wisdom

THE_PIONEER (Unknown vs. Creation)
- Creating something that doesn't exist yet
- Open with the protagonist's vision for what could be
- Navigate uncertainty, skepticism, and resource constraints

## COMPETITIVE DYNAMICS
COMPETITIVE_SHOWDOWN (Firm vs. Rival)
- Direct competitive battle for market position
- Open with the threat arriving or escalating
- Intercut protagonist's view with competitor moves

DAVID_VS_GOLIATH (Small vs. Large)
- Smaller player taking on dominant incumbent
- Open with the asymmetry made vivid
- Build the unconventional strategy that might work

EXTERNAL_FORCES (Firm vs. Environment)
- Regulatory, political, social, or environmental pressure
- Open with forces beyond control arriving
- Navigate between resistance, adaptation, and capitulation

## ORGANIZATIONAL LIFECYCLE
THE_FOUNDERS_DILEMMA (Control vs. Growth)
- Founder must choose between control and company growth
- Open with the tension between founder vision and scaling needs
- Personal stakes of letting go vs. holding on

GROWING_PAINS (Culture vs. Process)
- Success is straining the organization
- Open with the moment old ways start breaking
- Tension between preserving culture and adding structure

THE_SUCCESSION (Past vs. Future)
- Leadership transition with competing visions
- Open with the transition moment or announcement
- Balance legacy, continuity, and necessary change

## TRANSACTIONAL & EXECUTION
THE_DEAL (Buyer vs. Seller)
- M&A negotiation, major contract, or partnership terms
- Open at a critical moment in the negotiation
- Build both sides' perspectives and walk-away points

THE_INTEGRATION (Us vs. Them)
- Post-merger or post-acquisition culture clash
- Open with the collision of two worlds
- Making 1+1=3 vs. destroying value through conflict

THE_BREAKUP (Synergy vs. Complexity)
- Divestiture, spin-off, or breaking up the company
- Open with the case for simplification
- Tension between portfolio logic and execution risk

THE_EMPIRE_BUILDER (Saturation vs. Expansion)
- Geographic or segment expansion decision
- Open with the limits of current market becoming clear
- Build the case for where and how to expand

THE_EXECUTION_CHALLENGE (Strategy vs. Friction)
- Strategy is clear, execution is the battle
- Open with the gap between plan and reality
- Navigate organizational friction, resource constraints, and operational complexity

## MORAL & CONTEXTUAL
ETHICAL_CROSSROADS (Profit vs. Principle)
- Values in direct conflict with business pressures
- Open with the protagonist discovering the moral dimension
- Escalate the personal and professional stakes of each path

---

State your chosen archetype in the "structure" field of the JSON response (e.g., "THE_BURNING_PLATFORM", "CANNIBALIZATION", "THE_DEAL").

---

SECTIONS (4 total, ~300-400 words each):

1. COLD OPEN (300 words max) - title: "opening"
   - First sentence: protagonist + specific sensory detail + tension
   - No company history here
   - End the section with a question or stakes-raising moment

2. THE SITUATION (400 words max) - title: "situation"
   - Context the reader needs to understand the dilemma
   - Weave in company/market context ONLY as it relates to the protagonist's problem
   - Include 1-2 named stakeholders with a line of dialogue each

3. THE STAKES (400 words max) - title: "stakes"
   - What happens if they choose wrong?
   - Competing pressures (boss wants X, market wants Y, ethics demand Z)
   - This is where you reference exhibits to make the tension quantitative

4. THE DECISION POINT (300 words max) - title: "decision"
   - Crystallize 2-3 options (no more)
   - Make each option defensible
   - End with the protagonist facing the choice - no resolution
   - Final line should be a question or an image of uncertainty

---

EXHIBIT CALLOUTS:
Every exhibit must be referenced in the narrative at the moment it's most useful.
Format: "The numbers told the story [see Exhibit 2: Revenue Impact Analysis]."

DO NOT:
- Dump all exhibit references in one paragraph
- Reference exhibits that don't exist
- Use exhibits as decoration - each must advance the reader's understanding

---

LENGTH CONSTRAINT:
Your narrative must be 1,200-1,500 words. This is a hard constraint.
This produces a 5-7 minute read when combined with exhibits.

---

TONE: "Freakonomics meets Harvard Business Review"
- Smart but not stuffy
- Use concrete, surprising details (the temperature, the exact time, the specific number)
- One moment of wit or unexpected framing per case
- Avoid: jargon without payoff, throat-clearing context
- The reader should want to text a friend about the central dilemma

---

DO NOT:
- Open with company history or founding story
- Use "In an industry where..." or "In today's competitive landscape..."
- Explain what an MBA concept means (assume reader knows Porter's Five Forces)
- Resolve the dilemma or hint at what actually happened
- Exceed 1,500 words under any circumstances
- Use more than 3 named stakeholders beyond the protagonist
- NEVER use em dashes. Use regular hyphens (-), commas, colons, or rewrite sentences instead

---

WRITING GUIDELINES:
- USE THE VERIFIED DATA AND REAL QUOTES provided - don't make up numbers
- Include 3-5 direct quotes total (mix of real and fictional)
- Real executive quotes MUST include attribution: (Source, Date)
- Fictional quotes are for the protagonist and their inner circle only
- Present options fairly - no obvious "right answer"
- Use present tense for immediacy where appropriate
- End with tension, not resolution
- The protagonist is FICTIONAL - do not use real executives' names as protagonist

---

Respond in JSON format:
{
  "title": "Compelling title that captures the dilemma (e.g., 'The Algorithm's Edge' not 'Netflix's Content Strategy')",
  "structure": "THE_BURNING_PLATFORM | THE_TURNAROUND | THE_IMPLOSION | THE_PIVOT | CANNIBALIZATION | THE_STRATEGIC_BET | THE_PIONEER | COMPETITIVE_SHOWDOWN | DAVID_VS_GOLIATH | EXTERNAL_FORCES | THE_FOUNDERS_DILEMMA | GROWING_PAINS | THE_SUCCESSION | THE_DEAL | THE_INTEGRATION | THE_BREAKUP | THE_EMPIRE_BUILDER | THE_EXECUTION_CHALLENGE | ETHICAL_CROSSROADS",
  "company": "Company name",
  "industry": "Industry name",
  "summary": "2-3 sentence hook that makes you want to read more - focus on the protagonist and their dilemma",
  "brandColor": "#XXXXXX (hex color code for the company's primary brand color)",
  "protagonist": {
    "name": "Protagonist's full name",
    "role": "Their job title",
    "age": number,
    "background": {
      "education": "Their education",
      "careerPath": "How they got here",
      "yearsAtCompany": number,
      "previousRoles": ["Previous roles"]
    },
    "stakes": {
      "professional": "Career stakes",
      "personal": "Personal investment",
      "reputation": "Reputation stakes"
    },
    "constraints": {
      "resources": "Resource limitations",
      "relationships": "Key relationships",
      "timeline": "Time pressure"
    },
    "personality": {
      "strengths": ["Strength 1", "Strength 2"],
      "blindSpots": ["Blind spot"],
      "decisionStyle": "How they decide"
    },
    "keyRelationships": [
      {
        "name": "Stakeholder name",
        "role": "Their role",
        "relationship": "Relationship to protagonist",
        "perspective": "Their view on the situation"
      }
    ]
  },
  "sections": [
    {"title": "opening", "content": "Cold open content - 300 words max"},
    {"title": "situation", "content": "The situation content - 400 words max"},
    {"title": "stakes", "content": "The stakes content - 400 words max"},
    {"title": "decision", "content": "The decision point content - 300 words max"}
  ],
  "citations": [
    {
      "fact": "The specific fact or quote",
      "source": "Source URL or description",
      "type": "quote|financial|competitive|analyst"
    }
  ]
}`
}
