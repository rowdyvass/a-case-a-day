/**
 * Add Exhibit Descriptions Script
 * 
 * This script adds short, descriptive subtitles to all existing exhibits.
 * It uses AI to generate context-appropriate descriptions based on the
 * exhibit type, title, data, and parent case content.
 */

import { PrismaClient } from '../src/generated/prisma'

const prisma = new PrismaClient()

interface ExhibitData {
  description?: string
  [key: string]: unknown
}

/**
 * Generate a description for an exhibit using AI
 */
async function generateDescription(
  exhibit: { type: string; title: string; data: ExhibitData },
  caseContext: { title: string; company: string; summary: string }
): Promise<string> {
  // Build a prompt for the AI
  const prompt = `Generate a single-sentence description (subtitle) for this exhibit. The description should:
- Explain what the exhibit shows in plain language
- Highlight the key insight or takeaway
- Be specific to the data, not generic
- Be 10-20 words maximum

Case Context:
- Case Title: ${caseContext.title}
- Company: ${caseContext.company}
- Summary: ${caseContext.summary}

Exhibit:
- Type: ${exhibit.type}
- Title: ${exhibit.title}
- Data Preview: ${JSON.stringify(exhibit.data).slice(0, 500)}...

Respond with ONLY the description text, nothing else. No quotes, no prefixes.

Examples of good descriptions:
- "Revenue growth accelerated sharply after the strategic pivot, outpacing competitors by 3x."
- "Key stakeholders were divided on the merger, with the CFO expressing strong reservations."
- "Market share shifted dramatically in Q3 as new entrants disrupted the industry."

Examples of BAD descriptions (too generic):
- "Financial performance over time"
- "Key metrics for the company"
- "Overview of the market"`

  try {
    // Load dotenv to get API keys
    const { config } = await import('dotenv')
    config({ path: '.env' })
    
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY not found in environment')
    }
    
    // Use the OpenAI provider directly for this simple task
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 100,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`API error: ${response.status} - ${errorText}`)
    }

    const result = await response.json()
    return result.choices[0]?.message?.content?.trim() || ''
  } catch (error) {
    console.error('Error generating description:', error)
    return ''
  }
}

/**
 * Generate a description locally without AI (fallback)
 * Uses exhibit title and data to create context-aware descriptions
 */
