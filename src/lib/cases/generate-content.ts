import type {
  AIProvider,
  ResearchData,
  CaseContent,
  ProtagonistProfile,
  EnrichedResearch,
} from './types'
import type { GenerationContext } from '@/lib/ai/providers/types'
import type { ContentPhaseResult } from './types'
import { getRecentNamesContext } from '@/lib/protagonists'

/**
 * Run the content generation phase: protagonist + case narrative
 */
export async function runContentGenerationPhase(
  provider: AIProvider,
  sourceArticle: string,
  companyName: string,
  industry: string,
  researchData: ResearchData,
  enrichedResearch: EnrichedResearch | undefined,
  targetConcepts: string[],
  learningObjectives?: string,
  additionalGuidance?: string
): Promise<ContentPhaseResult> {
  // Generate protagonist
  const protagonist = await generateProtagonist(
    provider,
    companyName,
    industry,
    sourceArticle,
    researchData
  )

  // Generate case content
  const caseContent = await generateCaseContent(
    provider,
    sourceArticle,
    researchData,
    enrichedResearch,
    protagonist,
    targetConcepts,
    learningObjectives,
    additionalGuidance
  )

  return {
    protagonist,
    caseContent,
  }
}

/**
 * Generate a fictional protagonist for the case
 */
async function generateProtagonist(
  provider: AIProvider,
  companyName: string,
  industry: string,
  sourceArticle: string,
  researchData: ResearchData
): Promise<ProtagonistProfile | undefined> {
  try {
    // Use first 2000 chars of article as situation summary
    const situationSummary = sourceArticle.slice(0, 2000)

    // Fetch recently used names to avoid collisions
    const recentNames = await getRecentNamesContext()

    return await provider.generateProtagonist(
      companyName,
      industry,
      situationSummary,
      researchData,
      recentNames
    )
  } catch (error) {
    // Log but don't fail - case can proceed without protagonist
    if (process.env.NODE_ENV === 'development') {
      console.warn('Failed to generate protagonist, proceeding without:', error)
    }
    return undefined
  }
}

/**
 * Generate the case narrative content
 */
async function generateCaseContent(
  provider: AIProvider,
  sourceArticle: string,
  researchData: ResearchData,
  enrichedResearch: EnrichedResearch | undefined,
  protagonist: ProtagonistProfile | undefined,
  targetConcepts: string[],
  learningObjectives?: string,
  additionalGuidance?: string
): Promise<CaseContent> {
  const context: GenerationContext = {
    sourceArticle,
    learningObjectives,
    targetConcepts,
    additionalGuidance,
    protagonist,
  }

  return provider.generateCase(context, researchData, enrichedResearch)
}

