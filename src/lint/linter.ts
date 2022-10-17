import execa from 'execa'
import { join } from 'path'

export async function lint(fix?: boolean) {
  const path = join(process.cwd(), '.eslintrc')

  await execa('eslint', ['-c', path, join(process.cwd(), 'src'), '--ext', '.ts', ...(fix ? ['--fix'] : [])], { stdio: 'inherit' })
}
