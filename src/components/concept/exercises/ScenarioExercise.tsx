'use client'

import { useState } from 'react'
import { FileText, Lightbulb, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react'

interface ScenarioExerciseProps {
  scenario: string
  question: string
  considerations?: string[]
  hints?: string[]
  framework?: Record<string, string>
}

export function ScenarioExercise({ scenario, question, considerations, hints, framework }: ScenarioExerciseProps) {
  const [response, setResponse] = useState('')
  const [showHints, setShowHints] = useState(false)
  const [showFramework, setShowFramework] = useState(false)

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Scenario */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-5 text-white">
        <div className="flex items-start gap-3">
          <FileText className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-amber-300 mb-2">Scenario</h4>
            <p className="text-slate-200 leading-relaxed">{scenario}</p>
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="px-6 py-4 bg-amber-50 border-b border-amber-200">
        <div className="flex items-start gap-3">
          <MessageSquare className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="font-medium text-slate-800">{question}</p>
        </div>
      </div>

      {/* Considerations */}
      {considerations && considerations.length > 0 && (
        <div className="px-6 py-4 border-b border-slate-200">
          <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Key Considerations
          </h4>
          <ul className="space-y-1">
            {considerations.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="text-amber-500">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Response Area */}
      <div className="p-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Your Analysis
        </label>
        <textarea
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder="Write your analysis here..."
          rows={6}
          className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 resize-none"
        />
        <p className="text-xs text-slate-500 mt-2">
          Take your time to think through the scenario. There&apos;s no single right answer—focus on your reasoning.
        </p>
      </div>

      {/* Hints */}
      {hints && hints.length > 0 && (
        <div className="px-6 pb-4">
          <button
            onClick={() => setShowHints(!showHints)}
            className="flex items-center gap-2 text-sm font-medium text-amber-600 hover:text-amber-700"
          >
            <Lightbulb className="h-4 w-4" />
            {showHints ? 'Hide' : 'Show'} Hints
            {showHints ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {showHints && (
            <div className="mt-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <ul className="space-y-2">
                {hints.map((hint, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-amber-800">
                    <span className="font-semibold">{i + 1}.</span>
                    {hint}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Framework Guide */}
      {framework && Object.keys(framework).length > 0 && (
        <div className="px-6 pb-6">
          <button
            onClick={() => setShowFramework(!showFramework)}
            className="flex items-center gap-2 text-sm font-medium text-violet-600 hover:text-violet-700"
          >
            <FileText className="h-4 w-4" />
            {showFramework ? 'Hide' : 'Show'} Framework Guide
            {showFramework ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {showFramework && (
            <div className="mt-3 p-4 bg-violet-50 rounded-lg border border-violet-200">
              <div className="grid gap-3">
                {Object.entries(framework).map(([key, value], i) => (
                  <div key={i}>
                    <h5 className="text-sm font-semibold text-violet-800 capitalize">
                      {key.replace(/_/g, ' ')}
                    </h5>
                    <p className="text-sm text-violet-700 mt-0.5">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}


