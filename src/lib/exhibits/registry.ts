/**
 * Exhibit Type Registry
 * 
 * This registry defines all available exhibit types, their data schemas,
 * and guidance for when to use each type. The AI uses this to select
 * the most appropriate visualization for each case study.
 */

export interface ExhibitTypeDefinition {
  id: string
  name: string
  category: 'chart' | 'table' | 'text' | 'interactive' | 'comparison' | 'flow'
  description: string
  bestFor: string[]
  notFor: string[]
  interactivity: 'none' | 'hover' | 'click' | 'full'
  complexity: 'simple' | 'medium' | 'complex'
  dataRequirements: string
  exampleUseCase: string
}

export const EXHIBIT_TYPES: ExhibitTypeDefinition[] = [
  // ============== BASIC CHARTS ==============
  {
    id: 'chart',
    name: 'Auto Chart (Bar/Line/Pie)',
    category: 'chart',
    description: 'Automatically selects bar, line, or pie based on data',
    bestFor: ['Simple trends', 'Basic comparisons', 'Quick visualizations'],
    notFor: ['Complex multi-dimensional data', 'Precise control over chart type'],
    interactivity: 'hover',
    complexity: 'simple',
    dataRequirements: 'labels[] and datasets[{label, values[]}]',
    exampleUseCase: 'Quarterly revenue trend over 4 quarters'
  },
  {
    id: 'area_chart',
    name: 'Area Chart',
    category: 'chart',
    description: 'Filled area under line, good for showing volume/magnitude over time',
    bestFor: ['Cumulative values', 'Volume trends', 'Market size over time', 'Stacked composition'],
    notFor: ['Precise value comparison', 'Categorical data'],
    interactivity: 'hover',
    complexity: 'simple',
    dataRequirements: 'labels[], datasets[{label, values[], color?}], stacked?, unit?',
    exampleUseCase: 'Total addressable market growth from 2020-2025'
  },
  {
    id: 'stacked_bar',
    name: 'Stacked Bar Chart',
    category: 'chart',
    description: 'Bars stacked to show composition and total',
    bestFor: ['Part-to-whole over categories', 'Revenue by segment', 'Market share breakdown'],
    notFor: ['Too many segments (>6)', 'Comparing individual segment values'],
    interactivity: 'hover',
    complexity: 'medium',
    dataRequirements: 'labels[], datasets[{label, values[], color?}], horizontal?, showPercentages?',
    exampleUseCase: 'Revenue breakdown by product line across regions'
  },
  {
    id: 'waterfall',
    name: 'Waterfall Chart',
    category: 'chart',
    description: 'Bridge analysis showing step-by-step value changes',
    bestFor: ['Profit/loss bridges', 'Variance analysis', 'Value chain breakdown', 'Change decomposition'],
    notFor: ['Time series', 'Unrelated categories'],
    interactivity: 'hover',
    complexity: 'medium',
    dataRequirements: 'steps[{name, value, isTotal?}], unit?',
    exampleUseCase: 'Walking from revenue to net income with each cost category'
  },
  {
    id: 'funnel',
    name: 'Funnel Chart',
    category: 'chart',
    description: 'Declining stages showing conversion or dropoff',
    bestFor: ['Sales funnels', 'User conversion', 'Process attrition', 'Customer journey'],
    notFor: ['Non-sequential data', 'Increasing values'],
    interactivity: 'hover',
    complexity: 'simple',
    dataRequirements: 'stages[{name, value, color?}], showConversion?, unit?',
    exampleUseCase: 'E-commerce conversion from visits to purchase'
  },
  {
    id: 'treemap',
    name: 'Treemap',
    category: 'chart',
    description: 'Hierarchical data as nested rectangles by size',
    bestFor: ['Portfolio composition', 'Budget allocation', 'Market share', 'Hierarchical breakdown'],
    notFor: ['Time series', 'Small differences', 'Too many categories (>12)'],
    interactivity: 'hover',
    complexity: 'medium',
    dataRequirements: 'data[{name, value, children?[], color?}], unit?, showValues?',
    exampleUseCase: 'Investment portfolio allocation by sector and individual holdings'
  },
  {
    id: 'heatmap',
    name: 'Heatmap',
    category: 'chart',
    description: 'Matrix with color-coded values',
    bestFor: ['Correlation matrices', 'Competitive analysis grids', 'Time-category analysis', 'Risk matrices'],
    notFor: ['Precise values needed', 'Small datasets'],
    interactivity: 'hover',
    complexity: 'medium',
    dataRequirements: 'rows[], columns[], values[][], colorScale?, showValues?',
    exampleUseCase: 'Skill assessment matrix across team members'
  },
  {
    id: 'radar',
    name: 'Radar/Spider Chart',
    category: 'chart',
    description: 'Multi-dimensional comparison on radial axes',
    bestFor: ['Multi-attribute comparison', 'Competitive analysis', 'Capability assessment', 'Performance profiles'],
    notFor: ['More than 8 dimensions', 'Precise comparisons', 'Unrelated metrics'],
    interactivity: 'hover',
    complexity: 'medium',
    dataRequirements: 'dimensions[], entities[{name, values[], color?}], maxValue?',
    exampleUseCase: 'Comparing Nvidia vs AMD across performance, price, ecosystem, availability'
  },
  {
    id: 'positioning',
    name: 'Positioning Map (2x2)',
    category: 'chart',
    description: 'Scatter plot with quadrant labels for strategic positioning',
    bestFor: ['Competitive positioning', 'Strategic options', 'Market mapping', 'Risk/return analysis'],
    notFor: ['Precise data analysis', 'More than 2 dimensions'],
    interactivity: 'hover',
    complexity: 'medium',
    dataRequirements: 'xAxis{label, min?, max?}, yAxis{...}, quadrants?{topLeft, topRight, bottomLeft, bottomRight}, points[{name, x, y, highlight?}]',
    exampleUseCase: 'Competitive landscape on price vs quality dimensions'
  },
  {
    id: 'bubble',
    name: 'Bubble Chart',
    category: 'chart',
    description: 'Scatter plot with size as third dimension',
    bestFor: ['Three-variable comparison', 'Market opportunity analysis', 'Portfolio visualization'],
    notFor: ['Precise comparisons', 'Too many points (>15)'],
    interactivity: 'hover',
    complexity: 'medium',
    dataRequirements: 'points[{name, x, y, z, category?, color?}], xAxis{label, unit?}, yAxis{...}, zAxis{...}',
    exampleUseCase: 'Market attractiveness (x) vs competitive position (y) with market size (z)'
  },
  {
    id: 'combo',
    name: 'Combo Chart (Bar + Line)',
    category: 'chart',
    description: 'Mixed bar and line chart with optional dual axis',
    bestFor: ['Volume + rate trends', 'Actuals vs targets', 'Primary and secondary metrics'],
    notFor: ['Unrelated metrics', 'Misleading dual-axis scales'],
    interactivity: 'hover',
    complexity: 'medium',
    dataRequirements: 'labels[], series[{label, values[], type: bar|line|area, yAxisId?}], leftAxisLabel?, rightAxisLabel?',
    exampleUseCase: 'Revenue (bars) with growth rate (line) over quarters'
  },
  {
    id: 'slope',
    name: 'Slope Chart',
    category: 'chart',
    description: 'Two-point comparison showing change between periods',
    bestFor: ['Before/after comparison', 'Ranking changes', 'Period-to-period shifts'],
    notFor: ['More than 2 time points', 'Too many entities (>8)'],
    interactivity: 'hover',
    complexity: 'simple',
    dataRequirements: 'startLabel, endLabel, points[{name, startValue, endValue, color?}], unit?',
    exampleUseCase: 'Market share rankings from 2020 to 2024'
  },
  {
    id: 'lollipop',
    name: 'Lollipop Chart',
    category: 'chart',
    description: 'Cleaner alternative to bar chart with dots',
    bestFor: ['Ranking comparisons', 'KPI dashboards', 'Benchmark comparisons'],
    notFor: ['Stacked data', 'Time series'],
    interactivity: 'hover',
    complexity: 'simple',
    dataRequirements: 'items[{label, value, benchmark?, color?}], horizontal?, showBenchmark?, unit?',
    exampleUseCase: 'Department performance against targets'
  },
  {
    id: 'donut',
    name: 'Donut Chart',
    category: 'chart',
    description: 'Pie chart with center hole for total/label',
    bestFor: ['Part-to-whole', 'Simple composition', 'Key metric with breakdown'],
    notFor: ['Many segments (>6)', 'Comparing across categories'],
    interactivity: 'hover',
    complexity: 'simple',
    dataRequirements: 'segments[{name, value, color?}], centerLabel?, centerValue?, unit?',
    exampleUseCase: 'Revenue by region with total in center'
  },
  {
    id: 'histogram',
    name: 'Histogram',
    category: 'chart',
    description: 'Distribution of values across bins',
    bestFor: ['Statistical distribution', 'Frequency analysis', 'Outlier identification'],
    notFor: ['Categorical data', 'Time series'],
    interactivity: 'hover',
    complexity: 'medium',
    dataRequirements: 'bins[{range, count}], mean?, median?, xAxisLabel?, yAxisLabel?',
    exampleUseCase: 'Distribution of customer transaction sizes'
  },
  {
    id: 'candlestick',
    name: 'Candlestick Chart',
    category: 'chart',
    description: 'Financial OHLC data visualization',
    bestFor: ['Stock price analysis', 'Financial markets', 'Trading patterns'],
    notFor: ['Non-financial data', 'Simple trends'],
    interactivity: 'hover',
    complexity: 'complex',
    dataRequirements: 'data[{date, open, high, low, close, volume?}], showVolume?, unit?',
    exampleUseCase: 'Stock price movement over past quarter'
  },
  {
    id: 'dumbbell',
    name: 'Dumbbell Chart',
    category: 'chart',
    description: 'Before/after or range comparison',
    bestFor: ['Period comparison', 'Range visualization', 'Gap analysis'],
    notFor: ['Single point values', 'Many categories (>10)'],
    interactivity: 'hover',
    complexity: 'simple',
    dataRequirements: 'items[{label, startValue, endValue, color?}], startLegend, endLegend, unit?, showChange?',
    exampleUseCase: 'Salary ranges by department showing min to max'
  },
  {
    id: 'gauge',
    name: 'Gauge Chart',
    category: 'chart',
    description: 'Single KPI with target and thresholds',
    bestFor: ['Single key metric', 'Target tracking', 'Health indicators'],
    notFor: ['Multiple metrics', 'Trends over time'],
    interactivity: 'none',
    complexity: 'simple',
    dataRequirements: 'value, min?, max?, target?, label, thresholds?{warning, danger}, unit?',
    exampleUseCase: 'Current quarter revenue vs annual target'
  },
  {
    id: 'bullet',
    name: 'Bullet Chart',
    category: 'chart',
    description: 'Multiple KPIs with performance ranges',
    bestFor: ['Dashboard KPIs', 'Performance vs target', 'Compact multi-metric display'],
    notFor: ['Trend analysis', 'Detailed breakdown'],
    interactivity: 'hover',
    complexity: 'simple',
    dataRequirements: 'metrics[{label, value, target?, ranges?{poor, satisfactory, good}, unit?}]',
    exampleUseCase: 'Sales, revenue, and profit against quarterly targets'
  },

  // ============== TABLES ==============
  {
    id: 'table',
    name: 'Basic Table',
    category: 'table',
    description: 'Simple data table',
    bestFor: ['Raw data display', 'Simple comparisons', 'Reference data'],
    notFor: ['Large datasets', 'Complex analysis'],
    interactivity: 'none',
    complexity: 'simple',
    dataRequirements: 'headers[], rows[][]',
    exampleUseCase: 'Key financial metrics for past 3 years'
  },
  {
    id: 'enhanced_table',
    name: 'Enhanced Table',
    category: 'table',
    description: 'Table with formatting, trends, and conditional colors',
    bestFor: ['Financial statements', 'Competitive comparison', 'Performance dashboards'],
    notFor: ['Simple data', 'Charts better suited'],
    interactivity: 'hover',
    complexity: 'medium',
    dataRequirements: 'headers[], rows[][(string|{value, trend?, color?, sparkline?[], bold?, subtext?})], highlightHeader?, striped?',
    exampleUseCase: 'Income statement with YoY changes and trend arrows'
  },
  {
    id: 'data_table',
    name: 'Interactive Data Table',
    category: 'table',
    description: 'Sortable, filterable, paginated table',
    bestFor: ['Large datasets', 'Exploratory analysis', 'Reference lookup'],
    notFor: ['Simple data', 'Print output'],
    interactivity: 'full',
    complexity: 'complex',
    dataRequirements: 'columns[{key, label, sortable?, filterable?, format?, align?}], rows[{}], pageSize?, searchable?, exportable?',
    exampleUseCase: 'Full list of acquisitions with filtering by year and size'
  },
  {
    id: 'comparison_grid',
    name: 'Comparison Grid',
    category: 'table',
    description: 'Multi-entity comparison with scores and winners',
    bestFor: ['Competitive analysis', 'Vendor comparison', 'Product feature matrix'],
    notFor: ['Simple data', 'Time series'],
    interactivity: 'hover',
    complexity: 'medium',
    dataRequirements: 'entities[{name, logo?, highlight?, metrics{}}], metricLabels{}, showScores?, highlightWinners?',
    exampleUseCase: 'Feature comparison of Microsoft vs Google vs Amazon cloud offerings'
  },

  // ============== FLOW & PROCESS ==============
  {
    id: 'timeline',
    name: 'Timeline',
    category: 'flow',
    description: 'Chronological events with status indicators',
    bestFor: ['Event sequences', 'Project milestones', 'Historical analysis', 'Crisis timelines'],
    notFor: ['Non-sequential events', 'Quantitative data'],
    interactivity: 'hover',
    complexity: 'simple',
    dataRequirements: 'events[{date, title, description?, type?: positive|negative|neutral}], title?',
    exampleUseCase: 'FTX collapse hour-by-hour timeline'
  },
  {
    id: 'sankey',
    name: 'Sankey Diagram',
    category: 'flow',
    description: 'Flow diagram showing value movement between nodes',
    bestFor: ['Money flows', 'Energy/resource flows', 'User journeys', 'Value chain'],
    notFor: ['Simple comparisons', 'Too many nodes (>10)'],
    interactivity: 'hover',
    complexity: 'complex',
    dataRequirements: 'nodes[{name, color?}], links[{source, target, value, color?}], unit?',
    exampleUseCase: 'FTX customer fund misappropriation showing where $8B went'
  },
  {
    id: 'process_flow',
    name: 'Process Flow',
    category: 'flow',
    description: 'Step-by-step process with status and details',
    bestFor: ['Business processes', 'Decision workflows', 'Implementation steps'],
    notFor: ['Quantitative comparison', 'Non-sequential processes'],
    interactivity: 'click',
    complexity: 'medium',
    dataRequirements: 'steps[{id, title, description?, status?: completed|current|upcoming|failed, duration?, details?[]}], layout?: horizontal|vertical',
    exampleUseCase: 'M&A integration process from signing to completion'
  },
  {
    id: 'drilldown',
    name: 'Drilldown Chart',
    category: 'flow',
    description: 'Hierarchical bar chart with click-to-explore',
    bestFor: ['Budget breakdown', 'Organizational data', 'Multi-level analysis'],
    notFor: ['Flat data', 'Print output'],
    interactivity: 'full',
    complexity: 'complex',
    dataRequirements: 'root{name, value, children?[{name, value, children?[]}]}, unit?',
    exampleUseCase: 'Operating expenses drill from category to line item'
  },

  // ============== TEXT & NARRATIVE ==============
  {
    id: 'quote',
    name: 'Quote',
    category: 'text',
    description: 'Single attributed quote',
    bestFor: ['Key statements', 'Executive quotes', 'Defining moments'],
    notFor: ['Long excerpts', 'Multiple perspectives'],
    interactivity: 'none',
    complexity: 'simple',
    dataRequirements: 'text, attribution, role?',
    exampleUseCase: 'CEO statement on strategic direction'
  },
  {
    id: 'quote_comparison',
    name: 'Quote Comparison',
    category: 'text',
    description: 'Multiple quotes with stance indicators',
    bestFor: ['Contrasting viewpoints', 'Debate summary', 'Before/after statements'],
    notFor: ['Single perspective', 'Factual data'],
    interactivity: 'none',
    complexity: 'simple',
    dataRequirements: 'quotes[{text, attribution, role?, date?, stance?: positive|negative|neutral}], title?, layout?: side-by-side|stacked',
    exampleUseCase: 'Board vs CEO perspectives on the firing decision'
  },
  {
    id: 'callout',
    name: 'Callout Box',
    category: 'text',
    description: 'Highlighted insight or warning',
    bestFor: ['Key insights', 'Warnings', 'Discussion prompts', 'Summary points'],
    notFor: ['Long content', 'Data-heavy information'],
    interactivity: 'none',
    complexity: 'simple',
    dataRequirements: 'content, title?, type?: insight|warning|success|info|question, icon?, source?, highlight?[]',
    exampleUseCase: 'Key strategic insight from the case analysis'
  },
  {
    id: 'stat_highlight',
    name: 'Stat Highlight',
    category: 'text',
    description: 'Big numbers with context',
    bestFor: ['Key metrics', 'Impact numbers', 'Summary statistics'],
    notFor: ['Detailed data', 'Trend analysis'],
    interactivity: 'none',
    complexity: 'simple',
    dataRequirements: 'stats[{value, label, subtext?, change?, icon?, color?}], layout?: row|grid, size?: sm|md|lg',
    exampleUseCase: 'Key numbers: $8B lost, 134 entities bankrupt, 7 fraud counts'
  },
  {
    id: 'source_excerpt',
    name: 'Source Excerpt',
    category: 'text',
    description: 'Document excerpt with highlighted passages',
    bestFor: ['Primary source quotes', 'Legal documents', 'Report extracts'],
    notFor: ['Paraphrased content', 'Short quotes'],
    interactivity: 'hover',
    complexity: 'simple',
    dataRequirements: 'title, source, date?, content, highlights?[{text, note?}], link?',
    exampleUseCase: 'Excerpt from SEC filing with key passages highlighted'
  },
  {
    id: 'pro_con',
    name: 'Pro/Con List',
    category: 'text',
    description: 'Two-column advantages vs disadvantages',
    bestFor: ['Decision analysis', 'Strategy options', 'Trade-off discussion'],
    notFor: ['Neutral information', 'Quantitative data'],
    interactivity: 'none',
    complexity: 'simple',
    dataRequirements: 'pros[{text, detail?}], cons[{...}], title?, prosLabel?, consLabel?',
    exampleUseCase: 'Pros and cons of the DTC strategy'
  },

  // ============== INTERACTIVE ==============
  {
    id: 'metric_card',
    name: 'Metric Card',
    category: 'interactive',
    description: 'Single KPI with trend sparkline',
    bestFor: ['Dashboard metrics', 'Key performance indicators', 'Executive summary'],
    notFor: ['Detailed analysis', 'Multiple related metrics'],
    interactivity: 'hover',
    complexity: 'simple',
    dataRequirements: 'label, value, change?, trend?[], unit?, format?, color?, size?',
    exampleUseCase: 'Monthly recurring revenue with 3-month trend'
  },
  {
    id: 'metric_grid',
    name: 'Metric Grid',
    category: 'interactive',
    description: 'Grid of metric cards',
    bestFor: ['Executive dashboards', 'Summary statistics', 'Quick overview'],
    notFor: ['Detailed analysis', 'Related metrics needing comparison'],
    interactivity: 'hover',
    complexity: 'simple',
    dataRequirements: 'metrics[{label, value, change?, trend?[], ...}], columns?: 2|3|4',
    exampleUseCase: 'Key financial metrics dashboard'
  },
  {
    id: 'scenario_calculator',
    name: 'Scenario Calculator',
    category: 'interactive',
    description: 'What-if analysis with sliders and computed outputs',
    bestFor: ['Sensitivity analysis', 'Financial modeling', 'Decision support'],
    notFor: ['Static data', 'Print output'],
    interactivity: 'full',
    complexity: 'complex',
    dataRequirements: 'variables[{id, label, defaultValue, min, max, step, unit?, format?}], outputs[{id, label, formula, format?}], scenarios?[{name, values{}}]',
    exampleUseCase: 'Revenue sensitivity to price and volume changes'
  },

  // ============== DIAGRAM ==============
  {
    id: 'diagram',
    name: 'Basic Diagram',
    category: 'flow',
    description: 'Simple element diagram with description',
    bestFor: ['Concept illustration', 'Simple structures', 'Component overview'],
    notFor: ['Complex flows', 'Quantitative data'],
    interactivity: 'none',
    complexity: 'simple',
    dataRequirements: 'type?, elements[], description?',
    exampleUseCase: 'Key stakeholders in the governance structure'
  },

  // ============== CUSTOM INTERACTIVE ==============
  {
    id: 'custom_interactive',
    name: 'Custom Interactive Exhibit',
    category: 'interactive',
    description: 'AI-generated custom interactive exhibit with sandboxed HTML/CSS/JS',
    bestFor: [
      'Case-specific interactive experiences',
      'Custom calculators and simulators',
      'Gamified learning exercises',
      'Unique data explorations',
      'Decision tree simulations'
    ],
    notFor: [
      'Standard data visualizations (use library charts)',
      'Simple static content',
      'Content requiring external data'
    ],
    interactivity: 'full',
    complexity: 'complex',
    dataRequirements: 'schemaVersion: 1, description, interactivityType: calculator|simulation|visualization|gamified|exploration, html, css, js, accessibilityDescription?',
    exampleUseCase: 'Interactive break-even calculator specific to the case company\'s cost structure'
  }
]

