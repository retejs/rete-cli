import execa from 'execa'
import { join } from 'path'

export const typesDirectory = 'types'
export const typesEntry = join(typesDirectory, 'index.d.ts')

export async function generateTypes(outputDirectories: string[]) {
    for (const outputDirectory of outputDirectories) {
        await execa('tsc', [
            '-d',
            '--target', 'es5',
            '--outDir', join(outputDirectory, typesDirectory),
            '--skipLibCheck',
            '--declarationMap',
            '--downlevelIteration',
            '--emitDeclarationOnly'
        ], { stdio: 'inherit' })
    }
}
