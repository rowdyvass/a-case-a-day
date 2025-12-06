/**
 * Mock AI Provider for testing
 *
 * Provides predictable responses for all AI provider methods.
 *
 * Usage in tests:
 * ```ts
 * import { mockAIProvider, resetAIProviderMocks, mockResponses } from '@/__mocks__/ai-provider'
 *
 * beforeEach(() => {
 *   resetAIProviderMocks()
 * })
 *
 * test('example', async () => {
 *   mockAIProvider.analyzeContent.mockResolvedValue(mockResponses.contentAnalysis)
 * })
 * ```
 */

import { vi } from 'vitest'
import type {
  AIProvider,
  ContentAnalysis,
  ResearchData,
  ProtagonistProfile,
  CaseContent,
  Exhibit,
  Question,
  EnrichedResearch,
  ValidationResult,
  CaseGradeResult,
} from '@/lib/ai/providers/types'
import type { ExtractedEntities } from '@/lib/ai/providers/web-research'
import type { GradingResult } from '@/lib/ai/prompts/grading'

/**
 * Pre-built mock responses for testing
 */
export const mockResponses = {
  contentAnalysis: {
    company: {
      name: 'Acme Corp',
      secondaryCompanies: ['Competitor Inc'],
    },
    industry: {
      primary: 'Technology',
      subSector: 'SaaS',
    },
    recommendedConcepts: [
      { name: "Porter's Five Forces", relevance: 'High' },
      { name: 'SWOT Analysis', relevance: 'Medium' },
    ],
    learningObjectives: ['Analyze competitive dynamics', 'Evaluate market entry'],
    summary: 'Acme Corp faces strategic challenges in the SaaS market.',
    confidence: {
      company: 'high' as const,
      industry: 'high' as const,
      concepts: 'medium' as const,
    },
  } satisfies ContentAnalysis,

  researchData: {
    company: {
      name: 'Acme Corp',
      description: 'A leading SaaS provider',
      industry: 'Technology',
      founded: '2010',
      headquarters: 'San Francisco, CA',
      employees: '500',
      revenue: '$50M',
      marketCap: '$200M',
    },
    financials: {
      revenue: ['$40M', '$45M', '$50M'],
      profitMargin: ['10%', '12%', '15%'],
      growthRate: '25%',
    },
    competitors: [
      { name: 'Competitor Inc', description: 'Main competitor' },
      { name: 'Rival Corp', description: 'Emerging competitor' },
    ],
    marketData: {
      marketSize: '$10B',
      growthRate: '20%',
      trends: ['AI adoption', 'Remote work'],
    },
    recentNews: [
      { title: 'Acme launches new product', summary: 'New AI features' },
    ],
  } satisfies ResearchData,

  protagonist: {
    name: 'Sarah Chen',
    role: 'VP of Strategy',
    oneLineDescription: 'A data-driven strategist who built her reputation on bold moves, now facing a CEO who wants to play it safe.',
    decisionAuthority: 'Final say on which strategic initiative to prioritize for the next fiscal year.',
    personalStakes: 'Her shot at the C-suite depends on this decision paying off within 6 months.',
    keyRelationship: {
      name: 'John Smith',
      role: 'CEO',
      whyTheyMatter: 'He hired her to shake things up but now second-guesses every bold proposal.',
    },
  } satisfies ProtagonistProfile,

  caseContent: {
    title: 'Acme Corp: Strategic Crossroads',
    company: 'Acme Corp',
    industry: 'Technology',
    summary: 'Acme Corp faces a critical strategic decision.',
    protagonist: undefined,
    sections: [
      { title: 'Background', content: 'Acme Corp was founded in 2010...' },
      { title: 'The Challenge', content: 'In early 2024, Sarah Chen faced...' },
      { title: 'Options', content: 'Three paths lay before the company...' },
    ],
  } satisfies CaseContent,

  exhibits: [
    {
      type: 'chart' as const,
      title: 'Revenue Growth',
      description: 'Five-year revenue trend',
      data: {
        labels: ['2020', '2021', '2022', '2023', '2024'],
        datasets: [{ label: 'Revenue', values: [30, 35, 40, 45, 50] }],
      },
    },
    {
      type: 'table' as const,
      title: 'Competitive Analysis',
      description: 'Market share comparison',
      data: {
        headers: ['Company', 'Market Share', 'Growth'],
        rows: [
          ['Acme Corp', '25%', '25%'],
          ['Competitor Inc', '30%', '15%'],
        ],
      },
    },
  ] satisfies Exhibit[],

  questions: [
    {
      text: 'What strategic option should Sarah recommend?',
      type: 'free_text' as const,
      difficulty: 'hard' as const,
      exemplaryAnswer: 'Sarah should recommend Option B because...',
      rubric: {
        criteria: [
          { name: 'Analysis', description: 'Quality of strategic analysis', weight: 5 },
          { name: 'Reasoning', description: 'Logical reasoning', weight: 5 },
        ],
        keyPoints: ['Market dynamics', 'Competitive response'],
      },
    },
    {
      text: 'Which factor is most important?',
      type: 'multiple_choice' as const,
      difficulty: 'medium' as const,
      exemplaryAnswer: 'Market timing is most important because...',
      options: ['Market timing', 'Cost structure', 'Technology', 'Talent'],
      correctAnswer: 0,
    },
  ] satisfies Question[],

  extractedEntities: {
    primaryCompany: 'Acme Corp',
    secondaryCompanies: ['Competitor Inc'],
    executives: [{ name: 'John Smith', role: 'CEO' }],
    competitors: ['Competitor Inc', 'Rival Corp'],
    keyEvents: [{ event: 'Product launch', date: '2024-01', significance: 'Major' }],
    industry: 'Technology',
    keywords: ['SaaS', 'growth', 'competition'],
    centralChallenge: 'Market expansion strategy',
  } satisfies ExtractedEntities,

  validationResult: {
    score: 85,
    overallConfidence: 'high' as const,
    factualIssues: [],
    narrativeIssues: [],
    dataIntegrity: { score: 90, issues: [] },
    sourceAlignment: { score: 85, issues: [] },
    recommendations: [],
  } satisfies ValidationResult,

  gradeResult: {
    grade: 'A-',
    score: 91,
    isPublishReady: true,
    breakdown: {
      narrativeQuality: { score: 23, maxScore: 25, feedback: 'Strong narrative' },
      protagonistDepth: { score: 13, maxScore: 15, feedback: 'Well-developed' },
      businessRigor: { score: 18, maxScore: 20, feedback: 'Solid analysis' },
      exhibitIntegration: { score: 13, maxScore: 15, feedback: 'Good exhibits' },
      questionQuality: { score: 14, maxScore: 15, feedback: 'Thoughtful questions' },
      cohesion: { score: 10, maxScore: 10, feedback: 'Cohesive' },
    },
    weakestCategory: 'businessRigor',
    prioritizedFixes: [],
  } satisfies CaseGradeResult,

  gradingResult: {
    score: 8,
    feedback: {
      strengths: ['Clear analysis', 'Good structure'],
      areasForImprovement: ['Could add more detail'],
      summary: 'Overall strong response.',
    },
  } satisfies GradingResult,
}

