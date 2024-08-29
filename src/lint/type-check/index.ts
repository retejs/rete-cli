import ts from 'ts-morph'

import { BaseLinter } from '../base'
import { LintResult } from '../results'
import { getMessage } from './messages'

export class TypeCheck implements BaseLinter {
  constructor(private options: { config: string }) {}

  run(): LintResult[] {
    const project = new ts.Project({
      tsConfigFilePath: this.options.config
    })

    const tsDiagnostics = project.getPreEmitDiagnostics()

    return tsDiagnostics.map(diagnostic => {
      const data: LintResult = {
        filePath: diagnostic.getSourceFile()?.getFilePath() ?? '',
        messages: [
          {
            ruleId: 'typescript',
            message: getMessage(diagnostic),
            severity: 2,
            line: diagnostic.getLineNumber() ?? 0,
            endLine: diagnostic.getLineNumber() ?? 0,
            column: diagnostic.getStart() ?? 0,
            endColumn: (diagnostic.getStart() ?? 0) + (diagnostic.getLength() ?? 1)
          }
        ]
      }

      return data
    })
  }
}
