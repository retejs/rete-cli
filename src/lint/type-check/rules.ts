import ts from 'ts-morph'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Diagnostics } from 'typescript'

export function getRuleId(diagnostic: ts.Diagnostic) {
  return `ts/${diagnostic.getCode()}`
}

export function getRawDescription(code: number) {
  if (!Diagnostics) return

  const list = Object.values(Diagnostics)
  const entry = list.find(diagnostic => diagnostic.code === code)

  return entry?.message
}
