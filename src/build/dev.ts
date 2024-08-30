import chalk from 'chalk'
import ms from 'pretty-ms'
import { RollupOptions, watch } from 'rollup'

import { lint } from '../lint/linter'
import { messages } from './consts'
import { generateTypes } from './gen-types'
import { safeExec } from './utils'

function getIndex(config: RollupOptions | RollupOptions[], output: readonly string[]) {
  if (!Array.isArray(config)) return -1

  return config.findIndex(configItem => {
    const configOutputs = !configItem.output
      ? []
      : Array.isArray(configItem.output)
        ? configItem.output
        : [configItem.output]

    return configOutputs.map(({ file }) => file).find(out => out && output.includes(out))
  })
}

export async function buildDev(name: string, config: RollupOptions | RollupOptions[], outputDirectories: string[]) {
  const watcher = watch(config)

  return new Promise<void>((resolve, reject) => {
    // eslint-disable-next-line max-statements
    watcher.on('event', e => {
      if (e.code === 'START') {
        void safeExec(() => lint({ fix: false, quiet: true, output: ['stdout'] }), messages.lintingFail)
        void safeExec(() => generateTypes(outputDirectories), messages.typesFail)
      } else if (e.code === 'BUNDLE_START') {
        const index = getIndex(config, e.output)
        const indexLabel = index >= 0
          ? `[${index}]`
          : ''

        console.log(chalk.green(`Start building ${name}${indexLabel} ...`))
      } else if (e.code === 'BUNDLE_END') {
        const index = getIndex(config, e.output)
        const duration = ms(e.duration, { secondsDecimalDigits: 1 })
        const indexLabel = index >= 0
          ? `[${index}]`
          : ''

        console.log(chalk.green(`Build ${name}${indexLabel} completed in ${duration}`))
      } else if (e.code === 'ERROR') {
        const { id, loc /* , codeFrame*/ } = e.error

        console.log(chalk.red('Error', e.error.message))
        if (loc) console.log(chalk.green(`${id}:${loc.line}`))
        // log(codeFrame) break
        reject(new Error(e.error.message))
      } else {
        resolve()
      }
    })
  })
}
