import ts from 'ts-morph'

export function getMessage(diagnostic: ts.Diagnostic<ts.ts.Diagnostic>) {
  const messageText = diagnostic.getMessageText()

  if (typeof messageText === 'string') {
    return messageText
  }

  const next = messageText.getNext() || []

  return `${messageText.getMessageText()} ${next.map(m => m.getMessageText()).join(' ')}`.trim()
}
