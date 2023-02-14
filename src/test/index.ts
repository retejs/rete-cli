import execa from 'execa'

export default async function () {
  try {
    await execa('jest', [
      '--preset', 'ts-jest',
      '--coverage',
      '--testEnvironment', 'node',
      '--testMatch', '**/*.test.ts'
    ], { stdio: 'inherit' })
  } catch (e) {
    process.exit(1)
  }
}
