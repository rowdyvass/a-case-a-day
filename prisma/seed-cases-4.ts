/**
 * Seed Script for Case Studies (Batch 4)
 * 
 * This script follows the same variety validation steps as the API generation flow:
 * 1. Analyze recent exhibit usage from published cases
 * 2. Score each case's exhibits for variety
 * 3. Log warnings and suggestions for improvement
 * 
 * Cases are created even if variety is suboptimal, but the analysis helps
 * identify opportunities for improvement.
 */

import { PrismaClient } from '../src/generated/prisma'
import {
  getRecentExhibitUsage,
  analyzeExhibitVariety,
  logVarietyAnalysis,
  logRecentUsage,
  getVarietySummary,
  type RecentUsageStats
} from './utils/validate-exhibits'

const prisma = new PrismaClient()

// ============== CASE DATA INTERFACE ==============

interface CaseData {
  slug: string
  title: string
  company: string
  industry: string
  summary: string
  brandColor?: string
  sections: { title: string; content: string }[]
  exhibits: { type: string; title: string; data: Record<string, unknown> }[]
  questions: { text: string; difficulty: string }[]
  concepts: string[]
}

// ============== CASE DEFINITIONS ==============

const cases: CaseData[] = [
  {
    slug: 'nvidia-ai-compute-dominance',
    title: 'NVIDIA: The Accidental AI Monopoly',
    company: 'NVIDIA',
    industry: 'Technology',
    brandColor: '#76B900',
    summary: 'NVIDIA transformed from a gaming graphics company into the backbone of the AI revolution. By 2024, the company controlled 80%+ of AI training hardware, creating what may be the most valuable technological chokepoint in history. This case examines how NVIDIA built its moat and whether it can sustain dominance.',
    sections: [
      {
        title: 'From Gaming to AI',
        content: `In 2012, NVIDIA was a successful but unremarkable semiconductor company. Founded in 1993 to build graphics processing units (GPUs) for video games, the company had carved out a profitable niche but faced commoditization pressure from AMD and Intel's integrated graphics.

That year, researchers at the University of Toronto achieved a breakthrough. Using NVIDIA GPUs to train a neural network called AlexNet, they won the ImageNet competition by a massive margin—demonstrating that parallel processing architecture designed for rendering video game graphics was perfectly suited for machine learning computations.

The implications were profound but not immediately obvious. AI research was an academic backwater, not a commercial market. NVIDIA's CEO Jensen Huang recognized the opportunity before most, investing in CUDA—a programming framework that made GPUs accessible to non-graphics applications. This decision, made without clear commercial justification, would prove transformational.

By the time ChatGPT launched in November 2022, NVIDIA had spent a decade building the hardware and software ecosystem that AI required. The company wasn't lucky—it was prepared.`
      },
      {
        title: 'The CUDA Moat',
        content: `NVIDIA's dominance rests not on hardware alone but on an ecosystem that makes switching extraordinarily costly. CUDA, released in 2006, provides the programming model that nearly all AI software depends on. TensorFlow, PyTorch, and every major machine learning framework was built assuming NVIDIA GPUs.

The moat deepens with each layer. NVIDIA's cuDNN library optimizes neural network operations for its hardware. The company's networking products (acquired via Mellanox for $7 billion) connect thousands of GPUs in data centers. Software like NVIDIA's Triton handles AI model deployment. Each component works best with other NVIDIA products.

For AI developers, this integration is a feature, not a bug. A complete NVIDIA stack reduces complexity and accelerates development. The marginal cost savings from alternative hardware rarely justify the engineering effort to support multiple platforms.

The ecosystem creates powerful network effects. More developers using CUDA means more software optimized for NVIDIA hardware, which means more developers choosing NVIDIA. Competitors like AMD and Intel offer technically capable alternatives but lack the software ecosystem that enterprises require.

Switching costs compound over time. Companies that built their AI infrastructure on NVIDIA face years of work to migrate. The larger the AI investment, the deeper the lock-in. NVIDIA's biggest customers are also its most captive.`
      },
      {
        title: 'The Demand Explosion',
        content: `The release of ChatGPT in November 2022 triggered an unprecedented AI hardware shortage. Every technology company—and many non-technology companies—suddenly needed massive GPU clusters to train and run large language models.

NVIDIA's H100 GPU, launched in 2022, became the scarcest commodity in technology. Companies that had ordered months earlier found delivery times extending to 2024. Cloud providers reported waiting 12+ months for significant allocations. Meta, Microsoft, and Google ordered hundreds of thousands of units each.

Prices reflected the scarcity. NVIDIA's data center revenue grew from $15 billion in fiscal 2023 to over $47 billion in fiscal 2024—a 217% increase. Gross margins expanded to over 75%, levels typically seen in software, not semiconductors. Each H100 sold for $25,000-40,000, generating profit margins that made NVIDIA one of the most valuable companies in history.

The shortage wasn't merely demand exceeding supply—it was demand that had no substitute. Companies couldn't train frontier AI models on alternative hardware; the software didn't exist, the performance wasn't comparable, and the engineering expertise wasn't available. NVIDIA was the only option.

By early 2024, NVIDIA had joined the trillion-dollar market capitalization club, briefly surpassing Microsoft and Apple as the world's most valuable company. A graphics card maker had become the picks-and-shovels supplier of the AI gold rush.`
      },
      {
        title: 'Threats to Dominance',
        content: `NVIDIA's position, while formidable, faces multiple challenges. The most significant is customer dependency—the very companies buying billions in NVIDIA hardware are also developing alternatives.

Google's TPUs (Tensor Processing Units) power much of the company's internal AI. Amazon's Trainium and Inferentia chips aim to reduce AWS's NVIDIA dependence. Meta has developed custom AI accelerators. Microsoft has partnered with AMD and invested in its own silicon. Every major cloud provider understands the strategic danger of relying on a single supplier.

The software moat faces erosion. OpenAI's Triton compiler aims to make AI code hardware-agnostic. ROCm, AMD's CUDA alternative, has improved dramatically. The industry is actively investing in breaking NVIDIA's software lock-in, though progress is slow.

China presents both an opportunity and a threat. U.S. export controls restrict NVIDIA's most advanced chips from Chinese customers, but Chinese companies are responding by developing domestic alternatives. Huawei's Ascend chips, while less capable, serve a market NVIDIA can't access.

The AI market itself may shift. Current demand is driven by training large language models, which requires massive parallel computation. But inference—running trained models—has different requirements. As AI matures from training-intensive to inference-intensive workloads, hardware requirements may favor different architectures.

NVIDIA is not standing still. The company continues advancing its hardware (the H200 and Blackwell architecture), expanding its software ecosystem, and diversifying into automotive and edge computing. But sustaining 75%+ gross margins against motivated competitors may prove the company's greatest challenge.`
      }
    ],
    exhibits: [
      {
        type: 'chart',
        title: 'NVIDIA Data Center Revenue Growth',
        data: {
          labels: ['FY2020', 'FY2021', 'FY2022', 'FY2023', 'FY2024'],
          datasets: [{ label: 'Revenue ($B)', values: [2.98, 6.70, 10.61, 15.01, 47.53] }],
          chartType: 'bar'
        }
      },
      {
        type: 'stacked_bar',
        title: 'AI Training Hardware Market Share (2024)',
        data: {
          labels: ['GPUs', 'Custom ASICs', 'Other'],
          datasets: [
            { label: 'NVIDIA', values: [92, 0, 0] },
            { label: 'AMD', values: [5, 0, 0] },
            { label: 'Google TPU', values: [0, 70, 0] },
            { label: 'Other', values: [3, 30, 100] }
          ],
          showPercentages: true,
          unit: '%'
        }
      },
      {
        type: 'table',
        title: 'NVIDIA vs. Competitor AI Hardware',
        data: {
          headers: ['Product', 'Company', 'AI Performance', 'Price', 'Software Ecosystem'],
          rows: [
            ['H100', 'NVIDIA', 'Industry Leading', '$25,000-40,000', 'CUDA (dominant)'],
            ['MI300X', 'AMD', '90% of H100', '$10,000-15,000', 'ROCm (developing)'],
            ['TPU v5', 'Google', 'Competitive', 'Cloud only', 'TensorFlow optimized'],
            ['Gaudi 3', 'Intel', '70% of H100', '$15,000', 'Limited ecosystem'],
            ['Trainium 2', 'AWS', 'Unknown', 'Cloud only', 'SageMaker integration']
          ]
        }
      },
      {
        type: 'quote',
        title: 'Jensen Huang on NVIDIA\'s Position',
        data: {
          text: 'We\'ve been working on accelerated computing and AI for 15 years. The overnight success took a long time. But we\'re just at the beginning. The amount of computing needed for AI will be staggering, and we intend to supply it.',
          attribution: 'Jensen Huang',
          role: 'CEO, NVIDIA (Earnings Call, 2024)'
        }
      },
      {
        type: 'timeline',
        title: 'NVIDIA\'s AI Journey',
        data: {
          events: [
            { date: '2006', title: 'CUDA Launch', description: 'Released CUDA, enabling general-purpose GPU computing', status: 'completed' },
            { date: '2012', title: 'AlexNet Breakthrough', description: 'NVIDIA GPUs used to train landmark neural network', status: 'completed' },
            { date: '2016', title: 'First AI GPU', description: 'P100 launched, first GPU designed for deep learning', status: 'completed' },
            { date: '2020', title: 'Mellanox Acquisition', description: '$7B purchase adds AI networking capabilities', status: 'completed' },
            { date: '2022', title: 'H100 & ChatGPT', description: 'Launch of H100 coincides with generative AI explosion', status: 'completed' },
            { date: '2024', title: 'Blackwell Architecture', description: 'Next-gen architecture promises 4x AI performance', status: 'current' }
          ]
        }
      }
    ],
    questions: [
      { text: 'How did NVIDIA\'s investment in CUDA before clear commercial demand create a durable competitive advantage? What does this suggest about R&D strategy in emerging technologies?', difficulty: 'easy' },
      { text: 'Analyze NVIDIA\'s 75%+ gross margins through the lens of Porter\'s Five Forces. Which forces allow these margins, and which threaten them?', difficulty: 'medium' },
      { text: 'NVIDIA\'s largest customers are also developing competing products. How should NVIDIA balance maximizing current revenue against the risk of enabling future competitors?', difficulty: 'medium' },
      { text: 'Build a strategic framework for assessing when "ecosystem lock-in" becomes an antitrust liability. Apply it to NVIDIA\'s CUDA dominance.', difficulty: 'hard' },
      { text: 'You are the CTO of a major cloud provider. Design a 5-year strategy to reduce dependence on NVIDIA while maintaining competitive AI offerings. What are the key investment priorities and risks?', difficulty: 'hard' }
    ],
    concepts: ["Porter's Five Forces", 'Competitive Advantage', 'Network Effects', 'Market Structure']
  },
  {
    slug: 'boeing-quality-crisis-2024',
    title: 'Boeing: When Culture Eats Quality',
    company: 'Boeing',
    industry: 'Manufacturing',
    brandColor: '#0039A6',
    summary: 'In January 2024, a door plug blew out of an Alaska Airlines 737 MAX 9 mid-flight, exposing systemic quality failures at Boeing. The incident revealed how a century-old aerospace leader\'s culture had prioritized financial metrics over engineering excellence, with potentially fatal consequences.',
    sections: [
      {
        title: 'The Door Plug Incident',
        content: `On January 5, 2024, Alaska Airlines Flight 1282 departed Portland, Oregon for Ontario, California. The Boeing 737 MAX 9 had been delivered just two months earlier. At 16,000 feet, a section of the fuselage known as a "door plug"—a panel that fills the space where an emergency exit would be installed on higher-capacity configurations—blew out of the aircraft.

The explosive decompression ripped a 24-by-16-inch hole in the side of the plane. Passengers' phones and belongings were sucked out. Only the fact that the seats adjacent to the plug were empty prevented fatalities. The pilots executed an emergency descent and returned safely to Portland.

The investigation revealed an appalling failure. The door plug had been removed at Boeing's factory for repairs, then reinstalled—but the four bolts that secured it were never replaced. The aircraft had flown for two months with nothing holding the door plug in place except friction and the cabin pressure seal.

This wasn't a complex technical failure or an unforeseeable accident. It was missing bolts—the most basic quality failure imaginable. The incident suggested that Boeing's manufacturing processes had broken down at the most fundamental level.`
      },
      {
        title: 'A Pattern of Failures',
        content: `The door plug incident followed years of mounting concerns about Boeing's quality and safety culture. The 737 MAX had already been grounded worldwide from March 2019 to December 2020 following two crashes—Lion Air Flight 610 and Ethiopian Airlines Flight 302—that killed 346 people.

Those crashes resulted from a flawed flight control system called MCAS, which Boeing had developed to address handling differences from previous 737 models. Pilots weren't adequately trained on the system, and when it malfunctioned, they couldn't override it. Investigations revealed that Boeing had concealed MCAS's significance from regulators and airlines.

The MAX grounding cost Boeing over $20 billion in direct costs and incalculable reputational damage. But the problems weren't limited to the MAX. Dreamliner production was halted for quality issues. The 777X faced repeated delays. Quality escapes—defects that pass inspection—were reported across multiple programs.

Employees and whistleblowers painted a picture of a company that had systematically deprioritized safety. Production pressure led to shortcuts. Quality inspectors were overruled. Concerns raised through official channels went unaddressed. The culture that had once made Boeing synonymous with engineering excellence had eroded.`
      },
      {
        title: 'The Cultural Transformation',
        content: `Boeing's decline traced to specific strategic decisions. The 1997 merger with McDonnell Douglas brought executives who emphasized financial metrics over engineering judgment. CEO Phil Condit and later Harry Stonecipher, both from the McDonnell Douglas tradition, shifted Boeing's culture toward shareholder returns.

In 2001, Boeing moved its headquarters from Seattle—where it had been founded and where its engineers worked—to Chicago. The relocation symbolized a separation of corporate leadership from manufacturing reality. Executives who once walked factory floors now operated from offices 2,000 miles away.

Cost-cutting intensified throughout the 2000s. Boeing outsourced component manufacturing to suppliers around the world, reducing direct control over quality. The company shifted to a model where final assembly was more like assembling IKEA furniture than building aircraft—snapping together pre-made sections.

Executive compensation aligned with stock price, not product quality. Managers faced pressure to increase production rates and reduce costs. Quality metrics, while nominally tracked, weren't weighted equally with financial metrics in performance evaluations.

The results were predictable in hindsight. When financial incentives conflicted with quality, financial incentives won. When production schedules conflicted with thorough inspection, production schedules won. The culture of perfectionism that had defined Boeing for decades gave way to a culture of acceptable shortcuts.`
      },
      {
        title: 'The Reckoning',
        content: `Following the door plug incident, the FAA limited Boeing's 737 MAX production and launched an intensive audit of manufacturing processes. The agency had been criticized for inadequate oversight and responded with unprecedented scrutiny.

CEO Dave Calhoun announced he would step down by year-end 2024. The board chair and head of commercial aviation also departed. But leadership changes couldn't quickly fix problems embedded in processes, supplier relationships, and organizational culture developed over decades.

Boeing faced existential questions. The company had $52 billion in debt, limiting investment in new aircraft programs. Customers were diversifying orders to Airbus. China's COMAC was developing competing aircraft with state support. The technological lead that Boeing had maintained since the jet age was eroding.

Remediation would require years. Boeing committed to hiring 10,000 new employees, many in quality roles. Production rates would remain limited until processes stabilized. Supplier quality programs required fundamental restructuring. The company estimated billions in additional costs.

The deeper challenge was cultural. How could Boeing rebuild the engineering-first mindset that created the 707, 747, and original 737? Could a company recover values it had spent 25 years systematically dismantling? The door plug that blew off Flight 1282 exposed not just a manufacturing defect, but the consequences of prioritizing Wall Street over the factory floor.`
      }
    ],
    exhibits: [
      {
        type: 'timeline',
        title: 'Boeing\'s Quality Crisis Timeline',
        data: {
          events: [
            { date: '1997', title: 'McDonnell Douglas Merger', description: 'Merger brings cost-focused management culture', status: 'completed' },
            { date: '2001', title: 'HQ Moves to Chicago', description: 'Headquarters relocated away from manufacturing', status: 'completed' },
            { date: '2011', title: 'Dreamliner Battery Fires', description: '787 grounded for battery issues after service entry', status: 'completed' },
            { date: '2018-2019', title: 'MAX Crashes', description: 'Two fatal crashes kill 346 people', status: 'completed' },
            { date: 'Jan 2024', title: 'Door Plug Incident', description: 'Alaska Airlines Flight 1282 loses door plug', status: 'current' },
            { date: '2024', title: 'FAA Production Limits', description: 'MAX production capped pending quality improvements', status: 'current' }
          ]
        }
      },
      {
        type: 'waterfall',
        title: 'Boeing Stock Performance ($)',
        data: {
          steps: [
            { name: 'Pre-MAX Crisis (2018)', value: 350, isTotal: true },
            { name: 'MAX Grounding Impact', value: -150 },
            { name: 'COVID Impact', value: -80 },
            { name: 'Partial Recovery', value: 30 },
            { name: 'Door Plug Impact', value: -60 },
            { name: 'Current (2024)', value: 90, isTotal: true }
          ],
          unit: '$',
          showConnectors: true
        }
      },
      {
        type: 'table',
        title: 'Boeing vs. Airbus Delivery Comparison',
        data: {
          headers: ['Year', 'Boeing Deliveries', 'Airbus Deliveries', 'Boeing Market Share'],
          rows: [
            ['2018', '806', '800', '50.2%'],
            ['2019', '380', '863', '30.6%'],
            ['2020', '157', '566', '21.7%'],
            ['2021', '340', '611', '35.7%'],
            ['2022', '480', '661', '42.1%'],
            ['2023', '528', '735', '41.8%'],
            ['2024 (proj)', '400', '750', '34.8%']
          ]
        }
      },
      {
        type: 'comparison_grid',
        title: 'Cultural Indicators: Engineering vs. Financial Focus',
        data: {
          items: [
            {
              name: 'Boeing 1990s',
              description: 'Engineering-led culture',
              badge: 'Quality First',
              isRecommended: true,
              metrics: [
                { label: 'HQ Location', value: 'Seattle (near factories)' },
                { label: 'CEO Background', value: 'Engineering/Operations', highlight: true },
                { label: 'Key Metrics', value: 'Safety, Quality, Innovation' },
                { label: 'Supplier Strategy', value: 'Vertical integration' },
                { label: 'Production Philosophy', value: 'Build it right' }
              ]
            },
            {
              name: 'Boeing 2020s',
              description: 'Finance-led culture',
              badge: 'Cost Focused',
              metrics: [
                { label: 'HQ Location', value: 'Chicago (remote)' },
                { label: 'CEO Background', value: 'Finance/M&A' },
                { label: 'Key Metrics', value: 'EPS, ROIC, Cash Flow' },
                { label: 'Supplier Strategy', value: 'Outsource for cost' },
                { label: 'Production Philosophy', value: 'Build it fast' }
              ]
            }
          ],
          columns: 2
        }
      },
      {
        type: 'quote',
        title: 'Boeing Whistleblower Testimony',
        data: {
          text: 'We were constantly told to speed up. Quality inspectors who raised concerns were labeled as troublemakers. The pressure to meet production targets was relentless. Everyone knew it was a matter of time before something terrible happened.',
          attribution: 'Former Boeing Quality Engineer',
          role: 'Congressional Testimony (2024)'
        }
      },
      {
        type: 'pro_con',
        title: 'Rebuilding Boeing\'s Quality Culture',
        data: {
          pros: [
            { title: 'Current culture demonstrably failed', description: 'Door plug incident proves existing processes are broken' },
            { title: 'Regulatory pressure demands transformation', description: 'FAA mandates significant operational changes' },
            { title: 'Competitive position deteriorating', description: 'Airbus gaining market share while Boeing struggles' },
            { title: 'Employee morale at historic lows', description: 'Layoffs and scandals have damaged workplace culture' },
            { title: 'Customer trust requires visible action', description: 'Airlines need confidence in Boeing\'s quality systems' }
          ],
          cons: [
            { title: 'Radical change disrupts production', description: 'Further delivery delays hurt cash flow' },
            { title: '$52B debt limits investment', description: 'Financial constraints on transformation spending' },
            { title: 'Cultural change takes years', description: 'Quick fixes rarely create lasting change' },
            { title: 'Risk of losing experienced staff', description: 'Remaining engineers may leave during turmoil' },
            { title: 'Suppliers can\'t change overnight', description: 'Quality issues extend beyond Boeing\'s walls' }
          ],
          prosLabel: 'Arguments for Radical Change',
          consLabel: 'Arguments for Incremental Approach',
          layout: 'side-by-side'
        }
      }
    ],
    questions: [
      { text: 'Trace the causal chain from the 1997 McDonnell Douglas merger to the 2024 door plug incident. What decisions along the way could have prevented the quality crisis?', difficulty: 'easy' },
      { text: 'Boeing\'s problems illustrate the tension between financial and operational metrics. Design a balanced scorecard that appropriately weights safety, quality, and financial performance for an aerospace manufacturer.', difficulty: 'medium' },
      { text: 'Analyze the decision to move Boeing\'s headquarters from Seattle to Chicago through the lens of organizational culture. How did physical separation from manufacturing affect management decision-making?', difficulty: 'medium' },
      { text: 'You are Boeing\'s new CEO. Develop a 3-year cultural transformation plan that rebuilds engineering excellence while managing financial constraints and ongoing production needs.', difficulty: 'hard' },
      { text: 'Boeing outsourced significant manufacturing to reduce costs but lost quality control. Develop a framework for determining which activities an aerospace manufacturer should keep in-house vs. outsource, and apply it to recommend structural changes.', difficulty: 'hard' }
    ],
    concepts: ['Organizational Culture', 'Change Management', 'Six Sigma', 'Supply Chain Management', 'Stakeholder Management']
  }
]

