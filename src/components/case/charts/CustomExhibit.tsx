'use client'

import { useState, useMemo } from 'react'
import type {
  CustomExhibitData,
  DecisionSimulatorData,
  DataExplorerData,
  RevealCardsData,
  ScenarioBuilderData,
  InteractiveTimelineData,
  ComparativeRankerData,
  DecisionNode,
  DecisionOption
} from '@/lib/exhibits/custom-templates'
import { validateCustomExhibit } from '@/lib/exhibits/custom-validation'

interface CustomExhibitProps {
  data: unknown
}

// ============== MAIN COMPONENT ==============

export function CustomExhibit({ data }: CustomExhibitProps) {
  const validation = validateCustomExhibit(data)

  if (!validation.success) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-sm font-medium text-red-800">Invalid custom exhibit configuration</p>
        <p className="text-xs text-red-600 mt-1">{validation.errorMessage}</p>
      </div>
    )
  }

  const exhibitData = validation.data!

  switch (exhibitData.type) {
    case 'custom_decision_simulator':
      return <DecisionSimulator data={exhibitData} />
    case 'custom_data_explorer':
      return <DataExplorer data={exhibitData} />
    case 'custom_reveal_cards':
      return <RevealCards data={exhibitData} />
    case 'custom_scenario_builder':
      return <ScenarioBuilder data={exhibitData} />
    case 'custom_interactive_timeline':
      return <InteractiveTimeline data={exhibitData} />
    case 'custom_comparative_ranker':
      return <ComparativeRanker data={exhibitData} />
    default:
      return (
        <div className="text-slate-500 text-sm p-4 bg-slate-50 rounded-lg">
          Unknown custom exhibit type
        </div>
      )
  }
}

// ============== DECISION SIMULATOR ==============

