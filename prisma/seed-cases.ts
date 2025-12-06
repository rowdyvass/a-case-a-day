import { PrismaClient } from '../src/generated/prisma'

const prisma = new PrismaClient()

interface CaseData {
  slug: string
  title: string
  company: string
  industry: string
  summary: string
  sections: { title: string; content: string }[]
  exhibits: { type: string; title: string; data: Record<string, unknown> }[]
  questions: { text: string; difficulty: string }[]
  concepts: string[]
}

const cases: CaseData[] = [
  {
    slug: 'openai-boardroom-coup-governance-crisis',
    title: 'The OpenAI Boardroom Coup: When Mission Meets Money',
    company: 'OpenAI',
    industry: 'Technology',
    summary: 'In November 2023, OpenAI\'s board fired CEO Sam Altman, triggering a five-day crisis that nearly destroyed the company. This case examines the unprecedented governance structure of a "capped-profit" organization and asks: who should control the most powerful technology in history?',
    sections: [
      {
        title: 'Company Background',
        content: `OpenAI was founded in 2015 as a non-profit artificial intelligence research laboratory with a mission to ensure that artificial general intelligence (AGI) benefits all of humanity. The founding team included Sam Altman, Elon Musk, and other prominent tech figures who pledged over $1 billion to the cause.

By 2019, the organization faced a fundamental challenge: competing for AI talent against tech giants paying millions in compensation while relying solely on donations. The solution was radical—create a "capped-profit" subsidiary where investors could earn returns up to 100x their investment, with all excess value flowing to the non-profit parent.

This hybrid structure was unprecedented. The non-profit board maintained ultimate control, with a fiduciary duty not to shareholders, but to humanity. Microsoft invested $13 billion for a 49% stake in the for-profit arm, yet the six-member board—which included only one company insider—held the power to dissolve the entire enterprise if it deemed necessary for the mission.`
      },
      {
        title: 'The Catalyst: ChatGPT and Exponential Growth',
        content: `When ChatGPT launched in November 2022, it became the fastest-growing consumer application in history, reaching 100 million users in just two months. OpenAI's valuation soared to $86 billion. Sam Altman became the face of the AI revolution, testifying before Congress and meeting with world leaders.

But the rapid commercialization created tension with the safety-focused board members. Chief Scientist Ilya Sutskever, a board member, grew increasingly concerned about the pace of deployment. Board members Helen Toner and Tasha McCauley, both AI safety researchers, questioned whether commercial pressures were compromising the mission.

The breaking point came in November 2023. On Thursday, November 16th, board member Helen Toner published an academic paper that appeared to criticize OpenAI's safety practices while praising competitor Anthropic. Sam Altman reportedly moved to have her removed from the board. By Friday afternoon, the board had made a different decision entirely.`
      },
      {
        title: 'The Crisis Unfolds',
        content: `At 12:23 PM Pacific Time on Friday, November 17, 2023, OpenAI's board posted a terse announcement: Sam Altman was fired, effective immediately. The statement cited a loss of confidence in his ability to lead but provided no specifics. Mira Murati, the CTO, was named interim CEO.

The tech world was stunned. Microsoft, which had just invested another $10 billion, learned of the decision minutes before the public announcement. OpenAI's 770 employees were blindsided. Within hours, President Greg Brockman resigned in solidarity with Altman.

What followed was unprecedented corporate chaos. By Saturday, investors were demanding Altman's reinstatement. By Sunday, Microsoft offered Altman and Brockman positions leading a new AI research division—along with jobs for any OpenAI employees who wanted to join. On Monday, 505 of OpenAI's 770 employees signed a letter threatening to quit unless the board resigned and reinstated Altman.

The letter's signatories included Ilya Sutskever himself, who had apparently changed his mind. "I deeply regret my participation in the board's actions," he tweeted.`
      },
      {
        title: 'Resolution and Aftermath',
        content: `On Tuesday, November 21st—just five days after the firing—Sam Altman was reinstated as CEO. The board was reconstituted with new members including Bret Taylor (former Salesforce co-CEO) as chairman. Helen Toner and Tasha McCauley departed.

But the crisis exposed fundamental questions that remain unresolved. The "capped-profit" model, designed to balance commercial success with mission focus, had created a governance structure where a non-profit board could unilaterally destroy $86 billion in value—and nearly did.

By 2025, OpenAI had announced plans to restructure into a more traditional for-profit corporation, with the non-profit receiving shares rather than control. Critics argued this represented the triumph of capitalism over mission. Supporters countered that the alternative—a structure that enabled five people to destabilize global AI development—was untenable.

The employees had spoken with their feet, siding with their CEO over the board's concerns about safety. But who should have the final say when the stated mission is protecting all of humanity?`
      }
    ],
    exhibits: [
      {
        type: 'table',
        title: 'OpenAI Governance Structure Evolution',
        data: {
          headers: ['Period', 'Structure', 'Control', 'Investor Rights'],
          rows: [
            ['2015-2019', 'Pure Non-Profit', 'Board of Directors', 'None (donors only)'],
            ['2019-2023', 'Capped-Profit Hybrid', 'Non-profit board', 'Up to 100x returns, no control'],
            ['2023-2024', 'Restructured Hybrid', 'New board with investors', 'Board representation'],
            ['2025+', 'Public Benefit Corp (planned)', 'Traditional governance', 'Standard shareholder rights']
          ]
        }
      },
      {
        type: 'chart',
        title: 'OpenAI Valuation Timeline ($B)',
        data: {
          labels: ['2019', '2020', '2021', '2022', '2023 (Pre-Crisis)', '2023 (Post-Crisis)', '2024'],
          datasets: [{ label: 'Valuation', values: [1, 1, 14, 29, 86, 86, 157] }]
        }
      },
      {
        type: 'quote',
        title: 'Employee Letter to the Board',
        data: {
          text: 'Your actions have destabilized the company, undermined our ability to advance our mission, and threatened to destroy everything we have built. We cannot work for or with people that lack competence, judgment, and care for our mission and employees.',
          attribution: '505 OpenAI Employees',
          role: 'Open Letter, November 20, 2023'
        }
      }
    ],
    questions: [
      { text: 'What are the fundamental tensions in OpenAI\'s "capped-profit" governance model? How did these tensions contribute to the November 2023 crisis?', difficulty: 'easy' },
      { text: 'Apply stakeholder theory to analyze the competing interests at play: employees, investors (Microsoft), the board, and "humanity." Whose interests should take precedence when they conflict?', difficulty: 'medium' },
      { text: 'The employees overwhelmingly sided with Sam Altman over the safety-focused board. What does this reveal about the limits of mission-driven governance when commercial success creates strong employee incentives?', difficulty: 'medium' },
      { text: 'Design an alternative governance structure for OpenAI that balances safety concerns, investor returns, and employee alignment. What mechanisms would you include to prevent both reckless commercialization and governance crises?', difficulty: 'hard' },
      { text: 'Microsoft learned of the CEO firing minutes before the public. How should large strategic investors be incorporated into governance of mission-driven companies without compromising the mission?', difficulty: 'hard' }
    ],
    concepts: ['Stakeholder Management', 'Change Management', 'Organizational Culture']
  },
  {
    slug: 'nvidia-kingmaker-supply-chain-strategy',
    title: 'Nvidia: The Kingmaker of the AI Era',
    company: 'Nvidia',
    industry: 'Technology',
    summary: 'Nvidia transformed from a gaming graphics company into the most valuable chipmaker in history by controlling the scarce resource that powers AI. This case examines how supply chain mastery and ecosystem lock-in created a modern monopoly.',
    sections: [
      {
        title: 'Company Background',
        content: `Nvidia Corporation was founded in 1993 by Jensen Huang, Chris Malachowsky, and Curtis Priem to build graphics processing units (GPUs) for video games. For two decades, the company competed fiercely with AMD and Intel in what seemed like a commodity hardware business.

The pivot came in 2006 when Nvidia released CUDA (Compute Unified Device Architecture), a parallel computing platform that allowed researchers to use GPUs for general-purpose computing. While competitors focused on raw performance benchmarks, Jensen Huang made a bet that would define the AI era: he invested billions in building an ecosystem of software tools, libraries, and developer relationships around CUDA.

By 2024, an estimated 90% of AI researchers used CUDA. Every major AI model—GPT-4, Claude, Gemini—was trained on Nvidia hardware. The company's data center revenue grew from $3 billion in 2020 to over $47 billion in 2024, and its market capitalization briefly exceeded $3 trillion, making it the world's most valuable company.`
      },
      {
        title: 'The Moat: More Than Hardware',
        content: `Nvidia's dominance cannot be explained by chip performance alone. The company built what may be the deepest "moat" in technology history through four interlocking strategies.

First, the CUDA ecosystem created massive switching costs. Researchers who spent years learning CUDA and building CUDA-based tools faced months of retraining to use alternatives. AMD's ROCm platform offered comparable hardware but couldn't overcome the software gap.

Second, Nvidia invested heavily in AI-specific libraries (cuDNN, TensorRT) that optimized performance for neural network operations. These weren't just features—they were years of accumulated optimization that competitors couldn't replicate quickly.

Third, the company built unmatched supply chain relationships. When AI demand exploded in 2023, Nvidia had already secured multi-year commitments from TSMC for cutting-edge chip fabrication. Competitors scrambled for leftover capacity.

Fourth, Nvidia cultivated direct relationships with every major AI lab. Jensen Huang personally delivered the first DGX systems to OpenAI and other research institutions, creating loyalty that transcended transactional relationships.`
      },
      {
        title: 'Geopolitical Complexity',
        content: `Nvidia's dominance made it a instrument of U.S. foreign policy. In October 2022, the Biden administration banned export of advanced AI chips to China. Nvidia's A100 and H100 chips—essential for training large AI models—were suddenly contraband.

The company faced an impossible choice. China represented a massive market, but compliance with export controls was non-negotiable. Nvidia responded by designing "China-specific" chips (A800, H800) that performed just below the threshold that triggered export restrictions.

This cat-and-mouse game continued through 2024. Each time Nvidia released a compliant chip, the U.S. government tightened restrictions. By late 2024, even the hobbled chips were banned, and Chinese companies accelerated efforts to develop domestic alternatives.

The geopolitical situation created strategic risk that even Nvidia's technical dominance couldn't fully address. Chinese cloud providers began stockpiling chips before anticipated bans. Huawei, despite being sanctioned, made progress on its Ascend AI chips. The global semiconductor supply chain, once purely economic, had become a theater of great power competition.`
      },
      {
        title: 'Challenges and Future',
        content: `Despite its dominance, Nvidia faces significant challenges. The company's gross margins exceed 70%—levels that attract competition and regulatory scrutiny. Major customers (Microsoft, Google, Amazon, Meta) are all developing custom AI chips to reduce dependence on Nvidia.

Google's TPU (Tensor Processing Unit) powers much of its internal AI workload. Amazon's Trainium chips are offered to AWS customers as a lower-cost alternative. Microsoft invested in custom silicon for Azure. Each chip that doesn't come from Nvidia represents a crack in the moat.

The company's response has been to run faster. Nvidia announced annual chip architecture updates (compared to the previous two-year cycle) and expanded beyond chips into full AI systems (DGX), networking equipment (acquired Mellanox), and AI software services.

Jensen Huang's strategy appears to be making Nvidia indispensable across the entire AI stack, not just GPUs. Whether this creates sustainable competitive advantage or merely delays commoditization remains the central strategic question.`
      }
    ],
    exhibits: [
      {
        type: 'table',
        title: 'Nvidia Data Center Revenue Growth',
        data: {
          headers: ['Fiscal Year', 'Data Center Revenue', 'YoY Growth', '% of Total Revenue'],
          rows: [
            ['FY2020', '$2.98B', '+43%', '25%'],
            ['FY2021', '$6.70B', '+124%', '40%'],
            ['FY2022', '$10.61B', '+58%', '39%'],
            ['FY2023', '$15.01B', '+41%', '56%'],
            ['FY2024', '$47.53B', '+217%', '78%']
          ]
        }
      },
      {
        type: 'chart',
        title: 'AI Chip Market Share (2024)',
        data: {
          labels: ['Nvidia', 'AMD', 'Intel', 'Google TPU', 'Custom (Cloud)', 'Others'],
          datasets: [{ label: 'Market Share %', values: [80, 5, 3, 4, 6, 2] }]
        }
      },
      {
        type: 'quote',
        title: 'Jensen Huang on Competitive Moat',
        data: {
          text: 'Our CUDA installed base is our most important asset. There are 4 million CUDA developers. Every major AI framework runs on CUDA. This took us 20 years to build. It cannot be replicated in 20 months.',
          attribution: 'Jensen Huang',
          role: 'CEO, Nvidia (Earnings Call 2024)'
        }
      }
    ],
    questions: [
      { text: 'Identify and evaluate the four components of Nvidia\'s competitive moat. Which element is most defensible? Which is most vulnerable?', difficulty: 'easy' },
      { text: 'Using Porter\'s Five Forces, analyze Nvidia\'s strategic position in the AI chip market. How does buyer power from hyperscalers (AWS, Azure, GCP) affect Nvidia\'s pricing power?', difficulty: 'medium' },
      { text: 'How should Nvidia navigate U.S.-China geopolitical tensions? Analyze the tradeoffs between short-term revenue and long-term strategic positioning.', difficulty: 'medium' },
      { text: 'Major cloud providers are developing custom AI chips. Design a strategic response for Nvidia that addresses this vertical integration threat while maintaining relationships with these key customers.', difficulty: 'hard' },
      { text: 'Nvidia\'s 70%+ gross margins are historically unsustainable in hardware. Forecast how margins might evolve over the next 5 years and what strategic moves could protect profitability.', difficulty: 'hard' }
    ],
    concepts: ['Supply Chain Management', 'Competitive Advantage', "Porter's Five Forces"]
  }
]

