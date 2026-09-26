import { repoFiles } from '../repo/files'
import type { Actions } from './actions'
import { h, replace } from './dom'
import { icon, type IconName } from './icons'
import { REPO_URL } from './titleBar'
import { changed, WELCOME_TAB, type IdeState, type Store } from './store'

function activityButton(name: IconName, label: string, onClick: () => void): HTMLButtonElement {
  return h('button', { type: 'button', class: 'activity-btn', title: label, 'aria-label': label, onclick: onClick }, icon(name, 20))
}

export function createActivityBar(store: Store, actions: Actions): HTMLElement {
  const explorer = activityButton('files', 'Mostrar ou ocultar explorador', () => actions.toggleSidebar())
  const welcome = activityButton('info', 'Bem-vindo', () => actions.openWelcome())
  const run = activityButton('run', 'Executar arquivo aberto', () => actions.runActiveFile())

  function render(state: IdeState): void {
    explorer.classList.toggle('is-active', state.sidebar)
    welcome.classList.toggle('is-active', state.active === WELCOME_TAB)
    run.classList.toggle('is-running', state.running !== null)
  }

  store.subscribe(render)
  render(store.get())

  const github = h('a', { class: 'activity-btn', href: REPO_URL, target: '_blank', rel: 'noreferrer', title: 'GitHub', 'aria-label': 'GitHub' }, icon('github', 20))
  return h('nav', { class: 'activity', 'aria-label': 'Ferramentas' }, explorer, welcome, run, h('span', { class: 'activity-spacer' }), github)
}

export function createStatusBar(store: Store, actions: Actions): HTMLElement {
  const cursor = h('span', { class: 'status-item' })
  const crt = h('button', { type: 'button', class: 'status-item status-btn', onclick: () => actions.toggleCrt() })
  const javaFiles = repoFiles.filter((file) => file.path.endsWith('.java')).length

  function render(state: IdeState): void {
    cursor.textContent = `Ln ${state.cursor.line}, Col ${state.cursor.col}`
    replace(crt, icon('crt', 13), `CRT ${state.crt ? 'on' : 'off'}`)
    crt.setAttribute('aria-pressed', String(state.crt))
  }

  store.subscribe((state, previous) => {
    if (changed(state, previous, 'cursor', 'crt')) render(state)
  })
  render(store.get())

  return h(
    'footer',
    { class: 'statusbar' },
    h('span', { class: 'status-item status-branch' }, icon('branch', 12), 'main'),
    h('span', { class: 'status-item' }, `${repoFiles.length} arquivos · ${javaFiles} .java`),
    h('span', { class: 'status-spacer' }),
    cursor,
    h('span', { class: 'status-item' }, 'UTF-8'),
    h('span', { class: 'status-item' }, 'LF'),
    h('span', { class: 'status-item' }, 'Java 11 → TS'),
    crt,
  )
}

export function createMobileNav(store: Store, actions: Actions): HTMLElement {
  const code = h('button', { type: 'button', class: 'mnav-btn', onclick: () => actions.setMobileView('code') }, icon('code', 18), 'Código')
  const run = h('button', { type: 'button', class: 'mnav-btn', onclick: () => actions.setMobileView('run') }, icon('terminal', 18), 'Run', h('span', { class: 'mnav-live' }))

  function render(state: IdeState): void {
    code.setAttribute('aria-pressed', String(state.mobileView === 'code'))
    run.setAttribute('aria-pressed', String(state.mobileView === 'run'))
    run.classList.toggle('is-live', state.running !== null)
  }

  store.subscribe((state, previous) => {
    if (changed(state, previous, 'mobileView', 'running')) render(state)
  })
  render(store.get())

  return h('nav', { class: 'mnav', 'aria-label': 'Alternar visualização' }, h('span', { class: 'mnav-indicator', 'aria-hidden': 'true' }), code, run)
}
