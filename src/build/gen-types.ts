import execa from 'execa'

export async function generateTypes() {
    await execa('tsc', [
        '-d',
        '--target', 'es5',
        '--outDir', 'types',
        '--skipLibCheck',
        '--declarationMap',
        '--downlevelIteration',
        '--emitDeclarationOnly'
    ], { stdio: 'inherit' })
}
