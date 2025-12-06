'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useExhibitPalette } from '../ExhibitContext'
import type {
  CustomExhibitTemplate,
  DecisionSimulatorTemplate,
  ScenarioBuilderTemplate,
  RevealCardsTemplate,
  ComparativeRankerTemplate,
  WhatIfCalculatorTemplate
} from '@/lib/exhibits/custom-templates-simple'
import { validateTemplate } from '@/lib/exhibits/custom-templates-simple'

/**
 * SimpleCustomExhibit
 * 
 * NYT-inspired interactive exhibits with:
 * - Smooth animations via Framer Motion
 * - Brand-derived color theming
 * - Innovative micro-interactions
 * - Editorial-quality typography
 */

interface SimpleCustomExhibitProps {
  data: unknown
}

export function SimpleCustomExhibit({ data }: SimpleCustomExhibitProps) {
  const validation = validateTemplate(data)
  const palette = useExhibitPalette()

  if (!validation.valid) {
    return (
      <div 
        className="rounded-xl p-4"
        style={{ 
          backgroundColor: palette.negativeLight,
          borderColor: palette.negative,
          border: '1px solid'
        }}
      >
        <p className="text-sm font-medium" style={{ color: palette.negative }}>
          Invalid custom exhibit
        </p>
        <p className="text-xs mt-1 opacity-80">{validation.error}</p>
      </div>
    )
  }

  const template = data as CustomExhibitTemplate

  switch (template.templateType) {
    case 'decision_simulator':
      return <DecisionSimulator data={template} />
    case 'scenario_builder':
      return <ScenarioBuilder data={template} />
    case 'reveal_cards':
      return <RevealCards data={template} />
    case 'comparative_ranker':
      return <ComparativeRanker data={template} />
    case 'what_if_calculator':
      return <WhatIfCalculator data={template} />
    default:
      return (
        <div className="exhibit-unknown">
          Unknown template type
        </div>
      )
  }
}

// ============== DECISION SIMULATOR ==============

