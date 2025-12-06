import { prisma } from '@/lib/db'
import type {
  AIProvider,
  ContentAnalysis,
  ConceptOption,
} from './types'
import type { GenerateCaseInput } from '@/lib/validations/schemas'

/**
 * Result of the analysis/auto-detection phase
 */
export interface AnalysisResult {
  companyName: string
  industry: string
  targetConcepts: string[]
  analysis?: ContentAnalysis
}

/**
 * Analyze source content and auto-detect company, industry, and concepts
 * if not explicitly provided in the input.
 */
export async function analyzeAndDetectMetadata(
  provider: AIProvider,
  input: GenerateCaseInput
): Promise<AnalysisResult> {
  const {
    sourceArticle,
    companyName: providedCompanyName,
    industry: providedIndustry,
    targetConcepts: providedConcepts,
  } = input

  let companyName = providedCompanyName
  let industry = providedIndustry
  let targetConcepts = providedConcepts
  let analysis: ContentAnalysis | undefined

  // Check if we need to auto-detect anything
  const needsAutoDetection =
    !companyName ||
    !industry ||
    !targetConcepts ||
    targetConcepts.length === 0

  if (needsAutoDetection) {
    // Fetch all concepts from database for the AI to choose from
    const allConcepts = await prisma.concept.findMany({
      select: { name: true, category: true },
    })

    const conceptOptions: ConceptOption[] = allConcepts.map((c) => ({
      name: c.name,
      category: c.category,
    }))

    // Run AI analysis
    analysis = await provider.analyzeContent(sourceArticle, conceptOptions)

    // Fill in missing fields from analysis
    if (!companyName) {
      companyName = analysis.company.name
    }

    if (!industry) {
      industry = analysis.industry.primary
    }

    if (!targetConcepts || targetConcepts.length === 0) {
      targetConcepts = analysis.recommendedConcepts.map((c) => c.name)
    }
  }

  return {
    companyName: companyName!,
    industry: industry!,
    targetConcepts: targetConcepts || [],
    analysis,
  }
}

