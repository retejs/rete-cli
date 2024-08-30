import { ESLint } from 'eslint'

import { LintResult } from './results'

export class Formatter {
  private eslint: ESLint

  constructor() {
    this.eslint = new ESLint()
  }

  private toESLintResult(result: LintResult): ESLint.LintResult {
    return {
      filePath: result.filePath,
      messages: result.messages.map(message => {
        return {
          column: message.column,
          line: message.line,
          endColumn: message.endColumn,
          endLine: message.endLine,
          ruleId: message.ruleId,
          message: message.message,
          severity: message.severity
        }
      }),
      errorCount: result.messages.filter(message => message.severity === 2).length,
      warningCount: result.messages.filter(message => message.severity === 1).length,
      fixableErrorCount: 0,
      fixableWarningCount: 0,
      suppressedMessages: [],
      fatalErrorCount: 0,
      usedDeprecatedRules: []
    }
  }

  private sortMessages(result: LintResult) {
    const messages = [...result.messages]

    messages.sort((a, b) => {
      if (a.line === b.line) {
        return a.column - b.column
      }

      return a.line - b.line
    })

    return {
      ...result,
      messages
    }
  }

  private normalizeMessages(result: LintResult) {
    const messages = result.messages.map(message => {
      return {
        ...message,
        message: message.message.split(/\n/g)
          .map(line => line.trim())
          .join(' ')
      }
    })

    return {
      ...result,
      messages
    }
  }

  async format(results: LintResult[]) {
    const formatter = await this.eslint.loadFormatter('stylish')

    return formatter.format(
      results
        .map(result => this.normalizeMessages(result))
        .map(result => this.sortMessages(result))
        .map(result => this.toESLintResult(result)),
      {
        cwd: process.cwd(),
        rulesMeta: {}
      }
    )
  }
}
