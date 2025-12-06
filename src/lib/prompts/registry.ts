/**
 * Prompt Version Registry
 * 
 * Manages versioned prompts for case generation.
 * Supports A/B testing, rollback, and tracking which prompts produced which cases.
 */

import { prisma } from '@/lib/db'

// ============================================================================
// Types
// ============================================================================

export type PromptType = 
  | 'analyze'
  | 'research'
  | 'protagonist'
  | 'case'
  | 'exhibits'
  | 'questions'
  | 'validation'
  | 'grading'
  | 'sufficiency'
  | 'enrichment'
  | 'entity_extraction'

export interface PromptVersion {
  id: string
  promptType: PromptType
  version: string
  name?: string
  content: string
  systemPrompt?: string
  isActive: boolean
  description?: string
  createdAt: Date
  createdBy?: string
}

export interface PromptVersionInput {
  promptType: PromptType
  name?: string
  content: string
  systemPrompt?: string
  description?: string
  createdBy?: string
}

export interface ActivePrompts {
  [key: string]: PromptVersion | null
}

// ============================================================================
// Default Prompt Versions
// ============================================================================

// Import default prompts for seeding
import { ANALYZE_SYSTEM_PROMPT } from '@/lib/ai/prompts/analyze'
import { RESEARCH_SYSTEM_PROMPT } from '@/lib/ai/prompts/research'
import { PROTAGONIST_SYSTEM_PROMPT } from '@/lib/ai/prompts/protagonist'
import { CASE_SYSTEM_PROMPT } from '@/lib/ai/prompts/case'
import { EXHIBITS_SYSTEM_PROMPT } from '@/lib/ai/prompts/exhibits'
import { QUESTIONS_SYSTEM_PROMPT } from '@/lib/ai/prompts/questions'
import { VALIDATION_SYSTEM_PROMPT } from '@/lib/ai/prompts/validation'
import { CASE_GRADING_SYSTEM_PROMPT } from '@/lib/ai/prompts/case-grading'
import { ENRICHMENT_SYNTHESIS_SYSTEM_PROMPT } from '@/lib/ai/prompts/enrichment'
import { ENTITY_EXTRACTION_SYSTEM_PROMPT } from '@/lib/ai/prompts/entity-extraction'

export const DEFAULT_SYSTEM_PROMPTS: Record<PromptType, string> = {
  analyze: ANALYZE_SYSTEM_PROMPT,
  research: RESEARCH_SYSTEM_PROMPT,
  protagonist: PROTAGONIST_SYSTEM_PROMPT,
  case: CASE_SYSTEM_PROMPT,
  exhibits: EXHIBITS_SYSTEM_PROMPT,
  questions: QUESTIONS_SYSTEM_PROMPT,
  validation: VALIDATION_SYSTEM_PROMPT,
  grading: CASE_GRADING_SYSTEM_PROMPT,
  sufficiency: 'You are an expert at evaluating research data sufficiency for MBA case studies.',
  enrichment: ENRICHMENT_SYNTHESIS_SYSTEM_PROMPT,
  entity_extraction: ENTITY_EXTRACTION_SYSTEM_PROMPT,
}

// ============================================================================
// Registry Functions
// ============================================================================

/**
 * Get the active prompt version for a given type
 */
