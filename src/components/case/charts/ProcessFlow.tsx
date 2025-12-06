'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useExhibitPalette } from '../ExhibitContext'

/**
 * ProcessFlow
 * 
 * Editorial-quality process/flow diagram with:
 * - Animated step transitions
 * - Interactive hover states
 * - Brand-derived colors
 */

interface ProcessStep {
  name: string
  description?: string
  icon?: string
  status?: 'complete' | 'current' | 'pending'
}

interface ProcessFlowData {
  steps: ProcessStep[]
  orientation?: 'horizontal' | 'vertical'
  showNumbers?: boolean
}

interface ProcessFlowProps {
  data: ProcessFlowData
}

export function ProcessFlow({ data }: ProcessFlowProps) {
  const palette = useExhibitPalette()
  const [hoveredStep, setHoveredStep] = useState<number | null>(null)

  // Defensive check for missing or malformed data
  if (!data?.steps || !Array.isArray(data.steps) || data.steps.length === 0) {
    return (
      <div className="py-8 text-center text-slate-500">
        <p className="text-sm">No process flow data available</p>
      </div>
    )
  }

  const isVertical = data.orientation === 'vertical'

  const getStepStyles = (status?: string, index?: number) => {
    const isHovered = hoveredStep === index
    
    switch (status) {
      case 'complete':
        return {
          bg: palette.positiveLight,
          border: palette.positive,
          text: palette.positive,
          connector: palette.positive
        }
      case 'current':
        return {
          bg: palette.primaryLight,
          border: palette.primary,
          text: palette.primary,
          connector: palette.primary
        }
      default:
        return {
          bg: isHovered ? palette.backgroundAlt : 'white',
          border: isHovered ? palette.primary : palette.border,
          text: palette.textMuted,
          connector: palette.border
        }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`process-flow ${isVertical ? 'space-y-0' : 'flex items-start gap-0'}`}
    >
      {data.steps.map((step, index) => {
        const styles = getStepStyles(step.status, index)
        const isLast = index === data.steps.length - 1

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: isVertical ? 0 : -12, y: isVertical ? -12 : 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex ${isVertical ? 'flex-row' : 'flex-col'} items-center`}
            onMouseEnter={() => setHoveredStep(index)}
            onMouseLeave={() => setHoveredStep(null)}
          >
            {/* Step card */}
            <motion.div
              className="process-step rounded-xl px-5 py-4 border-2 cursor-pointer"
              style={{
                backgroundColor: styles.bg,
                borderColor: styles.border,
                minWidth: isVertical ? 'auto' : '140px'
              }}
              whileHover={{ scale: 1.03, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <div className="flex items-center gap-3">
                {/* Number or icon */}
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
                  style={{ 
                    backgroundColor: styles.border,
                    color: 'white'
                  }}
                >
                  {step.icon || (data.showNumbers !== false ? index + 1 : '•')}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="font-medium text-slate-900 text-sm">
                    {step.name}
                  </div>
                  {step.description && (
                    <div className="text-xs text-slate-500 mt-0.5 truncate">
                      {step.description}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Connector arrow */}
            {!isLast && (
              <div 
                className={`flex items-center justify-center ${
                  isVertical ? 'h-8 w-full' : 'w-8 h-full'
                }`}
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  className={isVertical ? 'text-lg' : 'text-xl'}
                  style={{ color: styles.connector }}
                >
                  {isVertical ? '↓' : '→'}
                </motion.div>
              </div>
            )}
          </motion.div>
        )
      })}
    </motion.div>
  )
}
