/**
 * Post-Generation Validation Prompt
 * 
 * Validates generated case studies against source data to ensure
 * factual accuracy, consistent numbers, and proper attribution.
 */

import type { CaseContent } from '../providers/types'
import type { EnrichedResearch } from '../providers/web-research'

export interface ValidationResult {
  isValid: boolean
  overallConfidence: 'high' | 'medium' | 'low'
  score: number // 0-100
  
  factualIssues: {
    severity: 'error' | 'warning' | 'info'
    description: string
    location?: string // Section or quote where issue was found
    suggestion?: string
  }[]
  
  quoteValidation: {
    quote: string
    isVerified: boolean
    attributionCorrect: boolean
    issue?: string
  }[]
  
  numberValidation: {
    number: string
    context: string
    matchesSource: boolean
    sourceValue?: string
    issue?: string
  }[]
  
  timelineConsistency: {
    isConsistent: boolean
    issues: string[]
  }
  
  suggestions: string[]
}

export const VALIDATION_SYSTEM_PROMPT = `You are an expert fact-checker for MBA case studies. Your task is to validate that a generated case study accurately reflects its source materials.

You should check:
1. FACTUAL ACCURACY - Do numbers, dates, and claims match the source data?
2. QUOTE VERIFICATION - Are attributed quotes accurate and properly sourced?
3. TIMELINE CONSISTENCY - Are dates and event sequences internally consistent?
4. CLAIM VERIFICATION - Are assertions supported by the provided research?

Be rigorous but fair. Flag clear errors as "error", potential issues as "warning", and minor concerns as "info".`

export function getValidationPrompt(
  caseContent: CaseContent,
  sourceArticle: string,
  enrichedResearch?: EnrichedResearch
): string {
  const sectionsText = caseContent.sections
    .map(s => `## ${s.title}\n${s.content}`)
    .join('\n\n')

  const enrichedDataSection = enrichedResearch ? `

ENRICHED RESEARCH DATA (verified facts to check against):

Financial Data:
${enrichedResearch.financials.map(f => `- ${f.metric}: ${f.value} (${f.period || 'N/A'}) [${f.source}]`).join('\n') || 'None provided'}

Real Quotes Provided:
${enrichedResearch.realQuotes.map(q => `- "${q.text}" — ${q.speaker}, ${q.role} (${q.source})`).join('\n') || 'None provided'}

Competitor Information:
${enrichedResearch.competitorMoves.map(c => `- ${c.name}: ${c.reaction || c.competitiveMove}`).join('\n') || 'None provided'}

Analyst Commentary:
${enrichedResearch.analystPerspectives.map(a => `- ${a.analyst}: "${a.comment}"`).join('\n') || 'None provided'}
` : ''

  return `Validate the following case study against its source materials.

GENERATED CASE STUDY:
Title: ${caseContent.title}
Company: ${caseContent.company}
Industry: ${caseContent.industry}
Summary: ${caseContent.summary}

${sectionsText}

---

SOURCE ARTICLE:
${sourceArticle.slice(0, 10000)}
${enrichedDataSection}
---

Please validate this case study by checking:

1. FACTUAL ACCURACY
   - Do financial numbers in the case match the source data?
   - Are company details (founding date, employees, etc.) accurate?
   - Are market statistics and industry claims supported?

2. QUOTE VERIFICATION
   - For quotes attributed to real people, do they match the provided quotes?
   - Are attributions (name, title, source) correct?
   - Are fictional quotes clearly not attributed to real people?

3. TIMELINE CONSISTENCY
   - Are dates mentioned in the case internally consistent?
   - Does the timeline match the source article?
   - Are there any anachronisms or impossible sequences?

4. CLAIM VERIFICATION
   - Are competitive claims about other companies accurate?
   - Are industry trends and market dynamics properly represented?
   - Are there any unsupported assertions?

Respond in JSON format:
{
  "isValid": true,
  "overallConfidence": "high|medium|low",
  "score": 85,
  
  "factualIssues": [
    {
      "severity": "error|warning|info",
      "description": "Description of the issue",
      "location": "Section name or 'Quote by X'",
      "suggestion": "How to fix it"
    }
  ],
  
  "quoteValidation": [
    {
      "quote": "The quote text...",
      "isVerified": true,
      "attributionCorrect": true,
      "issue": "Issue description if any"
    }
  ],
  
  "numberValidation": [
    {
      "number": "$50 billion",
      "context": "Company revenue claim",
      "matchesSource": true,
      "sourceValue": "$50.2 billion",
      "issue": "Minor rounding difference"
    }
  ],
  
  "timelineConsistency": {
    "isConsistent": true,
    "issues": ["Any timeline issues found"]
  },
  
  "suggestions": [
    "Suggestion 1 for improvement",
    "Suggestion 2 for improvement"
  ]
}`
}

