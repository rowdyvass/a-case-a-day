'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { InteractiveQuestion, QuestionData, ExistingResponse } from './questions'
import { LogIn, Award, Target } from 'lucide-react'

interface Question {
  id: string
  text: string
  type?: string
  difficulty: string
  order: number
  options?: string | null
  correctAnswer?: string | null
  exemplaryAnswer?: string | null
  rubric?: string | null
  frameworkType?: string | null
}

interface QuestionListProps {
  questions: Question[]
  caseId: string
}

export function QuestionList({ questions, caseId }: QuestionListProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [responses, setResponses] = useState<Record<string, ExistingResponse>>({})
  const [progress, setProgress] = useState<{ total: number; answered: number; averageScore: number | null } | null>(null)
  const [showAuthPrompt, setShowAuthPrompt] = useState(false)

  const isAuthenticated = status === 'authenticated'
  const isLoading = status === 'loading'

  // Fetch existing responses when authenticated
  useEffect(() => {
    if (isAuthenticated && caseId) {
      fetchResponses()
    }
  }, [isAuthenticated, caseId])

  const fetchResponses = async () => {
    try {
      const res = await fetch(`/api/cases/${caseId}/responses`)
      if (res.ok) {
        const data = await res.json()
        setResponses(data.responses || {})
        setProgress(data.progress || null)
      }
    } catch (error) {
      console.error('Failed to fetch responses:', error)
    }
  }

  const handleSubmit = useCallback(async (questionId: string, response: unknown) => {
    const res = await fetch(`/api/questions/${questionId}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ response })
    })

    if (!res.ok) {
      const error = await res.json()
      if (error.requiresAuth) {
        setShowAuthPrompt(true)
        throw new Error('Authentication required')
      }
      throw new Error(error.error || 'Failed to submit')
    }

    const result = await res.json()
    
    // Update local state
    setResponses(prev => ({
      ...prev,
      [questionId]: {
        response,
        score: result.score,
        feedback: result.feedback
      }
    }))

    // Refresh progress
    fetchResponses()

    return result
  }, [caseId])

  const handleRequireAuth = useCallback(() => {
    setShowAuthPrompt(true)
  }, [])

  const handleLogin = () => {
    router.push('/login')
  }

  // Transform database question to component format
  const transformQuestion = (q: Question): QuestionData => {
    let parsedOptions: string[] | undefined = undefined
    let parsedPromptFields: { name: string; placeholder: string }[] | undefined = undefined

    if (q.options) {
      try {
        parsedOptions = JSON.parse(q.options)
      } catch {
        parsedOptions = undefined
      }
    }

    // For framework_application questions, check if rubric has promptFields
    if (q.type === 'framework_application' && q.rubric) {
      try {
        const rubric = JSON.parse(q.rubric)
        if (rubric.promptFields) {
          parsedPromptFields = rubric.promptFields
        }
      } catch {
        // Ignore parsing errors
      }
    }

    return {
      id: q.id,
      text: q.text,
      type: (q.type as QuestionData['type']) || 'free_text',
      difficulty: q.difficulty,
      options: parsedOptions,
      exemplaryAnswer: q.exemplaryAnswer,
      frameworkType: q.frameworkType,
      promptFields: parsedPromptFields
    }
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        No questions available for this case.
      </div>
    )
  }

  // Helper to get question type label
  const getQuestionTypeLabel = (type?: string) => {
    switch (type) {
      case 'multiple_choice': return 'Multiple Choice'
      case 'ranking': return 'Ranking'
      case 'framework_application': return 'Framework'
      case 'interactive': return 'Interactive'
      default: return 'Analysis'
    }
  }

  return (
    <div className="space-y-8">
      {/* Progress Bar (when authenticated and has responses) - Hidden in print */}
      {isAuthenticated && progress && progress.answered > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm progress-bar-container print:hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-amber-500" />
              <span className="font-semibold text-slate-900">Your Progress</span>
            </div>
            {progress.averageScore !== null && (
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-500" />
                <span className="text-sm text-slate-600">
                  Average Score: <span className="font-bold text-amber-600">{progress.averageScore.toFixed(1)}/10</span>
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${(progress.answered / progress.total) * 100}%` }}
              />
            </div>
            <span className="text-sm font-medium text-slate-600 whitespace-nowrap">
              {progress.answered} / {progress.total} completed
            </span>
          </div>
        </div>
      )}

      {/* Auth Prompt - Hidden in print */}
      {showAuthPrompt && !isAuthenticated && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-center justify-between auth-prompt print:hidden">
          <div className="flex items-center gap-3">
            <LogIn className="h-5 w-5 text-amber-600" />
            <div>
              <p className="font-semibold text-amber-800">Sign in to track your progress</p>
              <p className="text-sm text-amber-700">Your answers will be saved and graded when you log in.</p>
            </div>
          </div>
          <button
            onClick={handleLogin}
            className="px-4 py-2 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition-colors"
          >
            Sign In
          </button>
        </div>
      )}

      {/* Question List */}
      <div className="space-y-6">
        {questions.map((question, index) => {
          const questionData = transformQuestion(question)
          return (
            <div key={question.id} className="relative question-item-wrapper">
              {/* Web view - Interactive Question */}
              <div className="print:hidden">
                {/* Question Number Badge */}
                <div className="absolute -left-4 -top-3 z-10">
                  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-500 text-white font-serif font-bold text-lg shadow-md">
                    {index + 1}
                  </span>
                </div>
                
                <div className="pl-4">
                  <InteractiveQuestion
                    question={questionData}
                    index={index}
                    existingResponse={responses[question.id] || null}
                    isAuthenticated={isAuthenticated}
                    onSubmit={handleSubmit}
                    onRequireAuth={handleRequireAuth}
                  />
                </div>
              </div>

              {/* Print view - Static Question */}
              <div className="hidden print:block question-item">
                <div className="flex items-start gap-3">
                  <span className="question-number">{index + 1}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="question-text">{question.text}</span>
                      <span className="question-type-badge">{getQuestionTypeLabel(question.type)}</span>
                    </div>
                    
                    {/* Show options for multiple choice questions */}
                    {questionData.options && questionData.options.length > 0 && (
                      <div className="question-options">
                        {questionData.options.map((option, optIdx) => (
                          <div key={optIdx} className="question-option">
                            {option}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
