import { babel } from '@rollup/plugin-babel'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import Case from 'case'
import { join } from 'path'
import { OutputOptions as RollupOutputOptions, RollupOptions } from 'rollup'
import { terser } from 'rollup-plugin-terser'

import { getBanner } from './banner'
import { Pkg, ReteOptions } from './types'

export interface OutputOptions {
    suffix: string;
    format: RollupOutputOptions['format'];
    minify?: boolean
}

type RollupConfig = RollupOptions & { output: RollupOutputOptions[] }

export function getRollupConfig(options: ReteOptions, outputs: OutputOptions[], pkg: Pkg, outputDirectory: string): RollupConfig {
    const {
        input,
        name,
        plugins = [],
        globals = {}
    } = options
    const extensions = ['.js', '.ts', '.jsx', '.tsx']

    return {
        input,
        output: outputs.map(({ suffix, format, minify }) => ({
            file: join(outputDirectory, 'build', `${Case.kebab(name)}.${suffix}.js`),
            name,
            format,
            sourcemap: true,
            banner: getBanner(pkg),
            globals,
            exports: 'named',
            plugins: minify ? [terser()] : []
        })),
        watch: {
            include: 'src/**'
        },
        external: Object.keys(globals),
        plugins: [
            nodeResolve({
                extensions
            }),
            babel({
                exclude: 'node_modules/**',
                babelrc: false,
                presets: [
                    require('@babel/preset-typescript')
                ],
                babelHelpers: 'bundled',
                extensions
            }),
            ...plugins
        ]
    }
}
