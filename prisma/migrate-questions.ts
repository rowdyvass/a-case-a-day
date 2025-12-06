import { PrismaClient } from '../src/generated/prisma'

const prisma = new PrismaClient()

/**
 * Migrate existing questions to the new interactive format
 * 
 * This script:
 * 1. Finds all questions without a type (legacy questions)
 * 2. Converts them to free_text type with basic rubric
 * 3. Adds placeholder exemplary answers
 */
async function migrateQuestions() {
  console.log('🔄 Starting question migration...')

  // Get all questions without a type set
  const legacyQuestions = await prisma.question.findMany({
    where: {
      type: 'free_text' // Default type from schema
    },
    include: {
      case: {
        select: {
          title: true,
          company: true
        }
      }
    }
  })

  console.log(`Found ${legacyQuestions.length} questions to check/update`)

  let updated = 0
  for (const question of legacyQuestions) {
    // Only update if missing the new fields
    if (!question.rubric || !question.exemplaryAnswer) {
      await prisma.question.update({
        where: { id: question.id },
        data: {
          type: 'free_text',
          rubric: JSON.stringify({
            criteria: [
              { name: 'Analysis Depth', description: 'Quality and depth of analysis', weight: 4 },
              { name: 'Framework Application', description: 'Appropriate use of business frameworks', weight: 3 },
              { name: 'Evidence Use', description: 'References specific case details', weight: 3 }
            ],
            keyPoints: []
          }),
          exemplaryAnswer: question.exemplaryAnswer || `This question requires thoughtful analysis of the case "${question.case.title}". Consider the key challenges facing ${question.case.company} and apply relevant MBA frameworks to develop your response. A strong answer will reference specific details from the case and demonstrate clear logical reasoning.`
        }
      })
      updated++
    }
  }

  console.log(`✅ Updated ${updated} questions with new interactive format`)
}

/**
 * Create sample interactive questions for testing
 */
