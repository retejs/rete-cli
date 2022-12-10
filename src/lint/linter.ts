import execa from 'execa'
import { join } from 'path'

export async function lint(fix?: boolean, quiet?: boolean) {
    const path = join(process.cwd(), '.eslintrc')

    await execa('eslint', [
        '-c', path, join(process.cwd(), 'src'),
        '--ext', '.ts,.tsx',
        ...(quiet ? ['--quiet'] : []),
        ...(fix ? ['--fix'] : [])
    ], { stdio: 'inherit' })
}
