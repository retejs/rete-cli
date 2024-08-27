import { join } from 'path'

import { SOURCE_FOLDER } from '../consts'
import { ESLint } from './eslint'
import { Formatter } from './formatter'
import { makeRelativePath, mergeResults } from './results'
import { TypeCheck } from './type-check'
import { TypeCoverage } from './type-coverage'

export async function lint(fix?: boolean, quiet?: boolean) {
  const src = join(process.cwd(), SOURCE_FOLDER)

  const linters = [
    new ESLint({ src, fix }),
    new TypeCoverage({ src }),
    new TypeCheck({ config: 'tsconfig.json' })
  ]

  const allResults = (await Promise.all(linters.map(linter => linter.run())))
    .flat()
    .map(makeRelativePath)
  const mergedResults = mergeResults(allResults)

  const errorResults = mergedResults.map(result => {
    return {
      ...result,
      messages: result.messages.filter(message => message.severity === 2)
    }
  })
  const formatter = new Formatter()
  const resultText = await formatter.format(quiet ? errorResults : mergedResults)

  console.log(resultText)
}
