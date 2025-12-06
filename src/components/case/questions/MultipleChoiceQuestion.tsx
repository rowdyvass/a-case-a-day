'use client'

import { useState } from 'react'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { ExemplaryAnswer } from './ExemplaryAnswer'

interface MultipleChoiceQuestionProps {
  questionId: string
  text: string
  options: string[]
  difficulty: string
  exemplaryAnswer?: string | null
  existingResponse?: {
    response: number
    score: number | null
    feedback: string | null
  } | null
  onSubmit: (questionId: string, response: number) => Promise<{
    score: number
    feedback: string
    isCorrect: boolean
    exemplaryAnswer: string
  }>
  isAuthenticated: boolean
  onRequireAuth: () => void
}

export function MultipleChoiceQuestion({
  questionId,
  text,
  options,
  difficulty,
  exemplaryAnswer,
  existingResponse,
  onSubmit,
  isAuthenticated,
  onRequireAuth
}: MultipleChoiceQuestionProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(
    existingResponse?.response ?? null
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

  const isSubmitted = result !== null

  const handleSelect = (index: number) => {
    if (isSubmitted) return
    setSelectedIndex(index)
  }

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      onRequireAuth()
      return
    }
    
    if (selectedIndex === null || isSubmitting) return

    setIsSubmitting(true)
    try {
      const response = await onSubmit(questionId, selectedIndex)
      setResult(response)
    } catch (error) {
      console.error('Failed to submit:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRetry = () => {
    setSelectedIndex(null)
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
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
            Multiple Choice
          </span>
        </div>
        <p className="text-slate-900 font-medium leading-relaxed text-lg">
          {text}
        </p>
      </div>

      {/* Options */}
      <div className="p-6 space-y-3">
        {options.map((option, index) => {
          let styles = 'border-slate-200 bg-white hover:border-amber-300 hover:bg-amber-50/50'
          let iconElement = null

          if (isSubmitted) {
            if (result?.isCorrect && index === selectedIndex) {
              styles = 'border-emerald-500 bg-emerald-50'
              iconElement = <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
            } else if (!result?.isCorrect && index === selectedIndex) {
              styles = 'border-red-400 bg-red-50'
              iconElement = <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            } else {
              styles = 'border-slate-200 bg-slate-50/50 opacity-60'
            }
          } else if (index === selectedIndex) {
            styles = 'border-amber-500 bg-amber-50 ring-2 ring-amber-200'
          }

          return (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              disabled={isSubmitted || isSubmitting}
              className={`w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all flex items-center gap-3 ${styles} ${isSubmitted ? 'cursor-default' : 'cursor-pointer'}`}
            >
              <span className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-all ${
                isSubmitted && result?.isCorrect && index === selectedIndex
                  ? 'bg-emerald-500 border-emerald-500 text-white'
                  : isSubmitted && !result?.isCorrect && index === selectedIndex
                  ? 'bg-red-500 border-red-500 text-white'
                  : selectedIndex === index
                  ? 'bg-amber-500 border-amber-500 text-white'
                  : 'border-slate-300 text-slate-500'
              }`}>
                {String.fromCharCode(65 + index)}
              </span>
              <span className={`flex-1 ${isSubmitted && index !== selectedIndex ? 'text-slate-400' : 'text-slate-700'}`}>
                {option}
              </span>
              {iconElement}
            </button>
          )
        })}
      </div>

      {/* Result */}
      {isSubmitted && result && (
        <div className={`px-6 py-4 border-t ${result.isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
          <div className="flex items-start gap-3">
            {result.isCorrect ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p className={`font-semibold mb-1 ${result.isCorrect ? 'text-emerald-800' : 'text-amber-800'}`}>
                {result.isCorrect ? 'Correct!' : 'Not quite right'}
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
              {showExemplary ? 'Hide' : 'Show'} Explanation
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
              disabled={selectedIndex === null || isSubmitting}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                selectedIndex === null || isSubmitting
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-amber-500 text-white hover:bg-amber-600 shadow-sm'
              }`}
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSubmitting ? 'Checking...' : 'Check Answer'}
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

