import execa from 'execa'
import { join, relative } from 'path'

import { SOURCE_FOLDER } from '../consts'

export const typesDirectoryName = '_types'

export function getDTSPath(srcScript: string, distPath: string, packageDirectory: string) {
  const currentTypesDirectory = join(distPath, typesDirectoryName)
  const relInput = relative(SOURCE_FOLDER, join(srcScript))
  const inputTsD = join(currentTypesDirectory, relInput).replace(/\.tsx?/, '.d.ts')
  const typesPath = relative(packageDirectory, inputTsD)

  return typesPath
}

export async function generateTypes(outputDirectories: string[]) {
  for (let i = 0; i < outputDirectories.length; i++) {
    const outputDirectory = outputDirectories[i]

    await execa('tsc', [
      '-d',
      '--pretty',
      '--target', 'es5',
      '--outDir', join(outputDirectory, typesDirectoryName),
      '--skipLibCheck',
      '--declarationMap',
      '--downlevelIteration',
      '--emitDeclarationOnly'
    ], { stdio: i === 0 ? 'inherit' : 'ignore' })
  }
}