function DecisionSimulator({ data }: { data: DecisionSimulatorTemplate }) {
  const palette = useExhibitPalette()
  const [currentDecision, setCurrentDecision] = useState(0)
  const [choices, setChoices] = useState<number[]>([])
  const [showOutcome, setShowOutcome] = useState(false)

  const decision = data.decisions[currentDecision]
  const isComplete = currentDecision >= data.decisions.length

  const handleChoice = (optionIndex: number) => {
    setChoices([...choices, optionIndex])
    if (currentDecision < data.decisions.length - 1) {
      setCurrentDecision(currentDecision + 1)
    } else {
      setShowOutcome(true)
    }
  }

  const restart = () => {
    setCurrentDecision(0)
    setChoices([])
    setShowOutcome(false)
  }

  if (showOutcome || isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="decision-simulator space-y-4"
      >
        <div className="rounded-xl p-5 bg-gradient-to-b from-slate-50 to-white border border-slate-200">
          <h4 className="font-serif font-semibold text-slate-900 mb-4">Your Decisions</h4>
          <div className="space-y-3">
            {data.decisions.map((d, i) => {
              const choice = d.options[choices[i]]
              return (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="pb-3 last:pb-0 last:border-0 border-b border-slate-100"
                >
                  <p className="text-sm text-slate-600">{d.question}</p>
                  <p className="text-sm font-medium text-slate-900 mt-1 flex items-center gap-2">
                    <span 
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: palette.primary }}
                    />
                    {choice?.label}
                  </p>
                  <p className={`text-xs mt-1 ${
                    choice?.impact === 'positive' ? 'text-emerald-600' :
                    choice?.impact === 'negative' ? 'text-red-600' : 'text-amber-600'
                  }`}>
                    {choice?.outcome}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>

        {data.realOutcome && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl p-5"
            style={{ 
              backgroundColor: palette.primaryLight,
              borderColor: palette.primary,
              borderWidth: 1
            }}
          >
            <h4 className="font-semibold mb-2" style={{ color: palette.primary }}>
              What Actually Happened
            </h4>
            <p className="text-sm leading-relaxed" style={{ color: palette.text }}>
              {data.realOutcome}
            </p>
          </motion.div>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={restart}
          className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium transition-colors"
        >
          Try Different Choices
        </motion.button>
      </motion.div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="decision-simulator space-y-4"
    >
      {/* Context card */}
      <div 
        className="decision-context rounded-xl p-5"
        style={{ 
          background: `linear-gradient(135deg, ${palette.primary} 0%, ${palette.primaryDark} 100%)`
        }}
      >
        <p className="decision-role text-white/60">{data.role}</p>
        <p className="decision-scenario text-white/90">{data.scenario}</p>
      </div>

      {/* Decision card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentDecision}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="decision-card rounded-xl border-2 p-5"
          style={{ borderColor: palette.border }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span 
              className="decision-progress"
              style={{ 
                backgroundColor: palette.primaryLight,
                color: palette.primary
              }}
            >
              Decision {currentDecision + 1} of {data.decisions.length}
            </span>
          </div>
          
          <h4 className="decision-question font-serif text-lg font-semibold text-slate-900">
            {decision.question}
          </h4>
          {decision.context && (
            <p className="text-sm text-slate-600 mt-2">{decision.context}</p>
          )}

          <div className="decision-options space-y-2.5 mt-4">
            {decision.options.map((option, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.01, x: 4 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleChoice(i)}
                className="decision-option w-full text-left p-4 rounded-xl border-2 transition-all"
                style={{ 
                  borderColor: palette.border,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = palette.primary
                  e.currentTarget.style.backgroundColor = palette.primaryLight
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = palette.border
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                <span className="decision-option-label font-medium text-slate-900">
                  {option.label}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}

// ============== SCENARIO BUILDER ==============

function ScenarioBuilder({ data }: { data: ScenarioBuilderTemplate }) {
  const palette = useExhibitPalette()
  const [selections, setSelections] = useState<Set<string>>(new Set())
  const [showFeedback, setShowFeedback] = useState(false)

  const toggleSelection = (label: string) => {
    const newSelections = new Set(selections)
    if (newSelections.has(label)) {
      newSelections.delete(label)
    } else {
      if (!data.maxSelections || newSelections.size < data.maxSelections) {
        newSelections.add(label)
      }
    }
    setSelections(newSelections)
  }

  const getFeedback = () => {
    if (!data.feedbackRules) return []
    return data.feedbackRules.filter(rule =>
      rule.ifSelected.every(item => selections.has(item))
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="scenario-builder space-y-5"
    >
      <div 
        className="scenario-prompt rounded-xl p-4"
        style={{ backgroundColor: palette.backgroundAlt }}
      >
        <p className="text-sm text-slate-700">{data.prompt}</p>
        {data.maxSelections && (
          <p className="text-xs text-slate-500 mt-2">
            Select up to {data.maxSelections} options 
            <span 
              className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium"
              style={{ 
                backgroundColor: palette.primaryLight,
                color: palette.primary
              }}
            >
              {selections.size} selected
            </span>
          </p>
        )}
      </div>

      {data.categories.map((category, catIndex) => (
        <motion.div 
          key={catIndex}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: catIndex * 0.1 }}
          className="scenario-category rounded-xl border overflow-hidden"
          style={{ borderColor: palette.border }}
        >
          <div 
            className="scenario-category-header px-4 py-3"
            style={{ backgroundColor: palette.backgroundAlt }}
          >
            <h4 className="font-semibold text-sm text-slate-700">{category.name}</h4>
          </div>
          <div className="scenario-options p-3 space-y-2">
            {category.options.map((option, optIndex) => {
              const isSelected = selections.has(option.label)
              return (
                <motion.button
                  key={optIndex}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => toggleSelection(option.label)}
                  className={`scenario-option w-full text-left p-4 rounded-xl border-2 transition-all ${
                    isSelected ? 'selected' : ''
                  }`}
                  style={{
                    borderColor: isSelected ? palette.primary : 'transparent',
                    backgroundColor: isSelected ? palette.primaryLight : palette.backgroundAlt
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div 
                      className="scenario-option-check"
                      style={{
                        borderColor: isSelected ? palette.primary : palette.border,
                        backgroundColor: isSelected ? palette.primary : 'transparent'
                      }}
                    >
                      {isSelected && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="scenario-option-content flex-1">
                      <p className="scenario-option-label font-medium text-slate-900 text-sm">
                        {option.label}
                      </p>
                      <p className="scenario-option-desc text-xs text-slate-600 mt-0.5">
                        {option.description}
                      </p>
                      {option.tradeoff && (
                        <p 
                          className="text-xs mt-1.5"
                          style={{ color: palette.neutral }}
                        >
                          ⚖️ {option.tradeoff}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </motion.div>
      ))}

      {selections.size > 0 && (
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowFeedback(true)}
          className="w-full py-3 text-white rounded-xl font-medium transition-colors"
          style={{ backgroundColor: palette.primary }}
        >
          Evaluate My Strategy
        </motion.button>
      )}

      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-3"
          >
            <div 
              className="rounded-xl p-4 text-white"
              style={{ 
                background: `linear-gradient(135deg, ${palette.primary} 0%, ${palette.primaryDark} 100%)`
              }}
            >
              <h4 className="font-semibold mb-2">Your Strategy</h4>
              <ul className="text-sm space-y-1">
                {Array.from(selections).map((s, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-white/60" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            
            {getFeedback().map((fb, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-4 rounded-xl border"
                style={{
                  backgroundColor: fb.type === 'success' ? palette.positiveLight :
                    fb.type === 'warning' ? palette.neutralLight : palette.primaryLight,
                  borderColor: fb.type === 'success' ? palette.positive :
                    fb.type === 'warning' ? palette.neutral : palette.primary
                }}
              >
                <p 
                  className="text-sm"
                  style={{
                    color: fb.type === 'success' ? palette.positive :
                      fb.type === 'warning' ? palette.neutral : palette.primary
                  }}
                >
                  {fb.message}
                </p>
              </motion.div>
            ))}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { setSelections(new Set()); setShowFeedback(false) }}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium"
            >
              Start Over
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ============== REVEAL CARDS ==============

function RevealCards({ data }: { data: RevealCardsTemplate }) {
  const palette = useExhibitPalette()
  const [revealed, setRevealed] = useState<Set<number>>(new Set())

  const toggleReveal = (index: number) => {
    const newRevealed = new Set(revealed)
    if (newRevealed.has(index)) {
      newRevealed.delete(index)
    } else {
      newRevealed.add(index)
    }
    setRevealed(newRevealed)
  }

  const allRevealed = revealed.size === data.cards.length

  const getSentimentStyles = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return { 
          bg: palette.positiveLight, 
          border: palette.positive,
          text: palette.positive
        }
      case 'negative':
        return { 
          bg: palette.negativeLight, 
          border: palette.negative,
          text: palette.negative
        }
      default:
        return { 
          bg: palette.backgroundAlt, 
          border: palette.border,
          text: palette.text
        }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <p className="text-sm text-slate-600">{data.prompt}</p>

      <div className="reveal-cards-grid grid grid-cols-2 gap-4">
        {data.cards.map((card, index) => {
          const isRevealed = revealed.has(index)
          const styles = getSentimentStyles(card.sentiment)
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="reveal-card cursor-pointer"
              style={{ perspective: 1000 }}
              onClick={() => toggleReveal(index)}
            >
              <motion.div
                className="reveal-card-inner relative w-full min-h-[140px]"
                animate={{ rotateY: isRevealed ? 180 : 0 }}
                transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Front */}
                <div 
                  className="reveal-card-front absolute inset-0 rounded-xl p-4 flex flex-col items-center justify-center text-center"
                  style={{ 
                    backfaceVisibility: 'hidden',
                    background: `linear-gradient(135deg, ${palette.primary} 0%, ${palette.primaryDark} 100%)`
                  }}
                >
                  <p className="font-semibold text-white">{card.frontLabel}</p>
                  {card.frontHint && (
                    <p className="reveal-card-hint text-xs text-white/60 mt-1">
                      {card.frontHint}
                    </p>
                  )}
                  <p className="text-xs text-white/40 mt-3">Click to reveal</p>
                </div>

                {/* Back */}
                <div 
                  className="reveal-card-back absolute inset-0 rounded-xl p-4 border-2"
                  style={{ 
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    backgroundColor: styles.bg,
                    borderColor: styles.border
                  }}
                >
                  <p 
                    className="font-semibold text-sm mb-2"
                    style={{ color: styles.text }}
                  >
                    {card.backTitle}
                  </p>
                  <p className="text-xs text-slate-600">
                    {card.backContent}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )
        })}
      </div>

      <AnimatePresence>
        {allRevealed && data.discussionPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="rounded-xl p-4 border"
            style={{ 
              backgroundColor: palette.primaryLight,
              borderColor: palette.primary
            }}
          >
            <p className="text-sm font-medium" style={{ color: palette.primary }}>
              💭 Discussion
            </p>
            <p className="text-sm text-slate-700 mt-1">{data.discussionPrompt}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ============== COMPARATIVE RANKER ==============

function ComparativeRanker({ data }: { data: ComparativeRankerTemplate }) {
  const palette = useExhibitPalette()
  const [userRanking, setUserRanking] = useState<string[]>([])
  const [showExpert, setShowExpert] = useState(false)
  
  const unranked = data.items.filter(item => !userRanking.includes(item.label))

  const addToRanking = (label: string) => {
    setUserRanking([...userRanking, label])
  }

  const removeFromRanking = (index: number) => {
    const newRanking = [...userRanking]
    newRanking.splice(index, 1)
    setUserRanking(newRanking)
  }

  const moveInRanking = (index: number, direction: 'up' | 'down') => {
    const newRanking = [...userRanking]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex >= 0 && newIndex < newRanking.length) {
      [newRanking[index], newRanking[newIndex]] = [newRanking[newIndex], newRanking[index]]
      setUserRanking(newRanking)
    }
  }

  const getScore = () => {
    let score = 0
    userRanking.forEach((label, userRank) => {
      const item = data.items.find(i => i.label === label)
      if (item) {
        const diff = Math.abs((userRank + 1) - item.expertRank)
        if (diff === 0) score += 2
        else if (diff === 1) score += 1
      }
    })
    return score
  }

  const maxScore = data.items.length * 2

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="ranker-wrapper space-y-5"
    >
      <p className="ranker-prompt text-sm text-slate-600">{data.prompt}</p>

      <div className="ranker-columns grid gap-6 md:grid-cols-2">
        {/* Unranked */}
        <div>
          <p className="ranker-column-title text-xs text-slate-500 uppercase tracking-wide mb-3">
            Click to add to ranking:
          </p>
          <div className="ranker-items space-y-2">
            <AnimatePresence>
              {unranked.map((item, i) => (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ delay: i * 0.03 }}
                  whileHover={{ scale: 1.01, x: 4 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => addToRanking(item.label)}
                  className="ranker-item ranker-item-unranked w-full text-left p-3 rounded-xl"
                  style={{ borderColor: palette.border }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = palette.primary
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = palette.border
                  }}
                >
                  <p className="ranker-item-title font-medium text-slate-900 text-sm">
                    {item.label}
                  </p>
                  <p className="ranker-item-desc text-xs text-slate-600">
                    {item.description}
                  </p>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Ranked */}
        <div>
          <p className="ranker-column-title text-xs text-slate-500 uppercase tracking-wide mb-3">
            Your ranking:
          </p>
          <div className="ranker-items space-y-2">
            <AnimatePresence>
              {userRanking.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="ranker-dropzone p-6 border-2 border-dashed rounded-xl text-center"
                  style={{ borderColor: palette.border }}
                >
                  <p className="text-sm text-slate-400">
                    Click items on the left to rank them
                  </p>
                </motion.div>
              ) : (
                userRanking.map((label, index) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    layout
                    className="ranker-item ranker-item-ranked flex items-center gap-3 p-3 rounded-xl border-2 group"
                    style={{ 
                      borderColor: palette.primary,
                      backgroundColor: palette.primaryLight
                    }}
                  >
                    <span 
                      className="ranker-item-rank w-8 h-8 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
                      style={{ backgroundColor: palette.primary }}
                    >
                      {index + 1}
                    </span>
                    <div className="ranker-item-content flex-1">
                      <p className="ranker-item-title font-medium text-slate-900 text-sm">
                        {label}
                      </p>
                    </div>
                    <div className="ranker-item-actions flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => { e.stopPropagation(); moveInRanking(index, 'up') }}
                        disabled={index === 0}
                        className="p-1 hover:bg-white/50 rounded disabled:opacity-30 text-slate-600"
                      >
                        ↑
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); moveInRanking(index, 'down') }}
                        disabled={index === userRanking.length - 1}
                        className="p-1 hover:bg-white/50 rounded disabled:opacity-30 text-slate-600"
                      >
                        ↓
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); removeFromRanking(index) }}
                        className="p-1 hover:bg-red-100 rounded text-red-500"
                      >
                        ×
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Submit */}
      {userRanking.length === data.items.length && !showExpert && (
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowExpert(true)}
          className="w-full py-3 text-white rounded-xl font-medium"
          style={{ backgroundColor: palette.primary }}
        >
          Compare to {data.expertLabel || 'Expert Ranking'}
        </motion.button>
      )}

      {/* Results */}
      <AnimatePresence>
        {showExpert && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-4"
          >
            <div 
              className="ranker-score rounded-xl p-4"
              style={{ 
                background: `linear-gradient(135deg, ${palette.primary} 0%, ${palette.primaryDark} 100%)`
              }}
            >
              <div className="flex justify-between items-center text-white">
                <span className="text-lg font-bold">Score: {getScore()}/{maxScore}</span>
                <span className="text-xs bg-white/20 px-2 py-1 rounded">
                  {Math.round((getScore() / maxScore) * 100)}% match
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-slate-500 uppercase tracking-wide">
                {data.expertLabel || 'Expert Ranking'}:
              </p>
              {[...data.items]
                .sort((a, b) => a.expertRank - b.expertRank)
                .map((item, index) => {
                  const userRank = userRanking.indexOf(item.label) + 1
                  const isMatch = userRank === item.expertRank
                  
                  return (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-3 rounded-xl border"
                      style={{
                        backgroundColor: isMatch ? palette.positiveLight : palette.backgroundAlt,
                        borderColor: isMatch ? palette.positive : palette.border
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <span 
                          className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold text-white"
                          style={{ backgroundColor: isMatch ? palette.positive : palette.textMuted }}
                        >
                          {item.expertRank}
                        </span>
                        <div className="flex-1">
                          <p className="font-medium text-slate-900 text-sm">{item.label}</p>
                          {item.expertReasoning && (
                            <p className="text-xs text-slate-600 mt-1">{item.expertReasoning}</p>
                          )}
                        </div>
                        <span className="text-xs text-slate-500">You: #{userRank}</span>
                      </div>
                    </motion.div>
                  )
                })}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { setUserRanking([]); setShowExpert(false) }}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium"
            >
              Try Again
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ============== WHAT-IF CALCULATOR ==============

function WhatIfCalculator({ data }: { data: WhatIfCalculatorTemplate }) {
  const palette = useExhibitPalette()
  const [values, setValues] = useState<Record<string, number>>(
    Object.fromEntries(data.variables.map(v => [v.label, v.default]))
  )

  const total = Object.values(values).reduce((sum, val) => sum + val, 0)

  const getOutcome = () => {
    for (const outcome of data.outcomes) {
      if (outcome.condition === 'total_above' && outcome.threshold && total > outcome.threshold) {
        return outcome
      }
      if (outcome.condition === 'total_below' && outcome.threshold && total < outcome.threshold) {
        return outcome
      }
    }
    return data.outcomes.find(o => o.condition === 'default') || data.outcomes[0]
  }

  const outcome = getOutcome()

  const getOutcomeStyles = (impact?: string) => {
    switch (impact) {
      case 'positive':
        return { bg: palette.positiveLight, border: palette.positive, text: palette.positive }
      case 'negative':
        return { bg: palette.negativeLight, border: palette.negative, text: palette.negative }
      default:
        return { bg: palette.neutralLight, border: palette.neutral, text: palette.neutral }
    }
  }

  const outcomeStyles = getOutcomeStyles(outcome.impact)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="calculator-wrapper space-y-6"
    >
      <p className="calculator-scenario text-sm text-slate-600">{data.scenario}</p>

      <div className="space-y-5">
        {data.variables.map((variable, i) => {
          const value = values[variable.label]
          const percent = ((value - variable.min) / (variable.max - variable.min)) * 100
          
          return (
            <motion.div
              key={variable.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="calculator-slider space-y-2"
            >
              <div className="calculator-slider-header flex justify-between text-sm">
                <span className="calculator-slider-label text-slate-700">{variable.label}</span>
                <motion.span 
                  key={value}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="calculator-slider-value font-semibold text-slate-900 tabular-nums"
                >
                  {variable.unit}{value.toLocaleString()}
                </motion.span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min={variable.min}
                  max={variable.max}
                  step={variable.step || 1}
                  value={value}
                  onChange={(e) => setValues({
                    ...values,
                    [variable.label]: parseFloat(e.target.value)
                  })}
                  className="calculator-input w-full h-2 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, ${palette.primary} ${percent}%, ${palette.border} ${percent}%)`
                  }}
                />
              </div>
              <div className="calculator-range flex justify-between text-xs text-slate-400">
                <span>{variable.unit}{variable.min.toLocaleString()}</span>
                <span>{variable.unit}{variable.max.toLocaleString()}</span>
              </div>
            </motion.div>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={outcome.title}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className="calculator-outcome p-5 rounded-xl border-2"
          style={{
            backgroundColor: outcomeStyles.bg,
            borderColor: outcomeStyles.border
          }}
        >
          <div className="calculator-outcome-header flex items-center gap-2 mb-2">
            <span className="calculator-outcome-icon text-lg">
              {outcome.impact === 'positive' ? '✓' : outcome.impact === 'negative' ? '⚠' : '•'}
            </span>
            <h4 
              className="calculator-outcome-title font-semibold"
              style={{ color: outcomeStyles.text }}
            >
              {outcome.title}
            </h4>
          </div>
          <p 
            className="calculator-outcome-desc text-sm"
            style={{ color: outcomeStyles.text }}
          >
            {outcome.description}
          </p>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}
