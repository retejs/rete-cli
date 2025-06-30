/**
 * Type definitions for performance testing and reporting
 */

export type TestStatus = 'passed' | 'failed' | 'skipped'

export interface PerformanceMetrics {
  testName: string
  testFile: string
  duration: number
  memory: number
  timestamp: string
  status: TestStatus
}

export interface TestResult {
  title: string
  status: string
  fullName: string
  duration?: number
}

export interface Test {
  path: string
}

export interface JestTestResult {
  title: string
  testResults: TestResult[]
  startTime: number
  endTime: number
  perfStats?: {
    start: number
    end: number
    runtime: number
  }
}

export interface PerformanceConfig {
  testPattern?: string
  iterations?: number
  outputFormat?: 'json' | 'console' | 'both'
  outputFile?: string
}

export interface MemorySnapshot {
  testName: string
  memory: number
  timestamp: number
}

export interface FileResult {
  results: PerformanceMetrics[]
  status: 'passed' | 'failed'
  title: string
}
