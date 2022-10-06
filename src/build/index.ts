import { rollup } from 'rollup'
import { getRollupConfig, OutputOptions } from './config'
import { buildDev } from './dev'
import { Pkg, ReteOptions } from './types';
import { importReteConfig } from './config-importer';
import { generateTypes } from './gen-types';
import chalk from 'chalk'
import { performance } from 'node:perf_hooks';
import ms from 'pretty-ms'
import { safeExec } from './utils';


const outputs: OutputOptions[] = [
    { suffix: 'min', format: 'umd', minify: true },
    { suffix: 'esm', format: 'es' },
    { suffix: 'common', format: 'cjs' }
];

async function resources(configPath: string): Promise<{ config: ReteOptions, pkg: Pkg }> {
    const fullPath = `${process.cwd()}/${configPath}`;
    const packagePath = `${process.cwd()}/package.json`;
    const config = importReteConfig(fullPath);
    const pkg = require(packagePath);

    return { config, pkg };
}

export default async (configPath: string, watch?: boolean) => {
    const time = performance.now()
    const { config, pkg } = await resources(configPath);

    if (watch) {
        const targetConfig = getRollupConfig(config, outputs, pkg);

        return await buildDev(config, targetConfig);
    }

    await safeExec(generateTypes, chalk.redBright('Type generating failed'), 1)
    console.log(chalk.green('Types generated!'))

    const targetConfig = getRollupConfig(config, outputs, pkg);
    const bundle = await rollup(targetConfig);

    for (const output of targetConfig.output) {
        await bundle.generate(output);
        await bundle.write(output);
        console.log(`The bundle ${output.format} created`)
    }
    console.log('Completed in', ms(performance.now() - time, { secondsDecimalDigits: 1 }))
}
