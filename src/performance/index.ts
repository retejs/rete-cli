/**
 * Performance testing module for rete-cli
 *
 * This module provides comprehensive performance testing capabilities including:
 * - Memory usage tracking per test
 * - Duration measurement with fallback strategies
 * - Jest-style output formatting
 * - JSON result export
 * - Garbage collection handling
 */

export { MemoryUtils } from './memory-utils'
export { OutputFormatter } from './output-formatter'
export { PerformanceReporter } from './reporter'
export { ResultSaver } from './result-saver'
export { default } from './runner'
export { TestEstimator } from './test-estimator'
export type {
  FileResult,
  JestTestResult,
  MemorySnapshot,
  PerformanceConfig,
  PerformanceMetrics,
  Test,
  TestResult,
  TestStatus
} from './types'
