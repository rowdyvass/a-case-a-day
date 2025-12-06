'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { ExhibitProvider, useExhibitPalette } from './ExhibitContext'
import { ExhibitWrapper, ChartTooltip } from './charts/shared'
import {
  // Basic Charts
  WaterfallChart,
  RadarChart,
  PositioningMap,
  Timeline,
  SankeyDiagram,
  EnhancedTable,
  // New Chart Types
  AreaChart,
  StackedBarChart,
  FunnelChart,
  TreemapChart,
  HeatmapChart,
  GaugeChart,
  BulletChart,
  BubbleChart,
  ComboChart,
  SlopeChart,
  LollipopChart,
  DonutChart,
  HistogramChart,
  CandlestickChart,
  DumbbellChart,
  // Interactive Components
  MetricCard,
  MetricGrid,
  ScenarioCalculator,
  ComparisonGrid,
  DrilldownChart,
  DataTable,
  // Text & Narrative
  CalloutBox,
  QuoteComparison,
  StatHighlight,
  SourceExcerpt,
  ProConList,
  ProcessFlow,
  // Custom Interactive Exhibits
  CustomExhibit,
  SimpleCustomExhibit
} from './charts'

interface Exhibit {
  id: string
  type: string
  title: string
  description?: string  // Brief explanation displayed as subtitle
  data: Record<string, unknown>
}

interface ExhibitRendererProps {
  exhibit: Exhibit
  index: number
  brandColor?: string | null
  companyName?: string
}

export function ExhibitRenderer({ exhibit, index, brandColor, companyName }: ExhibitRendererProps) {
  // Get description from either the exhibit prop or from data.description (for existing exhibits)
  const description = exhibit.description || (exhibit.data?.description as string | undefined)
  
  return (
    <ExhibitProvider brandColor={brandColor} companyName={companyName}>
      <ExhibitWrapper title={exhibit.title} index={index} subtitle={description}>
        <ExhibitContent exhibit={exhibit} />
      </ExhibitWrapper>
    </ExhibitProvider>
  )
}

