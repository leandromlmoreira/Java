const loaders = import.meta.glob<string>(
  [
    '../../../projetos/**/*.{java,xml,sh,bat}',
    '../../../exercicios/**/*.java',
    '../../../docs/**/*.{md,MD}',
    '../../../bin/*.{sh,bat}',
    '../../../*.{md,xml,sh,bat}',
  ],
  { query: '?raw', import: 'default' },
)

const ROOT_PREFIX = '../../../'

export interface RepoFile {
  path: string
  name: string
}

const cache = new Map<string, string>()

export const repoFiles: RepoFile[] = Object.keys(loaders)
  .map((key) => {
    const path = key.slice(ROOT_PREFIX.length)
    return { path, name: path.split('/').pop() ?? path }
  })
  .sort((a, b) => a.path.localeCompare(b.path, 'pt-BR'))

export async function readFile(path: string): Promise<string> {
  const cached = cache.get(path)
  if (cached !== undefined) return cached
  const loader = loaders[ROOT_PREFIX + path]
  if (!loader) throw new Error(`Arquivo não encontrado: ${path}`)
  const content = (await loader()).replace(/\r\n/g, '\n')
  cache.set(path, content)
  return content
}

export function fileExtension(path: string): string {
  return path.split('.').pop()?.toLowerCase() ?? ''
}
