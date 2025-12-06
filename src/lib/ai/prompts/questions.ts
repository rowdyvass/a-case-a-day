import type { CaseContent, Question, QuestionType, GradingRubric } from '../providers/types'

export const QUESTIONS_SYSTEM_PROMPT = `You are an expert MBA instructor who creates diverse, interactive questions for case studies. Your questions:

1. Progress from foundational analysis to strategic recommendations
2. Require application of business frameworks and concepts
3. Use a MIX of question types to test different skills:
   - Multiple choice for testing factual understanding
   - Free text for deeper analysis and critical thinking
   - Ranking for prioritization and sequencing skills
   - Framework application for applying MBA concepts
4. Include clear grading criteria and exemplary answers
5. Connect theory to practical business decisions

Create questions that challenge students to think deeply about the business situation while providing fair, gradable assessments.`

/**
 * Get the prompt for generating interactive questions
 */
export function getQuestionsPrompt(
  caseContent: CaseContent,
  concepts: string[]
): string {
  return `Based on the following case study and target concepts, create 4-6 interactive questions of MIXED TYPES.

CASE STUDY:
Title: ${caseContent.title}
Company: ${caseContent.company}
Industry: ${caseContent.industry}
Summary: ${caseContent.summary}

Sections:
${caseContent.sections.map(s => `${s.title}:\n${s.content}`).join('\n\n')}

TARGET MBA CONCEPTS:
${concepts.join(', ')}

QUESTION TYPE REQUIREMENTS:
- Include AT LEAST one "multiple_choice" question (for factual/analytical understanding)
- Include AT LEAST one "free_text" question (for deeper analysis)
- Include AT LEAST one "ranking" OR "framework_application" question
- Mix difficulties: 1-2 easy, 2-3 medium, 1-2 hard

QUESTION TYPE SPECIFICATIONS:

1. MULTIPLE_CHOICE:
{
  "type": "multiple_choice",
  "text": "Clear question testing understanding",
  "difficulty": "easy|medium|hard",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": 0,  // Index of correct option (0-based)
  "exemplaryAnswer": "Explanation of why the correct answer is correct and why others are not"
}

2. FREE_TEXT:
{
  "type": "free_text",
  "text": "Open-ended question requiring analysis",
  "difficulty": "easy|medium|hard",
  "rubric": {
    "criteria": [
      {"name": "Analysis Depth", "description": "Shows understanding of key issues", "weight": 4},
      {"name": "Framework Application", "description": "Correctly applies relevant concepts", "weight": 3},
      {"name": "Evidence Use", "description": "References specific case details", "weight": 3}
    ],
    "keyPoints": ["Key point 1 to mention", "Key point 2 to mention", "Key point 3 to mention"]
  },
  "exemplaryAnswer": "A comprehensive model answer (2-4 paragraphs) demonstrating excellent analysis"
}

3. RANKING:
{
  "type": "ranking",
  "text": "Question asking to prioritize or sequence items",
  "difficulty": "easy|medium|hard",
  "options": ["Item 1", "Item 2", "Item 3", "Item 4"],
  "correctAnswer": [2, 0, 3, 1],  // Correct order (indices of options)
  "exemplaryAnswer": "Explanation of the correct ranking and reasoning"
}

4. FRAMEWORK_APPLICATION:
{
  "type": "framework_application",
  "text": "Apply [specific framework] to analyze...",
  "difficulty": "medium|hard",
  "frameworkType": "Porter's Five Forces|SWOT|BCG Matrix|etc.",
  "rubric": {
    "criteria": [
      {"name": "Framework Completeness", "description": "Addresses all parts of framework", "weight": 4},
      {"name": "Case Application", "description": "Applies framework to specific case details", "weight": 4},
      {"name": "Insight Quality", "description": "Generates meaningful insights", "weight": 2}
    ],
    "keyPoints": ["Framework element 1 should cover X", "Framework element 2 should mention Y"]
  },
  "promptFields": [
    {"name": "strengths", "placeholder": "List 3-4 key strengths..."},
    {"name": "weaknesses", "placeholder": "List 3-4 key weaknesses..."}
  ],
  "exemplaryAnswer": "Complete framework analysis with specific case examples"
}

IMPORTANT GUIDELINES:
- Each question must have a complete exemplaryAnswer (this is shown after students submit)
- Multiple choice should have exactly 4 options with one clearly correct answer
- Ranking questions should have 4-6 items to rank
- Free text and framework questions need detailed rubrics with 3+ criteria
- Reference specific details from the case in questions and answers
- Ensure framework_application questions specify which MBA concept to use
- NEVER use em dashes (—). Use regular hyphens (-), commas, colons, or rewrite sentences instead

Respond in JSON format:
{
  "questions": [
    // Mix of question types as specified above
  ]
}`
}

/**
 * Validate that a question has all required fields for its type
 */
export function validateQuestion(question: Question): boolean {
  const baseValid = 
    question.text && 
    question.type && 
    question.difficulty && 
    question.exemplaryAnswer

  if (!baseValid) return false

  switch (question.type) {
    case 'multiple_choice':
      return (
        Array.isArray(question.options) &&
        question.options.length >= 2 &&
        typeof question.correctAnswer === 'number' &&
        question.correctAnswer >= 0 &&
        question.correctAnswer < question.options.length
      )
    
    case 'free_text':
      return (
        question.rubric &&
        Array.isArray(question.rubric.criteria) &&
        question.rubric.criteria.length > 0 &&
        Array.isArray(question.rubric.keyPoints)
      )
    
    case 'ranking':
      return (
        Array.isArray(question.options) &&
        question.options.length >= 2 &&
        Array.isArray(question.correctAnswer) &&
        question.correctAnswer.length === question.options.length
      )
    
    case 'framework_application':
      return (
        question.frameworkType &&
        question.rubric &&
        Array.isArray(question.rubric.criteria) &&
        question.rubric.criteria.length > 0
      )
    
    default:
      return false
  }
}

/**
 * Convert a legacy question to a free_text question for backwards compatibility
 */
export function convertLegacyQuestion(legacy: { text: string; difficulty: string }): Question {
  return {
    type: 'free_text',
    text: legacy.text,
    difficulty: legacy.difficulty as 'easy' | 'medium' | 'hard',
    rubric: {
      criteria: [
        { name: 'Analysis', description: 'Quality of analysis', weight: 4 },
        { name: 'Reasoning', description: 'Logical reasoning', weight: 3 },
        { name: 'Evidence', description: 'Use of case evidence', weight: 3 }
      ],
      keyPoints: []
    },
    exemplaryAnswer: 'Consider the key factors presented in the case and apply relevant MBA frameworks to develop your analysis.'
  }
}
