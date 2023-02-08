import { ReteConfig } from './types'

require('@babel/register')({
    presets: [require('@babel/preset-env').default, require('@babel/preset-typescript').default],
    ignore: [/node_modules/],
    extensions: ['.js', '.ts']
})

export function importReteConfig(path: string): ReteConfig {
    return require(path).default
}
