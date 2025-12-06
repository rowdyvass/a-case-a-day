// Concept Data Index - All 60 MBA Concepts

export { strategyConcepts } from './strategy'
export { financeConcepts } from './finance'
export { marketingConcepts } from './marketing'
export { operationsConcepts } from './operations'
export { leadershipConcepts } from './leadership'
export { economicsConcepts } from './economics'

import { strategyConcepts } from './strategy'
import { financeConcepts } from './finance'
import { marketingConcepts } from './marketing'
import { operationsConcepts } from './operations'
import { leadershipConcepts } from './leadership'
import { economicsConcepts } from './economics'

// All concepts combined
export const allConcepts = [
  ...strategyConcepts,
  ...financeConcepts,
  ...marketingConcepts,
  ...operationsConcepts,
  ...leadershipConcepts,
  ...economicsConcepts
]

// Concept counts by category
export const conceptCounts = {
  Strategy: strategyConcepts.length,
  Finance: financeConcepts.length,
  Marketing: marketingConcepts.length,
  Operations: operationsConcepts.length,
  Leadership: leadershipConcepts.length,
  Economics: economicsConcepts.length,
  Total: strategyConcepts.length + financeConcepts.length + marketingConcepts.length + 
         operationsConcepts.length + leadershipConcepts.length + economicsConcepts.length
}


