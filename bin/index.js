#!/usr/bin/env node

const { program } = require('commander');

program.version(require('../package.json').version)
program.option('-b, --build <config>', 'Build package using Rollup and Babel');
program.option('-w, --watch');
program.option('-p, --plugin <name>', 'Create plugin boilerplate');
program.parse(process.argv);

const options = program.opts();
if (options.build)
    require('./build')(options.build, options.watch);
else if (options.plugin)
    require('./plugin')(options.plugin.toLowerCase());