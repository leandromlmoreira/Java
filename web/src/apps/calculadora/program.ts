import { javaDouble as d } from '../../java/format'
import type { PrintStream, Scanner } from '../../java/scanner'

type Operacao = 'soma' | 'subtração'

export async function calculadora(out: PrintStream, scanner: Scanner): Promise<void> {
  let opcao: number

  do {
    exibirMenu(out)
    opcao = await scanner.nextInt()

    switch (opcao) {
      case 1:
        await realizarSoma(out, scanner)
        break
      case 2:
        await realizarSubtracao(out, scanner)
        break
      case 3:
        await realizarMultiplicacao(out, scanner)
        break
      case 4:
        await realizarDivisao(out, scanner)
        break
      case 5:
        await realizarPotencia(out, scanner)
        break
      case 6:
        out.println('Saindo da calculadora...')
        break
      default:
        out.println('Opção inválida! Tente novamente.')
    }
  } while (opcao !== 6)
}

function exibirMenu(out: PrintStream): void {
  out.println('\n=== CALCULADORA ===')
  out.println('1. Realizar uma soma')
  out.println('2. Realizar uma subtração')
  out.println('3. Realizar uma multiplicação')
  out.println('4. Realizar uma divisão')
  out.println('5. Elevar um número a uma potência N')
  out.println('6. Sair da calculadora')
  out.print('Escolha uma opção: ')
}

async function lerDois(out: PrintStream, scanner: Scanner, primeiro: string, segundo: string): Promise<[number, number]> {
  out.print(`Digite ${primeiro}: `)
  const num1 = await scanner.nextDouble()
  out.print(`Digite ${segundo}: `)
  const num2 = await scanner.nextDouble()
  return [num1, num2]
}

async function realizarSoma(out: PrintStream, scanner: Scanner): Promise<void> {
  const [num1, num2] = await lerDois(out, scanner, 'o primeiro número', 'o segundo número')
  const resultado = num1 + num2
  out.println(`Resultado: ${d(num1)} + ${d(num2)} = ${d(resultado)}`)
  await submenuOperacao(out, scanner, resultado, 'soma')
}

async function realizarSubtracao(out: PrintStream, scanner: Scanner): Promise<void> {
  const [num1, num2] = await lerDois(out, scanner, 'o primeiro número', 'o segundo número')
  const resultado = num1 - num2
  out.println(`Resultado: ${d(num1)} - ${d(num2)} = ${d(resultado)}`)
  await submenuOperacao(out, scanner, resultado, 'subtração')
}

async function realizarMultiplicacao(out: PrintStream, scanner: Scanner): Promise<void> {
  const [num1, num2] = await lerDois(out, scanner, 'o primeiro número', 'o segundo número')
  out.println(`Resultado: ${d(num1)} × ${d(num2)} = ${d(num1 * num2)}`)
}

async function realizarDivisao(out: PrintStream, scanner: Scanner): Promise<void> {
  const [dividendo, divisor] = await lerDois(out, scanner, 'o dividendo', 'o divisor')

  if (divisor === 0) {
    out.println('Erro: Divisão por zero não é permitida!')
    return
  }

  out.println(`Resultado: ${d(dividendo)} ÷ ${d(divisor)} = ${d(dividendo / divisor)}`)
  out.println(`Resto: ${d(dividendo % divisor)}`)
}

async function realizarPotencia(out: PrintStream, scanner: Scanner): Promise<void> {
  const [base, expoente] = await lerDois(out, scanner, 'a base', 'o expoente')
  out.println(`Resultado: ${d(base)}^${d(expoente)} = ${d(Math.pow(base, expoente))}`)
}

async function submenuOperacao(out: PrintStream, scanner: Scanner, resultadoAtual: number, tipo: Operacao): Promise<void> {
  let subOpcao: number
  let resultado = resultadoAtual

  do {
    out.println(`\n--- Submenu de ${tipo} ---`)
    out.println(`1. Informar mais números para continuar a ${tipo}`)
    out.println('2. Sair da operação')
    out.print('Escolha uma opção: ')
    subOpcao = await scanner.nextInt()

    if (subOpcao === 1) {
      out.print('Digite o próximo número: ')
      const novoNumero = await scanner.nextDouble()
      resultado = tipo === 'soma' ? resultado + novoNumero : resultado - novoNumero
      out.println(`Resultado atual: ${d(resultado)}`)
    }
  } while (subOpcao === 1)
}
