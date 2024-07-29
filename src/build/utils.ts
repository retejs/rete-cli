import { parse } from 'comment-json'
import fs from 'fs'
import { join } from 'path'
import { CompilerOptions, ScriptTarget } from 'typescript'

let verbose = false

export function setVerbose(enabled: boolean) {
  verbose = enabled
}

export async function safeExec<T>(func: () => Promise<T>, failMessage: string, exit?: number): Promise<T | unknown> {
  try {
    await func()
  } catch (error) {
    console.error(failMessage)
    if (verbose) console.error(error)
    if (Number.isInteger(exit)) process.exit(exit)
    return error
  }
}

interface TSConfig {
  compilerOptions?: Omit<CompilerOptions, 'target'> & {
    target?: keyof typeof ScriptTarget
  }
}

export async function readTSConfig(cwd: string): Promise<null | TSConfig> {
  const configPath = join(cwd, 'tsconfig.json')
  const exists = await fs.promises.access(configPath).then(() => true).catch(() => false)

  if (!exists) return null

  const file = await fs.promises.readFile(configPath, 'utf-8')
  const config = parse(file) as TSConfig

  return config
}
