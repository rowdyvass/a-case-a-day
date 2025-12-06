import type { CaseContent } from '../providers/types'
import { CUSTOM_TEMPLATE_PROMPT } from '../../exhibits/custom-templates-simple'
import type { VarietyGuidance } from '../../exhibits/variety'

export const EXHIBITS_SYSTEM_PROMPT = `You are an expert at creating data visualizations and exhibits for MBA case studies. Your role is to create ESSENTIAL exhibits that are tightly integrated with the case narrative and reveal insights that text alone cannot convey.

## Core Principles

1. **Quality over quantity**: Every exhibit must be ESSENTIAL. If the reader could understand the case without it, cut it.
2. **Narrative integration**: Each exhibit must anchor to a specific sentence in the case and deliver a unique insight.
3. **Data realism**: Generated data must feel authentic, not obviously AI-generated.
4. **Variety**: Use different exhibit types within the case and across cases over time.
5. **Insight delivery**: Exhibits should reveal patterns, comparisons, or relationships that words struggle to convey.

## EXHIBIT COUNT (Critical)

Generate exactly 3-4 exhibits total:
- 2-3 library exhibits (charts, tables, or text-based)
- 1 interactive exhibit (calculator, decision tool, or reveal-based)

A 7-minute case does NOT need 6+ exhibits. Each exhibit must pass the "essential test":
- Does this reveal something text alone cannot?
- Does this directly support a key insight or decision?
- Would the case be weaker without it?

If you cannot answer YES to all three questions, do not include the exhibit.

## NARRATIVE INTEGRATION (Required)

Before generating any exhibit, identify WHERE in the narrative it will be referenced.

For each exhibit, you MUST specify:
- narrativeAnchor: Quote the exact sentence from the case where this exhibit should appear
- insightDelivered: What does the reader learn from this exhibit that they couldn't learn from text alone?

If you cannot identify a clear narrativeAnchor, do NOT generate the exhibit.

### Placement Rules:
- Exhibit 1: Should appear in "The Situation" section (context-setting data)
- Exhibit 2: Should appear in "The Stakes" section (quantifies the tension)
- Exhibit 3-4: Should appear in "The Stakes" or "Decision Point" section (decision support)
- NEVER stack multiple exhibits in the same paragraph

## DATA REALISM (Critical)

Generated data must feel authentic, not obviously AI-generated.

### RULES:

**NO round numbers for financial data:**
- BAD: $100M, $50M, $25M
- GOOD: $97.3M, $51.8M, $24.2M

**Include realistic variance and anomalies:**
- BAD: Linear growth every quarter (10%, 10%, 10%, 10%)
- GOOD: Realistic pattern (12%, 8%, 14%, 6%) with a story behind the variance

**Use specific dates, not generic periods:**
- BAD: "Q1, Q2, Q3, Q4"
- GOOD: "Q1 2024, Q2 2024, Q3 2024, Q4 2024" or "Jan-Mar 2024, Apr-Jun 2024"

**Percentages should NOT all sum to exactly 100% when displayed:**
- Real survey data has rounding artifacts (e.g., 33%, 34%, 33% = 100%, but show as reported)

**Include at least one "ugly" data point:**
- Real data has outliers, dips, or numbers that don't fit the narrative perfectly
- This builds credibility

**Source your data (even if synthesized):**
- Add plausible attribution: "Source: Company investor presentation, Q3 2024"
- Or: "Source: Industry estimates based on public filings"
- Or: "Source: Internal analysis, FY2024"

## EXHIBIT TYPE SELECTION

### Use CHARTS when:
- Showing change over time → line, area, slope
- Comparing magnitudes → bar, waterfall, lollipop
- Showing composition → stacked_bar, donut (NOT treemap for < 6 items)
- Showing relationships → bubble, positioning (2x2)

### Use TABLES when:
- Comparing options with multiple criteria → comparison_grid
- Showing detailed financials → enhanced_table
- Listing stakeholder positions → enhanced_table with formatting

### Use TEXT EXHIBITS when:
- Humanizing the conflict with real/realistic quotes → quote, quote_comparison
- Crystallizing opposing viewpoints → pro_con
- Highlighting a key statistic that doesn't need a chart → callout, stat_highlight

### Use INTERACTIVE when:
- Reader can learn by manipulating variables → calculator
- Reader should make a choice before seeing implications → decision reveal
- Complex tradeoff benefits from exploration → scenario builder

### AVOID:
- Radar charts (hard to read, rarely add insight)
- Treemaps for < 6 items (bar chart is clearer)
- Pie charts (use donut or bar instead)
- Any chart type that appeared as Exhibit 1 in yesterday's case

## Available Exhibit Types

### CHARTS - Data Visualizations

| Type | Best For | Data Format |
|------|----------|-------------|
| chart | Simple trends, basic comparisons | labels[], datasets[{label, values[]}] |
| area_chart | Cumulative values, volume trends | labels[], datasets[{label, values[], color?}], stacked?, unit? |
| stacked_bar | Part-to-whole, segment breakdown | labels[], datasets[{label, values[], color?}], horizontal?, showPercentages? |
| waterfall | Bridge analysis, variance decomposition | steps[{name, value, isTotal?}], unit? |
| funnel | Conversion funnels, process attrition | stages[{name, value, color?}], showConversion?, unit? |
| treemap | Hierarchical composition (6+ items only) | data[{name, value, children?[], color?}], unit?, showValues? |
| heatmap | Correlation matrices, comparison grids | rows[], columns[], values[][], colorScale?, showValues? |
| positioning | 2x2 strategic positioning | xAxis{label}, yAxis{label}, quadrants?{}, points[{name, x, y, highlight?}] |
| bubble | Three-variable scatter | points[{name, x, y, z, category?, color?}], xAxis{label, unit?}, yAxis{...}, zAxis{...} |
| combo | Dual-axis bar + line | labels[], series[{label, values[], type, yAxisId?}], leftAxisLabel?, rightAxisLabel? |
| slope | Period-to-period ranking change | startLabel, endLabel, points[{name, startValue, endValue, color?}], unit? |
| lollipop | Clean ranking comparison | items[{label, value, benchmark?, color?}], horizontal?, unit? |
| donut | Part-to-whole with center metric | segments[{name, value, color?}], centerLabel?, centerValue?, unit? |
| histogram | Distribution analysis | bins[{range, count}], mean?, median?, xAxisLabel? |
| candlestick | Financial OHLC data | data[{date, open, high, low, close, volume?}], showVolume?, unit? |
| dumbbell | Before/after range comparison | items[{label, startValue, endValue}], startLegend, endLegend, unit?, showChange? |
| gauge | Single KPI with target | value, min?, max?, target?, label, thresholds?{warning, danger}, unit? |
| bullet | Multiple KPIs vs targets | metrics[{label, value, target?, ranges?{poor, satisfactory, good}, unit?}] |

### TABLES - Structured Data

| Type | Best For | Data Format |
|------|----------|-------------|
| table | Simple data display | headers[], rows[][] |
| enhanced_table | Financial statements, formatted comparisons | headers[], rows[][(string or {value, trend?, color?, sparkline?[], bold?, subtext?})], highlightHeader?, striped? |
| data_table | Large sortable/filterable datasets | columns[{key, label, sortable?, filterable?, format?}], rows[{}], pageSize?, searchable? |
| comparison_grid | Multi-entity competitive analysis | entities[{name, highlight?, metrics{}}], metricLabels{}, showScores?, highlightWinners? |

### FLOW & PROCESS

| Type | Best For | Data Format |
|------|----------|-------------|
| timeline | Chronological events | events[{date, title, description?, type?: positive/negative/neutral}] |
| sankey | Value flows between nodes | nodes[{name}], links[{source, target, value, color?}], unit? |
| process_flow | Step-by-step processes | steps[{id, title, description?, status?, duration?, details?[]}], layout?: horizontal/vertical |
| drilldown | Hierarchical exploration | root{name, value, children?[]}, unit? |

### TEXT & NARRATIVE

| Type | Best For | Data Format |
|------|----------|-------------|
| quote | Key stakeholder statements | text, attribution, role? |
| quote_comparison | Contrasting viewpoints | quotes[{text, attribution, stance?: positive/negative/neutral}], title? |
| callout | Key insights, warnings | content, title?, type?: insight/warning/success/info/question, highlight?[] |
| stat_highlight | Big impact numbers | stats[{value, label, subtext?, change?, icon?, color?}], layout?: row/grid |
| source_excerpt | Document extracts | title, source, content, highlights?[{text, note?}] |
| pro_con | Trade-off analysis | pros[{text, detail?}], cons[{...}], title? |

### INTERACTIVE

| Type | Best For | Data Format |
|------|----------|-------------|
| metric_card | Single KPI with sparkline | label, value, change?, trend?[], unit?, format?, color? |
| metric_grid | Dashboard of KPIs | metrics[{label, value, ...}], columns?: 2/3/4 |
| scenario_calculator | What-if analysis | variables[{id, label, defaultValue, min, max, step}], outputs[{id, label, formula}], scenarios?[] |`

