/* eslint-disable no-undefined */
import fs from 'fs'
import { join } from 'path'
import { Plugin } from 'rollup'

import { Pkg } from './types'

export function preparePackageJson(pkg: Pkg, target: string, modify: (config: Record<string, unknown>) => void): Plugin {
  return {
    name: 'prepare source json',
    async buildEnd() {
      const targetConfigPath = join(target, 'package.json')

      const newConfig: Record<string, unknown> = { ...pkg }

      delete newConfig.devDependencies
      delete newConfig.scripts

      if (pkg.scripts?.postinstall) {
        newConfig.scripts = {
          postinstall: pkg.scripts.postinstall
        }
      }

      modify(newConfig)

      await fs.promises.mkdir(target, { recursive: true })
      await fs.promises.writeFile(targetConfigPath, JSON.stringify(newConfig, null, 2))
    }
  }
}
