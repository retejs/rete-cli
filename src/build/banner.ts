import { Pkg } from './types'

export function getBanner(pkg: Pkg) {
    const {
        name,
        version,
        author,
        license
    } = pkg
    const text = [
        `/*!`,
        `* ${name} v${version}`,
        `* (c) ${new Date().getFullYear()} ${author}`,
        `* Released under the ${license} license.`,
        `* */`
    ].join('\n')

    return text
}
