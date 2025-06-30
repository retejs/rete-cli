/**
 * Result saving utilities for performance test results
 */

import fs from 'fs'
import path from 'path'

import type { PerformanceMetrics } from './types'

export class ResultSaver {
  /**
   * Save performance results to file
   */
  saveResults(results: PerformanceMetrics[]): void {
    const outputFile = process.env.PERFORMANCE_OUTPUT_FILE ?? 'performance-results.json'
    const outputFormat = process.env.PERFORMANCE_OUTPUT_FORMAT ?? 'console'

    if (outputFormat === 'json' || outputFormat === 'both') {
      const reportData = {
        summary: {
          totalTests: results.length,
          passed: results.filter(r => r.status === 'passed').length,
          failed: results.filter(r => r.status === 'failed').length,
          skipped: results.filter(r => r.status === 'skipped').length,
          totalDuration: results.reduce((sum, r) => sum + r.duration, 0),
          totalMemory: results.reduce((sum, r) => sum + Math.abs(r.memory), 0),
          timestamp: new Date().toISOString()
        },
        results
      }

      try {
        fs.writeFileSync(
          path.join(process.cwd(), outputFile),
          JSON.stringify(reportData, null, 2)
        )
        console.log(`\n📄 Performance report saved to: ${outputFile}`)
      } catch (error) {
        const errorMessage = error instanceof Error
          ? error.message
          : String(error)

        console.error(`❌ Failed to save performance report: ${errorMessage}`)
      }
    }
  }
}
