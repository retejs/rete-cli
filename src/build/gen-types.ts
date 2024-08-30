import execa from 'execa'
import fs from 'fs'
import { join, relative } from 'path'

import { SOURCE_FOLDER } from '../consts'
import { ExecError, readTSConfig } from './utils'

export const typesDirectoryName = '_types'

export function getDTSPath(srcScript: string, distPath: string, packageDirectory: string) {
  const currentTypesDirectory = join(distPath, typesDirectoryName)
  const relInput = relative(SOURCE_FOLDER, join(srcScript))
  const inputTsD = join(currentTypesDirectory, relInput).replace(/\.tsx?/, '.d.ts')
  const typesPath = relative(packageDirectory, inputTsD)

  return typesPath
}

export async function generateTypes(outputDirectories: string[]) {
  const config = await readTSConfig(process.cwd())
  const target = config?.compilerOptions?.target ?? 'es5'
  const includeFolders = config?.include

  for (let i = 0; i < outputDirectories.length; i++) {
    const outputDirectory = outputDirectories[i]
    const typesDir = join(outputDirectory, typesDirectoryName)

    await execa('tsc', [
      '-d',
      '--pretty',
      '--target', target,
      '--outDir', typesDir,
      '--skipLibCheck',
      '--declarationMap',
      '--downlevelIteration',
      '--emitDeclarationOnly'
    ], { stdio: i === 0
      ? 'inherit'
      : 'ignore' })

    if (includeFolders && includeFolders.length > 1) {
      await normalizeTypes(outputDirectory, typesDir)
    }
  }
}

/**
 * move the src folder to the root of the types directory
 */
async function normalizeTypes(outputDirectory: string, typesDir: string) {
  const existsSrcFolder = await fs.promises.access(join(typesDir, SOURCE_FOLDER))
    .then(() => true)
    .catch(() => false)
  const tmp = join(outputDirectory, '_tmp')

  if (!existsSrcFolder) throw new ExecError('src folder not found when multiple include are specified')

  await fs.promises.rename(typesDir, tmp)
  await fs.promises.rename(join(tmp, SOURCE_FOLDER), typesDir)
  await fs.promises.rm(tmp, { recursive: true })
}

