import { PrismaClient } from '../src/generated/prisma'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const concepts = [
  // Strategy
  { name: "Porter's Five Forces", category: 'Strategy', description: 'Framework for analyzing competitive forces in an industry' },
  { name: 'SWOT Analysis', category: 'Strategy', description: 'Strengths, Weaknesses, Opportunities, Threats framework' },
  { name: 'Blue Ocean Strategy', category: 'Strategy', description: 'Creating uncontested market space' },
  { name: 'BCG Matrix', category: 'Strategy', description: 'Portfolio planning based on market growth and share' },
  { name: 'Value Chain Analysis', category: 'Strategy', description: 'Identifying activities that create value and competitive advantage' },
  { name: 'Competitive Advantage', category: 'Strategy', description: 'Sustainable advantage over competitors' },
  
  // Finance
  { name: 'DCF Valuation', category: 'Finance', description: 'Discounted Cash Flow analysis for company valuation' },
  { name: 'Capital Structure', category: 'Finance', description: 'Mix of debt and equity financing' },
  { name: 'Working Capital Management', category: 'Finance', description: 'Managing short-term assets and liabilities' },
  { name: 'Mergers & Acquisitions', category: 'Finance', description: 'Corporate restructuring and consolidation' },
  
  // Marketing
  { name: 'Marketing Mix (4Ps)', category: 'Marketing', description: 'Product, Price, Place, Promotion framework' },
  { name: 'Customer Segmentation', category: 'Marketing', description: 'Dividing market into distinct groups' },
  { name: 'Brand Positioning', category: 'Marketing', description: 'Creating distinct brand image in consumer minds' },
  { name: 'Customer Lifetime Value', category: 'Marketing', description: 'Total worth of a customer over the relationship' },
  
  // Operations
  { name: 'Supply Chain Management', category: 'Operations', description: 'Managing flow of goods and services' },
  { name: 'Lean Operations', category: 'Operations', description: 'Eliminating waste and maximizing value' },
  { name: 'Six Sigma', category: 'Operations', description: 'Data-driven approach to eliminate defects' },
  { name: 'Capacity Planning', category: 'Operations', description: 'Matching production capacity to demand' },
  
  // Leadership
  { name: 'Change Management', category: 'Leadership', description: 'Guiding organizational transformation' },
  { name: 'Organizational Culture', category: 'Leadership', description: 'Shared values and practices within organization' },
  { name: 'Stakeholder Management', category: 'Leadership', description: 'Balancing interests of various stakeholders' },
  
  // Economics
  { name: 'Market Structure', category: 'Economics', description: 'Characteristics of market competition' },
  { name: 'Network Effects', category: 'Economics', description: 'Value increase as more users join' },
  { name: 'Economies of Scale', category: 'Economics', description: 'Cost advantages from increased production' }
]

async function main() {
  console.log('🌱 Seeding database...')

  // Create concepts
  for (const concept of concepts) {
    await prisma.concept.upsert({
      where: { name: concept.name },
      update: {},
      create: concept
    })
  }
  console.log(`✅ Created ${concepts.length} concepts`)

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

  // Create a test student user
  const studentPassword = await bcrypt.hash('student123', 10)
  await prisma.user.upsert({
    where: { email: 'student@acaseaday.com' },
    update: {},
    create: {
      email: 'student@acaseaday.com',
      name: 'Test Student',
      password: studentPassword,
      role: 'student'
    }
  })
  console.log('✅ Created test student user (student@acaseaday.com / student123)')

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