// Second batch of cases
const cases2: CaseData[] = [
  {
    slug: 'starbucks-back-to-basics-turnaround',
    title: 'Back to Starbucks: Can You Scale Intimacy?',
    company: 'Starbucks',
    industry: 'Retail',
    summary: 'After years of optimizing for mobile orders and throughput, Starbucks faced an identity crisis. New CEO Brian Niccol\'s "back to basics" strategy asks whether a 35,000-store chain can recapture the magic of a neighborhood coffeehouse.',
    sections: [
      {
        title: 'Company Background',
        content: `Starbucks transformed American coffee culture. Founded in Seattle in 1971 as a coffee bean retailer, Howard Schultz reimagined it as the "third place"—a comfortable space between home and work where customers would linger, connect, and become part of a community.

By 2024, Starbucks operated over 35,000 stores worldwide, serving 100 million customer visits per week. The company had become synonymous with premium coffee, generating over $36 billion in annual revenue. But somewhere along the path to ubiquity, critics argued, Starbucks had lost its soul.

The coffeehouse that once featured overstuffed armchairs and live jazz had evolved into a mobile-order fulfillment center. Drive-through windows accounted for over 50% of U.S. transactions. Mobile orders, lauded as a technological triumph, created a chaotic pickup experience that alienated both customers and baristas.`
      },
      {
        title: 'The Efficiency Trap',
        content: `Under CEO Laxman Narasimhan (2023-2024), Starbucks doubled down on operational efficiency. The company introduced the "Siren System"—new espresso machines and processes designed to reduce drink preparation time. Cold beverages, which had grown to 75% of sales, were prioritized because they were faster to make.

But efficiency gains came at a cost. Baristas reported feeling like factory workers, unable to connect with customers while churning out a queue of mobile orders. The average customer wait time decreased, but customer satisfaction scores fell alongside it.

The mobile app, which drove 30% of U.S. transactions, created its own problems. Customers ordered elaborate customizations—the "TikTok drinks" phenomenon—that clogged operations. Some drinks required 15+ modifications. The algorithm couldn't distinguish between a simple espresso and a 47-ingredient monstrosity.

Meanwhile, competitors sensed opportunity. Local coffee shops positioned themselves as the authentic "third place" that Starbucks had abandoned. Dutch Bros, with its emphasis on customer connection, grew from 500 to over 900 locations. Even convenience stores improved their coffee offerings.`
      },
      {
        title: 'Leadership Change',
        content: `In August 2024, Starbucks announced that Laxman Narasimhan would step down after just 17 months as CEO. His replacement: Brian Niccol, the architect of Chipotle's remarkable turnaround.

Niccol had transformed Chipotle from a food safety scandal into a stock that quintupled during his tenure. He did it through relentless focus on food quality, digital innovation, and operational excellence. Wall Street hoped he could apply the same playbook to Starbucks.

The leadership change was dramatic. Starbucks' stock jumped 25% on the announcement—adding $21 billion in market value in a single day. It was the largest single-day gain in the company's history, a measure of both investor enthusiasm and desperation.

Niccol's first actions signaled priorities. He paused the "Siren System" rollout. He announced plans to simplify the menu, eliminating complexity that slowed service. Most importantly, he articulated a vision of returning to "coffeehouse" rather than "coffee factory."`
      },
      {
        title: 'The Strategic Question',
        content: `Niccol's challenge is fundamentally about brand identity at scale. Starbucks built its empire on premium experience, but premium requires scarcity and attention that mass-market operations struggle to deliver.

The menu simplification is illustrative. Reducing from 170,000+ possible drink combinations to something manageable improves operations but risks alienating customers who expect infinite customization. The TikTok generation discovered Starbucks through viral custom drinks—can you tell them "no"?

Similar tensions exist across every dimension of the strategy. Reducing mobile orders improves the in-store experience but abandons a competitive advantage. Slowing expansion protects brand equity but cedes market share to competitors. Investing in barista wages and training increases costs that must be passed to price-sensitive consumers.

The fundamental question: Is "premium at scale" an oxymoron? Can any 35,000-store chain deliver an experience that feels intimate and special? Or must Starbucks choose between being a beloved coffeehouse or an efficient coffee company?`
      }
    ],
    exhibits: [
      {
        type: 'table',
        title: 'Starbucks Performance Metrics (2019-2024)',
        data: {
          headers: ['Metric', '2019', '2022', '2024', 'Trend'],
          rows: [
            ['Global Stores', '31,256', '35,711', '38,587', '↑'],
            ['Same-Store Sales Growth (US)', '+5%', '+7%', '-3%', '↓'],
            ['Mobile Order %', '17%', '26%', '31%', '↑'],
            ['Customer Satisfaction Score', '82', '76', '71', '↓'],
            ['Barista Turnover Rate', '65%', '78%', '85%', '↑']
          ]
        }
      },
      {
        type: 'chart',
        title: 'Revenue by Channel Mix',
        data: {
          labels: ['In-Store', 'Drive-Through', 'Mobile Pickup', 'Delivery'],
          datasets: [{ label: '% of Sales', values: [25, 48, 22, 5] }]
        }
      },
      {
        type: 'quote',
        title: 'Brian Niccol Vision Statement',
        data: {
          text: 'We\'re going to get back to Starbucks. The coffeehouse. A welcoming place where people can connect over great coffee. We have drifted from that. Mobile order has turned stores into transaction points. That stops now.',
          attribution: 'Brian Niccol',
          role: 'CEO, Starbucks (September 2024)'
        }
      }
    ],
    questions: [
      { text: 'What factors drove Starbucks\' strategic drift from "third place" to "mobile order factory"? Were these decisions rational given the information available at the time?', difficulty: 'easy' },
      { text: 'Apply the concept of "brand equity" to analyze what Starbucks has lost and what it needs to recover. How do you measure the value of intangible assets like "coffeehouse atmosphere"?', difficulty: 'medium' },
      { text: 'Brian Niccol succeeded at Chipotle by improving operations while preserving brand identity. How transferable is that playbook to Starbucks, given the different customer expectations and competitive dynamics?', difficulty: 'medium' },
      { text: 'Design a mobile ordering system that maintains convenience while restoring the in-store experience. What tradeoffs are unavoidable?', difficulty: 'hard' },
      { text: 'Develop a five-year strategic plan for Starbucks that addresses the tension between scale and intimacy. Should the company accept being a "coffee company" or fight to remain a "coffeehouse"?', difficulty: 'hard' }
    ],
    concepts: ['Change Management', 'Brand Positioning', 'Marketing Mix (4Ps)']
  },
  {
    slug: 'crowdstrike-blue-screen-crisis',
    title: 'CrowdStrike: The $5.4 Billion Blue Screen of Death',
    company: 'CrowdStrike',
    industry: 'Technology',
    summary: 'A single faulty software update crashed 8.5 million Windows devices worldwide, grounding flights and disrupting hospitals. This case examines how a cybersecurity company\'s quality failure became the largest IT outage in history.',
    sections: [
      {
        title: 'Company Background',
        content: `CrowdStrike Holdings was founded in 2011 by former McAfee executives George Kurtz and Dmitri Alperovitch. The company pioneered "endpoint detection and response" (EDR)—a cloud-based approach to cybersecurity that monitored devices in real-time rather than relying on traditional antivirus signatures.

By 2024, CrowdStrike had grown into a $75 billion cybersecurity giant, protecting over 29,000 customers including most Fortune 100 companies. The company's Falcon platform was installed on endpoints ranging from hospital workstations to airline check-in systems to banking terminals.

The Falcon sensor operated at the deepest level of Windows—the kernel—with the highest system privileges. This was necessary for security: malware often attempted to hide from detection by compromising the operating system itself. CrowdStrike needed kernel access to catch these threats.

But kernel access meant kernel risk. Any bug in CrowdStrike's code could crash not just the application, but the entire operating system. And on July 19, 2024, that's exactly what happened.`
      },
      {
        title: 'The Incident',
        content: `At 04:09 UTC on Friday, July 19, 2024, CrowdStrike pushed a routine configuration update to its Falcon sensor. The update was intended to improve detection of a specific type of malicious named pipe—a technical detail that should have been invisible to users.

Instead, the update contained a logic error that triggered a null pointer exception in the Windows kernel. Any device running Windows with an active CrowdStrike Falcon sensor immediately crashed, displaying the infamous "Blue Screen of Death."

The update propagated automatically through CrowdStrike's cloud infrastructure. Within hours, 8.5 million Windows devices were down—roughly 1% of all Windows machines globally. But the affected machines were disproportionately critical: enterprise systems protected by expensive security software.

Airlines were hit particularly hard. Delta, United, and American grounded thousands of flights as reservation systems crashed. Airports from Tokyo to Toronto displayed blue screens instead of departure boards. Hospitals reverted to paper records. Banks closed branches. 911 call centers in multiple states lost functionality.

CrowdStrike identified the bug within 78 minutes and stopped distributing the faulty update. But the damage was done—and undoing it would take days.`
      },
      {
        title: 'Recovery Chaos',
        content: `Fixing the crash required manual intervention on each affected device. Administrators had to boot into Windows Safe Mode, navigate to the CrowdStrike directory, and delete the offending update file. This process took 5-15 minutes per machine—manageable for a small office, impossible for enterprises with hundreds of thousands of endpoints.

Delta Airlines, with over 60,000 affected devices, spent five days recovering. The airline canceled over 5,000 flights, stranding hundreds of thousands of passengers. CEO Ed Bastian publicly blamed CrowdStrike and Microsoft, estimating losses at $500 million.

CrowdStrike's crisis response drew criticism. CEO George Kurtz's initial statement didn't include an apology. The company offered affected customers $10 Uber Eats gift cards as a goodwill gesture—an attempt that was widely mocked and quickly rescinded.

Lawsuits followed. Delta sued CrowdStrike for gross negligence. Shareholders filed class actions alleging inadequate testing procedures. Insurance companies, facing potentially billions in claims, began scrutinizing their exposure to single points of technological failure.`
      },
      {
        title: 'Systemic Implications',
        content: `The CrowdStrike incident exposed a troubling reality about modern technology infrastructure: critical systems worldwide depended on software that could be remotely updated without human review, and when that software failed, there was no fallback.

CrowdStrike wasn't a rogue operator—it was following industry best practices. Continuous updates were considered essential for cybersecurity, allowing rapid response to new threats. The alternative, slower manual updates, would leave systems vulnerable to fast-moving attackers.

But the incident revealed that "best practices" for cybersecurity created systemic risk for reliability. The same kernel access that made CrowdStrike effective at catching malware made it capable of crashing systems globally. The same automatic updates that kept defenses current could push a bug to millions of machines simultaneously.

The policy questions are profound. Should critical infrastructure be required to delay security updates for testing? Should software vendors face strict liability for outages their code causes? How should the risk of software monocultures—where millions of systems depend on identical code—be managed?

CrowdStrike's stock fell 11% the day after the incident but recovered within months as customers demonstrated reluctance to switch providers. The company retained nearly all major accounts, suggesting that even a catastrophic failure couldn't overcome the friction of changing security platforms. Whether that's reassuring or alarming depends on your perspective.`
      }
    ],
    exhibits: [
      {
        type: 'table',
        title: 'CrowdStrike Incident Impact Assessment',
        data: {
          headers: ['Sector', 'Systems Affected', 'Recovery Time', 'Est. Financial Impact'],
          rows: [
            ['Airlines', '~150,000 devices', '3-5 days', '$1.5B+ (Delta alone: $500M)'],
            ['Healthcare', '~500,000 devices', '1-3 days', 'Immeasurable (patient risk)'],
            ['Financial Services', '~200,000 devices', '12-48 hours', '$400M+'],
            ['Retail', '~300,000 devices', '24-72 hours', '$200M+'],
            ['Government', '~100,000 devices', '2-5 days', 'Unknown']
          ]
        }
      },
      {
        type: 'chart',
        title: 'CrowdStrike Stock Price (July 2024)',
        data: {
          labels: ['Jul 15', 'Jul 17', 'Jul 19 (Incident)', 'Jul 22', 'Jul 24', 'Jul 26'],
          datasets: [{ label: 'Stock Price ($)', values: [343, 351, 305, 263, 249, 234] }]
        }
      },
      {
        type: 'quote',
        title: 'Delta CEO on the Incident',
        data: {
          text: 'If you\'re going to be having access, priority access to the cockpit of our technology systems, you\'d better have the most reliable, resilient software on the planet. And they did not.',
          attribution: 'Ed Bastian',
          role: 'CEO, Delta Air Lines (CNBC Interview)'
        }
      }
    ],
    questions: [
      { text: 'What testing and deployment failures led to the CrowdStrike incident? Design a quality assurance process that could have prevented this specific failure.', difficulty: 'easy' },
      { text: 'Analyze CrowdStrike\'s crisis communication strategy. What should they have done differently in the first 24 hours? First week?', difficulty: 'medium' },
      { text: 'Delta is suing CrowdStrike, but CrowdStrike\'s contracts include liability caps. Analyze the legal and business implications of liability limitations for critical infrastructure software.', difficulty: 'medium' },
      { text: 'The incident revealed systemic risk from software monocultures. Propose a regulatory framework that balances the need for standardized security tools with the risk of single points of failure.', difficulty: 'hard' },
      { text: 'Despite the incident, CrowdStrike retained most customers and stock recovered. What does this suggest about competitive dynamics in cybersecurity? Is this market structure healthy?', difficulty: 'hard' }
    ],
    concepts: ['Change Management', 'Supply Chain Management', 'Stakeholder Management']
  }
]

async function seedCases() {
  console.log('🌱 Seeding case studies...')
  
  // Get the operator user
  const operator = await prisma.user.findFirst({
    where: { role: 'operator' }
  })
  
  if (!operator) {
    console.error('❌ No operator user found. Run npm run db:seed first.')
    return
  }

  const allCases = [...cases, ...cases2]
  
  for (const caseData of allCases) {
    // Check if case already exists
    const existing = await prisma.case.findUnique({
      where: { slug: caseData.slug }
    })
    
    if (existing) {
      console.log(`⏭️  Skipping ${caseData.title} (already exists)`)
      continue
    }

    // Get concept IDs
    const concepts = await prisma.concept.findMany({
      where: { name: { in: caseData.concepts } }
    })

    // Create the case
    const createdCase = await prisma.case.create({
      data: {
        slug: caseData.slug,
        title: caseData.title,
        company: caseData.company,
        industry: caseData.industry,
        summary: caseData.summary,
        content: JSON.stringify(caseData.sections),
        status: 'published',
        publishedAt: new Date(),
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

    console.log(`✅ Created: ${createdCase.title}`)
  }

  console.log('🎉 Case seeding complete!')
}

seedCases()
  .catch(console.error)
  .finally(() => prisma.$disconnect())


