export const RESEARCH_SYSTEM_PROMPT = `You are an expert business research analyst with deep knowledge of company financials, market dynamics, and competitive landscapes. Your task is to gather and synthesize comprehensive research data about companies and their industries.

When researching a company, provide:
1. Company overview (description, key metrics)
2. Financial highlights if available
3. Key competitors and their positioning
4. Market context and trends
5. Recent news and developments

Always respond with factual, well-researched information. If you don't have certain data, acknowledge the gaps rather than making up information.`

export function getResearchPrompt(companyName: string, industry: string): string {
  return `Research the company "${companyName}" in the ${industry} industry.

Please provide a comprehensive analysis including:

1. COMPANY OVERVIEW:
   - Company description and core business
   - Year founded, headquarters location
   - Approximate employee count
   - Revenue and market cap if publicly known

2. FINANCIAL HIGHLIGHTS:
   - Recent revenue figures (last 3 years if available)
   - Profit margins or profitability status
   - Growth trajectory

3. COMPETITIVE LANDSCAPE:
   - 3-5 main competitors
   - Brief description of each competitor's position

4. MARKET CONTEXT:
   - Estimated market size
   - Industry growth rate
   - Key trends affecting this market

5. RECENT DEVELOPMENTS:
   - 2-3 significant recent news items or events
   - Strategic moves or announcements

Respond in JSON format matching this structure:
{
  "company": {
    "name": "string",
    "description": "string",
    "industry": "string",
    "founded": "string or null",
    "headquarters": "string or null",
    "employees": "string or null",
    "revenue": "string or null",
    "marketCap": "string or null"
  },
  "financials": {
    "revenue": ["string array of yearly revenues"],
    "profitMargin": ["string array"],
    "growthRate": "string or null"
  },
  "competitors": [
    {"name": "string", "description": "string"}
  ],
  "marketData": {
    "marketSize": "string or null",
    "growthRate": "string or null",
    "trends": ["string array"]
  },
  "recentNews": [
    {"title": "string", "summary": "string"}
  ]
}`
}


