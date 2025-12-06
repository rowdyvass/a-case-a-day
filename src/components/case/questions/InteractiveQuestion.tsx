'use client'

import { MultipleChoiceQuestion } from './MultipleChoiceQuestion'
import { FreeTextQuestion } from './FreeTextQuestion'
import { RankingQuestion } from './RankingQuestion'
import { FrameworkQuestion } from './FrameworkQuestion'

export type QuestionType = 'multiple_choice' | 'free_text' | 'ranking' | 'framework_application'

export interface QuestionData {
  id: string
  text: string
  type: QuestionType
  difficulty: string
  options?: string[] | null
  correctAnswer?: unknown
  exemplaryAnswer?: string | null
  frameworkType?: string | null
  promptFields?: { name: string; placeholder: string }[] | null
}

export interface ExistingResponse {
  response: unknown
  score: number | null
  feedback: string | null
}

interface InteractiveQuestionProps {
  question: QuestionData
  index: number
  existingResponse?: ExistingResponse | null
  isAuthenticated: boolean
  onSubmit: (questionId: string, response: unknown) => Promise<{
    score: number
    feedback: string
    isCorrect?: boolean
    exemplaryAnswer: string
  }>
  onRequireAuth: () => void
}

export function InteractiveQuestion({
  question,
  index,
  existingResponse,
  isAuthenticated,
  onSubmit,
  onRequireAuth
}: InteractiveQuestionProps) {
  const commonProps = {
    questionId: question.id,
    text: question.text,
    difficulty: question.difficulty,
    exemplaryAnswer: question.exemplaryAnswer,
    isAuthenticated,
    onRequireAuth
  }

  switch (question.type) {
    case 'multiple_choice':
      return (
        <MultipleChoiceQuestion
          {...commonProps}
          options={question.options || []}
          existingResponse={existingResponse as { response: number; score: number | null; feedback: string | null } | null}
          onSubmit={onSubmit as (questionId: string, response: number) => Promise<{ score: number; feedback: string; isCorrect: boolean; exemplaryAnswer: string }>}
        />
      )

    case 'ranking':
      return (
        <RankingQuestion
          {...commonProps}
          options={question.options || []}
          existingResponse={existingResponse as { response: number[]; score: number | null; feedback: string | null } | null}
          onSubmit={onSubmit as (questionId: string, response: number[]) => Promise<{ score: number; feedback: string; isCorrect: boolean; exemplaryAnswer: string }>}
        />
      )

    case 'framework_application':
      return (
        <FrameworkQuestion
          {...commonProps}
          frameworkType={question.frameworkType || 'Business Framework'}
          promptFields={question.promptFields || undefined}
          existingResponse={existingResponse as { response: string | Record<string, string>; score: number | null; feedback: string | null } | null}
          onSubmit={onSubmit as (questionId: string, response: string | Record<string, string>) => Promise<{ score: number; feedback: string; exemplaryAnswer: string }>}
        />
      )

    case 'free_text':
    default:
      return (
        <FreeTextQuestion
          {...commonProps}
          existingResponse={existingResponse as { response: string; score: number | null; feedback: string | null } | null}
          onSubmit={onSubmit as (questionId: string, response: string) => Promise<{ score: number; feedback: string; exemplaryAnswer: string }>}
        />
      )
  }
}


