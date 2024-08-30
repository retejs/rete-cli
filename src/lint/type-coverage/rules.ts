import { AnyInfo, FileAnyInfoKind } from 'type-coverage-core'

import { getMessages } from './messages'

export const fileAnyInfoMap: Record<FileAnyInfoKind, string> = {
  [FileAnyInfoKind.any]: 'any',
  [FileAnyInfoKind.containsAny]: 'contains-any',
  [FileAnyInfoKind.unsafeAs]: 'unsafe-as',
  [FileAnyInfoKind.unsafeTypeAssertion]: 'unsafe-type-assertion',
  [FileAnyInfoKind.unsafeNonNull]: 'unsafe-non-null',
  [FileAnyInfoKind.semanticError]: 'semantic-error',
  [FileAnyInfoKind.unusedIgnore]: 'unused-ignore'
}

export function getRuleId(any: AnyInfo) {
  return `type-coverage/${fileAnyInfoMap[any.kind]}`
}

export function getRawDescription(any: AnyInfo) {
  return getMessages(any, { raw: true })
}
