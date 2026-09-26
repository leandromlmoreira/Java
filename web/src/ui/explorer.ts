import { APPS, appForFile } from '../apps/registry'
import { repoFiles } from '../repo/files'
import { buildTree, type TreeNode } from '../repo/tree'
import type { Actions } from './actions'
import { h, replace } from './dom'
import { fileBadge } from './fileBadge'
import { icon } from './icons'
import { changed, type IdeState, type Store } from './store'

function treeRow(node: TreeNode, depth: number, state: IdeState, actions: Actions): HTMLElement {
  const isDir = node.kind === 'dir'
  const open = state.expanded.has(node.path)
  const runnable = !isDir && !!appForFile(node.path)
  const row = h(
    'button',
    {
      type: 'button',
      class: `tree-row${state.active === node.path ? ' is-active' : ''}`,
      style: `--depth:${depth}`,
      role: 'treeitem',
      'aria-expanded': isDir ? String(open) : undefined,
      'aria-current': state.active === node.path ? 'page' : undefined,
      title: node.path,
      onclick: () => (isDir ? actions.toggleDir(node.path) : actions.openFile(node.path)),
    },
    isDir ? h('span', { class: `tree-chevron${open ? ' is-open' : ''}` }, icon('chevron', 12)) : h('span', { class: 'tree-chevron' }),
    isDir ? h('span', { class: 'tree-folder' }, icon('folder', 14)) : fileBadge(node.path),
    h('span', { class: 'tree-name' }, node.name),
    runnable ? h('span', { class: 'tree-run', title: 'Executável no navegador' }, icon('play', 10)) : null,
  )
  const children = isDir && open ? node.children.map((child) => treeRow(child, depth + 1, state, actions)) : []
  return h('div', { class: 'tree-node', role: 'none' }, row, children.length > 0 ? h('div', { role: 'group' }, ...children) : null)
}

function runConfigs(state: IdeState, actions: Actions): HTMLElement {
  return h(
    'ul',
    { class: 'run-configs' },
    ...APPS.map((app) =>
      h(
        'li',
        {},
        h(
          'button',
          { type: 'button', class: `run-config${state.running === app.id ? ' is-running' : ''}`, onclick: () => actions.run(app.id) },
          h('span', { class: 'run-config-icon' }, icon('play', 10)),
          h('span', { class: 'run-config-name' }, app.mainClass),
          h('span', { class: 'run-config-tool' }, app.build),
        ),
      ),
    ),
  )
}

export function createExplorer(store: Store, actions: Actions): HTMLElement {
  const tree = buildTree(repoFiles)
  const treeHost = h('div', { class: 'tree', role: 'tree', 'aria-label': 'Arquivos do repositório' })
  const configsHost = h('div')
  const javaCount = repoFiles.filter((file) => file.path.endsWith('.java')).length

  function render(state: IdeState): void {
    replace(treeHost, ...tree.children.map((node) => treeRow(node, 0, state, actions)))
    replace(configsHost, runConfigs(state, actions))
  }

  store.subscribe((state, previous) => {
    if (changed(state, previous, 'expanded', 'active', 'running')) render(state)
  })
  render(store.get())

  return h(
    'aside',
    { class: 'sidebar', 'aria-label': 'Explorador do projeto' },
    h(
      'header',
      { class: 'panel-head' },
      h('span', { class: 'panel-title' }, 'Projeto'),
      h('span', { class: 'panel-meta' }, `${javaCount} .java`),
      h('button', { type: 'button', class: 'icon-btn drawer-close', 'aria-label': 'Fechar explorador', onclick: () => actions.toggleDrawer(false) }, icon('close', 16)),
    ),
    h('div', { class: 'tree-root' }, icon('folder', 14), h('span', {}, 'javalab'), h('span', { class: 'tree-root-branch' }, 'main')),
    h('div', { class: 'sidebar-scroll' }, treeHost),
    h('section', { class: 'sidebar-section' }, h('header', { class: 'panel-head' }, h('span', { class: 'panel-title' }, 'Configurações de execução')), configsHost),
  )
}