function generateFallbackDescription(exhibit: { type: string; title: string; data: ExhibitData }): string {
  const title = exhibit.title
  const data = exhibit.data
  
  // Extract key info from title for better descriptions
  const hasYear = /\d{4}/.test(title)
  const hasDollar = /\$/.test(title) || /billion|million|revenue|cost|price/i.test(title)
  const hasVs = /vs\.?|versus/i.test(title)
  const hasComparison = /comparison|compare|vs|versus/i.test(title)
  
  const typeDescriptions: Record<string, (data: ExhibitData, title: string) => string> = {
    'enhanced_table': (data, title) => {
      const headers = (data.headers as string[]) || []
      const rows = (data.rows as unknown[]) || []
      if (headers.length > 2 && hasYear) {
        return `Year-over-year performance showing trends across ${headers.slice(1, 4).join(', ')}.`
      }
      if (hasDollar) {
        return `Financial metrics and their evolution over the analysis period.`
      }
      if (rows.length > 5) {
        return `Comprehensive data breakdown with ${rows.length} key metrics for analysis.`
      }
      return `Key metrics and data points central to the strategic decision.`
    },
    'table': (data, title) => {
      const headers = (data.headers as string[]) || []
      const rows = (data.rows as unknown[]) || []
      if (hasComparison) {
        return `Side-by-side comparison highlighting key differences and gaps.`
      }
      return `${rows.length > 0 ? rows.length + ' data points' : 'Key data'} supporting the case analysis.`
    },
    'timeline': (data) => {
      const events = (data.events as { title?: string }[]) || []
      if (events.length > 0) {
        return `${events.length} pivotal moments from ${events[0]?.title || 'the beginning'} through the present.`
      }
      return `Chronological view of the key events that shaped the outcome.`
    },
    'waterfall': (data, title) => {
      const steps = (data.steps as { name?: string }[]) || []
      if (hasDollar) {
        return `Step-by-step breakdown showing how each factor contributed to the financial outcome.`
      }
      return `Decomposition showing how individual factors combined to drive the total change.`
    },
    'stacked_bar': (data, title) => {
      const labels = (data.labels as string[]) || []
      const datasets = (data.datasets as { label?: string }[]) || []
      if (datasets.length > 1) {
        return `Segment breakdown across ${labels.length} categories, showing composition of ${datasets[0]?.label || 'key metrics'}.`
      }
      return `Part-to-whole analysis revealing the composition at each stage.`
    },
    'area_chart': (data, title) => {
      const datasets = (data.datasets as { label?: string }[]) || []
      if (datasets.length > 1) {
        return `Cumulative trends over time, showing how ${datasets.map(d => d.label).slice(0, 2).join(' and ')} evolved.`
      }
      return `Volume and magnitude trends visualized over the analysis period.`
    },
    'donut': (data, title) => {
      const values = (data.values as { label?: string }[]) || []
      if (values.length > 0) {
        return `Market composition showing relative share of ${values.slice(0, 3).map(v => v.label).join(', ')}.`
      }
      return `Proportional breakdown revealing the relative importance of each segment.`
    },
    'radar': (data, title) => {
      const series = (data.series as { name?: string }[]) || []
      if (series.length > 1) {
        return `Multi-dimensional comparison of ${series.map(s => s.name).slice(0, 2).join(' vs ')} across key attributes.`
      }
      return `Capability assessment across multiple strategic dimensions.`
    },
    'positioning': (data, title) => {
      const points = (data.points as { name?: string }[]) || []
      return `Strategic landscape showing where ${points.length} players compete on key dimensions.`
    },
    'quote': (data) => {
      const attribution = data.attribution as string || ''
      const role = data.role as string || ''
      if (role) {
        return `${attribution}'s perspective as ${role} on the critical decision.`
      }
      return `Key stakeholder perspective that influenced the strategic direction.`
    },
    'quote_comparison': (data) => {
      const quotes = (data.quotes as { attribution?: string }[]) || []
      if (quotes.length >= 2) {
        return `Contrasting viewpoints: ${quotes[0]?.attribution || 'supporters'} vs ${quotes[1]?.attribution || 'critics'}.`
      }
      return `Multiple stakeholder perspectives revealing internal tensions and alignment.`
    },
    'stat_highlight': (data) => {
      const stats = (data.stats as { label?: string }[]) || []
      if (stats.length > 0) {
        return `${stats.length} headline metrics that define the scale and stakes of the situation.`
      }
      return `Key numbers that capture the magnitude of the challenge.`
    },
    'metric_grid': (data) => {
      const metrics = (data.metrics as unknown[]) || []
      return `${metrics.length} KPIs providing a snapshot of current performance and trends.`
    },
    'comparison_grid': (data) => {
      const entities = (data.entities as { name?: string }[]) || []
      if (entities.length > 0) {
        return `Head-to-head comparison of ${entities.map(e => e.name).slice(0, 3).join(', ')} on strategic criteria.`
      }
      return `Structured comparison to evaluate strategic options and trade-offs.`
    },
    'funnel': (data) => {
      const stages = (data.stages as unknown[]) || []
      return `Conversion analysis showing drop-off across ${stages.length} stages of the process.`
    },
    'sankey': (data) => {
      const nodes = (data.nodes as unknown[]) || []
      return `Flow visualization showing how value moves between ${nodes.length} entities.`
    },
    'process_flow': (data) => {
      const steps = (data.steps as unknown[]) || []
      return `${steps.length}-step process breakdown with key activities and dependencies.`
    },
    'callout': (data) => {
      const type = data.type as string
      if (type === 'warning') return 'Critical risk factor requiring careful consideration.'
      if (type === 'insight') return 'Key insight that reframes the strategic question.'
      return 'Important context that shapes the decision framework.'
    },
    'pro_con': () => 'Trade-off analysis weighing benefits against risks and costs.',
    'bubble': (data) => {
      const points = (data.points as unknown[]) || []
      return `${points.length} entities compared across three dimensions simultaneously.`
    },
    'heatmap': (data) => {
      const rows = (data.rows as unknown[]) || []
      const columns = (data.columns as unknown[]) || []
      return `Intensity matrix showing patterns across ${rows.length} rows and ${columns.length} columns.`
    },
    'combo': () => 'Dual-axis view revealing correlation between two related metrics.',
    'slope': (data) => {
      const points = (data.points as unknown[]) || []
      return `Before-and-after ranking change for ${points.length} entities over the period.`
    },
    'lollipop': (data) => {
      const items = (data.items as unknown[]) || []
      return `Ranked comparison of ${items.length} items with clear performance gaps.`
    },
    'dumbbell': (data) => {
      const items = (data.items as unknown[]) || []
      return `Range visualization showing the spread between start and end points for ${items.length} items.`
    },
    'gauge': () => 'Single KPI progress indicator showing current status vs target.',
    'bullet': (data) => {
      const metrics = (data.metrics as unknown[]) || []
      return `${metrics.length} KPIs with targets and performance ranges at a glance.`
    },
    'histogram': () => 'Distribution analysis revealing concentration and outliers in the data.',
    'candlestick': () => 'Price movement and volatility patterns during the analysis period.',
    'treemap': (data) => {
      const dataItems = (data.data as { name?: string }[]) || []
      if (dataItems.length > 0) {
        return `Proportional view of ${dataItems.map(d => d.name).slice(0, 3).join(', ')} and their relative scale.`
      }
      return 'Hierarchical breakdown showing relative size and composition.'
    },
    'data_table': (data) => {
      const rows = (data.rows as unknown[]) || []
      return `${rows.length} records available for detailed filtering and analysis.`
    },
    'drilldown': () => 'Interactive hierarchy for exploring detailed breakdowns.',
    'custom_template': (data) => {
      const templateType = data.templateType as string
      if (templateType === 'decision_simulator') return 'Step into the decision-maker\'s shoes and navigate the critical choices.'
      if (templateType === 'comparative_ranker') return 'Rank the strategic options and compare against expert analysis.'
      if (templateType === 'reveal_cards') return 'Uncover hidden stakeholder perspectives and motivations.'
      if (templateType === 'scenario_builder') return 'Construct your own strategic approach within real constraints.'
      if (templateType === 'what_if_calculator') return 'Model scenarios and see how assumptions change outcomes.'
      return 'Interactive exercise to test your strategic thinking.'
    },
    'custom_interactive': () => 'Hands-on learning component for deeper engagement with the case.'
  }

  const generator = typeDescriptions[exhibit.type]
  if (generator) {
    return generator(data, title)
  }

  // Fallback based on title analysis
  if (hasComparison) return `Comparative analysis supporting the strategic evaluation.`
  if (hasDollar) return `Financial data underpinning the business case.`
  if (hasYear) return `Historical perspective on the evolution of key factors.`
  
  return `Supporting analysis for the case discussion.`
}

