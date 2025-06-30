#!/usr/bin/env node

import { createCommand, Option } from 'commander'

import build from './build'
import { setVerbose } from './build/utils'
import doc from './doc'
import lint from './lint'
import perf from './performance'
import test from './test'

const program = createCommand()

program.version((require('../package.json') as { version: string }).version)

program
  .command('build')
  .description('Build package using Rollup and TypeScript')
  .requiredOption('-c --config <config>')
  .option('-w --watch')
  .option('-o --output <path>')
  .option('-v --verbose')
  .action(async (options: { config: string, watch?: boolean, output?: string, verbose?: boolean }) => {
    if (options.verbose) setVerbose(true)
    await build(options.config, options.watch, options.output?.split(','))
  })

program
  .command('lint')
  .description('Lint using ESLint and TS parser')
  .option('--fix')
  .addOption(new Option('--output <output...>', 'Output target')
    .choices(['sonar', 'stdout'])
    .default('stdout'))
  .option('--quiet')
  .action(async (options: { fix?: boolean, quiet?: boolean, output: ('sonar' | 'stdout')[] }) => {
    await lint({
      fix: options.fix,
      quiet: options.quiet,
      output: options.output
    })
  })

program
  .command('doc')
  .description('Generate API docs')
  .option('--entries <entries>', 'Comma-separated list of entry points')
  .action(async (options: { entries?: string }) => {
    await doc(options.entries
      ? options.entries.split(',')
      : void 0)
  })

program
  .command('test')
  .description('Run tests using Jest')
  .option('-w --watch')
  .action(async (options: { watch?: boolean }) => {
    await test(options.watch)
  })

program
  .command('perf')
  .description('⚠️ EXPERIMENTAL Run performance tests and benchmarks (interface may change)')
  .option('--pattern <pattern>', 'Test file pattern (default: **/*.perf.ts)')
  .option('--iterations <number>', 'Number of iterations', '1')
  .addOption(new Option('--output <format>', 'Output format')
    .choices(['console', 'json', 'both'])
    .default('console'))
  .option('--output-file <file>', 'Output file path', 'performance-results.json')
  .action(async (options: {
    pattern?: string
    iterations?: string
    output?: 'json' | 'console' | 'both'
    outputFile?: string
  }) => {
    await perf({
      testPattern: options.pattern,
      iterations: options.iterations
        ? parseInt(options.iterations, 10)
        : undefined,
      outputFormat: options.output,
      outputFile: options.outputFile
    })
  })

program.parse(process.argv)

export { }