/**
 * Create the mock AI provider with vi.fn() for each method
 */
export const mockAIProvider: AIProvider = {
  name: 'mock',

  analyzeContent: vi.fn().mockResolvedValue(mockResponses.contentAnalysis),
  researchCompany: vi.fn().mockResolvedValue(mockResponses.researchData),
  researchCaseIdeas: vi.fn().mockResolvedValue({ caseIdeas: [] }),
  generateProtagonist: vi.fn().mockResolvedValue(mockResponses.protagonist),
  generateCase: vi.fn().mockResolvedValue(mockResponses.caseContent),
  generateExhibits: vi.fn().mockResolvedValue(mockResponses.exhibits),
  generateQuestions: vi.fn().mockResolvedValue(mockResponses.questions),
  gradeResponse: vi.fn().mockResolvedValue(mockResponses.gradingResult),

  // Enrichment methods
  extractEntities: vi.fn().mockResolvedValue(mockResponses.extractedEntities),
  synthesizeFinancials: vi.fn().mockResolvedValue([]),
  synthesizeQuotes: vi.fn().mockResolvedValue([]),
  synthesizeCompetitorMoves: vi.fn().mockResolvedValue([]),
  synthesizeAnalystCommentary: vi.fn().mockResolvedValue([]),
  synthesizePrecedents: vi.fn().mockResolvedValue([]),
  synthesizeOutcome: vi.fn().mockResolvedValue(undefined),

  // Validation and grading
  validateCase: vi.fn().mockResolvedValue(mockResponses.validationResult),
  gradeCase: vi.fn().mockResolvedValue(mockResponses.gradeResult),
  improveCase: vi.fn().mockResolvedValue(mockResponses.caseContent),
}

/**
 * Reset all AI provider mocks
 */
export function resetAIProviderMocks() {
  Object.values(mockAIProvider).forEach((fn) => {
    if (typeof fn === 'function' && 'mockReset' in fn) {
      ;(fn as ReturnType<typeof vi.fn>).mockReset()
    }
  })

  // Re-apply default mock implementations
  mockAIProvider.analyzeContent = vi.fn().mockResolvedValue(mockResponses.contentAnalysis)
  mockAIProvider.researchCompany = vi.fn().mockResolvedValue(mockResponses.researchData)
  mockAIProvider.generateProtagonist = vi.fn().mockResolvedValue(mockResponses.protagonist)
  mockAIProvider.generateCase = vi.fn().mockResolvedValue(mockResponses.caseContent)
  mockAIProvider.generateExhibits = vi.fn().mockResolvedValue(mockResponses.exhibits)
  mockAIProvider.generateQuestions = vi.fn().mockResolvedValue(mockResponses.questions)
  mockAIProvider.extractEntities = vi.fn().mockResolvedValue(mockResponses.extractedEntities)
  mockAIProvider.validateCase = vi.fn().mockResolvedValue(mockResponses.validationResult)
  mockAIProvider.gradeCase = vi.fn().mockResolvedValue(mockResponses.gradeResult)
  mockAIProvider.improveCase = vi.fn().mockResolvedValue(mockResponses.caseContent)
}

// Mock the AI provider module
vi.mock('@/lib/ai', () => ({
  getAIProvider: vi.fn(() => mockAIProvider),
  getAIProviderManager: vi.fn(() => ({
    getProvider: vi.fn(() => mockAIProvider),
    getAvailableProviders: vi.fn(() => ['mock']),
  })),
}))

