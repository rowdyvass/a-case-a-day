/**
 * Vitest setup file
 * This file runs before each test file
 */

import { vi } from 'vitest'

// Mock environment variables
process.env.NODE_ENV = 'test'
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://localhost:5432/test'

// Reset all mocks between tests
beforeEach(() => {
  vi.clearAllMocks()
})

