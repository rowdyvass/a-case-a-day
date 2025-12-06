'use client'

import { Lightbulb } from 'lucide-react'

interface ExemplaryAnswerProps {
  answer: string
}

export function ExemplaryAnswer({ answer }: ExemplaryAnswerProps) {
  if (!answer) return null

  return (
    <div className="border-t border-amber-200 bg-gradient-to-b from-amber-50 to-amber-50/50">
      <div className="px-6 py-5">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
            <Lightbulb className="h-5 w-5 text-amber-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-amber-800 mb-2">
              Exemplary Answer
            </h4>
            <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
              {answer}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