// Helper to get exhibit by ID
export function getExhibitType(id: string): ExhibitTypeDefinition | undefined {
  return EXHIBIT_TYPES.find(t => t.id === id)
}

// Helper to get exhibits by category
export function getExhibitsByCategory(category: ExhibitTypeDefinition['category']): ExhibitTypeDefinition[] {
  return EXHIBIT_TYPES.filter(t => t.category === category)
}

// Helper to get exhibits by interactivity level
export function getExhibitsByInteractivity(level: ExhibitTypeDefinition['interactivity']): ExhibitTypeDefinition[] {
  return EXHIBIT_TYPES.filter(t => t.interactivity === level)
}

// Generate AI prompt section for exhibit selection
export function generateExhibitSelectionGuide(): string {
  const byCategory = EXHIBIT_TYPES.reduce((acc, type) => {
    if (!acc[type.category]) acc[type.category] = []
    acc[type.category].push(type)
    return acc
  }, {} as Record<string, ExhibitTypeDefinition[]>)

  let guide = `## Available Exhibit Types\n\n`

  for (const [category, types] of Object.entries(byCategory)) {
    guide += `### ${category.toUpperCase()}\n\n`
    for (const type of types) {
      guide += `**${type.id}** - ${type.name}\n`
      guide += `- Best for: ${type.bestFor.join(', ')}\n`
      guide += `- Data: ${type.dataRequirements}\n`
      guide += `- Example: ${type.exampleUseCase}\n\n`
    }
  }

  return guide
}

