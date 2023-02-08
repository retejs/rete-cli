import { babel } from '@rollup/plugin-babel'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import Case from 'case'
import { join } from 'path'
import { OutputOptions as RollupOutputOptions, RollupOptions } from 'rollup'
import { terser } from 'rollup-plugin-terser'

import { getBanner } from './banner'
import { Pkg, ReteConfig, ReteOptions } from './types'

export interface OutputOptions {
    suffix: string;
    format: RollupOutputOptions['format'];
    minify?: boolean
}

type RollupConfig = RollupOptions & { output: RollupOutputOptions[] }

export function getRollupConfig(options: ReteOptions, outputs: OutputOptions[], pkg: Pkg, outputDirectories: string[]): RollupConfig;
export function getRollupConfig(options: ReteOptions[], outputs: OutputOptions[], pkg: Pkg, outputDirectories: string[]): RollupConfig[];
export function getRollupConfig(options: ReteConfig, outputs: OutputOptions[], pkg: Pkg, outputDirectories: string[]): RollupConfig | RollupConfig[];
export function getRollupConfig(options: ReteConfig, outputs: OutputOptions[], pkg: Pkg, outputDirectories: string[]): RollupConfig | RollupConfig[] {
    if (Array.isArray(options)) {
        const list = options.map(item => getRollupConfig(item, outputs, pkg, outputDirectories))

        return list
    }
    const {
        input,
        name,
        output: outputPath = 'build',
        plugins = [],
        globals = {},
        babel: babelOptions
    } = options
    const extensions = ['.js', '.ts', '.jsx', '.tsx']

    return {
        input,
        output: outputs.map(({ suffix, format, minify }) => outputDirectories.map(output => ({
            file: join(output, outputPath, `${Case.kebab(name)}.${suffix}.js`),
            name,
            format,
            sourcemap: true,
            banner: getBanner(pkg),
            globals,
            exports: 'named' as const,
            plugins: minify ? [terser()] : []
        }))).flat(),
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
                    require('@babel/preset-typescript'),
                    ...(babelOptions?.presets || [])
                ],
                babelHelpers: 'bundled',
                extensions
            }),
            ...plugins
        ]
    }
}
