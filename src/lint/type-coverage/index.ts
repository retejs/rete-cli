import { AnyInfo, lint } from 'type-coverage-core'

import { BaseLinter } from '../base'
import { LintResult } from '../results'
import { getMessages } from './messages'

export class TypeCoverage implements BaseLinter {
  constructor(private options: { src: string }) {}

  async run(): Promise<LintResult[]> {
    const result = await lint(this.options.src, { strict: true, notOnlyInCWD: true })

    const groups = result.anys.reduce((acc, any) => {
      if (!acc[any.file]) {
        acc[any.file] = []
      }

      acc[any.file].push(any)
      return acc
    }, {} as Record<string, AnyInfo[]>)

    return Object.entries(groups).map(([file, anys]) => {
      return <LintResult>{
        filePath: file,
        messages: anys.map(any => ({
          ruleId: 'type-coverage-any',
          message: getMessages(any),
          severity: 1,
          line: any.line + 1,
          endLine: any.line + 1,
          column: any.character + 1,
          endColumn: any.character + 1 + (any.text.length || 1)
        }))
      }
    })
  }
}
