import { appById, appForFile } from '../apps/registry'
import type { AppId } from '../apps/types'
import { ancestorsOf } from '../repo/tree'
import { Store, WELCOME_TAB } from './store'

export class Actions {
  constructor(private readonly store: Store) {}

  openFile(path: string): void {
    const state = this.store.get()
    const tabs = state.tabs.includes(path) ? state.tabs : [...state.tabs, path]
    const expanded = new Set(state.expanded)
    ancestorsOf(path).forEach((dir) => expanded.add(dir))
    this.store.set({ tabs, active: path, expanded, drawer: false, mobileView: 'code', cursor: { line: 1, col: 1 } })
  }

  openWelcome(): void {
    const state = this.store.get()
    const tabs = state.tabs.includes(WELCOME_TAB) ? state.tabs : [WELCOME_TAB, ...state.tabs]
    this.store.set({ tabs, active: WELCOME_TAB, drawer: false, mobileView: 'code' })
  }

  activate(path: string): void {
    this.store.set({ active: path, cursor: { line: 1, col: 1 } })
  }

  closeTab(path: string): void {
    const state = this.store.get()
    const index = state.tabs.indexOf(path)
    const tabs = state.tabs.filter((tab) => tab !== path)
    const active = state.active === path ? tabs[Math.max(0, index - 1)] ?? WELCOME_TAB : state.active
    this.store.set({ tabs: tabs.length > 0 ? tabs : [WELCOME_TAB], active })
  }

  toggleDir(path: string): void {
    const expanded = new Set(this.store.get().expanded)
    if (expanded.has(path)) expanded.delete(path)
    else expanded.add(path)
    this.store.set({ expanded })
  }

  run(id: AppId): void {
    const app = appById(id)
    if (!app.sources.includes(this.store.get().active)) this.openFile(app.entry)
    const state = this.store.get()
    this.store.set({ running: id, runId: state.runId + 1, mobileView: 'run', drawer: false })
  }

  runActiveFile(): void {
    const app = appForFile(this.store.get().active)
    if (app) this.run(app.id)
    else if (this.store.get().running) this.rerun()
  }

  rerun(): void {
    const running = this.store.get().running
    if (running) this.run(running)
  }

  stop(): void {
    this.store.set({ running: null, runId: this.store.get().runId + 1 })
  }

  setMobileView(mobileView: 'code' | 'run'): void {
    this.store.set({ mobileView })
  }

  toggleDrawer(open = !this.store.get().drawer): void {
    this.store.set({ drawer: open })
  }

  toggleSidebar(): void {
    this.store.set({ sidebar: !this.store.get().sidebar })
  }

  toggleMaximized(): void {
    this.store.set({ maximized: !this.store.get().maximized })
  }

  toggleCrt(): void {
    this.store.set({ crt: !this.store.get().crt })
  }

  setCursor(line: number, col: number): void {
    this.store.set({ cursor: { line, col } })
  }
}
