import { appForFile } from '../apps/registry'
import { readFile } from '../repo/files'
import type { Actions } from './actions'
import { createCodeSkeleton, createCodeView } from './codeView'
import { h, replace } from './dom'
import { displayName, fileBadge } from './fileBadge'
import { icon } from './icons'
import { changed, WELCOME_TAB, type IdeState, type Store } from './store'
import { createWelcome } from './welcome'

function tabLabel(path: string): string {
  return path === WELCOME_TAB ? 'Bem-vindo' : displayName(path)
}

function renderTab(path: string, state: IdeState, actions: Actions): HTMLElement {
  const active = state.active === path
  const runnable = !!appForFile(path)
  return h(
    'div',
    { class: `tab${active ? ' is-active' : ''}`, role: 'presentation' },
    h(
      'button',
      { type: 'button', class: 'tab-main', role: 'tab', 'aria-selected': String(active), onclick: () => actions.activate(path), title: path },
      path === WELCOME_TAB ? h('span', { class: 'file-badge badge-welcome', 'aria-hidden': 'true' }, 'J') : fileBadge(path),
      h('span', {}, tabLabel(path)),
      runnable ? h('span', { class: 'tab-dot', 'aria-hidden': 'true' }) : null,
    ),
    h('button', { type: 'button', class: 'tab-close', 'aria-label': `Fechar ${tabLabel(path)}`, onclick: () => actions.closeTab(path) }, icon('close', 12)),
  )
}

function breadcrumb(path: string): HTMLElement {
  const parts = path === WELCOME_TAB ? ['javalab', 'README'] : ['javalab', ...path.split('/')]
  const crumbs = parts.flatMap((part, index) => [
    index > 0 ? h('span', { class: 'crumb-sep', 'aria-hidden': 'true' }, icon('chevron', 10)) : null,
    h('span', { class: index === parts.length - 1 ? 'crumb is-last' : 'crumb' }, part),
  ])
  return h('nav', { class: 'breadcrumb', 'aria-label': 'Caminho do arquivo' }, ...crumbs)
}

export function createEditor(store: Store, actions: Actions): HTMLElement {
  const tabs = h('div', { class: 'tabs', role: 'tablist', 'aria-label': 'Arquivos abertos' })
  const crumbs = h('div', { class: 'editor-bar' })
  const content = h('div', { class: 'editor-content' })
  const scrollByPath = new Map<string, number>()
  let shown = ''
  let loadToken = 0

  content.addEventListener('scroll', () => scrollByPath.set(shown, content.scrollTop), { passive: true })

  async function showFile(path: string): Promise<void> {
    const token = ++loadToken
    replace(content, createCodeSkeleton())
    const source = await readFile(path)
    if (token !== loadToken) return
    const app = appForFile(path)
    const meta = h('span', { class: 'editor-meta' }, `${source.split('\n').length} linhas`)
    crumbs.append(meta)
    replace(
      content,
      createCodeView({
        path,
        source,
        runnable: !!app,
        onRun: () => app && actions.run(app.id),
        onLine: (line) => actions.setCursor(line, 1),
      }),
    )
    content.scrollTop = scrollByPath.get(path) ?? 0
  }

  function show(path: string): void {
    shown = path
    replace(crumbs, breadcrumb(path))
    if (path === WELCOME_TAB) {
      loadToken++
      replace(content, createWelcome(actions))
      content.scrollTop = 0
      return
    }
    void showFile(path)
  }

  function renderTabs(state: IdeState): void {
    replace(tabs, ...state.tabs.map((path) => renderTab(path, state, actions)))
    const activeTab = tabs.querySelector<HTMLElement>('.tab.is-active')
    if (activeTab) tabs.scrollTo({ left: activeTab.offsetLeft - tabs.clientWidth / 3 })
  }

  store.subscribe((state, previous) => {
    if (changed(state, previous, 'tabs', 'active')) renderTabs(state)
    if (state.active !== shown) show(state.active)
  })

  const initial = store.get()
  renderTabs(initial)
  show(initial.active)

  return h('main', { class: 'editor', 'aria-label': 'Editor' }, tabs, crumbs, content)
}