function ExhibitContent({ exhibit }: { exhibit: Exhibit }) {
  const palette = useExhibitPalette()
  const data = exhibit.data

  switch (exhibit.type) {
    // ============== BASIC TABLES ==============
    case 'table':
      return <TableExhibit data={data} />
    
    case 'enhanced_table':
      return <EnhancedTable data={data as unknown as Parameters<typeof EnhancedTable>[0]['data']} />
    
    case 'data_table':
      return <DataTable data={data as unknown as Parameters<typeof DataTable>[0]['data']} />
    
    case 'comparison_grid':
      return <ComparisonGrid data={data as unknown as Parameters<typeof ComparisonGrid>[0]['data']} />

    // ============== BASIC CHARTS ==============
    case 'chart':
      return <ChartExhibit data={data} palette={palette} />
    
    case 'area_chart':
      return <AreaChart data={data as unknown as Parameters<typeof AreaChart>[0]['data']} />
    
    case 'stacked_bar':
      return <StackedBarChart data={data as unknown as Parameters<typeof StackedBarChart>[0]['data']} />
    
    case 'waterfall':
      return <WaterfallChart data={data as unknown as Parameters<typeof WaterfallChart>[0]['data']} />
    
    case 'funnel':
      return <FunnelChart data={data as unknown as Parameters<typeof FunnelChart>[0]['data']} />
    
    case 'treemap':
      return <TreemapChart data={data as unknown as Parameters<typeof TreemapChart>[0]['data']} />
    
    case 'heatmap':
      return <HeatmapChart data={data as unknown as Parameters<typeof HeatmapChart>[0]['data']} />
    
    case 'radar':
      return <RadarChart data={data as unknown as Parameters<typeof RadarChart>[0]['data']} />
    
    case 'positioning':
      return <PositioningMap data={data as unknown as Parameters<typeof PositioningMap>[0]['data']} />
    
    case 'bubble':
      return <BubbleChart data={data as unknown as Parameters<typeof BubbleChart>[0]['data']} />
    
    case 'combo':
      return <ComboChart data={data as unknown as Parameters<typeof ComboChart>[0]['data']} />
    
    case 'slope':
      return <SlopeChart data={data as unknown as Parameters<typeof SlopeChart>[0]['data']} />
    
    case 'lollipop':
      return <LollipopChart data={data as unknown as Parameters<typeof LollipopChart>[0]['data']} />
    
    case 'donut':
      return <DonutChart data={data as unknown as Parameters<typeof DonutChart>[0]['data']} />
    
    case 'histogram':
      return <HistogramChart data={data as unknown as Parameters<typeof HistogramChart>[0]['data']} />
    
    case 'candlestick':
      return <CandlestickChart data={data as unknown as Parameters<typeof CandlestickChart>[0]['data']} />
    
    case 'dumbbell':
      return <DumbbellChart data={data as unknown as Parameters<typeof DumbbellChart>[0]['data']} />
    
    case 'gauge':
      return <GaugeChart data={data as unknown as Parameters<typeof GaugeChart>[0]['data']} />
    
    case 'bullet':
      return <BulletChart data={data as unknown as Parameters<typeof BulletChart>[0]['data']} />

    // ============== FLOW & PROCESS ==============
    case 'timeline':
      return <Timeline data={data as unknown as Parameters<typeof Timeline>[0]['data']} />
    
    case 'sankey':
      return <SankeyDiagram data={data as unknown as Parameters<typeof SankeyDiagram>[0]['data']} />
    
    case 'process_flow':
      return <ProcessFlow data={data as unknown as Parameters<typeof ProcessFlow>[0]['data']} />
    
    case 'drilldown':
      return <DrilldownChart data={data as unknown as Parameters<typeof DrilldownChart>[0]['data']} />

    // ============== TEXT & NARRATIVE ==============
    case 'quote':
      return <QuoteExhibit data={data} palette={palette} />
    
    case 'quote_comparison':
      return <QuoteComparison data={data as unknown as Parameters<typeof QuoteComparison>[0]['data']} />
    
    case 'callout':
      return <CalloutBox data={data as unknown as Parameters<typeof CalloutBox>[0]['data']} />
    
    case 'stat_highlight':
      return <StatHighlight data={data as unknown as Parameters<typeof StatHighlight>[0]['data']} />
    
    case 'source_excerpt':
      return <SourceExcerpt data={data as unknown as Parameters<typeof SourceExcerpt>[0]['data']} />
    
    case 'pro_con':
      return <ProConList data={data as unknown as Parameters<typeof ProConList>[0]['data']} />
    
    case 'diagram':
      return <DiagramExhibit data={data} palette={palette} />

    // ============== INTERACTIVE ==============
    case 'metric_card':
      return <MetricCard data={data as unknown as Parameters<typeof MetricCard>[0]['data']} />
    
    case 'metric_grid':
      return <MetricGrid data={data as unknown as Parameters<typeof MetricGrid>[0]['data']} />
    
    case 'scenario_calculator':
      return <ScenarioCalculator data={data as unknown as Parameters<typeof ScenarioCalculator>[0]['data']} />

    // ============== CUSTOM TEMPLATE-BASED (NEW) ==============
    case 'custom_template':
      return <SimpleCustomExhibit data={data} />

    // ============== CUSTOM AI-GENERATED (LEGACY) ==============
    case 'custom_interactive':
    case 'custom_decision_simulator':
    case 'custom_data_explorer':
    case 'custom_reveal_cards':
    case 'custom_scenario_builder':
    case 'custom_interactive_timeline':
    case 'custom_comparative_ranker':
      return <CustomExhibit data={data} />

    default:
      return (
        <div className="exhibit-unknown">
          Unknown exhibit type: {exhibit.type}
        </div>
      )
  }
}

// ============== BASIC EXHIBIT COMPONENTS ==============

import type { ColorPalette } from '@/lib/colors'

interface ExhibitData {
  headers?: string[]
  rows?: (string | number | Record<string, unknown>)[][]
  labels?: string[]
  datasets?: { label: string; values: number[] }[]
  text?: string
  attribution?: string
  role?: string
  type?: string
  elements?: string[]
  description?: string
}

