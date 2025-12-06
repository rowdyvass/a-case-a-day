'use client'

import { useState } from 'react'
import { Loader2, Send, RotateCcw, Star, TrendingUp, TrendingDown } from 'lucide-react'
import { ExemplaryAnswer } from './ExemplaryAnswer'

interface FreeTextQuestionProps {
  questionId: string
  text: string
  difficulty: string
  exemplaryAnswer?: string | null
  existingResponse?: {
    response: string
    score: number | null
    feedback: string | null
  } | null
  onSubmit: (questionId: string, response: string) => Promise<{
    score: number
    feedback: string
    exemplaryAnswer: string
  }>
  isAuthenticated: boolean
  onRequireAuth: () => void
}

export function FreeTextQuestion({
  questionId,
  text,
  difficulty,
  exemplaryAnswer,
  existingResponse,
  onSubmit,
  isAuthenticated,
  onRequireAuth
}: FreeTextQuestionProps) {
  const [response, setResponse] = useState(existingResponse?.response ?? '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<{
    score: number
    feedback: string
    exemplaryAnswer: string
  } | null>(
    existingResponse && existingResponse.score !== null ? {
      score: existingResponse.score ?? 0,
      feedback: existingResponse.feedback ?? '',
      exemplaryAnswer: exemplaryAnswer ?? ''
    } : null
  )
  const [showExemplary, setShowExemplary] = useState(false)

  const isSubmitted = result !== null
  const minLength = 50 // Minimum characters for a valid response

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      onRequireAuth()
      return
    }
    
    if (response.length < minLength || isSubmitting) return

    setIsSubmitting(true)
    try {
      const submitResult = await onSubmit(questionId, response)
      setResult(submitResult)
    } catch (error) {
      console.error('Failed to submit:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRetry = () => {
    setResponse('')
    setResult(null)
    setShowExemplary(false)
  }

  const difficultyColors = {
    easy: 'bg-emerald-100 text-emerald-700',
    medium: 'bg-amber-100 text-amber-700',
    hard: 'bg-red-100 text-red-700'
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-emerald-600'
    if (score >= 6) return 'text-amber-600'
    return 'text-red-600'
  }

  const getScoreBg = (score: number) => {
    if (score >= 8) return 'bg-emerald-50 border-emerald-200'
    if (score >= 6) return 'bg-amber-50 border-amber-200'
    return 'bg-red-50 border-red-200'
  }

  const getScoreIcon = (score: number) => {
    if (score >= 8) return <TrendingUp className="h-5 w-5 text-emerald-500" />
    if (score >= 6) return <Star className="h-5 w-5 text-amber-500" />
    return <TrendingDown className="h-5 w-5 text-red-500" />
  }

  const getScoreLabel = (score: number) => {
    if (score >= 9) return 'Excellent'
    if (score >= 8) return 'Very Good'
    if (score >= 7) return 'Good'
    if (score >= 6) return 'Satisfactory'
    if (score >= 5) return 'Needs Improvement'
    return 'Review Required'
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Question Header */}
      <div className="px-6 py-5 border-b border-slate-100">
        <div className="flex items-center gap-2 mb-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${difficultyColors[difficulty as keyof typeof difficultyColors] || difficultyColors.medium}`}>
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </span>
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-violet-100 text-violet-700">
            Free Response
          </span>
        </div>
        <p className="text-slate-900 font-medium leading-relaxed text-lg">
          {text}
        </p>
      </div>

      {/* Response Area */}
      <div className="p-6">
        <div className="relative">
          <textarea
            value={response}
            onChange={(e) => !isSubmitted && setResponse(e.target.value)}
            placeholder="Write your analysis here. Consider the key factors presented in the case and apply relevant frameworks to develop your response..."
            rows={8}
            disabled={isSubmitted || isSubmitting}
            className={`w-full px-4 py-3 rounded-xl border-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 resize-none transition-all ${
              isSubmitted 
                ? 'bg-slate-50 border-slate-200 cursor-default' 
                : 'bg-white border-slate-200'
            }`}
          />
          {!isSubmitted && (
            <div className="absolute bottom-3 right-3 text-xs text-slate-400">
              {response.length} / {minLength} min characters
            </div>
          )}
        </div>

        {!isSubmitted && (
          <p className="text-xs text-slate-500 mt-3">
            Your response will be graded by AI based on analysis depth, framework application, and use of case evidence.
          </p>
        )}
      </div>

      {/* Result */}
      {isSubmitted && result && (
        <div className={`px-6 py-5 border-t ${getScoreBg(result.score)}`}>
          <div className="flex items-start gap-4">
            {/* Score Circle */}
            <div className="flex-shrink-0">
              <div className={`w-16 h-16 rounded-full border-4 flex flex-col items-center justify-center ${getScoreColor(result.score)} border-current`}>
                <span className="text-2xl font-bold">{result.score}</span>
                <span className="text-[10px] uppercase tracking-wide">/ 10</span>
              </div>
            </div>
            
            {/* Feedback */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                {getScoreIcon(result.score)}
                <span className={`font-semibold ${getScoreColor(result.score)}`}>
                  {getScoreLabel(result.score)}
                </span>
              </div>
              <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                {result.feedback}
              </div>
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
              {showExemplary ? 'Hide' : 'Show'} Exemplary Answer
            </button>
          )}
        </div>
        <div className="flex gap-3">
          {isSubmitted ? (
            <button
              onClick={handleRetry}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Try Again
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={response.length < minLength || isSubmitting}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                response.length < minLength || isSubmitting
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-amber-500 text-white hover:bg-amber-600 shadow-sm'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Grading...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Submit for Grading
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

