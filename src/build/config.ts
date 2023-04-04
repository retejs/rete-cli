import { babel } from '@rollup/plugin-babel'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import Case from 'case'
import { join } from 'path'
import { OutputOptions as RollupOutputOptions, RollupOptions } from 'rollup'
import copy from 'rollup-plugin-copy'
import { terser } from 'rollup-plugin-terser'

import { SOURCE_FOLDER } from '../consts'
import { getBanner } from './banner'
import { getDTSPath } from './gen-types'
import { preparePackageJson } from './package-json'
import { Pkg, ReteConfig, ReteOptions } from './types'

export type Entry = 'main' | 'module' | 'jsdelivr' | 'unpkg'
export interface OutputOptions {
    suffix: string
    format: RollupOutputOptions['format']
    entries: Entry[]
    minify?: boolean
}

export type RollupConfig = RollupOptions & { output: RollupOutputOptions[] }

export function getRollupConfig(options: ReteConfig, outputs: OutputOptions[], pkg: Pkg, outputDirectories: string[]): ({
  options: ReteOptions,
  config: RollupConfig
}[]) {
  if (Array.isArray(options)) {
    const list = options.map(item => getRollupConfig(item, outputs, pkg, outputDirectories))

    return list.flat()
  }
  const {
    input,
    name,
    output: outputPath = '.',
    plugins = [],
    globals = {},
    babel: babelOptions
  } = options
  const localOutputDirectories = outputDirectories.map(path => join(path, outputPath))
  const extensions = ['.js', '.ts', '.jsx', '.tsx']
  const babelPresets = babelOptions?.presets || [
    [require('@babel/preset-env')],
    require('@babel/preset-typescript')
  ]
  const getBundleName = (suffix: string) => `${Case.kebab(name)}.${suffix}.js`

  if (!join(input).startsWith(SOURCE_FOLDER)) throw new Error(`extected src based input, received ${input}`)

  const getConfig = (head: boolean, bundled: boolean, filteredOutputs: OutputOptions[]) => ({
    input,
    output: filteredOutputs.map(({ suffix, format, minify }) => localOutputDirectories.map(output => ({
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
    external: [
      ...Object.keys(globals),
      /^@babel\/runtime.*$/
    ],
    plugins: [
      ...(head ? [
        copy({
          targets: [
            { src: 'README.md', dest: localOutputDirectories }
          ]
        }),
        ...outputDirectories.map(output => {
          const bundlesPath = join(output, outputPath)

          return preparePackageJson(pkg, bundlesPath, (config) => {
            for (const { suffix, entries } of outputs) {
              for (const entry of entries) {
                config[entry] = getBundleName(suffix)
              }
            }

            config.types = getDTSPath(input, output, bundlesPath)
            config.typings = config.types
          })
        })
      ] : []),
      nodeResolve({
        extensions
      }),
      babel({
        exclude: 'node_modules/**',
        babelrc: false,
        presets: babelPresets,
        plugins: bundled ? babelOptions?.plugins : [
          require('@babel/plugin-transform-runtime'),
          ...(babelOptions?.plugins ? babelOptions.plugins : [])
        ],
        babelHelpers: bundled ? 'bundled' : 'runtime',
        extensions
      }),
      ...plugins
    ]
  })

  return [
    { options, config: getConfig(true, false, outputs.filter(o => o.format !== 'umd')) },
    { options, config: getConfig(false, true, outputs.filter(o => o.format === 'umd')) }
  ]
}