function DecisionSimulator({ data }: { data: DecisionSimulatorData }) {
  const [currentNodeId, setCurrentNodeId] = useState(data.startNodeId)
  const [history, setHistory] = useState<{ nodeId: string; optionLabel: string }[]>([])
  const [outcome, setOutcome] = useState<DecisionOption['outcome'] | null>(null)
  const [showRealOutcome, setShowRealOutcome] = useState(false)

  const currentNode = data.nodes.find(n => n.id === currentNodeId)

  const handleChoice = (option: DecisionOption) => {
    setHistory(prev => [...prev, { nodeId: currentNodeId, optionLabel: option.label }])
    
    if (option.outcome) {
      setOutcome(option.outcome)
    } else if (option.nextNodeId) {
      setCurrentNodeId(option.nextNodeId)
    }
  }

  const restart = () => {
    setCurrentNodeId(data.startNodeId)
    setHistory([])
    setOutcome(null)
    setShowRealOutcome(false)
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive': return 'bg-emerald-100 border-emerald-300 text-emerald-800'
      case 'negative': return 'bg-red-100 border-red-300 text-red-800'
      case 'mixed': return 'bg-amber-100 border-amber-300 text-amber-800'
      default: return 'bg-slate-100 border-slate-300 text-slate-800'
    }
  }

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
            {data.role}
          </span>
        </div>
        <p className="text-sm text-slate-600">{data.scenario}</p>
      </div>

      {/* Progress trail */}
      {history.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b border-indigo-200">
          {history.map((h, i) => (
            <span key={i} className="px-2 py-1 bg-white/80 text-slate-600 text-xs rounded-full border border-slate-200">
              {h.optionLabel}
            </span>
          ))}
        </div>
      )}

      {/* Current decision or outcome */}
      {outcome ? (
        <div className="space-y-4">
          <div className={`p-4 rounded-lg border ${getImpactColor(outcome.impact)}`}>
            <h4 className="font-semibold text-lg mb-2">{outcome.title}</h4>
            <p className="text-sm opacity-90">{outcome.description}</p>
            
            {outcome.metrics && outcome.metrics.length > 0 && (
              <div className="grid grid-cols-2 gap-3 mt-4">
                {outcome.metrics.map((metric, i) => (
                  <div key={i} className="bg-white/50 rounded-lg p-2">
                    <div className="text-xs opacity-70">{metric.label}</div>
                    <div className="font-semibold flex items-center gap-1">
                      {metric.value}
                      {metric.change === 'up' && <span className="text-emerald-600">↑</span>}
                      {metric.change === 'down' && <span className="text-red-600">↓</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {outcome.realWorldNote && (
            <div className="bg-white/60 p-3 rounded-lg">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Expert Insight</p>
              <p className="text-sm text-slate-700">{outcome.realWorldNote}</p>
            </div>
          )}

          {data.showRealOutcome && data.realOutcome && (
            <button
              onClick={() => setShowRealOutcome(!showRealOutcome)}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              {showRealOutcome ? 'Hide' : 'Reveal'} what actually happened →
            </button>
          )}

          {showRealOutcome && data.realOutcome && (
            <div className="bg-indigo-100 p-4 rounded-lg border border-indigo-200">
              <p className="text-xs font-medium text-indigo-600 uppercase tracking-wide mb-1">What Actually Happened</p>
              <p className="text-sm text-indigo-900">{data.realOutcome}</p>
            </div>
          )}

          <button
            onClick={restart}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : currentNode ? (
        <div>
          <div className="bg-white/80 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-slate-900 mb-2">{currentNode.question}</h4>
            {currentNode.context && (
              <p className="text-sm text-slate-600">{currentNode.context}</p>
            )}
          </div>
          
          <div className="grid gap-3">
            {currentNode.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleChoice(option)}
                className="text-left p-4 bg-white rounded-lg border-2 border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all group"
              >
                <div className="font-medium text-slate-900 group-hover:text-indigo-700">
                  {option.label}
                </div>
                {option.description && (
                  <p className="text-sm text-slate-500 mt-1">{option.description}</p>
                )}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-slate-500">No decisions available</p>
      )}
    </div>
  )
}

// ============== DATA EXPLORER ==============

function DataExplorer({ data }: { data: DataExplorerData }) {
  const [sortConfig, setSortConfig] = useState(data.defaultSort || null)
  const [filters, setFilters] = useState<Record<string, string | number>>({})
  const [compareItems, setCompareItems] = useState<string[]>([])

  const sortedAndFilteredRows = useMemo(() => {
    let rows = [...data.rows]

    // Apply filters
    for (const [key, value] of Object.entries(filters)) {
      if (value !== '' && value !== undefined) {
        rows = rows.filter(row => {
          const cellValue = row[key]
          if (typeof value === 'string') {
            return String(cellValue).toLowerCase().includes(value.toLowerCase())
          }
          return cellValue === value
        })
      }
    }

    // Apply sort
    if (sortConfig) {
      rows.sort((a, b) => {
        const aVal = a[sortConfig.key]
        const bVal = b[sortConfig.key]
        
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal
        }
        
        const comparison = String(aVal).localeCompare(String(bVal))
        return sortConfig.direction === 'asc' ? comparison : -comparison
      })
    }

    return rows
  }, [data.rows, sortConfig, filters])

  const handleSort = (key: string) => {
    setSortConfig(prev => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
      }
      return { key, direction: 'asc' }
    })
  }

  const toggleCompare = (rowId: string) => {
    setCompareItems(prev => {
      if (prev.includes(rowId)) {
        return prev.filter(id => id !== rowId)
      }
      if (prev.length >= (data.maxCompareItems || 3)) {
        return prev
      }
      return [...prev, rowId]
    })
  }

  const formatCell = (value: string | number | boolean, column: DataExplorerData['columns'][0]) => {
    if (typeof value === 'boolean') return value ? '✓' : '✗'
    
    switch (column.type) {
      case 'currency':
        return typeof value === 'number' ? `$${value.toLocaleString()}` : value
      case 'percentage':
        return typeof value === 'number' ? `${value}%` : value
      case 'badge':
        return (
          <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">
            {value}
          </span>
        )
      default:
        return value
    }
  }

  return (
    <div className="bg-slate-50 rounded-xl p-4">
      {/* Filters */}
      {data.filters && data.filters.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-4 pb-4 border-b border-slate-200">
          {data.filters.map(filter => (
            <div key={filter.key} className="flex items-center gap-2">
              <label className="text-xs font-medium text-slate-500">{filter.label}:</label>
              {filter.type === 'select' && filter.options && (
                <select
                  value={String(filters[filter.key] || '')}
                  onChange={(e) => setFilters(prev => ({ ...prev, [filter.key]: e.target.value }))}
                  className="text-sm border border-slate-200 rounded px-2 py-1"
                >
                  <option value="">All</option>
                  {filter.options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              {data.compareMode && <th className="px-2 py-2 text-left w-10"></th>}
              {data.columns.map(col => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={`px-3 py-2 text-left font-semibold text-slate-700 bg-slate-100 ${
                    col.sortable ? 'cursor-pointer hover:bg-slate-200' : ''
                  }`}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && sortConfig?.key === col.key && (
                      <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedAndFilteredRows.map((row, rowIndex) => {
              const rowId = String(row.id || rowIndex)
              const isComparing = compareItems.includes(rowId)
              
              return (
                <tr
                  key={rowIndex}
                  className={`border-b border-slate-100 ${isComparing ? 'bg-indigo-50' : 'hover:bg-white'}`}
                >
                  {data.compareMode && (
                    <td className="px-2 py-2">
                      <input
                        type="checkbox"
                        checked={isComparing}
                        onChange={() => toggleCompare(rowId)}
                        className="accent-indigo-500"
                      />
                    </td>
                  )}
                  {data.columns.map((col, colIndex) => (
                    <td
                      key={col.key}
                      className={`px-3 py-2 ${colIndex === 0 ? 'font-medium text-slate-900' : 'text-slate-600'}`}
                    >
                      {formatCell(row[col.key], col)}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Insights */}
      {data.insights && data.insights.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Key Insights</p>
          <div className="space-y-2">
            {data.insights.map((insight, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="text-indigo-500">→</span>
                {insight.text}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ============== REVEAL CARDS ==============

function RevealCards({ data }: { data: RevealCardsData }) {
  const [revealedCards, setRevealedCards] = useState<Set<string>>(new Set())

  const toggleCard = (id: string) => {
    setRevealedCards(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const revealAll = () => {
    setRevealedCards(new Set(data.cards.map(c => c.id)))
  }

  const hideAll = () => {
    setRevealedCards(new Set())
  }

  const getIconSvg = (icon?: string) => {
    switch (icon) {
      case 'person':
        return <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
      case 'company':
        return <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
      case 'strategy':
        return <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
      case 'risk':
        return <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
      case 'opportunity':
        return <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
      case 'question':
        return <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      default:
        return <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
    }
  }

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive': return 'border-emerald-300 bg-emerald-50'
      case 'negative': return 'border-red-300 bg-red-50'
      default: return 'border-slate-300 bg-slate-50'
    }
  }

  const allRevealed = revealedCards.size === data.cards.length

  return (
    <div className="bg-slate-50 rounded-xl p-6">
      <p className="text-sm text-slate-600 mb-4">{data.prompt}</p>

      {data.revealAll && (
        <div className="flex gap-2 mb-4">
          <button
            onClick={allRevealed ? hideAll : revealAll}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
          >
            {allRevealed ? 'Hide All' : 'Reveal All'}
          </button>
        </div>
      )}

      <div className={`grid gap-4 ${data.layout === 'carousel' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}`}>
        {data.cards.map(card => {
          const isRevealed = revealedCards.has(card.id)
          
          return (
            <div
              key={card.id}
              onClick={() => toggleCard(card.id)}
              className={`cursor-pointer transition-all duration-300 ${
                isRevealed ? 'transform rotate-0' : ''
              }`}
            >
              <div className={`min-h-[180px] rounded-xl border-2 p-4 transition-all ${
                isRevealed 
                  ? getSentimentColor(card.sentiment)
                  : 'border-indigo-200 bg-white hover:border-indigo-400 hover:shadow-md'
              }`}>
                {!isRevealed ? (
                  // Front of card
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="text-indigo-400 mb-3">
                      {getIconSvg(card.frontIcon)}
                    </div>
                    <h4 className="font-semibold text-slate-900">{card.frontTitle}</h4>
                    {card.frontSubtitle && (
                      <p className="text-xs text-slate-500 mt-1">{card.frontSubtitle}</p>
                    )}
                    <p className="text-xs text-indigo-500 mt-3">Click to reveal →</p>
                  </div>
                ) : (
                  // Back of card
                  <div className="h-full flex flex-col">
                    <h4 className="font-semibold text-slate-900 mb-2">{card.backTitle}</h4>
                    <p className="text-sm text-slate-700 flex-1">{card.backContent}</p>
                    {card.backQuote && (
                      <div className="mt-3 pt-3 border-t border-slate-200">
                        <p className="text-sm italic text-slate-600">&ldquo;{card.backQuote.text}&rdquo;</p>
                        <p className="text-xs text-slate-500 mt-1">— {card.backQuote.attribution}</p>
                      </div>
                    )}
                    {card.tags && card.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {card.tags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 bg-white/50 text-slate-600 text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {data.discussionPrompt && allRevealed && (
        <div className="mt-6 p-4 bg-indigo-100 rounded-lg border border-indigo-200">
          <p className="text-xs font-medium text-indigo-600 uppercase tracking-wide mb-1">Discussion Prompt</p>
          <p className="text-sm text-indigo-900">{data.discussionPrompt}</p>
        </div>
      )}
    </div>
  )
}

// ============== SCENARIO BUILDER ==============

function ScenarioBuilder({ data }: { data: ScenarioBuilderData }) {
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(new Set())
  const [showFeedback, setShowFeedback] = useState(false)

  const toggleOption = (optionId: string) => {
    setSelectedOptions(prev => {
      const next = new Set(prev)
      const option = data.options.find(o => o.id === optionId)
      
      if (next.has(optionId)) {
        next.delete(optionId)
      } else {
        // Check max selections
        if (data.maxSelections && next.size >= data.maxSelections) {
          return prev
        }
        // Check dependencies
        if (option?.dependencies) {
          const missingDeps = option.dependencies.filter(d => !next.has(d))
          if (missingDeps.length > 0) {
            return prev // Don't add if dependencies not met
          }
        }
        // Check conflicts
        if (option?.conflicts) {
          const hasConflict = option.conflicts.some(c => next.has(c))
          if (hasConflict) {
            return prev // Don't add if conflicts exist
          }
        }
        next.add(optionId)
      }
      return next
    })
  }

  const getConstraintUsage = (constraint: ScenarioBuilderData['constraints'][0]) => {
    let total = 0
    selectedOptions.forEach(optionId => {
      const option = data.options.find(o => o.id === optionId)
      if (option?.cost) {
        const costNum = parseFloat(option.cost.replace(/[^0-9.]/g, ''))
        if (!isNaN(costNum)) total += costNum
      }
    })
    return total
  }

  const activeFeedback = useMemo(() => {
    if (!data.feedback) return []
    
    return data.feedback.filter(f => {
      const selectedArray = Array.from(selectedOptions)
      
      switch (f.condition.type) {
        case 'includes':
          return f.condition.optionIds.some(id => selectedOptions.has(id))
        case 'excludes':
          return !f.condition.optionIds.some(id => selectedOptions.has(id))
        case 'count_gte':
          return selectedArray.length >= (f.condition.value || 0)
        case 'count_lte':
          return selectedArray.length <= (f.condition.value || 0)
        case 'all_of':
          return f.condition.optionIds.every(id => selectedOptions.has(id))
        case 'none_of':
          return !f.condition.optionIds.some(id => selectedOptions.has(id))
        default:
          return false
      }
    })
  }, [selectedOptions, data.feedback])

  const getRiskColor = (risk?: string) => {
    switch (risk) {
      case 'low': return 'bg-emerald-100 text-emerald-700'
      case 'medium': return 'bg-amber-100 text-amber-700'
      case 'high': return 'bg-red-100 text-red-700'
      default: return 'bg-slate-100 text-slate-700'
    }
  }

  const getImpactColor = (impact?: string) => {
    switch (impact) {
      case 'low': return 'bg-slate-100 text-slate-700'
      case 'medium': return 'bg-blue-100 text-blue-700'
      case 'high': return 'bg-indigo-100 text-indigo-700'
      default: return 'bg-slate-100 text-slate-700'
    }
  }

  const getFeedbackColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-emerald-100 border-emerald-300 text-emerald-800'
      case 'warning': return 'bg-amber-100 border-amber-300 text-amber-800'
      case 'error': return 'bg-red-100 border-red-300 text-red-800'
      default: return 'bg-blue-100 border-blue-300 text-blue-800'
    }
  }

  const groupedOptions = useMemo(() => {
    const grouped: Record<string, typeof data.options> = {}
    data.categories.forEach(cat => { grouped[cat] = [] })
    data.options.forEach(opt => {
      if (grouped[opt.category]) {
        grouped[opt.category].push(opt)
      }
    })
    return grouped
  }, [data.options, data.categories])

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6">
      <p className="text-sm text-slate-600 mb-4">{data.prompt}</p>

      {/* Constraints */}
      {data.constraints && data.constraints.length > 0 && (
        <div className="flex flex-wrap gap-4 mb-4 pb-4 border-b border-amber-200">
          {data.constraints.map(constraint => {
            const usage = getConstraintUsage(constraint)
            const percentage = Math.min(100, (usage / constraint.maxValue) * 100)
            
            return (
              <div key={constraint.type} className="flex-1 min-w-[150px]">
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>{constraint.label}</span>
                  <span className={percentage > 100 ? 'text-red-600 font-medium' : ''}>
                    {usage.toFixed(0)} / {constraint.maxValue} {constraint.unit}
                  </span>
                </div>
                <div className="h-2 bg-amber-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all ${percentage > 100 ? 'bg-red-500' : 'bg-amber-500'}`}
                    style={{ width: `${Math.min(100, percentage)}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Options by category */}
      <div className="space-y-6">
        {data.categories.map(category => (
          <div key={category}>
            <h4 className="text-sm font-semibold text-slate-700 mb-3">{category}</h4>
            <div className="grid gap-3 md:grid-cols-2">
              {groupedOptions[category]?.map(option => {
                const isSelected = selectedOptions.has(option.id)
                const hasMissingDeps = option.dependencies?.some(d => !selectedOptions.has(d))
                const hasConflict = option.conflicts?.some(c => selectedOptions.has(c))
                const isDisabled = hasMissingDeps || hasConflict
                
                return (
                  <div
                    key={option.id}
                    onClick={() => !isDisabled && toggleOption(option.id)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      isSelected
                        ? 'border-amber-500 bg-amber-100'
                        : isDisabled
                          ? 'border-slate-200 bg-slate-100 opacity-50 cursor-not-allowed'
                          : 'border-slate-200 bg-white hover:border-amber-300 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <div className={`w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${
                        isSelected ? 'border-amber-500 bg-amber-500' : 'border-slate-300'
                      }`}>
                        {isSelected && <span className="text-white text-xs">✓</span>}
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-slate-900">{option.label}</h5>
                        <p className="text-xs text-slate-600 mt-0.5">{option.description}</p>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {option.cost && (
                            <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 text-xs rounded">
                              {option.cost}
                            </span>
                          )}
                          {option.timeframe && (
                            <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 text-xs rounded">
                              {option.timeframe}
                            </span>
                          )}
                          {option.risk && (
                            <span className={`px-1.5 py-0.5 text-xs rounded ${getRiskColor(option.risk)}`}>
                              {option.risk} risk
                            </span>
                          )}
                          {option.impact && (
                            <span className={`px-1.5 py-0.5 text-xs rounded ${getImpactColor(option.impact)}`}>
                              {option.impact} impact
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Selection count */}
      <div className="mt-4 pt-4 border-t border-amber-200 flex items-center justify-between">
        <div className="text-sm text-slate-600">
          Selected: {selectedOptions.size}
          {data.minSelections && ` (min: ${data.minSelections})`}
          {data.maxSelections && ` (max: ${data.maxSelections})`}
        </div>
        <button
          onClick={() => setShowFeedback(!showFeedback)}
          disabled={selectedOptions.size === 0}
          className="px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {showFeedback ? 'Hide Analysis' : 'Analyze Strategy'}
        </button>
      </div>

      {/* Feedback */}
      {showFeedback && activeFeedback.length > 0 && (
        <div className="mt-4 space-y-2">
          {activeFeedback.map((feedback, i) => (
            <div key={i} className={`p-3 rounded-lg border ${getFeedbackColor(feedback.type)}`}>
              <p className="text-sm">{feedback.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ============== INTERACTIVE TIMELINE ==============

function InteractiveTimeline({ data }: { data: InteractiveTimelineData }) {
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(
    data.startExpanded ? new Set(data.events.map(e => e.id)) : new Set()
  )
  const [selectedDecision, setSelectedDecision] = useState<string | null>(null)

  const toggleEvent = (id: string) => {
    setExpandedEvents(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const getEventTypeStyles = (type: string) => {
    switch (type) {
      case 'milestone': return { dot: 'bg-blue-500', border: 'border-blue-200', bg: 'bg-blue-50' }
      case 'decision': return { dot: 'bg-purple-500', border: 'border-purple-200', bg: 'bg-purple-50' }
      case 'crisis': return { dot: 'bg-red-500', border: 'border-red-200', bg: 'bg-red-50' }
      case 'success': return { dot: 'bg-emerald-500', border: 'border-emerald-200', bg: 'bg-emerald-50' }
      case 'failure': return { dot: 'bg-orange-500', border: 'border-orange-200', bg: 'bg-orange-50' }
      default: return { dot: 'bg-slate-500', border: 'border-slate-200', bg: 'bg-slate-50' }
    }
  }

  const isVertical = data.layout !== 'horizontal'

  return (
    <div className="bg-slate-50 rounded-xl p-6">
      {data.description && (
        <p className="text-sm text-slate-600 mb-6">{data.description}</p>
      )}

      <div className={isVertical ? 'relative' : 'overflow-x-auto'}>
        {isVertical && (
          <div className="absolute left-[11px] top-4 bottom-4 w-0.5 bg-slate-300" />
        )}

        <div className={isVertical ? 'space-y-4' : 'flex gap-4 pb-4'}>
          {data.events.map((event, index) => {
            const isExpanded = expandedEvents.has(event.id)
            const styles = getEventTypeStyles(event.type)
            const isDecision = event.type === 'decision' && event.decision

            return (
              <div
                key={event.id}
                className={isVertical ? 'relative pl-10' : 'flex-shrink-0 w-72'}
              >
                {/* Timeline dot */}
                {isVertical && (
                  <div className={`absolute left-0 top-2 w-6 h-6 rounded-full ${styles.dot} ring-4 ring-white flex items-center justify-center`}>
                    {isDecision && <span className="text-white text-xs">?</span>}
                  </div>
                )}

                {/* Event card */}
                <div
                  onClick={() => toggleEvent(event.id)}
                  className={`cursor-pointer rounded-xl border-2 ${styles.border} ${isExpanded ? styles.bg : 'bg-white'} transition-all hover:shadow-md`}
                >
                  <div className="p-4">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {event.date}
                      </span>
                      {isDecision && data.highlightDecisions && (
                        <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">
                          Decision Point
                        </span>
                      )}
                    </div>
                    <h5 className="font-semibold text-slate-900">{event.title}</h5>
                    
                    {isExpanded && (
                      <div className="mt-3 space-y-3">
                        <p className="text-sm text-slate-600">{event.description}</p>

                        {event.details && event.details.length > 0 && (
                          <div className="grid grid-cols-2 gap-2">
                            {event.details.map((detail, i) => (
                              <div key={i} className="bg-white/50 rounded p-2">
                                <div className="text-xs text-slate-500">{detail.label}</div>
                                <div className="text-sm font-medium text-slate-900">{detail.value}</div>
                              </div>
                            ))}
                          </div>
                        )}

                        {event.media && (
                          <div className="bg-white/60 p-3 rounded-lg">
                            {event.media.type === 'quote' ? (
                              <>
                                <p className="text-sm italic text-slate-700">&ldquo;{event.media.content}&rdquo;</p>
                                {event.media.attribution && (
                                  <p className="text-xs text-slate-500 mt-1">— {event.media.attribution}</p>
                                )}
                              </>
                            ) : event.media.type === 'stat' ? (
                              <div className="text-center">
                                <div className="text-2xl font-bold text-slate-900">{event.media.content}</div>
                                {event.media.attribution && (
                                  <div className="text-xs text-slate-500">{event.media.attribution}</div>
                                )}
                              </div>
                            ) : null}
                          </div>
                        )}

                        {event.decision && (
                          <div className="bg-purple-100 p-3 rounded-lg">
                            <p className="text-sm font-medium text-purple-900 mb-2">{event.decision.question}</p>
                            <div className="space-y-1">
                              {event.decision.options.map((opt, i) => (
                                <div
                                  key={i}
                                  className={`text-sm p-2 rounded ${
                                    opt === event.decision!.actualChoice
                                      ? 'bg-purple-500 text-white font-medium'
                                      : 'bg-white/50 text-purple-800'
                                  }`}
                                >
                                  {opt}
                                  {opt === event.decision!.actualChoice && (
                                    <span className="ml-2 text-xs opacity-75">← Actual choice</span>
                                  )}
                                </div>
                              ))}
                            </div>
                            {data.showAlternatives && event.decision.reasoning && (
                              <div className="mt-3 pt-2 border-t border-purple-200">
                                <p className="text-xs text-purple-800">{event.decision.reasoning}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ============== COMPARATIVE RANKER ==============

function ComparativeRanker({ data }: { data: ComparativeRankerData }) {
  const [userRanking, setUserRanking] = useState<string[]>([])
  const [showResults, setShowResults] = useState(false)
  const [draggedItem, setDraggedItem] = useState<string | null>(null)

  const unrankedItems = data.items.filter(item => !userRanking.includes(item.id))
  const rankedItems = userRanking.map(id => data.items.find(item => item.id === id)!)

  const addToRanking = (itemId: string) => {
    if (!userRanking.includes(itemId)) {
      setUserRanking(prev => [...prev, itemId])
    }
  }

  const removeFromRanking = (itemId: string) => {
    setUserRanking(prev => prev.filter(id => id !== itemId))
  }

  const moveInRanking = (itemId: string, direction: 'up' | 'down') => {
    setUserRanking(prev => {
      const index = prev.indexOf(itemId)
      if (index === -1) return prev
      
      const newIndex = direction === 'up' ? index - 1 : index + 1
      if (newIndex < 0 || newIndex >= prev.length) return prev
      
      const next = [...prev]
      ;[next[index], next[newIndex]] = [next[newIndex], next[index]]
      return next
    })
  }

  const getExpertRanking = () => {
    return [...data.items]
      .filter(item => item.expertRank !== undefined)
      .sort((a, b) => (a.expertRank || 0) - (b.expertRank || 0))
  }

  const calculateScore = () => {
    if (!data.showExpertRanking) return null
    
    let totalDiff = 0
    userRanking.forEach((itemId, userRank) => {
      const item = data.items.find(i => i.id === itemId)
      if (item?.expertRank !== undefined) {
        totalDiff += Math.abs((userRank + 1) - item.expertRank)
      }
    })
    
    const maxDiff = data.items.length * (data.items.length - 1) / 2
    const score = Math.max(0, 100 - (totalDiff / maxDiff) * 100)
    return score
  }

  const isComplete = userRanking.length === data.items.length

  return (
    <div className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-xl p-6">
      <p className="text-sm text-slate-600 mb-2">{data.prompt}</p>

      {data.criteria && data.criteria.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-xs text-slate-500">Consider:</span>
          {data.criteria.map(criterion => (
            <span key={criterion} className="px-2 py-0.5 bg-white/60 text-slate-600 text-xs rounded-full">
              {criterion}
            </span>
          ))}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Unranked items */}
        <div>
          <h4 className="text-sm font-semibold text-slate-700 mb-3">Available Options</h4>
          <div className="space-y-2">
            {unrankedItems.map(item => (
              <div
                key={item.id}
                onClick={() => addToRanking(item.id)}
                className="p-3 bg-white rounded-lg border border-slate-200 cursor-pointer hover:border-teal-300 hover:shadow-md transition-all"
              >
                <h5 className="font-medium text-slate-900">{item.title}</h5>
                <p className="text-xs text-slate-600 mt-1">{item.description}</p>
                {item.metrics && item.metrics.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {item.metrics.map((metric, i) => (
                      <span key={i} className="text-xs text-slate-500">
                        {metric.label}: <span className="font-medium">{metric.value}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {unrankedItems.length === 0 && (
              <p className="text-sm text-slate-400 italic p-3">All items ranked</p>
            )}
          </div>
        </div>

        {/* Ranked items */}
        <div>
          <h4 className="text-sm font-semibold text-slate-700 mb-3">Your Ranking</h4>
          <div className="space-y-2">
            {rankedItems.map((item, index) => (
              <div
                key={item.id}
                className="p-3 bg-teal-100 rounded-lg border-2 border-teal-300 relative group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium text-slate-900">{item.title}</h5>
                    <p className="text-xs text-slate-600 mt-0.5">{item.description}</p>
                  </div>
                  <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); moveInRanking(item.id, 'up') }}
                      disabled={index === 0}
                      className="p-1 hover:bg-teal-200 rounded disabled:opacity-30"
                    >
                      ↑
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); moveInRanking(item.id, 'down') }}
                      disabled={index === rankedItems.length - 1}
                      className="p-1 hover:bg-teal-200 rounded disabled:opacity-30"
                    >
                      ↓
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeFromRanking(item.id) }}
                      className="p-1 hover:bg-red-200 rounded text-red-600"
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {rankedItems.length === 0 && (
              <div className="p-6 border-2 border-dashed border-teal-300 rounded-lg text-center">
                <p className="text-sm text-teal-600">Click items on the left to add them to your ranking</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Submit / Results */}
      <div className="mt-6 pt-4 border-t border-teal-200">
        {!showResults ? (
          <button
            onClick={() => setShowResults(true)}
            disabled={!isComplete}
            className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isComplete ? 'See Expert Ranking' : `Rank all ${data.items.length} items to continue`}
          </button>
        ) : (
          <div className="space-y-4">
            {data.showExpertRanking && (
              <>
                <div className="flex items-center gap-4">
                  <div className="text-lg font-bold text-teal-700">
                    Score: {calculateScore()?.toFixed(0)}%
                  </div>
                  <button
                    onClick={() => { setShowResults(false); setUserRanking([]) }}
                    className="text-sm text-teal-600 hover:text-teal-800"
                  >
                    Try again
                  </button>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-slate-700 mb-3">Expert Ranking</h4>
                  <div className="space-y-2">
                    {getExpertRanking().map((item, index) => {
                      const userPosition = userRanking.indexOf(item.id) + 1
                      const difference = userPosition - (index + 1)
                      
                      return (
                        <div key={item.id} className="flex items-start gap-3 p-2 rounded-lg bg-slate-50">
                          <div className="w-6 h-6 bg-slate-700 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-slate-900">{item.title}</span>
                              {difference !== 0 && (
                                <span className={`text-xs px-1.5 py-0.5 rounded ${
                                  difference === 0 
                                    ? 'bg-emerald-100 text-emerald-700' 
                                    : 'bg-slate-100 text-slate-600'
                                }`}>
                                  You: #{userPosition}
                                </span>
                              )}
                            </div>
                            {data.showReasoning && item.expertReasoning && (
                              <p className="text-xs text-slate-600 mt-1">{item.expertReasoning}</p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