function TableExhibit({ data }: { data: Record<string, unknown> }) {
  const palette = useExhibitPalette()
  const { headers, rows } = data as ExhibitData
  
  if (!headers || !rows) {
    return <p className="exhibit-empty">No table data available</p>
  }

  return (
    <div className="exhibit-table-wrapper">
      <table className="exhibit-table">
        <thead>
          <tr>
            {headers.map((header, i) => (
              <th
                key={i}
                style={{ 
                  borderBottomColor: i === 0 ? palette.primary : palette.border 
                }}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {(row as (string | number)[]).map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={cellIndex === 0 ? 'exhibit-table-cell-primary' : ''}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ChartExhibit({ data, palette }: { data: Record<string, unknown>; palette: ColorPalette }) {
  const { labels, datasets } = data as ExhibitData
  
  if (!labels || !datasets || datasets.length === 0) {
    return <p className="exhibit-empty">No chart data available</p>
  }

  const chartData = labels.map((label, i) => ({
    name: label,
    ...datasets.reduce((acc, dataset) => {
      acc[dataset.label] = dataset.values[i]
      return acc
    }, {} as Record<string, number>)
  }))

  const hasMultipleDatasets = datasets.length > 1
  const isSmallDataset = labels.length <= 6

  if (isSmallDataset && !hasMultipleDatasets) {
    const pieData = chartData.map((item, i) => {
      const numValues = Object.entries(item)
        .filter(([key]) => key !== 'name')
        .map(([, v]) => v)
        .find((v) => typeof v === 'number')
      return {
        name: item.name,
        value: typeof numValues === 'number' ? numValues : 0,
        color: palette.scale[i % palette.scale.length]
      }
    })

    return (
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={110}
            paddingAngle={2}
            dataKey="value"
            label={({ name, percent }) => `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`}
            labelLine={{ stroke: palette.textMuted, strokeWidth: 1 }}
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    )
  }

  const ChartComponent = hasMultipleDatasets ? LineChart : BarChart

  return (
    <ResponsiveContainer width="100%" height={320}>
      <ChartComponent data={chartData} margin={{ top: 24, right: 24, left: 8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={palette.gridLine} vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 12, fill: palette.textMuted }}
          axisLine={{ stroke: palette.axisLine }}
          tickLine={{ stroke: palette.axisLine }}
        />
        <YAxis
          tick={{ fontSize: 12, fill: palette.textMuted }}
          axisLine={{ stroke: palette.axisLine }}
          tickLine={{ stroke: palette.axisLine }}
        />
        <Tooltip content={<ChartTooltip />} />
        {datasets.map((dataset, i) => (
          hasMultipleDatasets ? (
            <Line
              key={dataset.label}
              type="monotone"
              dataKey={dataset.label}
              stroke={palette.scale[i % palette.scale.length]}
              strokeWidth={2.5}
              dot={{ fill: palette.scale[i % palette.scale.length], r: 4 }}
              activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
            />
          ) : (
            <Bar
              key={dataset.label}
              dataKey={dataset.label}
              fill={palette.primary}
              radius={[4, 4, 0, 0]}
            />
          )
        ))}
      </ChartComponent>
    </ResponsiveContainer>
  )
}

function QuoteExhibit({ data, palette }: { data: Record<string, unknown>; palette: ColorPalette }) {
  const { text, attribution, role } = data as ExhibitData
  
  if (!text) {
    return <p className="exhibit-empty">No quote available</p>
  }

  return (
    <blockquote 
      className="exhibit-quote"
      style={{ borderLeftColor: palette.primary }}
    >
      <p className="exhibit-quote-text">&ldquo;{text}&rdquo;</p>
      {(attribution || role) && (
        <footer className="exhibit-quote-attribution">
          {attribution && <span className="exhibit-quote-author">{attribution}</span>}
          {role && <span className="exhibit-quote-role">, {role}</span>}
        </footer>
      )}
    </blockquote>
  )
}

function DiagramExhibit({ data, palette }: { data: Record<string, unknown>; palette: ColorPalette }) {
  const { description, elements, type: diagramType } = data as ExhibitData
  
  if (!description && !elements) {
    return <p className="exhibit-empty">No diagram data available</p>
  }

  return (
    <div className="exhibit-diagram">
      {diagramType && (
        <p className="exhibit-diagram-type">{diagramType}</p>
      )}
      {elements && elements.length > 0 && (
        <div className="exhibit-diagram-elements">
          {elements.map((element, i) => (
            <div
              key={i}
              className="exhibit-diagram-element"
              style={{ 
                borderColor: palette.primary,
                backgroundColor: palette.primaryLight 
              }}
            >
              {element}
            </div>
          ))}
        </div>
      )}
      {description && (
        <p className="exhibit-diagram-description">{description}</p>
      )}
    </div>
  )
}
