/**
 * Protagonist name tracking utility
 * 
 * Prevents name reuse across cases by tracking all protagonist and supporting
 * character names. Names should never be repeated - there are plenty of options.
 */

import { prisma } from '@/lib/db'
import type { ProtagonistProfile } from '@/lib/ai/providers/types'

/**
 * Record of a used name from the database
 */
export interface UsedNameRecord {
  name: string
  firstName: string
  isProtagonist: boolean
  caseId: string
  publishedDate: Date
}

/**
 * Summary of recently used names for the AI prompt
 */
export interface RecentNamesContext {
  protagonistNames: string[]
  supportingCharacterNames: string[]
  allFirstNames: string[]
}

/**
 * Extract first name from a full name
 * Handles various formats: "John Smith", "Dr. Jane Doe", "María García-López"
 */
export function extractFirstName(fullName: string): string {
  const trimmed = fullName.trim()
  
  // Remove common titles/prefixes
  const withoutTitles = trimmed
    .replace(/^(Dr\.|Mr\.|Ms\.|Mrs\.|Prof\.|Sir|Dame)\s+/i, '')
    .trim()
  
  // Get first word as first name
  const firstName = withoutTitles.split(/\s+/)[0]
  
  return firstName || trimmed
}

/**
 * Get all used names from the database
 * By default, retrieves all names ever used (no time limit)
 */
export async function getRecentlyUsedNames(
  daysBack: number = 365 * 10 // Default to 10 years - effectively all names
): Promise<UsedNameRecord[]> {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - daysBack)

  const names = await prisma.protagonistName.findMany({
    where: {
      publishedDate: {
        gte: cutoffDate,
      },
    },
    orderBy: {
      publishedDate: 'desc',
    },
    select: {
      name: true,
      firstName: true,
      isProtagonist: true,
      caseId: true,
      publishedDate: true,
    },
  })

  return names
}

/**
 * Get a formatted context of recently used names for the AI prompt
 */
export async function getRecentNamesContext(): Promise<RecentNamesContext> {
  const allNames = await getRecentlyUsedNames()

  const protagonistNames = allNames
    .filter((n) => n.isProtagonist)
    .map((n) => n.name)

  const supportingCharacterNames = allNames
    .filter((n) => !n.isProtagonist)
    .map((n) => n.name)

  // Get unique first names from all characters
  const allFirstNames = [...new Set(allNames.map((n) => n.firstName))]

  return {
    protagonistNames,
    supportingCharacterNames,
    allFirstNames,
  }
}

/**
 * Save protagonist and supporting character names after case creation
 */
export async function saveProtagonistNames(
  caseId: string,
  protagonist: ProtagonistProfile,
  publishedDate: Date
): Promise<void> {
  const namesToSave: Array<{
    name: string
    firstName: string
    caseId: string
    isProtagonist: boolean
    publishedDate: Date
  }> = []

  // Add protagonist name
  if (protagonist.name) {
    namesToSave.push({
      name: protagonist.name,
      firstName: extractFirstName(protagonist.name),
      caseId,
      isProtagonist: true,
      publishedDate,
    })
  }

  // Add supporting character name (from keyRelationship)
  if (protagonist.keyRelationship?.name) {
    namesToSave.push({
      name: protagonist.keyRelationship.name,
      firstName: extractFirstName(protagonist.keyRelationship.name),
      caseId,
      isProtagonist: false,
      publishedDate,
    })
  }

  if (namesToSave.length > 0) {
    await prisma.protagonistName.createMany({
      data: namesToSave,
    })
  }
}

/**
 * Check if a name has been used before
 */
export async function isNameUsed(name: string): Promise<boolean> {
  const firstName = extractFirstName(name)
  
  const existing = await prisma.protagonistName.findFirst({
    where: {
      OR: [
        { name: name },
        { firstName: firstName },
      ],
    },
  })

  return !!existing
}

/**
 * Format the recently used names for inclusion in the AI prompt
 */
export function formatNamesForPrompt(context: RecentNamesContext): string {
  const lines: string[] = []

  lines.push('RECENTLY USED NAMES - DO NOT USE ANY OF THESE:')
  lines.push('')
  lines.push('The following names have been used in previous cases. You MUST NOT use any of these')
  lines.push('names or any name that shares a first name with these. There are millions of possible')
  lines.push('names - be creative and use completely different names.')
  lines.push('')

  if (context.protagonistNames.length > 0) {
    lines.push('Previously used PROTAGONIST names (never reuse):')
    context.protagonistNames.forEach((name) => {
      lines.push(`  - ${name}`)
    })
    lines.push('')
  }

  if (context.supportingCharacterNames.length > 0) {
    lines.push('Previously used SUPPORTING CHARACTER names (never reuse):')
    context.supportingCharacterNames.forEach((name) => {
      lines.push(`  - ${name}`)
    })
    lines.push('')
  }

  if (context.allFirstNames.length > 0) {
    lines.push('FIRST NAMES TO AVOID (do not use these first names with any last name):')
    lines.push(context.allFirstNames.join(', '))
    lines.push('')
  }

  return lines.join('\n')
}

