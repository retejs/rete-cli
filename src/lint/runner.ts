import { BaseLinter } from './base'
import { LintResult, makeRelativePath, mergeResults, mergeRules, RuleMeta } from './results'

export class LinterRunner {
  private linters: BaseLinter[] = []

  addLinter(linter: BaseLinter) {
    this.linters.push(linter)
  }

  async run() {
    const results: LintResult[] = []
    const rules: RuleMeta[] = []

    for (const linter of this.linters) {
      const linterResults = await linter.run()

      results.push(...linterResults.results)
      rules.push(...linterResults.rules)
    }

    return {
      results: mergeResults(results.map(makeRelativePath)),
      rules: mergeRules(rules)
    }
  }
}
