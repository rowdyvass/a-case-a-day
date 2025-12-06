import { PrismaClient } from '../src/generated/prisma'
import bcrypt from 'bcryptjs'
import { allConcepts, conceptCounts } from './concept-data'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database with comprehensive concept library...')
  console.log(`📊 Concept counts by category:`)
  Object.entries(conceptCounts).forEach(([category, count]) => {
    console.log(`   ${category}: ${count}`)
  })

  // Create all concepts
  for (const concept of allConcepts) {
    await prisma.concept.upsert({
      where: { slug: concept.slug },
      update: {
        name: concept.name,
        category: concept.category,
        description: concept.description,
        difficulty: concept.difficulty,
        content: concept.content,
        diagramType: concept.diagramType,
        diagramData: concept.diagramData,
        exercises: concept.exercises,
        relatedIds: concept.relatedIds
      },
      create: {
        slug: concept.slug,
        name: concept.name,
        category: concept.category,
        description: concept.description,
        difficulty: concept.difficulty,
        content: concept.content,
        diagramType: concept.diagramType,
        diagramData: concept.diagramData,
        exercises: concept.exercises,
        relatedIds: concept.relatedIds
      }
    })
  }
  console.log(`✅ Created/updated ${allConcepts.length} concepts`)

  // Create a test operator user
  const hashedPassword = await bcrypt.hash('operator123', 10)
  await prisma.user.upsert({
    where: { email: 'operator@acaseaday.com' },
    update: {},
    create: {
      email: 'operator@acaseaday.com',
      name: 'Test Operator',
      password: hashedPassword,
      role: 'operator'
    }
  })
  console.log('✅ Created test operator user (operator@acaseaday.com / operator123)')

  console.log('🎉 Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


