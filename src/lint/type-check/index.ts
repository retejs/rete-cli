import ts from 'ts-morph'

import { BaseLinter } from '../base'
import { LintResult, RuleMeta } from '../results'
import { getMessage } from './messages'
import { getRawDescription, getRuleId } from './rules'

export class TypeCheck implements BaseLinter {
  constructor(private options: { config: string }) {}

  run() {
    const project = new ts.Project({
      tsConfigFilePath: this.options.config
    })

    const tsDiagnostics = project.getPreEmitDiagnostics()

    const results = tsDiagnostics.map(diagnostic => {
      const file = diagnostic.getSourceFile()
      const start = diagnostic.getStart()

      if (!file) throw new Error('No source file found')
      if (start === undefined) throw new Error('No start position found')

      const { line, column } = file.getLineAndColumnAtPos(start)
      const length = diagnostic.getLength()
      const endColumn = length !== undefined
        ? column + length
        : undefined

      return {
        filePath: file.getFilePath(),
        messages: [
          {
            ruleId: getRuleId(diagnostic),
            message: getMessage(diagnostic),
            severity: 2,
            line: line,
            column: column,
            endColumn: endColumn
          }
        ]
      } satisfies LintResult
    })
    const rules = tsDiagnostics.map(diagnostic => {
      return {
        id: getRuleId(diagnostic),
        description: getRawDescription(diagnostic.getCode()),
        severity: diagnostic.getCategory() === ts.DiagnosticCategory.Error
          ? 2
          : 1
      } satisfies RuleMeta
    })

    return {
      results,
      rules
    }
  }
}
