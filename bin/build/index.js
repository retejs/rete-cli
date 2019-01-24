const { rollup } = require('rollup');
const buildConfig = require('./config');
const { buildDev } = require('./dev');

require('@babel/register')({
    presets: ['env'],
    ignore: [/node_modules/]
})

function resources(program) {
    let configPath = `${process.cwd()}/${program.build}`;
    let packagePath = `${process.cwd()}/package.json`;
    let config = require(configPath).default;
    let pkg = require(packagePath);

    return { config, pkg };
}

module.exports = async (program) => {
    let { config, pkg } = resources(program);
    let configs = config instanceof Array?config:[config];

    for (let sourceConfig of configs) {
        if (program.watch) {
            let targetConfig = buildConfig(sourceConfig, pkg, true);
            
            await buildDev(sourceConfig, targetConfig)
        } else for (let esm of [true, false]) {
            let targetConfig = buildConfig(sourceConfig, pkg, esm);
            let bundle = await rollup(targetConfig);

            await bundle.generate(targetConfig.output);
            await bundle.write(targetConfig.output);
        }
    }
}