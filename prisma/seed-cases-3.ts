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
    slug: 'meta-ftc-antitrust-victory',
    title: 'Meta vs. The FTC: Defining the Market',
    company: 'Meta',
    industry: 'Technology',
    summary: 'In 2025, Meta defeated the FTC\'s antitrust suit by successfully arguing it doesn\'t monopolize "personal social networking." This case examines how market definition determines merger outcomes and regulatory strategy.',
    sections: [
      {
        title: 'The Government\'s Case',
        content: `In December 2020, the Federal Trade Commission filed an antitrust lawsuit against Facebook (now Meta), seeking to unwind the acquisitions of Instagram (2012, $1 billion) and WhatsApp (2014, $19 billion). The FTC alleged that Facebook had pursued a "buy or bury" strategy, acquiring nascent competitors before they could threaten its social networking monopoly.

The complaint centered on market definition. The FTC argued that Facebook dominated "personal social networking services"—platforms where users maintain connections with friends and family, share content, and communicate. By this definition, Facebook controlled over 70% of the market.

The acquisitions, the FTC alleged, were defensive. Internal emails showed Facebook executives worried about Instagram's rapid growth and potential to replace Facebook's core product. Mark Zuckerberg wrote in 2012 that Instagram could be "very disruptive to us" and that buying them would give Facebook "a year or more to integrate their dynamics before anyone can get close to their scale again."

The requested remedy was unprecedented: forced divestiture of Instagram and WhatsApp, companies Meta had owned for over a decade and deeply integrated into its advertising infrastructure.`
      },
      {
        title: 'Meta\'s Defense',
        content: `Meta's legal strategy hinged on one argument: the FTC's market definition was artificially narrow. In reality, Meta argued, it competed in a vast "attention economy" that included TikTok, YouTube, Twitter/X, Snapchat, iMessage, and countless other platforms vying for user time.

By this broader definition, Meta was far from a monopoly. TikTok had surged past Instagram in user engagement. YouTube dominated video. Users spent increasing time in messaging apps, gaming platforms, and streaming services. The social media landscape of 2025 looked nothing like 2012.

Meta also challenged the FTC's theory of harm. The acquisitions had occurred over a decade earlier, with FTC awareness. Instagram under Meta's ownership had grown from 30 million users to over 2 billion. WhatsApp remained free. Where was the consumer harm that antitrust law required?

Finally, Meta argued that unwinding the acquisitions was practically impossible. Instagram's code, data, and advertising systems had been merged with Facebook's. WhatsApp had been integrated into Meta's infrastructure for business messaging. Divestiture would destroy value, not create competition.`
      },
      {
        title: 'The Court\'s Ruling',
        content: `In October 2025, Judge James Boasberg ruled largely in Meta's favor, dismissing the FTC's monopoly claims. The ruling turned on market definition.

The court found that the FTC's "personal social networking" market was too narrow and backward-looking. By 2025, users divided attention across platforms in ways that made Facebook just one option among many. TikTok, in particular, had transformed the competitive landscape since the acquisitions.

The court also found that the FTC had not demonstrated that the acquisitions reduced competition. Instagram and WhatsApp might have declined or pivoted without Meta's investment. The counterfactual—what would have happened absent the mergers—was impossible to prove a decade later.

The ruling did not exonerate Meta's conduct. Judge Boasberg noted that internal communications showed anticompetitive intent and that the acquisitions "probably" harmed competition in the short term. But proving antitrust violations required more than probably, and the FTC's evidence fell short.

The FTC announced it would appeal, but the legal precedent had been set: retrospective challenges to completed mergers faced nearly insurmountable hurdles.`
      },
      {
        title: 'Implications for Antitrust',
        content: `The Meta ruling highlighted fundamental tensions in antitrust enforcement for technology markets. Traditional antitrust focused on consumer harm, typically measured by price. But Facebook, Instagram, and WhatsApp were free to users. The harm, if any, was reduced innovation and choice—harder to prove than higher prices.

Market definition proved decisive. The FTC's narrow definition captured Facebook's dominance but failed to account for platforms that competed for the same user attention. Meta's broader definition painted the company as one competitor among many in a dynamic market.

The ruling also exposed the limitations of retrospective enforcement. By the time the FTC sued, Instagram and WhatsApp had been integrated for years. The court was unwilling to impose a remedy whose costs (destroying integrated products) clearly exceeded its benefits (speculative competition increases).

For future tech acquisitions, the lesson was clear: move quickly, integrate deeply, and wait. Regulatory challenges become harder with time. The FTC's loss in Meta may accelerate efforts to reform merger review, requiring earlier intervention in potentially anticompetitive acquisitions. But in 2025, the existing framework had reached its limits.`
      }
    ],
    exhibits: [
      {
        type: 'table',
        title: 'Competing Market Definitions',
        data: {
          headers: ['Definition', 'Included Platforms', 'Meta Share', 'FTC Position'],
          rows: [
            ['Personal Social Networking', 'Facebook, Instagram, Snapchat', '~75%', 'Monopoly'],
            ['Social Media', 'Above + TikTok, X, LinkedIn', '~35%', 'Significant but not dominant'],
            ['Attention Economy', 'Above + YouTube, Netflix, gaming', '~15%', 'One competitor among many'],
            ['Digital Advertising', 'Google, Meta, Amazon, others', '~20%', 'Duopoly with Google']
          ]
        }
      },
      {
        type: 'chart',
        title: 'Social Media Time Spent Share (2024)',
        data: {
          labels: ['TikTok', 'YouTube', 'Instagram', 'Facebook', 'Snapchat', 'X/Twitter', 'Other'],
          datasets: [{ label: 'Share of Time', values: [32, 25, 17, 12, 6, 4, 4] }]
        }
      },
      {
        type: 'quote',
        title: 'Court Opinion Excerpt',
        data: {
          text: 'The FTC asks this Court to unwind acquisitions completed over a decade ago, based on a market definition that ignores how dramatically the competitive landscape has changed. Whatever Facebook\'s intent in 2012, the company today faces competition that the Commission\'s theory does not adequately address.',
          attribution: 'Judge James Boasberg',
          role: 'U.S. District Court (Opinion, October 2025)'
        }
      }
    ],
    questions: [
      { text: 'Why is market definition so critical in antitrust cases? How did different market definitions lead to different conclusions about Meta\'s market power?', difficulty: 'easy' },
      { text: 'The court found anticompetitive intent but not antitrust violation. Analyze the gap between corporate strategy (eliminating competitors) and legal liability (demonstrable consumer harm).', difficulty: 'medium' },
      { text: 'Should antitrust law be reformed to address acquisitions of nascent competitors before they become threats? Design a regulatory framework that balances innovation incentives with competition protection.', difficulty: 'hard' },
      { text: 'Meta successfully argued that TikTok changed the competitive landscape. How should courts account for post-merger competition that didn\'t exist when acquisitions occurred?', difficulty: 'medium' },
      { text: 'You are General Counsel of a large tech company considering acquiring a fast-growing competitor. Based on the Meta case, what factors would you weigh in determining antitrust risk?', difficulty: 'hard' }
    ],
    concepts: ['Competitive Advantage', 'Market Structure', 'Mergers & Acquisitions']
  },
  {
    slug: 'spotify-year-of-efficiency',
    title: 'Spotify\'s Year of Efficiency: From Growth to Value',
    company: 'Spotify',
    industry: 'Media & Entertainment',
    summary: 'After years of prioritizing growth over profit, Spotify achieved consistent profitability in 2025 by cutting podcast investments and raising prices. This case examines the painful transition from growth stock to value stock.',
    sections: [
      {
        title: 'The Growth Era',
        content: `Spotify launched in 2008 with a simple promise: access to all the world's music for a monthly subscription. The Swedish company pioneered streaming, eventually reaching over 600 million users and 240 million subscribers by 2024—making it the largest music streaming service globally.

But growth came at a cost. Spotify paid approximately 70% of revenue to record labels as royalties, leaving razor-thin margins for operations and investment. The company lost money every year from its 2018 IPO through 2023, burning billions to acquire users who generated minimal profit.

CEO Daniel Ek's strategy was to escape the music margin trap through diversification. Starting in 2019, Spotify invested over $1 billion in podcasting, acquiring studios (Gimlet, Parcast), exclusive shows (Joe Rogan for $200M+), and technology platforms (Anchor, Megaphone). The theory: podcasts had no label royalties, so profits from podcasting would subsidize the music business.

Wall Street rewarded the vision. At its peak in 2021, Spotify's stock exceeded $360, valuing the unprofitable company at over $70 billion.`
      },
      {
        title: 'The Reckoning',
        content: `By 2023, the podcast strategy was failing. Despite massive investment, podcasting remained less than 10% of listening time on the platform. Exclusive shows drew some listeners but didn't convert to subscribers—most users came for music and treated podcasts as a bonus.

The Joe Rogan deal, intended as a strategic masterstroke, became a liability. Controversies over COVID misinformation led artists like Neil Young to remove their music in protest. Advertisers grew cautious. The exclusive content that was supposed to differentiate Spotify instead generated headlines Ek didn't want.

Meanwhile, the core music business faced pressure. Apple Music, Amazon Music, and YouTube Music competed aggressively. Price increases risked churn to competitors or piracy. Spotify was stuck: unable to profit on music, unable to scale podcasting, unable to raise prices.

The stock collapsed. From its $360 peak, Spotify fell below $100 by late 2022. Investors who had believed in the growth story capitulated. The company that was supposed to be the "Netflix of audio" looked more like a utility with terminal margin compression.`
      },
      {
        title: 'The Efficiency Pivot',
        content: `In January 2023, Spotify announced layoffs of 6% of its workforce—600 employees. In June, another 2%. In December, 17% more—1,500 people. By early 2024, Spotify had reduced headcount by over 25% from its peak.

The cuts went beyond staff. Spotify shut down podcast studios, canceled exclusive shows, and wrote off hundreds of millions in podcast investments. The company renegotiated its deal with Joe Rogan, removing exclusivity (his show would also appear on YouTube and Apple). Original content budgets were slashed.

Simultaneously, Spotify raised prices. The company increased U.S. premium subscriptions from $9.99 to $10.99 in 2023, then to $11.99 in 2024—a 20% increase in two years. Despite fears of mass churn, subscribers stayed. It turned out that switching streaming services was more hassle than the price increase was worth.

The combination of cost cuts and price increases transformed Spotify's financials. In Q4 2023, the company reported its first profitable quarter in over a year. By 2024, profitability was consistent. The stock, responding to actual earnings rather than growth promises, recovered to $300+.`
      },
      {
        title: 'The New Spotify',
        content: `The 2024 Spotify was a fundamentally different company than the 2020 version. Gone was the ambition to dominate all of audio. In its place was a disciplined streaming service focused on sustainable margins.

The pivot required painful admissions. Ek acknowledged that podcast investments had not generated expected returns. The company accepted that music licensing costs couldn't be fundamentally changed. The competitive moat wasn't exclusive content—it was 600 million users' playlists and recommendations, a switching cost no competitor could easily overcome.

Strategically, Spotify shifted from offense to defense. Rather than acquiring content, the company invested in product features that improved retention. AI-powered playlists, podcast recommendations, and social features kept users engaged without expensive licensing deals.

The "year of efficiency" raised fundamental questions about tech company strategy. For a decade, growth had been prioritized over profits. Low interest rates enabled companies to burn cash indefinitely. Spotify's pivot was part of a broader market shift—across tech, companies were learning that growth without profitability was no longer rewarded.

For Spotify specifically, the transition from growth to value stock was irreversible. Investors who owned Spotify for its growth potential had sold; new investors owned it for cash flow. The company's identity, and the skills required to lead it, had fundamentally changed.`
      }
    ],
    exhibits: [
      {
        type: 'table',
        title: 'Spotify Financial Transformation',
        data: {
          headers: ['Metric', '2021', '2023', '2024', 'Change'],
          rows: [
            ['Revenue (€B)', '9.67', '13.25', '15.67', '+62%'],
            ['Gross Margin', '26%', '27%', '31%', '+5pp'],
            ['Operating Income (€M)', '-293', '+268', '+1,120', 'Profitable'],
            ['Headcount', '8,500', '9,800', '7,300', '-14%'],
            ['Podcast Investment (€M)', '~400', '~200', '~50', '-88%']
          ]
        }
      },
      {
        type: 'chart',
        title: 'Spotify Stock Price Journey',
        data: {
          labels: ['2021 Peak', '2022 Trough', '2023 Recovery', '2024 Efficiency', '2025 Today'],
          datasets: [{ label: 'Stock Price ($)', values: [364, 82, 155, 290, 320] }]
        }
      },
      {
        type: 'quote',
        title: 'Daniel Ek on Strategy Shift',
        data: {
          text: 'We got too focused on doing everything well, instead of doing the right things well. Our podcast investments didn\'t generate the returns we expected. We\'re now maniacally focused on profitability, and that means saying no to things we used to say yes to.',
          attribution: 'Daniel Ek',
          role: 'CEO, Spotify (Earnings Call, 2024)'
        }
      }
    ],
    questions: [
      { text: 'Analyze Spotify\'s podcast strategy failure. What assumptions proved wrong? How could the strategy have been tested before $1B+ was invested?', difficulty: 'easy' },
      { text: 'Spotify raised prices 20% while cutting costs. What factors allowed price increases without significant churn? How sustainable is this pricing power?', difficulty: 'medium' },
      { text: 'The transition from "growth stock" to "value stock" requires different capabilities and culture. How should Spotify manage this organizational transformation?', difficulty: 'medium' },
      { text: 'Build a discounted cash flow model for Spotify comparing the growth strategy (2021) vs. efficiency strategy (2024). Which creates more enterprise value and why?', difficulty: 'hard' },
      { text: 'Spotify accepted that podcast differentiation failed. What defensible competitive advantages remain? Design a long-term strategy that doesn\'t depend on exclusive content.', difficulty: 'hard' }
    ],
    concepts: ['DCF Valuation', 'Competitive Advantage', 'Working Capital Management']
  },
  {
    slug: 'privatbank-cloud-migration-under-fire',
    title: 'PrivatBank: Cloud Migration Under Fire',
    company: 'PrivatBank',
    industry: 'Finance',
    summary: 'When Russia invaded Ukraine, PrivatBank migrated its entire infrastructure to the cloud in weeks—while under physical and cyber attack. This case examines operational resilience and digital transformation under the most extreme conditions imaginable.',
    sections: [
      {
        title: 'Pre-War Context',
        content: `PrivatBank is Ukraine's largest bank, serving over 20 million customers—nearly half of Ukraine's population. The bank operates 3,000 branches, processes 75% of Ukraine's retail transactions, and manages critical infrastructure including government salary payments and pension disbursements.

Before February 2022, PrivatBank operated a traditional banking IT architecture. Core systems ran on servers in data centers located across Ukraine, with disaster recovery sites within the country. The infrastructure was robust for normal operations but not designed for an existential threat.

The bank had begun a cloud migration project in 2021, working with Amazon Web Services (AWS). But the timeline assumed years of careful planning—methodically moving workloads while maintaining regulatory compliance and operational continuity. The invasion compressed that timeline catastrophically.`
      },
      {
        title: 'The Invasion',
        content: `On February 24, 2022, Russian forces invaded Ukraine from multiple directions. Within days, they were advancing toward Kyiv and other major cities. PrivatBank faced a nightmare scenario: data centers could be captured or destroyed, staff might be unable to reach offices, and the entire country's financial system hung in the balance.

The cyber attacks began even before the physical invasion. Russian hackers launched distributed denial-of-service attacks, attempted to breach customer databases, and probed for vulnerabilities in critical systems. Ukraine's government warned banks to prepare for "wiper" malware designed to permanently destroy data.

PrivatBank's leadership made an immediate decision: accelerate cloud migration from a multi-year project to weeks. Every critical system would be moved to AWS infrastructure outside Ukraine. If data centers were destroyed, the bank would continue operating from the cloud.

The challenge was unprecedented. No bank had ever attempted a migration of this scale and speed. Regulatory frameworks assumed careful, documented transitions. Customer service couldn't pause during wartime—people needed access to their money more than ever.`
      },
      {
        title: 'The Migration',
        content: `Over the following weeks, PrivatBank engineers worked around the clock—some from bunkers during air raids, others after evacuating families to safer regions. They migrated core banking systems, customer databases, transaction processing, and mobile applications to AWS infrastructure in Frankfurt and other European locations.

The technical challenges were immense. Legacy systems built for on-premise operation had to be rapidly containerized. Network configurations assumed local data centers, not connections spanning thousands of kilometers. Security had to be maintained while moving terabytes of sensitive financial data over potentially compromised networks.

AWS deployed a dedicated team to support the migration, providing technical expertise and expedited access to resources. The collaboration operated under extraordinary conditions—video calls interrupted by air raid sirens, engineers disappearing for hours to reach bomb shelters, critical decisions made with incomplete information.

Remarkably, PrivatBank maintained operations throughout. The mobile app continued functioning. Customers could access accounts, make payments, and receive salaries. The financial system that millions of Ukrainians depended on survived the initial invasion intact.`
      },
      {
        title: 'Lessons in Resilience',
        content: `The PrivatBank migration offered lessons that extend far beyond wartime. Most fundamentally, it demonstrated that digital transformation speed is a choice, not a technical constraint. When the alternative was organizational death, years of planned migration collapsed into weeks.

The case also revealed dependencies that peacetime planning obscured. Physical data centers represented single points of failure that no disaster recovery plan fully addressed. The assumption that infrastructure would remain accessible—taken for granted in normal operations—proved fragile.

For cloud providers, PrivatBank demonstrated the value of relationships built before crisis. AWS's ability to support rapid migration came from existing engagement and trust developed over years of pre-war work. Crisis response depends on capabilities built during calm.

The ongoing operation—PrivatBank continues to serve millions of customers from cloud infrastructure through 2024 and beyond—validates a resilience architecture that distributes risk geographically. No physical attack can destroy infrastructure that exists across multiple countries and data centers.

The human element proved decisive. Technical capabilities existed before the war—what changed was the willingness to use them at maximum speed, accepting risks that peacetime process would never allow. The engineers who worked through bombardment demonstrated that organizational resilience ultimately depends on people, not systems.`
      }
    ],
    exhibits: [
      {
        type: 'table',
        title: 'PrivatBank Migration Timeline',
        data: {
          headers: ['Phase', 'Normal Timeline', 'Wartime Execution', 'Key Challenges'],
          rows: [
            ['Assessment & Planning', '3-6 months', '48 hours', 'No time for documentation'],
            ['Infrastructure Setup', '2-3 months', '1 week', 'Expedited AWS provisioning'],
            ['Core Banking Migration', '12-18 months', '3 weeks', 'Legacy system adaptation'],
            ['Testing & Validation', '3-6 months', 'Continuous', 'Production testing only'],
            ['Full Cutover', '1-2 months', 'Ongoing', 'Phased by system criticality']
          ]
        }
      },
      {
        type: 'chart',
        title: 'PrivatBank Transaction Volume (2022)',
        data: {
          labels: ['Jan', 'Feb (Invasion)', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{ label: 'Daily Transactions (Millions)', values: [12, 8, 15, 14, 16, 17] }]
        }
      },
      {
        type: 'quote',
        title: 'PrivatBank CTO on the Migration',
        data: {
          text: 'We had two choices: migrate in weeks or cease to exist. Every process designed for normal operations became irrelevant. We made decisions in hours that would normally take months of committee review. We had to trust our engineers and accept that perfection was impossible—survival was the only metric.',
          attribution: 'PrivatBank Technology Leadership',
          role: '(Paraphrased from interviews)'
        }
      }
    ],
    questions: [
      { text: 'What aspects of PrivatBank\'s pre-war cloud engagement enabled the rapid wartime migration? How should organizations build similar optionality?', difficulty: 'easy' },
      { text: 'The migration accepted risks that normal processes would reject. Develop a framework for determining when "crisis mode" operations are justified and how to ensure they remain exceptional.', difficulty: 'medium' },
      { text: 'Apply operations management concepts to analyze PrivatBank\'s migration. What bottlenecks emerged? How were they addressed?', difficulty: 'medium' },
      { text: 'Design a "resilience architecture" for a critical infrastructure organization that prepares for scenarios like invasion or natural disaster. What investments are justified in peacetime?', difficulty: 'hard' },
      { text: 'The PrivatBank case shows that digital transformation speed is often constrained by organizational process rather than technical capability. How should leaders balance process discipline with transformation urgency in normal times?', difficulty: 'hard' }
    ],
    concepts: ['Supply Chain Management', 'Lean Operations', 'Change Management']
  }
]

async function seedCases() {
  console.log('🌱 Seeding case studies (batch 3)...')
  
  const operator = await prisma.user.findFirst({
    where: { role: 'operator' }
  })
  
  if (!operator) {
    console.error('❌ No operator user found.')
    return
  }

  for (const caseData of cases) {
    const existing = await prisma.case.findUnique({
      where: { slug: caseData.slug }
    })
    
    if (existing) {
      console.log(`⏭️  Skipping ${caseData.title} (already exists)`)
      continue
    }

    const concepts = await prisma.concept.findMany({
      where: { name: { in: caseData.concepts } }
    })

    const createdCase = await prisma.case.create({
      data: {
        slug: caseData.slug,
        title: caseData.title,
        company: caseData.company,
        industry: caseData.industry,
        summary: caseData.summary,
        content: JSON.stringify(caseData.sections),
        status: 'published',
        publishedAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000),
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

  console.log('🎉 Batch 3 complete!')
}

seedCases()
  .catch(console.error)
  .finally(() => prisma.$disconnect())


