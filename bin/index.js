#!/usr/bin/env node

const program = require('commander');

program.option('-b --build <config>');
program.option('-w --watch');
program.parse(process.argv);

if (program.build) require('./build')(program);