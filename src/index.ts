#!/usr/bin/env node

import { createCommand } from 'commander'
import build from './build'
import plugin from './plugin'
import lint from './lint'
import test from './test'

interface InterfaceCLI {
  build?: string;
  watch?: boolean;
  lint?: boolean;
  fix?: boolean;
  plugin?: string;
  test?: boolean
}

const program = createCommand()

program.version(require('../package.json').version)
program.option('-b --build <config>', 'Build package using Rollup and Babel')
program.option('-w --watch')
program.option('-l --lint')
program.option('--fix')
program.option('-p --plugin <name>', 'Create plugin boilerplate')
program.option('-t --test', 'Run tests')
program.parse(process.argv);

const options = program.opts<InterfaceCLI>()

if (options.build) {
    build(options.build, options.watch);
} else if (options.plugin) {
    plugin(options.plugin);
} else if (options.lint) {
    lint(options.fix)
} else if (options.test) {
    test()
}

export {}
