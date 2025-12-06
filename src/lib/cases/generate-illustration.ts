import { prisma } from '@/lib/db'
import { getGeminiImageProvider } from '@/lib/ai/providers/gemini-image'
import type { IllustrationContext, IllustrationResult } from '@/lib/ai/providers/gemini-image'
import type { CaseContent } from './types'
import * as fs from 'fs'
import * as path from 'path'

/**
 * Result of the illustration generation phase
 */
export interface IllustrationPhaseResult {
  imagePath: string | null
  illustrationPrompt: string | null
  error?: string
}

/**
 * Run the illustration generation phase
 * Generates a Claude/Anthropic-style editorial illustration for the case
 */
export async function runIllustrationGenerationPhase(
  caseContent: CaseContent,
  brandColor?: string | null
): Promise<IllustrationPhaseResult> {
  // Check if Gemini API key is configured
  if (!process.env.GOOGLE_AI_API_KEY) {
    console.warn('GOOGLE_AI_API_KEY not configured, skipping illustration generation')
    return {
      imagePath: null,
      illustrationPrompt: null,
      error: 'Gemini API key not configured',
    }
  }

  try {
    // Get recently used illustration descriptions for variety
    const recentObjects = await getRecentIllustrationDescriptions(10)

    // Build illustration context
    const context: IllustrationContext = {
      title: caseContent.title,
      company: caseContent.company,
      industry: caseContent.industry,
      summary: caseContent.summary,
      keyChallenge: extractKeyChallenge(caseContent),
      brandColor: brandColor || undefined,
      recentObjects,
    }

    // Generate illustration
    const provider = getGeminiImageProvider()
    const result = await provider.generateIllustration(context)

    // Save the image to public folder
    const imagePath = await saveIllustrationImage(result, caseContent.title)

    return {
      imagePath,
      illustrationPrompt: result.objectDescription,
    }
  } catch (error) {
    console.error('Illustration generation failed:', error)
    return {
      imagePath: null,
      illustrationPrompt: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Regenerate illustration for an existing case
 */
export async function regenerateIllustration(
  caseId: string
): Promise<IllustrationPhaseResult> {
  // Fetch case data
  const caseData = await prisma.case.findUnique({
    where: { id: caseId },
    select: {
      title: true,
      company: true,
      industry: true,
      summary: true,
      content: true,
      brandColor: true,
      slug: true,
    },
  })

  if (!caseData) {
    return {
      imagePath: null,
      illustrationPrompt: null,
      error: 'Case not found',
    }
  }

  // Parse content to build CaseContent
  let sections: { title: string; content: string }[] = []
  try {
    const parsed = caseData.content ? JSON.parse(caseData.content) : null
    if (Array.isArray(parsed)) {
      sections = parsed
    } else if (parsed?.sections && Array.isArray(parsed.sections)) {
      sections = parsed.sections
    }
  } catch {
    // Content parse failed, use empty sections
  }

  const caseContent: CaseContent = {
    title: caseData.title,
    company: caseData.company,
    industry: caseData.industry,
    summary: caseData.summary,
    sections,
  }

  // Generate new illustration
  const result = await runIllustrationGenerationPhase(caseContent, caseData.brandColor)

  // Update case with new image path if successful
  if (result.imagePath) {
    await prisma.case.update({
      where: { id: caseId },
      data: {
        featuredImage: result.imagePath,
        illustrationPrompt: result.illustrationPrompt,
      },
    })
  }

  return result
}

/**
 * Get recent illustration descriptions for variety system
 */
async function getRecentIllustrationDescriptions(limit: number): Promise<string[]> {
  const recentCases = await prisma.case.findMany({
    where: {
      featuredImage: { not: null },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: {
      title: true,
      industry: true,
      illustrationPrompt: true,
    },
  })

  // Return illustration prompts if available, otherwise construct from title/industry
  return recentCases.map(c => 
    c.illustrationPrompt || `${c.industry.toLowerCase()} - ${c.title.slice(0, 30)}`
  )
}

/**
 * Extract key challenge from case content
 */
function extractKeyChallenge(caseContent: CaseContent): string | undefined {
  // Try to find the main challenge from the first section or summary
  if (caseContent.sections.length > 0) {
    const firstSection = caseContent.sections[0]
    // Return first 200 chars of first section as challenge context
    return firstSection.content.slice(0, 200)
  }
  return undefined
}

/**
 * Save illustration image to public folder
 */
async function saveIllustrationImage(
  result: IllustrationResult,
  caseTitle: string
): Promise<string> {
  // Create a slug-like filename from the case title
  const slugifiedTitle = caseTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50)

  const timestamp = Date.now()
  const filename = `${slugifiedTitle}-${timestamp}.png`

  // Ensure the illustrations directory exists
  const illustrationsDir = path.join(process.cwd(), 'public', 'illustrations')
  if (!fs.existsSync(illustrationsDir)) {
    fs.mkdirSync(illustrationsDir, { recursive: true })
  }

  // Decode base64 and save
  const imageBuffer = Buffer.from(result.imageData, 'base64')
  const filePath = path.join(illustrationsDir, filename)
  fs.writeFileSync(filePath, imageBuffer)

  // Return the public path
  return `/illustrations/${filename}`
}

