import { h } from './dom'

export type Tone = 'out' | 'ok' | 'err' | 'cmd' | 'muted'

export interface Stdout {
  el: HTMLElement
  write: (text: string, tone?: Tone) => void
  clear: () => void
}

export function createStdout(label: string, maxLines = 40): Stdout {
  const body = h('div', { class: 'stdout-body', role: 'log', 'aria-live': 'polite' })
  const head = h('header', { class: 'stdout-head' }, h('span', { class: 'stdout-dot' }), h('span', {}, 'System.out'), h('span', { class: 'stdout-file' }, label))
  const el = h('section', { class: 'stdout', 'aria-label': `Saída de ${label}` }, head, body)

  function write(text: string, tone: Tone = 'out'): void {
    body.append(h('p', { class: `stdout-line tone-${tone}` }, text))
    while (body.childElementCount > maxLines) body.firstElementChild?.remove()
    body.scrollTop = body.scrollHeight
  }

  return { el, write, clear: () => body.replaceChildren() }
}

export function button(
  label: string,
  onClick: () => void,
  className = 'btn',
  extra: Record<string, string> = {},
): HTMLButtonElement {
  return h('button', { type: 'button', class: className, onclick: onClick, ...extra }, label)
}

export function menuItem(option: string, label: string, onClick: () => void): HTMLButtonElement {
  return h('button', { type: 'button', class: 'menu-item', onclick: onClick }, h('span', { class: 'menu-key' }, option), label)
}
