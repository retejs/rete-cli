import { InputOption, OutputOptions, RollupOptions } from 'rollup';

export interface ReteOptions {
  input: InputOption;
  name: string;
  plugins?: RollupOptions['plugins'];
  globals?: OutputOptions['globals'];
}
export type Pkg = { name: string, version: string, author: string, license: string }
