'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useExhibitPalette } from '../ExhibitContext'

/**
 * Timeline
 * 
 * Editorial-quality timeline with:
 * - Expandable event cards
 * - Color-coded event types
 * - Decision point highlighting
 * - Smooth animations
 */

interface TimelineEvent {
  date: string
  title: string
  description?: string
  type?: 'milestone' | 'decision' | 'crisis' | 'success' | 'failure' | 'neutral'
  details?: { label: string; value: string }[]
  quote?: { text: string; attribution?: string }
}

interface TimelineData {
  events: TimelineEvent[]
  orientation?: 'vertical' | 'horizontal'
  startExpanded?: boolean
  highlightDecisions?: boolean
}

interface TimelineProps {
  data: TimelineData
}

export function Timeline({ data }: TimelineProps) {
  const palette = useExhibitPalette()
  const [expandedIndex, setExpandedIndex] = useState<number | null>(
    data?.startExpanded ? 0 : null
  )

  // Defensive check for missing or malformed data
  if (!data?.events || !Array.isArray(data.events) || data.events.length === 0) {
    return (
      <div className="py-8 text-center text-slate-500">
        <p className="text-sm">No timeline data available</p>
      </div>
    )
  }

  const getEventStyles = (type: TimelineEvent['type'] = 'neutral') => {
    switch (type) {
      case 'milestone':
        return { 
          dot: palette.primary, 
          border: palette.primary,
          bg: palette.primaryLight 
        }
      case 'decision':
        return { 
          dot: '#8b5cf6', 
          border: '#c4b5fd',
          bg: '#f5f3ff' 
        }
      case 'crisis':
        return { 
          dot: palette.negative, 
          border: '#fecaca',
          bg: palette.negativeLight 
        }
      case 'success':
        return { 
          dot: palette.positive, 
          border: '#bbf7d0',
          bg: palette.positiveLight 
        }
      case 'failure':
        return { 
          dot: '#f97316', 
          border: '#fed7aa',
          bg: '#fff7ed' 
        }
      default:
        return { 
          dot: '#64748b', 
          border: palette.border,
          bg: palette.backgroundAlt 
        }
    }
  }

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="timeline-container"
    >
      {/* Timeline line */}
      <div 
        className="timeline-line"
        style={{ backgroundColor: palette.border }}
      />

      {/* Events */}
      <div className="space-y-0">
        {data.events.map((event, index) => {
          const styles = getEventStyles(event.type)
          const isExpanded = expandedIndex === index
          const isDecision = event.type === 'decision'

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="timeline-item"
            >
              {/* Dot */}
              <div 
                className="timeline-dot"
                style={{ 
                  backgroundColor: styles.dot,
                  boxShadow: isExpanded ? `0 0 0 4px ${styles.bg}` : 'none'
                }}
              >
                {isDecision && (
                  <span className="text-white text-xs font-bold">?</span>
                )}
              </div>

              {/* Card */}
              <motion.div
                className={`timeline-card ${isExpanded ? 'expanded' : ''}`}
                style={{ 
                  borderColor: isExpanded ? styles.border : palette.border,
                  backgroundColor: isExpanded ? styles.bg : '#fff'
                }}
                onClick={() => toggleExpand(index)}
                whileHover={{ scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                {/* Date & badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="timeline-date">{event.date}</span>
                  {isDecision && data.highlightDecisions && (
                    <span 
                      className="text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{ 
                        backgroundColor: styles.dot,
                        color: '#fff'
                      }}
                    >
                      Decision Point
                    </span>
                  )}
                </div>

                {/* Title */}
                <h4 className="timeline-title">{event.title}</h4>

                {/* Expanded content - Web view (animated) */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="timeline-content overflow-hidden print:hidden"
                    >
                      {event.description && (
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {event.description}
                        </p>
                      )}

                      {event.details && event.details.length > 0 && (
                        <div className="grid grid-cols-2 gap-2 mt-3">
                          {event.details.map((detail, i) => (
                            <div 
                              key={i}
                              className="bg-white/60 rounded-lg p-2.5"
                            >
                              <div className="text-xs text-slate-500">{detail.label}</div>
                              <div className="text-sm font-medium text-slate-900">
                                {detail.value}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {event.quote && (
                        <blockquote 
                          className="mt-3 pt-3 border-t border-slate-200"
                          style={{ borderLeftColor: styles.dot }}
                        >
                          <p className="text-sm italic text-slate-600">
                            &ldquo;{event.quote.text}&rdquo;
                          </p>
                          {event.quote.attribution && (
                            <footer className="text-xs text-slate-500 mt-1">
                              — {event.quote.attribution}
                            </footer>
                          )}
                        </blockquote>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Print-only content - Always visible in print */}
                <div className="timeline-content hidden print:block mt-3">
                  {event.description && (
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {event.description}
                    </p>
                  )}

                  {event.details && event.details.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      {event.details.map((detail, i) => (
                        <div 
                          key={i}
                          className="bg-slate-50 rounded-lg p-2.5"
                        >
                          <div className="text-xs text-slate-500">{detail.label}</div>
                          <div className="text-sm font-medium text-slate-900">
                            {detail.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {event.quote && (
                    <blockquote 
                      className="mt-3 pt-3 border-t border-slate-200"
                      style={{ borderLeftColor: styles.dot }}
                    >
                      <p className="text-sm italic text-slate-600">
                        &ldquo;{event.quote.text}&rdquo;
                      </p>
                      {event.quote.attribution && (
                        <footer className="text-xs text-slate-500 mt-1">
                          — {event.quote.attribution}
                        </footer>
                      )}
                    </blockquote>
                  )}
                </div>

                {/* Expand indicator - hidden in print */}
                <div className="flex items-center justify-center mt-2 print:hidden">
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-slate-400"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )
        })}
      </div>

      {/* Legend */}
      {data.highlightDecisions && (
        <div className="chart-legend chart-legend-horizontal mt-6 pt-4 border-t border-slate-100">
          {['milestone', 'decision', 'success', 'crisis'].map((type) => {
            const styles = getEventStyles(type as TimelineEvent['type'])
            return (
              <div key={type} className="chart-legend-item">
                <span 
                  className="chart-legend-dot" 
                  style={{ backgroundColor: styles.dot }} 
                />
                <span className="chart-legend-label capitalize">{type}</span>
              </div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}
