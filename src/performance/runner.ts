/**
 * Performance test runner
 */

import execa from 'execa'

import type { PerformanceConfig } from './types'

export async function runPerformanceTests(config: PerformanceConfig) {
  const {
    testPattern = '**/*.perf.ts',
    iterations = 1
  } = config

  const reporterPath = require.resolve('./reporter.js')

  try {
    await execa('node', [
      '--expose-gc',
      require.resolve('jest/bin/jest'),
      '--preset', 'ts-jest',
      '--testEnvironment', 'node',
      '--testMatch', testPattern,
      '--verbose',
      '--no-coverage',
      '--runInBand',
      '--forceExit',
      '--reporters', reporterPath
    ], {
      stdio: 'inherit',
      env: {
        ...process.env,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        NODE_ENV: 'performance',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        PERFORMANCE_ITERATIONS: iterations.toString(),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        PERFORMANCE_OUTPUT_FORMAT: config.outputFormat ?? 'console',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        PERFORMANCE_OUTPUT_FILE: config.outputFile ?? 'performance-results.json'
      }
    })
  } catch (error: unknown) {
    // Let Jest handle its own exit code
    const exitCode = error && typeof error === 'object' && 'exitCode' in error
      ? (error as { exitCode: number }).exitCode
      : 1

    process.exit(exitCode)
  }
}

export default async function performanceTest(config: PerformanceConfig = {}) {
  console.log('🚀 Starting performance tests...')
  console.log('⚠️  Note: This is an experimental feature and the interface may change')

  await runPerformanceTests(config)
}
