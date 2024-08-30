import { join } from 'path'
import { Application, OptionDefaults, TSConfigReader, TypeDocReader } from 'typedoc'

import { SOURCE_FOLDER } from '../consts'

export async function doc(entries?: string[]) {
  const root = process.cwd()
  const outputDir = join(root, 'docs')
  const entryPoints = (entries ?? [join(SOURCE_FOLDER, 'index.ts')]).map(entry => join(root, entry))
  const app = await Application.bootstrap({
    excludeNotDocumented: true,
    excludePrivate: true,
    excludeExternals: true,
    blockTags: [
      ...OptionDefaults.blockTags,
      '@priority',
      '@emits',
      '@listens',
      '@constructor'
    ],
    entryPoints
  }, [new TSConfigReader(), new TypeDocReader()])

  const project = await app.convert()

  if (!project) throw new Error('Failed to generate docs')

  await app.generateDocs(project, outputDir)
  await app.generateJson(project, join(outputDir, 'typedoc.json'))
}
