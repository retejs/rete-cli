import { babel } from '@rollup/plugin-babel'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import Case from 'case'
import { join } from 'path'
import { OutputOptions as RollupOutputOptions, RollupOptions } from 'rollup'
import copy from 'rollup-plugin-copy'
import { terser } from 'rollup-plugin-terser'

import { SOURCE_FOLDER } from '../consts'
import { getBanner } from './banner'
import { typesEntry } from './gen-types'
import { preparePackageJson } from './package-json'
import { Pkg, ReteConfig, ReteOptions } from './types'

export type Entry = 'main' | 'module' | 'jsdelivr' | 'unpkg'
export interface OutputOptions {
    suffix: string
    format: RollupOutputOptions['format']
    entries: Entry[]
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

    if (!join(input).startsWith(SOURCE_FOLDER)) throw new Error(`extected src based input, received ${input}`)

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
            include: `${SOURCE_FOLDER}/**`
        },
        external: Object.keys(globals),
        plugins: [
            copy({
                targets: [
                    { src: 'README.md', dest: outputDistDirectories }
                ]
            }),
            preparePackageJson('.', outputDistDirectories, config => {
                for (const { suffix, entries } of outputs) {
                    for (const entry of entries) {
                        config[entry] = getBundleName(suffix)
                    }
                }
                config.types = typesEntry
                config.typings = typesEntry
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
