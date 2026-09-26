const PATHS = {
  folder: '<path d="M3.5 6.5a1.5 1.5 0 0 1 1.5-1.5h4l2 2h8a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5H5a1.5 1.5 0 0 1-1.5-1.5z"/>',
  chevron: '<path d="M9 6l6 6-6 6"/>',
  play: '<path d="M8 5.5v13l10.5-6.5z" fill="currentColor" stroke="none"/>',
  stop: '<rect x="6.5" y="6.5" width="11" height="11" rx="1.5" fill="currentColor" stroke="none"/>',
  rerun: '<path d="M19 12a7 7 0 1 1-2.05-4.95"/><path d="M19.5 4.5v4h-4"/>',
  expand: '<path d="M14 4.5h5.5V10M10 19.5H4.5V14M19.5 4.5l-6 6M4.5 19.5l6-6"/>',
  collapse: '<path d="M19.5 10H14V4.5M4.5 14H10v5.5M14 10l5.5-5.5M10 14l-5.5 5.5"/>',
  files: '<path d="M8 3.5h6l4.5 4.5v10A2.5 2.5 0 0 1 16 20.5H8A2.5 2.5 0 0 1 5.5 18V6A2.5 2.5 0 0 1 8 3.5z"/><path d="M14 3.5V8h4.5"/>',
  run: '<circle cx="12" cy="12" r="8.5"/><path d="M10.2 8.8v6.4l5.2-3.2z" fill="currentColor" stroke="none"/>',
  info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5M12 7.8v.2"/>',
  github: '<path d="M9 19c-4 1.3-4-2-5.5-2.5M15 21v-3.4a3 3 0 0 0-.8-2.3c2.7-.3 5.6-1.3 5.6-6a4.6 4.6 0 0 0-1.3-3.2 4.3 4.3 0 0 0-.1-3.2s-1-.3-3.4 1.3a11.6 11.6 0 0 0-6 0C6.6 2.6 5.6 2.9 5.6 2.9a4.3 4.3 0 0 0-.1 3.2 4.6 4.6 0 0 0-1.3 3.2c0 4.7 2.9 5.7 5.6 6a3 3 0 0 0-.8 2.3V21"/>',
  menu: '<path d="M4.5 8h15M4.5 16h15"/>',
  close: '<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>',
  branch: '<circle cx="7" cy="6" r="2"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="8" r="2"/><path d="M7 8v8M17 10c0 4-10 2-10 6"/>',
  arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  lock: '<rect x="5.5" y="10.5" width="13" height="9" rx="2"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>',
  unlock: '<rect x="5.5" y="10.5" width="13" height="9" rx="2"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 6.8-1.2"/>',
  ban: '<circle cx="12" cy="12" r="8"/><path d="M6.5 17.5l11-11"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  code: '<path d="M9 7l-5 5 5 5M15 7l5 5-5 5"/>',
  terminal: '<rect x="3.5" y="5" width="17" height="14" rx="2"/><path d="M7.5 10l3 2.5-3 2.5M12.5 15.5h4"/>',
  external: '<path d="M14 5h5v5M19 5l-8 8M17 14v4.5a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 4 18.5v-10A1.5 1.5 0 0 1 5.5 7H10"/>',
  crt: '<rect x="3.5" y="4.5" width="17" height="12" rx="2.5"/><path d="M8.5 20h7M12 16.5V20"/>',
} as const

export type IconName = keyof typeof PATHS

export function icon(name: IconName, size = 16): SVGSVGElement {
  const template = document.createElement('template')
  template.innerHTML = `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${PATHS[name]}</svg>`
  return template.content.firstElementChild as SVGSVGElement
}
