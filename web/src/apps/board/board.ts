export type TipoColuna = 'inicial' | 'pendente' | 'final' | 'cancelamento'

export interface Coluna {
  id: number
  nome: string
  ordem: number
  tipo: TipoColuna
}

export interface Card {
  id: number
  colunaId: number
  titulo: string
  descricao: string
  dataCriacao: Date
  dataMovimento: Date
  bloqueado: boolean
  motivoBloqueio: string | null
}

export interface HistoricoBloqueio {
  cardId: number
  acao: 'bloqueio' | 'desbloqueio'
  motivo: string
  dataAcao: Date
}

export interface Sql {
  text: string
  params: (string | number)[]
}

export interface Resultado {
  ok: boolean
  mensagem: string
}

const COLUNAS_PADRAO: [string, number, TipoColuna][] = [
  ['A Fazer', 1, 'inicial'],
  ['Em Andamento', 2, 'pendente'],
  ['Em Revisão', 3, 'pendente'],
  ['Concluído', 4, 'final'],
  ['Cancelado', 5, 'cancelamento'],
]

const HORA = 3_600_000

function timestamp(data: Date): string {
  const pad = (valor: number) => String(valor).padStart(2, '0')
  const dia = `${data.getFullYear()}-${pad(data.getMonth() + 1)}-${pad(data.getDate())}`
  return `${dia} ${pad(data.getHours())}:${pad(data.getMinutes())}:${pad(data.getSeconds())}.0`
}

export class BoardTarefas {
  readonly colunas: Coluna[]
  private cards: Card[] = []
  private historico: HistoricoBloqueio[] = []
  private proximoId = 1

  constructor(
    readonly nome: string,
    private readonly onSql: (sql: Sql) => void,
  ) {
    this.colunas = COLUNAS_PADRAO.map(([nomeColuna, ordem, tipo], index) => ({ id: index + 1, nome: nomeColuna, ordem, tipo }))
  }

  cardsDaColuna(colunaId: number): Card[] {
    return this.cards.filter((card) => card.colunaId === colunaId)
  }

  colunaDo(card: Card): Coluna {
    return this.colunas.find((coluna) => coluna.id === card.colunaId) as Coluna
  }

  criarCard(titulo: string, descricao: string, horasAtras = 0): string {
    const data = new Date(Date.now() - horasAtras * HORA)
    const colunaId = this.obterColuna('inicial').id
    this.sql('INSERT INTO cards (coluna_id, titulo, descricao) VALUES (?, ?, ?)', [colunaId, titulo, descricao])
    this.cards.push({
      id: this.proximoId++,
      colunaId,
      titulo,
      descricao,
      dataCriacao: data,
      dataMovimento: data,
      bloqueado: false,
      motivoBloqueio: null,
    })
    return 'Card criado com sucesso!'
  }

  moverCard(cardId: number): Resultado {
    this.sql('SELECT c.id, c.coluna_id, col.ordem, col.tipo FROM cards c JOIN colunas col ON c.coluna_id = col.id WHERE c.id = ? AND c.bloqueado = FALSE', [cardId])
    const card = this.cards.find((item) => item.id === cardId && !item.bloqueado)
    if (!card) return { ok: false, mensagem: 'Card não encontrado ou está bloqueado!' }

    const atual = this.colunaDo(card)
    if (atual.tipo === 'final') return { ok: false, mensagem: 'Card já está na coluna final!' }

    const proxima = this.colunas.find((coluna) => coluna.ordem === atual.ordem + 1)
    if (!proxima) return { ok: false, mensagem: 'Não foi possível mover o card!' }

    this.moverCardParaColuna(card, atual, proxima)
    return { ok: true, mensagem: 'Card movido com sucesso!' }
  }

  cancelarCard(cardId: number): Resultado {
    const cancelamento = this.obterColuna('cancelamento')
    this.sql('UPDATE cards SET coluna_id = ? WHERE id = ?', [cancelamento.id, cardId])
    const card = this.cards.find((item) => item.id === cardId)
    if (card) card.colunaId = cancelamento.id
    return { ok: true, mensagem: 'Card cancelado com sucesso!' }
  }

