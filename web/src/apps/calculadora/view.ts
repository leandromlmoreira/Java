import { h } from '../../ui/dom'
import { mountTerminal, type JavaProgram } from '../../ui/terminal'
import { calculadora } from './program'

const RESULTADO = /^Resultado(?: atual)?: (.+)$/

export function mountCalculadora(host: HTMLElement): () => void {
  const expression = h('span', { class: 'lcd-expr' }, 'aguardando operação')
  const value = h('strong', { class: 'lcd-value' }, '0.0')
  const lcd = h('div', { class: 'lcd', 'aria-live': 'polite' }, h('span', { class: 'lcd-label' }, 'double resultado'), expression, value)

  function mostrar(texto: string): void {
    const [conta, total] = texto.includes(' = ') ? texto.split(' = ') : ['resultado atual', texto]
    expression.textContent = conta
    value.textContent = total
  }

  const program: JavaProgram = (out, scanner) =>
    calculadora(
      {
        print: out.print,
        println: (texto = '') => {
          out.println(texto)
          const match = texto.match(RESULTADO)
          if (match) mostrar(match[1])
        },
      },
      scanner,
    )

  const wrapper = h('div', { class: 'calc' }, lcd)
  host.append(wrapper)
  return mountTerminal(wrapper, program, 'Calculadora')
}
