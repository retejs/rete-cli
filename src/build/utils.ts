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
