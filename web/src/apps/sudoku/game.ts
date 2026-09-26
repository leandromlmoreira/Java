import { shuffle } from '../../java/format'

export const TAMANHO = 9

export type Dificuldade = 'Fácil' | 'Médio' | 'Difícil'

export const DIFICULDADES: Dificuldade[] = ['Fácil', 'Médio', 'Difícil']

const NUMEROS_PARA_REMOVER: Record<Dificuldade, number> = {
  Fácil: 30,
  Médio: 40,
  Difícil: 50,
}

export interface Resultado {
  ok: boolean
  mensagem: string
}

function criarMatriz<T>(valor: T): T[][] {
  return Array.from({ length: TAMANHO }, () => Array<T>(TAMANHO).fill(valor))
}

function foraDoTabuleiro(linha: number, coluna: number): boolean {
  return linha < 0 || linha >= TAMANHO || coluna < 0 || coluna >= TAMANHO
}

export class SudokuGame {
  private tabuleiro = criarMatriz(0)
  private numerosFixos = criarMatriz(false)
  private solucao = criarMatriz(0)

  constructor(private readonly random: () => number = Math.random) {}

  getTabuleiro(): readonly (readonly number[])[] {
    return this.tabuleiro
  }

  isFixo(linha: number, coluna: number): boolean {
    return this.numerosFixos[linha][coluna]
  }

  gerarNovoJogo(dificuldade: Dificuldade): void {
    this.tabuleiro = criarMatriz(0)
    this.gerarSolucao()
    this.solucao = this.tabuleiro.map((linha) => [...linha])
    this.removerNumeros(NUMEROS_PARA_REMOVER[dificuldade])
    this.numerosFixos = this.tabuleiro.map((linha) => linha.map((valor) => valor !== 0))
  }

  private gerarSolucao(posicao = 0): boolean {
    if (posicao === TAMANHO * TAMANHO) return true
    const linha = Math.floor(posicao / TAMANHO)
    const coluna = posicao % TAMANHO
    for (const numero of shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9], this.random)) {
      if (!this.podeColocarNumero(linha, coluna, numero)) continue
      this.tabuleiro[linha][coluna] = numero
      if (this.gerarSolucao(posicao + 1)) return true
      this.tabuleiro[linha][coluna] = 0
    }
    return false
  }

  private removerNumeros(quantidade: number): void {
    for (let i = 0; i < quantidade; i++) {
      let linha: number
      let coluna: number
      do {
        linha = Math.floor(this.random() * TAMANHO)
        coluna = Math.floor(this.random() * TAMANHO)
      } while (this.tabuleiro[linha][coluna] === 0)
      this.tabuleiro[linha][coluna] = 0
    }
  }

  podeColocarNumero(linha: number, coluna: number, numero: number): boolean {
    for (let j = 0; j < TAMANHO; j++) {
      if (j !== coluna && this.tabuleiro[linha][j] === numero) return false
    }

    for (let i = 0; i < TAMANHO; i++) {
      if (i !== linha && this.tabuleiro[i][coluna] === numero) return false
    }

    const quadradoLinha = Math.floor(linha / 3) * 3
    const quadradoColuna = Math.floor(coluna / 3) * 3

    for (let i = quadradoLinha; i < quadradoLinha + 3; i++) {
      for (let j = quadradoColuna; j < quadradoColuna + 3; j++) {
        if ((i !== linha || j !== coluna) && this.tabuleiro[i][j] === numero) return false
      }
    }

    return true
  }

  colocarNumero(linha: number, coluna: number, numero: number): Resultado {
    if (foraDoTabuleiro(linha, coluna)) return { ok: false, mensagem: 'Posição inválida!' }
    if (numero < 1 || numero > 9) return { ok: false, mensagem: 'Número inválido!' }
    if (this.numerosFixos[linha][coluna]) {
      return { ok: false, mensagem: 'Posição fixa! Não pode ser alterada.' }
    }
    if (this.tabuleiro[linha][coluna] !== 0) return { ok: false, mensagem: 'Posição já ocupada!' }
    if (!this.podeColocarNumero(linha, coluna, numero)) {
      return { ok: false, mensagem: 'Número não pode ser colocado nesta posição!' }
    }
    this.tabuleiro[linha][coluna] = numero
    return { ok: true, mensagem: 'Número colocado com sucesso!' }
  }

  removerNumero(linha: number, coluna: number): Resultado {
    if (foraDoTabuleiro(linha, coluna)) return { ok: false, mensagem: 'Posição inválida!' }
    if (this.numerosFixos[linha][coluna]) {
      return { ok: false, mensagem: 'Posição fixa! Não pode ser removida.' }
    }
    if (this.tabuleiro[linha][coluna] === 0) return { ok: false, mensagem: 'Posição já está vazia!' }
    this.tabuleiro[linha][coluna] = 0
    return { ok: true, mensagem: 'Número removido com sucesso!' }
  }

  verificarJogo(): string[] {
    const erros: string[] = []
    for (let i = 0; i < TAMANHO; i++) {
      for (let j = 0; j < TAMANHO; j++) {
        const numero = this.tabuleiro[i][j]
        if (numero === 0) continue
        this.tabuleiro[i][j] = 0
        if (!this.podeColocarNumero(i, j, numero)) erros.push(`Erro na posição [${i}][${j}]`)
        this.tabuleiro[i][j] = numero
      }
    }
    return erros.length > 0 ? erros : ['Jogo sem erros!']
  }

  verificarStatus(): string[] {
    const vazios = this.espacosVazios()
    const status = vazios === 0 ? 'Status: COMPLETO' : `Status: INCOMPLETO (${vazios} espaços vazios)`
    return [status, ...this.verificarJogo()]
  }

  limparTabuleiro(): string {
    for (let i = 0; i < TAMANHO; i++) {
      for (let j = 0; j < TAMANHO; j++) {
        if (!this.numerosFixos[i][j]) this.tabuleiro[i][j] = 0
      }
    }
    return 'Tabuleiro limpo! Números fixos mantidos.'
  }

  finalizarJogo(): Resultado {
    return this.isCompleto()
      ? { ok: true, mensagem: 'Parabéns! Jogo concluído com sucesso!' }
      : { ok: false, mensagem: 'Jogo incompleto! Preencha todos os espaços vazios.' }
  }

  resolver(): void {
    this.tabuleiro = this.solucao.map((linha) => [...linha])
  }

  espacosVazios(): number {
    return this.tabuleiro.flat().filter((valor) => valor === 0).length
  }

  isCompleto(): boolean {
    return this.espacosVazios() === 0
  }

  restantes(numero: number): number {
    return TAMANHO - this.tabuleiro.flat().filter((valor) => valor === numero).length
  }
}
