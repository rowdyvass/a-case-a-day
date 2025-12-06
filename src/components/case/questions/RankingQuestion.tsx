'use client'

import { useState } from 'react'
import { Loader2, GripVertical, CheckCircle2, ArrowUp, ArrowDown } from 'lucide-react'
import { ExemplaryAnswer } from './ExemplaryAnswer'

interface RankingQuestionProps {
  questionId: string
  text: string
  options: string[]
  difficulty: string
  exemplaryAnswer?: string | null
  existingResponse?: {
    response: number[]
    score: number | null
    feedback: string | null
  } | null
  onSubmit: (questionId: string, response: number[]) => Promise<{
    score: number
    feedback: string
    isCorrect: boolean
    exemplaryAnswer: string
  }>
  isAuthenticated: boolean
  onRequireAuth: () => void
}

export function RankingQuestion({
  questionId,
  text,
  options,
  difficulty,
  exemplaryAnswer,
  existingResponse,
  onSubmit,
  isAuthenticated,
  onRequireAuth
}: RankingQuestionProps) {
  // Initialize order: if existingResponse, use that, otherwise use original order [0,1,2,...]
  const [order, setOrder] = useState<number[]>(
    existingResponse?.response ?? options.map((_, i) => i)
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<{
    score: number
    feedback: string
    isCorrect: boolean
    exemplaryAnswer: string
  } | null>(
    existingResponse && existingResponse.score !== null ? {
      score: existingResponse.score ?? 0,
      feedback: existingResponse.feedback ?? '',
      isCorrect: (existingResponse.score ?? 0) >= 10,
      exemplaryAnswer: exemplaryAnswer ?? ''
    } : null
  )
  const [showExemplary, setShowExemplary] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const isSubmitted = result !== null

  const moveItem = (fromIndex: number, direction: 'up' | 'down') => {
    if (isSubmitted) return
    
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1
    if (toIndex < 0 || toIndex >= order.length) return

    const newOrder = [...order]
    const [removed] = newOrder.splice(fromIndex, 1)
    newOrder.splice(toIndex, 0, removed)
    setOrder(newOrder)
  }

  const handleDragStart = (index: number) => {
    if (isSubmitted) return
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (isSubmitted || draggedIndex === null || draggedIndex === index) return
    
    const newOrder = [...order]
    const [removed] = newOrder.splice(draggedIndex, 1)
    newOrder.splice(index, 0, removed)
    setOrder(newOrder)
    setDraggedIndex(index)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      onRequireAuth()
      return
    }
    
    if (isSubmitting) return

    setIsSubmitting(true)
    try {
      const response = await onSubmit(questionId, order)
      setResult(response)
    } catch (error) {
      console.error('Failed to submit:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRetry = () => {
    setOrder(options.map((_, i) => i))
    setResult(null)
    setShowExemplary(false)
  }

  const difficultyColors = {
    easy: 'bg-emerald-100 text-emerald-700',
    medium: 'bg-amber-100 text-amber-700',
    hard: 'bg-red-100 text-red-700'
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Question Header */}
      <div className="px-6 py-5 border-b border-slate-100">
        <div className="flex items-center gap-2 mb-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${difficultyColors[difficulty as keyof typeof difficultyColors] || difficultyColors.medium}`}>
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </span>
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
            Ranking
          </span>
        </div>
        <p className="text-slate-900 font-medium leading-relaxed text-lg">
          {text}
        </p>
        {!isSubmitted && (
          <p className="text-sm text-slate-500 mt-2">
            Drag items or use the arrows to reorder them from most important (top) to least important (bottom).
          </p>
        )}
      </div>

      {/* Ranking Items */}
      <div className="p-6">
        <div className="space-y-2">
          {order.map((optionIndex, position) => (
            <div
              key={optionIndex}
              draggable={!isSubmitted}
              onDragStart={() => handleDragStart(position)}
              onDragOver={(e) => handleDragOver(e, position)}
              onDragEnd={handleDragEnd}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                isSubmitted
                  ? 'bg-slate-50 border-slate-200 cursor-default'
                  : draggedIndex === position
                  ? 'border-amber-400 bg-amber-50 shadow-lg scale-[1.02]'
                  : 'border-slate-200 bg-white hover:border-slate-300 cursor-grab active:cursor-grabbing'
              }`}
            >
              {/* Rank Number */}
              <span className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                isSubmitted
                  ? 'bg-slate-200 text-slate-600'
                  : 'bg-amber-100 text-amber-700'
              }`}>
                {position + 1}
              </span>

              {/* Drag Handle */}
              {!isSubmitted && (
                <GripVertical className="h-5 w-5 text-slate-400 flex-shrink-0" />
              )}

              {/* Option Text */}
              <span className="flex-1 text-slate-700 font-medium">
                {options[optionIndex]}
              </span>

              {/* Move Buttons */}
              {!isSubmitted && (
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => moveItem(position, 'up')}
                    disabled={position === 0}
                    className={`p-1 rounded ${
                      position === 0
                        ? 'text-slate-200 cursor-not-allowed'
                        : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => moveItem(position, 'down')}
                    disabled={position === order.length - 1}
                    className={`p-1 rounded ${
                      position === order.length - 1
                        ? 'text-slate-200 cursor-not-allowed'
                        : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Result */}
      {isSubmitted && result && (
        <div className={`px-6 py-4 border-t ${result.isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
          <div className="flex items-start gap-3">
            <div className={`flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center ${
              result.isCorrect ? 'border-emerald-500 text-emerald-600' : 'border-amber-500 text-amber-600'
            }`}>
              <span className="text-lg font-bold">{result.score}/10</span>
            </div>
            <div>
              <p className={`font-semibold mb-1 ${result.isCorrect ? 'text-emerald-800' : 'text-amber-800'}`}>
                {result.isCorrect ? 'Perfect ranking!' : `${result.score * 10}% correct`}
              </p>
              <p className="text-sm text-slate-600">{result.feedback}</p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
        <div>
          {isSubmitted && (
            <button
              onClick={() => setShowExemplary(!showExemplary)}
              className="text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors"
            >
              {showExemplary ? 'Hide' : 'Show'} Correct Order
            </button>
          )}
        </div>
        <div className="flex gap-3">
          {isSubmitted ? (
            <button
              onClick={handleRetry}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
            >
              Try Again
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                isSubmitting
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-amber-500 text-white hover:bg-amber-600 shadow-sm'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Check Ranking
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Exemplary Answer */}
      {showExemplary && result && (
        <ExemplaryAnswer answer={result.exemplaryAnswer || exemplaryAnswer || ''} />
      )}
    </div>
  )
}

