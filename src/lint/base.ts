import { LintResult } from './results'

export interface BaseLinter {
  run(): LintResult[] | Promise<LintResult[]>
}
