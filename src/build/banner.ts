import { Pkg } from './types'

export function getBanner(pkg: Pkg) {
    const {
        name,
        version,
        author,
        license
    } = pkg;
    const text = `/*!\n* ${name} v${version} \n* (c) ${new Date().getFullYear()} ${author} \n* Released under the ${license} license.\n*/`;

    return text;
}