  bloquearCard(cardId: number, motivo: string): Resultado {
    this.sql('UPDATE cards SET bloqueado = TRUE, motivo_bloqueio = ? WHERE id = ?', [motivo, cardId])
    this.alterarBloqueio(cardId, true, motivo)
    return { ok: true, mensagem: 'Card bloqueado com sucesso!' }
  }

  desbloquearCard(cardId: number, motivo: string): Resultado {
    this.sql('UPDATE cards SET bloqueado = FALSE, motivo_bloqueio = NULL WHERE id = ?', [cardId])
    this.alterarBloqueio(cardId, false, motivo)
    return { ok: true, mensagem: 'Card desbloqueado com sucesso!' }
  }

  gerarRelatorioTempo(): string[] {
    this.sql("SELECT c.titulo, TIMESTAMPDIFF(HOUR, c.data_criacao, c.data_movimento) FROM cards c JOIN colunas col ON c.coluna_id = col.id WHERE col.tipo = 'final'", [])
    const concluidos = this.cards
      .filter((card) => this.colunaDo(card).tipo === 'final')
      .sort((a, b) => b.dataMovimento.getTime() - a.dataMovimento.getTime())
      .map((card) => {
        const horas = Math.floor((card.dataMovimento.getTime() - card.dataCriacao.getTime()) / HORA)
        return `• ${card.titulo} - Tempo: ${horas} horas`
      })
    return ['Tarefas concluídas:', ...concluidos]
  }

  gerarRelatorioBloqueios(): string[] {
    this.sql('SELECT c.titulo, hb.acao, hb.motivo, hb.data_acao FROM historico_bloqueios hb JOIN cards c ON hb.card_id = c.id ORDER BY hb.data_acao DESC', [])
    const linhas = [...this.historico].reverse().map((evento) => {
      const titulo = this.cards.find((card) => card.id === evento.cardId)?.titulo ?? '?'
      return `• ${titulo} - ${evento.acao} - Motivo: ${evento.motivo} - Data: ${timestamp(evento.dataAcao)}`
    })
    return ['Histórico de bloqueios:', ...linhas]
  }

  semear(titulo: string, descricao: string, destino: number, horas: number): number {
    this.criarCard(titulo, descricao, horas)
    const card = this.cards[this.cards.length - 1]
    card.colunaId = destino
    card.dataMovimento = new Date(card.dataCriacao.getTime() + Math.floor(horas / 2) * HORA)
    return card.id
  }

  private alterarBloqueio(cardId: number, bloqueado: boolean, motivo: string): void {
    const card = this.cards.find((item) => item.id === cardId)
    if (card) {
      card.bloqueado = bloqueado
      card.motivoBloqueio = bloqueado ? motivo : null
    }
    const acao = bloqueado ? 'bloqueio' : 'desbloqueio'
    this.sql(`INSERT INTO historico_bloqueios (card_id, acao, motivo) VALUES (?, '${acao}', ?)`, [cardId, motivo])
    this.historico.push({ cardId, acao, motivo, dataAcao: new Date() })
  }

  private moverCardParaColuna(card: Card, origem: Coluna, destino: Coluna): void {
    this.sql('UPDATE cards SET coluna_id = ?, data_movimento = CURRENT_TIMESTAMP WHERE id = ?', [destino.id, card.id])
    card.colunaId = destino.id
    card.dataMovimento = new Date()
    this.sql('INSERT INTO historico_movimentos (card_id, coluna_origem_id, coluna_destino_id) VALUES (?, ?, ?)', [card.id, origem.id, destino.id])
  }

  private obterColuna(tipo: TipoColuna): Coluna {
    return this.colunas.find((coluna) => coluna.tipo === tipo) as Coluna
  }

  private sql(text: string, params: (string | number)[]): void {
    this.onSql({ text, params })
  }
}
