import type { RepoFile } from './files'

export interface TreeNode {
  name: string
  path: string
  kind: 'dir' | 'file'
  children: TreeNode[]
}

export function buildTree(files: RepoFile[]): TreeNode {
  const root: TreeNode = { name: 'javalab', path: '', kind: 'dir', children: [] }
  for (const file of files) {
    insert(root, file.path.split('/'), [])
  }
  sortTree(root)
  return root
}

function insert(node: TreeNode, parts: string[], trail: string[]): void {
  const [head, ...rest] = parts
  const path = [...trail, head].join('/')
  const kind = rest.length === 0 ? 'file' : 'dir'
  let child = node.children.find((candidate) => candidate.name === head)
  if (!child) {
    child = { name: head, path, kind, children: [] }
    node.children.push(child)
  }
  if (rest.length > 0) insert(child, rest, [...trail, head])
}

function sortTree(node: TreeNode): void {
  node.children.sort((a, b) => {
    if (a.kind !== b.kind) return a.kind === 'dir' ? -1 : 1
    return a.name.localeCompare(b.name, 'pt-BR', { numeric: true })
  })
  node.children.forEach(sortTree)
}

export function ancestorsOf(path: string): string[] {
  const parts = path.split('/')
  return parts.slice(0, -1).map((_, index) => parts.slice(0, index + 1).join('/'))
}
