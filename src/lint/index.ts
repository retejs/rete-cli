import { lint } from './linter';

export default async function(fix?: boolean) {
  try {
    await lint(fix)
  } catch (e) {
    process.exit(1)
  }
}
