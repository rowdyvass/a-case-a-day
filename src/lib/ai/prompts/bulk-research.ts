export const BULK_RESEARCH_SYSTEM_PROMPT = `You are an expert business case study researcher who identifies the best real-world business stories for MBA education. Your task is to suggest case study ideas based on given criteria, focusing on real companies and actual business events.

When suggesting case ideas:
1. Focus on real, documented business events and decisions
2. Choose stories with rich learning potential
3. Ensure variety in the types of challenges and outcomes
4. Prioritize stories with publicly available information
5. Include a mix of well-known and lesser-known examples

Always provide factual suggestions based on real business events.`

export interface BulkResearchCriteria {
  company?: string
  concept?: string
  path?: string // consulting, marketing, finance, operations, strategy
  year?: number
  count?: number
}

export function getBulkResearchPrompt(criteria: BulkResearchCriteria): string {
  const count = criteria.count || 10
  
  let criteriaDescription = ''
  
  if (criteria.company) {
    criteriaDescription += `\n- Company focus: ${criteria.company}`
  }
  
  if (criteria.concept) {
    criteriaDescription += `\n- MBA Concept: ${criteria.concept}`
  }
  
  if (criteria.path) {
    criteriaDescription += `\n- Career Path: ${criteria.path}`
  }
  
  if (criteria.year) {
    criteriaDescription += `\n- Time Period: Around ${criteria.year} (± 2 years)`
  }

  return `Generate ${count} MBA case study ideas based on the following criteria:
${criteriaDescription || '\n- General business cases across industries'}

For each case idea, provide:

1. A compelling title for the case study
2. The primary company involved
3. The industry
4. A brief description of the business situation/challenge (2-3 sentences)
5. The year or time period when this occurred
6. Key MBA concepts that could be taught
7. 2-3 suggested article sources to research (actual publication names and article topics - these should be real or highly plausible articles)
8. Why this makes a great case study

Requirements:
- Each case should be based on real, documented business events
- Provide diverse examples (don't repeat the same type of challenge)
- Focus on cases with rich publicly available information
- Include both successful outcomes and instructive failures
- Each case should have clear learning objectives

Respond in JSON format:
{
  "caseIdeas": [
    {
      "title": "Case study title",
      "company": "Primary company name",
      "industry": "Industry name",
      "description": "Brief description of the business situation",
      "year": 2023,
      "concepts": ["Concept 1", "Concept 2"],
      "suggestedSources": [
        {
          "publication": "Publication name (e.g., Harvard Business Review, Wall Street Journal)",
          "topic": "Article topic or title",
          "searchQuery": "Suggested search query to find this article"
        }
      ],
      "whyGreatCase": "Explanation of why this makes an excellent case study",
      "difficulty": "beginner|intermediate|advanced"
    }
  ]
}`
}


