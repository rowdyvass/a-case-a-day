/**
 * Case Quality Grading System
 * 
 * Grades generated cases like an AP English teacher with deep business knowledge.
 * Ensures cases meet HBS publication quality standards.
 * Provides iterative improvement until A- or better.
 */

import type { CaseContent, Exhibit, Question } from '../providers/types'

// ============================================================================
// Types
// ============================================================================

export interface CaseGradeResult {
  grade: string // A, A-, B+, B, B-, C+, C, D, F
  score: number // 0-100
  isPublishReady: boolean
  
  breakdown: {
    narrativeQuality: GradeCategory
    protagonistDepth: GradeCategory
    businessRigor: GradeCategory
    exhibitIntegration: GradeCategory
    questionQuality: GradeCategory
    cohesion: GradeCategory
  }
  
  overallFeedback: string
  strengths: string[]
  weaknesses: string[]
  improvementSuggestions: ImprovementSuggestion[]
  
  // For iterative improvement
  weakestCategory: string
  prioritizedFixes: string[]
}

export interface GradeCategory {
  score: number // 0-100 scaled to weight
  maxPoints: number
  grade: string
  feedback: string
  specificIssues: string[]
}

export interface ImprovementSuggestion {
  category: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  issue: string
  suggestion: string
  exampleFix?: string
}

// ============================================================================
// Constants
// ============================================================================

const GRADE_THRESHOLDS = {
  'A': 93,
  'A-': 90,
  'B+': 87,
  'B': 83,
  'B-': 80,
  'C+': 77,
  'C': 73,
  'C-': 70,
  'D+': 67,
  'D': 63,
  'D-': 60,
  'F': 0,
}

const CATEGORY_WEIGHTS = {
  narrativeQuality: 25,
  protagonistDepth: 15,
  businessRigor: 20,
  exhibitIntegration: 15,
  questionQuality: 15,
  cohesion: 10,
}

const MINIMUM_ACCEPTABLE_GRADE = 'A-'
const MINIMUM_ACCEPTABLE_SCORE = 90
const MAX_IMPROVEMENT_ITERATIONS = 3

// ============================================================================
// System Prompt
// ============================================================================

export const CASE_GRADING_SYSTEM_PROMPT = `You are an AP English teacher with an MBA from Harvard Business School and 20 years of experience in management consulting. You have high standards for both writing quality and business rigor.

You grade MBA case studies with the exacting standards of top business schools. Your evaluation considers:

1. NARRATIVE QUALITY (25 points)
   - Opening hook: Does it grab attention immediately?
   - Tension and pacing: Is there genuine drama and stakes?
   - Voice and tone: Modern, engaging, like Malcolm Gladwell meets HBR?
   - Show don't tell: Are insights revealed through story, not exposition?
   - No jargon: Specific, concrete language over buzzwords?

2. PROTAGONIST DEPTH (15 points)
   - Believability: Could this person really exist at this company?
   - Stakes clarity: Are professional/personal stakes clear?
   - Constraints: Real limitations that affect decisions?
   - Personality: Distinct voice and decision-making style?
   - Key relationships: Diverse stakeholders with differing views?

3. BUSINESS RIGOR (20 points)
   - Data accuracy: Verified numbers with sources?
   - Logical analysis: Sound reasoning throughout?
   - Real-world grounding: Feels like actual business situation?
   - Industry context: Demonstrates market understanding?
   - Strategic depth: Multiple legitimate strategic options?

4. EXHIBIT INTEGRATION (15 points)
   - Relevance: Each exhibit advances understanding?
   - Variety: Mix of visualization types?
   - Supports narrative: Exhibits reinforce case themes?
   - Data quality: Accurate, well-sourced data?
   - Visual effectiveness: Would work in HBR publication?

5. QUESTION QUALITY (15 points)
   - Difficulty progression: Easy to hard arc?
   - Concept coverage: Applies relevant MBA frameworks?
   - Rubric clarity: Clear grading criteria?
   - Exemplary answers: High-quality model responses?
   - Mix of types: Multiple choice, free text, frameworks?

6. COHESION (10 points)
   - All elements work together?
   - No contradictions between sections?
   - Exhibits support narrative claims?
   - Questions test material actually covered?
   - Consistent protagonist throughout?

Grade on this scale:
- A (93-100): Publication-ready for HBR or top business school
- A- (90-92): Minor polish needed, acceptable for publication
- B+ (87-89): Good but needs improvement in 1-2 areas
- B (83-86): Solid but significant revision needed
- B- (80-82): Major issues in multiple areas
- C or below (<80): Fundamental problems, consider regenerating

Be rigorous but fair. Provide specific, actionable feedback for improvement.`

// ============================================================================
// Grading Prompt
// ============================================================================

