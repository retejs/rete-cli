import { join } from 'path'

import { SOURCE_FOLDER, TEST_FOLDER } from '../consts'
import { ESLint } from './eslint'
import { Formatter } from './formatter'
import { LinterRunner } from './runner'
import { TypeCheck } from './type-check'
import { TypeCoverage } from './type-coverage'

export async function lint(fix?: boolean, quiet?: boolean) {
  const src = join(process.cwd(), SOURCE_FOLDER)
  const test = join(process.cwd(), TEST_FOLDER)

  const runner = new LinterRunner()

  runner.addLinter(new ESLint({ targets: [src, test], fix }))
  runner.addLinter(new TypeCoverage({ src }))
  runner.addLinter(new TypeCheck({ config: 'tsconfig.json' }))

  const results = await runner.run()
  const errorResults = results.map(result => {
    return {
      ...result,
      messages: result.messages.filter(message => message.severity === 2)
    }
  })
  const formatter = new Formatter()
  const resultText = await formatter.format(quiet
    ? errorResults
    : results)

  console.log(resultText)
}
