import { h, replace } from '../../ui/dom'
import { icon, type IconName } from '../../ui/icons'
import { createStdout, menuItem } from '../../ui/stdout'
import { BoardTarefas, type Card, type Coluna, type Sql } from './board'

function formatSql({ text, params }: Sql): string {
  let index = 0
  return text.replace(/\?/g, () => {
    const value = params[index++]
    return typeof value === 'string' ? `'${value}'` : String(value)
  })
}

function seed(board: BoardTarefas): void {
  board.semear('Portar Sudoku.java para TypeScript', 'Mesmas regras de linha, coluna e quadrante', 4, 30)
  board.semear('Placar do jogo da memória', 'Persistir partidas como o salvarDados()', 4, 12)
  board.semear('Front em estilo IDE', 'Árvore real do repositório e painel Run', 3, 20)
  board.semear('Calculadora com Scanner', 'Porte fiel do menu em loop', 2, 6)
  const bloqueado = board.semear('Testes com JUnit 4', 'Cobrir as regras do podeColocarNumero', 1, 3)
  board.bloquearCard(bloqueado, 'Aguardando definição do escopo')
  board.semear('Migrar board para H2', 'Rodar sem MySQL local', 1, 1)
}

function iconButton(name: IconName, label: string, onClick: () => void): HTMLButtonElement {
  return h('button', { type: 'button', class: 'icon-btn', title: label, 'aria-label': label, onclick: onClick }, icon(name, 15))
}

export function mountBoard(host: HTMLElement): () => void {
  const stdout = createStdout('BoardTarefas.java', 60)
  let registrarSql = false
  const board = new BoardTarefas('JavaLab', (sql) => {
    if (registrarSql) stdout.write(formatSql(sql), 'muted')
  })
  seed(board)
  registrarSql = true

  const lanes = h('div', { class: 'kb-lanes' })
  let editando: number | null = null

  function executar(mensagem: string, ok: boolean): void {
    stdout.write(mensagem, ok ? 'ok' : 'err')
    render()
  }

  function cardActions(card: Card, coluna: Coluna): HTMLElement {
    const ativo = coluna.tipo !== 'cancelamento'
    const mover = iconButton('arrowRight', 'Mover para próxima coluna', () => {
      const resultado = board.moverCard(card.id)
      executar(resultado.mensagem, resultado.ok)
    })
    const bloquear = iconButton(card.bloqueado ? 'unlock' : 'lock', card.bloqueado ? 'Desbloquear card' : 'Bloquear card', () => {
      editando = card.id
      render()
    })
    const cancelar = iconButton('ban', 'Cancelar card', () => {
      const resultado = board.cancelarCard(card.id)
      executar(resultado.mensagem, resultado.ok)
    })
    return h('div', { class: 'kb-actions' }, ativo ? mover : null, bloquear, ativo ? cancelar : null)
  }

  function renderCard(card: Card, coluna: Coluna): HTMLElement {
    const editing = editando === card.id
    return h(
      'article',
      { class: `kb-card${card.bloqueado ? ' is-blocked' : ''}` },
      h(
        'header',
        {},
        h('span', { class: 'kb-id' }, `ID ${card.id}`),
        card.bloqueado ? h('span', { class: 'kb-lock' }, icon('lock', 11), 'bloqueado') : null,
        editing ? null : cardActions(card, coluna),
      ),
      h('h4', {}, card.titulo),
      card.descricao ? h('p', { class: 'kb-desc' }, card.descricao) : null,
      card.bloqueado && card.motivoBloqueio ? h('p', { class: 'kb-reason' }, `Motivo: ${card.motivoBloqueio}`) : null,
      editing ? motivoForm(card) : null,
    )
  }

  function motivoForm(card: Card): HTMLElement {
    const acao = card.bloqueado ? 'desbloqueio' : 'bloqueio'
    const input = h('input', { class: 'field', required: true, maxlength: '80', placeholder: `Motivo do ${acao}`, 'aria-label': `Motivo do ${acao}` })
    const form = h(
      'form',
      { class: 'kb-reason-form' },
      input,
      h('button', { type: 'submit', class: 'btn btn-primary btn-sm' }, 'OK'),
      h('button', { type: 'button', class: 'btn btn-ghost btn-sm', onclick: () => { editando = null; render() } }, 'Voltar'),
    )
    form.addEventListener('submit', (event) => {
      event.preventDefault()
      editando = null
      const resultado = card.bloqueado ? board.desbloquearCard(card.id, input.value) : board.bloquearCard(card.id, input.value)
      executar(resultado.mensagem, resultado.ok)
    })
    queueMicrotask(() => input.focus())
    return form
  }

  function render(): void {
    replace(
      lanes,
      ...board.colunas.map((coluna) => {
        const cards = board.cardsDaColuna(coluna.id)
        return h(
          'section',
          { class: `kb-lane tipo-${coluna.tipo}`, 'aria-label': coluna.nome },
          h('header', { class: 'kb-lane-head' }, h('span', { class: 'kb-dot' }), h('h3', {}, coluna.nome), h('span', { class: 'kb-count' }, cards.length), h('span', { class: 'kb-type' }, coluna.tipo)),
          cards.length > 0 ? h('div', { class: 'kb-cards' }, ...cards.map((card) => renderCard(card, coluna))) : h('p', { class: 'kb-empty' }, 'Sem cards'),
        )
      }),
    )
  }

  const titulo = h('input', { class: 'field', required: true, maxlength: '80', placeholder: 'Título do card', 'aria-label': 'Título do card' })
  const criar = h('form', { class: 'kb-create' }, titulo, h('button', { type: 'submit', class: 'btn btn-primary' }, icon('plus', 14), 'Criar card'))
  criar.addEventListener('submit', (event) => {
    event.preventDefault()
    executar(board.criarCard(titulo.value.trim(), ''), true)
    titulo.value = ''
  })

  const relatorio = (linhas: string[]) => linhas.forEach((linha, index) => stdout.write(linha, index === 0 ? 'cmd' : 'out'))
  const menu = h(
    'div',
    { class: 'app-actions', role: 'group', 'aria-label': 'Relatórios do BoardTarefas.java' },
    menuItem('7', 'Relatório de tempo', () => relatorio(board.gerarRelatorioTempo())),
    menuItem('8', 'Relatório de bloqueios', () => relatorio(board.gerarRelatorioBloqueios())),
  )

  const note = h('p', { class: 'app-note' }, icon('info', 14), 'JDBC não roda no navegador: o repositório é uma simulação em memória com as mesmas regras e o SQL que o PreparedStatement executaria.')

  host.append(h('div', { class: 'app kb' }, note, h('div', { class: 'app-toolbar' }, criar), lanes, menu, stdout.el))
  stdout.write('Tabelas criadas/verificadas com sucesso! (em memória)', 'muted')
  render()

  return () => undefined
}
