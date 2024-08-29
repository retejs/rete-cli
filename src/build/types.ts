import { RollupNodeResolveOptions } from '@rollup/plugin-node-resolve'
import { OutputOptions, RollupOptions } from 'rollup'

export interface ReteOptions {
  input: string
  name: string
  output?: string
  plugins?: RollupOptions['plugins']
  babel?: {
    presets?: any[]
    plugins?: any[]
  }
  nodeResolve?: RollupNodeResolveOptions | false
  globals?: OutputOptions['globals']
}
export type Pkg = { name: string, version: string, author: string, license: string, scripts?: Record<string, string> }
export type ReteConfig = ReteOptions | ReteOptions[]
