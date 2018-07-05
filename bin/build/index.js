const { rollup, watch } = require('rollup');
const buildConfig = require('./config');

require('babel-register')({
    presets: [require('babel-preset-env')]
})

function resources(program) {
    let configPath = `${process.cwd()}/${program.build}`;
    let packagePath = `${process.cwd()}/package.json`;
    let config = require(configPath).default;
    let pkg = require(packagePath);

    return { config, pkg };
}

function log(...s) {
    console.log('\x1b[32m%s\x1b[0m', ...s);
}

function error(...s) {
    console.log('\x1b[31m%s\x1b[0m', ...s);
}

module.exports = async (program) => {
    let { config, pkg } = resources(program);
    let configs = config instanceof Array?config:[config];

    for (let sourceConfig of configs) {
        let targetConfig = buildConfig(sourceConfig, pkg);

        if (program.watch) {
            let watcher = await watch(targetConfig);

            watcher.on('event', e => {
                switch (e.code) {
                case 'START': break;
                case 'BUNDLE_START': log(`Start building ${sourceConfig.name} ...`); break;
                case 'BUNDLE_END': log(`Build ${sourceConfig.name} completed in ${(e.duration/1000).toFixed(2)} sec`); break;
                case 'END': break;
                default: 
                    let { id, loc, codeFrame } = e.error;

                    error('Error', e.error.message);
                    log(id+':'+loc.line);
                    log(codeFrame); break;
                }
            });
        } else {
            let bundle = await rollup(targetConfig);

            await bundle.generate(targetConfig.output);
            await bundle.write(targetConfig.output);
        }
    }
}