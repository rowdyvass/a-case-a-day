'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useExhibitPalette } from '../ExhibitContext'

/**
 * SankeyDiagram
 * 
 * Editorial-quality Sankey diagram with:
 * - Animated flow paths
 * - Interactive hover states
 * - Brand-derived color palette
 * - Elegant node styling
 */

interface SankeyNode {
  name: string
  color?: string
}

interface SankeyLink {
  source: string
  target: string
  value: number
  color?: string
}

interface SankeyData {
  nodes: SankeyNode[]
  links: SankeyLink[]
  unit?: string
}

interface SankeyDiagramProps {
  data: SankeyData
}

export function SankeyDiagram({ data }: SankeyDiagramProps) {
  const palette = useExhibitPalette()
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)

  // Defensive check for missing or malformed data
  if (!data?.nodes || !Array.isArray(data.nodes) || data.nodes.length === 0 ||
      !data?.links || !Array.isArray(data.links) || data.links.length === 0) {
    return (
      <div className="py-8 text-center text-slate-500">
        <p className="text-sm">No sankey diagram data available</p>
      </div>
    )
  }

  const formatValue = (value: number) => {
    if (data.unit === '$B') return `$${value.toFixed(1)}B`
    if (data.unit === '$M') return `$${value.toFixed(0)}M`
    if (data.unit === '$K') return `$${value.toFixed(0)}K`
    if (data.unit === '%') return `${value.toFixed(1)}%`
    return value.toLocaleString()
  }

  // Group links by source
  const sourceGroups = useMemo(() => {
    return data.links.reduce((acc, link) => {
      if (!acc[link.source]) acc[link.source] = []
      acc[link.source].push(link)
      return acc
    }, {} as Record<string, SankeyLink[]>)
  }, [data.links])

  // Calculate total for each source
  const sourceTotals = useMemo(() => {
    return Object.entries(sourceGroups).reduce((acc, [source, links]) => {
      acc[source] = links.reduce((sum, link) => sum + link.value, 0)
      return acc
    }, {} as Record<string, number>)
  }, [sourceGroups])

  // Get unique sources and targets
  const sources = useMemo(() => [...new Set(data.links.map(l => l.source))], [data.links])
  const targets = useMemo(() => [...new Set(data.links.map(l => l.target))], [data.links])

  // Calculate target totals
  const targetTotals = useMemo(() => {
    return targets.reduce((acc, target) => {
      acc[target] = data.links
        .filter(l => l.target === target)
        .reduce((sum, l) => sum + l.value, 0)
      return acc
    }, {} as Record<string, number>)
  }, [targets, data.links])

  // Get color for a link
  const getLinkColor = (link: SankeyLink, index: number) => {
    if (link.color) return link.color
    return palette.scale[index % palette.scale.length]
  }

  // Check if a link/node is highlighted
  const isLinkHighlighted = (link: SankeyLink) => {
    if (!hoveredLink && !hoveredNode) return true
    if (hoveredLink === `${link.source}-${link.target}`) return true
    if (hoveredNode === link.source || hoveredNode === link.target) return true
    return false
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="py-4"
    >
      <div className="flex justify-between items-start gap-6 min-h-[280px]">
        {/* Sources (Left) */}
        <div className="flex flex-col gap-3 min-w-[160px]">
          {sources.map((source, i) => {
            const isHovered = hoveredNode === source
            
            return (
              <motion.div 
                key={source}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="sankey-node"
                style={{
                  backgroundColor: palette.primary,
                  color: '#fff',
                  opacity: hoveredNode && !isHovered ? 0.5 : 1,
                  transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
                  boxShadow: isHovered ? '0 4px 12px -2px rgba(0,0,0,0.15)' : 'none'
                }}
                onMouseEnter={() => setHoveredNode(source)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <div className="font-medium">{source}</div>
                <div className="text-sm opacity-80 mt-0.5">
                  {formatValue(sourceTotals[source])}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Flows (Center) */}
        <div className="flex-1 flex flex-col gap-2 py-2">
          {data.links.map((link, i) => {
            const percentage = (link.value / sourceTotals[link.source]) * 100
            const color = getLinkColor(link, i)
            const linkId = `${link.source}-${link.target}`
            const isHighlighted = isLinkHighlighted(link)
            
            return (
              <motion.div
                key={linkId}
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                style={{ transformOrigin: 'left' }}
                className="flex items-center gap-3"
                onMouseEnter={() => setHoveredLink(linkId)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                <motion.div 
                  className="sankey-flow"
                  style={{ 
                    width: `${Math.max(percentage, 15)}%`,
                    backgroundColor: color,
                    opacity: isHighlighted ? 1 : 0.25
                  }}
                  whileHover={{ filter: 'brightness(1.1)' }}
                >
                  {formatValue(link.value)}
                </motion.div>
                <span 
                  className="text-xs text-slate-500 whitespace-nowrap"
                  style={{ opacity: isHighlighted ? 1 : 0.5 }}
                >
                  → {link.target}
                </span>
              </motion.div>
            )
          })}
        </div>

        {/* Targets (Right) */}
        <div className="flex flex-col gap-2 min-w-[160px]">
          {targets.map((target, i) => {
            const isHovered = hoveredNode === target
            
            return (
              <motion.div 
                key={target}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="sankey-node"
                style={{
                  backgroundColor: palette.backgroundAlt,
                  borderColor: palette.border,
                  border: '1px solid',
                  opacity: hoveredNode && !isHovered ? 0.5 : 1,
                  transform: isHovered ? 'translateX(-4px)' : 'translateX(0)',
                  boxShadow: isHovered ? '0 4px 12px -2px rgba(0,0,0,0.1)' : 'none'
                }}
                onMouseEnter={() => setHoveredNode(target)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <div className="font-medium text-slate-700">{target}</div>
                <div className="text-sm text-slate-500">
                  {formatValue(targetTotals[target])}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="chart-legend chart-legend-horizontal mt-6 pt-4 border-t border-slate-100">
        {data.links.slice(0, 6).map((link, i) => (
          <div key={i} className="chart-legend-item">
            <span 
              className="chart-legend-dot" 
              style={{ backgroundColor: getLinkColor(link, i) }} 
            />
            <span className="chart-legend-label">
              {link.source} → {link.target}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
