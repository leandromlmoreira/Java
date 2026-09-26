import './style.css'
import hljs from 'highlight.js/lib/core'
import java from 'highlight.js/lib/languages/java'
import 'highlight.js/styles/atom-one-light.css'
import { apps } from './snippets'
import { SudokuGame } from './sudoku'

hljs.registerLanguage('java', java)

const app = document.querySelector<HTMLDivElement>('#app')!

const repoUrl = 'https://github.com/leandromlmoreira/Java'

app.innerHTML = `
  <header class="hero">
    <div class="hero-inner">
      <p class="eyebrow">JavaLab</p>
      <h1>Aplicações Java num só repositório</h1>
      <p class="lead">
        Calculadora, Sudoku, jogo da memória e um board de tarefas com JDBC,
        além de exercícios de fundamentos. Java não roda no navegador,
        então esta página mostra o código real de cada aplicação e traz
        uma versão jogável do Sudoku, portada para JavaScript.
      </p>
      <a class="hero-link" href="${repoUrl}" target="_blank" rel="noreferrer">Ver repositório no GitHub</a>
    </div>
  </header>

  <main>
    <section class="cards" aria-label="Aplicações do repositório">
      ${apps.map(renderCard).join('')}
    </section>

    <section class="demo" aria-labelledby="demo-title">
      <div class="demo-header">
        <h2 id="demo-title">Sudoku jogável</h2>
        <p>
          Porte fiel da validação de linhas, colunas e quadrantes 3x3 de
          <code>Sudoku.java</code> para TypeScript. Escolha uma célula vazia,
          depois um número.
        </p>
      </div>
      <div class="demo-body">
        <div class="board" id="board" role="grid" aria-label="Tabuleiro de Sudoku"></div>
        <div class="controls">
          <div class="numpad" id="numpad" aria-label="Números"></div>
          <div class="actions">
            <button type="button" id="clear-btn">Limpar</button>
            <button type="button" id="erase-btn">Apagar célula</button>
          </div>
          <p class="status" id="status" role="status">Selecione uma célula.</p>
        </div>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <p>Feito a partir do repositório <a href="${repoUrl}" target="_blank" rel="noreferrer">leandromlmoreira/Java</a>.</p>
  </footer>
`

function renderCard(item: (typeof apps)[number]): string {
  const highlighted = hljs.highlight(item.snippet, { language: item.language }).value
  return `
    <article class="card">
      <h3>${item.title}</h3>
      <p>${item.description}</p>
      <p class="card-path">${item.path}</p>
      <pre class="code-block"><code>${highlighted}</code></pre>
      <p class="run-command">${escapeHtml(item.runCommand)}</p>
    </article>
  `
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

const game = new SudokuGame()
let selected: { linha: number; coluna: number } | null = null

const boardEl = document.querySelector<HTMLDivElement>('#board')!
const numpadEl = document.querySelector<HTMLDivElement>('#numpad')!
const statusEl = document.querySelector<HTMLParagraphElement>('#status')!
const clearBtn = document.querySelector<HTMLButtonElement>('#clear-btn')!
const eraseBtn = document.querySelector<HTMLButtonElement>('#erase-btn')!

function renderBoard(): void {
  boardEl.innerHTML = ''
  const tabuleiro = game.getTabuleiro()

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const valor = tabuleiro[i][j]
      const fixo = game.isFixo(i, j)
      const cell = document.createElement('button')
      cell.type = 'button'
      cell.className = 'cell'
      cell.setAttribute('role', 'gridcell')
      cell.setAttribute(
        'aria-label',
        `Linha ${i + 1}, coluna ${j + 1}${valor ? `, valor ${valor}` : ', vazia'}`,
      )
      if (fixo) cell.classList.add('fixed')
      if (selected && selected.linha === i && selected.coluna === j) {
        cell.classList.add('selected')
      }
      if (i % 3 === 0) cell.classList.add('border-top')
      if (j % 3 === 0) cell.classList.add('border-left')
      if (i === 8) cell.classList.add('border-bottom')
      if (j === 8) cell.classList.add('border-right')

      cell.textContent = valor === 0 ? '' : String(valor)
      cell.disabled = fixo
      cell.addEventListener('click', () => {
        selected = { linha: i, coluna: j }
        statusEl.textContent = `Célula selecionada: linha ${i + 1}, coluna ${j + 1}.`
        renderBoard()
      })

      boardEl.appendChild(cell)
    }
  }
}

function renderNumpad(): void {
  numpadEl.innerHTML = ''
  for (let numero = 1; numero <= 9; numero++) {
    const btn = document.createElement('button')
    btn.type = 'button'
    btn.textContent = String(numero)
    btn.addEventListener('click', () => placeNumber(numero))
    numpadEl.appendChild(btn)
  }
}

function placeNumber(numero: number): void {
  if (!selected) {
    statusEl.textContent = 'Selecione uma célula vazia antes de escolher um número.'
    return
  }

  const { linha, coluna } = selected
  if (game.isFixo(linha, coluna)) {
    statusEl.textContent = 'Essa posição é fixa e não pode ser alterada.'
    return
  }

  const colocado = game.colocarNumero(linha, coluna, numero)
  if (!colocado) {
    statusEl.textContent = `O número ${numero} conflita com a linha, coluna ou quadrante.`
    renderBoard()
    return
  }

  statusEl.textContent = game.isCompleto()
    ? 'Parabéns! Sudoku concluído sem conflitos.'
    : `Número ${numero} colocado. Espaços vazios: ${game.espacosVazios()}.`
  renderBoard()
}

clearBtn.addEventListener('click', () => {
  game.limparTabuleiro()
  selected = null
  statusEl.textContent = 'Tabuleiro limpo. Números fixos mantidos.'
  renderBoard()
})

eraseBtn.addEventListener('click', () => {
  if (!selected) {
    statusEl.textContent = 'Selecione uma célula preenchida para apagar.'
    return
  }
  const { linha, coluna } = selected
  const removido = game.removerNumero(linha, coluna)
  statusEl.textContent = removido
    ? 'Número removido.'
    : 'Essa posição é fixa e não pode ser removida.'
  renderBoard()
})

renderBoard()
renderNumpad()