async function createSampleQuestions() {
  console.log('📝 Creating sample interactive questions...')

  // Find a case to add questions to
  const sampleCase = await prisma.case.findFirst({
    where: { status: 'published' }
  })

  if (!sampleCase) {
    console.log('⚠️  No published case found. Skipping sample questions.')
    return
  }

  // Delete existing questions for this case to start fresh
  // (Only do this in development!)
  const existingCount = await prisma.question.count({
    where: { caseId: sampleCase.id }
  })

  if (existingCount > 0) {
    console.log(`⚠️  Case "${sampleCase.title}" already has ${existingCount} questions. Skipping sample creation.`)
    console.log('   To recreate, delete existing questions first.')
    return
  }

  const sampleQuestions = [
    // Multiple Choice
    {
      caseId: sampleCase.id,
      text: `What is the primary strategic challenge facing ${sampleCase.company}?`,
      type: 'multiple_choice',
      difficulty: 'easy',
      order: 0,
      options: JSON.stringify([
        'Expanding into new markets while maintaining profitability',
        'Reducing operational costs to improve margins',
        'Responding to competitive threats in the core market',
        'Managing rapid growth without compromising quality'
      ]),
      correctAnswer: JSON.stringify(0),
      exemplaryAnswer: 'The primary challenge is market expansion while maintaining profitability. This requires careful analysis of the cost-benefit tradeoffs of growth strategies while ensuring sustainable unit economics.'
    },
    // Free Text
    {
      caseId: sampleCase.id,
      text: `Analyze the competitive dynamics in ${sampleCase.company}'s industry. What are the key factors that will determine success or failure?`,
      type: 'free_text',
      difficulty: 'medium',
      order: 1,
      rubric: JSON.stringify({
        criteria: [
          { name: 'Industry Analysis', description: 'Identifies key competitive forces and industry dynamics', weight: 4 },
          { name: 'Critical Thinking', description: 'Goes beyond surface-level observations', weight: 3 },
          { name: 'Evidence', description: 'References specific details from the case', weight: 3 }
        ],
        keyPoints: [
          'Competitive landscape and key players',
          'Barriers to entry and switching costs',
          'Technological disruption potential',
          'Customer bargaining power'
        ]
      }),
      exemplaryAnswer: `A comprehensive analysis of ${sampleCase.company}'s competitive dynamics should consider multiple forces. First, examine the intensity of rivalry among existing competitors, noting market concentration and differentiation strategies. Second, assess the threat of new entrants by evaluating barriers to entry such as capital requirements, economies of scale, and brand loyalty. Third, analyze supplier and buyer power dynamics. Finally, consider substitute products or services that could disrupt the market. The key success factors likely include operational efficiency, customer retention, and the ability to innovate faster than competitors.`
    },
    // Ranking
    {
      caseId: sampleCase.id,
      text: `Rank the following strategic priorities for ${sampleCase.company} from most important (1) to least important (4):`,
      type: 'ranking',
      difficulty: 'medium',
      order: 2,
      options: JSON.stringify([
        'Invest in technology and innovation',
        'Expand customer base through marketing',
        'Improve operational efficiency',
        'Pursue strategic partnerships'
      ]),
      correctAnswer: JSON.stringify([0, 2, 1, 3]),
      exemplaryAnswer: 'The optimal ranking prioritizes technology investment first, as it enables long-term competitive advantage. Operational efficiency follows as it supports sustainable growth. Customer acquisition ranks third as it builds on the foundation of better products and operations. Strategic partnerships, while valuable, are lower priority as they should emerge naturally from a strong competitive position.'
    },
    // Framework Application
    {
      caseId: sampleCase.id,
      text: `Apply Porter's Five Forces to analyze ${sampleCase.company}'s competitive position. What strategic recommendations emerge from this analysis?`,
      type: 'framework_application',
      difficulty: 'hard',
      order: 3,
      frameworkType: "Porter's Five Forces",
      rubric: JSON.stringify({
        criteria: [
          { name: 'Framework Completeness', description: 'Addresses all five forces systematically', weight: 4 },
          { name: 'Case Application', description: 'Applies framework to specific case details', weight: 4 },
          { name: 'Strategic Insight', description: 'Derives actionable recommendations', weight: 2 }
        ],
        keyPoints: [
          'Threat of new entrants analysis',
          'Supplier power assessment',
          'Buyer power assessment',
          'Threat of substitutes',
          'Competitive rivalry intensity',
          'Strategic recommendations based on analysis'
        ]
      }),
      exemplaryAnswer: `A thorough Porter's Five Forces analysis reveals the following:

**Threat of New Entrants (Medium):** While capital requirements create some barriers, technological disruption could lower entry barriers. Recommendation: Build defensible competitive moats through proprietary technology and customer lock-in.

**Supplier Power (Low-Medium):** Multiple supplier options exist, but specialized components may create dependencies. Recommendation: Develop dual-sourcing strategies for critical inputs.

**Buyer Power (High):** Customers have significant alternatives and low switching costs. Recommendation: Focus on differentiation and creating value-added services that increase switching costs.

**Threat of Substitutes (Medium-High):** Emerging technologies could disrupt current business models. Recommendation: Invest in R&D to stay ahead of substitution threats.

**Competitive Rivalry (High):** Intense competition drives price pressure. Recommendation: Compete on value rather than price; focus on underserved market segments.

Overall strategic recommendation: Pursue a differentiation strategy focused on innovation and customer experience to reduce price sensitivity and build sustainable competitive advantage.`
    }
  ]

  for (const question of sampleQuestions) {
    await prisma.question.create({
      data: question
    })
  }

  console.log(`✅ Created ${sampleQuestions.length} sample interactive questions for "${sampleCase.title}"`)
}

async function main() {
  console.log('🚀 Question Migration Script')
  console.log('============================\n')

  // Run migrations
  await migrateQuestions()
  
  // Optionally create sample questions (comment out in production)
  // await createSampleQuestions()

  console.log('\n🎉 Migration complete!')
}

main()
  .catch((e) => {
    console.error('Migration failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


