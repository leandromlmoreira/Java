import { fileExtension } from '../repo/files'
import { h } from './dom'
import { splitLines, tokenize, type Token } from './highlight'
import { icon } from './icons'

const RUN_LINE = /public\s+(static\s+void\s+main|class\s+\w+)/

export interface CodeViewOptions {
  path: string
  source: string
  runnable: boolean
  onRun: () => void
  onLine: (line: number) => void
}

function renderTokens(tokens: Token[]): DocumentFragment {
  const fragment = document.createDocumentFragment()
  for (const token of tokens) {
    fragment.append(token.kind === 'plain' ? token.text : h('span', { class: `tk-${token.kind}` }, token.text))
  }
  return fragment
}

function gutterButton(onRun: () => void): HTMLButtonElement {
  return h('button', { type: 'button', class: 'gutter-run', title: 'Executar no navegador', 'aria-label': 'Executar no navegador', onclick: onRun }, icon('play', 11))
}

export function createCodeView({ path, source, runnable, onRun, onLine }: CodeViewOptions): HTMLElement {
  const lines = splitLines(tokenize(source, fileExtension(path)))
  const rawLines = source.split('\n')
  const body = h('div', { class: 'code-lines', style: `--digits:${String(lines.length).length}` })

  lines.forEach((tokens, index) => {
    const canRun = runnable && RUN_LINE.test(rawLines[index] ?? '')
    body.append(
      h(
        'div',
        { class: 'code-line', 'data-line': index + 1 },
        h('span', { class: 'code-gutter' }, canRun ? gutterButton(onRun) : null, h('span', { class: 'code-ln' }, index + 1)),
        h('span', { class: 'code-text' }, renderTokens(tokens)),
      ),
    )
  })

  body.addEventListener('click', (event) => {
    const line = (event.target as HTMLElement).closest<HTMLElement>('.code-line')
    if (!line) return
    body.querySelector('.code-line.is-current')?.classList.remove('is-current')
    line.classList.add('is-current')
    onLine(Number(line.dataset.line))
  })

  return h('div', { class: 'code-view', tabindex: '0', 'aria-label': `Código de ${path}` }, body)
}

export function createCodeSkeleton(): HTMLElement {
  const widths = [42, 68, 30, 0, 74, 55, 61, 22, 0, 48, 80, 36]
  return h(
    'div',
    { class: 'code-view code-skeleton', 'aria-busy': 'true', 'aria-label': 'Carregando arquivo' },
    ...widths.map((width) => h('div', { class: 'skeleton-line', style: `--w:${width}%` })),
  )
}
