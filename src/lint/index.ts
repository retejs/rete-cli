import { lint } from './linter'

export default async function (fix?: boolean, quiet?: boolean) {
    try {
        await lint(fix, quiet)
    } catch (e) {
        process.exit(1)
    }
}
