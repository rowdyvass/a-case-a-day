'use client'

import { motion } from 'framer-motion'
import { useExhibitPalette } from '../ExhibitContext'

/**
 * ProConList
 * 
 * Editorial-quality pros/cons comparison with:
 * - Side-by-side or stacked layout
 * - Animated items
 * - Brand-derived colors
 */

interface ProConData {
  pros: {
    title: string
    description?: string
  }[]
  cons: {
    title: string
    description?: string
  }[]
  prosLabel?: string
  consLabel?: string
  layout?: 'side-by-side' | 'stacked'
}

interface ProConListProps {
  data: ProConData
}

export function ProConList({ data }: ProConListProps) {
  const palette = useExhibitPalette()

  // Defensive check for missing or malformed data
  const pros = Array.isArray(data?.pros) ? data.pros : []
  const cons = Array.isArray(data?.cons) ? data.cons : []

  if (pros.length === 0 && cons.length === 0) {
    return (
      <div className="py-8 text-center text-slate-500">
        <p className="text-sm">No pros/cons data available</p>
      </div>
    )
  }

  const isSideBySide = data?.layout !== 'stacked'

  const ListSection = ({ 
    items, 
    type, 
    label 
  }: { 
    items: ProConData['pros']
    type: 'pro' | 'con'
    label: string 
  }) => {
    const isPro = type === 'pro'
    const color = isPro ? palette.positive : palette.negative
    const bgColor = isPro ? palette.positiveLight : palette.negativeLight

    return (
      <div className="flex-1">
        <div 
          className="text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2"
          style={{ color }}
        >
          <span>{isPro ? '✓' : '✗'}</span>
          {label}
        </div>
        <div className="space-y-2">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: isPro ? -8 : 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-3 rounded-lg border-l-3"
              style={{
                backgroundColor: bgColor,
                borderLeftColor: color,
                borderLeftWidth: 3
              }}
            >
              <div className="font-medium text-slate-900 text-sm">
                {item.title}
              </div>
              {item.description && (
                <div className="text-xs text-slate-600 mt-1">
                  {item.description}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={isSideBySide ? 'grid grid-cols-2 gap-6' : 'space-y-6'}
    >
      <ListSection 
        items={pros} 
        type="pro" 
        label={data?.prosLabel || 'Pros'} 
      />
      <ListSection 
        items={cons} 
        type="con" 
        label={data?.consLabel || 'Cons'} 
      />
    </motion.div>
  )
}
