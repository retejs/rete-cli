import { LintResult, RuleMeta } from './results'

export interface LinterResponse {
  rules: RuleMeta[]
  results: LintResult[]
}

export interface BaseLinter {
  run(): LinterResponse | Promise<LinterResponse>
}
