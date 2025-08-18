import java.util.Scanner;

public class Exercicio2 {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int opcao;
        
        do {
            System.out.println("\n=== ESTRUTURAS DE CONTROLE ===");
            System.out.println("1. Tabuada de 1 até 10");
            System.out.println("2. Cálculo de IMC");
            System.out.println("3. Números pares ou ímpares em intervalo");
            System.out.println("4. Divisão com resto");
            System.out.println("5. Sair");
            System.out.print("Escolha uma opção: ");
            opcao = scanner.nextInt();
            
            switch (opcao) {
                case 1:
                    calcularTabuada(scanner);
                    break;
                case 2:
                    calcularIMC(scanner);
                    break;
                case 3:
                    numerosParImpar(scanner);
                    break;
                case 4:
                    divisaoComResto(scanner);
                    break;
                case 5:
                    System.out.println("Saindo...");
                    break;
                default:
                    System.out.println("Opção inválida!");
            }
        } while (opcao != 5);
        
        scanner.close();
    }
    
    private static void calcularTabuada(Scanner scanner) {
        System.out.println("\n--- TABUADA ---");
        
        System.out.print("Digite um número para gerar a tabuada: ");
        int numero = scanner.nextInt();
        
        System.out.println("Tabuada do " + numero + ":");
        for (int i = 1; i <= 10; i++) {
            System.out.println(numero + " x " + i + " = " + (numero * i));
        }
    }
    
    private static void calcularIMC(Scanner scanner) {
        System.out.println("\n--- CÁLCULO DE IMC ---");
        
        System.out.print("Digite sua altura (em metros): ");
        double altura = scanner.nextDouble();
        
        System.out.print("Digite seu peso (em kg): ");
        double peso = scanner.nextDouble();
        
        double imc = peso / (altura * altura);
        
        System.out.println("Seu IMC é: " + String.format("%.2f", imc));
        
        if (imc <= 18.5) {
            System.out.println("Classificação: Abaixo do peso");
        } else if (imc <= 24.9) {
            System.out.println("Classificação: Peso ideal");
        } else if (imc <= 29.9) {
            System.out.println("Classificação: Levemente acima do peso");
        } else if (imc <= 34.9) {
            System.out.println("Classificação: Obesidade Grau I");
        } else if (imc <= 39.9) {
            System.out.println("Classificação: Obesidade Grau II (Severa)");
        } else {
            System.out.println("Classificação: Obesidade III (Mórbida)");
        }
    }
    
    private static void numerosParImpar(Scanner scanner) {
        System.out.println("\n--- NÚMEROS PARES OU ÍMPARES EM INTERVALO ---");
        
        System.out.print("Digite o primeiro número: ");
        int num1 = scanner.nextInt();
        
        System.out.print("Digite o segundo número (maior que o primeiro): ");
        int num2 = scanner.nextInt();
        
        if (num2 <= num1) {
            System.out.println("Erro: O segundo número deve ser maior que o primeiro!");
            return;
        }
        
        System.out.print("Escolha (1) para pares ou (2) para ímpares: ");
        int escolha = scanner.nextInt();
        
        if (escolha != 1 && escolha != 2) {
            System.out.println("Escolha inválida!");
            return;
        }
        
        String tipo = (escolha == 1) ? "PARES" : "ÍMPARES";
        System.out.println("Números " + tipo + " no intervalo [" + num1 + ", " + num2 + "] em ordem decrescente:");
        
        for (int i = num2; i >= num1; i--) {
            if (escolha == 1 && i % 2 == 0) {
                System.out.print(i + " ");
            } else if (escolha == 2 && i % 2 != 0) {
                System.out.print(i + " ");
            }
        }
        System.out.println();
    }
    
    private static void divisaoComResto(Scanner scanner) {
        System.out.println("\n--- DIVISÃO COM RESTO ---");
        
        System.out.print("Digite o número inicial: ");
        int numeroInicial = scanner.nextInt();
        
        System.out.println("Digite outros números. O programa continuará até que um número");
        System.out.println("dividido pelo primeiro tenha resto diferente de 0.");
        System.out.println("Números menores que o primeiro serão ignorados.");
        
        while (true) {
            System.out.print("Digite um número: ");
            int numero = scanner.nextInt();
            
            if (numero < numeroInicial) {
                System.out.println("Número ignorado (menor que o primeiro)");
                continue;
            }
            
            if (numero % numeroInicial != 0) {
                System.out.println("Número " + numero + " dividido por " + numeroInicial + " tem resto " + (numero % numeroInicial) + " (diferente de 0)");
                System.out.println("Programa finalizado!");
                break;
            } else {
                System.out.println("Número " + numero + " dividido por " + numeroInicial + " tem resto 0. Continuando...");
            }
        }
    }
}
