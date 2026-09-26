import { clock } from '../../java/format'
import { h, replace } from '../../ui/dom'
import { button, createStdout, menuItem } from '../../ui/stdout'
import { DIFICULDADES, SudokuGame, TAMANHO, type Dificuldade } from './game'

type Cell = [number, number]

const MOVES: Record<string, Cell> = {
  ArrowUp: [-1, 0],
  ArrowDown: [1, 0],
  ArrowLeft: [0, -1],
  ArrowRight: [0, 1],
}

function isPeer([linha, coluna]: Cell, i: number, j: number): boolean {
  const mesmoQuadrado = Math.floor(linha / 3) === Math.floor(i / 3) && Math.floor(coluna / 3) === Math.floor(j / 3)
  return linha === i || coluna === j || mesmoQuadrado
}

function pulse(element: HTMLElement): void {
  element.classList.remove('is-denied')
  void element.offsetWidth
  element.classList.add('is-denied')
}

export function mountSudoku(host: HTMLElement): () => void {
  const game = new SudokuGame()
  const stdout = createStdout('Sudoku.java')
  const cells: HTMLButtonElement[][] = []
  const timerLabel = h('span', { class: 'app-timer' }, 'Tempo: 00:00:00')
  const difficultyGroup = h('div', { class: 'segmented', role: 'group', 'aria-label': 'Dificuldade' })
  const numpad = h('div', { class: 'sdk-numpad', role: 'group', 'aria-label': 'Números' })
  const board = h('div', { class: 'sdk-board', role: 'grid', 'aria-label': 'Tabuleiro de Sudoku', tabindex: '0' })
  const banner = h('div', { class: 'app-banner', hidden: true })

  let dificuldade: Dificuldade = 'Médio'
  let selecionada: Cell | null = null
  let segundos = 0
  let terminado = false

  const timer = window.setInterval(() => {
    if (terminado) return
    segundos++
    timerLabel.textContent = `Tempo: ${clock(segundos)}`
  }, 1000)

  function novoJogo(nova: Dificuldade = dificuldade): void {
    dificuldade = nova
    game.gerarNovoJogo(dificuldade)
    segundos = 0
    terminado = false
    selecionada = null
    timerLabel.textContent = 'Tempo: 00:00:00'
    banner.hidden = true
    stdout.write(`gerarNovoJogo("${dificuldade}") → ${game.espacosVazios()} espaços vazios`, 'muted')
    renderDifficulty()
    render()
  }

  function renderDifficulty(): void {
    replace(
      difficultyGroup,
      ...DIFICULDADES.map((nivel) =>
        button(nivel, () => novoJogo(nivel), 'segment', { 'aria-pressed': String(nivel === dificuldade) }),
      ),
    )
  }

  function render(): void {
    const tabuleiro = game.getTabuleiro()
    const valorSelecionado = selecionada ? tabuleiro[selecionada[0]][selecionada[1]] : 0
    for (let i = 0; i < TAMANHO; i++) {
      for (let j = 0; j < TAMANHO; j++) {
        const cell = cells[i][j]
        const valor = tabuleiro[i][j]
        const selected = !!selecionada && selecionada[0] === i && selecionada[1] === j
        cell.textContent = valor === 0 ? '' : String(valor)
        cell.classList.toggle('is-fixed', game.isFixo(i, j))
        cell.classList.toggle('is-user', valor !== 0 && !game.isFixo(i, j))
        cell.classList.toggle('is-selected', selected)
        cell.classList.toggle('is-peer', !!selecionada && isPeer(selecionada, i, j))
        cell.classList.toggle('is-same', valorSelecionado !== 0 && valor === valorSelecionado)
        cell.setAttribute('aria-selected', String(selected))
      }
    }
    renderNumpad()
  }

  function renderNumpad(): void {
    const keys = Array.from({ length: 9 }, (_, index) => {
      const numero = index + 1
      const restantes = game.restantes(numero)
      return h(
        'button',
        {
          type: 'button',
          class: 'sdk-key',
          disabled: restantes === 0,
          onclick: () => colocar(numero),
          'aria-label': `Colocar ${numero} (${restantes} restantes)`,
        },
        h('span', { class: 'sdk-key-num' }, numero),
        h('span', { class: 'sdk-key-left' }, restantes),
      )
    })
    const erase = h('button', { type: 'button', class: 'sdk-key sdk-key-erase', onclick: remover }, 'Apagar')
    replace(numpad, ...keys, erase)
  }

  function comSelecao(acao: (cell: Cell) => void): void {
    if (selecionada) acao(selecionada)
    else stdout.write('Selecione uma célula primeiro.', 'muted')
  }

  function colocar(numero: number): void {
    comSelecao(([linha, coluna]) => {
      const resultado = game.colocarNumero(linha, coluna, numero)
      stdout.write(`colocarNumero(${linha}, ${coluna}, ${numero}) → ${resultado.mensagem}`, resultado.ok ? 'ok' : 'err')
      if (!resultado.ok) pulse(cells[linha][coluna])
      render()
      if (game.isCompleto() && !terminado) concluir()
    })
  }

  function remover(): void {
    comSelecao(([linha, coluna]) => {
      const resultado = game.removerNumero(linha, coluna)
      stdout.write(`removerNumero(${linha}, ${coluna}) → ${resultado.mensagem}`, resultado.ok ? 'ok' : 'err')
      render()
    })
  }

  function concluir(): void {
    const resultado = game.finalizarJogo()
    terminado = true
    replace(
      banner,
      h('strong', {}, resultado.mensagem),
      h('span', {}, `Tempo: ${clock(segundos)} · ${dificuldade}`),
      button('Novo jogo', () => novoJogo(), 'btn btn-primary'),
    )
    banner.hidden = false
  }

  function selecionar(linha: number, coluna: number): void {
    selecionada = [linha, coluna]
    render()
  }

  function selecionarPrimeiraVazia(): void {
    const posicao = game.getTabuleiro().flat().indexOf(0)
    if (posicao >= 0) selecionar(Math.floor(posicao / TAMANHO), posicao % TAMANHO)
  }

  function moverSelecao(dLinha: number, dColuna: number): void {
    const [linha, coluna] = selecionada ?? [0, 0]
    selecionar((linha + dLinha + TAMANHO) % TAMANHO, (coluna + dColuna + TAMANHO) % TAMANHO)
  }

  board.addEventListener('keydown', (event) => {
    if (/^[1-9]$/.test(event.key)) colocar(Number(event.key))
    else if (['Backspace', 'Delete', '0'].includes(event.key)) remover()
    else if (MOVES[event.key]) moverSelecao(...MOVES[event.key])
    else return
    event.preventDefault()
  })

  for (let i = 0; i < TAMANHO; i++) {
    cells.push([])
    for (let j = 0; j < TAMANHO; j++) {
      const cell = h('button', {
        type: 'button',
        class: 'sdk-cell',
        role: 'gridcell',
        tabindex: '-1',
        'aria-label': `Linha ${i}, coluna ${j}`,
        onclick: () => selecionar(i, j),
      })
      cells[i].push(cell)
      board.append(cell)
    }
  }

  const menu = h(
    'div',
    { class: 'app-actions', role: 'group', 'aria-label': 'Menu do Sudoku.java' },
    menuItem('4', 'Verificar', () => {
      game.verificarJogo().forEach((linha) => stdout.write(linha, linha.startsWith('Erro') ? 'err' : 'ok'))
    }),
    menuItem('5', 'Status', () => {
      game.verificarStatus().forEach((linha, index) => stdout.write(linha, index === 0 ? 'out' : 'ok'))
    }),
    menuItem('6', 'Limpar', () => {
      stdout.write(game.limparTabuleiro(), 'ok')
      render()
    }),
    menuItem('7', 'Finalizar', () => {
      const resultado = game.finalizarJogo()
      stdout.write(resultado.mensagem, resultado.ok ? 'ok' : 'err')
      if (resultado.ok) concluir()
    }),
    menuItem('GUI', 'Resolver', () => {
      game.resolver()
      terminado = true
      stdout.write('Status: Jogo resolvido!', 'muted')
      render()
    }),
  )

  const toolbar = h(
    'div',
    { class: 'app-toolbar' },
    difficultyGroup,
    h('div', { class: 'app-toolbar-end' }, timerLabel, button('Novo jogo', () => novoJogo(), 'btn btn-ghost')),
  )

  const stage = h(
    'div',
    { class: 'sdk-stage' },
    h('div', { class: 'sdk-frame' }, board, banner),
    h('div', { class: 'sdk-side' }, numpad, menu),
  )

  host.append(h('div', { class: 'app sdk' }, toolbar, stage, stdout.el))
  novoJogo()
  selecionarPrimeiraVazia()
  board.focus({ preventScroll: true })

  return () => window.clearInterval(timer)
}
