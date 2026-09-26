import { h } from './dom'

const MIN_WIDTH = 420
const MAX_RATIO = 0.62
const STEP = 24

export function createResizer(panel: HTMLElement): HTMLElement {
  const handle = h('div', {
    class: 'resizer',
    role: 'separator',
    'aria-orientation': 'vertical',
    'aria-label': 'Redimensionar painel Run',
    tabindex: '0',
  })

  function setWidth(width: number): void {
    const max = window.innerWidth * MAX_RATIO
    const clamped = Math.round(Math.min(max, Math.max(MIN_WIDTH, width)))
    panel.parentElement?.style.setProperty('--run-w', `${clamped}px`)
  }

  handle.addEventListener('pointerdown', (event) => {
    handle.setPointerCapture(event.pointerId)
    handle.classList.add('is-dragging')
    const right = panel.getBoundingClientRect().right
    const move = (moveEvent: PointerEvent) => setWidth(right - moveEvent.clientX)
    const stop = () => {
      handle.classList.remove('is-dragging')
      handle.removeEventListener('pointermove', move)
      handle.removeEventListener('pointerup', stop)
    }
    handle.addEventListener('pointermove', move)
    handle.addEventListener('pointerup', stop)
  })

  handle.addEventListener('keydown', (event) => {
    const width = panel.getBoundingClientRect().width
    if (event.key === 'ArrowLeft') setWidth(width + STEP)
    else if (event.key === 'ArrowRight') setWidth(width - STEP)
  })

  return handle
}
