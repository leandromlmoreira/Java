import { fileExtension } from '../repo/files'
import { h } from './dom'

const BADGES: Record<string, [string, string]> = {
  java: ['J', 'java'],
  md: ['M', 'md'],
  xml: ['<>', 'xml'],
  sh: ['$', 'sh'],
  bat: ['$', 'sh'],
}

export function fileBadge(path: string): HTMLElement {
  const [label, kind] = BADGES[fileExtension(path)] ?? ['·', 'plain']
  return h('span', { class: `file-badge badge-${kind}`, 'aria-hidden': 'true' }, label)
}

export function displayName(path: string): string {
  return path.split('/').pop() ?? path
}
