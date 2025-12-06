/**
 * Regenerate Exhibits Script
 * 
 * This script regenerates exhibits for specified cases using the AI provider,
 * which now includes custom interactive exhibits (1-2 per case).
 * 
 * Now includes variety-aware generation to ensure cross-case diversity.
 */

import { PrismaClient } from '../src/generated/prisma'
import { getAIProvider } from '../src/lib/ai'
import { validateTemplate } from '../src/lib/exhibits/custom-templates-simple'
import { 
  getVarietyGuidance, 
  analyzeExhibitVariety, 
  getVarietySummary 
} from '../src/lib/exhibits/variety'
import type { CaseContent, Exhibit } from '../src/lib/ai/providers/types'

const prisma = new PrismaClient()

// Cases to regenerate
const CASES_TO_REGENERATE = [
  'starbucks-back-to-basics-turnaround',
  'crowdstrike-blue-screen-crisis'
]

/**
 * Validates all exhibits and filters out invalid custom exhibits.
 * Library exhibits pass through; custom template exhibits are validated.
 */
function validateAndFilterExhibits(exhibits: Exhibit[]): Exhibit[] {
  return exhibits.filter((exhibit) => {
    // Library exhibits pass through without validation
    if (exhibit.type !== 'custom_template') {
      return true
    }

    // Validate custom template exhibits
    const validation = validateTemplate(exhibit.data)
    
    if (!validation.valid) {
      console.warn(`  ⚠️ Custom exhibit "${exhibit.title}" failed validation: ${validation.error}`)
      return false
    }

    return true
  })
}

async function regenerateExhibits() {
  console.log('🔄 Regenerating exhibits with custom interactive components...\n')

  const provider = getAIProvider()
  console.log(`Using AI provider: ${provider.name}\n`)

  for (const slug of CASES_TO_REGENERATE) {
    console.log(`\n📚 Processing: ${slug}`)
    console.log('─'.repeat(50))

    // Fetch the existing case
    const existingCase = await prisma.case.findUnique({
      where: { slug },
      include: {
        exhibits: true
      }
    })

    if (!existingCase) {
      console.log(`  ❌ Case not found: ${slug}`)
      continue
    }

    console.log(`  📖 Found: ${existingCase.title}`)
    console.log(`  📊 Current exhibits: ${existingCase.exhibits.length}`)

    // Parse the case content
    const sections = JSON.parse(existingCase.content) as { title: string; content: string }[]
    
    const caseContent: CaseContent = {
      title: existingCase.title,
      company: existingCase.company,
      industry: existingCase.industry,
      summary: existingCase.summary,
      sections
    }

    // Get variety guidance
    console.log('  📊 Analyzing exhibit variety from recent cases...')
    const varietyGuidance = await getVarietyGuidance()
    console.log(`     Analyzed ${varietyGuidance.stats.casesAnalyzed} recent cases`)
    if (varietyGuidance.avoidTypes.length > 0) {
      console.log(`     Types to avoid: ${varietyGuidance.avoidTypes.join(', ')}`)
    }
    if (varietyGuidance.freshTypes.length > 0) {
      console.log(`     Fresh types available: ${varietyGuidance.freshTypes.slice(0, 5).join(', ')}...`)
    }

    // Generate new exhibits using AI with variety guidance
    console.log('  🤖 Generating new exhibits with AI...')
    
    try {
      const rawExhibits = await provider.generateExhibits(caseContent, varietyGuidance)
      console.log(`  ✨ Generated ${rawExhibits.length} exhibits`)

      // Validate and filter
      const validExhibits = validateAndFilterExhibits(rawExhibits)
      console.log(`  ✅ Valid exhibits: ${validExhibits.length}`)

      // Analyze variety
      const varietyAnalysis = analyzeExhibitVariety(
        validExhibits.map(e => ({ type: e.type, title: e.title })),
        varietyGuidance.stats
      )
      console.log(`  🎨 ${getVarietySummary(varietyAnalysis)}`)

      // Count exhibit types
      const libraryCount = validExhibits.filter(e => e.type !== 'custom_interactive').length
      const customCount = validExhibits.filter(e => e.type === 'custom_interactive').length
      console.log(`     - Library exhibits: ${libraryCount}`)
      console.log(`     - Custom interactive: ${customCount}`)

      // Delete existing exhibits
      await prisma.exhibit.deleteMany({
        where: { caseId: existingCase.id }
      })
      console.log('  🗑️ Deleted old exhibits')

      // Create new exhibits
      await prisma.exhibit.createMany({
        data: validExhibits.map((exhibit, index) => ({
          caseId: existingCase.id,
          type: exhibit.type,
          title: exhibit.title,
          data: JSON.stringify(exhibit.data),
          order: index
        }))
      })
      console.log('  💾 Saved new exhibits')

      // List the new exhibits
      console.log('\n  New exhibits:')
      validExhibits.forEach((exhibit, i) => {
        const isCustom = exhibit.type === 'custom_interactive'
        const badge = isCustom ? '🎮' : '📊'
        console.log(`    ${i + 1}. ${badge} ${exhibit.title} (${exhibit.type})`)
      })

    } catch (error) {
      console.error(`  ❌ Error generating exhibits:`, error)
    }
  }

  console.log('\n' + '═'.repeat(50))
  console.log('🎉 Exhibit regeneration complete!')
}

// Run the script
regenerateExhibits()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

