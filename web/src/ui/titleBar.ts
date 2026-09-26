import { APPS, appById } from '../apps/registry'
import type { Actions } from './actions'
import { h, replace } from './dom'
import { icon } from './icons'
import { changed, type IdeState, type Store } from './store'

export const REPO_URL = 'https://github.com/leandromlmoreira/javalab'

function logo(): HTMLElement {
  const mark = document.createElement('template')
  mark.innerHTML =
    '<svg class="logo-mark" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="8"/><path d="M10 9h12M16 9v11a4 4 0 0 1-8 0" fill="none" stroke-width="2.6" stroke-linecap="round"/><path class="logo-cursor" d="M19 22h5" stroke-width="2.6" stroke-linecap="round"/></svg>'
  return h('span', { class: 'logo' }, mark.content.firstElementChild as SVGElement, h('span', { class: 'logo-text' }, 'Java', h('em', {}, 'Lab')))
}

function runSelector(store: Store, actions: Actions): HTMLElement {
  const label = h('span', { class: 'run-select-label' })
  const list = h('ul', { class: 'run-menu', role: 'listbox', 'aria-label': 'Configurações de execução', hidden: true })
  const trigger = h(
    'button',
    { type: 'button', class: 'run-select', 'aria-haspopup': 'listbox', 'aria-expanded': 'false' },
    h('span', { class: 'run-select-icon' }, icon('run', 14)),
    label,
    h('span', { class: 'run-select-chevron' }, icon('chevron', 12)),
  )
  const wrapper = h('div', { class: 'run-picker' }, trigger, list)

  function close(): void {
    list.hidden = true
    trigger.setAttribute('aria-expanded', 'false')
  }

  function render(state: IdeState): void {
    label.textContent = state.running ? appById(state.running).mainClass : 'Selecionar app'
    replace(
      list,
      ...APPS.map((app) =>
        h(
          'li',
          { role: 'option', 'aria-selected': String(state.running === app.id) },
          h(
            'button',
            { type: 'button', onclick: () => { close(); actions.run(app.id) } },
            icon('play', 10),
            h('span', {}, app.mainClass),
            h('small', {}, app.build),
          ),
        ),
      ),
    )
  }

  trigger.addEventListener('click', () => {
    const open = list.hidden
    list.hidden = !open
    trigger.setAttribute('aria-expanded', String(open))
  })
  document.addEventListener('click', (event) => {
    if (!wrapper.contains(event.target as Node)) close()
  })
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') close()
  })

  store.subscribe((state, previous) => {
    if (changed(state, previous, 'running')) render(state)
  })
  render(store.get())
  return wrapper
}

export function createTitleBar(store: Store, actions: Actions): HTMLElement {
  return h(
    'header',
    { class: 'titlebar' },
    h(
      'div',
      { class: 'titlebar-start' },
      h('button', { type: 'button', class: 'icon-btn menu-btn', 'aria-label': 'Abrir explorador', onclick: () => actions.toggleDrawer(true) }, icon('menu', 18)),
      logo(),
      h('span', { class: 'titlebar-sep', 'aria-hidden': 'true' }),
      h('span', { class: 'branch' }, icon('branch', 13), 'main'),
    ),
    h(
      'div',
      { class: 'titlebar-center' },
      runSelector(store, actions),
      h('button', { type: 'button', class: 'run-btn', 'aria-label': 'Executar', title: 'Executar (arquivo aberto ou último app)', onclick: () => actions.runActiveFile() }, icon('play', 14)),
      h('button', { type: 'button', class: 'icon-btn stop-btn', 'aria-label': 'Parar', title: 'Parar', onclick: () => actions.stop() }, icon('stop', 14)),
    ),
    h(
      'div',
      { class: 'titlebar-end' },
      h('a', { class: 'repo-link', href: REPO_URL, target: '_blank', rel: 'noreferrer' }, icon('github', 15), h('span', {}, 'Repositório')),
    ),
  )
}
