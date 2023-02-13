#!/usr/bin/env node

import { createCommand, Option } from 'commander'

import build from './build'
import { setVerbose } from './build/utils'
import bulkBuild from './bulk-build'
import lint from './lint'
import plugin from './plugin'
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
    .command('bulk-build')
    .description(`
        Build several packages by inserting them into node_modules of each other
        (for development purposes)
    `)
    .option('-f --folders <folders>')
    .addOption(new Option('-a --approach <approach>').choices(['print', 'inplace']))
    .action((options: { folders?: string, approach?: string }) => {
        bulkBuild(options.folders, options.approach)
    })

program
    .command('lint')
    .description('Lint using ESLint and TS parser')
    .option('--fix')
    .action((options: { fix?: boolean }) => {
        lint(options.fix)
    })

program
    .command('plugin')
    .description('Create plugin boilerplate')
    .requiredOption('-n --name <name>')
    .action((options: { name: string }) => {
        plugin(options.name)
    })

program
    .command('test')
    .description('Run tests')
    .description('Run tests using Jest')
    .action(() => {
        test()
    })

program.parse(process.argv)

export {}
