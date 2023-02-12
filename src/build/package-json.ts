/* eslint-disable no-undefined */
import fs from 'fs'
import { join } from 'path'
import { Plugin } from 'rollup'

export function preparePackageJson(source: string, target: string | string[], modify: (config: Record<string, string>) => void): Plugin {
    return {
        name: 'prepare source json',
        async buildEnd() {
            const sourceConfigPath = join(source, 'package.json')
            const targetConfigPaths = (Array.isArray(target) ? target : [target]).map(path => join(path, 'package.json'))
            const packageJson = JSON.parse(await fs.promises.readFile(sourceConfigPath, { encoding: 'utf-8' }))

            const newConfig = {
                ...packageJson,
                devDependencies: undefined,
                scripts: undefined
            }

            modify(newConfig)

            for (const path of targetConfigPaths) {
                await fs.promises.writeFile(path, JSON.stringify(newConfig, null, 2))
            }
        }
    }
}
