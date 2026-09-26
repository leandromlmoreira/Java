import './styles/tokens.css'
import './styles/base.css'
import './styles/ide.css'
import './styles/code.css'
import './styles/run.css'
import './styles/apps.css'
import './styles/mobile.css'
import { Actions } from './ui/actions'
import { createActivityBar, createMobileNav, createStatusBar } from './ui/chrome'
import { h } from './ui/dom'
import { createEditor } from './ui/editor'
import { createExplorer } from './ui/explorer'
import { createResizer } from './ui/resizer'
import { createRunPanel } from './ui/runPanel'
import { Store, WELCOME_TAB, changed, type IdeState } from './ui/store'
import { createTitleBar } from './ui/titleBar'

const CRT_KEY = 'javalab.crt'
const MOBILE_QUERY = window.matchMedia('(max-width: 900px)')

function readCrt(): boolean {
  try {
    return window.localStorage.getItem(CRT_KEY) !== 'off'
  } catch {
    return true
  }
}

function saveCrt(on: boolean): void {
  try {
    window.localStorage.setItem(CRT_KEY, on ? 'on' : 'off')
  } catch {
    return
  }
}

const initialState: IdeState = {
  tabs: [WELCOME_TAB, 'projetos/sudoku/Sudoku.java'],
  active: 'projetos/sudoku/Sudoku.java',
  expanded: new Set(['projetos', 'projetos/sudoku']),
  running: 'sudoku',
  runId: 1,
  mobileView: 'run',
  drawer: false,
  sidebar: true,
  maximized: false,
  crt: readCrt(),
  cursor: { line: 1, col: 1 },
}

const store = new Store(initialState)
const actions = new Actions(store)

const runPanel = createRunPanel(store, actions)
const body = h(
  'div',
  { class: 'ide-body' },
  createActivityBar(store, actions),
  createExplorer(store, actions),
  createEditor(store, actions),
  createResizer(runPanel),
  runPanel,
)
const scrim = h('div', { class: 'scrim', 'aria-hidden': 'true', onclick: () => actions.toggleDrawer(false) })
const ide = h(
  'div',
  { class: 'ide' },
  createTitleBar(store, actions),
  body,
  createStatusBar(store, actions),
  createMobileNav(store, actions),
  scrim,
)

function syncLayout(state: IdeState): void {
  ide.dataset.view = state.mobileView
  ide.dataset.drawer = String(state.drawer)
  ide.dataset.sidebar = String(state.sidebar)
  ide.dataset.maximized = String(state.maximized)
  document.documentElement.dataset.crt = state.crt ? 'on' : 'off'
}

store.subscribe((state, previous) => {
  syncLayout(state)
  if (changed(state, previous, 'crt')) saveCrt(state.crt)
})

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && store.get().drawer) actions.toggleDrawer(false)
})

MOBILE_QUERY.addEventListener('change', () => actions.toggleDrawer(false))

syncLayout(store.get())
document.querySelector('#app')?.replaceWith(ide)
