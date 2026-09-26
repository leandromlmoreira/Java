import { InputMismatchException, ProcessKilled, Scanner, type PrintStream } from '../java/scanner'
import { h, replace } from './dom'
import type { Tone } from './stdout'

export type JavaProgram = (out: PrintStream, scanner: Scanner) => Promise<void>

interface Option {
  key: string
  label: string
}

const OPTION_LINE = /^(\d+)\. (.+)$/gm
const MENU_PROMPT = 'Escolha uma opção: '

function menuOptions(transcript: string): Option[] {
  if (!transcript.endsWith(MENU_PROMPT)) return []
  const block = transcript.slice(Math.max(transcript.lastIndexOf('==='), transcript.lastIndexOf('---')))
  return [...block.matchAll(OPTION_LINE)].map(([, key, label]) => ({
    key,
    label: label.replace(/^Realizar uma? /, '').replace(/ para continuar a .+$/, ''),
  }))
}

function stackTrace(error: InputMismatchException, mainClass: string): string {
  return [
    `Exception in thread "main" ${error.message}: "${error.token}"`,
    '\tat java.base/java.util.Scanner.throwFor(Scanner.java:939)',
    '\tat java.base/java.util.Scanner.next(Scanner.java:1594)',
    `\tat ${mainClass}.main(${mainClass}.java)`,
  ].join('\n')
}

export function mountTerminal(host: HTMLElement, program: JavaProgram, mainClass: string): () => void {
  const output = h('pre', { class: 'term-out' })
  const input = h('input', {
    class: 'term-input',
    type: 'text',
    autocomplete: 'off',
    spellcheck: 'false',
    enterkeyhint: 'send',
    'aria-label': 'Entrada do programa (System.in)',
    disabled: true,
  })
  const form = h('form', { class: 'term-prompt' }, h('span', { class: 'term-caret', 'aria-hidden': 'true' }, '›'), input)
  const chips = h('div', { class: 'term-chips', 'aria-label': 'Atalhos do menu' })
  const screen = h('div', { class: 'term-screen', onclick: () => input.focus({ preventScroll: true }) }, output, form)
  let transcript = ''
  let scanner: Scanner

  function write(text: string, tone: Tone = 'out'): void {
    transcript += text
    output.append(h('span', { class: `tone-${tone}` }, text))
    screen.scrollTop = screen.scrollHeight
  }

  const out: PrintStream = {
    print: (text) => write(text),
    println: (text = '') => write(`${text}\n`),
  }

  function renderChips(waiting: boolean): void {
    const options = waiting ? menuOptions(transcript) : []
    replace(
      chips,
      ...options.map((option) =>
        h('button', { type: 'button', class: 'chip', onclick: () => submit(option.key) }, h('b', {}, option.key), option.label),
      ),
    )
  }

  function onWaiting(waiting: boolean): void {
    input.disabled = !waiting
    form.classList.toggle('is-waiting', waiting)
    renderChips(waiting)
    if (waiting) input.focus({ preventScroll: true })
  }

  function submit(value: string): void {
    if (input.disabled) return
    write(`${value}\n`, 'cmd')
    input.value = ''
    scanner.feed(value)
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault()
    submit(input.value)
  })

  function finish(code: number): void {
    write(`\nProcess finished with exit code ${code}\n`, 'muted')
    replace(chips, h('button', { type: 'button', class: 'chip chip-add', onclick: start }, 'Executar de novo'))
  }

  function start(): void {
    output.replaceChildren()
    transcript = ''
    scanner = new Scanner({ onWaiting })
    program(out, scanner).then(
      () => finish(0),
      (error: unknown) => {
        if (error instanceof ProcessKilled) return
        if (error instanceof InputMismatchException) write(`${stackTrace(error, mainClass)}\n`, 'err')
        else write(`${String(error)}\n`, 'err')
        onWaiting(false)
        finish(1)
      },
    )
  }

  host.append(h('div', { class: 'app term' }, screen, chips))
  start()

  return () => scanner.close()
}
