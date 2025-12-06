import { GoogleGenAI } from '@google/genai'
import { buildIllustrationPrompt, getIndustryColor } from '../prompts/illustration'

/**
 * Gemini Image Generation Provider
 * Uses Gemini 2.5 Flash Preview (Nano Banana) for generating case illustrations
 */

export interface IllustrationResult {
  imageData: string // Base64 encoded image data
  mimeType: string
  prompt: string // The full prompt used (for tracking/variety)
  objectDescription: string // Brief description of the main object (for variety system)
}

export interface IllustrationContext {
  title: string
  company: string
  industry: string
  summary: string
  keyChallenge?: string
  brandColor?: string // Hex color to use as background
  recentObjects?: string[] // Objects used in recent cases (to avoid repetition)
}

class GeminiImageProvider {
  private client: GoogleGenAI
  // Use Gemini 2.5 Flash Image model (Nano Banana) for image generation
  private model: string = 'gemini-2.5-flash-image'

  constructor() {
    const apiKey = process.env.GOOGLE_AI_API_KEY
    if (!apiKey) {
      throw new Error('GOOGLE_AI_API_KEY environment variable is not set')
    }
    this.client = new GoogleGenAI({ apiKey })
  }

  /**
   * Generate a case illustration in the Claude/Anthropic style
   */
  async generateIllustration(context: IllustrationContext): Promise<IllustrationResult> {
    const backgroundColor = this.selectBackgroundColor(context)
    const prompt = buildIllustrationPrompt({
      title: context.title,
      company: context.company,
      industry: context.industry,
      summary: context.summary,
      keyChallenge: context.keyChallenge,
      backgroundColor,
      recentObjects: context.recentObjects,
    })

    try {
      const response = await this.client.models.generateContent({
        model: this.model,
        contents: prompt,
        config: {
          responseModalities: ['Text', 'Image'],
        },
      })

      // Extract image from response
      const parts = response.candidates?.[0]?.content?.parts
      if (!parts) {
        throw new Error('No content in Gemini response')
      }

      for (const part of parts) {
        if (part.inlineData) {
          const objectDescription = this.extractObjectDescription(context)
          return {
            imageData: part.inlineData.data as string,
            mimeType: part.inlineData.mimeType || 'image/png',
            prompt,
            objectDescription,
          }
        }
      }

      throw new Error('No image data in Gemini response')
    } catch (error) {
      console.error('Gemini image generation failed:', error)
      throw error
    }
  }

  /**
   * Select background color based on brand color or industry
   */
  private selectBackgroundColor(context: IllustrationContext): string {
    if (context.brandColor) {
      return context.brandColor
    }
    return getIndustryColor(context.industry)
  }

  /**
   * Extract a brief object description for tracking variety
   */
  private extractObjectDescription(context: IllustrationContext): string {
    // Create a brief description based on case context for variety tracking
    return `${context.industry.toLowerCase()} - ${context.title.slice(0, 50)}`
  }
}

// Singleton instance
let geminiImageProvider: GeminiImageProvider | null = null

export function getGeminiImageProvider(): GeminiImageProvider {
  if (!geminiImageProvider) {
    geminiImageProvider = new GeminiImageProvider()
  }
  return geminiImageProvider
}

export { GeminiImageProvider }

