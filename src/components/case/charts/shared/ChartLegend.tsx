'use client'

import { useExhibitPalette } from '../../ExhibitContext'

/**
 * ChartLegend
 * 
 * Minimalist, clear legend component with editorial styling.
 * Supports multiple layouts, interactive states, and optional titles.
 */

interface LegendItem {
  label: string
  color?: string
  value?: string | number
  active?: boolean
  type?: 'dot' | 'line'  // Visual indicator type
}

interface ChartLegendProps {
  items: LegendItem[]
  layout?: 'horizontal' | 'vertical' | 'grid'
  title?: string  // Optional legend title (e.g., "Values in $M")
  onItemClick?: (label: string) => void
  onItemHover?: (label: string | null) => void
  activeItem?: string | null
  showValues?: boolean
  className?: string
}

export function ChartLegend({
  items,
  layout = 'horizontal',
  title,
  onItemClick,
  onItemHover,
  activeItem,
  showValues = false,
  className = '',
}: ChartLegendProps) {
  const palette = useExhibitPalette()

  const layoutClasses = {
    horizontal: 'chart-legend-horizontal',
    vertical: 'chart-legend-vertical',
    grid: 'chart-legend-grid',
  }

  const wrapperClass = title ? 'chart-legend-titled' : 'chart-legend'

  return (
    <div className={`${wrapperClass} ${className}`}>
      {title && <div className="chart-legend-title">{title}</div>}
      <div className={`flex flex-wrap gap-x-5 gap-y-2 ${layoutClasses[layout]}`}>
        {items.map((item, i) => {
          const isActive = activeItem === null || activeItem === item.label
          const color = item.color || palette.scale[i % palette.scale.length]

          return (
            <button
              key={item.label}
              type="button"
              className={`chart-legend-item ${!isActive ? 'chart-legend-item-inactive' : ''}`}
              onClick={() => onItemClick?.(item.label)}
              onMouseEnter={() => onItemHover?.(item.label)}
              onMouseLeave={() => onItemHover?.(null)}
              style={{
                opacity: isActive ? 1 : 0.3,
              }}
            >
              {item.type === 'line' ? (
                <span 
                  className="chart-legend-line"
                  style={{ backgroundColor: color }}
                />
              ) : (
                <span 
                  className="chart-legend-dot"
                  style={{ backgroundColor: color }}
                />
              )}
              <span className="chart-legend-label">{item.label}</span>
              {showValues && item.value !== undefined && (
                <span className="chart-legend-value">{item.value}</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/**
 * Compact legend for small charts - minimal footprint
 */
interface CompactLegendProps {
  items: { label: string; color: string }[]
  title?: string
  className?: string
}

export function CompactLegend({ items, title, className = '' }: CompactLegendProps) {
  return (
    <div className={`chart-legend-compact ${className}`}>
      {title && <span className="text-slate-400 mr-2">{title}:</span>}
      {items.map((item) => (
        <span key={item.label} className="chart-legend-compact-item">
          <span 
            className="chart-legend-compact-dot"
            style={{ backgroundColor: item.color }}
          />
          {item.label}
        </span>
      ))}
    </div>
  )
}

