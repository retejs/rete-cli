import { relative } from 'path'

export type Severity = 1 | 2

export interface LintMessage {
  column: number
  line: number
  endColumn: number
  endLine: number
  ruleId: string | null
  message: string
  severity: Severity
}

export interface LintResult {
  filePath: string
  messages: LintMessage[]
}

export function makeRelativePath<T extends LintResult>(result: T): T {
  return {
    ...result,
    filePath: relative(process.cwd(), result.filePath)
  }
}

export function mergeResults<T extends LintResult>(results: T[]): T[] {
  return results.reduce<T[]>((acc, result) => {
    const existingResult = acc.find(r => r.filePath === result.filePath)

    if (existingResult) {
      existingResult.messages.push(...result.messages)
    } else {
      acc.push(result)
    }

    return acc
  }, [])
}
