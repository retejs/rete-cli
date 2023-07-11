import { join } from 'path'
import { Application, TSConfigReader, TypeDocReader } from 'typedoc'

import { SOURCE_FOLDER } from '../consts'

export async function doc(entries?: string[]) {
  const root = process.cwd()
  const outputDir = join(root, 'docs')
  const app = new Application()

  app.options.addReader(new TSConfigReader())
  app.options.addReader(new TypeDocReader())

  const entryPoints = (entries || [join(SOURCE_FOLDER, 'index.ts')]).map(entry => join(root, entry))

  app.bootstrap({
    excludeNotDocumented: true,
    excludePrivate: true,
    excludeExternals: true,
    entryPoints
  })

  const project = app.convert()

  if (!project) throw new Error('Failed to generate docs')

  await app.generateDocs(project, outputDir)
  await app.generateJson(project, join(outputDir, 'typedoc.json'))
}
