/**
 * Mock Prisma client for testing
 *
 * Usage in tests:
 * ```ts
 * vi.mock('@/lib/db')
 * import { mockPrisma, resetPrismaMocks } from '@/__mocks__/prisma'
 *
 * beforeEach(() => {
 *   resetPrismaMocks()
 * })
 *
 * test('example', async () => {
 *   mockPrisma.concept.findMany.mockResolvedValue([...])
 * })
 * ```
 */

import { vi } from 'vitest'

// Create mock functions for each Prisma model operation
const createMockModelOperations = () => ({
  findUnique: vi.fn(),
  findFirst: vi.fn(),
  findMany: vi.fn(),
  create: vi.fn(),
  createMany: vi.fn(),
  update: vi.fn(),
  updateMany: vi.fn(),
  upsert: vi.fn(),
  delete: vi.fn(),
  deleteMany: vi.fn(),
  count: vi.fn(),
  aggregate: vi.fn(),
  groupBy: vi.fn(),
})

// Create the mock Prisma client
export const mockPrisma = {
  user: createMockModelOperations(),
  case: createMockModelOperations(),
  sourceArticle: createMockModelOperations(),
  exhibit: createMockModelOperations(),
  question: createMockModelOperations(),
  questionResponse: createMockModelOperations(),
  concept: createMockModelOperations(),
  caseConcept: createMockModelOperations(),
  caseGenerationJob: createMockModelOperations(),
  promptVersion: createMockModelOperations(),
  $transaction: vi.fn((fn) => fn(mockPrisma)),
  $connect: vi.fn(),
  $disconnect: vi.fn(),
  $queryRaw: vi.fn(),
  $executeRaw: vi.fn(),
}

/**
 * Reset all Prisma mocks between tests
 */
export function resetPrismaMocks() {
  Object.values(mockPrisma).forEach((model) => {
    if (typeof model === 'object' && model !== null) {
      Object.values(model).forEach((fn) => {
        if (typeof fn === 'function' && 'mockReset' in fn) {
          ;(fn as ReturnType<typeof vi.fn>).mockReset()
        }
      })
    }
  })
}

// This will be used when vi.mock('@/lib/db') is called in tests
vi.mock('@/lib/db', () => ({
  prisma: mockPrisma,
  default: mockPrisma,
}))

