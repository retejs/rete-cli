import { doc } from './doc'

export default async function (entries?: string[]) {
  try {
    await doc(entries)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}
