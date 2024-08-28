import { BaseLinter } from './base'
import { LintResult, makeRelativePath, mergeResults } from './results'

export class LinterRunner {
  private linters: BaseLinter[] = []

  addLinter(linter: BaseLinter) {
    this.linters.push(linter)
  }

  async run() {
    const results: LintResult[] = []

    for (const linter of this.linters) {
      const linterResults = await linter.run()

      results.push(...linterResults)
    }

    return mergeResults(results.map(makeRelativePath))
  }
}
