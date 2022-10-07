#!/usr/bin/env node

import { createCommand } from 'commander'
import build from './build'
import plugin from './plugin'
import lint from './lint'
import test from './test'

const program = createCommand()

program.version(require('../package.json').version)

program
    .command('build')
    .description('Build package using Rollup and Babel')
    .requiredOption('-c --config <config>')
    .option('-w --watch')
    .action((options: { config: string, watch?: boolean }) => {
        build(options.config, options.watch)
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

program.parse(process.argv);

export {}
