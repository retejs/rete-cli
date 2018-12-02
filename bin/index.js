#!/usr/bin/env node

const program = require('commander');

program.version(require('../package.json').version)
program.option('-b --build <config>', 'Build package using Rollup and Babel');
program.option('-w --watch');
program.option('-p --plugin <name>', 'Create plugin boilerplate');
program.parse(process.argv);

if (program.build)
    require('./build')(program);
else if (program.plugin)
    require('./plugin')(program);