export function getCaseGradingPrompt(
  caseContent: CaseContent,
  exhibits: Exhibit[],
  questions: Question[]
): string {
  const sectionsText = caseContent.sections
    .map(s => `## ${s.title}\n${s.content}`)
    .join('\n\n')
  
  const exhibitSummary = exhibits.map((e, i) => 
    `${i + 1}. ${e.title} (${e.type})${e.description ? `: ${e.description}` : ''}`
  ).join('\n')
  
  const questionSummary = questions.map((q, i) =>
    `${i + 1}. [${q.type}/${q.difficulty}] ${q.text.slice(0, 100)}...`
  ).join('\n')

  return `Grade this MBA case study with your exacting standards.

CASE STUDY:
Title: ${caseContent.title}
Company: ${caseContent.company}
Industry: ${caseContent.industry}
Summary: ${caseContent.summary}

PROTAGONIST:
${caseContent.protagonist ? JSON.stringify(caseContent.protagonist, null, 2) : 'Not defined'}

NARRATIVE:
${sectionsText}

EXHIBITS (${exhibits.length} total):
${exhibitSummary}

QUESTIONS (${questions.length} total):
${questionSummary}

---

Evaluate each category and provide a comprehensive grade.

Respond in JSON format:
{
  "grade": "A-",
  "score": 91,
  "isPublishReady": true,
  
  "breakdown": {
    "narrativeQuality": {
      "score": 23,
      "maxPoints": 25,
      "grade": "A-",
      "feedback": "Strong opening hook with the CFO's dilemma. Tension well-maintained...",
      "specificIssues": ["Section 3 exposition-heavy", "Could use more dialogue"]
    },
    "protagonistDepth": {
      "score": 14,
      "maxPoints": 15,
      "grade": "A-",
      "feedback": "Sarah Chen feels authentic...",
      "specificIssues": ["Personal stakes could be clearer"]
    },
    "businessRigor": {
      "score": 17,
      "maxPoints": 20,
      "grade": "B+",
      "feedback": "Good financial data but...",
      "specificIssues": ["Missing competitor market share data"]
    },
    "exhibitIntegration": {
      "score": 13,
      "maxPoints": 15,
      "grade": "B+",
      "feedback": "Good variety but...",
      "specificIssues": ["Exhibit 3 doesn't connect to narrative"]
    },
    "questionQuality": {
      "score": 13,
      "maxPoints": 15,
      "grade": "B+",
      "feedback": "Good progression but...",
      "specificIssues": ["No framework application question"]
    },
    "cohesion": {
      "score": 9,
      "maxPoints": 10,
      "grade": "A-",
      "feedback": "Elements work well together...",
      "specificIssues": []
    }
  },
  
  "overallFeedback": "A strong case that captures the complexity of the strategic decision...",
  
  "strengths": [
    "Compelling opening that immediately establishes stakes",
    "Protagonist feels genuine and relatable",
    "Good use of real executive quotes with attribution"
  ],
  
  "weaknesses": [
    "Section 3 relies too heavily on exposition rather than showing through story",
    "Exhibit 3 (waterfall chart) doesn't directly support the narrative"
  ],
  
  "improvementSuggestions": [
    {
      "category": "narrativeQuality",
      "priority": "high",
      "issue": "Section 3 is exposition-heavy",
      "suggestion": "Add a scene with the protagonist reviewing the data with a colleague",
      "exampleFix": "Instead of 'The market had shifted...' try 'Sarah spread the analyst reports across her desk. \"Look at these numbers,\" she said to Marcus...'"
    },
    {
      "category": "exhibitIntegration",
      "priority": "medium",
      "issue": "Waterfall chart disconnected from narrative",
      "suggestion": "Reference the chart in Section 4 when discussing financial impact"
    }
  ],
  
  "weakestCategory": "businessRigor",
  "prioritizedFixes": [
    "Add competitor market share comparison exhibit",
    "Include more specific financial projections for each option",
    "Reference industry analyst perspective in narrative"
  ]
}`
}

// ============================================================================
// Improvement Prompt
// ============================================================================

export function getCaseImprovementPrompt(
  caseContent: CaseContent,
  gradeResult: CaseGradeResult,
  targetCategory: string
): string {
  const categoryFeedback = gradeResult.breakdown[targetCategory as keyof typeof gradeResult.breakdown]
  const relevantSuggestions = gradeResult.improvementSuggestions
    .filter(s => s.category === targetCategory)
  
  return `Improve this case study to achieve an A- or better grade.

CURRENT GRADE: ${gradeResult.grade} (${gradeResult.score}/100)

FOCUS AREA: ${targetCategory}
Current Score: ${categoryFeedback.score}/${categoryFeedback.maxPoints}
Feedback: ${categoryFeedback.feedback}

SPECIFIC ISSUES TO FIX:
${categoryFeedback.specificIssues.map(i => `- ${i}`).join('\n')}

IMPROVEMENT SUGGESTIONS:
${relevantSuggestions.map(s => `
- Issue: ${s.issue}
  Suggestion: ${s.suggestion}
  ${s.exampleFix ? `Example: ${s.exampleFix}` : ''}
`).join('\n')}

PRIORITIZED FIXES:
${gradeResult.prioritizedFixes.map((f, i) => `${i + 1}. ${f}`).join('\n')}

CURRENT CONTENT:
${JSON.stringify(caseContent, null, 2)}

---

Rewrite the affected sections to address these issues. Maintain the overall structure but improve the targeted areas.

Respond with the improved case content in the same JSON format as the original.`
}

