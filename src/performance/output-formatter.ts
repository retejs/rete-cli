/**
 * Output formatting utilities for performance test results
 */

import chalk from 'chalk'
import path from 'path'

import type { FileResult, PerformanceMetrics } from './types'

export class OutputFormatter {
  private startTime = Date.now()

  constructor() {
    this.startTime = Date.now()
  }

  /**
   * Print Jest-style output for all test results
   */
  printJestStyleOutput(fileResults: Map<string, FileResult>): void {
    // Add extra newlines to ensure clean separation from Jest's output
    console.log('\n')

    // Output each test file in Jest format
    for (const [filePath, fileData] of fileResults) {
      this.printFileHeader(filePath, fileData.status)
      this.printTestsForFile(fileData.results)
      console.log() // Empty line after each file
    }

    // Print summary at the end
    this.printJestSummary(fileResults)
  }

  /**
   * Print file header with status badge
   */
  private printFileHeader(filePath: string, status: 'passed' | 'failed'): void {
    const statusLabel = status === 'passed'
      ? chalk.bgGreen.black.bold(' PASS ')
      : chalk.bgRed.white.bold(' FAIL ')

    // Split path to get directory and filename
    const parsedPath = path.parse(filePath)
    const directory = parsedPath.dir
      ? `${parsedPath.dir}/`
      : ''
    const filename = parsedPath.base

    console.log(`${statusLabel} ${chalk.gray(directory)}${chalk.white.bold(filename)}`)
  }

  /**
   * Print tests for a specific file
   */
  private printTestsForFile(tests: PerformanceMetrics[]): void {
    // Group tests by describe blocks (extracted from fullName)
    const testGroups = this.groupTestsByDescribe(tests)

    for (const [describeName, groupTests] of testGroups) {
      if (describeName) {
        console.log(`  ${describeName}`)
      }

      for (const test of groupTests) {
        const indent = describeName
          ? '    '
          : '  '

        this.printTestLine(test, indent)
      }
    }
  }

  /**
   * Group tests by describe blocks
   */
  private groupTestsByDescribe(tests: PerformanceMetrics[]): Map<string, PerformanceMetrics[]> {
    const groups = new Map<string, PerformanceMetrics[]>()

    for (const test of tests) {
      // Extract describe block from fullName (e.g., "NodeEditor should do something" -> "NodeEditor")
      const parts = test.testName.split(' ')
      const describeName = parts.length > 1
        ? parts[0]
        : ''

      if (!groups.has(describeName)) {
        groups.set(describeName, [])
      }

      const group = groups.get(describeName)

      if (group) {
        group.push(test)
      }
    }

    return groups
  }

  /**
   * Print individual test line with performance metrics
   */
  private printTestLine(test: PerformanceMetrics, indent: string): void {
    let statusIcon = ''

    if (test.status === 'passed') {
      statusIcon = chalk.green('✓')
    } else if (test.status === 'failed') {
      statusIcon = chalk.red('✕')
    } else {
      statusIcon = chalk.yellow('○')
    }

    // Extract test title (remove describe block name if present)
    const parts = test.testName.split(' ')
    const testTitle = parts.length > 1
      ? parts.slice(1).join(' ')
      : test.testName

    const durationMs = Math.round(test.duration)
    const memoryMB = (test.memory / 1024 / 1024).toFixed(1)
    const performanceInfo = `(${durationMs} ms, ${memoryMB} MB)`

    console.log(`${indent}${statusIcon} ${chalk.gray(testTitle)} ${chalk.gray(performanceInfo)}`)
  }

  /**
   * Print Jest-style summary
   */
  private printJestSummary(fileResults: Map<string, FileResult>): void {
    const allResults = Array.from(fileResults.values()).flatMap(f => f.results)
    const stats = this.calculateSummaryStats(allResults)
    const totalFiles = fileResults.size
    const passedFiles = Array.from(fileResults.values()).filter(f => f.status === 'passed').length
    const failedFiles = totalFiles - passedFiles

    this.printSuiteSummary(passedFiles, failedFiles, totalFiles)
    this.printTestSummary(stats)
    this.printTimeSummary(stats.totalDuration)
    this.printMemorySummary(stats.totalMemory)
  }

  /**
   * Calculate summary statistics
   */
  private calculateSummaryStats(results: PerformanceMetrics[]) {
    const totalDuration = results.reduce((sum, r) => sum + r.duration, 0)
    const avgDuration = totalDuration / results.length
    const totalMemory = results.reduce((sum, r) => sum + Math.abs(r.memory), 0)
    const avgMemory = totalMemory / results.length
    const passed = results.filter(r => r.status === 'passed').length
    const failed = results.filter(r => r.status === 'failed').length
    const skipped = results.filter(r => r.status === 'skipped').length

    return {
      totalDuration,
      avgDuration,
      totalMemory,
      avgMemory,
      passed,
      failed,
      skipped
    }
  }

  /**
   * Print test suite summary
   */
  private printSuiteSummary(passedFiles: number, failedFiles: number, totalFiles: number): void {
    const suiteParts: string[] = []

    if (passedFiles > 0) {
      suiteParts.push(`${chalk.green.bold(passedFiles.toString())} ${chalk.green.bold('passed')}`)
    }
    if (failedFiles > 0) {
      suiteParts.push(`${chalk.red.bold(failedFiles.toString())} ${chalk.red.bold('failed')}`)
    }

    const suiteStatus = suiteParts.join(', ')

    console.log(`${chalk.bold('Test Suites:')} ${suiteStatus}, ${totalFiles} total`)
  }

  /**
   * Print test summary
   */
  private printTestSummary(stats: ReturnType<typeof this.calculateSummaryStats>): void {
    const testParts: string[] = []

    if (stats.passed > 0) {
      testParts.push(`${chalk.green.bold(stats.passed.toString())} ${chalk.green.bold('passed')}`)
    }
    if (stats.failed > 0) {
      testParts.push(`${chalk.red.bold(stats.failed.toString())} ${chalk.red.bold('failed')}`)
    }
    if (stats.skipped > 0) {
      testParts.push(`${chalk.yellow.bold(stats.skipped.toString())} ${chalk.yellow.bold('skipped')}`)
    }

    const testStatus = testParts.join(', ')
    const totalTests = stats.passed + stats.failed + stats.skipped

    console.log(`${chalk.bold('Tests:')} ${testStatus}, ${totalTests} total`)
    console.log(`${chalk.bold('Snapshots:')} 0 total`)
  }

  /**
   * Print time summary
   */
  private printTimeSummary(totalDurationMs: number): void {
    const totalTimeSec = (totalDurationMs / 1000).toFixed(3)
    const elapsedSec = ((Date.now() - this.startTime) / 1000).toFixed(3)

    console.log(`${chalk.bold('Time:')} ${totalTimeSec} s, estimated ${elapsedSec} s`)
  }

  /**
   * Print memory summary
   */
  private printMemorySummary(totalMemoryBytes: number): void {
    const totalMemoryMB = (totalMemoryBytes / 1024 / 1024).toFixed(1)

    console.log(`${chalk.bold('Memory:')} ${totalMemoryMB} MB total`)
  }
}
