/* eslint-disable @typescript-eslint/naming-convention */
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals'

import { ESLint } from '../../src/lint/eslint'
import { Formatter } from '../../src/lint/formatter'
import { lint } from '../../src/lint/linter'
import { TypeCheck } from '../../src/lint/type-check'
import { TypeCoverage } from '../../src/lint/type-coverage'

const message1 = {
  column: 1,
  endColumn: 2,
  line: 1,
  endLine: 1,
  ruleId: 'rule1',
  message: 'message1',
  severity: 1
}
const message2 = {
  column: 1,
  endColumn: 2,
  line: 1,
  endLine: 1,
  ruleId: 'rule1',
  message: 'message2',
  severity: 1
}

jest.mock('../../src/lint/eslint', () => ({
  ESLint: jest.fn()
}))
jest.mock('../../src/lint/type-coverage', () => ({
  TypeCoverage: jest.fn()
}))
jest.mock('../../src/lint/type-check', () => ({
  TypeCheck: jest.fn()
}))
jest.mock('../../src/lint/formatter', () => ({
  Formatter: jest.fn()
}))

describe('Linter', () => {
  beforeEach(() => {
    // eslint-disable-next-line no-undef
    jest.spyOn(console, 'log').mockImplementation(() => jest.fn())
  })
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('merges results by file path', async () => {
    const format = jest.fn<any>().mockResolvedValue('')

    ;(Formatter as jest.Mock<any>).mockImplementation(() => ({
      format
    }))

    ;(ESLint as jest.Mock<any>).mockReturnValue({
      run: () => ({ filePath: 'file1', messages: [message1] })
    })
    ;(TypeCoverage as jest.Mock<any>).mockReturnValue({
      run: () => ({ filePath: 'file1', messages: [message2] })
    })
    ;(TypeCheck as jest.Mock<any>).mockReturnValue({
      run: () => ({ filePath: 'file2', messages: [message1] })
    })

    await lint()

    expect(format).toHaveBeenCalledTimes(1)
    expect(format).toHaveBeenCalledWith([
      {
        filePath: 'file1',
        messages: [message1, message2]
      },
      {
        filePath: 'file2',
        messages: [message1]
      }
    ])
  })
})