// ============================================================================
// Helper Functions
// ============================================================================

export function scoreToGrade(score: number): string {
  for (const [grade, threshold] of Object.entries(GRADE_THRESHOLDS)) {
    if (score >= threshold) {
      return grade
    }
  }
  return 'F'
}

export function gradeToScore(grade: string): number {
  return GRADE_THRESHOLDS[grade as keyof typeof GRADE_THRESHOLDS] ?? 0
}

export function isPublishReady(grade: string): boolean {
  const score = GRADE_THRESHOLDS[grade as keyof typeof GRADE_THRESHOLDS]
  return score >= MINIMUM_ACCEPTABLE_SCORE
}

export function shouldImprove(gradeResult: CaseGradeResult, iteration: number): boolean {
  return !gradeResult.isPublishReady && iteration < MAX_IMPROVEMENT_ITERATIONS
}

export function parseGradingResponse(response: string): CaseGradeResult {
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in grading response')
    }
    
    const parsed = JSON.parse(jsonMatch[0])
    
    // Ensure all required fields exist
    return {
      grade: parsed.grade || 'C',
      score: parsed.score || 70,
      isPublishReady: parsed.isPublishReady ?? false,
      breakdown: parsed.breakdown || createDefaultBreakdown(),
      overallFeedback: parsed.overallFeedback || 'Unable to parse detailed feedback',
      strengths: parsed.strengths || [],
      weaknesses: parsed.weaknesses || [],
      improvementSuggestions: parsed.improvementSuggestions || [],
      weakestCategory: parsed.weakestCategory || 'narrativeQuality',
      prioritizedFixes: parsed.prioritizedFixes || [],
    }
  } catch (error) {
    console.error('Failed to parse grading response:', error)
    return createDefaultGradeResult()
  }
}

function createDefaultBreakdown(): CaseGradeResult['breakdown'] {
  const categories = Object.keys(CATEGORY_WEIGHTS) as Array<keyof typeof CATEGORY_WEIGHTS>
  const breakdown: Partial<CaseGradeResult['breakdown']> = {}
  
  for (const category of categories) {
    breakdown[category] = {
      score: Math.round(CATEGORY_WEIGHTS[category] * 0.7),
      maxPoints: CATEGORY_WEIGHTS[category],
      grade: 'C',
      feedback: 'Unable to evaluate',
      specificIssues: [],
    }
  }
  
  return breakdown as CaseGradeResult['breakdown']
}

function createDefaultGradeResult(): CaseGradeResult {
  return {
    grade: 'C',
    score: 70,
    isPublishReady: false,
    breakdown: createDefaultBreakdown(),
    overallFeedback: 'Unable to grade case - manual review required',
    strengths: [],
    weaknesses: ['Grading system encountered an error'],
    improvementSuggestions: [],
    weakestCategory: 'narrativeQuality',
    prioritizedFixes: ['Manual review required'],
  }
}

/**
 * Get a summary of the grade for logging
 */
export function getGradeSummary(result: CaseGradeResult): string {
  const categoryScores = Object.entries(result.breakdown)
    .map(([name, cat]) => `${name}: ${cat.score}/${cat.maxPoints}`)
    .join(', ')
  
  return `Case Grade: ${result.grade} (${result.score}/100)
  Publish Ready: ${result.isPublishReady ? 'Yes' : 'No'}
  Categories: ${categoryScores}
  Weakest: ${result.weakestCategory}
  Strengths: ${result.strengths.length}, Weaknesses: ${result.weaknesses.length}
  Suggestions: ${result.improvementSuggestions.length}`
}

/**
 * Get the category that needs the most improvement
 */
export function getWeakestCategory(breakdown: CaseGradeResult['breakdown']): string {
  let weakest = 'narrativeQuality'
  let lowestRatio = 1
  
  for (const [category, data] of Object.entries(breakdown)) {
    const ratio = data.score / data.maxPoints
    if (ratio < lowestRatio) {
      lowestRatio = ratio
      weakest = category
    }
  }
  
  return weakest
}

export { MINIMUM_ACCEPTABLE_SCORE, MAX_IMPROVEMENT_ITERATIONS }

