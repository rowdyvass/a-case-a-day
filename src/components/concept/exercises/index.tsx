'use client'

import { QuizExercise } from './QuizExercise'
import { DragDropExercise } from './DragDropExercise'
import { ScenarioExercise } from './ScenarioExercise'

interface QuizData {
  type: 'quiz'
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

interface DragDropData {
  type: 'dragdrop'
  instruction: string
  items: { text: string; category: string }[]
  categories: string[]
}

interface ScenarioData {
  type: 'scenario'
  scenario: string
  question: string
  considerations?: string[]
  hints?: string[]
  framework?: Record<string, string>
}

interface MatrixBuilderData {
  type: 'matrixBuilder'
  instruction: string
  items: { name: string; hint?: string }[]
}

type ExerciseData = QuizData | DragDropData | ScenarioData | MatrixBuilderData

interface ExerciseRendererProps {
  exercise: unknown
  index: number
}

export function ExerciseRenderer({ exercise, index }: ExerciseRendererProps) {
  const data = exercise as ExerciseData

  switch (data.type) {
    case 'quiz':
      return (
        <QuizExercise
          question={data.question}
          options={data.options}
          correctIndex={data.correctIndex}
          explanation={data.explanation}
        />
      )
    
    case 'dragdrop':
      return (
        <DragDropExercise
          instruction={data.instruction}
          items={data.items}
          categories={data.categories}
        />
      )
    
    case 'scenario':
      return (
        <ScenarioExercise
          scenario={data.scenario}
          question={data.question}
          considerations={data.considerations}
          hints={data.hints}
          framework={data.framework}
        />
      )
    
    case 'matrixBuilder':
      // Matrix builder is similar to scenario - it's an open-ended exercise
      return (
        <ScenarioExercise
          scenario={data.instruction}
          question="Place each item in the correct quadrant of the matrix based on its characteristics."
          hints={data.items.map((item) => `${item.name}: ${item.hint || 'Consider its characteristics'}`)}
        />
      )
    
    default:
      return (
        <div className="bg-white rounded-xl border border-slate-200 p-6 text-center text-slate-500">
          <p>Exercise type not supported</p>
        </div>
      )
  }
}

export { QuizExercise } from './QuizExercise'
export { DragDropExercise } from './DragDropExercise'
export { ScenarioExercise } from './ScenarioExercise'