// ============== MAIN SEED FUNCTION ==============

async function seedCases() {
  console.log('🌱 Seeding case studies with variety validation...')
  console.log('   (Following same steps as API generation flow)\n')

  // ========================================
  // STEP 1: Analyze recent exhibit usage
  // ========================================
  console.log('📈 Step 1: Analyzing recent exhibit usage...')
  const recentUsage = await getRecentExhibitUsage(prisma)
  logRecentUsage(recentUsage)

  // ========================================
  // STEP 2: Find operator user
  // ========================================
  const operator = await prisma.user.findFirst({
    where: { role: 'operator' }
  })
  
  if (!operator) {
    console.error('\n❌ No operator user found. Run db:seed-concepts first.')
    return
  }

  // ========================================
  // STEP 3: Process each case
  // ========================================
  let casesCreated = 0
  let casesSkipped = 0
  const varietyScores: number[] = []

  for (const caseData of cases) {
    // Check if case already exists
    const existing = await prisma.case.findUnique({
      where: { slug: caseData.slug }
    })
    
    if (existing) {
      console.log(`\n⏭️  Skipping "${caseData.title}" (already exists)`)
      casesSkipped++
      continue
    }

    // ========================================
    // STEP 3a: Analyze exhibit variety
    // (Same as analyzeExhibitVariety in API flow)
    // ========================================
    const varietyAnalysis = analyzeExhibitVariety(
      caseData.exhibits.map(e => ({ type: e.type, title: e.title })),
      recentUsage
    )
    
    logVarietyAnalysis(caseData.title, varietyAnalysis)
    varietyScores.push(varietyAnalysis.score)

    // Log summary (same as API flow)
    console.log(`   Summary: ${getVarietySummary(varietyAnalysis)}`)

    // Warn if variety is poor, but still create
    if (!varietyAnalysis.isValid) {
      console.log(`   ⚠️  Creating case despite variety errors (quality trumps strict variety)`)
    }

    // ========================================
    // STEP 3b: Link concepts
    // ========================================
    const concepts = await prisma.concept.findMany({
      where: { name: { in: caseData.concepts } }
    })

    if (concepts.length !== caseData.concepts.length) {
      const foundNames = concepts.map(c => c.name)
      const missingConcepts = caseData.concepts.filter(c => !foundNames.includes(c))
      console.log(`   ⚠️  Missing concepts: ${missingConcepts.join(', ')}`)
    }

    // ========================================
    // STEP 3c: Create the case
    // ========================================
    const createdCase = await prisma.case.create({
      data: {
        slug: caseData.slug,
        title: caseData.title,
        company: caseData.company,
        industry: caseData.industry,
        summary: caseData.summary,
        brandColor: caseData.brandColor,
        content: JSON.stringify(caseData.sections),
        status: 'published',
        publishedAt: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000), // Random date in last 2 weeks
        authorId: operator.id,
        exhibits: {
          create: caseData.exhibits.map((exhibit, index) => ({
            type: exhibit.type,
            title: exhibit.title,
            data: JSON.stringify(exhibit.data),
            order: index
          }))
        },
        questions: {
          create: caseData.questions.map((question, index) => ({
            text: question.text,
            difficulty: question.difficulty,
            order: index
          }))
        },
        concepts: {
          create: concepts.map(concept => ({
            conceptId: concept.id
          }))
        }
      }
    })

    console.log(`\n✅ Created: ${createdCase.title}`)
    console.log(`   Variety Score: ${varietyAnalysis.score}/100`)
    casesCreated++
  }

  // ========================================
  // STEP 4: Summary
  // ========================================
  console.log('\n' + '='.repeat(60))
  console.log('📊 Seed Summary')
  console.log('='.repeat(60))
  console.log(`   Cases created: ${casesCreated}`)
  console.log(`   Cases skipped: ${casesSkipped}`)
  
  if (varietyScores.length > 0) {
    const avgScore = Math.round(varietyScores.reduce((a, b) => a + b, 0) / varietyScores.length)
    console.log(`   Average variety score: ${avgScore}/100`)
  }
  
  console.log('\n🎉 Seed complete!')
}

// ============== RUN ==============

seedCases()
  .catch((error) => {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
