import { lint, LintOptions } from './linter'

export default async function (options: LintOptions) {
  try {
    await lint(options)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}
