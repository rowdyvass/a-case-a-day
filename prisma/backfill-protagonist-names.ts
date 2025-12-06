/**
 * Backfill script to populate ProtagonistName table from existing cases
 * 
 * Run with: npx tsx prisma/backfill-protagonist-names.ts
 */

import { PrismaClient } from '../src/generated/prisma'

const prisma = new PrismaClient()

interface ProtagonistProfile {
  name: string
  role: string
  oneLineDescription: string
  decisionAuthority: string
  personalStakes: string
  keyRelationship?: {
    name: string
    role: string
    whyTheyMatter: string
  }
}

interface CaseContent {
  sections: unknown[]
  protagonist?: ProtagonistProfile
}

/**
 * Extract first name from a full name
 */
function extractFirstName(fullName: string): string {
  const trimmed = fullName.trim()
  
  // Remove common titles/prefixes
  const withoutTitles = trimmed
    .replace(/^(Dr\.|Mr\.|Ms\.|Mrs\.|Prof\.|Sir|Dame)\s+/i, '')
    .trim()
  
  // Get first word as first name
  const firstName = withoutTitles.split(/\s+/)[0]
  
  return firstName || trimmed
}

async function backfillProtagonistNames() {
  console.log('Starting protagonist name backfill...\n')

  // Get all cases with their content
  const cases = await prisma.case.findMany({
    select: {
      id: true,
      title: true,
      content: true,
      publishedDate: true,
      createdAt: true,
    },
  })

  console.log(`Found ${cases.length} cases to process.\n`)

  let processedCount = 0
  let protagonistCount = 0
  let supportingCount = 0
  let skippedCount = 0

  for (const caseRecord of cases) {
    try {
      // Parse the case content
      const content = JSON.parse(caseRecord.content) as CaseContent
      
      if (!content.protagonist?.name) {
        console.log(`  Skipping "${caseRecord.title}" - no protagonist found`)
        skippedCount++
        continue
      }

      const protagonist = content.protagonist
      const publishedDate = caseRecord.publishedDate || caseRecord.createdAt

      // Check if names already exist for this case
      const existingNames = await prisma.protagonistName.count({
        where: { caseId: caseRecord.id },
      })

      if (existingNames > 0) {
        console.log(`  Skipping "${caseRecord.title}" - names already recorded`)
        skippedCount++
        continue
      }

      // Create the protagonist name record
      await prisma.protagonistName.create({
        data: {
          name: protagonist.name,
          firstName: extractFirstName(protagonist.name),
          caseId: caseRecord.id,
          isProtagonist: true,
          publishedDate,
        },
      })
      protagonistCount++
      console.log(`  ✓ Added protagonist: ${protagonist.name}`)

      // Create the supporting character name record if exists
      if (protagonist.keyRelationship?.name) {
        await prisma.protagonistName.create({
          data: {
            name: protagonist.keyRelationship.name,
            firstName: extractFirstName(protagonist.keyRelationship.name),
            caseId: caseRecord.id,
            isProtagonist: false,
            publishedDate,
          },
        })
        supportingCount++
        console.log(`  ✓ Added supporting: ${protagonist.keyRelationship.name}`)
      }

      processedCount++
    } catch (error) {
      console.error(`  ✗ Error processing "${caseRecord.title}":`, error)
    }
  }

  console.log('\n' + '='.repeat(50))
  console.log('Backfill complete!\n')
  console.log(`  Cases processed: ${processedCount}`)
  console.log(`  Protagonist names added: ${protagonistCount}`)
  console.log(`  Supporting character names added: ${supportingCount}`)
  console.log(`  Cases skipped: ${skippedCount}`)

  // Print summary of all names
  const allNames = await prisma.protagonistName.findMany({
    orderBy: { publishedDate: 'desc' },
    select: {
      name: true,
      firstName: true,
      isProtagonist: true,
    },
  })

  console.log('\n' + '='.repeat(50))
  console.log('All tracked names:\n')

  const protagonists = allNames.filter((n) => n.isProtagonist)
  const supporting = allNames.filter((n) => !n.isProtagonist)

  console.log('Protagonists:')
  protagonists.forEach((n) => console.log(`  - ${n.name} (${n.firstName})`))

  console.log('\nSupporting Characters:')
  supporting.forEach((n) => console.log(`  - ${n.name} (${n.firstName})`))

  console.log('\nUnique first names to avoid:', [...new Set(allNames.map((n) => n.firstName))].join(', '))
}

backfillProtagonistNames()
  .catch((error) => {
    console.error('Backfill failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

