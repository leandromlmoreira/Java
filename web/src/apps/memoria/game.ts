import { shuffle } from '../../java/format'

export const QUANTIDADE_MINIMA = 10

export class Carta {
  virada = false
  removida = false

  constructor(
    readonly conteudo: string,
    readonly id: number,
  ) {}

  isRemovida(): boolean {
    return this.removida
  }
}

export class Colecao {
  constructor(
    readonly nome: string,
    readonly cartas: readonly Carta[],
  ) {}
}

export class Jogo {
  readonly cartasVisiveis: Carta[]
  private totalLances = 0
  private acertos = 0

  constructor(
    readonly colecao: Colecao,
    random: () => number = Math.random,
  ) {
    const cartas = colecao.cartas.map((carta) => new Carta(carta.conteudo, carta.id))
    this.cartasVisiveis = shuffle(cartas, random)
  }

  virarCartas(pos1: number, pos2: number): boolean {
    if (!this.posicaoValida(pos1) || !this.posicaoValida(pos2)) return false

    const carta1 = this.cartasVisiveis[pos1]
    const carta2 = this.cartasVisiveis[pos2]

    if (carta1.isRemovida() || carta2.isRemovida()) return false

    carta1.virada = true
    carta2.virada = true
    this.totalLances++

    if (carta1.conteudo === carta2.conteudo) {
      carta1.removida = true
      carta2.removida = true
      this.acertos++
      return true
    }
    return false
  }

  desvirar(pos1: number, pos2: number): void {
    this.cartasVisiveis[pos1].virada = false
    this.cartasVisiveis[pos2].virada = false
  }

  isJogoCompleto(): boolean {
    return this.cartasVisiveis.every((carta) => carta.removida)
  }

  getCartasRestantes(): number {
    return this.cartasVisiveis.filter((carta) => !carta.removida).length
  }

  getTotalLances(): number {
    return this.totalLances
  }

  getAcertos(): number {
    return this.acertos
  }

  getPercentualAcertos(): number {
    if (this.totalLances === 0) return 0
    return (this.acertos / this.totalLances) * 100
  }

  private posicaoValida(posicao: number): boolean {
    return posicao >= 0 && posicao < this.cartasVisiveis.length
  }
}

export function criarColecao(nome: string, conteudos: string[]): Colecao | string {
  if (conteudos.length < QUANTIDADE_MINIMA) return `Quantidade mínima é ${QUANTIDADE_MINIMA} cartas!`
  return new Colecao(nome, conteudos.map((conteudo, index) => new Carta(conteudo, index)))
}

function pares(nome: string, palavras: string[]): Colecao {
  return criarColecao(nome, palavras.flatMap((palavra) => [palavra, palavra])) as Colecao
}

export const COLECOES_PADRAO: Colecao[] = [
  pares('Palavras reservadas', ['class', 'static', 'final', 'void', 'public', 'private', 'return', 'new', 'import', 'extends']),
  pares('Cafeteria', ['espresso', 'latte', 'mocha', 'cortado', 'ristretto']),
  pares('Collections', ['List', 'Map', 'Set', 'Queue', 'Deque', 'Stream']),
]
