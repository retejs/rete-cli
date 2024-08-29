import { describe, expect, it, jest } from '@jest/globals'
import { ESLint } from 'eslint'

import { Formatter } from '../../src/lint/formatter'
import { LintMessage, LintResult } from '../../src/lint/results'

jest.mock('eslint', () => ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  ESLint: jest.fn()
}))

const message1: LintMessage = {
  column: 1,
  endColumn: 1,
  line: 1,
  endLine: 1,
  ruleId: 'rule1',
  message: 'message1',
  severity: 1
}
const message2: LintMessage = {
  column: 3,
  endColumn: 4,
  line: 1,
  endLine: 1,
  ruleId: 'rule1',
  message: 'message2',
  severity: 2
}
const message3: LintMessage = {
  column: 1,
  endColumn: 1,
  line: 3,
  endLine: 4,
  ruleId: 'rule1',
  message: 'message3',
  severity: 2
}
const result1: LintResult = {
  filePath: 'file1',
  messages: [
    message1
  ]
}

function mockEslint() {
  const format = jest.fn().mockReturnValue('formatted')

  ;(ESLint as unknown as jest.Mock<any>).mockImplementation(() => ({
    loadFormatter: jest.fn<any>().mockResolvedValue({
      format
    })
  }))

  return { format }
}

describe('Formatter', () => {
  it('accepts eslint compatible results', async () => {
    const { format } = mockEslint()
    const formatter = new Formatter()

    expect(await formatter.format([result1])).toBe('formatted')
    expect(format).toHaveBeenCalledWith([
      {
        ...result1,
        errorCount: expect.any(Number),
        fatalErrorCount: expect.any(Number),
        fixableErrorCount: expect.any(Number),
        fixableWarningCount: expect.any(Number),
        suppressedMessages: expect.any(Array),
        usedDeprecatedRules: expect.any(Array),
        warningCount: expect.any(Number)
      }
    ], expect.any(Object))
  })

  it('sum up error and warning counts', async () => {
    const { format } = mockEslint()
    const formatter = new Formatter()

    await formatter.format([
      {
        ...result1,
        messages: [
          message1,
          message2,
          message3
        ]
      }
    ])

    expect(format).toHaveBeenCalledWith([
      {
        ...result1,
        messages: [
          message1,
          message2,
          message3
        ],
        errorCount: 2,
        fatalErrorCount: 0,
        fixableErrorCount: 0,
        fixableWarningCount: 0,
        suppressedMessages: [],
        usedDeprecatedRules: [],
        warningCount: 1
      }
    ], expect.any(Object))
  })

  it('sorts messages by line and column', async () => {
    const { format } = mockEslint()
    const formatter = new Formatter()

    await formatter.format([
      {
        ...result1,
        messages: [
          message3,
          message2,
          message1
        ]
      }
    ])

    expect(format).toHaveBeenCalledWith([
      {
        ...result1,
        messages: [
          message1,
          message2,
          message3
        ],
        errorCount: expect.any(Number),
        fatalErrorCount: expect.any(Number),
        fixableErrorCount: expect.any(Number),
        fixableWarningCount: expect.any(Number),
        suppressedMessages: expect.any(Array),
        usedDeprecatedRules: expect.any(Array),
        warningCount: expect.any(Number)
      }
    ], expect.any(Object))
  })

  it('normalizes messages by replacing new lines', async () => {
    const { format } = mockEslint()
    const formatter = new Formatter()

    await formatter.format([
      {
        ...result1,
        messages: [
          {
            ...message1,
            message: 'message\na\t\nb  \nc'
          }
        ]
      }
    ])

    expect(format).toHaveBeenCalledWith([
      {
        ...result1,
        messages: [
          {
            ...message1,
            message: 'message a b c'
          }
        ],
        errorCount: expect.any(Number),
        fatalErrorCount: expect.any(Number),
        fixableErrorCount: expect.any(Number),
        fixableWarningCount: expect.any(Number),
        suppressedMessages: expect.any(Array),
        usedDeprecatedRules: expect.any(Array),
        warningCount: expect.any(Number)
      }
    ], expect.any(Object))
  })
})