async function addDescriptions() {
  console.log('📝 Adding descriptions to all exhibits...\n')

  // Get all cases with exhibits
  const cases = await prisma.case.findMany({
    include: {
      exhibits: {
        orderBy: { order: 'asc' }
      }
    }
  })

  console.log(`Found ${cases.length} cases to process\n`)

  let totalUpdated = 0
  let totalSkipped = 0

  for (const caseRecord of cases) {
    console.log(`\n📚 ${caseRecord.title}`)
    console.log('─'.repeat(50))

    for (const exhibit of caseRecord.exhibits) {
      const data = JSON.parse(exhibit.data) as ExhibitData

      const forceRegenerate = process.argv.includes('--force')
      
      // Skip if already has a description (unless forcing)
      if (data.description && !forceRegenerate) {
        console.log(`  ⏭️  ${exhibit.title} - already has description`)
        totalSkipped++
        continue
      }

      // Generate description (use fallback for speed, or AI for quality)
      const useAI = process.argv.includes('--ai')
      let description: string

      if (useAI) {
        description = await generateDescription(
          { type: exhibit.type, title: exhibit.title, data },
          { 
            title: caseRecord.title, 
            company: caseRecord.company, 
            summary: caseRecord.summary 
          }
        )
        // Add a small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 500))
      } else {
        description = generateFallbackDescription({ type: exhibit.type, title: exhibit.title, data })
      }

      if (!description) {
        console.log(`  ⚠️  ${exhibit.title} - failed to generate description`)
        continue
      }

      // Update the exhibit data with the description
      data.description = description
      
      await prisma.exhibit.update({
        where: { id: exhibit.id },
        data: { data: JSON.stringify(data) }
      })

      console.log(`  ✅ ${exhibit.title}`)
      console.log(`     "${description}"`)
      totalUpdated++
    }
  }

  console.log('\n' + '═'.repeat(50))
  console.log(`🎉 Complete! Updated ${totalUpdated} exhibits, skipped ${totalSkipped}`)
  console.log('\nRun with --ai flag to use AI-generated descriptions (slower but higher quality)')
}

// Run the script
addDescriptions()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