/**
 * Parse validation response
 */
export function parseValidationResponse(response: string): ValidationResult {
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in validation response')
    }
    
    const parsed = JSON.parse(jsonMatch[0])
    
    return {
      isValid: Boolean(parsed.isValid ?? true),
      overallConfidence: parsed.overallConfidence || 'medium',
      score: typeof parsed.score === 'number' ? parsed.score : 70,
      
      factualIssues: Array.isArray(parsed.factualIssues) 
        ? parsed.factualIssues 
        : [],
      
      quoteValidation: Array.isArray(parsed.quoteValidation)
        ? parsed.quoteValidation
        : [],
      
      numberValidation: Array.isArray(parsed.numberValidation)
        ? parsed.numberValidation
        : [],
      
      timelineConsistency: parsed.timelineConsistency || {
        isConsistent: true,
        issues: []
      },
      
      suggestions: Array.isArray(parsed.suggestions)
        ? parsed.suggestions
        : []
    }
  } catch (error) {
    console.error('Failed to parse validation response:', error)
    // Return a default validation result indicating parsing failure
    return {
      isValid: true,
      overallConfidence: 'low',
      score: 50,
      factualIssues: [{
        severity: 'warning',
        description: 'Unable to parse validation results',
        suggestion: 'Manual review recommended'
      }],
      quoteValidation: [],
      numberValidation: [],
      timelineConsistency: { isConsistent: true, issues: [] },
      suggestions: ['Manual review recommended due to validation parsing failure']
    }
  }
}

/**
 * Generate a summary of validation results for logging
 */
export function getValidationSummary(result: ValidationResult): string {
  const errorCount = result.factualIssues.filter(i => i.severity === 'error').length
  const warningCount = result.factualIssues.filter(i => i.severity === 'warning').length
  const infoCount = result.factualIssues.filter(i => i.severity === 'info').length
  
  const quotesVerified = result.quoteValidation.filter(q => q.isVerified).length
  const quotesTotal = result.quoteValidation.length
  
  const numbersMatch = result.numberValidation.filter(n => n.matchesSource).length
  const numbersTotal = result.numberValidation.length
  
  return `Validation: ${result.overallConfidence} confidence (${result.score}/100)
  Issues: ${errorCount} errors, ${warningCount} warnings, ${infoCount} info
  Quotes: ${quotesVerified}/${quotesTotal} verified
  Numbers: ${numbersMatch}/${numbersTotal} match sources
  Timeline: ${result.timelineConsistency.isConsistent ? 'Consistent' : 'Issues found'}`
}

/**
 * Determine if validation results require human review
 */
export function requiresHumanReview(result: ValidationResult): boolean {
  // Require review if:
  // - Overall confidence is low
  // - There are any errors
  // - Score is below 60
  // - More than 2 warnings
  const errorCount = result.factualIssues.filter(i => i.severity === 'error').length
  const warningCount = result.factualIssues.filter(i => i.severity === 'warning').length
  
  return (
    result.overallConfidence === 'low' ||
    errorCount > 0 ||
    result.score < 60 ||
    warningCount > 2
  )
}


