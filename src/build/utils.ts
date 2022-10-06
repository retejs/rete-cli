export async function safeExec<T>(func: () => Promise<T>, failMessage: string, exit?: number): Promise<T | unknown> {
    try {
        await func()
    } catch (e) {
        console.error(failMessage)
        if (Number.isInteger(exit)) process.exit(exit)
        return e
    }
}
