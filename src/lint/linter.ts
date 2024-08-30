import fs from 'fs'
import { join } from 'path'

import { RESULTS_FOLDER, SOURCE_FOLDER, TEST_FOLDER } from '../consts'
import { ESLint } from './eslint'
import { Formatter } from './formatter'
import { LinterRunner } from './runner'
import { toSonar } from './sonar'
import { TypeCheck } from './type-check'
import { TypeCoverage } from './type-coverage'

export interface LintOptions {
  fix?: boolean
  quiet?: boolean
  output: ('stdout' | 'sonar')[]
}

// eslint-disable-next-line max-statements
export async function lint(options: LintOptions) {
  const src = join(process.cwd(), SOURCE_FOLDER)
  const test = join(process.cwd(), TEST_FOLDER)

  if (options.output.length === 0) throw new Error('At least one output target must be specified')

  const runner = new LinterRunner()

  runner.addLinter(new ESLint({ targets: [src, test], fix: options.fix }))
  runner.addLinter(new TypeCoverage({ src }))
  runner.addLinter(new TypeCheck({ config: 'tsconfig.json' }))

  const { results, rules } = await runner.run()

  if (options.output.includes('sonar')) {
    const fileContent = JSON.stringify(toSonar(results, rules), null, 2)
    const filePath = join(process.cwd(), RESULTS_FOLDER, 'sonar.json')

    await fs.promises.mkdir(join(process.cwd(), RESULTS_FOLDER), { recursive: true })
    await fs.promises.writeFile(filePath, fileContent)
  }

  if (options.output.includes('stdout')) {
    const errorResults = results.map(result => {
      return {
        ...result,
        messages: result.messages.filter(message => message.severity === 2)
      }
    })

    const formatter = new Formatter()
    const resultText = await formatter.format(options.quiet
      ? errorResults
      : results)

    console.log(resultText)
  }
}
