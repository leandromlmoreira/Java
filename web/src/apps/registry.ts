import { mountBoard } from './board/view'
import { mountCalculadora } from './calculadora/view'
import { mountMemoria } from './memoria/view'
import { mountSudoku } from './sudoku/view'
import type { AppId, JavaApp } from './types'

export const APPS: JavaApp[] = [
  {
    id: 'sudoku',
    title: 'Sudoku',
    mainClass: 'Sudoku',
    entry: 'projetos/sudoku/Sudoku.java',
    sources: ['projetos/sudoku/Sudoku.java', 'projetos/sudoku/SudokuGUI.java'],
    build: 'javac',
    tagline: 'Gerador por backtracking, três dificuldades e a validação de linha, coluna e quadrante do podeColocarNumero().',
    mount: mountSudoku,
  },
  {
    id: 'memoria',
    title: 'Jogo da Memória',
    mainClass: 'JogoMemoria',
    entry: 'projetos/jogo-memoria/JogoMemoria.java',
    sources: ['projetos/jogo-memoria/JogoMemoria.java'],
    build: 'maven',
    tagline: 'Coleções de cartas, lances, acertos, percentual e tempo, com placar persistido como o salvarDados().',
    mount: mountMemoria,
  },
  {
    id: 'calculadora',
    title: 'Calculadora',
    mainClass: 'Calculadora',
    entry: 'projetos/calculadora/Calculadora.java',
    sources: ['projetos/calculadora/Calculadora.java'],
    build: 'javac',
    tagline: 'O menu em loop do Scanner, linha por linha, com submenu acumulador e a formatação de double do Java.',
    mount: mountCalculadora,
  },
  {
    id: 'board',
    title: 'Board de Tarefas',
    mainClass: 'BoardTarefas',
    entry: 'projetos/board-tarefas/BoardTarefas.java',
    sources: ['projetos/board-tarefas/BoardTarefas.java'],
    build: 'maven',
    tagline: 'Kanban com colunas padrão, bloqueio com motivo e relatórios. O SQL do PreparedStatement aparece no log.',
    note: 'JDBC simulado em memória',
    mount: mountBoard,
  },
]

export function appById(id: AppId): JavaApp {
  return APPS.find((app) => app.id === id) as JavaApp
}

export function appForFile(path: string): JavaApp | undefined {
  return APPS.find((app) => app.sources.includes(path))
}
