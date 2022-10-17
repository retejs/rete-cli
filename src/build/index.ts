import { performance } from 'node:perf_hooks';

import { join } from 'path'
import ms from 'pretty-ms'
import { rollup } from 'rollup'

import { lint } from '../lint/linter';
import { getRollupConfig, OutputOptions } from './config'
import { importReteConfig } from './config-importer';
import { messages } from './consts';
import { buildDev } from './dev'
import { generateTypes } from './gen-types';
import { Pkg, ReteOptions } from './types';
import { safeExec } from './utils';

const outputs: OutputOptions[] = [
    { suffix: 'min', format: 'umd', minify: true },
    { suffix: 'esm', format: 'es' },
    { suffix: 'common', format: 'cjs' }
];

async function buildForDev(config: ReteOptions, pkg: Pkg, outputDirectories: string[]) {
    const targetConfig = getRollupConfig(config, outputs, pkg, outputDirectories);

    return await buildDev(config.name, targetConfig, outputDirectories);
}

// eslint-disable-next-line max-statements
async function build(config: ReteOptions, pkg: Pkg, outputDirectories: string[]) {
    const time = performance.now()

    await safeExec(() => generateTypes(outputDirectories), messages.typesFail, 1)
    console.log(messages.typesSuccess)
    await safeExec(lint, messages.lintingFail, 1)
    console.log(messages.lintingSuccess)

    const targetConfig = getRollupConfig(config, outputs, pkg, outputDirectories);
    const bundle = await rollup(targetConfig);

    for (const output of targetConfig.output) {
        await bundle.generate(output);
        await bundle.write(output);
        console.log(`The bundle ${output.format} created`)
    }
    console.log('Completed in', ms(performance.now() - time, { secondsDecimalDigits: 1 }))
}

export default async (configPath: string, watch?: boolean, outputDirectories?: string[]) => {
    const fullPath = join(process.cwd(), configPath)
    const config = importReteConfig(fullPath);

    const packagePath = join(process.cwd(), 'package.json')
    const pkg = require(packagePath);
    const output = outputDirectories || [process.cwd()]

    if (watch) {
        await buildForDev(config, pkg, output)
    } else {
        await build(config, pkg, output)
    }
}
