
export * from 'typescript'

declare module 'typescript' {
  // eslint-disable-next-line @typescript-eslint/naming-convention, init-declarations
  export const Diagnostics: undefined | Record<string, {
    code: number
    category: number
    message: string
  }>
}
