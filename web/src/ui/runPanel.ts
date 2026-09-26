import { APPS, appById } from '../apps/registry'
import type { JavaApp } from '../apps/types'
import type { Actions } from './actions'
import { playCompile } from './compileLog'
import { h, replace } from './dom'
import { icon, type IconName } from './icons'
import { changed, type Store } from './store'

function toolButton(name: IconName, label: string, onClick: () => void): HTMLButtonElement {
  return h('button', { type: 'button', class: 'icon-btn', title: label, 'aria-label': label, onclick: onClick }, icon(name, 16))
}

function emptyState(actions: Actions): HTMLElement {
  return h(
    'div',
    { class: 'run-empty' },
    h('div', { class: 'run-empty-glyph', 'aria-hidden': 'true' }, icon('terminal', 28)),
    h('h3', {}, 'Nada rodando'),
    h('p', {}, 'Escolha uma configuração ou clique no ▶ ao lado de main() no editor.'),
    h(
      'div',
      { class: 'run-empty-list' },
      ...APPS.map((app) => h('button', { type: 'button', class: 'chip', onclick: () => actions.run(app.id) }, icon('play', 10), app.mainClass)),
    ),
  )
}

export function createRunPanel(store: Store, actions: Actions): HTMLElement {
  const eyebrow = h('p', { class: 'run-eyebrow' })
  const title = h('h2', { class: 'run-title' })
  const tagline = h('p', { class: 'run-tagline' })
  const maxButton = toolButton('expand', 'Maximizar painel', () => actions.toggleMaximized())
  const tools = h(
    'div',
    { class: 'run-tools' },
    toolButton('rerun', 'Executar de novo', () => actions.rerun()),
    toolButton('stop', 'Parar', () => actions.stop()),
    maxButton,
  )
  const body = h('div', { class: 'run-body' })
  let controller: AbortController | null = null
  let cleanup: () => void = () => undefined

  function teardown(): void {
    controller?.abort()
    cleanup()
    cleanup = () => undefined
  }

  function renderHeader(app: JavaApp | null, status: 'idle' | 'compiling' | 'running'): void {
    const label = { idle: 'parado', compiling: 'compilando…', running: 'em execução' }[status]
    replace(
      eyebrow,
      h('span', { class: `run-status is-${status}` }),
      h('span', {}, 'Run'),
      h('span', { class: 'run-eyebrow-sep' }, '/'),
      h('span', { class: 'run-eyebrow-class' }, app ? `${app.mainClass}.main()` : 'sem configuração'),
      h('span', { class: 'run-eyebrow-state' }, label),
    )
    title.textContent = app ? app.title : 'Console'
    tagline.textContent = app ? app.tagline : 'Os apps do repositório rodam aqui, portados regra por regra do Java.'
  }

  async function start(app: JavaApp): Promise<void> {
    teardown()
    const current = new AbortController()
    controller = current
    renderHeader(app, 'compiling')
    const stage = h('div', { class: 'run-stage is-compiling' })
    replace(body, stage)
    try {
      const { summary } = await playCompile(stage, app, current.signal)
      const host = h('div', { class: 'run-app' })
      replace(body, summary, host)
      cleanup = app.mount(host)
      renderHeader(app, 'running')
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) throw error
    }
  }

  function idle(): void {
    teardown()
    renderHeader(null, 'idle')
    replace(body, emptyState(actions))
  }

  store.subscribe((state, previous) => {
    if (changed(state, previous, 'runId')) {
      if (state.running) void start(appById(state.running))
      else idle()
    }
    if (changed(state, previous, 'maximized')) {
      replace(maxButton, icon(state.maximized ? 'collapse' : 'expand', 16))
      maxButton.setAttribute('aria-label', state.maximized ? 'Restaurar painel' : 'Maximizar painel')
    }
  })

  const initial = store.get()
  if (initial.running) void start(appById(initial.running))
  else idle()

  return h(
    'section',
    { class: 'run-panel', 'aria-label': 'Painel Run' },
    h('header', { class: 'run-head' }, h('div', { class: 'run-head-text' }, eyebrow, title, tagline), tools),
    body,
  )
}
