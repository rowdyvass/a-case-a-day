'use client'

import { useState } from 'react'
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts'
import { motion } from 'framer-motion'
import { useExhibitPalette } from '../ExhibitContext'
import { getContrastColor } from '@/lib/colors'

/**
 * TreemapChart
 * 
 * Editorial-quality treemap with:
 * - Hierarchical data visualization
 * - Interactive hover states
 * - Brand-derived colors
 */

interface TreemapNode {
  name: string
  value: number
  children?: TreemapNode[]
  color?: string
}

interface TreemapData {
  data: TreemapNode[]
  unit?: string
  showLabels?: boolean
}

interface TreemapChartProps {
  data: TreemapData
}

// Custom content renderer for treemap cells
const CustomizedContent = (props: {
  x: number
  y: number
  width: number
  height: number
  name: string
  value: number
  color: string
  index: number
  depth: number
  showLabels: boolean
  isHovered: boolean
  formatValue: (value: number) => string
}) => {
  const { x, y, width, height, name, value, color, showLabels, isHovered, formatValue } = props
  const textColor = getContrastColor(color)
  const showText = width > 50 && height > 30 && showLabels

  return (
    <g>
      <motion.rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={color}
        stroke="#fff"
        strokeWidth={2}
        rx={4}
        animate={{
          opacity: isHovered ? 1 : 0.85,
          filter: isHovered ? 'brightness(1.1)' : 'brightness(1)'
        }}
        style={{ cursor: 'pointer' }}
      />
      {showText && (
        <>
          <text
            x={x + width / 2}
            y={y + height / 2 - 6}
            textAnchor="middle"
            fill={textColor}
            fontSize={12}
            fontWeight={600}
          >
            {name.length > 15 ? name.slice(0, 12) + '...' : name}
          </text>
          <text
            x={x + width / 2}
            y={y + height / 2 + 10}
            textAnchor="middle"
            fill={textColor}
            fontSize={11}
            opacity={0.8}
          >
            {formatValue(value)}
          </text>
        </>
      )}
    </g>
  )
}

export function TreemapChart({ data }: TreemapChartProps) {
  const palette = useExhibitPalette()
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)

  // Defensive check for missing or malformed data
  if (!data?.data || !Array.isArray(data.data) || data.data.length === 0) {
    return (
      <div className="py-8 text-center text-slate-500">
        <p className="text-sm">No treemap data available</p>
      </div>
    )
  }

  const formatValue = (value: number) => {
    if (data.unit === '$B') return `$${value.toFixed(1)}B`
    if (data.unit === '$M') return `$${value.toFixed(0)}M`
    if (data.unit === '%') return `${value.toFixed(1)}%`
    return value.toLocaleString()
  }

  // Add colors to data
  const coloredData = data.data.map((node, i) => ({
    ...node,
    fill: node.color || palette.scale[i % palette.scale.length]
  }))

  const CustomTooltip = ({ active, payload }: {
    active?: boolean
    payload?: Array<{ payload: { name: string; value: number } }>
  }) => {
    if (!active || !payload || payload.length === 0) return null

    const node = payload[0].payload

    return (
      <div className="chart-tooltip">
        <div className="chart-tooltip-label">{node.name}</div>
        <div className="chart-tooltip-items">
          <div className="chart-tooltip-item">
            <span className="chart-tooltip-name">Value</span>
            <span className="chart-tooltip-value">{formatValue(node.value)}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <ResponsiveContainer width="100%" height={360}>
        <Treemap
          data={coloredData}
          dataKey="value"
          aspectRatio={4 / 3}
          stroke="#fff"
          animationDuration={800}
          content={(props) => (
            <CustomizedContent
              {...props}
              color={props.fill || palette.scale[props.index % palette.scale.length]}
              showLabels={data.showLabels !== false}
              isHovered={hoveredNode === props.name}
              formatValue={formatValue}
            />
          )}
          onMouseEnter={(node) => setHoveredNode(node.name)}
          onMouseLeave={() => setHoveredNode(null)}
        >
          <Tooltip content={<CustomTooltip />} />
        </Treemap>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="chart-legend chart-legend-horizontal mt-4 flex-wrap">
        {coloredData.map((node, i) => (
          <button
            key={node.name}
            type="button"
            className="chart-legend-item"
            style={{ opacity: !hoveredNode || hoveredNode === node.name ? 1 : 0.3 }}
            onMouseEnter={() => setHoveredNode(node.name)}
            onMouseLeave={() => setHoveredNode(null)}
          >
            <span className="chart-legend-dot" style={{ backgroundColor: node.fill }} />
            <span className="chart-legend-label">{node.name}</span>
          </button>
        ))}
      </div>
    </motion.div>
  )
}
