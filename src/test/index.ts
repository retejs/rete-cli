import execa from 'execa'

export default async function (watch?: boolean) {
  try {
    await execa('jest', [
      '--preset', 'ts-jest',
      '--coverage',
      '--testEnvironment', 'node',
      '--collectCoverageFrom', 'src/**/*',
      '--testMatch', '**/*.test.ts',
      ...(watch ? ['--watch'] : [])
    ], { stdio: 'inherit' })
  } catch (e) {
    process.exit(1)
  }
}
