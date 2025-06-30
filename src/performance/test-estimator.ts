/**
 * Test estimation utilities for performance testing
 */

import type { JestTestResult, TestResult } from './types'

export class TestEstimator {
  private fileStartTimes = new Map<string, number>()

  /**
   * Set start time for a test file
   */
  setFileStartTime(filePath: string, startTime: number): void {
    this.fileStartTimes.set(filePath, startTime)
  }

  /**
   * Remove file start time
   */
  removeFileStartTime(filePath: string): void {
    this.fileStartTimes.delete(filePath)
  }

  /**
   * Estimate memory usage for a test based on its characteristics
   */
  estimateMemoryUsage(result: TestResult, testIndex: number): number {
    /*
     * Simple fallback estimation based on test characteristics
     * This is much more conservative than complex calculations
     */

    let baseMemory = 1024 * 1024 // 1MB base memory for any test

    // Adjust based on test name characteristics
    const testName = (result.fullName || result.title).toLowerCase()

    if (testName.includes('memory') || testName.includes('large')) {
      baseMemory *= 3
    } else if (testName.includes('performance') || testName.includes('stress')) {
      baseMemory *= 2
    } else if (testName.includes('async') || testName.includes('promise')) {
      baseMemory *= 1.5
    }

    // Adjust based on test duration if available
    if (result.duration && result.duration > 100) {
      baseMemory *= 1 + result.duration / 1000 // Scale with duration
    }

    // Add small variation based on test position
    const positionMultiplier = 1 + testIndex * 0.1

    return Math.round(baseMemory * positionMultiplier)
  }

  /**
   * Calculate test duration using various fallback strategies
   */
  calculateTestDuration(
    filePath: string,
    result: TestResult,
    testFileResult: JestTestResult,
    endTime: number
  ): number {
    // Use Jest's duration if available (most accurate)
    if (result.duration && result.duration > 0) {
      return result.duration
    }

    // Fallback to file-level timing estimation
    return this.calculateFallbackDuration(filePath, testFileResult, endTime)
  }

  /**
   * Calculate fallback duration when Jest doesn't provide individual test timing
   */
  private calculateFallbackDuration(filePath: string, testFileResult: JestTestResult, endTime: number): number {
    // If Jest doesn't provide individual test duration, estimate based on file timing
    const fileStartTime = this.fileStartTimes.get(filePath)

    if (fileStartTime) {
      const totalFileDuration = endTime - fileStartTime
      const testCount = testFileResult.testResults.length

      // Distribute duration equally among tests (rough estimate)
      return testCount > 0
        ? totalFileDuration / testCount
        : totalFileDuration
    }

    // Fallback: use Jest's test file timing if available
    if (testFileResult.perfStats) {
      const jestDuration = testFileResult.perfStats.runtime
      const testCount = testFileResult.testResults.length

      return testCount > 0
        ? jestDuration / testCount
        : jestDuration
    }

    // Last resort: use file start/end time difference
    return testFileResult.endTime - testFileResult.startTime
  }
}
