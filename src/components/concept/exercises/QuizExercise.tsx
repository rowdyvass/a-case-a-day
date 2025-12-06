'use client'

import { useState } from 'react'
import { CheckCircle2, XCircle, HelpCircle, Lightbulb } from 'lucide-react'

interface QuizExerciseProps {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export function QuizExercise({ question, options, correctIndex, explanation }: QuizExerciseProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)

  const handleSelect = (index: number) => {
    if (showResult) return
    setSelectedIndex(index)
  }

  const handleSubmit = () => {
    if (selectedIndex === null) return
    setShowResult(true)
  }

  const handleReset = () => {
    setSelectedIndex(null)
    setShowResult(false)
  }

  const isCorrect = selectedIndex === correctIndex

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Question Header */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 border-b border-slate-200">
        <div className="flex items-start gap-3">
          <HelpCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="font-medium text-slate-800">{question}</p>
        </div>
      </div>

      {/* Options */}
      <div className="p-6 space-y-3">
        {options.map((option, index) => {
          let styles = 'border-slate-200 bg-white hover:border-amber-300 hover:bg-amber-50'
          
          if (showResult) {
            if (index === correctIndex) {
              styles = 'border-emerald-500 bg-emerald-50'
            } else if (index === selectedIndex) {
              styles = 'border-red-500 bg-red-50'
            } else {
              styles = 'border-slate-200 bg-slate-50 opacity-50'
            }
          } else if (index === selectedIndex) {
            styles = 'border-amber-500 bg-amber-50 ring-2 ring-amber-200'
          }

          return (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              disabled={showResult}
              className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all flex items-center gap-3 ${styles}`}
            >
              <span className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-semibold ${
                showResult && index === correctIndex
                  ? 'bg-emerald-500 border-emerald-500 text-white'
                  : showResult && index === selectedIndex
                  ? 'bg-red-500 border-red-500 text-white'
                  : selectedIndex === index
                  ? 'bg-amber-500 border-amber-500 text-white'
                  : 'border-slate-300 text-slate-500'
              }`}>
                {String.fromCharCode(65 + index)}
              </span>
              <span className={`${showResult && index !== correctIndex && index !== selectedIndex ? 'text-slate-400' : 'text-slate-700'}`}>
                {option}
              </span>
              {showResult && index === correctIndex && (
                <CheckCircle2 className="h-5 w-5 text-emerald-500 ml-auto" />
              )}
              {showResult && index === selectedIndex && index !== correctIndex && (
                <XCircle className="h-5 w-5 text-red-500 ml-auto" />
              )}
            </button>
          )
        })}
      </div>

      {/* Result & Explanation */}
      {showResult && (
        <div className={`px-6 py-4 border-t ${isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
          <div className="flex items-start gap-3">
            {isCorrect ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            )}
            <div>
              <p className={`font-semibold mb-1 ${isCorrect ? 'text-emerald-800' : 'text-red-800'}`}>
                {isCorrect ? 'Correct!' : 'Not quite right'}
              </p>
              <p className="text-sm text-slate-600">{explanation}</p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
        {showResult ? (
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
          >
            Try Again
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={selectedIndex === null}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
              selectedIndex === null
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-amber-500 text-white hover:bg-amber-600 shadow-sm'
            }`}
          >
            Check Answer
          </button>
        )}
      </div>
    </div>
  )
}


