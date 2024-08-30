import { AnyInfo, FileAnyInfoKind } from 'type-coverage-core'

// https://github.com/plantain-00/type-coverage/blob/master/packages/plugin/src/index.ts#L28

export function getMessages(anyObject: AnyInfo, options?: { raw?: boolean }) {
  const text = options?.raw
    ? 'literal'
    : `'${anyObject.text}'`

  if (anyObject.kind === FileAnyInfoKind.containsAny) {
    return `The type of ${text} contains 'any'`
  } else if (anyObject.kind === FileAnyInfoKind.unsafeAs) {
    return `The ${text} has unsafe 'as' type assertion`
  } else if (anyObject.kind === FileAnyInfoKind.unsafeNonNull) {
    return `The ${text} has unsafe '!' type assertion`
  } else if (anyObject.kind === FileAnyInfoKind.unsafeTypeAssertion) {
    return `The ${text} has unsafe '<>' type assertion`
  }

  return `The type of ${text} is 'any'`
}
