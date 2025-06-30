/**
 * Performance Reporter for Jest Tests
 *
 * This reporter provides actual memory tracking per test case by measuring
 * memory usage before and after each individual test execution.
 *
 * USAGE:
 *
 * 1. Basic Jest Integration (automatic file-level tracking):
 *    Add this reporter to your Jest configuration and it will track
 *    memory usage at the file level with fallback estimation per test.
 *
 * 2. Advanced Per-Test Tracking (automatic detection):
 *    The performance reporter automatically detects and measures individual test
 *    memory usage when tests call the onTestCaseStart/onTestCaseEnd methods.
 *    This happens automatically through Jest's test lifecycle hooks.
 *
 * MEMORY MEASUREMENT APPROACH:
 * - Takes memory snapshots before and after each test
 * - Forces garbage collection when available for cleaner measurements
 * - Handles GC interference detection and stabilization
 * - Falls back to estimation based on test characteristics when direct measurement isn't available
 *
 * OUTPUT:
 * - Displays memory usage in MB alongside test duration
 * - Saves detailed results to JSON file when configured
 * - Provides Jest-style formatted output with performance metrics
 */

import path from 'path'
import { performance } from 'perf_hooks'

import { MemoryUtils } from './memory-utils'
import { OutputFormatter } from './output-formatter'
import { ResultSaver } from './result-saver'
import { TestEstimator } from './test-estimator'
import type {
  FileResult,
  JestTestResult,
  MemorySnapshot,
  PerformanceMetrics,
  Test,
  TestResult,
  TestStatus
} from './types'

export class PerformanceReporter {
  private results: PerformanceMetrics[] = []
  private testStartMemory = new Map<string, number>()
  private memorySnapshots: MemorySnapshot[] = []
  private baselineMemory = 0
  private fileResults = new Map<string, FileResult>()

  private memoryUtils = new MemoryUtils()
  private outputFormatter = new OutputFormatter()
  private resultSaver = new ResultSaver()
  private testEstimator = new TestEstimator()

  onTestStart(test: Test): void {
    const testKey = test.path

    // Establish baseline memory if this is the first test
    if (this.baselineMemory === 0) {
      this.baselineMemory = this.memoryUtils.establishMemoryBaseline()
    }

    // Track file-level timing for fallback
    this.testEstimator.setFileStartTime(testKey, performance.now())

    // Initialize memory tracking for this file
    this.memorySnapshots = []
  }

  /**
   * Track individual test start
   */
  onTestCaseStart(testName: string): void {
    // Force GC before test to get clean baseline
    this.memoryUtils.forceGarbageCollection()

    // Take stabilized memory reading for this specific test
    const testStartMemory = this.memoryUtils.getStabilizedMemoryReading()

    if (testName) {
      this.testStartMemory.set(testName, testStartMemory)
    }
  }

  /**
   * Track individual test end
   */
  onTestCaseEnd(testName: string): number {
    // Force GC after test to measure actual allocation
    this.memoryUtils.forceGarbageCollection()

    const testEndMemory = this.memoryUtils.getStabilizedMemoryReading()
    const testStartMemory = this.testStartMemory.get(testName) ?? testEndMemory

    // Calculate actual memory used by this test
    const memoryUsed = Math.max(0, testEndMemory - testStartMemory)

    // Clean up
    this.testStartMemory.delete(testName)

    return memoryUsed
  }

  onTestResult(test: Test, testResult: JestTestResult): void {
    const endTime = performance.now()

    testResult.testResults.forEach((result, index) => {
      // Try to get actual memory usage from our per-test tracking
      let actualMemoryUsage = 0
      const testFullName = result.fullName || result.title

      // Check if we have actual memory measurement for this test
      if (this.testStartMemory.has(testFullName)) {
        actualMemoryUsage = this.onTestCaseEnd(testFullName)
      } else {
        // Fallback: use estimation based on test characteristics
        actualMemoryUsage = this.testEstimator.estimateMemoryUsage(result, index)
      }

      this.memorySnapshots.push({
        testName: testFullName,
        memory: actualMemoryUsage,
        timestamp: Date.now()
      })

      this.processTestResult(test, result, testResult, endTime, actualMemoryUsage)
    })

    // Clean up file-level metrics after all tests in the file are processed
    this.testEstimator.removeFileStartTime(test.path)
    this.memorySnapshots = [] // Reset for next file
  }

  private processTestResult(
    test: Test,
    result: TestResult,
    testFileResult: JestTestResult,
    endTime: number,
    memoryUsage: number
  ): void {
    // Calculate metrics using Jest's timing data and our memory estimation
    const duration = this.testEstimator.calculateTestDuration(test.path, result, testFileResult, endTime)

    const status = this.getTestStatus(result.status)
    const metrics: PerformanceMetrics = {
      testName: result.fullName || result.title,
      testFile: path.relative(process.cwd(), test.path),
      duration,
      memory: memoryUsage,
      timestamp: new Date().toISOString(),
      status
    }

    this.results.push(metrics)

    // Group results by file for Jest-style output
    const fileKey = metrics.testFile

    if (!this.fileResults.has(fileKey)) {
      this.fileResults.set(fileKey, {
        results: [],
        status: 'passed',
        title: testFileResult.title
      })
    }

    const fileData = this.fileResults.get(fileKey)

    if (fileData) {
      fileData.results.push(metrics)

      // Update file status if any test failed
      if (status === 'failed') {
        fileData.status = 'failed'
      }
    }
  }

  onRunComplete(): void {
    this.outputFormatter.printJestStyleOutput(this.fileResults)
    this.resultSaver.saveResults(this.results)
  }

  private getTestStatus(status: string): TestStatus {
    if (status === 'passed') return 'passed'
    if (status === 'failed') return 'failed'
    return 'skipped'
  }

  getResults(): PerformanceMetrics[] {
    return this.results
  }
}

export default PerformanceReporter
