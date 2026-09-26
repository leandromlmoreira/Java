const TAMANHO = 9

const PUZZLE: number[][] = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9],
]

export class SudokuGame {
  private tabuleiro: number[][]
  private numerosFixos: boolean[][]

  constructor() {
    this.tabuleiro = PUZZLE.map((linha) => [...linha])
    this.numerosFixos = PUZZLE.map((linha) => linha.map((valor) => valor !== 0))
  }

  getTabuleiro(): readonly number[][] {
    return this.tabuleiro
  }

  isFixo(linha: number, coluna: number): boolean {
    return this.numerosFixos[linha][coluna]
  }

  podeColocarNumero(linha: number, coluna: number, numero: number): boolean {
    for (let j = 0; j < TAMANHO; j++) {
      if (j !== coluna && this.tabuleiro[linha][j] === numero) {
        return false
      }
    }

    for (let i = 0; i < TAMANHO; i++) {
      if (i !== linha && this.tabuleiro[i][coluna] === numero) {
        return false
      }
    }

    const quadradoLinha = Math.floor(linha / 3) * 3
    const quadradoColuna = Math.floor(coluna / 3) * 3

    for (let i = quadradoLinha; i < quadradoLinha + 3; i++) {
      for (let j = quadradoColuna; j < quadradoColuna + 3; j++) {
        if ((i !== linha || j !== coluna) && this.tabuleiro[i][j] === numero) {
          return false
        }
      }
    }

    return true
  }

  colocarNumero(linha: number, coluna: number, numero: number): boolean {
    if (this.numerosFixos[linha][coluna]) return false
    if (!this.podeColocarNumero(linha, coluna, numero)) return false
    this.tabuleiro[linha][coluna] = numero
    return true
  }

  removerNumero(linha: number, coluna: number): boolean {
    if (this.numerosFixos[linha][coluna]) return false
    this.tabuleiro[linha][coluna] = 0
    return true
  }

  limparTabuleiro(): void {
    for (let i = 0; i < TAMANHO; i++) {
      for (let j = 0; j < TAMANHO; j++) {
        if (!this.numerosFixos[i][j]) {
          this.tabuleiro[i][j] = 0
        }
      }
    }
  }

  espacosVazios(): number {
    let total = 0
    for (let i = 0; i < TAMANHO; i++) {
      for (let j = 0; j < TAMANHO; j++) {
        if (this.tabuleiro[i][j] === 0) total++
      }
    }
    return total
  }

  isCompleto(): boolean {
    return this.espacosVazios() === 0
  }
}