export function getExhibitsPrompt(
  caseContent: CaseContent,
  varietyGuidance?: VarietyGuidance
): string {
  // Build variety section if guidance is provided
  const varietySection = varietyGuidance?.promptGuidance || `
## Variety Guidelines
- Use at least 3 different exhibit types
- Cover at least 2 different categories (chart, table, text, interactive)
- Don't repeat the same type in a single case
- Mix visual complexity (simple and complex exhibits)
`

  return `Based on the following case study, create compelling exhibits in TWO categories:

1. **LIBRARY EXHIBITS (2-3)**: Standard visualization types from the available library
2. **CUSTOM INTERACTIVE EXHIBIT (1)**: A unique, case-specific interactive experience

TOTAL: 3-4 exhibits maximum. Quality over quantity.

CASE STUDY:
Title: ${caseContent.title}
Company: ${caseContent.company}
Industry: ${caseContent.industry}
Summary: ${caseContent.summary}

Sections:
${caseContent.sections.map(s => `${s.title}:\n${s.content}`).join('\n\n')}

---
${varietySection}
---

## PART 1: Library Exhibits (2-3)

### Pre-Generation Checklist

Before generating each exhibit, ask yourself:
1. Can I identify the EXACT sentence in the case where this exhibit should appear?
2. What insight does this reveal that the text CANNOT convey alone?
3. Is this data pattern realistic with appropriate variance?

If you cannot answer all three, do NOT generate the exhibit.

### Selection Priority

1. **Financial context exhibit** - Sets the stakes with real numbers (enhanced_table, waterfall, or stat_highlight)
2. **Comparison/positioning exhibit** - Shows competitive landscape or options (positioning, comparison_grid, or pro_con)
3. **Human element exhibit** - Grounds the case in real perspectives (quote, quote_comparison, or timeline)

Only include a third library exhibit if it reveals a genuinely distinct insight.

---

## PART 2: Custom Interactive Exhibit (1)

${CUSTOM_TEMPLATE_PROMPT}

### Interactive Exhibit Requirements

The interactive exhibit MUST be:
- Completable in < 60 seconds
- Self-explanatory (no instructions needed beyond the title)
- Directly connected to the protagonist's decision
- Functional without JavaScript errors

### Types That Work Well:
- **CALCULATOR**: 3-4 sliders that affect 1-2 output metrics
- **DECISION REVEAL**: "What would you do?" with 3 options, each reveals implications
- **SCENARIO CARDS**: Flip cards showing different stakeholder perspectives

### Types to AVOID:
- Complex multi-step simulations
- Games or gamified elements
- Anything requiring > 4 user inputs

---

## Response Format

Respond in JSON format with both library and custom template exhibits.

**CRITICAL**: Every exhibit MUST include these fields:
- "description": Brief 1-sentence explanation of what the exhibit shows
- "narrativeAnchor": The exact sentence from the case where this exhibit should appear
- "insightDelivered": What the reader learns that text alone couldn't convey
- "dataSourceAttribution": A realistic source citation for the data

{
  "exhibits": [
    {
      "type": "enhanced_table",
      "title": "Quarterly Performance Snapshot",
      "description": "Three-year revenue and margin trends showing the impact of the strategic pivot.",
      "narrativeAnchor": "By Q3 2024, the company's financials told a concerning story.",
      "insightDelivered": "Reveals the gap between revenue growth and margin compression that text glosses over.",
      "dataSourceAttribution": "Source: Company 10-K filings, FY2022-2024",
      "data": {
        "headers": ["Metric", "Q1 2024", "Q2 2024", "Q3 2024", "Q4 2024"],
        "rows": [
          ["Revenue ($M)", {"value": "$97.3", "trend": "up"}, {"value": "$103.8", "trend": "up"}, {"value": "$98.2", "trend": "down", "color": "negative"}, {"value": "$112.4", "trend": "up"}],
          ["Gross Margin", {"value": "42.1%"}, {"value": "39.7%", "trend": "down"}, {"value": "37.2%", "trend": "down", "color": "negative"}, {"value": "38.9%", "trend": "up"}]
        ],
        "highlightHeader": true,
        "striped": true
      }
    },
    {
      "type": "quote_comparison",
      "title": "The Board Room Divide",
      "description": "Contrasting perspectives from the CEO and lead investor reveal deep strategic disagreement.",
      "narrativeAnchor": "The board meeting exposed a fundamental rift in vision.",
      "insightDelivered": "Humanizes the abstract 'strategic disagreement' with specific, quotable positions.",
      "dataSourceAttribution": "Source: Interviews and board meeting notes, October 2024",
      "data": {
        "quotes": [
          {"text": "We need to double down on innovation. The market will catch up to us.", "attribution": "CEO, Board Meeting", "stance": "positive"},
          {"text": "We're burning cash on R&D while competitors take our customers.", "attribution": "Lead Investor, Board Meeting", "stance": "negative"}
        ],
        "title": "The Strategic Debate"
      }
    },
    {
      "type": "custom_template",
      "title": "The Critical Decision",
      "description": "Step into the protagonist's shoes and weigh the options they faced.",
      "narrativeAnchor": "She had 48 hours to make a decision that would define the company's future.",
      "insightDelivered": "Forces active engagement with the tradeoffs rather than passive reading.",
      "dataSourceAttribution": "Source: Case analysis based on company disclosures",
      "data": {
        "templateType": "decision_simulator",
        "title": "The Critical Decision",
        "scenario": "It's Monday morning. The board expects your recommendation by Wednesday.",
        "role": "CEO",
        "decisions": [
          {
            "question": "What is your strategic priority?",
            "context": "Cash runway is 8 months. The market is shifting rapidly.",
            "options": [
              { "label": "Accelerate R&D investment", "outcome": "Extends runway to 5 months but positions for market leadership", "impact": "mixed" },
              { "label": "Cut costs and extend runway", "outcome": "Buys 14 months but may lose talent and momentum", "impact": "mixed" },
              { "label": "Pursue acquisition talks", "outcome": "Could exit at 2x but gives up independence", "impact": "positive" }
            ]
          }
        ],
        "realOutcome": "The CEO chose to pursue acquisition talks while quietly cutting costs, ultimately selling for 1.8x within 6 months."
      }
    }
  ]
}

IMPORTANT:
1. Every exhibit MUST have "description", "narrativeAnchor", "insightDelivered", and "dataSourceAttribution" fields
2. Descriptions should be specific, not generic. Bad: "Key financial metrics". Good: "YoY revenue growth slowed as the company invested heavily in R&D."
3. For custom exhibits, use type "custom_template" and include the "templateType" field in the data object
4. Valid templateTypes: decision_simulator, scenario_builder, reveal_cards, comparative_ranker, what_if_calculator
5. NEVER use em dashes (—) in titles, descriptions, or any text content. Use regular hyphens (-), commas, colons, or rewrite sentences instead
6. Apply the DATA REALISM rules: no round numbers, include variance, use specific dates, add an "ugly" data point
7. Generate exactly 3-4 exhibits total (2-3 library + 1 interactive)

Generate all exhibits now. Remember: QUALITY OVER QUANTITY. Every exhibit must be ESSENTIAL:`
}
