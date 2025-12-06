'use client'

import { useState } from 'react'
import { CheckCircle2, XCircle, GripVertical, RotateCcw } from 'lucide-react'

interface DragDropItem {
  text: string
  category: string
}

interface DragDropExerciseProps {
  instruction: string
  items: DragDropItem[]
  categories: string[]
}

export function DragDropExercise({ instruction, items, categories }: DragDropExerciseProps) {
  const [assignments, setAssignments] = useState<Record<string, string>>({})
  const [showResult, setShowResult] = useState(false)
  const [draggedItem, setDraggedItem] = useState<string | null>(null)

  const unassignedItems = items.filter(item => !Object.keys(assignments).includes(item.text))

  const handleDragStart = (text: string) => {
    setDraggedItem(text)
  }

  const handleDrop = (category: string) => {
    if (draggedItem) {
      setAssignments(prev => ({ ...prev, [draggedItem]: category }))
      setDraggedItem(null)
    }
  }

  const handleRemove = (text: string) => {
    setAssignments(prev => {
      const newAssignments = { ...prev }
      delete newAssignments[text]
      return newAssignments
    })
  }

  const handleCheck = () => {
    setShowResult(true)
  }

  const handleReset = () => {
    setAssignments({})
    setShowResult(false)
  }

  const getCorrectCount = () => {
    return items.filter(item => assignments[item.text] === item.category).length
  }

  const isItemCorrect = (text: string) => {
    const item = items.find(i => i.text === text)
    return item ? assignments[text] === item.category : false
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-50 to-purple-50 px-6 py-4 border-b border-slate-200">
        <p className="font-medium text-slate-800">{instruction}</p>
        {showResult && (
          <p className="text-sm mt-2 text-slate-600">
            You got <span className="font-semibold text-violet-700">{getCorrectCount()}</span> out of{' '}
            <span className="font-semibold">{items.length}</span> correct!
          </p>
        )}
      </div>

      <div className="p-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Items to Drag */}
          <div>
            <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
              Items to Sort
            </h4>
            <div className="space-y-2 min-h-[100px] bg-slate-50 rounded-lg p-3">
              {unassignedItems.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-4">
                  All items sorted!
                </p>
              ) : (
                unassignedItems.map((item, index) => (
                  <div
                    key={index}
                    draggable={!showResult}
                    onDragStart={() => handleDragStart(item.text)}
                    className={`flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-slate-200 shadow-sm ${
                      !showResult ? 'cursor-grab hover:border-violet-300 hover:shadow active:cursor-grabbing' : ''
                    }`}
                  >
                    {!showResult && <GripVertical className="h-4 w-4 text-slate-400" />}
                    <span className="text-sm text-slate-700">{item.text}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
              Categories
            </h4>
            <div className="space-y-3">
              {categories.map((category, index) => {
                const assignedToThis = Object.entries(assignments)
                  .filter(([, cat]) => cat === category)
                  .map(([text]) => text)

                return (
                  <div
                    key={index}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop(category)}
                    className={`rounded-lg border-2 border-dashed p-3 min-h-[60px] transition-colors ${
                      draggedItem ? 'border-violet-400 bg-violet-50' : 'border-slate-200'
                    }`}
                  >
                    <p className="text-sm font-medium text-slate-700 mb-2">{category}</p>
                    <div className="space-y-1">
                      {assignedToThis.map((text, i) => {
                        const correct = isItemCorrect(text)
                        return (
                          <div
                            key={i}
                            className={`flex items-center justify-between gap-2 px-2 py-1.5 rounded text-sm ${
                              showResult
                                ? correct
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-red-100 text-red-800'
                                : 'bg-violet-100 text-violet-800'
                            }`}
                          >
                            <span>{text}</span>
                            <div className="flex items-center gap-1">
                              {showResult && (
                                correct ? (
                                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                ) : (
                                  <XCircle className="h-4 w-4 text-red-600" />
                                )
                              )}
                              {!showResult && (
                                <button
                                  onClick={() => handleRemove(text)}
                                  className="text-violet-600 hover:text-violet-800"
                                >
                                  <XCircle className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
        {showResult ? (
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Try Again
          </button>
        ) : (
          <button
            onClick={handleCheck}
            disabled={Object.keys(assignments).length === 0}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
              Object.keys(assignments).length === 0
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-violet-500 text-white hover:bg-violet-600 shadow-sm'
            }`}
          >
            Check Answers
          </button>
        )}
      </div>
    </div>
  )
}


