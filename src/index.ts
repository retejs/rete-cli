#!/usr/bin/env node

import { createCommand } from 'commander'

import build from './build'
import { setVerbose } from './build/utils'
import doc from './doc'
import lint from './lint'
import test from './test'

const program = createCommand()

program.version(require('../package.json').version)

program
  .command('build')
  .description('Build package using Rollup and TypeScript')
  .requiredOption('-c --config <config>')
  .option('-w --watch')
  .option('-o --output <path>')
  .option('-v --verbose')
  .action((options: { config: string, watch?: boolean, output?: string, verbose?: boolean }) => {
    if (options.verbose) setVerbose(true)
    build(options.config, options.watch, options.output?.split(','))
  })

program
  .command('lint')
  .description('Lint using ESLint and TS parser')
  .option('--fix')
  .action((options: { fix?: boolean }) => {
    lint(options.fix)
  })

program
  .command('doc')
  .description('Generate API docs')
  .option('--entries <entries>', 'Comma-separated list of entry points')
  .action(async (options: { entries?: string }) => {
    await doc(options.entries ? options.entries.split(',') : void 0)
  })

program
  .command('test')
  .description('Run tests')
  .description('Run tests using Jest')
  .option('-w --watch')
  .action((options: { watch?: boolean }) => {
    test(options.watch)
  })

program.parse(process.argv)

export { }
