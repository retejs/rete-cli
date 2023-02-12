import { babel } from '@rollup/plugin-babel'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import Case from 'case'
import { join } from 'path'
import { OutputOptions as RollupOutputOptions, RollupOptions } from 'rollup'
import copy from 'rollup-plugin-copy'
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
        output: outputPath = '.',
        plugins = [],
        globals = {},
        babel: babelOptions
    } = options
    const outputDistDirectories = outputDirectories.map(path => join(path, outputPath))
    const extensions = ['.js', '.ts', '.jsx', '.tsx']
    const babelPresets = babelOptions?.presets || [
        [require('@babel/preset-env'), { targets: '> 0.5%' }],
        require('@babel/preset-typescript')
    ]
    const getBundleName = (suffix: string) => `${Case.kebab(name)}.${suffix}.js`

    return {
        input,
        output: outputs.map(({ suffix, format, minify }) => outputDistDirectories.map(output => ({
            file: join(output, getBundleName(suffix)),
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
            copy({
                targets: [
                    { src: 'README.md', dest: outputDistDirectories },
                    { src: 'package.json', dest: outputDistDirectories }
                ]
            }),
            nodeResolve({
                extensions
            }),
            babel({
                exclude: 'node_modules/**',
                babelrc: false,
                presets: babelPresets,
                plugins: babelOptions?.plugins,
                babelHelpers: 'bundled',
                extensions
            }),
            ...plugins
        ]
    }
}
