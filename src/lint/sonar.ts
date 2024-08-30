import { LintMessage, LintResult, RuleMeta } from './results'

interface Rule {
  id: string
  name: string
  description?: string
  engineId: string
  cleanCodeAttribute: 'FORMATTED' | 'CONVENTIONAL'
  impacts: {
    softwareQuality: 'MAINTAINABILITY' | 'RELIABILITY' | 'SECURITY'
    severity: 'HIGH' | 'MEDIUM' | 'LOW'
  }[]
}

interface Location {
  message: string
  filePath: string
  textRange: {
    startLine: number
    startColumn?: number
    endLine?: number
    endColumn?: number
  }
}

interface Issue {
  ruleId: string
  effortMinutes?: number
  primaryLocation: Location
  secondaryLocations?: Location[]
}

export interface Sonar {
  rules: Rule[]
  issues: Issue[]
}

interface MessageWithRuleId {
  filePath: string
  message: LintMessage & { ruleId: string }
}

export function toSonar(results: LintResult[], rules: RuleMeta[]): Sonar {
  const issues = results
    .flatMap(result => result.messages.map(message => ({ message, filePath: result.filePath })))
    .filter((issue): issue is MessageWithRuleId => issue.message.ruleId !== null)

  return {
    issues: issues.map(issue => {
      const { filePath, message } = issue

      return {
        ruleId: message.ruleId,
        primaryLocation: {
          message: message.message,
          filePath,
          textRange: {
            startLine: message.line,
            startColumn: message.column - 1,
            endLine: message.endLine,
            endColumn: message.endColumn === undefined
              ? undefined
              : message.endColumn - 1
          }
        }
      } satisfies Issue
    }),
    rules: rules.map(rule => {
      return {
        id: rule.id,
        name: rule.id,
        description: rule.description,
        engineId: 'rete-cli',
        cleanCodeAttribute: 'FORMATTED',
        impacts: [{
          softwareQuality: 'MAINTAINABILITY',
          severity: rule.severity === 2
            ? 'HIGH'
            : 'MEDIUM'
        }]
      } satisfies Rule
    })
  }
}
