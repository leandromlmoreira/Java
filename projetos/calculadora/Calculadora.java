import java.util.Scanner;

public class Calculadora {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int opcao;
        
        do {
            exibirMenu();
            opcao = scanner.nextInt();
            
            switch (opcao) {
                case 1:
                    realizarSoma(scanner);
                    break;
                case 2:
                    realizarSubtracao(scanner);
                    break;
                case 3:
                    realizarMultiplicacao(scanner);
                    break;
                case 4:
                    realizarDivisao(scanner);
                    break;
                case 5:
                    realizarPotencia(scanner);
                    break;
                case 6:
                    System.out.println("Saindo da calculadora...");
                    break;
                default:
                    System.out.println("Opção inválida! Tente novamente.");
            }
        } while (opcao != 6);
        
        scanner.close();
    }
    
    private static void exibirMenu() {
        System.out.println("\n=== CALCULADORA ===");
        System.out.println("1. Realizar uma soma");
        System.out.println("2. Realizar uma subtração");
        System.out.println("3. Realizar uma multiplicação");
        System.out.println("4. Realizar uma divisão");
        System.out.println("5. Elevar um número a uma potência N");
        System.out.println("6. Sair da calculadora");
        System.out.print("Escolha uma opção: ");
    }
    
    private static void realizarSoma(Scanner scanner) {
        System.out.print("Digite o primeiro número: ");
        double num1 = scanner.nextDouble();
        System.out.print("Digite o segundo número: ");
        double num2 = scanner.nextDouble();
        
        double resultado = num1 + num2;
        System.out.println("Resultado: " + num1 + " + " + num2 + " = " + resultado);
        
        submenuOperacao(scanner, resultado, "soma");
    }
    
    private static void realizarSubtracao(Scanner scanner) {
        System.out.print("Digite o primeiro número: ");
        double num1 = scanner.nextDouble();
        System.out.print("Digite o segundo número: ");
        double num2 = scanner.nextDouble();
        
        double resultado = num1 - num2;
        System.out.println("Resultado: " + num1 + " - " + num2 + " = " + resultado);
        
        submenuOperacao(scanner, resultado, "subtração");
    }
    
    private static void realizarMultiplicacao(Scanner scanner) {
        System.out.print("Digite o primeiro número: ");
        double num1 = scanner.nextDouble();
        System.out.print("Digite o segundo número: ");
        double num2 = scanner.nextDouble();
        
        double resultado = num1 * num2;
        System.out.println("Resultado: " + num1 + " × " + num2 + " = " + resultado);
    }
    
    private static void realizarDivisao(Scanner scanner) {
        System.out.print("Digite o dividendo: ");
        double dividendo = scanner.nextDouble();
        System.out.print("Digite o divisor: ");
        double divisor = scanner.nextDouble();
        
        if (divisor == 0) {
            System.out.println("Erro: Divisão por zero não é permitida!");
            return;
        }
        
        double quociente = dividendo / divisor;
        double resto = dividendo % divisor;
        
        System.out.println("Resultado: " + dividendo + " ÷ " + divisor + " = " + quociente);
        System.out.println("Resto: " + resto);
    }
    
    private static void realizarPotencia(Scanner scanner) {
        System.out.print("Digite a base: ");
        double base = scanner.nextDouble();
        System.out.print("Digite o expoente: ");
        double expoente = scanner.nextDouble();
        
        double resultado = Math.pow(base, expoente);
        System.out.println("Resultado: " + base + "^" + expoente + " = " + resultado);
    }
    
    private static void submenuOperacao(Scanner scanner, double resultadoAtual, String tipoOperacao) {
        int subOpcao;
        double resultado = resultadoAtual;
        
        do {
            System.out.println("\n--- Submenu de " + tipoOperacao + " ---");
            System.out.println("1. Informar mais números para continuar a " + tipoOperacao);
            System.out.println("2. Sair da operação");
            System.out.print("Escolha uma opção: ");
            subOpcao = scanner.nextInt();
            
            if (subOpcao == 1) {
                System.out.print("Digite o próximo número: ");
                double novoNumero = scanner.nextDouble();
                
                if (tipoOperacao.equals("soma")) {
                    resultado += novoNumero;
                    System.out.println("Resultado atual: " + resultado);
                } else if (tipoOperacao.equals("subtração")) {
                    resultado -= novoNumero;
                    System.out.println("Resultado atual: " + resultado);
                }
            }
        } while (subOpcao == 1);
    }
}
