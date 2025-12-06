import { describe, it, expect, vi, beforeEach } from 'vitest'
import { runQuestionGenerationPhase } from '../generate-questions'
import { mockAIProvider, mockResponses, resetAIProviderMocks } from '@/__mocks__/ai-provider'

describe('runQuestionGenerationPhase', () => {
  beforeEach(() => {
    resetAIProviderMocks()
  })

  it('should generate questions with provided concepts', async () => {
    const concepts = ['SWOT Analysis', "Porter's Five Forces"]

    const result = await runQuestionGenerationPhase(
      mockAIProvider,
      mockResponses.caseContent,
      concepts
    )

    expect(mockAIProvider.generateQuestions).toHaveBeenCalledWith(
      mockResponses.caseContent,
      concepts
    )
    expect(result.questions).toEqual(mockResponses.questions)
  })

  it('should use default concepts when none provided', async () => {
    const result = await runQuestionGenerationPhase(
      mockAIProvider,
      mockResponses.caseContent,
      undefined
    )

    expect(mockAIProvider.generateQuestions).toHaveBeenCalledWith(
      mockResponses.caseContent,
      ['Strategy', 'Finance', 'Marketing']
    )
    expect(result.questions).toBeDefined()
  })

  it('should use default concepts when empty array provided', async () => {
    const result = await runQuestionGenerationPhase(
      mockAIProvider,
      mockResponses.caseContent,
      []
    )

    expect(mockAIProvider.generateQuestions).toHaveBeenCalledWith(
      mockResponses.caseContent,
      ['Strategy', 'Finance', 'Marketing']
    )
    expect(result.questions).toBeDefined()
  })

  it('should return questions in expected format', async () => {
    const result = await runQuestionGenerationPhase(
      mockAIProvider,
      mockResponses.caseContent,
      ['SWOT Analysis']
    )

    expect(result.questions).toBeInstanceOf(Array)
    expect(result.questions.length).toBeGreaterThan(0)

    const question = result.questions[0]
    expect(question).toHaveProperty('text')
    expect(question).toHaveProperty('type')
    expect(question).toHaveProperty('difficulty')
    expect(question).toHaveProperty('exemplaryAnswer')
  })

  it('should pass case content to AI provider', async () => {
    const customCaseContent = {
      ...mockResponses.caseContent,
      title: 'Custom Case Title',
    }

    await runQuestionGenerationPhase(
      mockAIProvider,
      customCaseContent,
      ['Strategy']
    )

    expect(mockAIProvider.generateQuestions).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Custom Case Title' }),
      ['Strategy']
    )
  })
})

