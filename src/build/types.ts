import { InputOption, OutputOptions, RollupOptions } from 'rollup';

export interface ReteOptions {
  input: InputOption;
  name: string;
  output?: string,
  plugins?: RollupOptions['plugins'];
  babel?: {
    presets?: any[]
    plugins?: []
  }
  globals?: OutputOptions['globals'];
}
export type Pkg = { name: string, version: string, author: string, license: string }
export type ReteConfig = ReteOptions | ReteOptions[]
