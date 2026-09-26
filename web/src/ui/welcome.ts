import { APPS } from '../apps/registry'
import type { JavaApp } from '../apps/types'
import type { Actions } from './actions'
import { h } from './dom'
import { icon } from './icons'

const REPO_URL = 'https://github.com/leandromlmoreira/javalab'

function appCard(app: JavaApp, index: number, actions: Actions): HTMLElement {
  return h(
    'article',
    { class: 'welcome-app', style: `--i:${index}` },
    h('header', {}, h('span', { class: 'welcome-app-index' }, String(index + 1).padStart(2, '0')), h('span', { class: 'welcome-app-tool' }, app.note ?? app.build)),
    h('h3', {}, app.title),
    h('p', {}, app.tagline),
    h(
      'footer',
      {},
      h('button', { type: 'button', class: 'btn btn-run', onclick: () => actions.run(app.id) }, icon('play', 12), 'Rodar'),
      h('button', { type: 'button', class: 'btn btn-ghost', onclick: () => actions.openFile(app.entry) }, `${app.mainClass}.java`),
    ),
  )
}

export function createWelcome(actions: Actions): HTMLElement {
  return h(
    'div',
    { class: 'welcome' },
    h('p', { class: 'eyebrow' }, h('span', { class: 'eyebrow-dot' }), 'README · leandromlmoreira/javalab'),
    h('h1', { class: 'welcome-title' }, 'Java de verdade,', h('br'), h('em', {}, 'rodando no navegador.')),
    h(
      'p',
      { class: 'welcome-lead' },
      'Quatro aplicações em Java puro, abertas como numa IDE. À esquerda, o código-fonte real do repositório. No painel Run, um porte fiel em TypeScript que segue as mesmas regras, mensagens e fluxo de cada ',
      h('code', {}, 'main()'),
      '.',
    ),
    h('div', { class: 'welcome-grid' }, ...APPS.map((app, index) => appCard(app, index, actions))),
    h(
      'p',
      { class: 'welcome-foot' },
      'Explore também ',
      h('code', {}, 'exercicios/'),
      ' (tipos, controle de fluxo, POO, interfaces, collections) e as notas em ',
      h('code', {}, 'docs/'),
      '. ',
      h('a', { href: REPO_URL, target: '_blank', rel: 'noreferrer' }, 'Ver repositório', icon('external', 12)),
    ),
  )
}
