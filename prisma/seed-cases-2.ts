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
    slug: 'microsoft-copilot-vs-incumbents',
    title: 'The GenAI Divide: When Good Enough Wins',
    company: 'Microsoft',
    industry: 'Technology',
    summary: 'As Microsoft bundles AI into Office, specialized productivity apps face an existential question: Is AI a feature or a product? This case examines the strategic battlefield where giants and startups compete for the future of work.',
    sections: [
      {
        title: 'The New Competitive Landscape',
        content: `In March 2023, Microsoft launched Copilot—a generative AI assistant integrated directly into Microsoft 365 applications. For $30 per user per month (on top of existing subscriptions), enterprises could access AI that wrote emails in Outlook, created presentations in PowerPoint, and analyzed data in Excel.

The announcement sent shockwaves through the productivity software industry. Companies that had spent years building AI-powered writing, note-taking, and project management tools suddenly faced competition from the world's largest enterprise software company—bundled into software their customers already used.

The implications were existential. Notion, Evernote, Grammarly, Jasper, and dozens of others had built businesses on the promise that AI would revolutionize productivity. Now Microsoft was offering "good enough" AI that required no additional purchase, no new app to learn, no data migration.`
      },
      {
        title: 'The Bundling Strategy',
        content: `Microsoft's bundling strategy wasn't new—it was the same playbook that defeated Netscape, WordPerfect, and Lotus. Integrate competitive features into the dominant platform, leverage existing distribution, and wait for standalone competitors to wither.

But the AI era presented unique dynamics. Unlike browsers or word processors, AI capabilities were expensive to build and operate. OpenAI (Microsoft's partner) spent hundreds of millions on training and inference. Could specialized players afford to compete on AI quality when Microsoft subsidized losses through its enterprise monopoly?

The early evidence was sobering for specialists. Grammarly, a $13 billion writing assistant, saw enterprise customers questioning renewals when Copilot offered similar features. Notion scrambled to add AI features, then raised prices to cover costs—only to face user backlash. Evernote, already struggling, attempted an AI pivot that alienated its remaining loyal users.

Yet the picture wasn't uniformly grim. Some specialists discovered that "good enough" wasn't always enough. Jasper, focused on marketing content, argued that domain-specific AI trained on marketing data outperformed general-purpose Copilot. Notion positioned its AI as deeply integrated with its unique document structure. The survivors would be those who found defensible niches.`
      },
      {
        title: 'The Enterprise Buyer Decision',
        content: `For enterprise IT buyers, the Copilot era created a complex procurement puzzle. On one hand, consolidating on Microsoft reduced vendor management overhead and integration complexity. On the other, best-of-breed specialists often delivered superior functionality for specific use cases.

A typical enterprise might face this calculus: Pay $30/user/month for Copilot across 10,000 employees ($3.6M annually), or maintain separate contracts with Grammarly ($15/user), Notion ($10/user), and a writing assistant ($20/user). The bundled solution appeared cheaper even if it was inferior in each category.

But the math was more complex than it appeared. Employee productivity differences could dwarf licensing costs. If a specialized tool saved just 10 minutes per day compared to Copilot's "good enough," the ROI calculation changed dramatically. The challenge was quantifying these differences.

Early enterprise surveys revealed mixed results. Copilot adoption was rapid but shallow—employees used it for simple tasks but reverted to specialized tools for complex work. Whether this pattern would hold as Copilot improved remained the central uncertainty.`
      },
      {
        title: 'Strategic Responses',
        content: `Specialists adopted divergent strategies. Some pursued the "Zoom playbook"—find an underserved use case, achieve product-market fit, and grow fast enough to survive the inevitable competitive response. Notion doubled down on its unique block-based document model. Figma (before Adobe's failed acquisition) built AI deeply into design workflows Microsoft couldn't easily replicate.

Others sought refuge in vertical markets. AI writing tools for legal, medical, and technical documentation positioned themselves as too specialized for general-purpose Copilot. These niches were smaller but more defensible.

A third group pivoted to infrastructure. Rather than competing with Copilot on applications, they offered to power AI features within other companies' products. This B2B2C model surrendered consumer visibility but generated recurring revenue.

The most controversial response was price increases. When Evernote raised prices 50% to fund AI features, users revolted. When Notion added AI as a paid add-on, competitors pounced on the perception of nickel-and-diming. Pricing AI features was a minefield—charge too little and you can't afford to compete; charge too much and you drive users to "good enough" alternatives.`
      }
    ],
    exhibits: [
      {
        type: 'table',
        title: 'AI Feature Comparison: Copilot vs Specialists',
        data: {
          headers: ['Feature', 'Microsoft Copilot', 'Specialist Tools', 'Enterprise Verdict'],
          rows: [
            ['Email Writing', 'Good (Outlook native)', 'Better (Superhuman)', 'Copilot wins on convenience'],
            ['Document Creation', 'Good (Word native)', 'Better (Notion AI)', 'Depends on workflow'],
            ['Data Analysis', 'Excellent (Excel native)', 'Variable', 'Copilot wins decisively'],
            ['Marketing Copy', 'Basic', 'Excellent (Jasper)', 'Specialists win'],
            ['Code Assistance', 'Excellent (GitHub Copilot)', 'Good', 'Microsoft wins']
          ]
        }
      },
      {
        type: 'chart',
        title: 'Enterprise AI Tool Spending (2024)',
        data: {
          labels: ['Microsoft 365 + Copilot', 'Standalone AI Tools', 'Custom AI Solutions', 'No AI Investment'],
          datasets: [{ label: '% of Enterprises', values: [45, 25, 18, 12] }]
        }
      },
      {
        type: 'quote',
        title: 'Notion CEO on Competition',
        data: {
          text: 'We don\'t fear Copilot. We fear becoming a feature. That\'s why we\'re betting everything on our unique document model—something Microsoft can\'t easily copy because it would break backward compatibility with decades of Word documents.',
          attribution: 'Ivan Zhao',
          role: 'CEO, Notion (TechCrunch Interview)'
        }
      }
    ],
    questions: [
      { text: 'What characteristics make a productivity feature defensible against Microsoft bundling? What makes it vulnerable?', difficulty: 'easy' },
      { text: 'Apply Clayton Christensen\'s disruption theory to Microsoft Copilot. Is this sustaining innovation or disruption? Who is being disrupted?', difficulty: 'medium' },
      { text: 'You are the CEO of a $500M AI writing startup. Microsoft just announced Copilot will include your core features. Develop a 12-month strategic response.', difficulty: 'hard' },
      { text: 'Analyze the pricing strategies available to AI feature specialists. What are the tradeoffs between freemium, premium add-ons, and all-inclusive pricing?', difficulty: 'medium' },
      { text: 'Will the "AI productivity" market eventually consolidate around Microsoft and Google, or can specialists survive? Defend your position with market evidence.', difficulty: 'hard' }
    ],
    concepts: ['Competitive Advantage', 'Blue Ocean Strategy', 'Marketing Mix (4Ps)']
  },
  {
    slug: 'nike-dtc-retreat',
    title: 'Nike\'s DTC Retreat: When Strategy Becomes Dogma',
    company: 'Nike',
    industry: 'Consumer Goods',
    summary: 'After years of cutting wholesale partners to go Direct-to-Consumer, Nike reversed course in 2024. This case examines how strategic conviction became strategic blindness, and what happens when competitors fill the void you created.',
    sections: [
      {
        title: 'The DTC Bet',
        content: `In 2017, Nike CEO Mark Parker announced the "Consumer Direct Offense"—a strategic pivot to bypass retailers and sell directly to consumers through Nike.com, the Nike app, and Nike-owned stores. The logic was compelling: DTC meant higher margins (40%+ vs. 20% wholesale), direct customer relationships, and control over brand presentation.

By 2021, under new CEO John Donahoe (a former eBay CEO with deep e-commerce expertise), Nike accelerated the strategy. The company cut ties with dozens of wholesale partners including DSW, Urban Outfitters, and many regional sporting goods chains. Even long-time partners like Foot Locker saw their allocations reduced.

The numbers initially validated the strategy. Nike Direct revenue grew from $10 billion in 2017 to $18 billion in 2022. Digital penetration doubled. Nike had built a formidable data advantage, understanding customer preferences far better than any retailer could.`
      },
      {
        title: 'The Hidden Costs',
        content: `But the DTC strategy had hidden costs that accumulated over time. First, Nike dramatically underestimated the value of wholesale ubiquity. When casual shoppers visited Foot Locker or Dick's Sporting Goods, they encountered Nike alongside competitors. Removing Nike from these shelves didn't send those customers to Nike.com—it sent them to whatever brands remained.

Second, Nike overestimated consumer willingness to visit brand-specific destinations. While Nike enthusiasts would download the app and browse Nike.com, casual buyers—the majority of the market—preferred the convenience of multi-brand retailers. DTC captured the most loyal customers but surrendered the persuadable middle.

Third, competitors filled the void. On Running, Hoka, and New Balance expanded their wholesale presence precisely as Nike retreated. Foot Locker, facing reduced Nike allocations, promoted these alternatives aggressively. By 2024, Hoka had grown from obscurity to a serious competitor, with running specialty stores featuring Hoka where Nike once dominated.

The market share data was sobering. Nike's U.S. footwear share dropped from 35% in 2019 to 30% in 2024. For a brand that prided itself on dominance, losing five points of share was catastrophic.`
      },
      {
        title: 'The Reversal',
        content: `In early 2024, Nike quietly began rebuilding wholesale relationships. The company approached partners it had abandoned, requesting shelf space allocations. Foot Locker announced renewed Nike investment. DSW and Macy's returned to receiving Nike products.

The reversal was strategically humiliating. Nike was now negotiating from weakness with partners it had spurned. Retailers, burned by Nike's previous abandonment, demanded better terms. Nike had to invest in marketing support and exclusives that it previously would have redirected to DTC.

John Donahoe acknowledged the miscalculation on earnings calls, admitting that Nike had "over-rotated" toward DTC. The company announced investment in wholesale relationships alongside continued DTC growth—essentially abandoning the either/or framing of the original strategy.

Critics noted that Nike had spent years and billions of dollars learning what retail experts had warned from the start: apparel and footwear customers browse. Eliminating the browse opportunity didn't capture demand—it destroyed it.`
      },
      {
        title: 'Lessons in Strategy',
        content: `The Nike case illustrates several enduring strategic lessons. First, the danger of strategy-as-identity: when DTC became Nike's ideology rather than a tool, the company lost the ability to objectively evaluate its costs and benefits. Executives who questioned DTC were seen as insufficiently committed rather than appropriately skeptical.

Second, the power of competitive response: Nike's strategists modeled the DTC transition in isolation. They didn't adequately account for how competitors would exploit wholesale relationships Nike was abandoning. Strategy is chess, not solitaire.

Third, the difference between customers and non-customers: Nike's data showed that existing customers responded well to DTC. What the data couldn't reveal was the potential customers who never became customers because they didn't encounter Nike at their local retailer.

Finally, the cost of reversals: switching costs are asymmetric. Cutting wholesale partnerships took months; rebuilding them is taking years. The optionality value of maintaining relationships—even suboptimal ones—was higher than Nike appreciated.

As Nike rebuilds, the competitive landscape has permanently shifted. On Running and Hoka aren't returning their market share gains. The DTC experiment didn't just cost Nike money—it created competitors.`
      }
    ],
    exhibits: [
      {
        type: 'table',
        title: 'Nike Channel Mix Evolution',
        data: {
          headers: ['Fiscal Year', 'Nike Direct %', 'Wholesale %', 'Nike Digital %'],
          rows: [
            ['FY2017', '28%', '72%', '15%'],
            ['FY2019', '33%', '67%', '22%'],
            ['FY2021', '39%', '61%', '35%'],
            ['FY2023', '44%', '56%', '26%'],
            ['FY2024', '42%', '58%', '25%']
          ]
        }
      },
      {
        type: 'chart',
        title: 'Running Shoe Market Share Shift',
        data: {
          labels: ['Nike', 'Adidas', 'New Balance', 'Hoka', 'On Running', 'Others'],
          datasets: [
            { label: '2019', values: [35, 15, 12, 2, 1, 35] },
            { label: '2024', values: [30, 13, 14, 8, 5, 30] }
          ]
        }
      },
      {
        type: 'quote',
        title: 'Industry Analyst Assessment',
        data: {
          text: 'Nike made a textbook strategic error: they assumed their brand was strong enough to pull customers to any channel. It wasn\'t. Brand strength creates preference; distribution creates sales. You need both.',
          attribution: 'Matt Powell',
          role: 'Senior Advisor, NPD Group'
        }
      }
    ],
    questions: [
      { text: 'What market research failures led Nike to overestimate DTC potential? Design a research methodology that could have surfaced the risks earlier.', difficulty: 'easy' },
      { text: 'Apply channel strategy frameworks to analyze Nike\'s optimal distribution mix. What factors determine the right balance between DTC and wholesale for a premium athletic brand?', difficulty: 'medium' },
      { text: 'Nike\'s competitors (Hoka, On Running) grew during Nike\'s wholesale retreat. Was this predictable? What game-theoretic analysis should Nike have conducted?', difficulty: 'medium' },
      { text: 'You are Nike\'s new Chief Commercial Officer. Develop a channel strategy that balances DTC margin benefits with wholesale reach. How do you avoid over-rotating again?', difficulty: 'hard' },
      { text: 'Nike\'s DTC strategy was championed by a CEO with e-commerce expertise (ex-eBay). How might organizational biases have influenced strategic decision-making? What governance mechanisms could mitigate such risks?', difficulty: 'hard' }
    ],
    concepts: ['Marketing Mix (4Ps)', 'Competitive Advantage', 'Customer Segmentation']
  },
  {
    slug: 'ftx-failure-of-controls',
    title: 'The Fall of FTX: Anatomy of a Failure',
    company: 'FTX',
    industry: 'Finance',
    summary: 'The collapse of FTX and conviction of Sam Bankman-Fried revealed a company with virtually no internal controls. This case examines how $8 billion vanished from a firm valued at $32 billion, and the governance failures that enabled it.',
    sections: [
      {
        title: 'Rise of FTX',
        content: `Sam Bankman-Fried founded FTX in 2019, and within three years built it into the second-largest cryptocurrency exchange globally. The MIT physics graduate cultivated an image as the "good" crypto entrepreneur—a effective altruist who slept on a beanbag in the office and planned to give away his billions.

By 2022, FTX was valued at $32 billion. Celebrity endorsements from Tom Brady, Steph Curry, and Larry David filled Super Bowl commercials. Politicians from both parties accepted donations. Bankman-Fried testified before Congress as a cooperative industry voice who supported regulation.

The company's legitimacy appeared cemented when traditional finance embraced it. Sequoia Capital, the venture firm that backed Google and Apple, invested $214 million after what they described as the most impressive founder meeting in their history. The Ontario Teachers' Pension Plan invested $95 million. FTX was the rare crypto company that serious institutions trusted.`
      },
      {
        title: 'The House of Cards',
        content: `On November 2, 2022, CoinDesk published a story that would unravel everything. The report revealed that Alameda Research—Bankman-Fried's trading firm, nominally separate from FTX—held $5.8 billion of its $14.6 billion assets in FTT, a token created by FTX. The two "independent" companies were deeply intertwined.

Rival exchange Binance announced it would liquidate its FTT holdings, triggering a bank run on FTX. Customers rushed to withdraw funds. Within 48 hours, FTX halted withdrawals, revealing that customer deposits had been used to fund Alameda's trading losses.

The scale of the fraud was staggering. FTX owed customers $8 billion that had simply vanished—lent to Alameda without disclosure, used to buy real estate and political influence, lost in failed trades. The company's "risk management" was essentially nonexistent.

Bankruptcy filings revealed a company with no board of directors (beyond the three founders), no accounting department, and no records of cash movement. Employees communicated via Signal messages that auto-deleted. A platform trusted with billions of customer dollars operated like a college dorm startup.`
      },
      {
        title: 'Governance Void',
        content: `The FTX collapse was not primarily about cryptocurrency—it was about elementary governance failures that would have been catastrophic in any industry. Consider what was missing:

No independent board: FTX's board consisted only of Sam Bankman-Fried, Nishad Singh, and one outside director. No audit committee, compensation committee, or any independent oversight existed.

No CFO or accounting: FTX had no chief financial officer for most of its existence. The company used QuickBooks—software designed for small businesses—to manage billions in transactions. No audited financial statements were produced.

No segregation of duties: The same individuals who received customer deposits could transfer them to Alameda. The same software engineer who built trading systems could modify financial records. Basic controls that any first-year auditor would require were absent.

No documentation: Critical decisions were made via disappearing messages. Alameda's "loans" from FTX had no written agreements. No one could reconstruct what had happened because no records existed.

Most damningly, these deficiencies were known to investors who chose to ignore them. Sequoia's due diligence flagged the lack of independent directors but invested anyway. The warning signs were visible to anyone who looked—but FTX's growth was too compelling, and crypto too poorly understood, for traditional scrutiny.`
      },
      {
        title: 'Aftermath and Lessons',
        content: `Sam Bankman-Fried was convicted of seven counts of fraud and conspiracy in November 2023, facing over 100 years in prison. Caroline Ellison, CEO of Alameda, and other executives pleaded guilty and cooperated with prosecutors.

The bankruptcy estate, led by restructuring expert John Ray III (who previously oversaw Enron's liquidation), worked to recover assets for creditors. Ray's initial filing was damning: "Never in my career have I seen such a complete failure of corporate controls."

The FTX collapse accelerated regulatory scrutiny of crypto but also revealed gaps in existing frameworks. FTX was incorporated in the Bahamas, beyond U.S. securities jurisdiction. The company exploited regulatory arbitrage, operating in a gray zone where its growth outpaced any regulator's ability to constrain it.

For business students, FTX offers a negative case study in governance. Every missing control—independent directors, audited financials, segregation of duties, document retention—exists because previous frauds demonstrated its necessity. FTX proved those requirements weren't arbitrary bureaucracy but essential safeguards. The "move fast and break things" ethos has limits, and those limits are called internal controls.`
      }
    ],
    exhibits: [
      {
        type: 'table',
        title: 'FTX Governance Gaps vs. Standards',
        data: {
          headers: ['Control', 'Industry Standard', 'FTX Practice', 'Consequence'],
          rows: [
            ['Independent Directors', 'Majority independent', 'None', 'No oversight of CEO'],
            ['Audited Financials', 'Annual audit by Big 4', 'None', 'No financial visibility'],
            ['Segregation of Duties', 'Separate functions', 'Combined', 'Enabled unauthorized transfers'],
            ['Document Retention', '7+ years', 'Auto-delete', 'Unable to reconstruct transactions'],
            ['Risk Management', 'Dedicated function', 'None', 'Unknown risk exposures']
          ]
        }
      },
      {
        type: 'chart',
        title: 'FTX Customer Fund Misappropriation',
        data: {
          labels: ['Alameda Loans', 'Real Estate', 'Venture Investments', 'Political Donations', 'Unaccounted'],
          datasets: [{ label: 'Amount ($B)', values: [4.1, 0.3, 2.1, 0.1, 1.4] }]
        }
      },
      {
        type: 'quote',
        title: 'Bankruptcy Examiner Assessment',
        data: {
          text: 'Never in my career have I seen such a complete failure of corporate controls and such a complete absence of trustworthy financial information as occurred here. From compromised systems integrity and faulty regulatory oversight abroad, to the concentration of control in the hands of a very small group of inexperienced, unsophisticated and potentially compromised individuals, this situation is unprecedented.',
          attribution: 'John J. Ray III',
          role: 'FTX Bankruptcy CEO (Court Filing)'
        }
      }
    ],
    questions: [
      { text: 'What specific internal controls, if present, would have prevented or detected the FTX fraud? Prioritize by impact.', difficulty: 'easy' },
      { text: 'Sequoia Capital invested $214 million despite noting governance red flags. Analyze the due diligence failure. What psychological and market factors contributed to sophisticated investors ignoring obvious risks?', difficulty: 'medium' },
      { text: 'Design a board structure and governance framework for a cryptocurrency exchange that balances startup agility with appropriate controls. What\'s the minimum viable governance for a company handling customer assets?', difficulty: 'hard' },
      { text: 'FTX exploited regulatory gaps by incorporating in the Bahamas. Should regulators have jurisdiction over foreign companies serving domestic customers? Analyze the policy tradeoffs.', difficulty: 'medium' },
      { text: 'Sam Bankman-Fried was a prominent "effective altruist" who claimed ethical motivations. How should stakeholders evaluate leader ethics claims? What verification mechanisms could help?', difficulty: 'hard' }
    ],
    concepts: ['Stakeholder Management', 'Organizational Culture', 'Capital Structure']
  }
]

async function seedCases() {
  console.log('🌱 Seeding case studies (batch 2)...')
  
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
        publishedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date in last 30 days
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

  console.log('🎉 Batch 2 complete!')
}

seedCases()
  .catch(console.error)
  .finally(() => prisma.$disconnect())


