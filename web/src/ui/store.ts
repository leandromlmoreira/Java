import type { AppId } from '../apps/types'

export const WELCOME_TAB = 'bem-vindo'

export type MobileView = 'code' | 'run'

export interface IdeState {
  tabs: string[]
  active: string
  expanded: ReadonlySet<string>
  running: AppId | null
  runId: number
  mobileView: MobileView
  drawer: boolean
  sidebar: boolean
  maximized: boolean
  crt: boolean
  cursor: { line: number; col: number }
}

type Listener = (state: IdeState, previous: IdeState) => void

export class Store {
  private listeners = new Set<Listener>()

  constructor(private state: IdeState) {}

  get(): IdeState {
    return this.state
  }

  set(patch: Partial<IdeState>): void {
    const previous = this.state
    this.state = { ...previous, ...patch }
    this.listeners.forEach((listener) => listener(this.state, previous))
  }

  subscribe(listener: Listener): void {
    this.listeners.add(listener)
  }
}

export function changed<K extends keyof IdeState>(state: IdeState, previous: IdeState, ...keys: K[]): boolean {
  return keys.some((key) => state[key] !== previous[key])
}
