'use client'

import { useExhibitPalette } from '../../ExhibitContext'

/**
 * ChartTooltip
 * 
 * Custom tooltip component for Recharts with editorial styling.
 * Consistent across all chart types.
 */

interface TooltipPayloadItem {
  name: string
  value: number | string
  color?: string
  dataKey?: string
  payload?: Record<string, unknown>
}

interface ChartTooltipProps {
  active?: boolean
  payload?: TooltipPayloadItem[]
  label?: string
  formatValue?: (value: number | string, name?: string) => string
  formatLabel?: (label: string) => string
  showTotal?: boolean
  unit?: string
}

export function ChartTooltip({
  active,
  payload,
  label,
  formatValue = (v) => String(v),
  formatLabel = (l) => l,
  showTotal = false,
  unit = '',
}: ChartTooltipProps) {
  const palette = useExhibitPalette()

  if (!active || !payload || payload.length === 0) {
    return null
  }

  const total = showTotal
    ? payload.reduce((sum, entry) => {
        const val = typeof entry.value === 'number' ? entry.value : 0
        return sum + val
      }, 0)
    : null

  return (
    <div className="chart-tooltip">
      {label && (
        <div className="chart-tooltip-label">
          {formatLabel(label)}
        </div>
      )}
      <div className="chart-tooltip-items">
        {payload.map((entry, i) => (
          <div key={i} className="chart-tooltip-item">
            <span 
              className="chart-tooltip-dot"
              style={{ backgroundColor: entry.color || palette.scale[i] }}
            />
            <span className="chart-tooltip-name">{entry.name}</span>
            <span className="chart-tooltip-value">
              {formatValue(entry.value, entry.name)}{unit}
            </span>
          </div>
        ))}
      </div>
      {showTotal && total !== null && (
        <div className="chart-tooltip-total">
          <span className="chart-tooltip-total-label">Total</span>
          <span className="chart-tooltip-total-value">
            {formatValue(total)}{unit}
          </span>
        </div>
      )}
    </div>
  )
}

/**
 * Minimal tooltip for sparklines and small charts
 */
export function MiniTooltip({
  active,
  payload,
  formatValue = (v) => String(v),
}: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null
  }

  return (
    <div className="chart-tooltip-mini">
      {formatValue(payload[0].value)}
    </div>
  )
}


