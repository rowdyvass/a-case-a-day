export const ANALYZE_SYSTEM_PROMPT = `You are an expert business analyst who specializes in identifying companies, industries, and relevant MBA concepts from business articles and content. Your task is to analyze text and extract key metadata for case study creation.

When analyzing content, you should:
1. Identify the primary company being discussed
2. Determine the industry and sub-sector
3. Recommend MBA concepts that would be most relevant to teach using this content
4. Suggest learning objectives based on the content

Be precise and accurate. Only identify what is clearly present in the content.`

export interface ConceptOption {
  name: string
  category: string
}

export function getAnalyzePrompt(
  content: string,
  availableConcepts: ConceptOption[]
): string {
  const conceptList = availableConcepts
    .map(c => `- ${c.name} (${c.category})`)
    .join('\n')

  return `Analyze the following business article/content and extract key metadata for creating an MBA case study.

CONTENT TO ANALYZE:
---
${content.slice(0, 15000)}
---

AVAILABLE MBA CONCEPTS TO CHOOSE FROM:
${conceptList}

Please analyze the content and provide:

1. COMPANY IDENTIFICATION:
   - Primary company discussed in the article
   - Any secondary companies mentioned

2. INDUSTRY CLASSIFICATION:
   - Primary industry (choose from: Technology, Healthcare, Finance, Retail, Manufacturing, Energy, Media & Entertainment, Transportation, Real Estate, Consumer Goods, Telecommunications, Automotive, Aerospace & Defense, Agriculture, Education, Hospitality, Other)
   - Sub-sector or niche if applicable

3. CONCEPT RECOMMENDATIONS:
   - Select 3-5 MBA concepts from the available list that would be MOST relevant to teach using this content
   - Only select concepts that genuinely apply to the article's themes
   - Prioritize concepts where the article provides good real-world examples

4. LEARNING OBJECTIVES:
   - 2-3 key learning objectives that students could achieve from this case

5. ARTICLE SUMMARY:
   - A brief 1-2 sentence summary of what the article is about

Respond in JSON format:
{
  "company": {
    "name": "Primary company name",
    "secondaryCompanies": ["Other companies mentioned"]
  },
  "industry": {
    "primary": "Industry name",
    "subSector": "Sub-sector or null"
  },
  "recommendedConcepts": [
    {
      "name": "Concept name (must match exactly from available list)",
      "relevance": "Brief explanation of why this concept is relevant"
    }
  ],
  "learningObjectives": [
    "Learning objective 1",
    "Learning objective 2"
  ],
  "summary": "Brief article summary",
  "confidence": {
    "company": "high|medium|low",
    "industry": "high|medium|low",
    "concepts": "high|medium|low"
  }
}`
}


