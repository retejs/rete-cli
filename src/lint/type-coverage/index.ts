import { AnyInfo, lint } from 'type-coverage-core'

import { BaseLinter } from '../base'
import { LintResult, RuleMeta } from '../results'
import { getMessages } from './messages'
import { getRawDescription, getRuleId } from './rules'

export class TypeCoverage implements BaseLinter {
  constructor(private options: { src: string }) {}

  async run() {
    const result = await lint(this.options.src, { strict: true, notOnlyInCWD: true })

    const groups = result.anys.reduce<Record<string, AnyInfo[]>>((acc, any) => {
      acc[any.file].push(any)
      return acc
    }, Object.fromEntries(result.anys.map(any => [any.file, []])))

    const results = Object.entries(groups).map(([file, anys]) => {
      return {
        filePath: file,
        messages: anys.map(any => {
          const line = any.line + 1
          const column = any.character + 1
          const lines = any.text.split('\n')
          const [firstLine, ...rest] = lines
          const lastLine = [...rest].pop() ?? firstLine

          return {
            ruleId: getRuleId(any),
            message: getMessages(any),
            severity: 1,
            line,
            endLine: line + lines.length - 1,
            column,
            endColumn: lines.length === 1
              ? column + lastLine.length
              : lastLine.length
          }
        })
      } satisfies LintResult
    })
    const rules = Object.entries(groups)
      .flatMap(item => item[1])
      .map(any => {
        return {
          id: getRuleId(any),
          description: getRawDescription(any),
          severity: 1
        } satisfies RuleMeta
      })

    return {
      results,
      rules
    }
  }
}
