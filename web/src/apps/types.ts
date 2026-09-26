export type AppId = 'sudoku' | 'memoria' | 'calculadora' | 'board'

export type BuildTool = 'javac' | 'maven'

export interface JavaApp {
  id: AppId
  title: string
  mainClass: string
  entry: string
  sources: string[]
  build: BuildTool
  tagline: string
  note?: string
  mount: (host: HTMLElement) => () => void
}
