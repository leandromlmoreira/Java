export interface Partida {
  colecao: string
  lances: number
  percentual: number
  segundos: number
  data: string
}

const CHAVE = 'javalab.jogo_memoria.json'
const LIMITE = 5

function ler(): Partida[] {
  try {
    const bruto = window.localStorage.getItem(CHAVE)
    const dados: unknown = bruto ? JSON.parse(bruto) : []
    return Array.isArray(dados) ? (dados as Partida[]) : []
  } catch {
    return []
  }
}

function comparar(a: Partida, b: Partida): number {
  return a.lances - b.lances || a.segundos - b.segundos
}

export function melhoresPartidas(colecao: string): Partida[] {
  return ler()
    .filter((partida) => partida.colecao === colecao)
    .sort(comparar)
    .slice(0, LIMITE)
}

export function salvarPartida(partida: Partida): void {
  const outras = ler().filter((item) => item.colecao !== partida.colecao)
  const mesmas = [...melhoresPartidas(partida.colecao), partida].sort(comparar).slice(0, LIMITE)
  try {
    window.localStorage.setItem(CHAVE, JSON.stringify([...outras, ...mesmas]))
  } catch {
    return
  }
}
