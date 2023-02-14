import execa from 'execa'
import { join } from 'path'

import { SOURCE_FOLDER } from '../consts'

export async function lint(fix?: boolean, quiet?: boolean) {
  const path = join(process.cwd(), '.eslintrc')

  await execa('eslint', [
    '-c', path, join(process.cwd(), SOURCE_FOLDER),
    '--ext', '.ts,.tsx',
    ...(quiet ? ['--quiet'] : []),
    ...(fix ? ['--fix'] : [])
  ], { stdio: 'inherit' })
}