export async function getActivePrompt(promptType: PromptType): Promise<PromptVersion | null> {
  const version = await prisma.promptVersion.findFirst({
    where: {
      promptType,
      isActive: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
  
  return version as PromptVersion | null
}

/**
 * Get all active prompts at once (for case generation)
 */
export async function getAllActivePrompts(): Promise<ActivePrompts> {
  const allTypes: PromptType[] = [
    'analyze', 'research', 'protagonist', 'case', 'exhibits',
    'questions', 'validation', 'grading', 'sufficiency', 'enrichment', 'entity_extraction'
  ]
  
  const activePrompts = await prisma.promptVersion.findMany({
    where: {
      isActive: true,
    },
  })
  
  const result: ActivePrompts = {}
  for (const type of allTypes) {
    result[type] = (activePrompts.find(p => p.promptType === type) as PromptVersion) || null
  }
  
  return result
}

/**
 * Get all versions for a prompt type
 */
export async function getPromptVersions(promptType: PromptType): Promise<PromptVersion[]> {
  const versions = await prisma.promptVersion.findMany({
    where: { promptType },
    orderBy: { createdAt: 'desc' },
  })
  
  return versions as PromptVersion[]
}

/**
 * Get a specific prompt version by ID
 */
export async function getPromptVersion(id: string): Promise<PromptVersion | null> {
  const version = await prisma.promptVersion.findUnique({
    where: { id },
  })
  
  return version as PromptVersion | null
}

/**
 * Create a new prompt version
 */
export async function createPromptVersion(input: PromptVersionInput): Promise<PromptVersion> {
  // Get the next version number
  const latestVersion = await prisma.promptVersion.findFirst({
    where: { promptType: input.promptType },
    orderBy: { version: 'desc' },
  })
  
  const nextVersion = incrementVersion(latestVersion?.version || '0.0.0')
  
  const version = await prisma.promptVersion.create({
    data: {
      promptType: input.promptType,
      version: nextVersion,
      name: input.name || `${input.promptType} v${nextVersion}`,
      content: input.content,
      systemPrompt: input.systemPrompt,
      description: input.description,
      createdBy: input.createdBy,
      isActive: false, // New versions start inactive
    },
  })
  
  return version as PromptVersion
}

/**
 * Activate a prompt version (deactivates all others of same type)
 */
export async function activatePromptVersion(id: string): Promise<PromptVersion> {
  const version = await prisma.promptVersion.findUnique({
    where: { id },
  })
  
  if (!version) {
    throw new Error(`Prompt version ${id} not found`)
  }
  
  // Deactivate all other versions of this type
  await prisma.promptVersion.updateMany({
    where: {
      promptType: version.promptType,
      isActive: true,
    },
    data: { isActive: false },
  })
  
  // Activate this version
  const updated = await prisma.promptVersion.update({
    where: { id },
    data: { isActive: true },
  })
  
  return updated as PromptVersion
}

/**
 * Deactivate a prompt version
 */
export async function deactivatePromptVersion(id: string): Promise<PromptVersion> {
  const updated = await prisma.promptVersion.update({
    where: { id },
    data: { isActive: false },
  })
  
  return updated as PromptVersion
}

/**
 * Update a prompt version (only if not active)
 */
export async function updatePromptVersion(
  id: string, 
  updates: Partial<Pick<PromptVersionInput, 'name' | 'content' | 'systemPrompt' | 'description'>>
): Promise<PromptVersion> {
  const version = await prisma.promptVersion.findUnique({
    where: { id },
  })
  
  if (!version) {
    throw new Error(`Prompt version ${id} not found`)
  }
  
  if (version.isActive) {
    throw new Error('Cannot edit an active prompt version. Create a new version instead.')
  }
  
  const updated = await prisma.promptVersion.update({
    where: { id },
    data: updates,
  })
  
  return updated as PromptVersion
}

/**
 * Delete a prompt version (only if not active)
 */
export async function deletePromptVersion(id: string): Promise<void> {
  const version = await prisma.promptVersion.findUnique({
    where: { id },
  })
  
  if (!version) {
    throw new Error(`Prompt version ${id} not found`)
  }
  
  if (version.isActive) {
    throw new Error('Cannot delete an active prompt version')
  }
  
  await prisma.promptVersion.delete({
    where: { id },
  })
}

/**
 * Seed default prompt versions (run once on first setup)
 */
export async function seedDefaultPrompts(): Promise<void> {
  const allTypes = Object.keys(DEFAULT_SYSTEM_PROMPTS) as PromptType[]
  
  for (const promptType of allTypes) {
    // Check if any versions exist
    const existing = await prisma.promptVersion.findFirst({
      where: { promptType },
    })
    
    if (!existing) {
      // Create and activate the default version
      const version = await prisma.promptVersion.create({
        data: {
          promptType,
          version: '1.0.0',
          name: `${promptType} (default)`,
          content: `Default ${promptType} prompt - see source code for template`,
          systemPrompt: DEFAULT_SYSTEM_PROMPTS[promptType],
          description: 'Initial default version',
          isActive: true,
        },
      })
      console.log(`Created default prompt version for ${promptType}: ${version.id}`)
    }
  }
}

/**
 * Get prompt versions used to generate a case (from case.promptVersions JSON field)
 */
export function parsePromptVersions(promptVersionsJson: string | null): Record<PromptType, string> | null {
  if (!promptVersionsJson) return null
  
  try {
    return JSON.parse(promptVersionsJson)
  } catch {
    return null
  }
}

/**
 * Create prompt versions JSON for storing on a case
 */
export function createPromptVersionsJson(activePrompts: ActivePrompts): string {
  const versions: Record<string, string> = {}
  
  for (const [type, prompt] of Object.entries(activePrompts)) {
    if (prompt) {
      versions[type] = prompt.version
    }
  }
  
  return JSON.stringify(versions)
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Increment a semantic version string
 */
function incrementVersion(version: string): string {
  const parts = version.split('.').map(Number)
  
  if (parts.length !== 3 || parts.some(isNaN)) {
    return '1.0.0'
  }
  
  // Increment patch version
  parts[2]++
  
  return parts.join('.')
}

/**
 * Compare two version strings
 * Returns: -1 if a < b, 0 if a == b, 1 if a > b
 */
export function compareVersions(a: string, b: string): number {
  const aParts = a.split('.').map(Number)
  const bParts = b.split('.').map(Number)
  
  for (let i = 0; i < 3; i++) {
    if (aParts[i] < bParts[i]) return -1
    if (aParts[i] > bParts[i]) return 1
  }
  
  return 0
}

