import execa from 'execa'
import { join } from 'path'

export async function generateTypes(outputDirectories: string[]) {
    for (const outputDirectory of outputDirectories) {
        await execa('tsc', [
            '-d',
            '--target', 'es5',
            '--outDir', join(outputDirectory, 'types'),
            '--skipLibCheck',
            '--declarationMap',
            '--downlevelIteration',
            '--emitDeclarationOnly'
        ], { stdio: 'inherit' })
    }
}
