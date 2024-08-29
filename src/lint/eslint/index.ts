import { loadESLint } from 'eslint'

import { BaseLinter } from '../base'
import { LintMessage, LintResult } from '../results'

export class ESLint implements BaseLinter {
  constructor(private options: { targets: string[], fix?: boolean }) {}

  async run(): Promise<LintResult[]> {
    const originESLint = await loadESLint({
      useFlatConfig: true
    })

    const instance = new originESLint({
      fix: this.options.fix,
      errorOnUnmatchedPattern: false
    })

    const results = await instance.lintFiles(this.options.targets)

    if (this.options.fix) {
      await originESLint.outputFixes(results)
    }

    return results.map(({ filePath, messages }) => {
      return {
        filePath,
        messages: messages.map(message => {
          const result: LintMessage = {
            column: message.column,
            line: message.line,
            endColumn: message.endColumn ?? message.column,
            endLine: message.endLine ?? message.line,
            ruleId: message.ruleId ?? null,
            message: message.message,
            severity: message.severity
          }

          return result
        })
      }
    })
  }
}
