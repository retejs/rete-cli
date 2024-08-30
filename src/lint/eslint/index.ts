import { loadESLint } from 'eslint'

import { BaseLinter } from '../base'
import { LintMessage, RuleMeta } from '../results'

export class ESLint implements BaseLinter {
  constructor(private options: { targets: string[], fix?: boolean }) {}

  async run() {
    const originESLint = await loadESLint({
      useFlatConfig: true
    })

    const instance = new originESLint({
      fix: this.options.fix,
      errorOnUnmatchedPattern: false
    })

    const eslintResults = await instance.lintFiles(this.options.targets)

    if (this.options.fix) {
      await originESLint.outputFixes(eslintResults)
    }

    const results = eslintResults.map(({ filePath, messages }) => {
      return {
        filePath,
        messages: messages.map(message => {
          return {
            column: message.column,
            line: message.line,
            endColumn: message.endColumn,
            endLine: message.endLine,
            ruleId: message.ruleId ?? null,
            message: message.message,
            severity: message.severity
          } satisfies LintMessage
        })
      }
    })
    const allMessages = eslintResults.flatMap(({ messages }) => messages)
    const rules = Object.entries(instance.getRulesMetaForResults(eslintResults))
      .map(([id, { docs }]) => {
        const firstMessage = allMessages.find(({ ruleId }) => ruleId === id)

        return {
          id,
          description: docs?.description,
          severity: firstMessage?.severity ?? 1
        } satisfies RuleMeta
      })

    return {
      results,
      rules
    }
  }
}
