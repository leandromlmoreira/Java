type Child = Node | string | number | null | undefined | false
type AttrValue = string | number | boolean | undefined | ((event: never) => void)
type Attrs = Record<string, AttrValue>

export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Attrs = {},
  ...children: Child[]
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag)
  for (const [key, value] of Object.entries(attrs)) {
    applyAttr(element, key, value)
  }
  append(element, children)
  return element
}

function applyAttr(element: HTMLElement, key: string, value: AttrValue): void {
  if (value === undefined || value === false) return
  if (typeof value === 'function' && key.startsWith('on')) {
    element.addEventListener(key.slice(2).toLowerCase(), value as EventListener)
    return
  }
  element.setAttribute(key, value === true ? '' : String(value))
}

export function append(parent: Node, children: Child[]): void {
  for (const child of children) {
    if (child === null || child === undefined || child === false) continue
    parent.appendChild(child instanceof Node ? child : document.createTextNode(String(child)))
  }
}

export function replace(parent: Element, ...children: Child[]): void {
  parent.replaceChildren()
  append(parent, children)
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function wait(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(resolve, ms)
    signal?.addEventListener('abort', () => {
      window.clearTimeout(timer)
      reject(new DOMException('Aborted', 'AbortError'))
    })
  })
}
