import { javaFixed, minutes } from '../../java/format'
import { h, replace } from '../../ui/dom'
import { button, createStdout, menuItem } from '../../ui/stdout'
import { COLECOES_PADRAO, Colecao, Jogo, QUANTIDADE_MINIMA, criarColecao } from './game'
import { melhoresPartidas, salvarPartida } from './placar'

const ESPERA_ERRO_MS = 2000

function stat(label: string): { el: HTMLElement; set: (value: string) => void } {
  const value = h('strong', {}, '0')
  return {
    el: h('div', { class: 'stat' }, h('span', {}, label), value),
    set: (text) => {
      value.textContent = text
    },
  }
}

export function mountMemoria(host: HTMLElement): () => void {
  const colecoes: Colecao[] = [...COLECOES_PADRAO]
  const stdout = createStdout('JogoMemoria.java')
  const chips = h('div', { class: 'chips', role: 'group', 'aria-label': 'Coleções' })
  const grid = h('div', { class: 'mem-grid' })
  const overlay = h('div', { class: 'app-overlay', hidden: true })
  const placar = h('div', { class: 'placar' })
  const pauseButton = menuItem('2', 'Pausar jogo', () => alternarPausa())
  const stats = {
    tempo: stat('Tempo'),
    lances: stat('Lances'),
    acertos: stat('Acertos'),
    restantes: stat('Restam'),
    percentual: stat('Taxa'),
  }

  let colecao = colecoes[0]
  let jogo = new Jogo(colecao)
  let cartas: HTMLButtonElement[] = []
  let primeira: number | null = null
  let aguardando = false
  let pausado = false
  let segundos = 0
  let espera = 0

  const timer = window.setInterval(() => {
    if (pausado || jogo.isJogoCompleto()) return
    segundos++
    stats.tempo.set(minutes(segundos))
  }, 1000)

  function iniciarJogo(nova: Colecao = colecao): void {
    window.clearTimeout(espera)
    colecao = nova
    jogo = new Jogo(colecao)
    primeira = null
    aguardando = false
    pausado = false
    segundos = 0
    overlay.hidden = true
    stats.tempo.set(minutes(0))
    stdout.write(`new Jogo("${colecao.nome}") → ${colecao.cartas.length} cartas embaralhadas`, 'muted')
    renderChips()
    montarCartas()
    renderCartas()
    renderPlacar()
  }

  function renderChips(): void {
    const itens = colecoes.map((item) =>
      button(item.nome, () => iniciarJogo(item), 'chip', { 'aria-pressed': String(item === colecao) }),
    )
    replace(chips, ...itens, button('+ Nova coleção', abrirCriacao, 'chip chip-add'))
  }

  function montarCartas(): void {
    cartas = jogo.cartasVisiveis.map((carta, index) =>
      h(
        'button',
        { type: 'button', class: 'mem-card', onclick: () => escolher(index) },
        h(
          'span',
          { class: 'mem-inner' },
          h('span', { class: 'mem-face mem-back' }, h('span', { class: 'mem-index' }, `[${index}]`)),
          h('span', { class: 'mem-face mem-front' }, carta.conteudo),
        ),
      ),
    )
    replace(grid, ...cartas)
  }

  function renderCartas(): void {
    jogo.cartasVisiveis.forEach((carta, index) => {
      const element = cartas[index]
      const aberta = carta.virada || carta.removida || index === primeira
      element.classList.toggle('is-open', aberta)
      element.classList.toggle('is-removed', carta.removida)
      element.disabled = carta.removida
      element.setAttribute('aria-label', aberta ? `Carta ${index}: ${carta.conteudo}` : `Carta ${index}`)
    })
    renderStats()
  }

  function renderStats(): void {
    stats.lances.set(String(jogo.getTotalLances()))
    stats.acertos.set(String(jogo.getAcertos()))
    stats.restantes.set(String(jogo.getCartasRestantes()))
    stats.percentual.set(`${javaFixed(jogo.getPercentualAcertos(), 1)}%`)
  }

  function renderPlacar(): void {
    const partidas = melhoresPartidas(colecao.nome)
    const linhas = partidas.map((partida, index) =>
      h(
        'li',
        {},
        h('span', { class: 'placar-pos' }, String(index + 1).padStart(2, '0')),
        h('span', {}, `${partida.lances} lances`),
        h('span', {}, `${javaFixed(partida.percentual, 1)}%`),
        h('span', {}, minutes(partida.segundos)),
      ),
    )
    const vazio = h('p', { class: 'placar-empty' }, 'Nenhuma partida concluída nesta coleção ainda.')
    replace(
      placar,
      h('header', {}, h('span', {}, 'Placar'), h('span', { class: 'placar-file' }, 'jogo_memoria.json')),
      linhas.length > 0 ? h('ol', {}, ...linhas) : vazio,
    )
  }

  function escolher(index: number): void {
    if (aguardando || pausado || jogo.isJogoCompleto()) return
    if (primeira === null) {
      primeira = index
      renderCartas()
      return
    }
    if (primeira === index) {
      stdout.write('Escolha posições diferentes!', 'err')
      return
    }
    lance(primeira, index)
  }

  function lance(pos1: number, pos2: number): void {
    const acerto = jogo.virarCartas(pos1, pos2)
    primeira = null
    const resumo = `Lances: ${jogo.getTotalLances()} · Acertos: ${jogo.getAcertos()}`
    const mensagem = acerto ? 'ACERTO! Cartas removidas!' : 'ERRO! Cartas viradas de volta!'
    stdout.write(`virarCartas(${pos1}, ${pos2}) → ${mensagem} ${resumo}`, acerto ? 'ok' : 'err')
    renderCartas()
    if (acerto) {
      if (jogo.isJogoCompleto()) concluir()
      return
    }
    aguardando = true
    espera = window.setTimeout(() => {
      jogo.desvirar(pos1, pos2)
      aguardando = false
      renderCartas()
    }, ESPERA_ERRO_MS)
  }

  function concluir(): void {
    const percentual = jogo.getPercentualAcertos()
    salvarPartida({
      colecao: colecao.nome,
      lances: jogo.getTotalLances(),
      percentual,
      segundos,
      data: new Date().toISOString(),
    })
    stdout.write('PARABÉNS! JOGO COMPLETO!', 'ok')
    mostrarOverlay(
      h('p', { class: 'overlay-eyebrow' }, 'jogoAtual.isJogoCompleto() == true'),
      h('h3', { class: 'overlay-title' }, 'Parabéns! Jogo completo!'),
      h(
        'dl',
        { class: 'overlay-stats' },
        h('div', {}, h('dt', {}, 'Total de lances'), h('dd', {}, String(jogo.getTotalLances()))),
        h('div', {}, h('dt', {}, 'Percentual de acertos'), h('dd', {}, `${javaFixed(percentual, 1)}%`)),
        h('div', {}, h('dt', {}, 'Tempo'), h('dd', {}, minutes(segundos))),
      ),
      button('Jogar de novo', () => iniciarJogo(), 'btn btn-primary'),
    )
    renderPlacar()
  }

  function alternarPausa(): void {
    if (jogo.isJogoCompleto()) return
    pausado = !pausado
    replace(pauseButton, h('span', { class: 'menu-key' }, pausado ? '3' : '2'), pausado ? 'Continuar um jogo' : 'Pausar jogo')
    if (!pausado) {
      overlay.hidden = true
      return
    }
    stdout.write("Jogo pausado. Use 'Continuar um jogo' para retomar.", 'muted')
    mostrarOverlay(
      h('p', { class: 'overlay-eyebrow' }, 'pausarJogo()'),
      h('h3', { class: 'overlay-title' }, 'Jogo pausado'),
      h('p', { class: 'overlay-text' }, 'O tempo parou. Retome de onde parou.'),
      button('Continuar um jogo', alternarPausa, 'btn btn-primary'),
    )
  }

  function verStatus(): void {
    stdout.write('--- STATUS DO JOGO ---', 'cmd')
    stdout.write(`Cartas restantes: ${jogo.getCartasRestantes()}`)
    stdout.write(`Total de lances: ${jogo.getTotalLances()}`)
    stdout.write(`Acertos: ${jogo.getAcertos()}`)
    stdout.write(`Percentual de acertos: ${javaFixed(jogo.getPercentualAcertos(), 1)}%`)
  }

  function abrirCriacao(): void {
    const nome = h('input', { class: 'field', name: 'nome', required: true, maxlength: '40', placeholder: 'Ex.: Frameworks' })
    const conteudos = h('textarea', { class: 'field', name: 'cartas', rows: '5', placeholder: 'Uma carta por linha. Repita o conteúdo para formar pares.' })
    const erro = h('p', { class: 'form-error', role: 'alert' })
    const form = h(
      'form',
      { class: 'overlay-form' },
      h('p', { class: 'overlay-eyebrow' }, '1. Criar uma coleção de cartas'),
      h('label', {}, h('span', {}, 'Nome da coleção'), nome),
      h('label', {}, h('span', {}, `Cartas (mínimo ${QUANTIDADE_MINIMA})`), conteudos),
      erro,
      h('div', { class: 'overlay-actions' }, button('Cancelar', () => (overlay.hidden = true), 'btn btn-ghost'), h('button', { type: 'submit', class: 'btn btn-primary' }, 'Criar coleção')),
    )
    form.addEventListener('submit', (event) => {
      event.preventDefault()
      const cartas = conteudos.value.split('\n').map((linha) => linha.trim()).filter(Boolean)
      const resultado = criarColecao(nome.value.trim() || 'Sem nome', cartas)
      if (typeof resultado === 'string') {
        erro.textContent = resultado
        return
      }
      colecoes.push(resultado)
      stdout.write(`Coleção '${resultado.nome}' criada com ${resultado.cartas.length} cartas!`, 'ok')
      iniciarJogo(resultado)
    })
    mostrarOverlay(form)
    nome.focus()
  }

  function mostrarOverlay(...children: Node[]): void {
    replace(overlay, h('div', { class: 'overlay-card' }, ...children))
    overlay.hidden = false
  }

  const statRow = h('div', { class: 'stats' }, ...Object.values(stats).map((item) => item.el))
  const menu = h(
    'div',
    { class: 'app-actions', role: 'group', 'aria-label': 'Menu do JogoMemoria.java' },
    menuItem('2', 'Iniciar jogo', () => iniciarJogo()),
    pauseButton,
    menuItem('3', 'Ver status', verStatus),
  )

  host.append(
    h(
      'div',
      { class: 'app mem' },
      h('div', { class: 'app-toolbar' }, chips),
      statRow,
      h('div', { class: 'mem-stage' }, grid, overlay),
      menu,
      h('div', { class: 'mem-bottom' }, stdout.el, placar),
    ),
  )
  iniciarJogo()

  return () => {
    window.clearInterval(timer)
    window.clearTimeout(espera)
  }
}
