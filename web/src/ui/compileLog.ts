import type { JavaApp } from '../apps/types'
import { readFile } from '../repo/files'
import { h, prefersReducedMotion, wait } from './dom'
import { icon } from './icons'

interface Step {
  text: string
  tone: 'cmd' | 'out' | 'ok'
}

function folderOf(path: string): string {
  return path.split('/').slice(0, -1).join('/')
}

function commands(app: JavaApp): { compile: Step; run: Step; artifact: string } {
  const folder = folderOf(app.entry)
  if (app.build === 'maven') {
    return {
      compile: { text: `$ mvn -q compile -f ${folder}/pom.xml`, tone: 'cmd' },
      run: { text: `$ mvn -q exec:java -Dexec.mainClass="${app.mainClass}"`, tone: 'cmd' },
      artifact: `target/classes/${app.mainClass}.class`,
    }
  }
  return {
    compile: { text: `$ javac -encoding UTF-8 -d out ${app.entry}`, tone: 'cmd' },
    run: { text: `$ java -cp out ${app.mainClass}`, tone: 'cmd' },
    artifact: `out/${app.mainClass}.class`,
  }
}

export interface CompileResult {
  summary: HTMLElement
}

export async function playCompile(host: HTMLElement, app: JavaApp, signal: AbortSignal): Promise<CompileResult> {
  const started = performance.now()
  const speed = prefersReducedMotion() ? 0.15 : 1
  const log = h('pre', { class: 'compile-log', 'aria-live': 'polite' })
  host.replaceChildren(log)

  const sources = await Promise.all(app.sources.map(readFile))
  const lines = sources.reduce((total, source) => total + source.split('\n').length, 0)
  const { compile, run, artifact } = commands(app)

  const print = (text: string, tone: Step['tone']) => {
    const line = h('span', { class: `compile-line tone-${tone}` }, text)
    log.append(line, '\n')
    return line
  }

  print(compile.text, compile.tone)
  await wait(180 * speed, signal)
  const fill = h('span', { class: 'compile-bar-fill' })
  const counter = h('span', {}, `0/${lines} linhas`)
  log.append(h('span', { class: 'compile-progress' }, h('span', { class: 'compile-bar' }, fill), counter), '\n')
  const steps = 14
  for (let step = 0; step <= steps; step++) {
    fill.style.transform = `scaleX(${step / steps})`
    counter.textContent = `${Math.round((lines * step) / steps)}/${lines} linhas`
    await wait(34 * speed, signal)
  }
  print(`  → ${artifact}`, 'out')
  await wait(140 * speed, signal)
  const seconds = ((performance.now() - started) / 1000).toFixed(1).replace('.', ',')
  print(`  BUILD SUCCESSFUL em ${seconds}s`, 'ok')
  await wait(120 * speed, signal)
  print(run.text, run.tone)
  await wait(260 * speed, signal)

  const summary = h(
    'details',
    { class: 'build-strip' },
    h(
      'summary',
      {},
      h('span', { class: 'build-ok' }, icon('play', 9)),
      h('span', { class: 'build-text' }, `${app.mainClass}.class`),
      h('span', { class: 'build-meta' }, `${app.sources.length > 1 ? `${app.sources.length} fontes · ` : ''}${lines} linhas · ${seconds}s`),
      h('span', { class: 'build-toggle' }, 'log'),
    ),
    log,
  )
  return { summary }
}
